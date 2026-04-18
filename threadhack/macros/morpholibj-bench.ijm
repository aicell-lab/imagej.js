// ============================================================
//  MorphoLibJ end-to-end macro — hits a parallelized compute path
//
//  Requires MorphoLibJ_-1.4.2.1.jar on the plugins classpath
//  (the e2e demo loads it automatically).
//
//  Uses "Distance Transform Watershed 3D" which internally uses
//  Executors.newFixedThreadPool(n) — our rewriter turns that into
//  a Worker-pool dispatch, so the compute phase runs in parallel.
// ============================================================

setBatchMode(true);

// 1) Synthetic 3D blob stack
newImage("blob3d", "8-bit black", 512, 512, 32);
run("Add Specified Noise...", "standard=50 stack");
run("Gaussian Blur...", "sigma=3 stack");
setThreshold(128, 255);
run("Convert to Mask", "stack");

// 2) Parallelizable MorphoLibJ op
t0 = getTime();
run("Distance Transform 3D");
print("Distance Transform 3D: " + (getTime() - t0) + " ms");

setBatchMode(false);
close();
print("=== morpholibj-bench done ===");
