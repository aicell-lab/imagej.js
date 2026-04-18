import puppeteer from "/Users/weio/.nvm/versions/node/v24.13.0/lib/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const URL = "https://static-serve-0bc5cde8.svc.hypha.aicell.io/imagej-test/threadhack/test-e2e.html";

async function runWith(pool) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], protocolTimeout: 1200000 });
  const page = await browser.newPage();
  await page.setCacheEnabled(true);
  const logs = [];
  page.on("console", (m) => { if (m.type() === "log") logs.push(m.text()); });
  await page.goto(URL + "?cb=" + Date.now(), { waitUntil: "domcontentloaded" });
  await page.$eval("#pool", (el, p) => { el.value = String(p); }, pool);
  await page.$eval("#boot", (b) => b.click());
  // wait for ready
  for (let i = 0; i < 200; i++) {
    const s = await page.$eval("#status", el => el.textContent);
    if (s.includes("ready")) break;
    await new Promise(r => setTimeout(r, 1500));
  }
  // big stack that triggers PARALLELIZE_STACKS
  await page.evaluate(() => {
    document.getElementById("macro").value = `
setBatchMode(true);
newImage("t", "8-bit noise", 1024, 1024, 16);
t0 = getTime();
run("Gaussian Blur...", "sigma=6 stack");
gms = getTime() - t0;
t0 = getTime();
run("Median...", "radius=3 stack");
mms = getTime() - t0;
close();
"gauss_ms=" + gms + " median_ms=" + mms;
`;
  });
  // run macro
  await page.$eval("#run", b => b.click());
  for (let i = 0; i < 100; i++) {
    const s = await page.$eval("#elapsed", el => el.textContent);
    if (s.includes("done") || s.includes("ERROR")) break;
    await new Promise(r => setTimeout(r, 1500));
  }
  const stats = await page.$eval("#stats", el => el.textContent);
  const elapsed = await page.$eval("#elapsed", el => el.textContent);
  // Extract gauss/median times from macro output
  const out = logs.filter(l => /gauss_ms|median_ms/.test(l)).join(" ");
  console.log(`\nPool=${pool} stats=${stats.replace(/\s+/g," ")}`);
  console.log(`Pool=${pool} elapsed="${elapsed}"`);
  console.log(`Pool=${pool} result=${out}`);
  await browser.close();
}

for (const p of [1, 6]) {
  await runWith(p);
}
