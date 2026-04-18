package com.hack;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.jar.JarInputStream;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

/**
 * Walks every .class entry in a jar, reports every Thread.* / Executors.*
 * call site our rewriter would touch — no execution, pure static analysis.
 *
 * Usage: main(jarPath) — prints per-site counts + class names + per-class list.
 */
public class ScanTool {
    // Count how often each (owner, name, desc) tuple appears
    static int totalClasses = 0;
    static int classesWithHits = 0;
    static int totalRewriteSites = 0;

    static int threadStart = 0;
    static int threadJoinVoid = 0, threadJoinLong = 0, threadJoinLongInt = 0;
    static int threadIsAlive = 0, threadInterrupt = 0;
    static int execFixed = 0, execCached = 0, execSingle = 0, execWSP_i = 0, execWSP_0 = 0;
    static int execScheduled = 0, execSingleScheduled = 0;
    static int execOther = 0;
    static int tpeDirect = 0;
    static int forkJoinCommon = 0, forkJoinOther = 0;
    static int cfSupplyAsync = 0, cfRunAsync = 0, cfOther = 0;

    // Classes-that-contain-at-least-one-hit
    static final Set<String> hitClasses = new HashSet<>();
    // Per-pattern example classes (cap at a few)
    static final java.util.Map<String, java.util.List<String>> examples = new java.util.LinkedHashMap<>();

    static void example(String pattern, String className) {
        java.util.List<String> lst = examples.get(pattern);
        if (lst == null) { lst = new java.util.ArrayList<>(); examples.put(pattern, lst); }
        if (lst.size() < 5 && !lst.contains(className)) lst.add(className);
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 1) { System.out.println("usage: ScanTool <jarPath>"); return; }
        String jarPath = args[0];

        System.out.println("=== Scanning: " + jarPath + " ===");
        InputStream in;
        try {
            in = new URL("file://" + jarPath).openStream();
        } catch (Exception e) { System.out.println("FAIL open: " + e); return; }

        JarInputStream jis = new JarInputStream(in);
        JarEntry entry;
        while ((entry = jis.getNextJarEntry()) != null) {
            if (entry.isDirectory()) continue;
            String name = entry.getName();
            if (!name.endsWith(".class")) continue;

            byte[] bytes = readAll(jis);
            totalClasses++;
            String className = name.replace('/', '.').substring(0, name.length() - 6);
            scanClass(className, bytes);
        }
        jis.close();

        System.out.println();
        System.out.println("=== results for " + jarPath + " ===");
        System.out.println("total classes scanned:     " + totalClasses);
        System.out.println("classes with rewrite-hits: " + hitClasses.size());
        System.out.println("total rewrite sites:       " + totalRewriteSites);
        System.out.println();
        System.out.println("-- Thread.* sites (rewriter ALREADY covers):");
        System.out.println("  Thread.start()          : " + threadStart);
        System.out.println("  Thread.join()           : " + threadJoinVoid);
        System.out.println("  Thread.join(long)       : " + threadJoinLong);
        System.out.println("  Thread.join(long,int)   : " + threadJoinLongInt);
        System.out.println("  Thread.isAlive()        : " + threadIsAlive);
        System.out.println("  Thread.interrupt()      : " + threadInterrupt);
        System.out.println();
        System.out.println("-- Executors.* sites (rewriter covers):");
        System.out.println("  newFixedThreadPool(n)     : " + execFixed);
        System.out.println("  newCachedThreadPool()     : " + execCached);
        System.out.println("  newSingleThreadExecutor() : " + execSingle);
        System.out.println("  newWorkStealingPool(n)    : " + execWSP_i);
        System.out.println("  newWorkStealingPool()     : " + execWSP_0);
        System.out.println("  newScheduledThreadPool(n) : " + execScheduled + "  (fallback to real scheduler)");
        System.out.println("  newSingleThreadScheduledExecutor: " + execSingleScheduled + "  (fallback)");
        System.out.println();
        System.out.println("-- ForkJoinPool.* (rewriter covers commonPool()):");
        System.out.println("  ForkJoinPool.commonPool() : " + forkJoinCommon);
        System.out.println("  Other ForkJoinPool usage  : " + forkJoinOther);
        System.out.println();
        System.out.println("-- CompletableFuture.* (rewriter covers *Async no-executor overloads):");
        System.out.println("  supplyAsync(Supplier)     : " + cfSupplyAsync);
        System.out.println("  runAsync(Runnable)        : " + cfRunAsync);
        System.out.println("  other CF async overloads  : " + cfOther);
        System.out.println();
        System.out.println("-- NOT yet covered (flagged for future):");
        System.out.println("  OTHER Executors factory   : " + execOther);
        System.out.println("  new ThreadPoolExecutor    : " + tpeDirect);

        System.out.println();
        System.out.println("-- example classes per pattern (first 5):");
        for (java.util.Map.Entry<String, java.util.List<String>> e : examples.entrySet()) {
            System.out.println("  " + e.getKey() + ":");
            for (String c : e.getValue()) System.out.println("    " + c);
        }

