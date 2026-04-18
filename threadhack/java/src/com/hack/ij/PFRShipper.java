package com.hack.ij;

import com.hack.ExecutorHook;
import com.hack.ThreadHook;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Special-case path for `ij.plugin.filter.PlugInFilterRunner` — when its
 * spawned-worker Thread.start is intercepted, we extract exactly the state
 * the worker needs (filter, slice indices, pixel bytes, dimensions) and
 * ship a clean {@link PFRSliceTask} instead of trying to serialize the PFR
 * itself (which has thread-specific state that can't deserialize usefully).
 *
 * Invoked from {@link ThreadHook#start(Thread)} when the Runnable target is
 * recognized as a PlugInFilterRunner.
 */
public final class PFRShipper {
    private PFRShipper() {}

    public static volatile int shippedThreads = 0;
    public static volatile int failedThreads  = 0;

    /** Tracks shipped work per main-side Thread so .join can merge results back */
    private static class Pending {
        java.util.List<Future<?>> futures = new java.util.ArrayList<>();
        java.util.List<PFRSliceTask> tasks = new java.util.ArrayList<>();
        Object imp;
        int bitDepth;
    }
    private static final Map<Thread, Pending> pendingByThread = new HashMap<>();

    /**
     * Returns true if we successfully extracted + shipped the PFR's slice work
     * for this thread. Caller should NOT call thread.start() in that case.
     * Returns false on any failure → caller falls through to normal cooperative.
     */
    public static boolean shipPFRSlice(Thread thread, Object pfr) {
        try {
            if (!"ij.plugin.filter.PlugInFilterRunner".equals(pfr.getClass().getName())) return false;

            Field sftF = pfr.getClass().getDeclaredField("slicesForThread");
            sftF.setAccessible(true);
            Object sft = sftF.get(pfr);
            if (!(sft instanceof Hashtable)) return false;
            @SuppressWarnings("unchecked")
            Hashtable<Thread, int[]> sliceMap = (Hashtable<Thread, int[]>) sft;
            int[] range = sliceMap.get(thread);
            if (range == null || range.length < 2) return false;

            Field filterF = pfr.getClass().getDeclaredField("theFilter");
            filterF.setAccessible(true);
            Object filter = filterF.get(pfr);
            if (!(filter instanceof Serializable)) return false;

            Field impF = pfr.getClass().getDeclaredField("imp");
            impF.setAccessible(true);
            Object imp = impF.get(pfr);
            if (imp == null) return false;

            Class<?> impCls = imp.getClass();
            int w        = (Integer) impCls.getMethod("getWidth").invoke(imp);
            int h        = (Integer) impCls.getMethod("getHeight").invoke(imp);
            int bitDepth = (Integer) impCls.getMethod("getBitDepth").invoke(imp);

            Object stack    = impCls.getMethod("getStack").invoke(imp);
            Class<?> stackC = stack.getClass();
            Method getPixels = stackC.getMethod("getPixels", int.class);

            int startSlice = range[0], endSlice = range[1];
            if (startSlice < 1) startSlice = 1;
            if (endSlice < startSlice) return false;

            if (!ThreadHook.nativeWorkerAvailable()) return false;

            // Build one task per slice so we can max-parallelize
            ExecutorService ex = ExecutorHook.newFixedThreadPool(Math.min(endSlice - startSlice + 1, 8));
            Pending p = new Pending();
            p.imp = imp;
            p.bitDepth = bitDepth;
            for (int s = startSlice; s <= endSlice; s++) {
                Object pix = getPixels.invoke(stack, s);
                byte[] bytes = toByteArray(pix, bitDepth);
                if (bytes == null) { ex.shutdown(); return false; }
                PFRSliceTask task = new PFRSliceTask(filter, bytes, w, h, bitDepth, s);
                p.tasks.add(task);
                p.futures.add(ex.submit((Runnable) task));
            }
            ex.shutdown();

            synchronized (pendingByThread) { pendingByThread.put(thread, p); }
            shippedThreads++;
            System.out.println("[PFRShipper] shipped " + p.tasks.size() + " slices for thread "
                    + thread.getName() + " (slices " + startSlice + ".." + endSlice + ")");
            return true;
        } catch (Throwable t) {
            failedThreads++;
            System.out.println("[PFRShipper] ship failed: " + t);
            return false;
        }
    }

    /**
     * Called from ThreadHook.join when the thread was previously shipped.
     * Returns true if the thread had shipped work (and we awaited it);
     * false if no record of this thread → caller should fall through to thread.join().
     */
    public static boolean joinShippedSlices(Thread thread) {
        Pending p;
        synchronized (pendingByThread) { p = pendingByThread.remove(thread); }
        if (p == null) return false;
        try {
            for (Future<?> f : p.futures) f.get();

            // Merge processed pixels back into the ImagePlus stack
            Object imp = p.imp;
            Class<?> impCls = imp.getClass();
            Object stack = impCls.getMethod("getStack").invoke(imp);
            Method setPixels = stack.getClass().getMethod("setPixels", Object.class, int.class);

            int merged = 0;
            for (PFRSliceTask task : p.tasks) {
                if (task.exception != null) {
                    System.out.println("[PFRShipper] slice " + task.sliceNumber + " failed: " + task.exception);
                    continue;
                }
                if (task.pixelsOut == null) continue;
                Object pix = fromByteArray(task.pixelsOut, p.bitDepth, task.w, task.h);
                setPixels.invoke(stack, pix, task.sliceNumber);
                merged++;
            }
            System.out.println("[PFRShipper] merged " + merged + "/" + p.tasks.size() + " slices for thread " + thread.getName());
            return true;
        } catch (Throwable t) {
            System.out.println("[PFRShipper] join failed: " + t);
            return true;  // we still "handled" the join (don't let Thread.join fall through to real join)
        }
    }

    private static Object fromByteArray(byte[] bytes, int bitDepth, int w, int h) {
        if (bitDepth == 8) return bytes;
        if (bitDepth == 16) {
            short[] out = new short[w * h];
            java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap(bytes).order(java.nio.ByteOrder.LITTLE_ENDIAN);
            for (int i = 0; i < out.length; i++) out[i] = bb.getShort();
            return out;
        }
        return bytes;  // best effort
    }

    private static byte[] toByteArray(Object pix, int bitDepth) {
        if (pix instanceof byte[]) return (byte[]) pix;
        if (pix instanceof short[]) {
            short[] sa = (short[]) pix;
            byte[] out = new byte[sa.length * 2];
            java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap(out).order(java.nio.ByteOrder.LITTLE_ENDIAN);
            for (short s : sa) bb.putShort(s);
            return out;
        }
        return null;
    }
}
