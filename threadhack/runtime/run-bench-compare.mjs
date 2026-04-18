import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const BASE = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/runtime/bench-compare.html";

async function runWith(poolSize) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 1200000 });
  const page = await browser.newPage();
  await page.setCacheEnabled(true);
  const logs = [];
  page.on("console", m => { if (["error","warn","log"].includes(m.type())) logs.push(m.text()); });
  page.on("pageerror", e => logs.push(`PAGEERR: ${e.message}`));

  // Inject poolSize override by prefixing cheerpjInit calls
  // Actually simpler: inject a JS hook that intercepts the cheerpjInit call and forces threadhackPool
  await page.evaluateOnNewDocument((poolSize) => {
    // Wait for cheerpjInit to be defined, then wrap once
    Object.defineProperty(window, '_force_pool_size', { value: poolSize, writable: true });
    const origSetter = Object.getOwnPropertyDescriptor(window, 'cheerpjInit') || {};
    // We just override via a MutationObserver-style check
    const timer = setInterval(() => {
      if (typeof window.cheerpjInit === 'function' && !window.cheerpjInit.__ph_pool_wrapped) {
        const orig = window.cheerpjInit;
        window.cheerpjInit = function(opts) {
          opts = Object.assign({}, opts || {});
          opts.threadhackPool = window._force_pool_size;
          return orig(opts);
        };
        window.cheerpjInit.__ph_pool_wrapped = true;
        clearInterval(timer);
      }
    }, 5);
  }, poolSize);

  await page.goto(BASE + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });
  await page.$eval("#run", b => b.click());

  const deadline = Date.now() + 300000;
  while (Date.now() < deadline) {
    const p = await page.$eval("#progress", el => el.textContent).catch(() => "");
    if (p.includes("done")) break;
    if (logs.some(l => /PAGEERR/.test(l))) break;
    await new Promise(r => setTimeout(r, 2000));
  }
  const rows = await page.$$eval("#results tbody tr", trs =>
    trs.map(tr => Array.from(tr.children).map(td => td.textContent))
  );
  const err = logs.filter(l => /PAGEERR|error/i.test(l) && !/404/.test(l)).slice(0, 3);
  await browser.close();
  return { poolSize, rows, err };
}

for (const p of [0, 2, 4, 6, 10]) {
  console.log(`\n=== pool=${p} ===`);
  const r = await runWith(p);
  console.log(`rows:`, r.rows);
  if (r.err.length) console.log(`errors: ${r.err.join(" | ")}`);
}
