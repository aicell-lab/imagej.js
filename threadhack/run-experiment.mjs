// Drives the threading experiment headlessly and measures speedup.
import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";

const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/index.html";
const NUM_WORKERS = parseInt(process.env.NW || "4");
const NUM_TASKS = parseInt(process.env.NT || "8");
const IMG_SIZE = parseInt(process.env.SZ || "1024");
const SIGMA = parseInt(process.env.SG || "6");

async function main() {
  console.log(`\n=== CheerpJ threading experiment ===`);
  console.log(`Workers=${NUM_WORKERS}  Tasks=${NUM_TASKS}  ImgSize=${IMG_SIZE}  Sigma=${SIGMA}`);
  console.log(`URL: ${URL}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    protocolTimeout: 600000,
  });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  // Route console
  page.on("console", (m) => {
    const t = m.type();
    if (t === "error" || t === "warn" || t === "log") {
      const txt = m.text();
      if (!/ChromeDriver|DevTools/.test(txt)) {
        console.log(`  [page:${t}] ${txt}`);
      }
    }
  });
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));

  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // Run the full experiment in-page
  const report = await page.evaluate(async (NUM_WORKERS, NUM_TASKS, IMG_SIZE, SIGMA) => {
    const out = { steps: [] };
    const step = (name, data) => { out.steps.push({ name, ...data }); };

    const task = { op: "gaussian", size: IMG_SIZE, sigma: SIGMA };

    // ---- A. spawn workers — SEQUENTIALLY (concurrent boots race on CheerpJ CDN fetches)
    const spawnStart = performance.now();
    const workers = [];
    for (let i = 0; i < NUM_WORKERS; i++) {
      const w = new Worker("worker.js?cb=" + Date.now() + "_" + i, { name: `w${i}` });
      w._pending = new Map();
      w._nextId = 1;
      w._readyPromise = new Promise((res) => { w._resReady = res; });
      w.onmessage = (e) => {
        const d = e.data;
        if (d.kind === "ready") { w._bootMs = d.bootMs; w._resReady(); }
        else if (d.kind === "log") { /* ignore */ }
        else if (d.kind === "result" || d.kind === "error") {
          const p = w._pending.get(d.id); if (!p) return;
          w._pending.delete(d.id);
          d.kind === "error" ? p.rej(new Error(d.err)) : p.res(d);
        }
      };
      workers.push(w);
      // Wait for this worker to boot before spawning the next
      await w._readyPromise;
    }
    const spawnMs = performance.now() - spawnStart;
    step("spawn", { wall_ms: spawnMs, per_worker_boot_ms: workers.map(w => Math.round(w._bootMs)) });

    function runOnWorker(w, task) {
      return new Promise((res, rej) => {
        const id = w._nextId++;
        w._pending.set(id, { res, rej });
        w.postMessage({ kind: "task", id, task });
      });
    }

    // ---- B. single heavy task on 1 worker (warmup + baseline per-task cost)
    const single0 = performance.now();
    const singleR = await runOnWorker(workers[0], task);
    const singleMs = performance.now() - single0;
    step("single_task_on_worker_warmup", { wall_ms: Math.round(singleMs), worker_side_ms: Math.round(singleR.ms), result: singleR.result });

    // ---- C. second single task (JIT warm)
    const s2 = performance.now();
    const sR2 = await runOnWorker(workers[0], task);
    const s2Ms = performance.now() - s2;
    step("single_task_on_worker_warm", { wall_ms: Math.round(s2Ms), worker_side_ms: Math.round(sR2.ms) });

    // ---- D. run NUM_TASKS in parallel on pool
    const pool0 = performance.now();
    const promises = [];
    for (let i = 0; i < NUM_TASKS; i++) {
      const w = workers[i % workers.length];
      promises.push(runOnWorker(w, task));
    }
    const results = await Promise.all(promises);
    const poolMs = performance.now() - pool0;
    const sumWork = results.reduce((s, r) => s + r.ms, 0);
    step("parallel_pool", {
      tasks: NUM_TASKS,
      workers: NUM_WORKERS,
      wall_ms: Math.round(poolMs),
      sum_of_task_ms: Math.round(sumWork),
      speedup_vs_serial_java: Math.round((sumWork / poolMs) * 100) / 100,
      ideal_linear_wall_ms: Math.round((sumWork / NUM_WORKERS)),
      parallel_efficiency: Math.round(((sumWork / NUM_WORKERS) / poolMs) * 100) / 100,
    });

    // ---- E. Run NUM_TASKS sequentially on one worker (real "no parallelism" baseline)
    const seq0 = performance.now();
    let seqSum = 0;
    for (let i = 0; i < NUM_TASKS; i++) {
      const r = await runOnWorker(workers[0], task);
      seqSum += r.ms;
    }
    const seqMs = performance.now() - seq0;
    step("serial_on_one_worker", {
      tasks: NUM_TASKS,
      wall_ms: Math.round(seqMs),
      sum_of_task_ms: Math.round(seqSum),
    });

    // ---- F. clean up
    workers.forEach(w => w.terminate());
    return out;
  }, NUM_WORKERS, NUM_TASKS, IMG_SIZE, SIGMA);

  console.log("=== results ===");
  for (const s of report.steps) {
    console.log(`\n[${s.name}]`);
    const { name, ...rest } = s;
    for (const [k, v] of Object.entries(rest)) {
      console.log(`  ${k}: ${JSON.stringify(v)}`);
    }
  }

  // Interpret
  const pool = report.steps.find(s => s.name === "parallel_pool");
  const seq = report.steps.find(s => s.name === "serial_on_one_worker");
  if (pool && seq) {
    const speedup = seq.wall_ms / pool.wall_ms;
    console.log(`\n=== verdict ===`);
    console.log(`  wallclock pool:   ${pool.wall_ms}ms`);
    console.log(`  wallclock serial: ${seq.wall_ms}ms`);
    console.log(`  real-world speedup: ${speedup.toFixed(2)}×`);
    console.log(`  ideal on ${NUM_WORKERS} workers would be ~${NUM_WORKERS}×`);
    console.log(`  parallel efficiency: ${((speedup / NUM_WORKERS) * 100).toFixed(0)}%`);
  }

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
