package com.hack.viewer;

import ij.ImagePlus;
import ij.process.ByteProcessor;
import ij.process.ImageProcessor;

/**
 * An ImagePlus backed by a pyramidal TileSource. Holds viewport state
 * (centre cx,cy in level-0 coords + zoom) and re-fetches a viewport's
 * worth of pixels whenever the view changes.
 *
 * The displayed ImageProcessor is always sized to the current viewport in
 * canvas-pixel units, populated by a downsampled fetch from the most
 * appropriate pyramid level.
 *
 * ImageCanvas is patched to recognise this subclass and translate
 * mouse-wheel / drag interactions into setView() calls, giving native
 * Google-Maps-style behaviour without any JS overlay.
 */
public class LazyImagePlus extends ImagePlus {

    private final TileSource src;

    /** viewport centre in level-0 coords */
    private double cx, cy;
    /** displayed-pixels-per-level0-pixel; 1.0 = full base resolution */
    private double zoom;
    /** current viewport size in displayed pixels (≈ canvas size) */
    private int viewW = 800, viewH = 800;

    private boolean refreshing = false;

    public LazyImagePlus(String title, TileSource src) {
        super();
        this.src = src;
        setTitle(title);
        // Centre + start at a zoom that fits the base image in ~viewW pixels.
        this.cx = src.levelWidth(0) / 2.0;
        this.cy = src.levelHeight(0) / 2.0;
        double zx = (double) viewW / src.levelWidth(0);
        double zy = (double) viewH / src.levelHeight(0);
        this.zoom = Math.min(zx, zy);
        // Initial processor (so super.show() has something to render).
        ByteProcessor seed = new ByteProcessor(viewW, viewH);
        setProcessor(seed);
        refresh();
    }

    public TileSource source() { return src; }
    public double getCx()    { return cx; }
    public double getCy()    { return cy; }
    public double getZoomLevel() { return zoom; }
    public int viewportWidth()   { return viewW; }
    public int viewportHeight()  { return viewH; }

    /** Called by ImageCanvas after the user changes window size. */
    public void setViewport(int w, int h) {
        if (w == viewW && h == viewH) return;
        this.viewW = Math.max(64, w);
        this.viewH = Math.max(64, h);
        refresh();
    }

    /** Pan + zoom in level-0 coords. zoom = displayedPx / level0Px. */
    public void setView(double cx, double cy, double zoom) {
        this.cx = cx; this.cy = cy;
        this.zoom = clamp(zoom, 1e-4, 32.0);
        refresh();
    }

    /** Fetch the appropriate level + region for the current view, swap pixels. */
    public void refresh() {
        if (refreshing) return;
        refreshing = true;
        try {
            int lvl = pickLevel(zoom);
            double sf = src.levelScaleFactor(lvl);
            int Lw = src.levelWidth(lvl), Lh = src.levelHeight(lvl);

            // Region in level-coords. Viewport in level0 coords is viewW/zoom.
            double regionWf = viewW / zoom / sf;
            double regionHf = viewH / zoom / sf;
            int rW = (int) Math.max(1, Math.ceil(regionWf));
            int rH = (int) Math.max(1, Math.ceil(regionHf));
            int x0 = (int) Math.floor(cx / sf - rW / 2.0);
            int y0 = (int) Math.floor(cy / sf - rH / 2.0);
            // Clamp viewport to image bounds; allow black margin if region exceeds image
            int rx0 = Math.max(0, x0);
            int ry0 = Math.max(0, y0);
            int rx1 = Math.min(Lw, x0 + rW);
            int ry1 = Math.min(Lh, y0 + rH);
            int rw = rx1 - rx0;
            int rh = ry1 - ry0;
            if (rw <= 0 || rh <= 0) {
                setProcessor(new ByteProcessor(viewW, viewH));
                updateAndDraw();
                return;
            }
            byte[] tile = src.getTile(lvl, rx0, ry0, rw, rh);
            if (tile == null) return;
            ByteProcessor bp = new ByteProcessor(rw, rh, tile, null);
            setProcessor(bp);
            updateAndDraw();
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] refresh failed: " + t);
        } finally {
            refreshing = false;
        }
    }

    /** Pick the highest-resolution level whose scale factor still keeps
     *  the per-displayed-pixel sample-rate <= 1 (no upsampling on display). */
    private int pickLevel(double zoom) {
        // Want: sf >= 1/zoom, but as small as possible (i.e. highest resolution
        // that still fits the viewport without massive oversampling).
        double target = 1.0 / zoom;
        int n = src.levelCount();
        int best = 0;
        double bestErr = Double.POSITIVE_INFINITY;
        for (int i = 0; i < n; i++) {
            double sf = src.levelScaleFactor(i);
            // accept any sf <= target * 1.5 (a little oversampling tolerated)
            if (sf <= target * 1.5) {
                double err = Math.abs(target - sf);
                if (err < bestErr) { bestErr = err; best = i; }
            }
        }
        // Fallback: if nothing matched (super-zoomed-in), return level 0
        return best;
    }

    private static double clamp(double v, double lo, double hi) {
        return Math.max(lo, Math.min(hi, v));
    }
}
