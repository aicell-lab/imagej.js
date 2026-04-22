// ============================================================
//  ome-loader.js — register a JS-side OME-TIFF / OME-Zarr tile
//  provider, then ask the Java side (com.hack.viewer.LazyImagePlus)
//  to open it as a native ImageJ window. All pan / zoom interaction
//  is handled by patched ImageJ classes — this file stays small.
//
//  Activated by ?load=<URL>.
//  Supports:
//    - .tif / .ome.tif   — geotiff.js, SUBIFD-aware pyramids
//    - .zarr             — zarrita, OME multiscales
// ============================================================

console.log("[ome-loader] module evaluated");

const STATUS_ID = "__ome_loader_status__";

(async () => {
  const params = new URLSearchParams(location.search);
  const url = params.get("load") || params.get("ome") || window.__omeLoad;
  if (!url) return;
  console.log("[ome-loader] URL:", url);
  buildStatus();
  setStatus("waiting for ImageJ…");
  await waitForImageJ();
  const lib = window.lib;

  try {
    setStatus("reading metadata…");
    const provider = /\.zarr(\/|$)/.test(url) ? await zarrProvider(url) : await tiffProvider(url);
    const key = "ome:" + (titleFromUrl(url) || "img");
    window.__tileSources[key] = provider;
    window.__omeProvider = provider;
    setStatus(`pyramid: ${provider.levels.length} levels (base ${provider.levels[0].w}×${provider.levels[0].h}) — opening…`);

    // Construct LazyImagePlus on the Java side. The patched ImageWindow /
    // ImageCanvas will translate wheel + drag into setView() calls that
    // re-fetch tiles via JSTileSource → window.__tileSources[key].
    const JSTileSource = await lib.com.hack.viewer.JSTileSource;
    const LazyImagePlus = await lib.com.hack.viewer.LazyImagePlus;
    const src = await new JSTileSource(key);
    const imp = await new LazyImagePlus(titleFromUrl(url), src);
    await imp.show();
    window.__omeImp = imp;
    setStatus("ready — wheel to zoom, drag to pan");
    installResizeObserver(imp);
    setTimeout(() => setStatus(null), 6000);
  } catch (e) {
    console.error("[ome-loader]", e);
    setStatus("error: " + (e && e.message || e), true);
  }
})();

// ----- status pill ----------------------------------------------------------
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

// ----- providers ------------------------------------------------------------
async function tiffProvider(url) {
  const GT = await import("https://esm.sh/geotiff@2");
  const tiff = await Promise.race([
    GT.fromUrl(url),
    timeout(45_000, "geotiff fromUrl timed out")
  ]);
  const raw = [];
  let bits = 8, channels = 1;
  const img0 = await tiff.getImage(0);
  raw.push({ w: img0.getWidth(), h: img0.getHeight(), image: img0 });
  const bps = img0.getBitsPerSample();
  bits = Array.isArray(bps) ? bps[0] : bps;
  channels = img0.getSamplesPerPixel();
  const subIFDs = img0.fileDirectory && img0.fileDirectory.SubIFDs;
  if (subIFDs && subIFDs.length > 0) {
    for (let k = 0; k < subIFDs.length; k++) {
      try {
        const sd = await tiff.parseFileDirectoryAt(Number(subIFDs[k]));
        const sub = new GT.GeoTIFFImage(sd.fileDirectory, sd.geoKeys, tiff.dataView, tiff.littleEndian, tiff.cache, tiff.source);
        raw.push({ w: sub.getWidth(), h: sub.getHeight(), image: sub });
      } catch (e) { console.warn("[ome-loader] SUBIFD failed:", e); }
    }
  } else {
    for (let i = 1; i < 8; i++) {
      try { const im = await tiff.getImage(i); raw.push({ w: im.getWidth(), h: im.getHeight(), image: im }); }
      catch { break; }
    }
  }
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
      return { data: rasters[0], width: x1 - x0, height: y1 - y0 };
    }
  };
}

async function zarrProvider(url) {
  // Follow vizarr's zarrita pattern: Location.resolve() for paths,
  // zarr.open(loc) for auto-detect. Works for OME-NGFF v0.1 → v0.4.
  const zarr = await import("https://esm.sh/zarrita@0.5");
  const store = new zarr.FetchStore(url);
  const rootLoc = zarr.root(store);
  const grp = await zarr.open(rootLoc);
  if (!grp || grp.kind !== "group") throw new Error("zarr root is not a group");
  const attrs = grp.attrs || {};
  // OME-NGFF: multiscales either at top-level or under "omero" (rare)
  const ms = attrs.multiscales || (attrs.omero && attrs.omero.multiscales);
  if (!ms || !ms.length) throw new Error("no multiscales metadata on zarr root");
  const datasets = ms[0].datasets || [{ path: "0" }];
  const levels = [];
  let bits = 8;
  for (const d of datasets) {
    const arr = await zarr.open(grp.resolve(d.path), { kind: "array" });
    const shape = arr.shape;
    const [w, h] = [shape[shape.length - 1], shape[shape.length - 2]];
    const dt = String(arr.dtype || "").toLowerCase();
    if (dt.includes("int16") || dt.includes("uint16")) bits = 16;
    else if (dt.includes("32") || dt.includes("float")) bits = 32;
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
      sel[ndim - 1] = zarr.slice(x0, x1);
      sel[ndim - 2] = zarr.slice(y0, y1);
      const chunk = await zarr.get(L.array, sel);
      return { data: chunk.data, width: x1 - x0, height: y1 - y0 };
    }
  };
}

function timeout(ms, label) { return new Promise((_, r) => setTimeout(() => r(new Error(label + " (" + ms + "ms)")), ms)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ----- ResizeObserver on the ImageJ canvas ---------------------------------
// Browser-native drive for LazyImagePlus.setViewport(w, h). Whenever the
// user drags the ImageJ window border, the AWT canvas DOM element resizes
// and ResizeObserver fires; we forward the new size into Java. A debounce
// coalesces rapid drag events and avoids rebuilding the ByteProcessor 60×
// per second during a resize gesture.
function installResizeObserver(imp) {
  if (typeof ResizeObserver === "undefined") return;
  const tryInstall = () => {
    const cvs = findIjCanvas();
    if (!cvs) return false;
    if (cvs.__lip_resize_installed) return true;
    cvs.__lip_resize_installed = true;
    let pending = null;
    let timer = null;
    const obs = new ResizeObserver(entries => {
      const e = entries[entries.length - 1];
      const r = e.contentRect || cvs.getBoundingClientRect();
      pending = { w: Math.round(r.width), h: Math.round(r.height) };
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        timer = null;
        const p = pending; pending = null;
        if (!p) return;
        try { await imp.setViewport(p.w, p.h); }
        catch (err) { console.warn("[ome-loader] setViewport failed:", err); }
      }, 120);
    });
    obs.observe(cvs);
    return true;
  };
  if (tryInstall()) return;
  const mo = new MutationObserver(() => { if (tryInstall()) mo.disconnect(); });
  mo.observe(document.body, { childList: true, subtree: true });
}

function findIjCanvas() {
  const display = document.getElementById("cheerpjDisplay");
  if (!display) return null;
  let best = null, area = 0;
  for (const c of display.querySelectorAll("canvas")) {
    const r = c.getBoundingClientRect();
    const a = r.width * r.height;
    if (a > area && r.width > 200 && r.height > 200) { area = a; best = c; }
  }
  return best;
}
