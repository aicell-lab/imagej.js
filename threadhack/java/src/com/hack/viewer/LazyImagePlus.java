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
    private boolean refreshing = false;
    private int pendingTicket = 0;

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
        this.level0W = src.levelWidth(0);
        this.level0H = src.levelHeight(0);
        this.processor = new ByteProcessor(viewW, viewH);
        setProcessor(title, processor);
        setTitle(title);
    }

    // -------- structural overrides: pretend to be level-0-sized ---------

    /** Level-0 width — this is what every ImageJ consumer of "image width"
     *  (Roi bounds checks, srcRect defaults, Measure etc.) sees. */
    @Override
    public int getWidth()  { return level0W; }

    /** Level-0 height — see getWidth(). */
    @Override
    public int getHeight() { return level0H; }

    /** Coordinate readout in the ImageJ status bar. We use level-0 coords;
     *  the callers already pass level-0 x/y thanks to ic.offScreenX/Y. */
    @Override
    public String getLocationAsString(int x, int y) {
        return "x=" + x + ", y=" + y;
    }

    // -------- show(): install the custom canvas -------------------------

    @Override
    public void show() {
        // Build our custom canvas before super.show() creates the window.
        lazyCanvas = new LazyImageCanvas(this);
        ImageWindow win = new ImageWindow(this, lazyCanvas);
        // Initial viewport = fit-to-canvas (ImageJ sets srcRect = full image,
        // mag = canvas.w / image.w). Re-read after layout.
        win.addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                if (lazyCanvas != null) {
                    viewW = Math.max(64, lazyCanvas.getWidth());
                    viewH = Math.max(64, lazyCanvas.getHeight());
                    // Rebuild processor at new canvas size; pixel-blit only
                    // this one time per user resize.
                    processor = new ByteProcessor(viewW, viewH);
                    setProcessor(processor);
                    scheduleFetch();
                }
            }
        });
        Toolbar tb = Toolbar.getInstance();
        if (tb != null) tb.setTool(Toolbar.HAND);
        setActivated();
        IJ.showStatus("");
        // Trigger an initial paint+fetch cycle.
        scheduleFetch();
    }

    public int viewportWidth()  { return viewW; }
    public int viewportHeight() { return viewH; }
    public int getCurrentLevel() { return currentLevel; }

    // -------- viewport transforms --------------------------------------

    /** Called by LazyImageCanvas.paint whenever srcRect / magnification
     *  changed (e.g. ImageJ's HAND-tool scroll, magnifier click, or zoomIn
     *  called from our own patched mouse-wheel handler). */
    public void onCanvasViewChanged(Rectangle srcRect, double magnification) {
        scheduleFetch();
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

    /** Fetch tile for the current viewport (from canvas srcRect + mag) and
     *  blit into the fixed-size viewport processor. */
    public void refresh() {
        final int ticket = ++pendingTicket;
        if (refreshing) return;
        refreshing = true;
        try {
            Rectangle sr = currentSrcRectOrDefault();
            double mag = currentMagnificationOrDefault();
            // Pick best pyramid level for the current zoom.
            int lvl = pickLevelFor(mag);
            logLevelChange(lvl, mag);
            double sf = src.levelScaleFactor(lvl);
            int Lw = src.levelWidth(lvl);
            int Lh = src.levelHeight(lvl);

            // Convert canvas-side srcRect (level-0 coords) to level-L coords.
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

            byte[] dst = new byte[viewW * viewH];
            if (rw > 0 && rh > 0) {
                byte[] tile = src.getTile(lvl, rx0, ry0, rw, rh);
                if (tile != null && tile.length >= rw * rh) {
                    cachedTile = tile;
                    cacheLevel = lvl;
                    cacheX0 = rx0; cacheY0 = ry0;
                    cacheRw = rw; cacheRh = rh;
                    // NN from (rW,rH) → (viewW,viewH), offsetting for clip.
                    double dxScale = (double) rW / viewW;
                    double dyScale = (double) rH / viewH;
                    int tileOffX = rx0 - x0;
                    int tileOffY = ry0 - y0;
                    for (int dy = 0; dy < viewH; dy++) {
                        int yi = (int) (dy * dyScale) - tileOffY;
                        if (yi < 0 || yi >= rh) continue;
                        int dr = dy * viewW;
                        int tr = yi * rw;
                        for (int dx = 0; dx < viewW; dx++) {
                            int xi = (int) (dx * dxScale) - tileOffX;
                            if (xi < 0 || xi >= rw) continue;
                            dst[dr + dx] = tile[tr + xi];
                        }
                    }
                }
            }
            if (ticket == pendingTicket) {
                processor.setPixels(dst);
                updateAndDraw();
            }
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] refresh failed: " + t);
            t.printStackTrace();
        } finally {
            refreshing = false;
            if (ticket != pendingTicket) {
                javax.swing.SwingUtilities.invokeLater(new Runnable() {
                    public void run() { refresh(); }
                });
            }
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
