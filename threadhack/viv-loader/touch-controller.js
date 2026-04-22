// ============================================================
//  touch-controller.js — unified pan + pinch for LazyImagePlus.
//
//  Semantics (frame-to-frame; pinch ≡ pan + scroll-zoom at midpoint):
//    1-finger drag → pan; 2-finger → pinch + pan around midpoint.
//
//  Robustness: we track active touches OURSELVES from changedTouches
//  (event.touches flakes on iOS/Safari during pinch — stationary
//  fingers are sometimes omitted, which would make pinch degenerate
//  into a 1-finger pan that jumps to whichever finger moved last).
//
//  Performance: single setSourceRect+repaint per rAF frame; cached
//  Rectangle class ref; no per-touchmove CheerpJ round-trip for reads.
// ============================================================

(function () {
  const MOVE_THRESHOLD_PX = 6;

  function install() {
    const display = document.getElementById('cheerpjDisplay');
    if (!display) return false;
    if (display.__tc_installed) return true;
    display.__tc_installed = true;

    let ic = null;                    // cached LazyImageCanvas ref
    let RectangleCls = null;          // cached java.awt.Rectangle
    let canvasRect = null;
    const active = new Map();         // id → { x, y } — our own source of truth
    let lastPts = [];                 // [{id,x,y}] — snapshot at last frame
    let lastView = null;              // { x, y, w, h, mag } at last frame
    let movedEnough = false;
    let gestureReady = false;         // true once touchstart setup completed

    // rAF coalescer: touchmove enqueues; only the latest apply runs per frame.
    let nextApply = null;
    let rafPending = false;

    function findCanvasAt(clientX, clientY) {
      let el = document.elementFromPoint(clientX, clientY);
      while (el && el !== display) {
        if (el.tagName === 'CANVAS') {
          const r = el.getBoundingClientRect();
          if (r.width > 100 && r.height > 100) return el;
        }
        el = el.parentElement;
      }
      return null;
    }

    async function primeRefs() {
      if (!window.__omeImp) return false;
      try {
        if (!ic) ic = await window.__omeImp.getCanvas();
        if (!ic) return false;
        if (!RectangleCls && window.lib) {
          RectangleCls = await window.lib.java.awt.Rectangle;
        }
        return !!RectangleCls;
      } catch { return false; }
    }

    async function fetchView() {
      const sr = await ic.getSrcRect();
      return {
        x: await sr.x, y: await sr.y,
        w: await sr.width, h: await sr.height,
        mag: await ic.getMagnification()
      };
    }

    async function applyView(x, y, w, h) {
      try {
        const r = await new RectangleCls(
          Math.round(x), Math.round(y),
          Math.max(1, Math.round(w)), Math.max(1, Math.round(h))
        );
        await ic.setSourceRect(r);
        await ic.repaint();
      } catch (e) { console.warn('[touch] apply:', e && (e.message || e)); }
    }

    function scheduleApply(x, y, w, h) {
      nextApply = { x, y, w, h };
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(async () => {
        rafPending = false;
        const a = nextApply; nextApply = null;
        if (a && ic) await applyView(a.x, a.y, a.w, a.h);
      });
    }

    function ptsArray() {
      return Array.from(active, ([id, p]) => ({ id, x: p.x, y: p.y }));
    }

    function mid(pts) {
      if (pts.length === 1) return { x: pts[0].x, y: pts[0].y };
      return {
        x: (pts[0].x + pts[1].x) / 2,
        y: (pts[0].y + pts[1].y) / 2,
      };
    }

    function distPair(pts) {
      if (pts.length < 2) return 0;
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }

    function rebase() {
      // Capture the current tracked state as the reference for future
      // frame-to-frame transforms. Call this on touchstart / touchend to
      // avoid jumps when the finger count changes.
      lastPts = ptsArray();
    }

    display.addEventListener('touchstart', async (e) => {
      // Always record the new touches so we have accurate state even before
      // ic is primed.
      for (const t of e.changedTouches) {
        active.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
      const ok = await primeRefs();
      if (!ok) return;
      const anchor = e.changedTouches[0] || e.touches[0];
      const cvs = findCanvasAt(anchor.clientX, anchor.clientY);
      if (!cvs) return;
      canvasRect = cvs.getBoundingClientRect();
      lastView = await fetchView();
      rebase();
      movedEnough = false;
      gestureReady = true;
      if (active.size >= 2) e.preventDefault();
    }, { passive: false, capture: true });

    display.addEventListener('touchmove', (e) => {
      // Update tracked positions from changedTouches (reliable).
      for (const t of e.changedTouches) {
        if (active.has(t.identifier)) {
          active.set(t.identifier, { x: t.clientX, y: t.clientY });
        }
      }
      if (!gestureReady || !ic || !lastView || lastPts.length === 0) return;

      const cur = ptsArray();
      if (cur.length === 0) return;

      // For frame-to-frame transforms we need the last-frame positions of
      // EXACTLY the fingers currently active (by id).
      const curSubset = cur.filter(p => lastPts.some(q => q.id === p.id));
      if (curSubset.length === 0) return;
      const lastSubset = lastPts.filter(p => curSubset.some(q => q.id === p.id));

      // Prefer 2-finger gesture state when at least two tracked fingers
      // continue from the last frame — avoids the browser's stationary-
      // finger dropout from collapsing pinch into 1-finger pan.
      const twoF = curSubset.length >= 2 && lastSubset.length >= 2;

      // Build arrays of the same ids in matching order.
      const mkPair = (src) => {
        if (src.length >= 2) return [src[0], src[1]];
        return [src[0]];
      };
      const curPair = mkPair(curSubset);
      const lastPair = curPair.map(p => lastSubset.find(q => q.id === p.id)).filter(Boolean);
      if (curPair.length !== lastPair.length) return;

      const curMidPage = mid(curPair);
      const lastMidPage = mid(lastPair);
      const curMid = { x: curMidPage.x - canvasRect.left, y: curMidPage.y - canvasRect.top };
      const lastMid = { x: lastMidPage.x - canvasRect.left, y: lastMidPage.y - canvasRect.top };

      if (!twoF) {
        // 1-finger drag → pure pan; apply the movement threshold.
        const dx = curMid.x - lastMid.x;
        const dy = curMid.y - lastMid.y;
        if (!movedEnough && Math.hypot(dx, dy) < MOVE_THRESHOLD_PX) return;
        movedEnough = true;
      }
      e.preventDefault();

      const curDist = twoF ? distPair(curPair) : 0;
      const lastDist = twoF ? distPair(lastPair) : 0;
      const scale = (twoF && lastDist > 1 && curDist > 1) ? (curDist / lastDist) : 1.0;
      const newMag = Math.max(1e-5, Math.min(32, lastView.mag * scale));

      // Level-0 coord under LAST midpoint in the LAST view = anchor.
      const anchorX = lastView.x + lastMid.x / lastView.mag;
      const anchorY = lastView.y + lastMid.y / lastView.mag;
      // Position srcRect so anchor lands at current midpoint in new view.
      const newSrcX = anchorX - curMid.x / newMag;
      const newSrcY = anchorY - curMid.y / newMag;
      const newSrcW = canvasRect.width  / newMag;
      const newSrcH = canvasRect.height / newMag;
      scheduleApply(newSrcX, newSrcY, newSrcW, newSrcH);

      lastView = { x: newSrcX, y: newSrcY, w: newSrcW, h: newSrcH, mag: newMag };
      lastPts = cur;
    }, { passive: false, capture: true });

    function onEnd(e) {
      for (const t of e.changedTouches) active.delete(t.identifier);
      if (active.size === 0) {
        ic = null; canvasRect = null; lastView = null; lastPts = [];
        gestureReady = false; movedEnough = false;
      } else {
        // Finger count changed — rebase against current state so the next
        // touchmove doesn't apply a transform computed from the old finger
        // set.
        if (ic) {
          fetchView().then(v => { lastView = v; rebase(); });
        } else {
          rebase();
        }
      }
    }
    display.addEventListener('touchend',    onEnd, { passive: false, capture: true });
    display.addEventListener('touchcancel', onEnd, { passive: false, capture: true });

    console.log('[touch-controller] installed on #cheerpjDisplay');
    return true;
  }

  if (!install()) {
    const obs = new MutationObserver(() => { if (install()) obs.disconnect(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();
