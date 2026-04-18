package com.hack.ij;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * PlugInFilterRunner auto-patch dispatcher.
 *
 * <p>The ASM pre-pass rewrites the body of
 * {@code ij.plugin.filter.PlugInFilterRunner.processImageUsingThreads(ImageProcessor,
 * FloatProcessor, Object)} to a single invocation of this static method. The
 * original body spawned {@code n-1} {@code Thread(this, name)} instances and
 * joined them; we replace it with a controlled dispatcher.
 *
 * <p><b>Phase A (this file):</b> mirrors the single-thread fast path —
 * invokes {@code processStack(1, nSlices)} via reflection. Gives pixel-exact
 * match with the original for every filter. Validates the ASM rewrite
 * mechanism without introducing parallelism risk.
 *
 * <p><b>Phase B (TODO):</b> split slice range across N {@code PFRSliceTask}s
 * submitted to {@link com.hack.ExecutorHook#newFixedThreadPool(int)}. Ships
 * Serializable tasks to the worker pool, collects results, reassembles into
 * the ImagePlus stack.
 */
public final class PFRParallelRunner {
    private PFRParallelRunner() {}

    public static volatile int dispatchCount = 0;
    public static volatile int shippedCount  = 0;
    public static volatile int fallbackCount = 0;
    public static volatile boolean enabled   = true;   // global kill-switch

    /**
     * Phase B is experimental — enabled only when pfrPhaseB flag is set AND
     * the filter is Serializable. Otherwise falls back to Phase A serial mirror.
     */
    public static boolean pfrPhaseB = true;   // ENABLED — with Serializable injection + ij.jar on worker classpath

    /** Signature matches rewrite target. First arg is the PFR `this`. */
    public static void dispatch(Object pfr, Object ip, Object fp, Object prevBuffer) {
        dispatchCount++;
        System.out.println("[PFRParallelRunner.dispatch#" + dispatchCount + "] phaseB=" + pfrPhaseB);
        if (!enabled) {
            serialMirror(pfr);
            fallbackCount++;
            return;
        }
        if (pfrPhaseB) {
            try {
                if (tryParallelDispatch(pfr)) { shippedCount++; return; }
            } catch (Throwable t) {
                System.out.println("[PFRParallelRunner] Phase-B parallel path failed, falling back: " + t);
            }
        }
        serialMirror(pfr);
        fallbackCount++;
    }

    /**
     * Phase B experimental parallel dispatch. Returns true if successfully
     * dispatched + completed via worker pool; false if not applicable
     * (non-Serializable filter, etc.) — caller will fall back to serial.
     */
    private static boolean tryParallelDispatch(Object pfr) throws Exception {
        System.out.println("[PFRParallelRunner.tryParallel] start");
        // Extract filter + ImagePlus
        Field filterF = pfr.getClass().getDeclaredField("theFilter");
        filterF.setAccessible(true);
        Object filter = filterF.get(pfr);
        if (!(filter instanceof java.io.Serializable)) {
            // Phase C would inject Serializable via ASM; for now, bail.
            return false;
        }

        Field impF = pfr.getClass().getDeclaredField("imp");
        impF.setAccessible(true);
        Object imp = impF.get(pfr);
        if (imp == null) return false;

        Class<?> impClass = imp.getClass();
        int nSlices = (Integer) impClass.getMethod("getImageStackSize").invoke(imp);
        int bitDepth = (Integer) impClass.getMethod("getBitDepth").invoke(imp);
        int w = (Integer) impClass.getMethod("getWidth").invoke(imp);
        int h = (Integer) impClass.getMethod("getHeight").invoke(imp);

        if (nSlices < 2) return false;  // not worth parallelizing

        int nThreads = Math.min(nSlices, 6);  // TODO: Prefs.getThreads()

        // Snapshot each slice's pixels
        Method getStack = impClass.getMethod("getStack");
        Object stack = getStack.invoke(imp);
        Class<?> stackClass = stack.getClass();
        Method stackGetPixels = stackClass.getMethod("getPixels", int.class);
        Method stackSetPixels = stackClass.getMethod("setPixels", Object.class, int.class);

        // Build tasks
        java.util.List<PFRSliceTask> tasks = new java.util.ArrayList<>();
        for (int s = 1; s <= nSlices; s++) {
            Object pix = stackGetPixels.invoke(stack, s);
            byte[] bytes = toByteArray(pix, bitDepth);
            tasks.add(new PFRSliceTask(filter, bytes, w, h, bitDepth, s));
        }

        // Submit to our ExecutorHook-backed pool (which uses worker JVMs for serializable tasks)
        java.util.concurrent.ExecutorService ex =
                com.hack.ExecutorHook.newFixedThreadPool(nThreads);
        java.util.List<java.util.concurrent.Future<?>> futs = new java.util.ArrayList<>();
        for (PFRSliceTask t : tasks) futs.add(ex.submit((Runnable) t));
        for (java.util.concurrent.Future<?> f : futs) f.get();
        ex.shutdown();

        // Merge results back
        for (PFRSliceTask t : tasks) {
            if (t.exception != null) throw new Exception("slice " + t.sliceNumber + " failed: " + t.exception);
            if (t.pixelsOut == null) continue;
            Object outPix = fromByteArray(t.pixelsOut, bitDepth, w, h);
            stackSetPixels.invoke(stack, outPix, t.sliceNumber);
        }
        return true;
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
        throw new UnsupportedOperationException("pixel type " + pix.getClass() + " not supported");
    }
    private static Object fromByteArray(byte[] bytes, int bitDepth, int w, int h) {
        if (bitDepth == 8) return bytes;
        if (bitDepth == 16) {
            short[] out = new short[w * h];
            java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap(bytes).order(java.nio.ByteOrder.LITTLE_ENDIAN);
            for (int i = 0; i < out.length; i++) out[i] = bb.getShort();
            return out;
        }
        throw new UnsupportedOperationException("bitDepth " + bitDepth);
    }

    /** Reflection-based serial dispatch identical to the 1-thread path of the original. */
    private static void serialMirror(Object pfr) {
        try {
            Field impF = pfr.getClass().getDeclaredField("imp");
            impF.setAccessible(true);
            Object imp = impF.get(pfr);
            if (imp == null) { return; }

            Method getStackSize = imp.getClass().getMethod("getImageStackSize");
            int nSlices = ((Integer) getStackSize.invoke(imp)).intValue();
            if (nSlices < 1) nSlices = 1;

            Method processStack = pfr.getClass().getDeclaredMethod("processStack", int.class, int.class);
            processStack.setAccessible(true);
            processStack.invoke(pfr, 1, nSlices);
        } catch (Throwable t) {
            // Fall through silently — caller would have failed the same way,
            // and crashing during filter dispatch is strictly worse than doing nothing.
            System.out.println("[PFRParallelRunner] serial mirror failed: " + t);
            throw new RuntimeException(t);
        }
    }

    public static int getDispatchCount()  { return dispatchCount; }
    public static int getShippedCount()   { return shippedCount; }
    public static int getFallbackCount()  { return fallbackCount; }
    public static void resetCounts()      { dispatchCount = shippedCount = fallbackCount = 0; }
    public static void setEnabled(boolean v) { enabled = v; }
}
