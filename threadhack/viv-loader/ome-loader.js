// ============================================================
//  ome-loader.js — seamless OME-TIFF/OME-Zarr viewer + ImageJ bridge
// ============================================================
//
//  Activated by ?load=<URL>. Spawns a Google-Maps-style tile
//  viewer on top of the page: pan by drag, zoom by wheel.
//  Automatic pyramid-level selection (higher zoom → higher-res
//  level). Tiles fetched lazily via geotiff.js / zarrita.js.
//
//  A floating "→ ImageJ" button sends the current viewport's
//  pixels into ImageJ as a new ImagePlus — every stock ImageJ
//  operation then works on that snapshot.
// ============================================================

// --- LOAD-TIME DIAGNOSTIC (visible even if nothing else executes) -----------
console.log("[ome-loader] module script evaluated");
window.addEventListener("error", (ev) => {
  if (ev.filename && ev.filename.includes("ome-loader.js")) {
    console.error("[ome-loader] window error:", ev.message, "at", ev.lineno + ":" + ev.colno);
  }
});
window.addEventListener("unhandledrejection", (ev) => {
  try {
    const s = String(ev.reason && (ev.reason.stack || ev.reason.message || ev.reason));
    if (s.includes("ome-loader") || s.includes("geotiff") || s.includes("zarrita")) {
      console.error("[ome-loader] unhandled rejection:", s);
    }
  } catch {}
});
// ----------------------------------------------------------------------------

const BUDGET_PX_EDGE = 2048;    // max side length for any single-view IJ snapshot
const TILE_PIX = 512;           // virtual tile size in level-zero pixel space

// -- module-level mutable state (hoisted above the IIFE to avoid TDZ) --------
let ui;
let view;          // { scale, tx, ty }
let provider;
let dragState;
const tileCache = new Map();       // level|ti|tj → { bitmap, width, height }
const fetchInFlight = new Map();   // level|ti|tj → Promise
// ----------------------------------------------------------------------------

(async () => {
  const params = new URLSearchParams(location.search);
  const url = params.get("load") || params.get("ome") || window.__omeLoad;
  console.log("[ome-loader] IIFE running; url =", url);
  if (!url) return;

  buildUi();
  updateStatus("waiting for ImageJ…");
  await waitForImageJ();

  try {
    const isZarr = /\.zarr(\/|$)/.test(url);
    const provider = isZarr ? await zarrProvider(url) : await tiffProvider(url);
    window.__tileProvider = provider;
    updateStatus(`loaded: ${provider.levels.length} levels, base ${provider.levels[0].w}×${provider.levels[0].h}`);
    startViewer(provider);
  } catch (e) {
    console.error("[ome-loader]", e);
    updateStatus("error: " + (e && e.message || e), true);
  }
})();

