package com.hack.viewer;

import ij.IJ;
import ij.ImagePlus;
import ij.gui.ImageCanvas;
import ij.gui.ImageWindow;
import ij.gui.Toolbar;
import ij.process.ByteProcessor;

import java.awt.Rectangle;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;

/**
 * ImagePlus backed by a pyramidal TileSource.
 *
 * The structural contract with ImageJ:
 *   - getWidth() / getHeight() report full level-0 dimensions, so ImageJ
 *     internally believes the image is as large as the underlying scan.
 *   - The attached {@link LazyImageCanvas} paints a viewport-sized
 *     ByteProcessor (viewW × viewH) scaled to fill the canvas; stock
 *     srcRect + magnification are left as ImageJ sets them (in level-0
 *     coords).
 *   - Every coord-aware code path in ImageJ — Rois, cursor readout,
 *     Measure, HAND-tool scroll, Magnifier zoom — works natively because
 *     offScreenX/Y returns level-0 coords and screenX/Y produces the
 *     correct display coords.
 *
 * We just listen for srcRect / magnification changes coming out of stock
 * ImageJ interactions and (re-)fetch the appropriate pyramid-level tile.
 */
public class LazyImagePlus extends ImagePlus {

    private final TileSource src;
    private final int level0W, level0H;

    /** Viewport processor dimensions; these follow canvas size. */
    private int viewW = 640, viewH = 640;
    private ByteProcessor processor;
    private LazyImageCanvas lazyCanvas;

    /** Debounced-fetch timer. */
    private javax.swing.Timer fetchTimer;

    /** Monotonically-increasing request id. Incremented on every scheduled
     *  fetch; JS calls back into onTileReady(id, bytes) which drops any
     *  id != latestRequestId (so stale results don't overwrite fresh ones). */
    private long latestRequestId = 0;
    /** In-flight request geometry, keyed by request id — the callback needs
     *  these to blit correctly. */
    private static final java.util.Map<Long, Request> requests = new java.util.concurrent.ConcurrentHashMap<>();
    private String srcKey;

    private static final class Request {
        final LazyImagePlus owner;
        final int lvl;
        final int x0, y0, rw, rh;   // in level-L coords (clamped fetch region)
        final int ix0, iy0, iW, iH; // in level-L coords, ideal (may extend past bounds)
        Request(LazyImagePlus owner, int lvl, int x0, int y0, int rw, int rh,
                int ix0, int iy0, int iW, int iH) {
            this.owner = owner; this.lvl = lvl;
            this.x0 = x0; this.y0 = y0; this.rw = rw; this.rh = rh;
            this.ix0 = ix0; this.iy0 = iy0; this.iW = iW; this.iH = iH;
        }
    }

    /** Last fetched tile + geometry, used for instant NN previews between
     *  viewport changes and the next tile arriving. */
    private byte[] cachedTile;
    private int cacheLevel = -1;
    private int cacheX0, cacheY0, cacheRw, cacheRh;

    /** Last chosen pyramid level (for title + println). */
    private int currentLevel = 0;

    public LazyImagePlus(String title, TileSource src) {
        super();
        this.src = src;
        this.srcKey = (src instanceof JSTileSource) ? ((JSTileSource) src).key() : "";
        this.level0W = src.levelWidth(0);
        this.level0H = src.levelHeight(0);
        // Size the initial viewport to match the level-0 aspect ratio
        // capped at 640 on the long edge. This keeps the displayed image
        // from being stretched into a square on non-square inputs.
        int LONG_EDGE = 640;
        double aspect = (double) level0W / level0H;
        if (aspect >= 1.0) {
            viewW = LONG_EDGE;
            viewH = Math.max(64, (int) Math.round(LONG_EDGE / aspect));
        } else {
            viewH = LONG_EDGE;
            viewW = Math.max(64, (int) Math.round(LONG_EDGE * aspect));
        }
        this.processor = new ByteProcessor(viewW, viewH);
        setProcessor(title, processor);
        setTitle(title);
    }

