package com.hack;

import java.io.Serializable;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.RunnableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Future returned by WorkerBackedExecutorService. Ships the task to a worker
 * on construction (in run(), but we do it eagerly on .start()). Fires & awaits
 * via ThreadHook shipping primitives. Non-Serializable tasks fall back to
 * cooperative execution via a hidden local thread.
 */
public class WorkerFuture<T> implements RunnableFuture<T> {
    private final Callable<T> callable;  // null if constructed from Runnable
    private final Runnable runnable;     // null if constructed from Callable
    private final T runnableValue;       // value returned on Runnable-based submits
    private final CallableEnvelope<T> envelope;  // when callable != null

    private volatile boolean started = false;
    private volatile boolean done    = false;
    private volatile boolean cancelled = false;
    private volatile long handle = -1L;
    private volatile T result;
    private volatile Throwable exception;

    // Fallback path
    private volatile Thread fallbackThread = null;

    public WorkerFuture(Callable<T> callable) {
        this.callable = callable;
        this.runnable = null;
        this.runnableValue = null;
        this.envelope = new CallableEnvelope<>(callable);
    }

    public WorkerFuture(Runnable runnable, T value) {
        this.callable = null;
        this.runnable = runnable;
        this.runnableValue = value;
        this.envelope = null;
    }

    /** AbstractExecutorService calls this from submit(). */
    @Override
    public void run() {
        if (started) return;
        started = true;
        Object shipTarget;
        if (envelope != null) {
            // For Callable: ship the envelope (which IS Serializable if the Callable is)
            if (!(callable instanceof Serializable)) {
                runFallback();
                return;
            }
            shipTarget = envelope;
        } else {
            if (!(runnable instanceof Serializable)) {
                runFallback();
                return;
            }
            shipTarget = runnable;
        }

        try {
            this.handle = ThreadHook.shipForExecution(shipTarget);
            // NOTE: don't await here — caller will block in .get()
        } catch (Throwable t) {
            // Serialization failed or no pool — fall back
            System.out.println("[WorkerFuture] ship failed, falling back: " + t);
            runFallback();
        }
    }

    private void runFallback() {
        final Thread ft = new Thread(() -> {
            try {
                if (envelope != null) {
                    try { result = callable.call(); }
                    catch (Throwable ex) { exception = ex; }
                } else {
                    try { runnable.run(); result = runnableValue; }
                    catch (Throwable ex) { exception = ex; }
                }
            } finally {
                synchronized (this) { done = true; notifyAll(); }
            }
        });
        this.fallbackThread = ft;
        ft.start();
    }

    @Override
    @SuppressWarnings("unchecked")
    public T get() throws InterruptedException, ExecutionException {
        if (!started) throw new IllegalStateException("future not started (missing executor.submit?)");
        if (handle >= 0) {
            // Worker path
            if (!done) {
                try {
                    if (envelope != null) {
                        // Await + merge on envelope (which has result / exception fields after worker run)
                        ThreadHook.awaitAndMerge(handle, envelope);
                        if (envelope.exception != null) exception = envelope.exception;
                        else result = envelope.result;
                    } else {
                        ThreadHook.awaitAndMerge(handle, runnable);
                        result = runnableValue;
                    }
                } catch (Exception e) { exception = e; }
                finally { done = true; }
            }
        } else if (fallbackThread != null) {
            // Fallback path — join or wait on done
            synchronized (this) { while (!done) wait(); }
        } else {
            throw new IllegalStateException("future has no dispatch path");
        }
        if (cancelled) throw new CancellationException();
        if (exception != null) throw new ExecutionException(exception);
        return result;
    }

    @Override
    public T get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException {
        // Simplified: ignore timeout (full block). Stage-4 polish: add a timer.
        return get();
    }

    @Override public boolean isDone()      { return done; }
    @Override public boolean isCancelled() { return cancelled; }

    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
        if (done) return false;
        cancelled = true;
        if (fallbackThread != null && mayInterruptIfRunning) fallbackThread.interrupt();
        // Shipped tasks can't be cancelled (worker doesn't support cancel yet).
        return true;
    }
}
