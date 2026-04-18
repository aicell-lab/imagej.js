package com.hack;

import java.net.URL;

/**
 * Bench driver callable two ways:
 *   - cheerpjRunJar (legacy main): once-off run with jar arg then N, WORK
 *   - cheerpjRunLibrary (new): call init(sampleJar) ONCE, then
 *     runThreadBench(n, work, warmup) or runExecutorBench(n, work, warmup)
 *     repeatedly — same classloader, same pool, same warm JITs.
 */
public class BenchTool {

    // Cached after init — survives across runs for true pool reuse
    private static ParallelClassLoader LOADER;
    private static Class<?> BENCH;
    private static java.lang.reflect.Method M_THREAD;
    private static java.lang.reflect.Method M_EXECUTOR;

    public static void main(String[] args) throws Exception {
        // Backward-compat shim: old cheerpjRunJar path
        String sampleJar = args.length > 0 ? args[0] : "/app/threadspawn-sample.jar";
        int n            = args.length > 1 ? Integer.parseInt(args[1]) : 4;
        int work         = args.length > 2 ? Integer.parseInt(args[2]) : 20_000_000;

        init(sampleJar);
        runThreadBench(n, work, true);
    }

    /**
     * Call ONCE from JS (library mode). Sets up the rewriting classloader
     * against the sample jar. Safe to call again — re-inits.
     */
    public static void init(String sampleJar) throws Exception {
        System.out.println("=== BenchTool.init sampleJar=" + sampleJar + " ===");
        URL[] urls = { new URL("file://" + sampleJar) };
        LOADER = new ParallelClassLoader(urls, BenchTool.class.getClassLoader());
        BENCH  = Class.forName("com.hack.sample.Bench", true, LOADER);
        M_THREAD   = BENCH.getMethod("runThreadBench",   int.class, int.class, boolean.class);
        M_EXECUTOR = BENCH.getMethod("runExecutorBench", int.class, int.class, boolean.class);
        System.out.println("classes: " + ParallelClassLoader.totalClasses
                + "  rewritten: " + ParallelClassLoader.rewriteCount
                + "  rewrite-sites: " + ParallelClassLoader.totalStartSites);
    }

    /**
     * Run Thread.start()-based bench. Returns wall time (ms).
     * Safe to call repeatedly after init — pool is reused.
     */
    public static long runThreadBench(int n, int work, boolean warmup) throws Exception {
        ThreadHook.resetCounts();
        Object out = M_THREAD.invoke(null, n, work, warmup);
        long wall = ((Long) out).longValue();
        System.out.println("[BenchTool.thread] wall=" + wall + "ms start=" + ThreadHook.getStartCount()
                + " shipped=" + ThreadHook.getShippedCount() + " fallback=" + ThreadHook.getFallbackCount());
        return wall;
    }

    /**
     * Run Executors.newFixedThreadPool(n).submit(Runnable)-based bench.
     * Returns wall time (ms).
     */
    public static long runExecutorBench(int n, int work, boolean warmup) throws Exception {
        Object out = M_EXECUTOR.invoke(null, n, work, warmup);
        long wall = ((Long) out).longValue();
        System.out.println("[BenchTool.executor] wall=" + wall + "ms pools="
                + ExecutorHook.createdPools);
        return wall;
    }

    /**
     * Run the `new ThreadPoolExecutor(...)` direct-constructor path.
     * Validates the ASM tree-API NEW+INVOKESPECIAL rewrite.
     */
    public static long runTpeBench(int n, int work) throws Exception {
        Class<?> tpe = Class.forName("com.hack.sample.TpeBench", true, LOADER);
        java.lang.reflect.Method m = tpe.getMethod("runDirectTPE", int.class, int.class);
        Object out = m.invoke(null, n, work);
        long wall = ((Long) out).longValue();
        System.out.println("[BenchTool.tpe] wall=" + wall + "ms  tpeDirectRewrites="
                + ParallelClassLoader.tpeDirectRewrites);
        return wall;
    }
}
