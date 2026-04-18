package com.hack;

import java.net.URL;
import java.net.URLClassLoader;
import java.net.URLStreamHandler;
import java.net.URLConnection;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Step 1 diagnostic: does CheerpJ respect a user-level custom ClassLoader?
 * - Instantiates a ClassLoader that logs + counts every class load
 * - Tries to load ij.IJ and a few plugin classes through it
 * - Prints whether our loader saw them (yes = we can intercept; no = CheerpJ
 *   bypasses classloader delegation for user jars).
 */
public class ClassLoaderTest {
    static int loadCount = 0;

    public static void main(String[] args) throws Exception {
        System.out.println("=== CheerpJ ClassLoader interception test ===");
        System.out.println("Java version: " + System.getProperty("java.version"));
        System.out.println("ClassLoader: " + ClassLoaderTest.class.getClassLoader());

        // The URL CheerpJ sees for ij.jar via its virtual filesystem.
        // Note: CheerpJ's /app/ prefix + real path.
        String jarPath = args.length > 0 ? args[0] : "/app/lib/ImageJ/ij.jar";
        System.out.println("Target jar: " + jarPath);

        URL[] urls = { new URL("file://" + jarPath) };

        URLClassLoader loader = new URLClassLoader(urls, ClassLoaderTest.class.getClassLoader()) {
            @Override
            public Class<?> findClass(String name) throws ClassNotFoundException {
                loadCount++;
                System.out.println("  [CL-findClass] " + name);
                return super.findClass(name);
            }

            @Override
            public Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
                // Only log user-code loads; not java.*, sun.*, etc
                if (name.startsWith("ij.") || name.startsWith("com.hack.")) {
                    System.out.println("  [CL-loadClass] " + name);
                }
                return super.loadClass(name, resolve);
            }
        };

        System.out.println("\n--- Attempting Class.forName('ij.IJ') via custom loader ---");
        try {
            Class<?> ijClass = Class.forName("ij.IJ", true, loader);
            System.out.println("  RESULT: loaded " + ijClass.getName()
                    + " via " + ijClass.getClassLoader());
            System.out.println("  Same loader? " + (ijClass.getClassLoader() == loader));
        } catch (Throwable t) {
            System.out.println("  FAILED: " + t);
            t.printStackTrace();
        }

        System.out.println("\n--- Attempting a few more classes ---");
        for (String name : new String[]{"ij.ImagePlus", "ij.process.ByteProcessor",
                                         "ij.plugin.filter.GaussianBlur"}) {
            try {
                Class<?> c = Class.forName(name, true, loader);
                System.out.println("  OK: " + name + " via " + c.getClassLoader());
            } catch (Throwable t) {
                System.out.println("  FAIL: " + name + " -> " + t);
            }
        }

        System.out.println("\n=== total findClass calls in our custom loader: " + loadCount + " ===");
        if (loadCount > 0) {
            System.out.println("SUCCESS: CheerpJ honors custom ClassLoader — interception is possible.");
        } else {
            System.out.println("FAIL: Custom ClassLoader never saw any class — CheerpJ short-circuits.");
        }
    }
}
