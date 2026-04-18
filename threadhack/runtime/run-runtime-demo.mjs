import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/runtime/demo.html";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 1200000 });
const page = await browser.newPage();
await page.setCacheEnabled(true);
page.on("console", (m) => { if (["error","warn","log"].includes(m.type())) console.log(`  [${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));

await page.goto(URL + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });
await page.$eval("#boot", b => b.click());

const deadline = Date.now() + 240000;
while (Date.now() < deadline) {
  const s = await page.$eval("#out", el => el.textContent);
  if (/DONE ✓|ERR:/.test(s)) break;
  await new Promise(r => setTimeout(r, 2000));
}
console.log("\n=== final ===\n" + (await page.$eval("#out", el => el.textContent)));
await browser.close();