// ========================================================================
//  UI chrome
// ========================================================================
function buildUi() {
  ui = {};
  const root = document.createElement("div");
  root.id = "__ome_loader_root__";
  root.style.cssText = "position:fixed;inset:0;z-index:99998;pointer-events:none;";
  document.body.appendChild(root);

  // Full-page canvas viewer (hidden until data loads)
  const canvas = document.createElement("canvas");
  canvas.id = "__ome_canvas__";
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;" +
    "background:#000;cursor:grab;pointer-events:auto;display:none;";
  root.appendChild(canvas);
  ui.canvas = canvas;
  ui.ctx = canvas.getContext("2d", { willReadFrequently: true });

  // Status pill
  const status = document.createElement("div");
  status.id = "__ome_status__";
  status.style.cssText = "position:absolute;top:8px;left:8px;z-index:2;" +
    "background:#1e293b;color:#fff;padding:6px 12px;border-radius:4px;" +
    "font:12px ui-monospace,Menlo,monospace;box-shadow:0 2px 6px #0006;" +
    "max-width:500px;pointer-events:auto;";
  root.appendChild(status);
  ui.status = status;

  // Control panel (hidden until data loads)
  const controls = document.createElement("div");
  controls.style.cssText = "position:absolute;bottom:12px;left:50%;transform:translateX(-50%);" +
    "z-index:3;background:#1e293b;color:#fff;padding:8px 14px;border-radius:6px;" +
    "font:12px ui-monospace,Menlo,monospace;box-shadow:0 4px 12px #0008;" +
    "display:none;flex-direction:row;gap:8px;align-items:center;pointer-events:auto;";
  controls.id = "__ome_controls__";
  root.appendChild(controls);
  ui.controls = controls;

  const btn = (label, bg, onClick) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = `font:inherit;padding:6px 12px;background:${bg};color:#fff;` +
      "border:0;border-radius:4px;cursor:pointer;";
    b.onclick = onClick;
    return b;
  };

  ui.sendBtn = btn("→ ImageJ", "#2563eb", () => sendViewToImageJ());
  controls.appendChild(ui.sendBtn);

  ui.minBtn = btn("Minimise", "#475569", () => {
    const on = ui.canvas.style.display === "none";
    ui.canvas.style.display = on ? "block" : "none";
    ui.controls.style.display = on ? "flex" : "none";
    ui.minBtn.textContent = on ? "Minimise" : "Maximise";
    if (on) render();
  });
  controls.appendChild(ui.minBtn);

  ui.infoEl = document.createElement("span");
  ui.infoEl.style.cssText = "margin-left:8px;color:#cbd5e1;";
  controls.appendChild(ui.infoEl);
}

function updateStatus(msg, error=false) {
  if (!ui) return;
  ui.status.textContent = "[ome-loader] " + msg;
  ui.status.style.background = error ? "#b91c1c" : "#1e293b";
}

function waitForImageJ() {
  return new Promise(res => {
    if (window.IJ && window.lib) return res();
    const t = setInterval(() => { if (window.IJ && window.lib) { clearInterval(t); res(); } }, 300);
  });
}

// ========================================================================
//  Tile provider interface:
//    provider.levels    = [{ w, h, scaleFactor }]     index 0 = highest-res
//    provider.bitsPerSample = 8 | 16 | 32
//    provider.channels  = number of channels
//    provider.getRegion(level, x, y, w, h) → { data, width, height }
// ========================================================================
async function tiffProvider(url) {
  updateStatus("fetching geotiff.js + metadata…");
  const GT = await import("https://esm.sh/geotiff@2");
  const tiff = await Promise.race([
    GT.fromUrl(url),
    timeout(45_000, "geotiff fromUrl timed out")
  ]);
  const count = await tiff.getImageCount();
  const levels = [];
  let bits = 8, channels = 1;
  for (let i = 0; i < count; i++) {
    const img = await tiff.getImage(i);
    const w = img.getWidth(), h = img.getHeight();
    levels.push({ w, h, image: img });
    if (i === 0) {
      const b = img.getBitsPerSample();
      bits = Array.isArray(b) ? b[0] : b;
      channels = img.getSamplesPerPixel();
    }
  }
  // Sort levels highest-res first, compute scaleFactor relative to level 0.
  levels.sort((a, b) => b.w * b.h - a.w * a.h);
  for (const L of levels) L.scaleFactor = levels[0].w / L.w;

  return {
    kind: "tiff", url,
    levels, bitsPerSample: bits, channels,
    async getRegion(level, x, y, w, h) {
      const L = levels[level];
      const x0 = clamp(Math.floor(x), 0, L.w);
      const y0 = clamp(Math.floor(y), 0, L.h);
      const x1 = clamp(Math.ceil(x + w), 0, L.w);
      const y1 = clamp(Math.ceil(y + h), 0, L.h);
      if (x1 <= x0 || y1 <= y0) return { data: null, width: 0, height: 0 };
      const rasters = await L.image.readRasters({ window: [x0, y0, x1, y1] });
      const pixels = rasters[0];
      return { data: pixels, width: x1 - x0, height: y1 - y0, dx: x0, dy: y0 };
    }
  };
}