    // -------- structural getters ---------------------------------------

    /** Full-resolution (level-0) width. The ImagePlus itself reports the
     *  viewport-processor width via getWidth() because ImagePlus.getImage()
     *  internally depends on that matching the processor; the canvas, in
     *  contrast, is initialised with level-0 dimensions so every coord
     *  transform (srcRect, offScreenX/Y) speaks level-0 natively. */
    public int level0Width()  { return level0W; }
    public int level0Height() { return level0H; }

    /** ImageJ status bar format — (x, y) here are already level-0 coords
     *  because LazyImageCanvas has srcRect/magnification in level-0 space. */
    @Override
    public String getLocationAsString(int x, int y) {
        return "x=" + x + ", y=" + y;
    }

    /**
     * Build the status-bar message ourselves so we can look up the pixel
     * value at the correct VIEWPORT coord. The default ImagePlus.mouseMoved
     * calls getValueAsString(x,y) which indexes the processor at (x,y) —
     * but (x,y) here are level-0 coords while the processor is viewport-
     * sized, so the default always returned 0. (getValueAsString itself is
     * private in ImagePlus, so we can't override it directly.)
     */
    @Override
    public void mouseMoved(int x, int y) {
        if (IJ.getInstance() == null) return;
        String loc = getLocationAsString(x, y);
        String val = "";
        if (lazyCanvas != null && processor != null) {
            Rectangle sr = lazyCanvas.currentSrcRect();
            double mag = lazyCanvas.currentMagnification();
            int vx = (int) Math.round((x - sr.x) * mag);
            int vy = (int) Math.round((y - sr.y) * mag);
            if (vx >= 0 && vx < viewW && vy >= 0 && vy < viewH) {
                val = ", value=" + processor.getPixel(vx, vy);
            }
        }
        IJ.showStatus(loc + val);
    }

    // -------- show(): install the custom canvas -------------------------

