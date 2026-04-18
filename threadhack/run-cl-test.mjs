import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";

const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/test-classloader.html";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 300000 });
const page = await browser.newPage();
await page.setCacheEnabled(false);
page.on("console", (m) => {
  const t = m.type();
  if (t === "error" || t === "warn" || t === "log") console.log(`  [${t}] ${m.text()}`);
});
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));

await page.goto(URL + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });

// Poll for completion signal in the pre#out element
const deadline = Date.now() + 120000;
while (Date.now() < deadline) {
  const txt = await page.$eval("#out", (el) => el.textContent);
  if (txt.includes("=== cheerpjRunJar returned ===") || txt.includes("ERR:") || txt.includes("FAIL: Custom ClassLoader") || txt.includes("SUCCESS: CheerpJ honors")) {
    break;
  }
  await new Promise((r) => setTimeout(r, 1500));
}

const txt = await page.$eval("#out", (el) => el.textContent);
console.log("\n=== final page output ===\n" + txt);
await browser.close();
