package com.hack.sample;

import java.io.Serializable;

/**
 * Sample victim. Two Runnables — one Serializable (should ship to worker),
 * one anonymous (not Serializable, should fall through to cooperative).
 */
public class ThreadSpawn {
    public static void main(String[] args) throws Exception {
        System.out.println("[sample.main] start");

        // Serializable Runnable — should be routed to a worker JVM
        SumJob job = new SumJob(1_000_000);
        Thread t = new Thread(job, "ship-worker");
        System.out.println("[sample.main] calling t.start() on SERIALIZABLE SumJob");
        t.start();
        System.out.println("[sample.main] calling t.join()");
        t.join();
        System.out.println("[sample.main] SumJob result.sum = " + job.sum
                + " (computed on " + job.executedOn + ")");

        // Anonymous inner class — NOT Serializable, should fall through
        final int[] out = { 0 };
        Runnable anon = new Runnable() {
            @Override public void run() {
                int s = 0;
                for (int i = 0; i < 500_000; i++) s += i;
                out[0] = s;
                System.out.println("[anon-worker] ran on thread=" + Thread.currentThread().getName());
            }
        };
        Thread t2 = new Thread(anon, "anon-worker");
        System.out.println("\n[sample.main] calling t2.start() on NON-Serializable Runnable");
        t2.start();
        t2.join();
        System.out.println("[sample.main] anon result = " + out[0]);

        System.out.println("\n[sample.main] done");
    }

    /**
     * Serializable Runnable — captures input (n), stores result back in its own field.
     * The worker JVM deserializes this instance, invokes run(), serializes the
     * mutated instance back. The main JVM reads sum after join().
     */
    public static class SumJob implements Runnable, Serializable {
        private static final long serialVersionUID = 1L;
        public final int n;
        public long sum;
        public String executedOn = "(not executed)";

        public SumJob(int n) { this.n = n; }

        @Override
        public void run() {
            this.executedOn = Thread.currentThread().getName()
                    + " @ " + (self() ? "worker-JVM" : "main-JVM");
            long s = 0;
            for (int i = 0; i < n; i++) s += i;
            this.sum = s;
            System.out.println("[SumJob.run] sum=" + s + " on " + executedOn);
        }

        /**
         * Cheap heuristic to tell which JVM we're in — a System property the
         * worker bootstrap sets. Main doesn't set it → returns false.
         */
        private static boolean self() {
            return "1".equals(System.getProperty("com.hack.isWorkerJVM"));
        }
    }
}
