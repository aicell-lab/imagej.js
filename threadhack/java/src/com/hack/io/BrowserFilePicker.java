package com.hack.io;

/**
 * Bridge to the browser-native HTML file browser dialog (window.hfs).
 *
 * Stock JFileChooser is structurally unusable under CheerpJ because its
 * Swing modal dispatch requires {@link java.awt.EventQueue#invokeAndWait},
 * which throws from the JS event thread. Instead of fighting Swing we
 * route File > Open / Save through one small HTML dialog that speaks to
 * the already-mounted virtual filesystem (window.nativeFS /
 * window.localFS) and the Chrome File System Access API.
 *
 * Return convention:
 *   - Open: absolute path inside CheerpJ's virtual filesystem (e.g.
 *     "/files/subdir/x.tif" or "/local/y.png"), or null if the user
 *     cancelled.
 *   - Save: the path the user chose inside the mounted folder, or null
 *     if cancelled. The JS side has ensured the folder + file can be
 *     written to by the Java caller via the existing write-through
 *     mount machinery.
 */
public final class BrowserFilePicker {
    private BrowserFilePicker() {}

    public static native String showOpenDialog(String title, String defaultDir);
    public static native String showSaveDialog(String title, String defaultDir, String defaultName);
}
