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
            // Draw the current viewport ByteProcessor at 1:1 into the canvas.
            // Its pixels are already the correct contents for the current
            // srcRect / magnification, produced by lip.refresh().
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
     * Stock ImageCanvas.updateImage resets imageWidth / imageHeight / srcRect
     * to the processor's dimensions. Our processor is viewport-sized (viewW
     * × viewH) but the canvas must hold level-0 dimensions + level-0 srcRect.
     * We only need to flag that the AWT Image needs rebuilding from the
     * processor — which repaint() will do.
     */
    @Override
    public void updateImage(ij.process.ImageProcessor ip) {
        imageUpdated = true;
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