    @Override
    public void show() {
        lazyCanvas = new LazyImageCanvas(this);
        ImageWindow win = new ImageWindow(this, lazyCanvas);
        // Canvas construction + ImageWindow layout both reset imageWidth /
        // srcRect / magnification to the viewport-processor dims. Re-lock
        // to level-0 AFTER all that runs.
        lazyCanvas.lockViewportToLevel0();
        win.addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                if (lazyCanvas == null) return;
                int cw = Math.max(64, lazyCanvas.getWidth());
                int ch = Math.max(64, lazyCanvas.getHeight());
                if (cw == viewW && ch == viewH) return;
                // Keep the image centre + magnification fixed; adjust
                // srcRect's aspect to match the new canvas, so the view
                // grows/shrinks to fill without stretching.
                Rectangle sr = lazyCanvas.currentSrcRect();
                double mag = lazyCanvas.currentMagnification();
                double cx = sr.x + sr.width / 2.0;
                double cy = sr.y + sr.height / 2.0;
                int newSrcW = Math.max(1, (int) Math.round(cw / mag));
                int newSrcH = Math.max(1, (int) Math.round(ch / mag));
                int newSrcX = (int) Math.round(cx - newSrcW / 2.0);
                int newSrcY = (int) Math.round(cy - newSrcH / 2.0);
                viewW = cw; viewH = ch;
                processor = new ByteProcessor(viewW, viewH);
                setProcessor(processor);
                lazyCanvas.lockViewportToLevel0();
                lazyCanvas.setSourceRect(new Rectangle(newSrcX, newSrcY, newSrcW, newSrcH));
                scheduleFetch();
            }
        });
        Toolbar tb = Toolbar.getInstance();
        if (tb != null) tb.setTool(Toolbar.HAND);
        setActivated();
        IJ.showStatus("");
        scheduleFetch();
    }

    public int viewportWidth()  { return viewW; }
    public int viewportHeight() { return viewH; }
    public int getCurrentLevel() { return currentLevel; }

    // -------- viewport transforms --------------------------------------

    /** Called by LazyImageCanvas.paint whenever srcRect / magnification
     *  changed (e.g. ImageJ's HAND-tool scroll, magnifier click, or zoomIn
     *  called from our own patched mouse-wheel handler).
     *
     *  Paints an instant preview from the cached tile (NN-resampled to the
     *  new viewport) so pan/zoom feels snappy, then schedules a real fetch
     *  with a short debounce so rapid interactions collapse into one. */
    public void onCanvasViewChanged(Rectangle srcRect, double magnification) {
        renderFromCache(srcRect);
        scheduleFetch();
    }

    /** NN-resample the last fetched tile into the viewport processor so the
     *  user sees the new pan/zoom immediately, before the debounced fetch
     *  completes. */
    private void renderFromCache(Rectangle sr) {
        if (cachedTile == null || cacheLevel < 0) return;
        double sf = src.levelScaleFactor(cacheLevel);
        byte[] dst = new byte[viewW * viewH];
        // For each dst pixel (dx,dy) in the current viewport, compute its
        // level-0 coord and then project back to the cached tile's level+offset.
        double srcXpPx = sr.width  / (double) viewW;   // level-0 px per dst px
        double srcYpPx = sr.height / (double) viewH;
        for (int dy = 0; dy < viewH; dy++) {
            double l0y = sr.y + dy * srcYpPx;
            int ty = (int) Math.round(l0y / sf) - cacheY0;
            if (ty < 0 || ty >= cacheRh) continue;
            int dr = dy * viewW;
            int tr = ty * cacheRw;
            for (int dx = 0; dx < viewW; dx++) {
                double l0x = sr.x + dx * srcXpPx;
                int tx = (int) Math.round(l0x / sf) - cacheX0;
                if (tx < 0 || tx >= cacheRw) continue;
                dst[dr + dx] = cachedTile[tr + tx];
            }
        }
        processor.setPixels(dst);
        updateAndDraw();
    }

    private void scheduleFetch() {
        if (fetchTimer != null) fetchTimer.stop();
        fetchTimer = new javax.swing.Timer(80, new java.awt.event.ActionListener() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                fetchTimer = null;
                refresh();
            }
        });
        fetchTimer.setRepeats(false);
        fetchTimer.start();
    }

    /** Schedule a tile fetch for the current viewport. Does NOT block —
     *  dispatches via the fire-and-forget native; the result flows back
     *  through {@link #onTileReady(long, byte[])}. */
    public void refresh() {
        try {
            Rectangle sr = currentSrcRectOrDefault();
            double mag = currentMagnificationOrDefault();
            int lvl = pickLevelFor(mag);
            logLevelChange(lvl, mag);
            double sf = src.levelScaleFactor(lvl);
            int Lw = src.levelWidth(lvl), Lh = src.levelHeight(lvl);

            int x0 = (int) Math.floor(sr.x / sf);
            int y0 = (int) Math.floor(sr.y / sf);
            int rW = (int) Math.ceil(sr.width  / sf);
            int rH = (int) Math.ceil(sr.height / sf);
            int rx0 = Math.max(0, x0);
            int ry0 = Math.max(0, y0);
            int rx1 = Math.min(Lw, x0 + rW);
            int ry1 = Math.min(Lh, y0 + rH);
            int rw = rx1 - rx0;
            int rh = ry1 - ry0;
            if (rw <= 0 || rh <= 0) return;

            long id = ++latestRequestId;
            requests.put(id, new Request(this, lvl, rx0, ry0, rw, rh, x0, y0, rW, rH));
            // Fire-and-forget — returns immediately. JS will call back into
            // LazyImagePlus.onTileReady(id, bytes) when the fetch resolves.
            JSTileSource.nativeRequestTile(id, srcKey, lvl, rx0, ry0, rw, rh);
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] refresh dispatch failed: " + t);
        }
    }

    /** JS callback: the fire-and-forget fetch finished. Look up the
     *  originating request; if the owner has moved on to a newer request,
     *  discard this result. Otherwise blit and repaint. */
    public static void onTileReady(long id, byte[] bytes) {
        Request req = requests.remove(id);
        if (req == null) return;
        LazyImagePlus lip = req.owner;
        if (id != lip.latestRequestId) return; // stale
        lip.blitAndRepaint(req, bytes);
    }

    private void blitAndRepaint(Request req, byte[] tile) {
        try {
            if (tile == null || tile.length < req.rw * req.rh) return;
            cachedTile = tile;
            cacheLevel = req.lvl;
            cacheX0 = req.x0;
            cacheY0 = req.y0;
            cacheRw = req.rw;
            cacheRh = req.rh;

            byte[] dst = new byte[viewW * viewH];
            double dxScale = (double) req.iW / viewW;
            double dyScale = (double) req.iH / viewH;
            int tileOffX = req.x0 - req.ix0;
            int tileOffY = req.y0 - req.iy0;
            for (int dy = 0; dy < viewH; dy++) {
                int yi = (int) (dy * dyScale) - tileOffY;
                if (yi < 0 || yi >= req.rh) continue;
                int dr = dy * viewW;
                int tr = yi * req.rw;
                for (int dx = 0; dx < viewW; dx++) {
                    int xi = (int) (dx * dxScale) - tileOffX;
                    if (xi < 0 || xi >= req.rw) continue;
                    dst[dr + dx] = tile[tr + xi];
                }
            }
            processor.setPixels(dst);
            updateAndDraw();
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] blit failed: " + t);
        }
    }

    // ----- helpers ------------------------------------------------------

    private Rectangle currentSrcRectOrDefault() {
        if (lazyCanvas != null) {
            Rectangle r = lazyCanvas.currentSrcRect();
            if (r.width > 0 && r.height > 0) return r;
        }
        // Fallback: fit whole image.
        return new Rectangle(0, 0, level0W, level0H);
    }

    private double currentMagnificationOrDefault() {
        if (lazyCanvas != null && lazyCanvas.currentMagnification() > 0) {
            return lazyCanvas.currentMagnification();
        }
        return (double) viewW / level0W;
    }

    private int pickLevelFor(double magnification) {
        // For each level, level-L-pixel → displayed-pixel ratio is
        //   magnification * levelScaleFactor(L).
        // We want this ratio ≤ 1 (no oversampling) AND as close to 1 as
        // possible (minimum downsampling).
        int n = src.levelCount();
        int best = 0;
        double bestErr = Double.POSITIVE_INFINITY;
        for (int i = 0; i < n; i++) {
            double ratio = magnification * src.levelScaleFactor(i);
            if (ratio <= 1.5) {  // tolerate mild oversampling
                double err = Math.abs(ratio - 1.0);
                if (err < bestErr) { bestErr = err; best = i; }
            }
        }
        return best;
    }

    private void logLevelChange(int lvl, double mag) {
        if (lvl == currentLevel) return;
        System.out.println("[LazyImagePlus] level " + currentLevel + " → " + lvl
                + "  mag=" + String.format("%.4f", mag)
                + "  level" + lvl + " " + src.levelWidth(lvl) + "x" + src.levelHeight(lvl));
        currentLevel = lvl;
        final int levelNow = lvl;
        final int nLevels = src.levelCount();
        final String base = stripLevelSuffix(getTitle());
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                setTitle(base + "  [level " + levelNow + "/" + (nLevels - 1) + "]");
            }
        });
    }

    private static String stripLevelSuffix(String t) {
        if (t == null) return "";
        int i = t.indexOf("  [level ");
        return i >= 0 ? t.substring(0, i) : t;
    }
}
