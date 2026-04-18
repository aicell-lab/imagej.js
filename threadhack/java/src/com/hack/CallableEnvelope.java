package com.hack;

import java.io.Serializable;
import java.util.concurrent.Callable;

/**
 * Serializable wrapper that runs a Callable<T> on the worker JVM and carries
 * back the result / exception. Shipped as Runnable so it reuses the same
 * Thread.start mechanism.
 */
public class CallableEnvelope<T> implements Runnable, Serializable {
    private static final long serialVersionUID = 1L;

    public final Callable<T> task;  // must also be Serializable
    public T result;
    public Throwable exception;
    public boolean done;

    public CallableEnvelope(Callable<T> task) { this.task = task; }

    @Override
    public void run() {
        try { this.result = task.call(); }
        catch (Throwable t) { this.exception = t; }
        finally { this.done = true; }
    }
}
