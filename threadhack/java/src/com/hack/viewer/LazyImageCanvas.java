package com.hack.viewer;

import ij.IJ;
import ij.gui.ImageCanvas;
import ij.gui.ImageWindow;
import ij.gui.Overlay;
import ij.gui.Roi;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Rectangle;

/**
 * ImageCanvas specialised for LazyImagePlus.
 *
 * Key insight: with srcRect in level-0 coordinates and magnification = zoom,
 * every stock ImageJ code path that uses offScreenX / screenX / srcRect
 * already speaks level-0 natively:
 *   - ROI tools build Rois in level-0 coords directly.
 *   - HAND-tool drag pans srcRect (= shifts the level-0 viewport).
 *   - Magnifier click zooms srcRect (= adjusts level-0 viewport).
 *   - Status-bar coordinate readout uses offScreenX → level-0 coord.
 *   - Analyze → Measure reads Roi bounds in level-0 pixels.
 *
 * We only need to override painting, because stock paint() uses srcRect to
 * index into imp.getImage() — and our Image is a viewport-sized ByteProcessor
 * (viewW × viewH), not the full level-0 image. We draw it scaled to canvas
 * and trigger a re-fetch whenever srcRect changes.
 */
public class LazyImageCanvas extends ImageCanvas {

    private final LazyImagePlus lip;
    private Rectangle lastObservedSrcRect;
    private double   lastObservedMag = -1;

    public LazyImageCanvas(LazyImagePlus imp) {
        super(imp);
        this.lip = imp;
        // Replace the imageWidth/imageHeight/srcRect the superclass computed
        // from imp.getWidth() (which is only viewport size) with the real
        // level-0 dimensions. This makes stock offScreenX/screenX speak
        // level-0 coords, so Rois, cursor readouts, and HAND-scroll are
        // automatically correct without any bespoke coordinate translation.
        imageWidth  = imp.level0Width();
        imageHeight = imp.level0Height();
        srcRect = new Rectangle(0, 0, imageWidth, imageHeight);
        // Initial magnification so canvas-side = viewport-side pixel count
        // (viewportWidth = magnification * srcRect.width).
        magnification = (double) imp.viewportWidth() / imageWidth;
        setSize(imp.viewportWidth(), imp.viewportHeight());
    }

    @Override
    public Dimension getPreferredSize() {
        return new Dimension(lip.viewportWidth(), lip.viewportHeight());
    }

    @Override
    public void paint(Graphics g) {
        try {
            detectAndPropagateSrcRectChange();
            // Stock ImageCanvas.paint does this — we must too, otherwise
            // imp.getImage() returns a stale cached Image and the canvas
            // stays black after setPixels().
            if (imageUpdated) {
                imageUpdated = false;
                imp.updateImage();
            }
            // Draw the current viewport ByteProcessor at 1:1 into the canvas.
            Image img = imp.getImage();
            if (img != null) {
                g.drawImage(img, 0, 0, getWidth(), getHeight(), null);
            }
            // Standard overlay + ROI rendering via public Roi.draw(Graphics)
            // — internally Roi.draw calls ic.screenX/Y which transforms
            // level-0 → display via srcRect + magnification.
            Overlay overlay = imp.getOverlay();
            if (overlay != null) {
                for (int i = 0; i < overlay.size(); i++) {
                    Roi r = overlay.get(i);
                    if (r != null) {
                        r.setImage(imp);
                        r.draw(g);
                    }
                }
            }
            Roi roi = imp.getRoi();
            if (roi != null) {
                roi.setImage(imp);
                roi.draw(g);
            }
        } catch (Throwable t) {
            IJ.log("[LazyImageCanvas.paint] " + t);
        }
    }

    @Override
    public void update(Graphics g) { paint(g); }

    /**
     * Override HAND-tool / space-bar scroll so it doesn't clamp srcRect into
     * the level-0 image bounds. Stock ImageCanvas.scroll clamps
     * srcRect.x,y to [0, imageWidth - srcRect.width]; when srcRect is
     * larger than the image (deep zoom-out) that makes the range empty,
     * pinning the image to the canvas corner. We want the user to be able
     * to freely pan with black margins even when zoomed all the way out.
     */
    @Override
    protected void scroll(int sx, int sy) {
        if (srcRect == null) return;
        int ox = xSrcStart + (int) (sx / magnification);
        int oy = ySrcStart + (int) (sy / magnification);
        int newx = xSrcStart + (xMouseStart - ox);
        int newy = ySrcStart + (yMouseStart - oy);
        srcRect.x = newx;
        srcRect.y = newy;
        imp.draw();
        Thread.yield();
    }

    /**
     * Force the canvas state into its level-0 coordinate space. Call this
     *   - right after the constructor (ImageWindow's layout pass resets
     *     magnification during pack()),
     *   - after any setProcessor()-triggered reset.
     * Directly mutates the protected fields rather than going through
     * setSourceRect(), which clamps against imp.getWidth() — that's the
     * viewport-processor width, not the level-0 width we want.
     */
    public void lockViewportToLevel0() {
        imageWidth  = lip.level0Width();
        imageHeight = lip.level0Height();
        if (srcRect == null
                || srcRect.width > imageWidth || srcRect.height > imageHeight
                || srcRect.width <= 0) {
            srcRect = new java.awt.Rectangle(0, 0, imageWidth, imageHeight);
        }
        if (dstWidth == 0) {
            java.awt.Dimension d = getSize();
            dstWidth = d.width;
            dstHeight = d.height;
        }
        magnification = (double) dstWidth / srcRect.width;
    }

    /**
     * Allow srcRect to span beyond the level-0 image bounds — that's how we
     * let the user zoom out far enough to see the whole image with black
     * margins around it. Only clamp for size-0 degenerate rects and update
     * magnification from dstWidth / srcRect.width.
     */
    @Override
    public void setSourceRect(java.awt.Rectangle r) {
        if (r == null) return;
        imageWidth  = lip.level0Width();
        imageHeight = lip.level0Height();
        java.awt.Rectangle c = new java.awt.Rectangle(r);
        if (c.width  < 1) c.width  = 1;
        if (c.height < 1) c.height = 1;
        srcRect = c;
        if (dstWidth == 0) {
            java.awt.Dimension size = getSize();
            dstWidth = size.width;
            dstHeight = size.height;
        }
        magnification = (double) dstWidth / srcRect.width;
    }

    private void detectAndPropagateSrcRectChange() {
        Rectangle r = getSrcRect();
        if (lastObservedSrcRect == null
                || r.x != lastObservedSrcRect.x
                || r.y != lastObservedSrcRect.y
                || r.width != lastObservedSrcRect.width
                || r.height != lastObservedSrcRect.height
                || magnification != lastObservedMag) {
            lastObservedSrcRect = new Rectangle(r);
            lastObservedMag = magnification;
            lip.onCanvasViewChanged(r, magnification);
        }
    }

    /** Public helper so setView() can lock srcRect + magnification atomically. */
    public void setViewport(Rectangle r, double mag) {
        srcRect = new Rectangle(r);
        magnification = mag;
        lastObservedSrcRect = new Rectangle(r);
        lastObservedMag = mag;
    }

    /** Expose the protected srcRect field to our ImagePlus. */
    public Rectangle currentSrcRect() { return new Rectangle(srcRect); }
    public double currentMagnification() { return magnification; }
}
