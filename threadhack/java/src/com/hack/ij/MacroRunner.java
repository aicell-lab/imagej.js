package com.hack.ij;

import com.hack.ParallelClassLoader;

import java.net.URL;

/**
 * Library-mode entry point for running an ImageJ macro through our rewriter.
 *   MacroRunner.init(String[] jarPaths)  — sets up ParallelClassLoader wrapping
 *                                          ij.jar + plugin jars; every user-code
 *                                          class gets Thread/Executor rewrites.
 *   MacroRunner.runMacro(String macro)   — invokes ij.IJ.runMacro via the
 *                                          rewriting classloader. Returns the
 *                                          macro's return value as a String.
 */
public class MacroRunner {

    private static ParallelClassLoader LOADER;
    private static Class<?> IJ_CLASS;
    private static java.lang.reflect.Method IJ_RUN_MACRO;

    /** Comma-separated jar paths, in classpath order. First should be ij.jar. */
    public static void init(String jarPathsCsv) throws Exception {
        String[] paths = jarPathsCsv.split(",");
        URL[] urls = new URL[paths.length];
        for (int i = 0; i < paths.length; i++) {
            urls[i] = new URL("file://" + paths[i].trim());
        }

        // Our ParallelClassLoader rewrites EVERY loaded user class — ij.jar AND
        // every plugin. MorphoLibJ plugins that call Executors.newFixedThreadPool
        // get routed to the worker pool automatically.
        LOADER = new ParallelClassLoader(urls, MacroRunner.class.getClassLoader());

        // Make it the context classloader so IJ's internal Class.forName() calls
        // resolve through us (essential for plugin discovery).
        Thread.currentThread().setContextClassLoader(LOADER);

        IJ_CLASS = Class.forName("ij.IJ", true, LOADER);
        IJ_RUN_MACRO = IJ_CLASS.getMethod("runMacro", String.class);

        System.out.println("[MacroRunner.init] loader=" + LOADER
                + " classes touched=" + ParallelClassLoader.totalClasses
                + " rewrites=" + ParallelClassLoader.rewriteCount
                + " sites=" + ParallelClassLoader.totalStartSites
                + " TPE-direct=" + ParallelClassLoader.tpeDirectRewrites);
    }

    public static String runMacro(String macro) throws Exception {
        if (IJ_RUN_MACRO == null) throw new IllegalStateException("init() must be called first");
        // Ensure per-macro classloader context (IJ spawns threads for macro execution)
        Thread.currentThread().setContextClassLoader(LOADER);
        Object r = IJ_RUN_MACRO.invoke(null, macro);
        return r == null ? "" : r.toString();
    }

    public static int getRewriteCount()         { return ParallelClassLoader.rewriteCount; }
    public static int getRewriteSites()         { return ParallelClassLoader.totalStartSites; }
    public static int getTpeDirectRewrites()    { return ParallelClassLoader.tpeDirectRewrites; }
    public static int getClassesTouched()       { return ParallelClassLoader.totalClasses; }
    public static int getSynchronizedWarnings() { return ParallelClassLoader.synchronizedWarnings; }

    /** Shipped vs fallback counts from the Thread hook (who actually used the pool). */
    public static int getShippedCount()         { return com.hack.ThreadHook.getShippedCount(); }
    public static int getFallbackCount()        { return com.hack.ThreadHook.getFallbackCount(); }
    public static void resetThreadHookCounts()  { com.hack.ThreadHook.resetCounts(); }

    /** Pools created via ExecutorHook (i.e. rewritten Executors/TPE factories). */
    public static int getPoolsCreated()         { return com.hack.ExecutorHook.createdPools; }
}
