package com.hack;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

/**
 * Runs inside each worker JVM via library-mode. The worker's JS calls
 * WorkerRunner.runSerialized(bytes) when the main JVM dispatches a task.
 * The worker deserializes the Runnable, invokes run(), then serializes the
 * mutated Runnable back for the main JVM to merge.
 */
public final class WorkerRunner {
    private WorkerRunner() {}

    public static byte[] runSerialized(byte[] bytes) throws Exception {
        Runnable r;
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
            r = (Runnable) ois.readObject();
        }
        System.out.println("[worker] deserialized " + r.getClass().getName()
                + ", invoking run()");
        r.run();
        ByteArrayOutputStream baos = new ByteArrayOutputStream(Math.max(bytes.length, 1024));
        try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(r);
        }
        byte[] out = baos.toByteArray();
        System.out.println("[worker] serialized result back (" + out.length + " bytes)");
        return out;
    }
}
