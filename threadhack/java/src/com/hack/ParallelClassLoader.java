package com.hack;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.jar.JarInputStream;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.ClassNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.InsnNode;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.TypeInsnNode;

/**
 * ClassLoader that intercepts class bytes on their way in and rewrites:
 *   INVOKEVIRTUAL java/lang/Thread.start()V
 *     -> INVOKESTATIC com/hack/ThreadHook.start(Ljava/lang/Thread;)V
 * and related Thread.* methods. Jar-agnostic.
 *
 * Delegation order: parent ClassLoader first for com.hack.* and java.*; this
 * loader for everything else (ij.*, user code, plugins).
 */
public class ParallelClassLoader extends URLClassLoader {
    public static int rewriteCount = 0;
    public static int totalClasses = 0;
    public static int totalStartSites = 0;

    public ParallelClassLoader(URL[] urls, ClassLoader parent) {
        super(urls, parent);
    }

    /**
     * Single-arg constructor required when set as -Djava.system.class.loader.
     * No explicit URLs — relies on parent's resources to find class bytes.
     */
    public ParallelClassLoader(ClassLoader parent) {
        super(new URL[0], parent);
    }

    /** Specific runtime classes that must NOT be rewritten. Populated below. */
    private static final java.util.Set<String> RUNTIME_CLASSES = new java.util.HashSet<>(java.util.Arrays.asList(
        "com.hack.BenchTool",
        "com.hack.ClassLoaderTest",
        "com.hack.RewriteTest",
        "com.hack.ParallelClassLoader",
        "com.hack.ThreadHook",
        "com.hack.ExecutorHook",
        "com.hack.WorkerBackedExecutorService",
        "com.hack.WorkerFuture",
        "com.hack.WorkerRunner",
        "com.hack.CallableEnvelope"
    ));

    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        // Parent first for JDK, ASM, and our own runtime classes
        if (name.startsWith("java.") || name.startsWith("sun.") || name.startsWith("jdk.")
                || name.startsWith("org.objectweb.asm.") || RUNTIME_CLASSES.contains(name)) {
            return super.loadClass(name, resolve);
        }
        // Self first for everything else
        synchronized (getClassLoadingLock(name)) {
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                try {
                    c = findClass(name);
                } catch (ClassNotFoundException e) {
                    c = super.loadClass(name, false);
                }
            }
            if (resolve) resolveClass(c);
            return c;
        }
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        String path = name.replace('.', '/') + ".class";
        URL u = findResource(path);
        InputStream in;
        if (u != null) {
            try { in = u.openStream(); } catch (Exception e) { throw new ClassNotFoundException(name, e); }
        } else if (getURLs().length == 0 && getParent() != null) {
            // No explicit URLs — use the parent's resource chain (for system-classloader mode)
            in = getParent().getResourceAsStream(path);
            if (in == null) throw new ClassNotFoundException(name);
        } else {
            throw new ClassNotFoundException(name);
        }
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            in.close();
            byte[] rawBytes = out.toByteArray();

            byte[] finalBytes = rewrite(name, rawBytes);
            totalClasses++;
            return defineClass(name, finalBytes, 0, finalBytes.length);
        } catch (Throwable t) {
            throw new ClassNotFoundException(name, t);
        }
    }

    public static int synchronizedWarnings = 0;
    public static int tpeDirectRewrites = 0;
    public static int pfrMethodPatched = 0;
    public static int pluginFilterSerializableInjected = 0;

    /** Field type descriptors we force transient when the enclosing class is (or becomes) Serializable. */
    private static final java.util.Set<String> TRANSIENT_FIELD_TYPES = new java.util.HashSet<>(java.util.Arrays.asList(
        "Lij/ImagePlus;",
        "Lij/gui/GenericDialog;",
        "Lij/gui/ImageWindow;",
        "Lij/gui/StackWindow;",
        "Lij/gui/Overlay;",
        "Lij/gui/Roi;",
        "Ljava/lang/Thread;",
        "Ljava/util/Hashtable;"
    ));

    /** Field type prefixes: any field whose type starts with one of these is forced transient. */
    private static final String[] TRANSIENT_TYPE_PREFIXES = new String[] {
        "Ljava/awt/",         // Frame, Component, Graphics, Canvas, etc.
        "Ljavax/swing/",      // JFrame, JPanel, etc.
        "Lsun/java2d/",       // SunGraphics2D, ...
        "Lsun/awt/",
        "Ljava/awt/image/",   // BufferedImage, Raster, etc.
        "Lcom/sun/",          // com.sun.* internal classes
        "Ljava/io/InputStream",
        "Ljava/io/OutputStream",
        "Ljava/io/Reader",
        "Ljava/io/Writer",
        "Ljava/io/File;",
        "Ljava/lang/Class;",
        "Ljava/lang/ClassLoader;",
        "Ljava/lang/ref/",    // WeakReference etc.
    };

    private static boolean shouldForceTransient(String desc) {
        if (TRANSIENT_FIELD_TYPES.contains(desc)) return true;
        for (String prefix : TRANSIENT_TYPE_PREFIXES) if (desc.startsWith(prefix)) return true;
        return false;
    }

    /**
     * Feature flag: PFR auto-patch. Phase A (serial mirror) is safe to enable
     * — identical output to unpatched. Phase B (parallel dispatch) needs per-filter
     * regression testing before enabling. Default: ON (Phase A is safe).
     */
    public static boolean pfrAutoPatch = true;

    /** Run the bytecode through ASM to rewrite Thread.* and concurrency-API invocations. */
    private byte[] rewrite(String className, byte[] classBytes) {
        // --- Pre-pass (tree API): rewrite NEW ThreadPoolExecutor + INVOKESPECIAL <init>
        //     into INVOKESTATIC ExecutorHook.newThreadPoolExecutor(...)
        classBytes = rewriteDirectTPEConstructors(className, classBytes);

        // --- PFR auto-patch: replace the body of processImageUsingThreads
        if (pfrAutoPatch && "ij/plugin/filter/PlugInFilterRunner".equals(className.replace('.', '/'))) {
            classBytes = patchPFRMethodBody(className, classBytes);
        }

        // --- Phase B: inject Serializable into PlugInFilter subclasses
        classBytes = injectSerializableIntoPlugInFilter(className, classBytes);

        ClassReader cr = new ClassReader(classBytes);
        ClassWriter cw = new ClassWriter(cr, 0);
        final int[] siteCount = { 0 };
        final int[] monitorCount = { 0 };
        ClassVisitor cv = new ClassVisitor(Opcodes.ASM9, cw) {
            @Override
            public MethodVisitor visitMethod(int access, String name, String descriptor,
                                              String signature, String[] exceptions) {
                MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
                return new MethodVisitor(Opcodes.ASM9, mv) {
                    @Override
                    public void visitInsn(int opcode) {
                        if (opcode == Opcodes.MONITORENTER || opcode == Opcodes.MONITOREXIT) {
                            monitorCount[0]++;
                        }
                        super.visitInsn(opcode);
                    }
                    @Override
                    public void visitMethodInsn(int opcode, String owner, String mName, String mDesc, boolean isInterface) {
                        // --- java.lang.Thread virtual methods ---
                        if (opcode == Opcodes.INVOKEVIRTUAL && "java/lang/Thread".equals(owner)) {
                            String hookName = null, hookDesc = null;
                            if ("start".equals(mName) && "()V".equals(mDesc)) {
                                hookName = "start"; hookDesc = "(Ljava/lang/Thread;)V";
                            } else if ("join".equals(mName) && "()V".equals(mDesc)) {
                                hookName = "join"; hookDesc = "(Ljava/lang/Thread;)V";
                            } else if ("join".equals(mName) && "(J)V".equals(mDesc)) {
                                hookName = "join"; hookDesc = "(Ljava/lang/Thread;J)V";
                            } else if ("join".equals(mName) && "(JI)V".equals(mDesc)) {
                                hookName = "join"; hookDesc = "(Ljava/lang/Thread;JI)V";
                            } else if ("isAlive".equals(mName) && "()Z".equals(mDesc)) {
                                hookName = "isAlive"; hookDesc = "(Ljava/lang/Thread;)Z";
                            } else if ("interrupt".equals(mName) && "()V".equals(mDesc)) {
                                hookName = "interrupt"; hookDesc = "(Ljava/lang/Thread;)V";
                            }
                            if (hookName != null) {
                                siteCount[0]++;
                                super.visitMethodInsn(Opcodes.INVOKESTATIC,
                                        "com/hack/ThreadHook", hookName, hookDesc, false);
                                return;
                            }
                        }
                        // --- java.util.concurrent.Executors static factories ---
                        if (opcode == Opcodes.INVOKESTATIC && "java/util/concurrent/Executors".equals(owner)) {
                            String hookName = null, hookDesc = null;
                            if ("newFixedThreadPool".equals(mName) && "(I)Ljava/util/concurrent/ExecutorService;".equals(mDesc)) {
                                hookName = "newFixedThreadPool"; hookDesc = "(I)Ljava/util/concurrent/ExecutorService;";
                            } else if ("newCachedThreadPool".equals(mName) && "()Ljava/util/concurrent/ExecutorService;".equals(mDesc)) {
                                hookName = "newCachedThreadPool"; hookDesc = "()Ljava/util/concurrent/ExecutorService;";
                            } else if ("newSingleThreadExecutor".equals(mName) && "()Ljava/util/concurrent/ExecutorService;".equals(mDesc)) {
                                hookName = "newSingleThreadExecutor"; hookDesc = "()Ljava/util/concurrent/ExecutorService;";
                            } else if ("newWorkStealingPool".equals(mName) && "(I)Ljava/util/concurrent/ExecutorService;".equals(mDesc)) {
                                hookName = "newWorkStealingPool"; hookDesc = "(I)Ljava/util/concurrent/ExecutorService;";
                            } else if ("newWorkStealingPool".equals(mName) && "()Ljava/util/concurrent/ExecutorService;".equals(mDesc)) {
                                hookName = "newWorkStealingPool"; hookDesc = "()Ljava/util/concurrent/ExecutorService;";
                            } else if ("newScheduledThreadPool".equals(mName) && "(I)Ljava/util/concurrent/ScheduledExecutorService;".equals(mDesc)) {
                                hookName = "newScheduledThreadPool"; hookDesc = "(I)Ljava/util/concurrent/ScheduledExecutorService;";
                            } else if ("newSingleThreadScheduledExecutor".equals(mName) && "()Ljava/util/concurrent/ScheduledExecutorService;".equals(mDesc)) {
                                hookName = "newSingleThreadScheduledExecutor"; hookDesc = "()Ljava/util/concurrent/ScheduledExecutorService;";
                            }
                            if (hookName != null) {
                                siteCount[0]++;
                                super.visitMethodInsn(Opcodes.INVOKESTATIC,
                                        "com/hack/ExecutorHook", hookName, hookDesc, false);
                                return;
                            }
                        }

                        // --- ForkJoinPool.commonPool() ---
                        if (opcode == Opcodes.INVOKESTATIC && "java/util/concurrent/ForkJoinPool".equals(owner)
                                && "commonPool".equals(mName) && "()Ljava/util/concurrent/ForkJoinPool;".equals(mDesc)) {
                            siteCount[0]++;
                            super.visitMethodInsn(Opcodes.INVOKESTATIC,
                                    "com/hack/ExecutorHook", "forkJoinCommonPool",
                                    "()Ljava/util/concurrent/ForkJoinPool;", false);
                            return;
                        }

                        // --- CompletableFuture.supplyAsync / runAsync (no-executor overloads) ---
                        if (opcode == Opcodes.INVOKESTATIC && "java/util/concurrent/CompletableFuture".equals(owner)) {
                            if ("supplyAsync".equals(mName) && "(Ljava/util/function/Supplier;)Ljava/util/concurrent/CompletableFuture;".equals(mDesc)) {
                                siteCount[0]++;
                                super.visitMethodInsn(Opcodes.INVOKESTATIC, "com/hack/ExecutorHook",
                                        "supplyAsync", mDesc, false);
                                return;
                            }
                            if ("runAsync".equals(mName) && "(Ljava/lang/Runnable;)Ljava/util/concurrent/CompletableFuture;".equals(mDesc)) {
                                siteCount[0]++;
                                super.visitMethodInsn(Opcodes.INVOKESTATIC, "com/hack/ExecutorHook",
                                        "runAsync", mDesc, false);
                                return;
                            }
                        }

                        super.visitMethodInsn(opcode, owner, mName, mDesc, isInterface);
                    }
                };
            }
        };
        cr.accept(cv, 0);
        if (siteCount[0] > 0) {
            rewriteCount++;
            totalStartSites += siteCount[0];
            System.out.println("[rewrite] " + className + " (" + siteCount[0] + " sites)");
        }
        if (monitorCount[0] > 0 && siteCount[0] > 0) {
            // Warn only when there ARE rewritten dispatch sites — since that means
            // the Runnable might run in a separate JVM, where cross-JVM locks don't work
            // Only warn if this class ALSO has rewrite sites — such a class's
            // Runnable may execute in a worker JVM where `synchronized` locks
            // are local to that JVM, not shared with main. Detection-only.
            synchronizedWarnings++;
            System.out.println("[WARN] " + className + " uses synchronized blocks ("
                    + monitorCount[0] + " sites) AND has rewritten thread-dispatch calls. "
                    + "If the Runnable/Callable locks cross-JVM-shared state, semantics will "
                    + "silently differ (each worker JVM has its own locks).");
        }
        return cw.toByteArray();
    }

    /**
     * Pre-pass: find `NEW TPE` + `DUP` + args + `INVOKESPECIAL TPE.<init>` patterns
     * and rewrite them to `args + INVOKESTATIC ExecutorHook.newThreadPoolExecutor(...)`.
     *
     * Matches NEW to <init> via a stack of pending NEWs (innermost match first),
     * so nested `new X(new Y(...))` patterns work correctly.
     */
    private byte[] rewriteDirectTPEConstructors(String className, byte[] bytes) {
        ClassReader cr = new ClassReader(bytes);
        ClassNode cn = new ClassNode();
        cr.accept(cn, 0);

        int totalRewrites = 0;
        for (Object mobj : cn.methods) {
            MethodNode mn = (MethodNode) mobj;
            totalRewrites += rewriteMethodTPE(mn);
        }
        if (totalRewrites == 0) return bytes;

        tpeDirectRewrites += totalRewrites;
        System.out.println("[rewrite-tree] " + className + " (" + totalRewrites + " new ThreadPoolExecutor sites)");

        // COMPUTE_MAXS: recalculate max stack/locals since we removed instructions.
        // No frame-type analysis needed — stack depth math is straightforward.
        ClassWriter cw = new ClassWriter(cr, ClassWriter.COMPUTE_MAXS);
        cn.accept(cw);
        return cw.toByteArray();
    }

    private static boolean isRewritableCtorOwner(String owner) {
        return "java/util/concurrent/ThreadPoolExecutor".equals(owner);
        // NOTE: ScheduledThreadPoolExecutor could be added but scheduled ops don't
        // benefit from our worker pool — keep it using the real impl for now.
    }

    /**
     * Replace the body of {@code PlugInFilterRunner.processImageUsingThreads}
     * with a single call to {@code com.hack.ij.PFRParallelRunner.dispatch(this, ip, fp, prevBuffer)}.
     *
     * Signature of the original method (from javap):
     *   private void processImageUsingThreads(
     *       ij.process.ImageProcessor ip,
     *       ij.process.FloatProcessor fp,
     *       java.lang.Object prevBuf);
     *
     * Our dispatch static method signature:
     *   public static void dispatch(Object pfr, Object ip, Object fp, Object prevBuf);
     */
    private byte[] patchPFRMethodBody(String className, byte[] bytes) {
        ClassReader cr = new ClassReader(bytes);
        ClassNode cn = new ClassNode();
        cr.accept(cn, 0);

        boolean patched = false;
        for (Object mobj : cn.methods) {
            MethodNode mn = (MethodNode) mobj;
            if (!"processImageUsingThreads".equals(mn.name)) continue;
            // Exact descriptor we expect from ImageJ's PlugInFilterRunner
            if (!"(Lij/process/ImageProcessor;Lij/process/FloatProcessor;Ljava/lang/Object;)V".equals(mn.desc)) {
                System.out.println("[PFR-patch] SKIP — unexpected descriptor: " + mn.desc);
                continue;
            }
            // Clear original instructions + try-catch blocks
            mn.instructions.clear();
            if (mn.tryCatchBlocks != null) mn.tryCatchBlocks.clear();
            if (mn.localVariables != null) mn.localVariables.clear();
            mn.maxStack = 4;
            mn.maxLocals = 4;

            InsnList body = new InsnList();
            // ALOAD 0 (this), ALOAD 1 (ip), ALOAD 2 (fp), ALOAD 3 (prevBuf)
            body.add(new org.objectweb.asm.tree.VarInsnNode(Opcodes.ALOAD, 0));
            body.add(new org.objectweb.asm.tree.VarInsnNode(Opcodes.ALOAD, 1));
            body.add(new org.objectweb.asm.tree.VarInsnNode(Opcodes.ALOAD, 2));
            body.add(new org.objectweb.asm.tree.VarInsnNode(Opcodes.ALOAD, 3));
            body.add(new MethodInsnNode(Opcodes.INVOKESTATIC,
                    "com/hack/ij/PFRParallelRunner",
                    "dispatch",
                    "(Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/Object;)V",
                    false));
            body.add(new InsnNode(Opcodes.RETURN));
            mn.instructions.add(body);
            patched = true;
            pfrMethodPatched++;
            System.out.println("[PFR-patch] processImageUsingThreads body replaced with PFRParallelRunner.dispatch");
        }
        if (!patched) return bytes;

        ClassWriter cw = new ClassWriter(cr, 0);
        cn.accept(cw);
        return cw.toByteArray();
    }

    /** Scan fields of a ClassNode, force transient on known non-Serializable types. */
    private static int applyTransientMask(ClassNode cn) {
        int count = 0;
        if (cn.fields == null) return 0;
        for (Object fobj : cn.fields) {
            org.objectweb.asm.tree.FieldNode f = (org.objectweb.asm.tree.FieldNode) fobj;
            if ((f.access & Opcodes.ACC_STATIC) != 0) continue;
            if ((f.access & Opcodes.ACC_TRANSIENT) != 0) continue;
            if (shouldForceTransient(f.desc)) {
                f.access |= Opcodes.ACC_TRANSIENT;
                count++;
            }
        }
        return count;
    }

    /**
     * If the class directly implements ij/plugin/filter/PlugInFilter OR
     * ij/plugin/filter/ExtendedPlugInFilter (and isn't already Serializable),
     * add java/io/Serializable to its interfaces + mark non-Serializable
     * fields as transient so serialization works.
     *
     * ALSO: for ANY class (whether a PlugInFilter or not), if it already
     * implements Serializable (including transitively, as Frame's
     * descendants do), apply the transient mask so their AWT/Graphics
     * fields don't block serialization.
     */
    private byte[] injectSerializableIntoPlugInFilter(String className, byte[] bytes) {
        ClassReader cr = new ClassReader(bytes);
        ClassNode cn = new ClassNode();
        cr.accept(cn, 0);

        boolean isFilter = cn.interfaces != null && (
            cn.interfaces.contains("ij/plugin/filter/PlugInFilter")
            || cn.interfaces.contains("ij/plugin/filter/ExtendedPlugInFilter"));
        boolean alreadySerializable = cn.interfaces != null && cn.interfaces.contains("java/io/Serializable");

        // ALWAYS apply the transient mask. `transient` only affects serialization
        // — it's a no-op for classes never serialized. Applying unconditionally
        // catches AWT/Graphics-holding classes whose Serializable-ness comes via
        // inheritance (ij.gui.StackWindow extends ImageWindow extends … Frame).
        int transientCount = applyTransientMask(cn);

        // Add Serializable to PlugInFilter subclasses that don't have it.
        if (isFilter && !alreadySerializable) {
            cn.interfaces.add("java/io/Serializable");
        }

        // Skip re-emit when nothing actually changed
        if (transientCount == 0 && !(isFilter && !alreadySerializable)) return bytes;

        if (isFilter && !alreadySerializable) pluginFilterSerializableInjected++;
        if (transientCount > 0) {
            System.out.println("[pfr-serializable] " + className
                + (isFilter && !alreadySerializable ? " +Serializable" : "")
                + " +" + transientCount + " transient fields");
        }

        ClassWriter cw = new ClassWriter(cr, 0);
        cn.accept(cw);
        return cw.toByteArray();
    }

    private int rewriteMethodTPE(MethodNode mn) {
        InsnList insns = mn.instructions;
        // pending unmatched NEWs: stack of (NEW insn, optional DUP insn)
        java.util.ArrayDeque<AbstractInsnNode[]> pending = new java.util.ArrayDeque<>();
        int rewrites = 0;

        AbstractInsnNode insn = insns.getFirst();
        while (insn != null) {
            AbstractInsnNode next = insn.getNext();

            if (insn.getOpcode() == Opcodes.NEW) {
                TypeInsnNode ti = (TypeInsnNode) insn;
                if (isRewritableCtorOwner(ti.desc)) {
                    AbstractInsnNode dupCand = next;
                    // DUP is ALWAYS emitted by javac immediately after NEW for
                    // `new X(args)` expressions whose result is used. If absent,
                    // the result is discarded (rare) — skip rewrite.
                    AbstractInsnNode dup = (dupCand != null && dupCand.getOpcode() == Opcodes.DUP)
                            ? dupCand : null;
                    pending.push(new AbstractInsnNode[]{ ti, dup });
                }
            } else if (insn.getOpcode() == Opcodes.INVOKESPECIAL) {
                MethodInsnNode mi = (MethodInsnNode) insn;
                if ("<init>".equals(mi.name) && isRewritableCtorOwner(mi.owner)) {
                    // Find matching pending NEW (innermost of matching owner)
                    AbstractInsnNode[] match = null;
                    for (AbstractInsnNode[] pair : pending) {
                        TypeInsnNode ti = (TypeInsnNode) pair[0];
                        if (mi.owner.equals(ti.desc)) { match = pair; break; }
                    }
                    if (match != null && match[1] != null) {
                        pending.remove(match);
                        // Remove NEW + DUP
                        insns.remove(match[0]);
                        insns.remove(match[1]);
                        // Replace INVOKESPECIAL <init>(...)V with INVOKESTATIC factory returning TPE
                        String newDesc = mi.desc.substring(0, mi.desc.length() - 1)  // strip trailing V
                                + "Ljava/util/concurrent/ThreadPoolExecutor;";
                        insns.set(mi, new MethodInsnNode(
                                Opcodes.INVOKESTATIC,
                                "com/hack/ExecutorHook",
                                "newThreadPoolExecutor",
                                newDesc,
                                false));
                        rewrites++;
                    }
                }
            }

            insn = next;
        }
        return rewrites;
    }
}
