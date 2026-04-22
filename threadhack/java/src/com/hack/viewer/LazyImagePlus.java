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
    private int latestRequestId = 0;
    /** In-flight request geometry, keyed by request id — the callback needs
     *  these to blit correctly. */
    private static final java.util.Map<Integer, Request> requests = new java.util.concurrent.ConcurrentHashMap<>();
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

    public int level0Width()  { return level0W; }
    public int level0Height() { return level0H; }

    /**
     * Override ImagePlus.getWidth/getHeight to report level-0 dimensions —
     * BUT only after show() has finished constructing the ImageWindow.
     *
     * ImageWindow's constructor uses imp.getWidth()/getHeight() to pick the
     * initial frame size (it fits the image onto the screen). Reporting
     * level-0 dims there (e.g. 1758×2048, or 921 600×380 928 for a whole-
     * slide) makes the window open almost full-screen. During the ctor we
     * therefore report the viewport processor size (e.g. 640×750), so the
     * window opens at a sensible viewport.
     *
     * Outside the ctor window, Roi / Measure / HAND-scroll all want level-0
     * dims — xMax = imp.getWidth() in Roi.setImage is what makes the
     * rectangle tool work past x=640.
     */
    private boolean reportViewportForGetWidth = false;
    @Override public int getWidth()  { return reportViewportForGetWidth ? viewW : level0W; }
    @Override public int getHeight() { return reportViewportForGetWidth ? viewH : level0H; }

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
        // Belt: Prefs.open100Percent makes ImageWindow's ctor zoom in until
        // mag=1.0 then setSize(Math.min(width, screen), ...); with our wide
        // overridden image width it's a full-screen-on-open trap.
        ij.Prefs.open100Percent = false;
        // Braces: flip the getWidth/getHeight flag while constructing the
        // ImageWindow so the fit-to-screen loop sees viewport dims (640×~),
        // not level-0.
        reportViewportForGetWidth = true;
        lazyCanvas = new LazyImageCanvas(this);
        ImageWindow win = new ImageWindow(this, lazyCanvas);
        reportViewportForGetWidth = false;
        // CheerpJ's Frame emulation inline-styles freshly-shown windows to
        // the full cheerpjDisplay area, ignoring pack(). Force the frame to
        // match the intended viewport so we don't open fullscreen.
        try {
            java.awt.Insets ins = win.getInsets();
            int sliderH = win.getSliderHeight();
            win.setSize(viewW + ins.left + ins.right,
                        viewH + ins.top + ins.bottom + sliderH);
            win.validate();
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] initial window sizing: " + t);
        }
        // Canvas construction + ImageWindow layout both reset imageWidth /
        // srcRect / magnification to the viewport-processor dims. Re-lock
        // to level-0 AFTER all that runs.
        lazyCanvas.lockViewportToLevel0();
        // Listen on the CANVAS (ImageLayout gives it the correct viewport
        // area, minus insets + info-label + slider). Debounce: during a
        // drag-resize AWT fires many componentResized events per second and
        // each setViewport() allocates a new processor + touches canvas
        // state — letting every one through (a) flooded the Java thread so
        // CheerpJ's pointerup handler couldn't drain (leaving stuck
        // cjResizerBorder overlays) and (b) re-entered the resize event via
        // the setSize() inside setViewport. A 120 ms debounce + re-entry
        // guard means exactly one setViewport runs after the gesture
        // settles.
        lazyCanvas.addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                if (lazyCanvas == null) return;
                scheduleViewportFromCanvas();
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

    /**
     * Resize the viewport to (w, h) canvas pixels, keeping the image centre
     * and magnification fixed; srcRect grows / shrinks so the new canvas
     * fills with image content (no stretch). Callable from Java (the AWT
     * ComponentListener above) and from JS (a ResizeObserver on the canvas
     * DOM element) — whichever fires first wins, the other becomes a no-op
     * because viewW / viewH already match.
     */
    /** Debounce timer for canvas-triggered setViewport. */
    private javax.swing.Timer resizeDebounce;
    /** Re-entry guard: setViewport calls lazyCanvas.setSize which fires
     *  another componentResized; we must not recurse. */
    private boolean inSetViewport = false;

    private void scheduleViewportFromCanvas() {
        if (inSetViewport) return;
        if (resizeDebounce != null) resizeDebounce.stop();
        resizeDebounce = new javax.swing.Timer(120, new java.awt.event.ActionListener() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                resizeDebounce = null;
                if (lazyCanvas != null) setViewport(lazyCanvas.getWidth(), lazyCanvas.getHeight());
            }
        });
        resizeDebounce.setRepeats(false);
        resizeDebounce.start();
    }

    public void setViewport(int w, int h) {
        if (inSetViewport) return;
        inSetViewport = true;
        try {
            if (lazyCanvas == null) return;
            int cw = Math.max(64, w);
            int ch = Math.max(64, h);
            if (cw == viewW && ch == viewH) return;
            Rectangle sr = lazyCanvas.currentSrcRect();
            double mag = lazyCanvas.currentMagnification();
            // Sanity bail-outs — the ResizeObserver can fire while the
            // ImageWindow is still laying out, at which point mag or srcRect
            // may be degenerate. Keep viewW/viewH in sync anyway so next
            // refresh uses the right dimensions.
            if (!(mag > 0) || sr == null || sr.width <= 0 || sr.height <= 0) {
                viewW = cw; viewH = ch;
                processor = new ByteProcessor(viewW, viewH);
                setProcessor(processor);
                if (lazyCanvas != null) {
                    lazyCanvas.setSize(cw, ch);
                    lazyCanvas.lockViewportToLevel0();
                }
                scheduleFetch();
                return;
            }
            double cx = sr.x + sr.width / 2.0;
            double cy = sr.y + sr.height / 2.0;
            int newSrcW = Math.max(1, (int) Math.round(cw / mag));
            int newSrcH = Math.max(1, (int) Math.round(ch / mag));
            int newSrcX = (int) Math.round(cx - newSrcW / 2.0);
            int newSrcY = (int) Math.round(cy - newSrcH / 2.0);
            viewW = cw; viewH = ch;
            processor = new ByteProcessor(viewW, viewH);
            // Pre-set ImagePlus.width/height (inherited protected fields) so
            // ImagePlus.setProcessor2 sees dimensionsChanged=false and does
            // NOT call win.updateImage(this) — which would reset canvas
            // imageWidth/srcRect/magnification back to the processor's
            // viewport dims instead of the level-0 dims we need. (Our
            // own lockViewportToLevel0 below then re-asserts level-0 state
            // on the canvas from scratch, avoiding the divide-by-zero that
            // came from updateImage's interim reset.)
            this.width  = cw;
            this.height = ch;
            setProcessor(processor);
            lazyCanvas.setSize(cw, ch);
            lazyCanvas.lockViewportToLevel0();
            lazyCanvas.setSourceRect(new Rectangle(newSrcX, newSrcY, newSrcW, newSrcH));
            scheduleFetch();
        } catch (Throwable t) {
            System.out.println("[LazyImagePlus] setViewport(" + w + "," + h + ") failed: " + t);
            t.printStackTrace();
        } finally {
            inSetViewport = false;
        }
    }

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
        // Resetting the timer coalesces rapid back-to-back viewport changes
        // into a single refresh(). Without this, show()'s initial fetch and
        // the paint-triggered fetch collide and their callbacks race —
        // leaving the user with no painted tile.
        if (fetchTimer != null) fetchTimer.restart();
        else {
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

            int id = ++latestRequestId;
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
    public static void onTileReady(int id, byte[] bytes) {
        System.out.println("[LazyImagePlus] onTileReady id=" + id + " bytes="
                + (bytes == null ? "null" : bytes.length));
        Request req = requests.remove(id);
        if (req == null) {
            System.out.println("[LazyImagePlus] onTileReady id=" + id + ": no request");
            return;
        }
        LazyImagePlus lip = req.owner;
        if (id != lip.latestRequestId) {
            System.out.println("[LazyImagePlus] onTileReady id=" + id + ": stale (latest=" + lip.latestRequestId + ")");
            return;
        }
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
