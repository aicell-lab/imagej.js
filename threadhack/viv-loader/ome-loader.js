// ============================================================
//  ome-loader.js — native OME-TIFF/OME-Zarr loading INTO the
//  imagej.js window (no separate UI overlay).
//
//  Activated by ?load=<URL>. Behaviour:
//    1. Wait for ImageJ to finish booting.
//    2. Open the OME-TIFF/Zarr's pyramid metadata.
//    3. Load the largest pyramid level that fits the budget into a
//       standard ImagePlus and IJ.show() it.
//    4. Hook ImageJ's display canvas:
//         - mouse-wheel  = pyramid-aware zoom (re-fetch at the
//           appropriate resolution level + viewport, swap pixels)
//         - middle-mouse drag (or shift+drag) = pan (re-centre on
//           a new viewport, re-fetch + swap pixels)
//    5. Standard ImageJ tools (rectangle, ROI, +/- magnify, hand
//       tool) keep working on whatever's currently in the
//       ImagePlus, since the underlying ImagePlus IS the one ImageJ
//       opened — we just swap its pixel buffer on viewport changes.
// ============================================================

console.log("[ome-loader] module evaluated");

// -- module-level state -------------------------------------------------------
let provider = null;
let imp = null;
let lib = null;
let viewState = null;     // { level, cx, cy, zoom }   cx/cy in level-0 coords
let canvasEl = null;      // cheerpjDisplay <canvas> for the ImageJ display
let inflightSwap = false;
let swapPending = false;
const STATUS_ID = "__ome_loader_status__";

// -- entrypoint ---------------------------------------------------------------
(async () => {
  const params = new URLSearchParams(location.search);
  const url = params.get("load") || params.get("ome") || window.__omeLoad;
  if (!url) return;
  console.log("[ome-loader] URL:", url);

  buildStatus();
  setStatus("waiting for ImageJ…");
  await waitForImageJ();
  lib = window.lib;

  try {
    setStatus("reading metadata…");
    provider = /\.zarr(\/|$)/.test(url) ? await zarrProvider(url) : await tiffProvider(url);
    window.__omeProvider = provider;
    setStatus(`pyramid: ${provider.levels.length} levels (base ${provider.levels[0].w}×${provider.levels[0].h})`);

    // Pick the level that comfortably fits the budget for the initial display.
    const initialLevelIdx = pickFitLevel(provider, 2048);
    const L = provider.levels[initialLevelIdx];
    setStatus(`loading level ${initialLevelIdx} (${L.w}×${L.h})…`);
    const region = await provider.getRegion(initialLevelIdx, 0, 0, L.w, L.h);
    if (!region.data) throw new Error("empty initial region");
    imp = await openInImageJ(region, provider, region.title || titleFromUrl(url));

    // Centre + zoom in level-0 coordinate space.
    viewState = {
      level: initialLevelIdx,
      cx: provider.levels[0].w / 2,
      cy: provider.levels[0].h / 2,
      zoom: provider.levels[initialLevelIdx].w / provider.levels[0].w   // displayed scale
    };

    setStatus("hooking canvas…");
    await hookCheerpJCanvas();
    setStatus(`ready — wheel to zoom, shift+drag or middle-drag to pan`);
    setTimeout(() => setStatus(null), 6000);
  } catch (e) {
    console.error("[ome-loader]", e);
    setStatus("error: " + (e && e.message || e), true);
  }
})();

// =============================================================================
//  Tiny status pill (no other UI)
// =============================================================================
function buildStatus() {
  if (document.getElementById(STATUS_ID)) return;
  const el = document.createElement("div");
  el.id = STATUS_ID;
  el.style.cssText = "position:fixed;top:8px;right:8px;z-index:99999;" +
    "background:#1e293b;color:#fff;padding:6px 12px;border-radius:4px;" +
    "font:12px ui-monospace,Menlo,monospace;box-shadow:0 2px 6px #0006;" +
    "max-width:560px;pointer-events:none;";
  document.body.appendChild(el);
}
function setStatus(msg, error) {
  const el = document.getElementById(STATUS_ID);
  if (!el) return;
  if (msg == null) { el.style.display = "none"; return; }
  el.style.display = "block";
  el.style.background = error ? "#b91c1c" : "#1e293b";
  el.textContent = "[ome-loader] " + msg;
}

function waitForImageJ() {
  return new Promise(res => {
    if (window.IJ && window.lib) return res();
    const t = setInterval(() => { if (window.IJ && window.lib) { clearInterval(t); res(); } }, 300);
  });
}

