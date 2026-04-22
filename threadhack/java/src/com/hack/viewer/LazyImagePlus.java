package com.hack.viewer;

import ij.IJ;
import ij.ImagePlus;
import ij.gui.ImageCanvas;
import ij.gui.ImageWindow;
import ij.gui.OvalRoi;
import ij.gui.PointRoi;
import ij.gui.PolygonRoi;
import ij.gui.Roi;
import ij.gui.Toolbar;
import ij.process.ByteProcessor;

import java.awt.Polygon;
import java.awt.Rectangle;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;

/**
 * An ImagePlus backed by a pyramidal TileSource.
 *
 * Invariants (by design):
 *   1. ImageProcessor dimensions are FIXED at viewW × viewH. All viewport
 *      changes happen by re-filling the existing processor's pixel buffer
 *      via ip.setPixels(), never by setProcessor(newIp-of-different-size).
 *      This prevents ImageJ's ImageWindow.pack() from resizing the window
 *      whenever the user zooms.
 *   2. ImageCanvas.magnification is locked at 1.0 and srcRect at the full
 *      processor. All zoom state lives in LazyImagePlus.zoom, not in
 *      ImageCanvas — so ImageJ's zoomIn/zoomOut (which calls pack()) never
 *      fires through our code path.
 *   3. When the user resizes the window, a ComponentListener grows/shrinks
 *      viewW/viewH to match the new canvas and re-fetches. No empty padding.
 *
 * Google-Maps-style semantics (delivered by patched ImageWindow + ImageCanvas):
 *   - wheel       → cursor-anchored zoom, window stays the same size
 *   - drag        → pan, any tool
 *   - click       → ignored (magnifier is disabled)
 *   - resize drag → viewport grows to fill the canvas
 */
public class LazyImagePlus extends ImagePlus {

    private final TileSource src;

    /** Viewport centre in level-0 coordinates. */
    private double cx, cy;
    /** displayed-pixels-per-level-0-pixel. 1.0 = native resolution. */
    private double zoom;
    /** Processor dimensions, in screen pixels. Kept = canvas size. */
    private int viewW = 640, viewH = 640;

    private ByteProcessor processor;
    private boolean refreshing = false;
    private int pendingTicket = 0;
    /** Last level chosen by pickLevel() — surfaced in title bar for diagnostic. */
    private int currentLevel = 0;

    /** Last fetched tile + its geometry, used for instant NN-scaled previews
     *  on setView() before the next fetch lands. */
    private byte[] cachedTile;
    private int cacheLevel = -1;
    private int cacheX0, cacheY0, cacheRw, cacheRh;

    /** Debounce timer for the actual network fetch. */
    private javax.swing.Timer fetchTimer;

    /**
     * Viewport-stable ROI state. After every user interaction with the ROI
     * tool, the current display-coord ROI is converted to level-0 coords and
     * cached here. On refresh(), the cached ROI is projected back to the new
     * display coords and re-installed, so ROIs "stick" to the underlying
     * image no matter how the user pans / zooms.
     *
     * Represented as pixel arrays in level-0 coords so any ROI shape
     * (Rectangle, Oval, Polygon, Freehand) can be round-tripped.
     */
    private int[] roiLevel0Xs;
    private int[] roiLevel0Ys;
    private int roiType = -1;    // Roi.RECTANGLE / OVAL / POLYGON / FREEROI etc.
    /** A tag we set on the imp's Roi so we know we synthesised it (don't re-snapshot). */
    private Roi lastProjectedRoi;

    public LazyImagePlus(String title, TileSource src) {
        super();
        this.src = src;
        this.cx = src.levelWidth(0) / 2.0;
        this.cy = src.levelHeight(0) / 2.0;
        // Start zoomed so base pyramid level fits the viewport.
        double zx = (double) viewW / src.levelWidth(0);
        double zy = (double) viewH / src.levelHeight(0);
        this.zoom = Math.min(zx, zy);
        this.processor = new ByteProcessor(viewW, viewH);
        setProcessor(title, processor);
        setTitle(title);
    }

