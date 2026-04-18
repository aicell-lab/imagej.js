package com.hack;

import java.net.URL;

/**
 * Test harness for ParallelClassLoader.
 * 1. Builds a ParallelClassLoader pointing at threadspawn-sample.jar (contains
 *    com.hack.sample.ThreadSpawn which does new Thread(r).start() + join()).
 * 2. Loads the sample class through our loader (triggers rewrite).
 * 3. Invokes its main() — the rewritten Thread.start should route through ThreadHook.
 * 4. Reports ThreadHook counters.
 */
public class RewriteTest {
    public static void main(String[] args) throws Exception {
        System.out.println("=== ParallelClassLoader rewrite test ===");

        String jarPath = args.length > 0 ? args[0] : "/app/threadhack/threadspawn-sample.jar";
        System.out.println("sample jar: " + jarPath);
        URL[] urls = { new URL("file://" + jarPath) };

        ParallelClassLoader loader = new ParallelClassLoader(urls, RewriteTest.class.getClassLoader());

        System.out.println("--- loading sample class through loader ---");
        Class<?> sample = Class.forName("com.hack.sample.ThreadSpawn", true, loader);
        System.out.println("sample: " + sample);
        System.out.println("classes touched: " + ParallelClassLoader.totalClasses
                + "; rewritten: " + ParallelClassLoader.rewriteCount
                + "; Thread.* sites rewritten: " + ParallelClassLoader.totalStartSites);

        System.out.println("\n--- invoking sample.main() ---");
        ThreadHook.resetCounts();
        java.lang.reflect.Method main = sample.getMethod("main", String[].class);
        main.invoke(null, (Object) new String[0]);

        System.out.println("\n--- after invocation ---");
        System.out.println("ThreadHook.startCount: " + ThreadHook.getStartCount());
        System.out.println("ThreadHook.joinCount:  " + ThreadHook.getJoinCount());

        if (ThreadHook.getStartCount() > 0) {
            System.out.println("\nSUCCESS: bytecode rewrite routed Thread.start() through ThreadHook");
        } else {
            System.out.println("\nFAIL: Thread.start() was NOT routed through ThreadHook");
        }
    }
}
