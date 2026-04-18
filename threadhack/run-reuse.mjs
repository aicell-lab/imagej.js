import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";

const BASE = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/test-reuse.html";
const POOL = parseInt(process.env.POOL || "6");
const JOBS = parseInt(process.env.JOBS || "10");
const WORK = parseInt(process.env.WORK || "100000000");
const RUNS = parseInt(process.env.RUNS || "3");

const url = `${BASE}?pool=${POOL}&jobs=${JOBS}&work=${WORK}&runs=${RUNS}&cb=${Date.now()}`;

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 1200000 });
const page = await browser.newPage();
await page.setCacheEnabled(true);
page.on("console", (m) => { if (["error","warn","log"].includes(m.type())) console.log(`  [${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "domcontentloaded" });

const deadline = Date.now() + 600000;
while (Date.now() < deadline) {
  const txt = await page.$eval("#out", (el) => el.textContent);
  if (/=== done ===|ERR:/.test(txt)) break;
  await new Promise((r) => setTimeout(r, 2000));
}
const txt = await page.$eval("#out", (el) => el.textContent);
console.log("\n=== final page output ===\n" + txt);
await browser.close();
