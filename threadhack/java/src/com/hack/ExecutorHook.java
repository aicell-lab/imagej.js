package com.hack;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * Rewrite targets for Executors.* / ForkJoinPool.* / CompletableFuture.* calls.
 * Every rewritten call site routes through our worker pool via
 * WorkerBackedExecutorService (or its ForkJoinPool-typed wrapper).
 */
public final class ExecutorHook {
    private ExecutorHook() {}

    public static volatile int createdPools   = 0;

    // ---- Executors.* ----
    public static ExecutorService newFixedThreadPool(int nThreads)        { createdPools++; return new WorkerBackedExecutorService("fixed-" + nThreads); }
    public static ExecutorService newCachedThreadPool()                   { createdPools++; return new WorkerBackedExecutorService("cached"); }
    public static ExecutorService newSingleThreadExecutor()               { createdPools++; return new WorkerBackedExecutorService("single"); }
    public static ExecutorService newWorkStealingPool(int parallelism)    { createdPools++; return new WorkerBackedExecutorService("wsp-" + parallelism); }
    public static ExecutorService newWorkStealingPool()                   { createdPools++; return new WorkerBackedExecutorService("wsp"); }

    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        createdPools++;
        // Fall back to the real impl — we don't parallelize scheduled tasks today
        return new ScheduledThreadPoolExecutor(Math.max(1, corePoolSize));
    }
    public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
        createdPools++;
        return new ScheduledThreadPoolExecutor(1);
    }

    // ---- direct new ThreadPoolExecutor(...) constructor substitution ----
    // Rewriter redirects INVOKESPECIAL new ThreadPoolExecutor.<init> → newThreadPoolExecutor(...)
    // Returns ExecutorService (compatible supertype), bytecode loads it back via checkcast if needed.
    public static ThreadPoolExecutor newThreadPoolExecutor(int corePoolSize, int maximumPoolSize,
                                                        long keepAliveTime, TimeUnit unit,
                                                        BlockingQueue<Runnable> queue) {
        createdPools++;
        return new WorkerBackedThreadPoolExecutor();
    }
    public static ThreadPoolExecutor newThreadPoolExecutor(int corePoolSize, int maximumPoolSize,
                                                        long keepAliveTime, TimeUnit unit,
                                                        BlockingQueue<Runnable> queue,
                                                        ThreadFactory threadFactory) {
        createdPools++;
        return new WorkerBackedThreadPoolExecutor();
    }
    public static ThreadPoolExecutor newThreadPoolExecutor(int corePoolSize, int maximumPoolSize,
                                                        long keepAliveTime, TimeUnit unit,
                                                        BlockingQueue<Runnable> queue,
                                                        RejectedExecutionHandler handler) {
        createdPools++;
        return new WorkerBackedThreadPoolExecutor();
    }
    public static ThreadPoolExecutor newThreadPoolExecutor(int corePoolSize, int maximumPoolSize,
                                                        long keepAliveTime, TimeUnit unit,
                                                        BlockingQueue<Runnable> queue,
                                                        ThreadFactory threadFactory,
                                                        RejectedExecutionHandler handler) {
        createdPools++;
        return new WorkerBackedThreadPoolExecutor();
    }

    // ---- ForkJoinPool.commonPool() ----
    public static ForkJoinPool forkJoinCommonPool() {
        return WorkerBackedForkJoinPool.commonPool();
    }

    // ---- CompletableFuture async defaults (no-executor overloads) ----
    // The rewriter redirects CompletableFuture.supplyAsync(Supplier) →
    // ExecutorHook.supplyAsync(Supplier) which routes through our executor.
    public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier) {
        return CompletableFuture.supplyAsync(supplier, WorkerBackedForkJoinPool.commonPool());
    }
    public static CompletableFuture<Void> runAsync(Runnable runnable) {
        return CompletableFuture.runAsync(runnable, WorkerBackedForkJoinPool.commonPool());
    }
}
