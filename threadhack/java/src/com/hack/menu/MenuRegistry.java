package com.hack.menu;

import ij.IJ;
import ij.ImageJ;

import java.awt.Menu;
import java.awt.MenuBar;
import java.awt.MenuItem;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Bridge that lets JavaScript add top-level menus to the ImageJ frame without
 * writing a bespoke Java plugin per menu item. JS registers handlers in
 * {@code window.__menuHandlers} keyed by a string, then calls
 * {@link #addMenu(String, String[], String[])} to create a Menu whose items
 * fire {@link #nativeInvokeJSHandler(String)} on click.
 *
 * Matches the pattern used by {@link com.hack.viewer.JSTileSource}: a
 * single async native is the Java→JS boundary, and JS dispatches on a
 * string key.
 */
public final class MenuRegistry {
    private MenuRegistry() {}

    /** JS-implemented native; dispatches to window.__menuHandlers[key]. */
    public static native void nativeInvokeJSHandler(String key);

    /**
     * Create (or reuse) a top-level menu on ImageJ's main MenuBar and append
     * items that dispatch to JS-side handlers identified by their keys.
     *
     * @param menuLabel       top-level menu title (e.g. "Hypha")
     * @param itemLabels      display labels for each item (use "-" for separator)
     * @param jsHandlerKeys   keys into window.__menuHandlers, one per item
     */
    public static void addMenu(String menuLabel, String[] itemLabels, final String[] jsHandlerKeys) {
        if (itemLabels.length != jsHandlerKeys.length) {
            throw new IllegalArgumentException("itemLabels and jsHandlerKeys must match in length");
        }
        ImageJ ij = IJ.getInstance();
        if (ij == null) {
            System.out.println("[MenuRegistry] ImageJ not running yet — aborting addMenu");
            return;
        }
        MenuBar mb = ij.getMenuBar();
        if (mb == null) {
            mb = new MenuBar();
            ij.setMenuBar(mb);
        }

        // Reuse an existing menu with the same label if present (idempotent).
        Menu target = null;
        for (int i = 0; i < mb.getMenuCount(); i++) {
            Menu m = mb.getMenu(i);
            if (m != null && menuLabel.equals(m.getLabel())) { target = m; break; }
        }
        if (target == null) {
            target = new Menu(menuLabel);
            mb.add(target);
        }

        for (int i = 0; i < itemLabels.length; i++) {
            String label = itemLabels[i];
            final String key = jsHandlerKeys[i];
            if ("-".equals(label) || "".equals(label)) {
                target.addSeparator();
                continue;
            }
            MenuItem mi = new MenuItem(label);
            mi.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    try {
                        nativeInvokeJSHandler(key);
                    } catch (Throwable t) {
                        System.out.println("[MenuRegistry] handler '" + key + "' threw: " + t);
                    }
                }
            });
            target.add(mi);
        }
        // Force the frame to repaint the menu bar — on some platforms Menu
        // insertions after show() don't appear until validate().
        ij.validate();
        System.out.println("[MenuRegistry] menu '" + menuLabel + "' now has "
                + target.getItemCount() + " item(s)");
    }

    /** Remove a top-level menu by label. Idempotent. */
    public static void removeMenu(String menuLabel) {
        ImageJ ij = IJ.getInstance();
        if (ij == null) return;
        MenuBar mb = ij.getMenuBar();
        if (mb == null) return;
        for (int i = 0; i < mb.getMenuCount(); i++) {
            Menu m = mb.getMenu(i);
            if (m != null && menuLabel.equals(m.getLabel())) {
                mb.remove(i);
                ij.validate();
                return;
            }
        }
    }
}
