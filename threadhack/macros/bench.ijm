// ============================================================
//  Threadhack bench macro — sample workload for parallelism demo
//
//  Paste or load this via the e2e demo page. It creates a large
//  image stack, runs a built-in filter that uses ImageJ's thread
//  pool, and reports timings. When loaded with the threadhack
//  rewriter, the parallelism sites (Executors.newFixedThreadPool,
//  Thread.start, etc.) are transparently routed to the Web Worker
//  pool.
//
//  Expected behaviour:
//    - Without rewriter: sequential cooperative (green-thread) —
//      all loops run on the single JS event loop, no speedup.
//    - With rewriter: any plugin that uses Executors.newFixedThreadPool
//      or Thread.start on a Serializable Runnable parallelizes
//      across the worker pool.
// ============================================================

setBatchMode(true);

W = 2048; H = 2048; DEPTH = 8;

// 1) Make a stack to filter
t0 = getTime();
newImage("test-stack", "16-bit noise", W, H, DEPTH);
print("newImage elapsed: " + (getTime() - t0) + " ms");

// 2) Gaussian Blur (built-in, declares PARALLELIZE_STACKS flag)
t0 = getTime();
run("Gaussian Blur...", "sigma=6 stack");
print("Gaussian Blur: " + (getTime() - t0) + " ms");

// 3) Median filter (built-in, also PARALLELIZE_STACKS)
t0 = getTime();
run("Median...", "radius=2 stack");
print("Median: " + (getTime() - t0) + " ms");

// 4) Statistics pass (fast, serial)
getStatistics(area, mean, min, max);
print("stats: area=" + area + " mean=" + mean);

setBatchMode(false);
close();

print("=== done ===");
