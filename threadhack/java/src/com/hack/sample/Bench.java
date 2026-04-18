package com.hack.sample;

import java.io.Serializable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Benchmark runnable either way — via Thread.start() or Executors.newFixedThreadPool().
 * When loaded through com.hack.ParallelClassLoader, both paths get rewritten to go
 * through ThreadHook / ExecutorHook → worker pool.
 *
 * All bench methods take (n, work, warmup) and return wall time in ms.
 */
public class Bench {

    public static long runThreadBench(int n, int work, boolean warmup) throws Exception {
        if (warmup) warmupPass(n);
        Thread[] ts = new Thread[n];
        SumJob[] jobs = new SumJob[n];
        for (int i = 0; i < n; i++) {
            jobs[i] = new SumJob(work);
            ts[i] = new Thread(jobs[i], "bench-" + i);
        }
        long t0 = System.currentTimeMillis();
        for (int i = 0; i < n; i++) ts[i].start();
        for (int i = 0; i < n; i++) ts[i].join();
        long wall = System.currentTimeMillis() - t0;
        verify(jobs);
        return wall;
    }

    /**
     * Uses the modern Java concurrency API. The bytecode rewriter turns
     * Executors.newFixedThreadPool(n) into ExecutorHook.newFixedThreadPool(n)
     * which returns our WorkerBackedExecutorService.
     */
    public static long runExecutorBench(int n, int work, boolean warmup) throws Exception {
        if (warmup) warmupPass(n);

        ExecutorService ex = Executors.newFixedThreadPool(n);  // ← rewritten call site
        @SuppressWarnings("unchecked")
        Future<Void>[] futs = new Future[n];
        SumJob[] jobs = new SumJob[n];
        for (int i = 0; i < n; i++) jobs[i] = new SumJob(work);

        long t0 = System.currentTimeMillis();
        for (int i = 0; i < n; i++) {
            final SumJob j = jobs[i];
            futs[i] = (Future<Void>) ex.submit((Runnable) j);  // Runnable submit
        }
        for (int i = 0; i < n; i++) futs[i].get();
        long wall = System.currentTimeMillis() - t0;
        ex.shutdown();
        verify(jobs);
        return wall;
    }

    private static void warmupPass(int n) throws Exception {
        System.out.println("[bench] warmup pass N=" + n);
        Thread[] wts = new Thread[n];
        SumJob[] wjs = new SumJob[n];
        for (int i = 0; i < n; i++) {
            wjs[i] = new SumJob(100_000);
            wts[i] = new Thread(wjs[i], "warm-" + i);
        }
        for (int i = 0; i < n; i++) wts[i].start();
        for (int i = 0; i < n; i++) wts[i].join();
    }

    private static void verify(SumJob[] jobs) {
        int shipped = 0;
        for (SumJob j : jobs) {
            if (j.executedOn != null && j.executedOn.contains("worker-JVM")) shipped++;
        }
        System.out.println("[bench] jobs on worker-JVMs: " + shipped + "/" + jobs.length);
    }

    public static class SumJob implements Runnable, Serializable {
        private static final long serialVersionUID = 2L;
        public final int n;
        public long sum;
        public String executedOn;

        public SumJob(int n) { this.n = n; }

        @Override
        public void run() {
            boolean inWorker = "1".equals(System.getProperty("com.hack.isWorkerJVM"));
            this.executedOn = Thread.currentThread().getName()
                    + " @ " + (inWorker ? "worker-JVM" : "main-JVM");
            long s = 0;
            for (int i = 0; i < n; i++) s += i;
            this.sum = s;
        }
    }

    // Back-compat with old main-based harness
    public static void main(String[] args) throws Exception {
        int n    = args.length > 0 ? Integer.parseInt(args[0]) : 4;
        int work = args.length > 1 ? Integer.parseInt(args[1]) : 20_000_000;
        long wall = runThreadBench(n, work, true);
        System.out.println("[bench] wall_ms=" + wall);
    }
}
