// ============================================================
//  touch-controller.js — unified pan + pinch for LazyImagePlus.
//
//  Attaches to #cheerpjDisplay and maps touch gestures to the same
//  setSourceRect + repaint API that the mouse-wheel handler uses,
//  so pinch and wheel produce identical internal state.
//
//  Semantics:
//    • 1-finger drag → pan (srcRect translates in level-0 coords)
//    • 2-finger pinch → cursor-anchored zoom (level-0 point under
//       the start midpoint stays under the current midpoint)
//    • No preventDefault on touchstart — a plain tap still reaches
//       ImageJ as a click (so drawing-tool taps still work). We
//       preventDefault only once a gesture is unambiguous (>5 px
//       movement for 1-finger, any 2-finger touch).
// ============================================================

(function () {
  const MOVE_THRESHOLD_PX = 6;

  function install() {
    const display = document.getElementById('cheerpjDisplay');
    if (!display) return false;
    if (display.__tc_installed) return true;
    display.__tc_installed = true;

    let icRef = null;
    let canvasRect = null;
    let startView = null;      // { x, y, w, h, mag } at gesture start
    let startTouches = [];     // [{id, x, y}] at touchstart
    let movedEnough = false;

    // Coalesce rapid touchmoves into one CheerpJ call per frame.
    let nextApply = null;
    let rafPending = false;

    function findCanvasAt(clientX, clientY) {
      // Walk up from the point under the finger to the nearest CANVAS inside
      // cheerpjDisplay. This correctly picks the LazyImagePlus's image canvas
      // regardless of how many other CheerpJ windows (toolbar, menu,
      // plugin dialogs) are on the page.
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

    async function fetchIc() {
      if (!window.__omeImp) return null;
      try {
        const ic = await window.__omeImp.getCanvas();
        return ic || null;
      } catch { return null; }
    }

    async function fetchView(ic) {
      const sr = await ic.getSrcRect();
      return {
        x: await sr.x, y: await sr.y,
        w: await sr.width, h: await sr.height,
        mag: await ic.getMagnification()
      };
    }

    async function applyView(ic, x, y, w, h) {
      try {
        const Rectangle = await window.lib.java.awt.Rectangle;
        const r = await new Rectangle(
          Math.round(x), Math.round(y),
          Math.max(1, Math.round(w)), Math.max(1, Math.round(h))
        );
        await ic.setSourceRect(r);
        await ic.repaint();
      } catch (e) {
        console.warn('[touch] apply failed:', e && (e.message || e));
      }
    }

    function scheduleApply(x, y, w, h) {
      nextApply = { x, y, w, h };
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(async () => {
          rafPending = false;
          const a = nextApply;
          nextApply = null;
          if (a && icRef) await applyView(icRef, a.x, a.y, a.w, a.h);
        });
      }
    }

    display.addEventListener('touchstart', async (e) => {
      // Only engage if a LazyImagePlus is open.
      icRef = await fetchIc();
      if (!icRef) return;
      // Find the canvas under the first finger — that's the image canvas the
      // user is interacting with. getBoundingClientRect() on the *wrong*
      // canvas (e.g. a toolbar canvas above/beside the image) would shift the
      // pinch midpoint and make zoom appear off-center.
      const t0 = e.touches[0];
      const cvs = findCanvasAt(t0.clientX, t0.clientY);
      if (!cvs) return;
      canvasRect = cvs.getBoundingClientRect();
      startView = await fetchView(icRef);
      startTouches = [...e.touches].map(t => ({
        id: t.identifier, x: t.clientX, y: t.clientY
      }));
      movedEnough = false;
      if (e.touches.length >= 2) e.preventDefault();
    }, { passive: false, capture: true });

    display.addEventListener('touchmove', (e) => {
      if (!icRef || !startView || startTouches.length === 0) return;
      const touches = [...e.touches].filter(t =>
        startTouches.some(s => s.id === t.identifier));
      if (touches.length === 0) return;

      if (startTouches.length >= 2 && touches.length >= 2) {
        // --- pinch zoom ---
        e.preventDefault();
        const s1 = startTouches[0], s2 = startTouches[1];
        const c1 = touches.find(t => t.identifier === s1.id);
        const c2 = touches.find(t => t.identifier === s2.id);
        if (!c1 || !c2) return;
        const startDist = Math.hypot(s2.x - s1.x, s2.y - s1.y);
        if (startDist < 1) return;
        const curDist = Math.hypot(c2.clientX - c1.clientX, c2.clientY - c1.clientY);
        const newMag = Math.max(1e-5, Math.min(32, startView.mag * curDist / startDist));
        // Start midpoint in canvas-local coords.
        const sMidX = (s1.x + s2.x) / 2 - canvasRect.left;
        const sMidY = (s1.y + s2.y) / 2 - canvasRect.top;
        // Level-0 coord under start midpoint (fixed anchor for the gesture).
        const lMidX = startView.x + sMidX / startView.mag;
        const lMidY = startView.y + sMidY / startView.mag;
        // Current midpoint in canvas-local coords.
        const cMidX = (c1.clientX + c2.clientX) / 2 - canvasRect.left;
        const cMidY = (c1.clientY + c2.clientY) / 2 - canvasRect.top;
        // Solve: screen(lMidX) = (lMidX - newSrcX) * newMag = cMidX.
        const newSrcX = lMidX - cMidX / newMag;
        const newSrcY = lMidY - cMidY / newMag;
        const newSrcW = canvasRect.width  / newMag;
        const newSrcH = canvasRect.height / newMag;
        scheduleApply(newSrcX, newSrcY, newSrcW, newSrcH);
      } else if (touches.length === 1) {
        // --- 1-finger drag → pan ---
        const s = startTouches[0];
        const c = touches[0];
        const dx = c.clientX - s.x;
        const dy = c.clientY - s.y;
        if (!movedEnough && Math.hypot(dx, dy) < MOVE_THRESHOLD_PX) return;
        movedEnough = true;
        e.preventDefault();
        // srcRect moves opposite to the finger (image follows the finger).
        const newSrcX = startView.x - dx / startView.mag;
        const newSrcY = startView.y - dy / startView.mag;
        scheduleApply(newSrcX, newSrcY, startView.w, startView.h);
      }
    }, { passive: false, capture: true });

    function onEnd(e) {
      if (e.touches && e.touches.length === 0) {
        icRef = null; startView = null; startTouches = []; canvasRect = null;
        movedEnough = false;
      } else if (e.touches) {
        // Some fingers lifted; reset the reference frame for remaining
        // fingers so pinch→pan transitions don't jump.
        startTouches = [...e.touches].map(t => ({
          id: t.identifier, x: t.clientX, y: t.clientY
        }));
        // Re-read current view as new baseline.
        if (icRef) fetchView(icRef).then(v => { startView = v; });
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
