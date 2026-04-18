// CheerpJ-in-Worker bootstrap.
// Runs ImageJ macros in isolation from the main thread — real parallelism.

importScripts("https://cjrtnc.leaningtech.com/4.2/loader.js");

let lib = null;
let ByteProcessor = null;
let GaussianBlur = null;
let ready = false;
const workerId = self.name || "w?";

// Compute base path relative to origin root, so /app/<base>lib/ImageJ/ij.jar resolves
// to the real file regardless of subpath mount.
const workerUrl = new URL(self.location.href);
const BASE = workerUrl.pathname.substring(0, workerUrl.pathname.lastIndexOf("/threadhack/") + 1);
const JAR_PATH = `/app${BASE}lib/ImageJ/ij.jar`;

function log(...args) {
  const msg = args.join(" ");
  console.log(`[${workerId}] ${msg}`);
  self.postMessage({ kind: "log", workerId, msg });
}

async function boot() {
  const t0 = performance.now();
  log("booting CheerpJ...");
  await cheerpjInit({
    status: "none",
    clipboardMode: "java",
    javaProperties: [
      "java.awt.headless=true",
      "user.dir=/files",
    ],
  });
  log(`cheerpjInit done in ${(performance.now() - t0).toFixed(0)}ms`);

  // Load ij.jar as a library (lazy — class access happens on first task)
  const t1 = performance.now();
  log(`loading ij.jar from ${JAR_PATH}`);
  lib = await cheerpjRunLibrary(JAR_PATH);
  log(`lib handle ready in ${(performance.now() - t1).toFixed(0)}ms`);
  ready = true;
  self.postMessage({ kind: "ready", workerId, bootMs: performance.now() - t0 });
}

async function gaussianTask(size, sigma) {
  log(`  task start: size=${size} sigma=${sigma}`);
  const t0 = performance.now();
  if (!ByteProcessor) { log(`  resolving ByteProcessor...`); ByteProcessor = await lib.ij.process.ByteProcessor; log(`  BP resolved +${(performance.now()-t0).toFixed(0)}ms`); }
  if (!GaussianBlur) { const t=performance.now(); log(`  resolving GaussianBlur...`); GaussianBlur = await lib.ij.plugin.filter.GaussianBlur; log(`  GB resolved +${(performance.now()-t).toFixed(0)}ms`); }
  const bp = await new ByteProcessor(size, size);
  await bp.noise(50);
  const gb = await new GaussianBlur();
  await gb.blurGaussian(bp, sigma, sigma, 0.01);
  const stats = await bp.getStatistics();
  const mean = await stats.mean;
  log(`  task done in ${(performance.now()-t0).toFixed(0)}ms, mean=${mean}`);
  return mean;
}

// Serialize all Java-mode calls inside this worker
let queueTail = Promise.resolve();
function serialize(fn) {
  const p = queueTail.then(fn, fn);
  queueTail = p.catch(() => {});
  return p;
}

self.onmessage = (e) => {
  const { kind, id, task } = e.data;
  if (kind === "task") {
    serialize(() => handleTask(id, task));
    return;
  }
};

async function handleTask(id, task) {
  if (!ready) { self.postMessage({ kind: "error", id, workerId, err: "not ready" }); return; }
  const t0 = performance.now();
  try {
    let result;
    if (task.op === "gaussian") {
      result = await gaussianTask(task.size, task.sigma);
    } else {
      throw new Error("unknown op " + task.op);
    }
    const ms = performance.now() - t0;
    self.postMessage({ kind: "result", id, workerId, result, ms });
  } catch (err) {
    let m = "unknown";
    try { m = err && err.message ? err.message : "" + err; } catch { m = "[err unstringifiable]"; }
    self.postMessage({ kind: "error", id, workerId, err: m });
  }
}

log(`worker spawned, location=${self.location.href}, BASE=${BASE}, JAR_PATH=${JAR_PATH}`);

// Auto-boot on spawn
boot().catch((e) => {
  log(`BOOT FAILED: ${e && e.message || e}`);
  self.postMessage({ kind: "error", workerId, err: String(e && e.message || e) });
});
