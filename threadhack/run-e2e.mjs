import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/test-e2e.html";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 1200000 });
const page = await browser.newPage();
await page.setCacheEnabled(true);
page.on("console", (m) => { if (["error","warn","log"].includes(m.type())) console.log(`  [${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
await page.goto(URL + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });
// Click Boot
await page.$eval("#boot", (b) => b.click());
// Wait for ready
const deadline = Date.now() + 300000;
while (Date.now() < deadline) {
  const s = await page.$eval("#status", (el) => el.textContent);
  if (s.includes("ready")) break;
  if (s.includes("ERR")) break;
  await new Promise(r => setTimeout(r, 2000));
}
console.log("\n[host] status:", await page.$eval("#status", e => e.textContent));

// Set macro to a STACK bench (triggers PARALLELIZE_STACKS inside PlugInFilterRunner)
await page.evaluate(() => {
  document.getElementById("macro").value = `
setBatchMode(true);
t0 = getTime();
newImage("t", "8-bit noise", 1024, 1024, 8);
print("newImage: " + (getTime() - t0) + "ms");

t0 = getTime();
run("Gaussian Blur...", "sigma=4 stack");
print("Gaussian (stack): " + (getTime() - t0) + "ms");

t0 = getTime();
run("Median...", "radius=2 stack");
print("Median (stack): " + (getTime() - t0) + "ms");

getStatistics(area, mean);
close();
setBatchMode(false);
"mean=" + mean;
`;
});

// Run macro
await page.$eval("#run", (b) => b.click());
const deadline2 = Date.now() + 120000;
while (Date.now() < deadline2) {
  const s = await page.$eval("#elapsed", el => el.textContent);
  if (s.includes("done") || s.includes("ERROR")) break;
  await new Promise(r => setTimeout(r, 1500));
}
console.log("[host] elapsed:", await page.$eval("#elapsed", el => el.textContent));
console.log("[host] stats:", await page.$eval("#stats", el => el.textContent));
console.log("[host] tail of console:", (await page.$eval("#out", el => el.textContent)).split("\n").slice(-30).join("\n"));
await browser.close();
