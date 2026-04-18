// Stage 2 worker — hosts a CheerpJ JVM that deserializes + runs Runnables.
importScripts("https://cjrtnc.leaningtech.com/4.2/loader.js");

const workerId = self.name || "w?";
const workerUrl = new URL(self.location.href);
// BASE = directory of this worker file, so /app${BASE}xxx.jar resolves correctly
const BASE = workerUrl.pathname.substring(0, workerUrl.pathname.lastIndexOf("/") + 1);

let WorkerRunner = null;
let ready = false;
let queueTail = Promise.resolve();

function log(...a) {
  const msg = a.join(" ");
  console.log(`[${workerId}] ${msg}`);
  self.postMessage({ kind: "log", workerId, msg });
}

function serialize(fn) {
  const p = queueTail.then(fn, fn);
  queueTail = p.catch(() => {});
  return p;
}

async function boot() {
  const t0 = performance.now();
  await cheerpjInit({
    status: "none",
    clipboardMode: "java",
    javaProperties: [
      "java.awt.headless=true",
      "user.dir=/files",
      "com.hack.isWorkerJVM=1",
    ],
  });
  log(`cheerpjInit done +${(performance.now()-t0).toFixed(0)}ms`);

  // Classpath: tool jar + sample jar + optional app-level ij.jar
  // (convention: if BASE is …/threadhack/runtime/ or …/threadhack/, try …/lib/ImageJ/ij.jar at app root)
  const appRoot = BASE.replace(/\/threadhack(\/runtime)?\/?$/, "/");
  const candidates = [
    `/app${BASE}parallel-tool.jar`,
    `/app${BASE}threadspawn-sample.jar`,
  ];
  if (appRoot !== BASE) candidates.push(`/app${appRoot}lib/ImageJ/ij.jar`);
  const cp = candidates.join(":");
  log(`loading library classpath: ${cp}`);

  const lib = await cheerpjRunLibrary(cp);
  WorkerRunner = await lib.com.hack.WorkerRunner;
  log(`classes ready +${(performance.now()-t0).toFixed(0)}ms`);
  ready = true;
  self.postMessage({ kind: "ready", workerId, bootMs: performance.now()-t0 });
}

self.onmessage = (e) => {
  const { kind, id, bytes } = e.data;
  if (kind !== "run") return;
  serialize(async () => {
    if (!ready) { self.postMessage({ kind: "error", id, err: "not ready" }); return; }
    try {
      // bytes is an ArrayBuffer transferred from main; convert to Int8Array for CheerpJ byte[]
      const javaBytes = new Int8Array(bytes);
      const t0 = performance.now();
      const wallStart = Date.now();
      const result = await WorkerRunner.runSerialized(javaBytes);
      const ms = performance.now() - t0;
      const wallEnd = Date.now();
      log(`task id=${id} start=${wallStart} end=${wallEnd} ms=${ms.toFixed(0)}`);
      // result is a Java byte[] proxy — convert to transferable ArrayBuffer
      let resultBuf;
      if (result && result.buffer) {
        // zero-copy view
        resultBuf = new Uint8Array(result).buffer.slice(0);
      } else {
        const len = await result.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) arr[i] = await result[i];
        resultBuf = arr.buffer;
      }
      self.postMessage({ kind: "done", id, resultBuf, ms }, [resultBuf]);
    } catch (err) {
      let m = "unknown";
      try { m = err && err.message ? err.message : "" + err; } catch {}
      self.postMessage({ kind: "error", id, err: m });
    }
  });
};

boot().catch((e) => {
  log(`BOOT FAILED: ${e && e.message || e}`);
  self.postMessage({ kind: "error", err: String(e && e.message || e) });
});
