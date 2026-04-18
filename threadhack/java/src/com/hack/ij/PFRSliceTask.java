package com.hack.ij;

import java.io.Serializable;

/**
 * Serializable slice task for PFR Phase B.
 *
 * Holds one slice's worth of pixels + the filter to apply. Worker-side
 * {@link #run()} reconstructs an {@link ij.process.ImageProcessor}, runs
 * the filter, and stores the processed pixels back in {@link #pixelsOut}.
 *
 * Requirements for this task to ship successfully:
 *   - The filter instance must implement {@link Serializable} (most
 *     built-in ImageJ filters don't — Phase C would inject it via ASM).
 *   - All filter fields must be Serializable or transient.
 *   - Workers must have ij.jar on their classpath (PFRParallelRunner
 *     attempts this via a classpath extension).
 */
public class PFRSliceTask implements Runnable, Serializable {
    private static final long serialVersionUID = 1L;

    public final Object filter;
    public final byte[] pixelsIn;
    public final int w;
    public final int h;
    public final int bitDepth;
    public final int sliceNumber;

    public byte[] pixelsOut;
    public Throwable exception;

    public PFRSliceTask(Object filter, byte[] pixelsIn, int w, int h, int bitDepth, int sliceNumber) {
        this.filter      = filter;
        this.pixelsIn    = pixelsIn;
        this.w           = w;
        this.h           = h;
        this.bitDepth    = bitDepth;
        this.sliceNumber = sliceNumber;
    }

    @Override
    public void run() {
        try {
            // Load ij classes via reflection so this class can compile without ij.jar.
            Class<?> ipClass = Class.forName("ij.process.ImageProcessor");
            Object ip;
            if (bitDepth == 8) {
                Class<?> bpClass = Class.forName("ij.process.ByteProcessor");
                ip = bpClass.getConstructor(int.class, int.class, byte[].class)
                        .newInstance(w, h, pixelsIn);
            } else if (bitDepth == 16) {
                Class<?> spClass = Class.forName("ij.process.ShortProcessor");
                short[] pixShort = new short[w * h];
                java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap(pixelsIn).order(java.nio.ByteOrder.LITTLE_ENDIAN);
                for (int i = 0; i < pixShort.length; i++) pixShort[i] = bb.getShort();
                ip = spClass.getConstructor(int.class, int.class, short[].class, java.awt.image.ColorModel.class)
                        .newInstance(w, h, pixShort, null);
            } else {
                throw new UnsupportedOperationException("bitDepth " + bitDepth + " not yet supported by PFRSliceTask");
            }

            Class<?> filterIface = Class.forName("ij.plugin.filter.PlugInFilter");
            if (!filterIface.isInstance(filter)) {
                throw new IllegalStateException("filter is not a PlugInFilter: " + filter.getClass());
            }
            filterIface.getMethod("run", ipClass).invoke(filter, ip);

            Object pix = ipClass.getMethod("getPixels").invoke(ip);
            if (pix instanceof byte[]) {
                pixelsOut = (byte[]) pix;
            } else if (pix instanceof short[]) {
                short[] sa = (short[]) pix;
                pixelsOut = new byte[sa.length * 2];
                java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap(pixelsOut).order(java.nio.ByteOrder.LITTLE_ENDIAN);
                for (short s : sa) bb.putShort(s);
            }
        } catch (Throwable t) {
            exception = t;
        }
    }
}