async function zarrProvider(url) {
  updateStatus("fetching zarrita.js + metadata…");
  const zarrita = await import("https://esm.sh/zarrita");
  const store = (zarrita.withConsolidated ? await zarrita.withConsolidated(new zarrita.FetchStore(url)) : new zarrita.FetchStore(url));
  const grp = await zarrita.open.asGroup(zarrita.root(store));
  const ms = grp.attrs && grp.attrs.multiscales;
  if (!ms || !ms.length) throw new Error("no OME-Zarr multiscales metadata");
  const datasets = ms[0].datasets;

  const levels = [];
  let bits = 8, channels = 1;
  for (const d of datasets) {
    const arr = await zarrita.open.asArray(zarrita.resolve(store, d.path));
    const shape = arr.shape;
    const [w, h] = [shape[shape.length - 1], shape[shape.length - 2]];
    levels.push({ w, h, array: arr, shape, path: d.path });
    // approximate bits from dtype
    const dt = String(arr.dtype || "").toLowerCase();
    bits = dt.includes("16") ? 16 : dt.includes("32") ? 32 : 8;
  }
  levels.sort((a, b) => b.w * b.h - a.w * a.h);
  for (const L of levels) L.scaleFactor = levels[0].w / L.w;

  return {
    kind: "zarr", url,
    levels, bitsPerSample: bits, channels,
    async getRegion(level, x, y, w, h) {
      const L = levels[level];
      const x0 = clamp(Math.floor(x), 0, L.w);
      const y0 = clamp(Math.floor(y), 0, L.h);
      const x1 = clamp(Math.ceil(x + w), 0, L.w);
      const y1 = clamp(Math.ceil(y + h), 0, L.h);
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

function timeout(ms, label) {
  return new Promise((_, rej) => setTimeout(() => rej(new Error(label + " (" + ms + "ms)")), ms));
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ========================================================================
//  Tile viewer: pan/zoom, pyramid-aware, Google-Maps-like
// ========================================================================
function startViewer(p) {
  provider = p;
  ui.canvas.style.display = "block";
  ui.controls.style.display = "flex";
  ui.minBtn.textContent = "Minimise";
  resizeCanvas();
  // Fit image to canvas
  const L0 = provider.levels[0];
  const fit = Math.min(ui.canvas.width / L0.w, ui.canvas.height / L0.h);
  view = { scale: fit, tx: (ui.canvas.width - L0.w * fit) / 2, ty: (ui.canvas.height - L0.h * fit) / 2 };

  window.addEventListener("resize", resizeCanvas);
  ui.canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  ui.canvas.addEventListener("wheel", onWheel, { passive: false });
  render();
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = ui.canvas.getBoundingClientRect();
  ui.canvas.width  = Math.max(2, Math.floor(rect.width  * dpr));
  ui.canvas.height = Math.max(2, Math.floor(rect.height * dpr));
  if (view) render();
}

function onMouseDown(e) {
  ui.canvas.style.cursor = "grabbing";
  dragState = { x0: e.clientX, y0: e.clientY, tx0: view.tx, ty0: view.ty };
  e.preventDefault();
}
function onMouseMove(e) {
  if (!dragState) return;
  const dpr = window.devicePixelRatio || 1;
  view.tx = dragState.tx0 + (e.clientX - dragState.x0) * dpr;
  view.ty = dragState.ty0 + (e.clientY - dragState.y0) * dpr;
  render();
}
function onMouseUp() {
  ui.canvas.style.cursor = "grab";
  dragState = null;
}

function onWheel(e) {
  e.preventDefault();
  const dpr = window.devicePixelRatio || 1;
  const rect = ui.canvas.getBoundingClientRect();
  const cx = (e.clientX - rect.left) * dpr;
  const cy = (e.clientY - rect.top)  * dpr;
  // Point on level-0 image under cursor
  const ix = (cx - view.tx) / view.scale;
  const iy = (cy - view.ty) / view.scale;
  const factor = Math.pow(1.15, -Math.sign(e.deltaY));
  view.scale = clamp(view.scale * factor, 0.001, 64);
  // Keep the image point under the cursor
  view.tx = cx - ix * view.scale;
  view.ty = cy - iy * view.scale;
  render();
}

function pickLevel() {
  // Pick the pyramid level whose scaleFactor is closest to (1/view.scale) but >= 1/view.scale.
  // A level where 1 level-pixel ≈ 1 canvas-pixel is ideal. scaleFactor tells us how many level-0
  // pixels map to one level-N pixel. We want: scaleFactor ≈ 1/view.scale.
  const target = 1 / view.scale;
  let best = 0, bestErr = Infinity;
  for (let i = 0; i < provider.levels.length; i++) {
    const sf = provider.levels[i].scaleFactor;
    if (sf <= target * 1.2) {   // prefer slightly more detail than needed
      const err = target - sf;
      if (err < bestErr) { bestErr = err; best = i; }
    }
  }
  return best;
}

function render() {
  if (!view || !provider) return;
  const { ctx } = ui;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);

  const level = pickLevel();
  const L = provider.levels[level];
  const sf = L.scaleFactor;
  const levelScale = view.scale * sf;   // one level-pixel → levelScale canvas-pixels

  // Viewport in level-space
  const vx = -view.tx / levelScale;
  const vy = -view.ty / levelScale;
  const vw = ui.canvas.width  / levelScale;
  const vh = ui.canvas.height / levelScale;

  updateInfo(level, vw, vh);

  // Tiles in level space (tile = TILE_PIX × TILE_PIX)
  const ti0 = Math.max(0, Math.floor(vx / TILE_PIX));
  const tj0 = Math.max(0, Math.floor(vy / TILE_PIX));
  const ti1 = Math.min(Math.ceil(L.w / TILE_PIX), Math.ceil((vx + vw) / TILE_PIX));
  const tj1 = Math.min(Math.ceil(L.h / TILE_PIX), Math.ceil((vy + vh) / TILE_PIX));

  for (let tj = tj0; tj < tj1; tj++) {
    for (let ti = ti0; ti < ti1; ti++) {
      const key = level + "|" + ti + "|" + tj;
      let tile = tileCache.get(key);
      if (!tile) {
        fetchTile(level, ti, tj);   // schedule async; will render on arrive
        continue;
      }
      const tx = ti * TILE_PIX * levelScale + view.tx;
      const ty = tj * TILE_PIX * levelScale + view.ty;
      const tw = tile.width  * levelScale;
      const th = tile.height * levelScale;
      ctx.save();
      ctx.imageSmoothingEnabled = levelScale < 2;
      ctx.drawImage(tile.bitmap, tx, ty, tw, th);
      ctx.restore();
    }
  }
}

async function fetchTile(level, ti, tj) {
  const key = level + "|" + ti + "|" + tj;
  if (fetchInFlight.has(key)) return;
  const p = (async () => {
    const L = provider.levels[level];
    const x = ti * TILE_PIX, y = tj * TILE_PIX;
    const w = Math.min(TILE_PIX, L.w - x);
    const h = Math.min(TILE_PIX, L.h - y);
    try {
      const region = await provider.getRegion(level, x, y, w, h);
      if (!region.data) return;
      const bitmap = await rasterToBitmap(region.data, region.width, region.height, provider.bitsPerSample);
      tileCache.set(key, { bitmap, width: region.width, height: region.height });
      render();
    } catch (e) {
      console.warn("[ome-loader] tile fetch failed:", e);
    } finally {
      fetchInFlight.delete(key);
    }
  })();
  fetchInFlight.set(key, p);
}

async function rasterToBitmap(pixels, w, h, bits) {
  const rgba = new Uint8ClampedArray(w * h * 4);
  // Simple min/max auto-contrast on this tile
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < pixels.length; i++) {
    const v = pixels[i];
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const range = (hi - lo) || 1;
  for (let i = 0; i < w * h; i++) {
    const v = Math.max(0, Math.min(255, Math.round(((pixels[i] - lo) / range) * 255)));
    rgba[i*4]   = v;
    rgba[i*4+1] = v;
    rgba[i*4+2] = v;
    rgba[i*4+3] = 255;
  }
  return await createImageBitmap(new ImageData(rgba, w, h));
}

function updateInfo(level, vw, vh) {
  if (!ui.infoEl) return;
  const L = provider.levels[level];
  ui.infoEl.textContent = `level ${level}/${provider.levels.length-1}  (${L.w}×${L.h})  view ${Math.round(vw)}×${Math.round(vh)} lvl-px  zoom ${view.scale.toFixed(3)}×`;
}

// ========================================================================
//  Send current viewport → ImageJ as an ImagePlus
// ========================================================================
async function sendViewToImageJ() {
  if (!provider) return;
  ui.sendBtn.disabled = true; ui.sendBtn.textContent = "loading…";
  try {
    const level = pickLevel();
    const L = provider.levels[level];
    const sf = L.scaleFactor;
    const levelScale = view.scale * sf;
    const vx = -view.tx / levelScale;
    const vy = -view.ty / levelScale;
    const vw = ui.canvas.width  / levelScale;
    const vh = ui.canvas.height / levelScale;
    // Clamp & downscale if the viewport is too big to ship as a single ImagePlus
    let rx = Math.max(0, Math.floor(vx));
    let ry = Math.max(0, Math.floor(vy));
    let rw = Math.min(L.w, Math.ceil(vw));
    let rh = Math.min(L.h, Math.ceil(vh));
    if (rw > BUDGET_PX_EDGE || rh > BUDGET_PX_EDGE) {
      // Pick a coarser level that fits
      const needed = Math.max(rw, rh) / BUDGET_PX_EDGE;
      for (let i = 0; i < provider.levels.length; i++) {
        const sf2 = provider.levels[i].scaleFactor;
        if (sf2 >= sf * needed) {
          rx = Math.floor(rx * sf / sf2);
          ry = Math.floor(ry * sf / sf2);
          rw = Math.ceil(rw * sf / sf2);
          rh = Math.ceil(rh * sf / sf2);
          updateStatus(`viewport too large; using level ${i} → ${rw}×${rh}`);
          const region = await provider.getRegion(i, rx, ry, rw, rh);
          await handToImageJ(region, provider.bitsPerSample);
          return;
        }
      }
    }
    const region = await provider.getRegion(level, rx, ry, rw, rh);
    if (!region || !region.data) throw new Error("empty viewport");
    await handToImageJ(region, provider.bitsPerSample);
  } catch (e) {
    console.error("[ome-loader] send-to-IJ failed:", e);
    updateStatus("send-to-IJ failed: " + (e && e.message || e), true);
  } finally {
    ui.sendBtn.disabled = false; ui.sendBtn.textContent = "→ ImageJ";
  }
}

async function handToImageJ(region, bits) {
  const lib = window.lib;
  if (!lib) throw new Error("no ImageJ lib");
  const { data, width, height } = region;
  let processor;
  if (bits <= 8) {
    const u8 = (data instanceof Uint8Array) ? data : new Uint8Array(data);
    const BP = await lib.ij.process.ByteProcessor;
    processor = await new BP(width, height, u8);
  } else if (bits <= 16) {
    const s16 = (data instanceof Uint16Array) ? data
              : (data instanceof Int16Array)  ? new Uint16Array(data.buffer, data.byteOffset || 0, data.length)
              : new Uint16Array(data);
    const SP = await lib.ij.process.ShortProcessor;
    processor = await new SP(width, height, s16, null);
  } else {
    const f32 = (data instanceof Float32Array) ? data : new Float32Array(data);
    const FP = await lib.ij.process.FloatProcessor;
    processor = await new FP(width, height, f32);
  }
  const ImagePlus = await lib.ij.ImagePlus;
  const title = `view-${width}x${height}`;
  const imp = await new ImagePlus(title, processor);
  await imp.show();
  updateStatus(`opened ${width}×${height} in ImageJ — run any menu op`);
}
