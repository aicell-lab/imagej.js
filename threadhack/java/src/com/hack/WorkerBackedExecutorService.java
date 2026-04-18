package com.hack;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.AbstractExecutorService;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.RunnableFuture;
import java.util.concurrent.TimeUnit;

/**
 * ExecutorService that dispatches every Serializable task to the shared
 * worker pool (via ThreadHook.shipForExecution). Non-Serializable tasks fall
 * through to cooperative in-process execution via a local ThreadPoolExecutor.
 *
 * Extends AbstractExecutorService to inherit invokeAll / invokeAny for free.
 */
public class WorkerBackedExecutorService extends AbstractExecutorService {
    private final String name;
    private volatile boolean shutdown = false;
    // Fallback for non-Serializable tasks
    private volatile java.util.concurrent.ExecutorService fallback = null;

    public WorkerBackedExecutorService(String name) {
        this.name = name;
    }

    @Override
    public void execute(Runnable command) {
        // AbstractExecutorService.submit(...) calls us with a RunnableFuture.
        // For non-Future Runnables (direct user calls to execute), wrap+run.
        if (command instanceof java.util.concurrent.RunnableFuture) {
            ((java.util.concurrent.RunnableFuture<?>) command).run();
        } else {
            newTaskFor(command, null).run();
        }
    }

    /** Key entry point — AbstractExecutorService calls this for submit(Callable) and submit(Runnable). */
    @Override
    protected <T> RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
        // If the Runnable itself is Serializable, ship it; .get() returns the caller-supplied `value`.
        return new WorkerFuture<>(runnable, value);
    }

    @Override
    protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {
        return new WorkerFuture<>(callable);
    }

    @Override
    public void shutdown() { shutdown = true; if (fallback != null) fallback.shutdown(); }

    @Override
    public List<Runnable> shutdownNow() {
        shutdown = true;
        return fallback != null ? fallback.shutdownNow() : Collections.<Runnable>emptyList();
    }

    @Override public boolean isShutdown()   { return shutdown; }
    @Override public boolean isTerminated() { return shutdown; }

    @Override
    public boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException {
        if (fallback != null) return fallback.awaitTermination(timeout, unit);
        return shutdown;
    }

    /** Lazily create local fallback for non-Serializable tasks. */
    java.util.concurrent.ExecutorService fallback() {
        if (fallback == null) {
            synchronized (this) {
                if (fallback == null) fallback = java.util.concurrent.Executors.newCachedThreadPool();
            }
        }
        return fallback;
    }
}
