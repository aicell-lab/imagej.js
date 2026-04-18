package com.hack.ij;

import java.io.Serializable;

/**
 * Opt-in Serializable slice-runner for ImageJ-style parallel stack ops.
 * Plugin authors that want their stack-filter to parallelize through the
 * worker pool can wrap each slice-range in a SliceAdapter and submit them
 * via ExecutorHook.newFixedThreadPool(n) (or a rewritten
 * Executors.newFixedThreadPool).
 *
 * Why this instead of PlugInFilterRunner.PARALLELIZE_STACKS?
 *   ij.plugin.filter.PlugInFilterRunner is its own Runnable (`this`), and
 *   its fields include GenericDialog, Thread, Hashtable<Thread,…> — none of
 *   which serialize. Auto-parallelizing PARALLELIZE_STACKS without patching
 *   ij.jar is not safe. This adapter is the recommended opt-in path.
 *
 * Use pattern:
 *   byte[] pixels = (byte[]) srcImage.getProcessor().getPixels();
 *   int w = srcImage.getWidth(), h = srcImage.getHeight();
 *   int n = Prefs.getThreads();
 *   ExecutorService ex = Executors.newFixedThreadPool(n);  // rewritten → worker pool
 *   List<Future<byte[]>> futures = new ArrayList<>();
 *   for (int sl = 1; sl <= stack.getSize(); sl++) {
 *       byte[] slicePixels = ...;  // extract
 *       futures.add(ex.submit(new SliceAdapter(slicePixels, w, h, "gaussian", sigma)));
 *   }
 *   for (int i = 0; i < futures.size(); i++) {
 *       byte[] processed = futures.get(i).get();
 *       stack.setPixels(processed, i + 1);
 *   }
 *
 * The implementation of `process()` is plugin-specific. Subclass or write
 * a cooperative-style variant that doesn't use this wrapper.
 */
public abstract class SliceAdapter implements java.util.concurrent.Callable<byte[]>, Serializable {
    private static final long serialVersionUID = 1L;

    public final byte[] pixels;
    public final int width;
    public final int height;
    public final String op;    // operation name, for dispatch inside process()
    public final double arg;   // one scalar parameter (sigma, threshold, etc.)

    protected SliceAdapter(byte[] pixels, int width, int height, String op, double arg) {
        this.pixels = pixels;
        this.width  = width;
        this.height = height;
        this.op     = op;
        this.arg    = arg;
    }

    /** Must return a new (or in-place mutated) byte[] of length width*height. */
    protected abstract byte[] process(byte[] in, int w, int h, String op, double arg);

    @Override
    public byte[] call() throws Exception {
        return process(pixels, width, height, op, arg);
    }
}