        System.out.println();
        System.out.println("SUMMARY for " + jarPath + ":  classes=" + totalClasses
                + " hits=" + hitClasses.size()
                + " sites=" + totalRewriteSites);
    }

    static byte[] readAll(InputStream in) throws IOException {
        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int n;
        while ((n = in.read(buf)) > 0) baos.write(buf, 0, n);
        return baos.toByteArray();
    }

    static void scanClass(final String className, byte[] bytes) {
        try {
            ClassReader cr = new ClassReader(bytes);
            cr.accept(new ClassVisitor(Opcodes.ASM9) {
                @Override
                public MethodVisitor visitMethod(int access, String mname, String mdesc,
                                                  String sig, String[] exc) {
                    return new MethodVisitor(Opcodes.ASM9) {
                        @Override
                        public void visitMethodInsn(int opcode, String owner, String n, String d, boolean itf) {
                            boolean hit = false;
                            if (opcode == Opcodes.INVOKEVIRTUAL && "java/lang/Thread".equals(owner)) {
                                if ("start".equals(n) && "()V".equals(d)) { threadStart++; example("Thread.start()", className); hit = true; }
                                else if ("join".equals(n) && "()V".equals(d)) { threadJoinVoid++; example("Thread.join()", className); hit = true; }
                                else if ("join".equals(n) && "(J)V".equals(d)) { threadJoinLong++; example("Thread.join(J)", className); hit = true; }
                                else if ("join".equals(n) && "(JI)V".equals(d)) { threadJoinLongInt++; example("Thread.join(JI)", className); hit = true; }
                                else if ("isAlive".equals(n) && "()Z".equals(d)) { threadIsAlive++; example("Thread.isAlive()", className); hit = true; }
                                else if ("interrupt".equals(n) && "()V".equals(d)) { threadInterrupt++; example("Thread.interrupt()", className); hit = true; }
                            } else if (opcode == Opcodes.INVOKESTATIC && "java/util/concurrent/Executors".equals(owner)) {
                                if (n.equals("newFixedThreadPool") && d.equals("(I)Ljava/util/concurrent/ExecutorService;")) { execFixed++; example("Executors.newFixedThreadPool(I)", className); hit = true; }
                                else if (n.equals("newCachedThreadPool") && d.equals("()Ljava/util/concurrent/ExecutorService;")) { execCached++; example("Executors.newCachedThreadPool()", className); hit = true; }
                                else if (n.equals("newSingleThreadExecutor") && d.equals("()Ljava/util/concurrent/ExecutorService;")) { execSingle++; example("Executors.newSingleThreadExecutor()", className); hit = true; }
                                else if (n.equals("newWorkStealingPool") && d.equals("(I)Ljava/util/concurrent/ExecutorService;")) { execWSP_i++; example("Executors.newWorkStealingPool(I)", className); hit = true; }
                                else if (n.equals("newWorkStealingPool") && d.equals("()Ljava/util/concurrent/ExecutorService;")) { execWSP_0++; example("Executors.newWorkStealingPool()", className); hit = true; }
                                else if (n.equals("newScheduledThreadPool") && d.equals("(I)Ljava/util/concurrent/ScheduledExecutorService;")) { execScheduled++; example("Executors.newScheduledThreadPool(I)", className); hit = true; }
                                else if (n.equals("newSingleThreadScheduledExecutor") && d.equals("()Ljava/util/concurrent/ScheduledExecutorService;")) { execSingleScheduled++; example("Executors.newSingleThreadScheduledExecutor()", className); hit = true; }
                                else { execOther++; example("Executors." + n, className); }
                            } else if (opcode == Opcodes.INVOKESPECIAL
                                    && ("java/util/concurrent/ThreadPoolExecutor".equals(owner)
                                        || "java/util/concurrent/ScheduledThreadPoolExecutor".equals(owner))
                                    && "<init>".equals(n)) {
                                tpeDirect++; example("new " + owner.substring(owner.lastIndexOf('/')+1), className);
                            } else if ("java/util/concurrent/ForkJoinPool".equals(owner)) {
                                if (opcode == Opcodes.INVOKESTATIC && n.equals("commonPool") && d.equals("()Ljava/util/concurrent/ForkJoinPool;")) {
                                    forkJoinCommon++; example("ForkJoinPool.commonPool()", className); hit = true;
                                } else { forkJoinOther++; example("ForkJoinPool." + n, className); }
                            } else if ("java/util/concurrent/CompletableFuture".equals(owner) && opcode == Opcodes.INVOKESTATIC) {
                                if (n.equals("supplyAsync") && d.equals("(Ljava/util/function/Supplier;)Ljava/util/concurrent/CompletableFuture;")) {
                                    cfSupplyAsync++; example("CompletableFuture.supplyAsync(Supplier)", className); hit = true;
                                } else if (n.equals("runAsync") && d.equals("(Ljava/lang/Runnable;)Ljava/util/concurrent/CompletableFuture;")) {
                                    cfRunAsync++; example("CompletableFuture.runAsync(Runnable)", className); hit = true;
                                } else if (n.startsWith("supplyAsync") || n.startsWith("runAsync")) {
                                    cfOther++; example("CompletableFuture." + n, className);
                                }
                            }

                            if (hit) {
                                totalRewriteSites++;
                                hitClasses.add(className);
                            }
                            if (totalRewriteSites == 0 && hit) { /* no-op */ }
                            // don't increment sites for "flagged-not-covered"
                        }
                    };
                }
            }, 0);
        } catch (Throwable t) {
            System.out.println("  SKIP " + className + ": " + t);
        }
    }
}