function titleFromUrl(u) {
  const tail = (u || "").replace(/\/$/, "").split("/").pop() || "ome";
  return tail.replace(/[?#].*$/, "");
}

function pickFitLevel(prov, edgeBudget) {
  // Largest level whose max(w,h) <= edgeBudget. If none, smallest.
  let best = null;
  for (let i = 0; i < prov.levels.length; i++) {
    const L = prov.levels[i];
    if (Math.max(L.w, L.h) <= edgeBudget) {
      if (best == null || L.w > prov.levels[best].w) best = i;
    }
  }
  if (best != null) return best;
  // fallback: smallest level
  let smallest = 0, smArea = Infinity;
  for (let i = 0; i < prov.levels.length; i++) {
    const a = prov.levels[i].w * prov.levels[i].h;
    if (a < smArea) { smArea = a; smallest = i; }
  }
  return smallest;
}

// =============================================================================
//  Provider interface (unchanged)
// =============================================================================
async function tiffProvider(url) {
  const GT = await import("https://esm.sh/geotiff@2");
  const tiff = await Promise.race([
    GT.fromUrl(url),
    timeout(45_000, "geotiff fromUrl timed out")
  ]);
  const raw = [];
  let bits = 8, channels = 1;
  const img0 = await tiff.getImage(0);
  raw.push({ w: img0.getWidth(), h: img0.getHeight(), image: img0, source: "top#0" });
  const bps = img0.getBitsPerSample();
  bits = Array.isArray(bps) ? bps[0] : bps;
  channels = img0.getSamplesPerPixel();
  const subIFDs = img0.fileDirectory && img0.fileDirectory.SubIFDs;
  if (subIFDs && subIFDs.length > 0) {
    for (let k = 0; k < subIFDs.length; k++) {
      try {
        const subDir = await tiff.parseFileDirectoryAt(Number(subIFDs[k]));
        const sub = new GT.GeoTIFFImage(subDir.fileDirectory, subDir.geoKeys, tiff.dataView, tiff.littleEndian, tiff.cache, tiff.source);
        raw.push({ w: sub.getWidth(), h: sub.getHeight(), image: sub, source: `sub${k}` });
      } catch (e) { console.warn("[ome-loader] SUBIFD failed:", e); }
    }
  } else {
    for (let i = 1; i < 8; i++) {
      try { const im = await tiff.getImage(i); raw.push({ w: im.getWidth(), h: im.getHeight(), image: im, source: `top#${i}` }); }
      catch { break; }
    }
  }
  // Dedupe by w*h, sort highest first
  const seen = new Set(); const levels = [];
  raw.sort((a, b) => b.w * b.h - a.w * a.h);
  for (const r of raw) { const k = r.w + "x" + r.h; if (!seen.has(k)) { seen.add(k); levels.push(r); } }
  for (const L of levels) L.scaleFactor = levels[0].w / L.w;

  return {
    kind: "tiff", url, levels, bitsPerSample: bits, channels,
    async getRegion(level, x, y, w, h) {
      const L = levels[level];
      const x0 = clamp(Math.floor(x), 0, L.w);
      const y0 = clamp(Math.floor(y), 0, L.h);
      const x1 = clamp(Math.ceil(x + w), 0, L.w);
      const y1 = clamp(Math.ceil(y + h), 0, L.h);
      if (x1 <= x0 || y1 <= y0) return { data: null, width: 0, height: 0 };
      const rasters = await L.image.readRasters({ window: [x0, y0, x1, y1] });
      return { data: rasters[0], width: x1 - x0, height: y1 - y0, dx: x0, dy: y0 };
    }
  };
}

async function zarrProvider(url) {
  const zarrita = await import("https://esm.sh/zarrita");
  const store = (zarrita.withConsolidated ? await zarrita.withConsolidated(new zarrita.FetchStore(url)) : new zarrita.FetchStore(url));
  const grp = await zarrita.open.asGroup(zarrita.root(store));
  const ms = grp.attrs && grp.attrs.multiscales;
  if (!ms || !ms.length) throw new Error("no multiscales metadata");
  const datasets = ms[0].datasets;
  const levels = [];
  let bits = 8;
  for (const d of datasets) {
    const arr = await zarrita.open.asArray(zarrita.resolve(store, d.path));
    const shape = arr.shape;
    const [w, h] = [shape[shape.length - 1], shape[shape.length - 2]];
    const dt = String(arr.dtype || "").toLowerCase();
    if (dt.includes("16")) bits = 16;
    else if (dt.includes("32")) bits = 32;
    levels.push({ w, h, array: arr, shape, path: d.path });
  }
  levels.sort((a, b) => b.w * b.h - a.w * a.h);
  for (const L of levels) L.scaleFactor = levels[0].w / L.w;
  return {
    kind: "zarr", url, levels, bitsPerSample: bits, channels: 1,
    async getRegion(level, x, y, w, h) {
      const L = levels[level];
      const x0 = clamp(Math.floor(x), 0, L.w), y0 = clamp(Math.floor(y), 0, L.h);
      const x1 = clamp(Math.ceil(x + w), 0, L.w), y1 = clamp(Math.ceil(y + h), 0, L.h);
      if (x1 <= x0 || y1 <= y0) return { data: null, width: 0, height: 0 };
      const ndim = L.shape.length;
      const sel = new Array(ndim).fill(0);
      sel[ndim - 1] = zarrita.slice(x0, x1);
      sel[ndim - 2] = zarrita.slice(y0, y1);
      const chunk = await zarrita.get(L.array, sel);
      return { data: chunk.data, width: x1 - x0, height: y1 - y0, dx: x0, dy: y0 };
    }
  };
}

function timeout(ms, label) { return new Promise((_, r) => setTimeout(() => r(new Error(label + " (" + ms + "ms)")), ms)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// =============================================================================
//  ImageJ bridge — create or update an ImagePlus from a region
// =============================================================================
async function openInImageJ(region, prov, title) {
  const ip = await makeProcessor(region.data, region.width, region.height, prov.bitsPerSample);
  const ImagePlus = await lib.ij.ImagePlus;
  const newImp = await new ImagePlus(title || "ome", ip);
  await newImp.show();
  return newImp;
}

async function makeProcessor(pixels, w, h, bits) {
  // CheerpJ library mode chokes on overload disambiguation when null is
  // passed for ColorModel. Construct the processor without a pixels arg
  // and then setPixels(...) — works for all ImageProcessor subclasses.
  if (bits <= 8) {
    const u8 = (pixels instanceof Uint8Array) ? pixels : new Uint8Array(pixels);
    const BP = await lib.ij.process.ByteProcessor;
    const p = await new BP(w, h);
    await p.setPixels(u8);
    return p;
  }
  if (bits <= 16) {
    const s16 = (pixels instanceof Uint16Array) ? pixels
              : (pixels instanceof Int16Array)  ? new Uint16Array(pixels.buffer, pixels.byteOffset || 0, pixels.length)
              : new Uint16Array(pixels);
    const SP = await lib.ij.process.ShortProcessor;
    const p = await new SP(w, h);
    await p.setPixels(s16);
    return p;
  }
  // 32-bit float fallback
  const f32 = (pixels instanceof Float32Array) ? pixels : new Float32Array(pixels);
  const FP = await lib.ij.process.FloatProcessor;
  const p = await new FP(w, h);
  await p.setPixels(f32);
  return p;
}

async function swapImpPixels(region, prov) {
  if (!imp) return;
  const ip = await makeProcessor(region.data, region.width, region.height, prov.bitsPerSample);
  await imp.setProcessor(ip);
  await imp.updateAndDraw();
}

// =============================================================================
//  Hook ImageJ's <canvas> for Google-Maps style wheel-zoom + drag-pan
// =============================================================================
async function hookCheerpJCanvas() {
  // Wait for the ImageJ display element to appear (cheerpjDisplay creates
  // canvases under #cheerpjDisplay container after imp.show()).
  for (let i = 0; i < 60; i++) {
    canvasEl = pickIJCanvas();
    if (canvasEl) break;
    await new Promise(r => setTimeout(r, 250));
  }
  if (!canvasEl) {
    console.warn("[ome-loader] could not find ImageJ <canvas> — skipping hook");
    return;
  }
  console.log("[ome-loader] hooked canvas:", canvasEl);
  canvasEl.addEventListener("wheel", onWheel, { passive: false, capture: true });
  canvasEl.addEventListener("mousedown", onMouseDown, { capture: true });
  window.addEventListener("mousemove", onMouseMove, { capture: true });
  window.addEventListener("mouseup", onMouseUp, { capture: true });
}

function pickIJCanvas() {
  // Choose the largest visible canvas inside cheerpjDisplay (the ImageJ
  // image window — bigger than the toolbar and any popup dialogs).
  const candidates = document.querySelectorAll("#cheerpjDisplay canvas");
  let best = null, bestArea = 0;
  for (const c of candidates) {
    const r = c.getBoundingClientRect();
    const a = r.width * r.height;
    if (a > bestArea && r.width > 100 && r.height > 100) { bestArea = a; best = c; }
  }
  return best;
}

let dragStart = null;

function onWheel(e) {
  if (!viewState || !provider) return;
  // Take over wheel: stop ImageJ from receiving it
  e.preventDefault();
  e.stopPropagation();

  const factor = Math.pow(1.2, -Math.sign(e.deltaY));
  const oldZoom = viewState.zoom;
  const newZoom = clamp(oldZoom * factor, 0.001, 32);
  // Zoom around cursor: keep the image-coord under cursor stable.
  const rect = canvasEl.getBoundingClientRect();
  const fx = (e.clientX - rect.left) / rect.width;       // 0..1 across canvas
  const fy = (e.clientY - rect.top)  / rect.height;
  // The image point under cursor (level-0 coords) should remain the same.
  // Compute viewport in level-0 coords at oldZoom centred on (cx,cy):
  const L0w = provider.levels[0].w, L0h = provider.levels[0].h;
  const oldVwL0 = canvasEl.clientWidth  / oldZoom;
  const oldVhL0 = canvasEl.clientHeight / oldZoom;
  const px = viewState.cx - oldVwL0/2 + fx * oldVwL0;
  const py = viewState.cy - oldVhL0/2 + fy * oldVhL0;
  viewState.zoom = newZoom;
  const newVwL0 = canvasEl.clientWidth  / newZoom;
  const newVhL0 = canvasEl.clientHeight / newZoom;
  viewState.cx = px - (fx - 0.5) * newVwL0;
  viewState.cy = py - (fy - 0.5) * newVhL0;
  // Clamp to image bounds
  viewState.cx = clamp(viewState.cx, 0, L0w);
  viewState.cy = clamp(viewState.cy, 0, L0h);
  scheduleSwap();
}

function onMouseDown(e) {
  // Only intercept middle button or shift+left, so normal IJ tools still work
  if (e.button !== 1 && !(e.button === 0 && e.shiftKey)) return;
  e.preventDefault(); e.stopPropagation();
  dragStart = { x: e.clientX, y: e.clientY, cx: viewState.cx, cy: viewState.cy };
}
function onMouseMove(e) {
  if (!dragStart || !viewState) return;
  e.preventDefault(); e.stopPropagation();
  const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
  // Convert canvas-pixel delta to level-0 delta
  const L0w = provider.levels[0].w, L0h = provider.levels[0].h;
  viewState.cx = clamp(dragStart.cx - dx / viewState.zoom, 0, L0w);
  viewState.cy = clamp(dragStart.cy - dy / viewState.zoom, 0, L0h);
  scheduleSwap();
}
function onMouseUp(e) {
  if (!dragStart) return;
  dragStart = null;
}

let swapTimer = null;
function scheduleSwap() {
  if (swapTimer) return;
  swapTimer = setTimeout(() => { swapTimer = null; doSwap(); }, 120);
}

async function doSwap() {
  if (!provider || !viewState || !imp) return;
  if (inflightSwap) { swapPending = true; return; }
  inflightSwap = true;
  try {
    // Pick pyramid level matching current zoom
    const target = 1 / viewState.zoom;
    let levelIdx = 0, bestErr = Infinity;
    for (let i = 0; i < provider.levels.length; i++) {
      const sf = provider.levels[i].scaleFactor;
      if (sf <= target * 1.2) {
        const err = target - sf;
        if (err < bestErr) { bestErr = err; levelIdx = i; }
      }
    }
    const L = provider.levels[levelIdx];
    const sf = L.scaleFactor;
    // Viewport in level-coords
    const cx = viewState.cx / sf;
    const cy = viewState.cy / sf;
    const vw = canvasEl.clientWidth  / viewState.zoom / sf;
    const vh = canvasEl.clientHeight / viewState.zoom / sf;
    const x0 = Math.max(0, Math.floor(cx - vw/2));
    const y0 = Math.max(0, Math.floor(cy - vh/2));
    const w  = Math.min(L.w - x0, Math.ceil(vw));
    const h  = Math.min(L.h - y0, Math.ceil(vh));
    if (w < 1 || h < 1) return;
    setStatus(`level ${levelIdx} @ ${L.w}×${L.h}, view ${w}×${h}`);
    const region = await provider.getRegion(levelIdx, x0, y0, w, h);
    if (!region.data) return;
    await swapImpPixels(region, provider);
    viewState.level = levelIdx;
  } catch (e) {
    console.error("[ome-loader] swap failed:", e);
    setStatus("swap error: " + (e && e.message || e), true);
  } finally {
    inflightSwap = false;
    if (swapPending) { swapPending = false; setTimeout(doSwap, 50); }
  }
}
