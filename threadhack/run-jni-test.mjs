import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";

const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/jni-hook-test.html";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 120000 });
const page = await browser.newPage();
await page.setCacheEnabled(false);
page.on("console", (m) => {
  const t = m.type();
  if (t === "error" || t === "warn" || t === "log") console.log(`  [${t}] ${m.text()}`);
});
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
await page.goto(URL + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });

// Wait up to 60s for the page script to finish
await new Promise((res) => setTimeout(res, 60000));

const text = await page.$eval("#out", (el) => el.textContent);
console.log("\n=== final page output ===\n" + text);
const fired = await page.evaluate(() => window.hookFired);
console.log("\n=== hookFired from JS: " + fired + " ===");
await browser.close();
