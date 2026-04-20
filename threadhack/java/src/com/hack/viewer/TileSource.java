package com.hack.viewer;

/**
 * Pyramidal image source that ImageJ can consult on viewport changes.
 *
 * Implementations may live in pure Java (in-memory tiff readers, etc.) or be
 * thin shims that delegate to JS via CheerpJ async natives (e.g. JSTileSource,
 * which forwards to viv-style geotiff/zarrita loaders running in the page).
 *
 * Coordinate convention:
 *   - levelWidth(0) / levelHeight(0)  = full base-pyramid dimensions.
 *   - levelScaleFactor(i)             = baseWidth / levelWidth(i).
 *                                       Pixel at (x,y) on level i corresponds
 *                                       to (x*sf, y*sf) on level 0.
 */
public interface TileSource {

    /** number of pyramid levels, 0 = highest-resolution (base) */
    int levelCount();

    int levelWidth(int level);
    int levelHeight(int level);
    double levelScaleFactor(int level);

    /** 8 / 16 / 32. JS-side rescale to 8-bit happens before this method returns. */
    int bitsPerSample();

    /**
     * Return a packed grayscale 8-bit byte[] (length = w*h) for the requested
     * region. Caller guarantees x,y,w,h fit within levelWidth/levelHeight.
     */
    byte[] getTile(int level, int x, int y, int w, int h);
}
