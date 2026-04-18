// ============================================================
//  ome-loader.js — load OME-TIFF / OME-Zarr into imagej.js
// ============================================================
//
//  Activated by any of:
//    - ?load=<URL>        single URL parameter
//    - ?ome=<URL>         alias
//    - window.__omeLoad = <URL>   programmatic
//
//  Loads the highest pyramid level whose width × height fits
//  within a configurable memory budget (default: 4096 × 4096),
//  then hands the pixel buffer to ImageJ as an ImagePlus so every
//  standard ImageJ operation works on it.
//
//  For OME-TIFF: uses geotiff.js (lightweight — no React/WebGL
//  dependencies unlike viv itself).
//  For OME-Zarr: uses zarrita.js (Martin Durant's minimalist
//  Zarr reader).
//
//  The loader does NOT take over the UI — it just sits alongside
//  ImageJ. A future Phase 2 would overlay a viv WebGL view and
//  route "send current viewport to ImageJ" through it.
// ============================================================

const MAX_DIM = 4096;    // largest pyramid level accepted
const MIN_DIM = 256;     // smallest pyramid level accepted (prefer bigger if fits)

(async () => {
  const params = new URLSearchParams(location.search);
  const url = params.get("load") || params.get("ome") || window.__omeLoad;
  if (!url) return;

  console.log("[ome-loader] URL detected:", url);

  status("queued — waiting for ImageJ to boot…");
  await waitForImageJ();
  status("loading image…");

  try {
    const isZarr = /\.zarr(\/|$)/.test(url);
    if (isZarr) await loadOmeZarr(url);
    else        await loadOmeTiff(url);
    status("done");
    setTimeout(hideStatus, 3000);
  } catch (e) {
    console.error("[ome-loader]", e);
    status("error: " + (e && e.message || e), "error");
  }
})();

// ---------- UI status pill ---------------------------------------------------
function statusEl() {
  let el = document.getElementById("__ome_loader_status__");
  if (!el) {
    el = document.createElement("div");
    el.id = "__ome_loader_status__";
    el.style.cssText = "position:fixed;top:8px;right:8px;z-index:99999;" +
      "background:#1e293b;color:#fff;padding:6px 12px;border-radius:4px;" +
      "font:12px ui-monospace,Menlo,monospace;box-shadow:0 2px 6px #0006;" +
      "max-width:340px;";
    document.body.appendChild(el);
  }
  return el;
}
function status(msg, kind) {
  const el = statusEl();
  el.style.background = kind === "error" ? "#b91c1c" : "#1e293b";
  el.textContent = "[ome-loader] " + msg;
  el.style.display = "block";
}
function hideStatus() { const el = document.getElementById("__ome_loader_status__"); if (el) el.style.display = "none"; }

// ---------- wait for ImageJ to be up ----------------------------------------
function waitForImageJ() {
  return new Promise(resolve => {
    if (window.IJ && window.lib) return resolve();
    const t = setInterval(() => {
      if (window.IJ && window.lib) { clearInterval(t); resolve(); }
    }, 300);
  });
}

// ---------- pick a pyramid level that fits -----------------------------------
function pickLevel(dimsList) {
  // dimsList: [[w0,h0],[w1,h1],…] highest-res first
  // prefer largest ≤ MAX_DIM; fall back to smallest if all exceed.
  for (const [w, h] of dimsList) {
    if (w <= MAX_DIM && h <= MAX_DIM && w >= MIN_DIM && h >= MIN_DIM) return dimsList.indexOf([w, h]);
  }
  // no fit → smallest
  let smallestIdx = 0, smallestArea = Infinity;
  for (let i = 0; i < dimsList.length; i++) {
    const [w, h] = dimsList[i];
    if (w * h < smallestArea) { smallestArea = w * h; smallestIdx = i; }
  }
  return smallestIdx;
}

