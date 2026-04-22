package com.hack.viewer;

/**
 * TileSource that bridges to a JS-side data source (geotiff.js / zarrita /
 * viv loaders). Each instance is identified by a `key` that the JS side uses
 * to look up the registered provider (window.__tileSources[key]).
 *
 * The native methods are implemented in JS via cheerpjInit({natives:{...}})
 * — see threadhack/runtime/loader.js. CheerpJ's async-native support means
 * tile fetches that hit the network simply suspend the calling Java thread
 * (via Web Worker / event loop) until the JS Promise resolves.
 */
public final class JSTileSource implements TileSource {

    private final String key;
    private final int levels;
    private final int bits;
    // Cached level metadata (avoid a JS round-trip on every getWidth call)
    private final int[] widths;
    private final int[] heights;
    private final double[] scales;

    public JSTileSource(String key) {
        this.key = key;
        this.levels = nativeLevelCount(key);
        this.bits = nativeBitsPerSample(key);
        this.widths = new int[levels];
        this.heights = new int[levels];
        this.scales = new double[levels];
        for (int i = 0; i < levels; i++) {
            widths[i] = nativeLevelWidth(key, i);
            heights[i] = nativeLevelHeight(key, i);
            scales[i] = nativeLevelScale(key, i);
        }
    }

    public String key() { return key; }

    @Override public int levelCount() { return levels; }
    @Override public int levelWidth(int level) { return widths[level]; }
    @Override public int levelHeight(int level) { return heights[level]; }
    @Override public double levelScaleFactor(int level) { return scales[level]; }
    @Override public int bitsPerSample() { return bits; }

    @Override
    public byte[] getTile(int level, int x, int y, int w, int h) {
        return nativeGetTile(key, level, x, y, w, h);
    }

    // --- JS natives ------------------------------------------------------

    public static native int nativeLevelCount(String key);
    public static native int nativeBitsPerSample(String key);
    public static native int nativeLevelWidth(String key, int level);
    public static native int nativeLevelHeight(String key, int level);
    public static native double nativeLevelScale(String key, int level);
    public static native byte[] nativeGetTile(String key, int level, int x, int y, int w, int h);

    /**
     * Fire-and-forget tile request. Returns immediately; the JS side runs
     * the fetch asynchronously and — when bytes are ready — calls back
     * into {@link LazyImagePlus#onTileReady(long, byte[])}. Callers should
     * track the request id and ignore late arrivals.
     */
    public static native void nativeRequestTile(long requestId, String key,
            int level, int x, int y, int w, int h);
}
