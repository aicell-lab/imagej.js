package com.hack;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * Replacement targets for rewritten Thread.* invocations.
 *
 * Stage 2 logic:
 *   - Thread.start():
 *     - if target Runnable is Serializable AND a JS-side worker pool is
 *       available, serialize + native dispatch to worker. Do NOT start the
 *       local thread.
 *     - else call real t.start() (cooperative fallback).
 *   - Thread.join():
 *     - if previously shipped: await the worker's result bytes via native,
 *       deserialize, reflect-copy mutated fields back onto the original
 *       Runnable so caller sees them.
 *     - else call real t.join().
 */
public final class ThreadHook {
    private ThreadHook() {}

    public static volatile int startCount = 0;
    public static volatile int joinCount = 0;
    public static volatile int shippedCount = 0;
    public static volatile int fallbackCount = 0;

    /** handle id issued by JS native, per shipped thread */
    private static final Map<Thread, Long> shipped = new HashMap<>();
    /** the original Runnable whose fields get mutated on return */
    private static final Map<Thread, Runnable> shippedRunnable = new HashMap<>();

    // Natives implemented by cheerpjInit({natives:{...}}) in JS
    public static native long nativeDispatch(byte[] bytes, String runnableClassName);
    public static native byte[] nativeAwait(long handle);
    public static native boolean nativeWorkerAvailable();

    // ---- reusable shipping primitives (used by ExecutorHook too) ----

    /**
     * Serialize a Serializable task and hand it to a worker. Returns the handle
     * that awaitAndMerge / awaitResult can use to get the result back.
     * Throws NotSerializableException if the task can't be serialized.
     */
    public static long shipForExecution(Object task) throws Exception {
        if (!(task instanceof Serializable)) throw new java.io.NotSerializableException(task.getClass().getName());
        if (!nativeWorkerAvailable()) throw new IllegalStateException("no worker pool");
        byte[] bytes = serialize(task);
        return nativeDispatch(bytes, task.getClass().getName());
    }

    /** Fetch raw bytes from worker. Blocks. */
    public static byte[] awaitResult(long handle) {
        return nativeAwait(handle);
    }

    /**
     * Await completion, then merge mutated fields from the worker-side copy
     * back into the original task. Returns the deserialized worker-side object
     * (same class as orig). Uses orig's classloader so ObjectInputStream can
     * resolve classes loaded via ParallelClassLoader.
     */
    public static Object awaitAndMerge(long handle, Object orig) throws Exception {
        byte[] resultBytes = nativeAwait(handle);
        if (resultBytes == null || resultBytes.length == 0) return null;
        ClassLoader loader = orig != null ? orig.getClass().getClassLoader()
                : Thread.currentThread().getContextClassLoader();
        Object updated = deserializeWithLoader(resultBytes, loader);
        if (orig != null) copyInstanceFields(orig, updated);
        return updated;
    }

    public static byte[] serializeForShip(Object obj) throws Exception { return serialize(obj); }
    public static Object deserializeForReturn(byte[] bytes, ClassLoader cl) throws Exception {
        return deserializeWithLoader(bytes, cl);
    }

    public static int getStartCount()    { return startCount; }
    public static int getJoinCount()     { return joinCount; }
    public static int getShippedCount()  { return shippedCount; }
    public static int getFallbackCount() { return fallbackCount; }
    public static void resetCounts()     { startCount = joinCount = shippedCount = fallbackCount = 0; }

