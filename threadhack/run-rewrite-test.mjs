import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/test-rewrite.html";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 300000 });
const page = await browser.newPage();
await page.setCacheEnabled(false);
page.on("console", (m) => { if (["error","warn","log"].includes(m.type())) console.log(`  [${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
await page.goto(URL + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });

const deadline = Date.now() + 180000;
while (Date.now() < deadline) {
  const txt = await page.$eval("#out", (el) => el.textContent);
  if (txt.includes("=== cheerpjRunJar returned ===") || txt.includes("SUCCESS:") || txt.includes("FAIL:") || txt.includes("Exception")) break;
  await new Promise((r) => setTimeout(r, 1500));
}
const txt = await page.$eval("#out", (el) => el.textContent);
console.log("\n=== final page output ===\n" + txt);
await browser.close();