    @Override
    public void show() {
        super.show();
        try {
            ImageWindow win = getWindow();
            ImageCanvas ic = getCanvas();
            if (ic != null) {
                ic.setMagnification(1.0);
                ic.setSourceRect(new Rectangle(0, 0, viewW, viewH));
            }
            // Hand tool avoids ROI-creation fights with our drag hook
            Toolbar tb = Toolbar.getInstance();
            if (tb != null) tb.setTool(Toolbar.HAND);
            // Track window-resize so the viewport grows with the canvas
            if (win != null) {
                win.addComponentListener(new ComponentAdapter() {
                    @Override
                    public void componentResized(ComponentEvent e) {
                        ImageCanvas ic2 = getCanvas();
                        if (ic2 == null) return;
                        int w = Math.max(64, ic2.getWidth());
                        int h = Math.max(64, ic2.getHeight());
                        setViewport(w, h);
                    }
                });
            }
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] show() setup failed: " + t);
        }
        refresh();
    }

    public TileSource source()    { return src; }
    public double getCx()         { return cx; }
    public double getCy()         { return cy; }
    public double getZoomLevel()  { return zoom; }

    /**
     * Status-bar coordinate readout: transform display-pixel coords back to
     * level-0 (global, full-resolution) coordinates so the user sees where
     * they are on the underlying image — not on the rescaled viewport.
     * Also surfaces the current pyramid level + zoom for diagnostic value.
     */
    @Override
    public void mouseMoved(int x, int y) {
        double l0x = cx + (x - viewW / 2.0) / zoom;
        double l0y = cy + (y - viewH / 2.0) / zoom;
        IJ.showStatus("x=" + (int) Math.round(l0x)
                + ", y=" + (int) Math.round(l0y)
                + "   [level " + currentLevel + "/" + (src.levelCount() - 1) + "]"
                + "   zoom=" + String.format("%.3f", zoom));
    }
    public int viewportWidth()    { return viewW; }
    public int viewportHeight()   { return viewH; }
    public int getCurrentLevel()  { return currentLevel; }
    public int getLevelCount()    { return src.levelCount(); }
    public int getLevelWidth(int lvl)  { return src.levelWidth(lvl); }
    public int getLevelHeight(int lvl) { return src.levelHeight(lvl); }

    /** Called by ImageCanvas resize or ImageWindow componentResized. */
    public void setViewport(int w, int h) {
        if (w == viewW && h == viewH) return;
        this.viewW = w;
        this.viewH = h;
        // Rebuild the processor at the new size. setPixels() alone cannot
        // grow the buffer. This is the ONLY place we setProcessor() after
        // construction — the user explicitly resized the window, so a
        // single layout pass is expected here.
        this.processor = new ByteProcessor(viewW, viewH);
        setProcessor(processor);
        ImageCanvas ic = getCanvas();
        if (ic != null) {
            ic.setMagnification(1.0);
            ic.setSourceRect(new Rectangle(0, 0, viewW, viewH));
        }
        refresh();
    }

    /** Pan + zoom in level-0 coords. zoom = displayedPx / level-0-px.
     *
     *  Fast path: re-render from the cached tile (NN-rescale) so the
     *  viewport snaps immediately. Crisp pixels arrive in a debounced
     *  fetch ~120 ms later, once the user stops interacting.
     */
    public void setView(double cx, double cy, double zoom) {
        this.cx = cx;
        this.cy = cy;
        this.zoom = clamp(zoom, 1e-4, 32.0);
        renderFromCache();            // instant, no network
        scheduleFetch();              // debounced, may fire later
    }

    /**
     * Paint the current viewport by NN-resampling the last fetched tile.
     * Good enough as a preview; the scheduled fetch will replace it with
     * pixels from the correct pyramid level.
     */
    private void renderFromCache() {
        if (cachedTile == null) return;
        final int lvl = cacheLevel;
        final double sf = src.levelScaleFactor(lvl);
        final byte[] dst = new byte[viewW * viewH];
        // For each dst pixel, compute its level-0 coord via the view
        // transform, then map to the cached tile's level + offset.
        for (int dy = 0; dy < viewH; dy++) {
            double l0y = cy + (dy - viewH / 2.0) / zoom;
            double tyD = l0y / sf - cacheY0;
            int ty = (int) Math.round(tyD);
            if (ty < 0 || ty >= cacheRh) continue;
            int dstRow = dy * viewW;
            int tileRow = ty * cacheRw;
            for (int dx = 0; dx < viewW; dx++) {
                double l0x = cx + (dx - viewW / 2.0) / zoom;
                double txD = l0x / sf - cacheX0;
                int tx = (int) Math.round(txD);
                if (tx < 0 || tx >= cacheRw) continue;
                dst[dstRow + dx] = cachedTile[tileRow + tx];
            }
        }
        processor.setPixels(dst);
        ImageCanvas ic = getCanvas();
        if (ic != null) {
            ic.setMagnification(1.0);
            ic.setSourceRect(new Rectangle(0, 0, viewW, viewH));
        }
        reprojectCachedRoi();
        updateAndDraw();
    }

    private void scheduleFetch() {
        if (fetchTimer != null) fetchTimer.stop();
        fetchTimer = new javax.swing.Timer(120, new java.awt.event.ActionListener() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                fetchTimer = null;
                refresh();
            }
        });
        fetchTimer.setRepeats(false);
        fetchTimer.start();
    }

    /**
     * Snapshot the current display-coord ROI to level-0 coords. Called
     * by the patched ImageCanvas.mouseReleased after a user-driven ROI edit.
     */
    public void captureRoiToLevel0() {
        Roi r = getRoi();
        if (r == null) { roiType = -1; roiLevel0Xs = roiLevel0Ys = null; lastProjectedRoi = null; return; }
        if (r == lastProjectedRoi) return;  // we made this, don't round-trip
        Polygon poly = r.getPolygon();
        if (poly == null || poly.npoints == 0) {
            // Rectangle-style with no polygon (shouldn't happen often)
            Rectangle b = r.getBounds();
            roiLevel0Xs = new int[]{b.x, b.x + b.width, b.x + b.width, b.x};
            roiLevel0Ys = new int[]{b.y, b.y, b.y + b.height, b.y + b.height};
        } else {
            roiLevel0Xs = new int[poly.npoints];
            roiLevel0Ys = new int[poly.npoints];
            for (int i = 0; i < poly.npoints; i++) {
                double[] lv = displayToLevel0(poly.xpoints[i], poly.ypoints[i]);
                roiLevel0Xs[i] = (int) Math.round(lv[0]);
                roiLevel0Ys[i] = (int) Math.round(lv[1]);
            }
        }
        roiType = r.getType();
    }

    private double[] displayToLevel0(double dx, double dy) {
        double level0X = cx + (dx - viewW / 2.0) / zoom;
        double level0Y = cy + (dy - viewH / 2.0) / zoom;
        return new double[]{ level0X, level0Y };
    }

    private double[] level0ToDisplay(double lx, double ly) {
        double dx = viewW / 2.0 + (lx - cx) * zoom;
        double dy = viewH / 2.0 + (ly - cy) * zoom;
        return new double[]{ dx, dy };
    }

    /** Rebuild an ROI in current display coords from the cached level-0 points. */
    private void reprojectCachedRoi() {
        if (roiType < 0 || roiLevel0Xs == null || roiLevel0Ys == null) return;
        int n = roiLevel0Xs.length;
        int[] xs = new int[n];
        int[] ys = new int[n];
        for (int i = 0; i < n; i++) {
            double[] d = level0ToDisplay(roiLevel0Xs[i], roiLevel0Ys[i]);
            xs[i] = (int) Math.round(d[0]);
            ys[i] = (int) Math.round(d[1]);
        }
        Roi newRoi;
        switch (roiType) {
            case Roi.RECTANGLE: {
                int minX = xs[0], minY = ys[0], maxX = xs[0], maxY = ys[0];
                for (int i = 1; i < n; i++) { if (xs[i]<minX) minX=xs[i]; if (xs[i]>maxX) maxX=xs[i]; if (ys[i]<minY) minY=ys[i]; if (ys[i]>maxY) maxY=ys[i]; }
                newRoi = new Roi(minX, minY, maxX - minX, maxY - minY);
                break;
            }
            case Roi.OVAL: {
                int minX = xs[0], minY = ys[0], maxX = xs[0], maxY = ys[0];
                for (int i = 1; i < n; i++) { if (xs[i]<minX) minX=xs[i]; if (xs[i]>maxX) maxX=xs[i]; if (ys[i]<minY) minY=ys[i]; if (ys[i]>maxY) maxY=ys[i]; }
                newRoi = new OvalRoi(minX, minY, maxX - minX, maxY - minY);
                break;
            }
            case Roi.POLYGON:
                newRoi = new PolygonRoi(xs, ys, n, Roi.POLYGON);
                break;
            case Roi.FREEROI:
                newRoi = new PolygonRoi(xs, ys, n, Roi.FREEROI);
                break;
            case Roi.POLYLINE:
                newRoi = new PolygonRoi(xs, ys, n, Roi.POLYLINE);
                break;
            case Roi.FREELINE:
                newRoi = new PolygonRoi(xs, ys, n, Roi.FREELINE);
                break;
            case Roi.POINT:
                // ImageJ's PolygonRoi(Roi.POINT) renders points joined as a
                // polyline, so single/multi-point ROIs must use PointRoi.
                newRoi = new PointRoi(xs, ys, n);
                break;
            case Roi.LINE:
                if (n >= 2) newRoi = new ij.gui.Line(xs[0], ys[0], xs[1], ys[1]);
                else return;
                break;
            default:
                // Unknown Roi type; skip reprojection
                return;
        }
        lastProjectedRoi = newRoi;
        setRoi(newRoi);
    }

    /** Fetch appropriate level/region, blit into the fixed-size processor. */
    public void refresh() {
        final int ticket = ++pendingTicket;
        if (refreshing) return;
        refreshing = true;
        try {
            int lvl = pickLevel(zoom);
            if (lvl != currentLevel) {
                System.out.println("[LazyImagePlus] level " + currentLevel + " → " + lvl
                        + "  zoom=" + String.format("%.4f", zoom)
                        + "  level" + lvl + " " + src.levelWidth(lvl) + "x" + src.levelHeight(lvl));
                currentLevel = lvl;
                // Encode level into title so it's visible without opening devtools.
                final int levelNow = lvl;
                final int nLevels = src.levelCount();
                final String baseTitle = stripLevelSuffix(getTitle());
                javax.swing.SwingUtilities.invokeLater(new Runnable() {
                    public void run() {
                        setTitle(baseTitle + "  [level " + levelNow + "/" + (nLevels - 1) + "]");
                    }
                });
            }
            double sf = src.levelScaleFactor(lvl);
            int Lw = src.levelWidth(lvl);
            int Lh = src.levelHeight(lvl);

            // Ideal viewport in level-coords (may extend past image bounds).
            double rWf = viewW / zoom / sf;
            double rHf = viewH / zoom / sf;
            int rW = Math.max(1, (int) Math.ceil(rWf));
            int rH = Math.max(1, (int) Math.ceil(rHf));
            int x0 = (int) Math.round(cx / sf - rW / 2.0);
            int y0 = (int) Math.round(cy / sf - rH / 2.0);

            // Clamped fetch region
            int rx0 = Math.max(0, x0);
            int ry0 = Math.max(0, y0);
            int rx1 = Math.min(Lw, x0 + rW);
            int ry1 = Math.min(Lh, y0 + rH);
            int rw = rx1 - rx0;
            int rh = ry1 - ry0;

            byte[] dst = new byte[viewW * viewH];
            byte[] tile = null;
            if (rw > 0 && rh > 0) {
                tile = src.getTile(lvl, rx0, ry0, rw, rh);
                if (tile != null && tile.length >= rw * rh) {
                    // Cache the fetched tile so setView() can render instant
                    // NN previews from it before the next fetch arrives.
                    cachedTile = tile;
                    cacheLevel = lvl;
                    cacheX0 = rx0; cacheY0 = ry0;
                    cacheRw = rw; cacheRh = rh;
                    // Map each dst pixel to (ideal-viewport → tile) via NN.
                    double dxScale = (double) rW / viewW;
                    double dyScale = (double) rH / viewH;
                    int tileOffX = rx0 - x0;
                    int tileOffY = ry0 - y0;
                    for (int dy = 0; dy < viewH; dy++) {
                        int yInIdeal = (int) (dy * dyScale);
                        int yInTile = yInIdeal - tileOffY;
                        if (yInTile < 0 || yInTile >= rh) continue;
                        int dstRow = dy * viewW;
                        int tileRow = yInTile * rw;
                        for (int dx = 0; dx < viewW; dx++) {
                            int xInIdeal = (int) (dx * dxScale);
                            int xInTile = xInIdeal - tileOffX;
                            if (xInTile < 0 || xInTile >= rw) continue;
                            dst[dstRow + dx] = tile[tileRow + xInTile];
                        }
                    }
                }
            }
            // In-place pixel swap: same buffer size, no setProcessor = no pack().
            if (ticket == pendingTicket) {
                processor.setPixels(dst);
                // Keep canvas locked at 1:1 full-processor view.
                ImageCanvas ic = getCanvas();
                if (ic != null) {
                    ic.setMagnification(1.0);
                    ic.setSourceRect(new Rectangle(0, 0, viewW, viewH));
                }
                // Re-project any level-0-anchored ROI onto the new viewport
                // so rectangles / polygons stay on the underlying image
                // region as the user pans and zooms.
                reprojectCachedRoi();
                updateAndDraw();
            }
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] refresh failed: " + t);
            t.printStackTrace();
        } finally {
            refreshing = false;
            // If more refresh() calls arrived while we were busy, coalesce them
            // into one follow-up pass.
            if (ticket != pendingTicket) {
                // schedule single tail refresh (re-entrant safe)
                javax.swing.SwingUtilities.invokeLater(new Runnable() {
                    public void run() { refresh(); }
                });
            }
        }
    }

    private int pickLevel(double zoom) {
        double target = 1.0 / zoom;
        int n = src.levelCount();
        int best = 0;
        double bestErr = Double.POSITIVE_INFINITY;
        for (int i = 0; i < n; i++) {
            double sf = src.levelScaleFactor(i);
            if (sf <= target * 1.5) {
                double err = Math.abs(target - sf);
                if (err < bestErr) { bestErr = err; best = i; }
            }
        }
        return best;
    }

    private static double clamp(double v, double lo, double hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    private static String stripLevelSuffix(String t) {
        if (t == null) return "";
        int i = t.indexOf("  [level ");
        return i >= 0 ? t.substring(0, i) : t;
    }
}