    /**
     * Whether a Runnable is safe to ship to a worker JVM. Workers run
     * java.awt.headless=true and have their own isolated class state, so
     * anything that needs to open a UI dialog, register listeners on the
     * main AWT frames, or mutate main-JVM statics must stay local.
     *
     * Worker JVMs are a *compute* substrate, not an event-dispatch
     * substrate. The short list of classes we WANT parallelised (e.g.
     * ij.plugin.filter.PlugInFilterRunner slice tasks, bench runnables) is
     * already handled above. Everything else falls through to local
     * Thread.start() so stock ImageJ semantics are preserved.
     */
    static boolean shouldShip(Object target) {
        if (target == null) return false;
        String cls = target.getClass().getName();
        // ImageJ menu-command runner — opens dialogs, must be local.
        if (cls.equals("ij.Executer")) return false;
        // Any ImageJ UI class.
        if (cls.startsWith("ij.gui.")) return false;
        if (cls.startsWith("ij.plugin.frame.")) return false;
        // Drag-and-drop + I/O opens JFileChoosers etc.
        if (cls.equals("ij.plugin.DragAndDrop")) return false;
        if (cls.startsWith("ij.io.")) return false;
        // Macro interpreter runs IJ commands that may open UI.
        if (cls.startsWith("ij.macro.")) return false;
        return true;
    }

    public static void start(Thread thread) {
        int n = ++startCount;
        Runnable target = getTarget(thread);
        boolean serializable = target instanceof Serializable;
        boolean pool;
        try { pool = nativeWorkerAvailable(); } catch (Throwable t) { pool = false; }

        System.out.println("[ThreadHook.start #" + n + "] target="
                + safeName(thread) + " runnable=" + runnableType(target)
                + " serializable=" + serializable + " poolReady=" + pool);

        // Special case: ij.Executer wraps every menu command (File>Open,
        // Process>..., etc.) in `new Thread(this).start()`. Under CheerpJ's
        // cooperative threading, when Executer.run() reaches
        // EventQueue.invokeAndWait (used by OpenDialog.jOpen to show the
        // JFileChooser), the calling thread blocks waiting for EDT — but
        // the JVM is effectively single-threaded, so the EDT task never
        // runs. Dialog never appears. Fix: run Executer synchronously on
        // the caller (which IS already the EDT for a menu click) so
        // OpenDialog sees isDispatchThread()=true and shows the JFileChooser
        // inline. Menu commands feel the same to the user.
        if (target != null
                && "ij.Executer".equals(target.getClass().getName())) {
            try {
                target.run();
            } catch (Throwable t) {
                System.out.println("[ThreadHook] Executer.run threw: " + t);
            }
            return;
        }

        // Special case: PlugInFilterRunner — extract + ship per-slice tasks instead
        // of trying to serialize the PFR itself.
        if (target != null && pool
                && "ij.plugin.filter.PlugInFilterRunner".equals(target.getClass().getName())) {
            try {
                if (com.hack.ij.PFRShipper.shipPFRSlice(thread, target)) {
                    shippedCount++;
                    // Track so join knows this is PFR-shipped
                    shipped.put(thread, -1L);   // sentinel: handled by PFRShipper
                    shippedRunnable.put(thread, target);
                    return;
                }
            } catch (Throwable e) {
                System.out.println("  -> PFRShipper threw: " + e);
            }
        }

        if (serializable && pool && shouldShip(target)) {
            try {
                byte[] bytes = serialize(target);
                long handle = nativeDispatch(bytes, target.getClass().getName());
                shipped.put(thread, handle);
                shippedRunnable.put(thread, target);
                shippedCount++;
                System.out.println("  -> SHIPPED (handle=" + handle + ", " + bytes.length + " bytes)");
                return;  // do NOT actually start the local Thread
            } catch (Throwable t) {
                System.out.println("  -> serialization/dispatch failed, falling back: " + t);
            }
        }
        fallbackCount++;
        thread.start();
    }

