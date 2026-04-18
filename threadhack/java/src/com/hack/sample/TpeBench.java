package com.hack.sample;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.Future;

/** Exercises the `new ThreadPoolExecutor(...)` INVOKESPECIAL rewrite path. */
public class TpeBench {
    public static long runDirectTPE(int n, int work) throws Exception {
        // Direct constructor — this SHOULD be rewritten to ExecutorHook.newThreadPoolExecutor
        ThreadPoolExecutor tpe = new ThreadPoolExecutor(
            n, n, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());

        Bench.SumJob[] jobs = new Bench.SumJob[n];
        @SuppressWarnings("unchecked")
        Future<Void>[] futs = new Future[n];
        for (int i = 0; i < n; i++) jobs[i] = new Bench.SumJob(work);

        long t0 = System.currentTimeMillis();
        for (int i = 0; i < n; i++) {
            final Bench.SumJob j = jobs[i];
            futs[i] = (Future<Void>) tpe.submit((Runnable) j);
        }
        for (int i = 0; i < n; i++) futs[i].get();
        long wall = System.currentTimeMillis() - t0;

        int shipped = 0;
        for (Bench.SumJob j : jobs) if (j.executedOn != null && j.executedOn.contains("worker-JVM")) shipped++;
        System.out.println("[TpeBench] wall=" + wall + "ms  shipped=" + shipped + "/" + n);

        tpe.shutdown();
        return wall;
    }
}
