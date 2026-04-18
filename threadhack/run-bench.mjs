import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";

const BASE = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/test-bench.html";
const POOL = parseInt(process.env.POOL || "4");
const JOBS = parseInt(process.env.JOBS || (POOL * 2));
const WORK = parseInt(process.env.WORK || "20000000");

const url = `${BASE}?pool=${POOL}&jobs=${JOBS}&work=${WORK}&cb=${Date.now()}`;
console.log(`\n=== bench: pool=${POOL} jobs=${JOBS} work=${WORK} ===`);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 1200000 });
const page = await browser.newPage();
await page.setCacheEnabled(true);   // cache ON so preload actually helps
page.on("console", (m) => { if (["error","warn","log"].includes(m.type())) console.log(`  [${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));

await page.goto(url, { waitUntil: "domcontentloaded" });

const deadline = Date.now() + 600000;
while (Date.now() < deadline) {
  const txt = await page.$eval("#out", (el) => el.textContent);
  if (/=== done ===|RESULT n=|ERR:.*TypeError: Failed/.test(txt)) break;
  await new Promise((r) => setTimeout(r, 2000));
}
const txt = await page.$eval("#out", (el) => el.textContent);
console.log("\n=== final page output ===\n" + txt);
await browser.close();