    public static void join(Thread thread) throws InterruptedException {
        joinCount++;
        Long handle = shipped.remove(thread);
        if (handle != null && handle.longValue() == -1L) {
            // PFRShipper-handled: delegate
            shippedRunnable.remove(thread);
            com.hack.ij.PFRShipper.joinShippedSlices(thread);
            return;
        }
        if (handle != null) {
            Runnable orig = shippedRunnable.remove(thread);
            System.out.println("[ThreadHook.join] awaiting worker result for handle=" + handle);
            try {
                byte[] resultBytes = nativeAwait(handle);
                if (resultBytes != null && resultBytes.length > 0) {
                    // Use the ORIGINAL Runnable's classloader so ObjectInputStream
                    // can resolve its class (which was loaded by ParallelClassLoader)
                    ClassLoader loader = orig != null ? orig.getClass().getClassLoader()
                            : Thread.currentThread().getContextClassLoader();
                    Object updated = deserializeWithLoader(resultBytes, loader);
                    copyInstanceFields(orig, updated);
                    System.out.println("  -> merged " + resultBytes.length + " bytes back into " + orig.getClass().getSimpleName());
                }
            } catch (Throwable t) {
                System.out.println("  -> awaitWorker failed: " + t);
                throw new InterruptedException("worker await failed: " + t);
            }
            return;
        }
        thread.join();
    }

    public static void join(Thread thread, long millis) throws InterruptedException {
        // Simplified: ignore timeout for shipped threads (always full await)
        if (shipped.containsKey(thread)) { join(thread); return; }
        thread.join(millis);
    }

    public static void join(Thread thread, long millis, int nanos) throws InterruptedException {
        if (shipped.containsKey(thread)) { join(thread); return; }
        thread.join(millis, nanos);
    }

    public static boolean isAlive(Thread thread) {
        if (shipped.containsKey(thread)) return true;  // worker still running
        return thread.isAlive();
    }

    public static void interrupt(Thread thread) { thread.interrupt(); }

    // --- helpers ---

    private static byte[] serialize(Object obj) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream(1024);
        try (ObjectOutputStream oos = new LenientObjectOutputStream(baos)) { oos.writeObject(obj); }
        return baos.toByteArray();
    }

    /**
     * ObjectOutputStream that replaces any non-Serializable object in the graph
     * with null instead of throwing NotSerializableException. The worker-side
     * deserialization gets the runnable with null in those fields — safe as long
     * as the task's run() doesn't dereference them (most compute tasks don't).
     */
    static class LenientObjectOutputStream extends ObjectOutputStream {
        LenientObjectOutputStream(java.io.OutputStream out) throws java.io.IOException {
            super(out);
            enableReplaceObject(true);
        }
        @Override
        protected Object replaceObject(Object obj) {
            if (obj == null) return null;
            if (obj instanceof Serializable) return obj;
            // Non-Serializable object in the graph — substitute null
            return null;
        }
    }

    static Object deserializeWithLoader(byte[] bytes, final ClassLoader loader) throws Exception {
        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bytes)) {
            @Override
            protected Class<?> resolveClass(java.io.ObjectStreamClass desc)
                    throws java.io.IOException, ClassNotFoundException {
                try {
                    return Class.forName(desc.getName(), false, loader);
                } catch (ClassNotFoundException e) {
                    return super.resolveClass(desc);
                }
            }
        };
        try { return ois.readObject(); } finally { ois.close(); }
    }

    /** Copy all non-static, non-final fields of same-class objects. */
    static void copyInstanceFields(Object dst, Object src) throws Exception {
        Class<?> c = src.getClass();
        while (c != null && c != Object.class) {
            for (Field f : c.getDeclaredFields()) {
                int mods = f.getModifiers();
                if (java.lang.reflect.Modifier.isStatic(mods)) continue;
                if (java.lang.reflect.Modifier.isFinal(mods)) continue;
                f.setAccessible(true);
                f.set(dst, f.get(src));
            }
            c = c.getSuperclass();
        }
    }

    private static String safeName(Thread t) {
        try { return t == null ? "null" : t.getName(); } catch (Throwable e) { return "?"; }
    }

    private static Runnable getTarget(Thread t) {
        try {
            Field f = Thread.class.getDeclaredField("target");
            f.setAccessible(true);
            Object r = f.get(t);
            return (r instanceof Runnable) ? (Runnable) r : null;
        } catch (Throwable e) {
            return null;
        }
    }

    private static String runnableType(Runnable r) {
        return r == null ? "null" : r.getClass().getName();
    }
}