// =============================================================================
//  OME-TIFF path (geotiff.js)
// =============================================================================
async function loadOmeTiff(url) {
  status("fetching geotiff.js…");
  const geoTiff = await import("https://esm.sh/geotiff@2");
  const tiff = await geoTiff.fromUrl(url);
  const count = await tiff.getImageCount();
  status(`OME-TIFF: ${count} pyramid levels`);

  // Gather dims per level
  const dims = [];
  for (let i = 0; i < count; i++) {
    const img = await tiff.getImage(i);
    dims.push([img.getWidth(), img.getHeight()]);
  }
  const chosenIdx = pickBestLevel(dims);
  const image = await tiff.getImage(chosenIdx);
  const width = image.getWidth();
  const height = image.getHeight();
  const samplesPerPixel = image.getSamplesPerPixel();
  const bitsPerSample = Array.isArray(image.getBitsPerSample()) ? image.getBitsPerSample()[0] : image.getBitsPerSample();

  status(`reading ${width}×${height} @ level ${chosenIdx}/${count-1} (${bitsPerSample}-bit, ${samplesPerPixel}spp)…`);
  const rasters = await image.readRasters();
  const pixels = samplesPerPixel > 1 ? rasters[0] : rasters[0];

  console.log(`[ome-loader] TIFF ${width}×${height} level=${chosenIdx}/${count-1} bitsPerSample=${bitsPerSample}`);

  const title = url.split("/").pop().replace(/[?#].*$/, "");
  await handToImageJ(pixels, width, height, bitsPerSample, title, { pyramidLevel: chosenIdx, levels: count });
}

function pickBestLevel(dims) {
  // largest level fitting in MAX_DIM × MAX_DIM
  let best = 0, bestArea = -1;
  for (let i = 0; i < dims.length; i++) {
    const [w, h] = dims[i];
    if (w <= MAX_DIM && h <= MAX_DIM) {
      const area = w * h;
      if (area > bestArea) { bestArea = area; best = i; }
    }
  }
  if (bestArea > 0) return best;
  // No fit: smallest
  let smallest = 0, smallestArea = Infinity;
  for (let i = 0; i < dims.length; i++) {
    const [w, h] = dims[i];
    if (w * h < smallestArea) { smallestArea = w * h; smallest = i; }
  }
  return smallest;
}

// =============================================================================
//  OME-Zarr path (zarrita.js)
// =============================================================================
async function loadOmeZarr(url) {
  status("fetching zarrita.js…");
  const zarrita = await import("https://esm.sh/zarrita");

  const root = zarrita.withConsolidated
    ? await zarrita.withConsolidated(new zarrita.FetchStore(url))
    : new zarrita.FetchStore(url);

  const grp = await zarrita.open.asGroup(zarrita.root(root));
  const ms = grp.attrs && grp.attrs.multiscales;
  if (!ms || !ms.length) throw new Error("no OME-Zarr multiscales metadata");

  const datasets = ms[0].datasets;
  // Pick first dataset that opens cleanly + has a good size
  let chosen = null;
  for (let i = datasets.length - 1; i >= 0; i--) {
    const arr = await zarrita.open.asArray(zarrita.resolve(root, datasets[i].path));
    const shape = arr.shape;
    const [w, h] = [shape[shape.length - 1], shape[shape.length - 2]];
    if (w <= MAX_DIM && h <= MAX_DIM) { chosen = { arr, path: datasets[i].path, w, h }; if (w >= MIN_DIM) break; }
  }
  if (!chosen) throw new Error("no usable pyramid level found");

  status(`reading ${chosen.w}×${chosen.h} (zarr level ${chosen.path})…`);

  // Build a selection — read the first 2D slice. Higher dims (T, C, Z) → index 0.
  const shape = chosen.arr.shape;
  const ndim = shape.length;
  const sel = new Array(ndim).fill(0);
  sel[ndim - 1] = zarrita.slice(null);
  sel[ndim - 2] = zarrita.slice(null);
  const chunk = await zarrita.get(chosen.arr, sel);

  const pixels = chunk.data;
  const width = chosen.w;
  const height = chosen.h;
  let bits = 8;
  if (pixels instanceof Uint16Array || pixels instanceof Int16Array) bits = 16;
  else if (pixels instanceof Float32Array) bits = 32;

  const title = url.replace(/\/$/, "").split("/").pop() || "ome-zarr";
  await handToImageJ(pixels, width, height, bits, title, { zarrPath: chosen.path });
}

// =============================================================================
//  Bridge into ImageJ via library mode
// =============================================================================
async function handToImageJ(pixels, width, height, bitsPerSample, title, meta) {
  const lib = window.lib;
  if (!lib) throw new Error("ImageJ library not available on window.lib");

  let processor;
  if (bitsPerSample <= 8) {
    const BP = await lib.ij.process.ByteProcessor;
    // Coerce to Uint8Array if needed
    const u8 = (pixels instanceof Uint8Array) ? pixels : new Uint8Array(pixels.buffer, pixels.byteOffset || 0, pixels.byteLength || (pixels.length * (pixels.BYTES_PER_ELEMENT || 1)));
    processor = await new BP(width, height, u8);
  } else if (bitsPerSample <= 16) {
    const SP = await lib.ij.process.ShortProcessor;
    const s16 = (pixels instanceof Uint16Array) ? pixels
              : (pixels instanceof Int16Array)  ? new Uint16Array(pixels.buffer, pixels.byteOffset || 0, pixels.length)
              : new Uint16Array(pixels);
    processor = await new SP(width, height, s16, null);
  } else if (bitsPerSample <= 32) {
    const FP = await lib.ij.process.FloatProcessor;
    const f32 = (pixels instanceof Float32Array) ? pixels : new Float32Array(pixels);
    processor = await new FP(width, height, f32);
  } else {
    throw new Error("unsupported bitsPerSample: " + bitsPerSample);
  }

  const ImagePlus = await lib.ij.ImagePlus;
  const imp = await new ImagePlus(title, processor);
  await imp.show();

  status(`opened ${width}×${height} in ImageJ`);
  console.log("[ome-loader] opened in ImageJ:", { title, width, height, bitsPerSample, ...meta });
}
