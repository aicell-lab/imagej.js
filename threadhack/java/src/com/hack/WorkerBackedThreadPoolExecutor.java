package com.hack;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Return type of rewritten `new ThreadPoolExecutor(...)` calls. Must extend
 * ThreadPoolExecutor so the caller's `ASTORE` / `CHECKCAST` sites see a
 * compatible type.
 *
 * All the constructor args passed at the user site (corePoolSize, max, keepAlive,
 * TimeUnit, BlockingQueue, optional ThreadFactory, optional RejectedExecutionHandler)
 * are IGNORED — we route every `execute(Runnable)` through our own worker pool
 * regardless. The super(…) pool exists only for type compat / inherited method
 * satisfaction; it's never used to run user work.
 */
public class WorkerBackedThreadPoolExecutor extends ThreadPoolExecutor {

    private final WorkerBackedExecutorService delegate;

    public WorkerBackedThreadPoolExecutor() {
        // Minimal super — never used to run tasks. corePoolSize=0, maxPoolSize=1.
        super(0, 1, 1L, TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());
        this.delegate = new WorkerBackedExecutorService("tpe-hook");
    }

    @Override
    public void execute(Runnable command) {
        delegate.execute(command);
    }

    // Critical: override newTaskFor so submit() wraps tasks in our WorkerFuture
    // (the default inherited from AbstractExecutorService returns a plain FutureTask
    // which would just run .run() locally in our execute override).
    @Override
    protected <T> java.util.concurrent.RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
        return new WorkerFuture<>(runnable, value);
    }
    @Override
    protected <T> java.util.concurrent.RunnableFuture<T> newTaskFor(java.util.concurrent.Callable<T> callable) {
        return new WorkerFuture<>(callable);
    }

    @Override
    public boolean isShutdown()   { return delegate.isShutdown(); }
    @Override
    public boolean isTerminated() { return delegate.isTerminated(); }

    @Override
    public boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException {
        return delegate.awaitTermination(timeout, unit);
    }

    @Override
    public void shutdown() { delegate.shutdown(); super.shutdown(); }
}
