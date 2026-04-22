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
    // Frame-to-frame state: on every touchmove we transform the LAST state
    // by a small pan + zoom step. A gesture is therefore just a sequence of
    // independent "pan by midpoint delta, zoom by distance ratio at current
    // midpoint" increments — pinch ≡ pan + wheel-zoom, composed per frame.
    let lastTouches = [];      // [{id, x, y}] — positions at last frame
    let lastView = null;       // { x, y, w, h, mag } — srcRect at last frame
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
      icRef = await fetchIc();
      if (!icRef) return;
      const t0 = e.touches[0];
      const cvs = findCanvasAt(t0.clientX, t0.clientY);
      if (!cvs) return;
      canvasRect = cvs.getBoundingClientRect();
      lastView = await fetchView(icRef);
      lastTouches = [...e.touches].map(t => ({
        id: t.identifier, x: t.clientX, y: t.clientY
      }));
      movedEnough = false;
      if (e.touches.length >= 2) e.preventDefault();
    }, { passive: false, capture: true });

    display.addEventListener('touchmove', (e) => {
      if (!icRef || !lastView || lastTouches.length === 0) return;
      const touches = [...e.touches].filter(t =>
        lastTouches.some(s => s.id === t.identifier));
      if (touches.length === 0) return;

      // Current + previous midpoint (canvas-local), and current + previous
      // pair-distance (for pinch). For 1-finger pan, "distance" is 0 and we
      // only apply the pan step.
      const tCur = (n) => touches[n];
      const tLast = (n) => lastTouches.find(t => t.id === touches[n].identifier);
      let curMidX, curMidY, lastMidX, lastMidY;
      let curDist = 0, lastDist = 0;

      if (touches.length >= 2 && lastTouches.length >= 2) {
        const c1 = tCur(0), c2 = tCur(1);
        const l1 = tLast(0), l2 = tLast(1);
        if (!l1 || !l2) return;
        curMidX  = (c1.clientX + c2.clientX) / 2 - canvasRect.left;
        curMidY  = (c1.clientY + c2.clientY) / 2 - canvasRect.top;
        lastMidX = (l1.x + l2.x) / 2 - canvasRect.left;
        lastMidY = (l1.y + l2.y) / 2 - canvasRect.top;
        curDist  = Math.hypot(c1.clientX - c2.clientX, c1.clientY - c2.clientY);
        lastDist = Math.hypot(l1.x - l2.x, l1.y - l2.y);
        e.preventDefault();
      } else if (touches.length === 1) {
        const c = tCur(0);
        const l = tLast(0);
        if (!l) return;
        curMidX  = c.clientX - canvasRect.left;
        curMidY  = c.clientY - canvasRect.top;
        lastMidX = l.x - canvasRect.left;
        lastMidY = l.y - canvasRect.top;
        const dx = c.clientX - l.x;
        const dy = c.clientY - l.y;
        if (!movedEnough && Math.hypot(dx, dy) < MOVE_THRESHOLD_PX) return;
        movedEnough = true;
        e.preventDefault();
      } else {
        return;
      }

      // Level-0 coord that was under the previous midpoint (in lastView).
      const anchorX = lastView.x + lastMidX / lastView.mag;
      const anchorY = lastView.y + lastMidY / lastView.mag;
      // Scale step for this frame (1.0 for pure pan).
      const scale = (lastDist > 1 && curDist > 1) ? (curDist / lastDist) : 1.0;
      const newMag = Math.max(1e-5, Math.min(32, lastView.mag * scale));
      // Place srcRect so anchor lands under the current midpoint at the new mag.
      const newSrcX = anchorX - curMidX / newMag;
      const newSrcY = anchorY - curMidY / newMag;
      const newSrcW = canvasRect.width  / newMag;
      const newSrcH = canvasRect.height / newMag;
      scheduleApply(newSrcX, newSrcY, newSrcW, newSrcH);

      // Advance the reference frame: next move composes against THIS state.
      lastView = { x: newSrcX, y: newSrcY, w: newSrcW, h: newSrcH, mag: newMag };
      lastTouches = touches.map(t => ({ id: t.identifier, x: t.clientX, y: t.clientY }));
    }, { passive: false, capture: true });

    function onEnd(e) {
      if (e.touches && e.touches.length === 0) {
        icRef = null; lastView = null; lastTouches = []; canvasRect = null;
        movedEnough = false;
      } else if (e.touches) {
        // Some fingers lifted — rebase so the pinch↔pan transition doesn't
        // jump (level-0 anchor is computed from lastView × lastMidpoint).
        lastTouches = [...e.touches].map(t => ({
          id: t.identifier, x: t.clientX, y: t.clientY
        }));
        if (icRef) fetchView(icRef).then(v => { lastView = v; });
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
