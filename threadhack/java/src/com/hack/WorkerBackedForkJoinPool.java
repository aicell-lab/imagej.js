package com.hack;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.TimeUnit;

/**
 * Stand-in for java.util.concurrent.ForkJoinPool.commonPool(). MUST extend
 * ForkJoinPool so the rewritten commonPool() call site's return-type remains
 * compatible at bytecode level.
 *
 * Scope of coverage:
 *  - execute(Runnable)     — routed through our worker pool (CompletableFuture uses this).
 *  - execute(ForkJoinTask) — routed through our worker pool.
 *  - shutdown / termination — delegated.
 *
 * NOT overridden (falls through to parent ForkJoinPool with parallelism=1):
 *  - submit(Callable) / submit(Runnable) / submit(ForkJoinTask)
 *  - invoke / invokeAll
 *  Reason: ForkJoinPool's submit() returns ForkJoinTask (not Future), and
 *  wrapping our WorkerFuture as a ForkJoinTask is complex. CompletableFuture
 *  and most other users only call execute(), so this subset covers the
 *  common case. Document limit.
 */
public class WorkerBackedForkJoinPool extends ForkJoinPool {

    private static volatile WorkerBackedForkJoinPool COMMON;

    private final WorkerBackedExecutorService delegate;

    public static WorkerBackedForkJoinPool commonPool() {
        WorkerBackedForkJoinPool c = COMMON;
        if (c == null) {
            synchronized (WorkerBackedForkJoinPool.class) {
                if (COMMON == null) COMMON = new WorkerBackedForkJoinPool();
                c = COMMON;
            }
        }
        return c;
    }

    public WorkerBackedForkJoinPool() {
        super(1);  // parent creates a minimal pool we never actually use
        this.delegate = new WorkerBackedExecutorService("fjp-common");
    }

    @Override
    public void execute(Runnable task) {
        delegate.execute(task);
    }

    @Override
    public void execute(ForkJoinTask<?> task) {
        // ForkJoinTask implements Runnable — run via delegate
        delegate.execute((Runnable) task);
    }

    @Override
    public boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException {
        return delegate.awaitTermination(timeout, unit);
    }

    @Override
    public boolean isShutdown()   { return delegate.isShutdown(); }
    @Override
    public boolean isTerminated() { return delegate.isTerminated(); }

    @Override
    public void shutdown() { delegate.shutdown(); super.shutdown(); }
}
