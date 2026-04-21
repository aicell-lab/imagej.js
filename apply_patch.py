#!/usr/bin/env python3
"""
Applies patches to ImageJ source code.
This is more reliable than using the patch command with complex patches.
"""

def apply_patches():
    import os

    print("=" * 60)
    print("Applying patches to ImageJ source code")
    print("=" * 60)

    # First, update build.xml to use Java 8 instead of Java 6
    build_xml_path = "ImageJ-build/build.xml"
    if os.path.exists(build_xml_path):
        with open(build_xml_path, 'r') as f:
            build_xml = f.read()

        # Replace Java 6 with Java 8
        build_xml = build_xml.replace('source="1.6"', 'source="1.8"')
        build_xml = build_xml.replace('target="1.6"', 'target="1.8"')

        with open(build_xml_path, 'w') as f:
            f.write(build_xml)

        print("✓ Updated build.xml to use Java 1.8")

    print("\n--- Patching Interpreter.java ---")

    # Path to the Interpreter.java file
    file_path = "ImageJ-build/ij/macro/Interpreter.java"

    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return False

    # Read the original file
    with open(file_path, 'r') as f:
        lines = f.readlines()

    # Modification 1: Add public static field after line 42 (0-indexed: 41)
    # Find the line "static Vector imageTable"
    for i, line in enumerate(lines):
        if 'static Vector imageTable' in line and 'images opened in batch mode' in line:
            # Insert after this line
            lines.insert(i + 1, '\tpublic static boolean suppressErrorDialogs;\n')
            print(f"✓ Added public suppressErrorDialogs static field at line {i+2}")
            break

    # Modification 2: Add runMacroSilent method after run(String, String) method
    # Find the run(String, String) method and add after it
    for i in range(len(lines) - 3):
        if 'public String run(String macro, String arg)' in lines[i]:
            # Find the closing brace of this method
            brace_count = 0
            method_start = i
            for j in range(i, len(lines)):
                if '{' in lines[j]:
                    brace_count += lines[j].count('{')
                if '}' in lines[j]:
                    brace_count -= lines[j].count('}')
                if brace_count == 0 and j > method_start:
                    # Found the closing brace
                    new_method = '''
\t/** Runs a macro in silent mode, suppressing error dialogs.
\t *  Returns a String array: [status, message]
\t *  where status is "success" or "error"
\t */
\tpublic static String[] runMacroSilent(String macro) {
\t\tboolean savedSuppressErrorDialogs = suppressErrorDialogs;
\t\tsuppressErrorDialogs = true;
\t\ttry {
\t\t\tInterpreter interp = new Interpreter();
\t\t\tString result = interp.run(macro, null);
\t\t\tsuppressErrorDialogs = savedSuppressErrorDialogs;
\t\t\treturn new String[]{"success", result != null ? result : ""};
\t\t} catch (Throwable e) {
\t\t\tsuppressErrorDialogs = savedSuppressErrorDialogs;
\t\t\tString error = e.getMessage();
\t\t\tif (error == null || error.length() == 0)
\t\t\t\terror = "" + e;
\t\t\treturn new String[]{"error", error};
\t\t}
\t}
'''
                    lines.insert(j + 1, new_method)
                    print(f"✓ Added runMacroSilent method at line {j+2}")
                    break
            break

    # Modification 3: Modify error() method around line 1357
    # Find "void error(String message) {" followed by "errorMessage = message;"
    for i in range(len(lines) - 2):
        if 'void error(String message)' in lines[i] and 'errorMessage = message;' in lines[i+1]:
            # Insert the suppressErrorDialogs check after "errorMessage = message;"
            error_check = '''\t\tif (suppressErrorDialogs) {
\t\t\t// Throw exception instead of showing dialog
\t\t\terrorCount++;
\t\t\tthrow new RuntimeException(message);
\t\t}
'''
            lines.insert(i + 2, error_check)
            print(f"✓ Added suppressErrorDialogs check in error() method at line {i+3}")
            break

    # Write the modified file
    with open(file_path, 'w') as f:
        f.writelines(lines)

    print("✓ Interpreter.java patched successfully")

    # Patch IJ.java to suppress error dialogs
    print("\n--- Patching IJ.java ---")
    patch_ij_java()

    # Patch Tokenizer.java to suppress error dialogs
    print("\n--- Patching Tokenizer.java ---")
    patch_tokenizer_java()

    # Patch GenericDialog.java to suppress dialogs
    print("\n--- Patching GenericDialog.java ---")
    patch_generic_dialog_java()

    # Install SizedLabel and rewrite every `new Label(...)` across the tree
    # to work around CheerpJ's inflated java.awt.Label preferred height.
    print("\n--- Installing SizedLabel + rewriting Label call sites ---")
    patch_label_sizing_global()

    # Patch MessageDialog.java to suppress dialogs
    print("\n--- Patching MessageDialog.java ---")
    patch_message_dialog_java()

    # Patch YesNoCancelDialog.java to suppress dialogs
    print("\n--- Patching YesNoCancelDialog.java ---")
    patch_yes_no_cancel_dialog_java()

    # Inject com.hack.viewer.* sources so ImageJ's ant build compiles them
    # alongside ij.*. Required before patching ImageWindow / ImageCanvas
    # (those patches reference com.hack.viewer.LazyImagePlus by name).
    print("\n--- Injecting com.hack.viewer sources into ImageJ build tree ---")
    inject_viewer_sources()

    # Patch ImageWindow + ImageCanvas to support LazyImagePlus (Google-Maps mode)
    print("\n--- Patching ImageWindow + ImageCanvas for LazyImagePlus ---")
    patch_lazy_image_plus_hooks()

    print("\n" + "=" * 60)
    print("✓ Successfully applied all patches!")
    print("  - Interpreter.java: Silent macro execution")
    print("  - IJ.java: Suppressed IJ.error() and IJ.showMessage()")
    print("  - Tokenizer.java: Suppressed parser errors")
    print("  - GenericDialog.java: Suppressed generic dialogs")
    print("  - MessageDialog.java: Suppressed message dialogs")
    print("  - YesNoCancelDialog.java: Suppressed yes/no/cancel dialogs")
    print("=" * 60)
    return True

def patch_ij_java():
    """Patch IJ.java to suppress error dialogs during silent macro execution"""
    import os

    file_path = "ImageJ-build/ij/IJ.java"

    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found, skipping")
        return False

    with open(file_path, 'r') as f:
        content = f.read()

    # Add import for Interpreter at the top
    if 'import ij.macro.Interpreter;' not in content:
        # Find the package declaration and first import
        lines = content.split('\n')
        import_inserted = False
        for i, line in enumerate(lines):
            if line.startswith('import ') and not import_inserted:
                lines.insert(i, 'import ij.macro.Interpreter;')
                import_inserted = True
                break
        content = '\n'.join(lines)
        print("✓ Added Interpreter import to IJ.java")

    # Patch error(String msg) method
    error_method_pattern = 'public static void error(String msg) {'
    if error_method_pattern in content and 'if (Interpreter.suppressErrorDialogs)' not in content.split(error_method_pattern)[1].split('}')[0]:
        content = content.replace(
            error_method_pattern,
            error_method_pattern + '''
		// Check if error dialogs are suppressed (for silent macro execution)
		if (Interpreter.suppressErrorDialogs) {
			log("Error (suppressed): " + msg);
			return;
		}'''
        )
        print("✓ Patched IJ.error(String) method")

    # Patch error(String title, String msg) method
    error_title_pattern = 'public static void error(String title, String msg) {'
    if error_title_pattern in content:
        parts = content.split(error_title_pattern)
        if len(parts) > 1 and 'if (Interpreter.suppressErrorDialogs)' not in parts[1].split('String title2')[0]:
            content = parts[0] + error_title_pattern + '''
		// Check if error dialogs are suppressed (for silent macro execution)
		if (Interpreter.suppressErrorDialogs) {
			log("Error (suppressed): " + (title != null ? title + ": " : "") + msg);
			return;
		}
''' + parts[1]
            print("✓ Patched IJ.error(String, String) method")

    # Patch showMessage(String title, String msg) method
    show_msg_pattern = 'public static void showMessage(String title, String msg) {'
    if show_msg_pattern in content:
        parts = content.split(show_msg_pattern)
        if len(parts) > 1 and 'if (Interpreter.suppressErrorDialogs)' not in parts[1].split('if (redirectErrorMessages)')[0]:
            content = parts[0] + show_msg_pattern + '''
		// Check if error dialogs are suppressed (for silent macro execution)
		if (Interpreter.suppressErrorDialogs) {
			log("Message (suppressed): " + (title != null ? title + ": " : "") + msg);
			return;
		}
''' + parts[1]
            print("✓ Patched IJ.showMessage(String, String) method")

    # Patch showMessage(String msg) method
    show_msg_single_pattern = 'public static void showMessage(String msg) {'
    if show_msg_single_pattern in content:
        parts = content.split(show_msg_single_pattern)
        if len(parts) > 1 and 'if (Interpreter.suppressErrorDialogs)' not in parts[1].split('showMessage("Message"')[0]:
            content = parts[0] + show_msg_single_pattern + '''
		// Check if error dialogs are suppressed (for silent macro execution)
		if (Interpreter.suppressErrorDialogs) {
			log("Message (suppressed): " + msg);
			return;
		}
''' + parts[1]
            print("✓ Patched IJ.showMessage(String) method")

    with open(file_path, 'w') as f:
        f.write(content)

    print("✓ IJ.java patched successfully")
    return True

def patch_tokenizer_java():
    """Patch Tokenizer.java to suppress error dialogs during parsing"""
    import os

    file_path = "ImageJ-build/ij/macro/Tokenizer.java"

    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found, skipping")
        return False

    with open(file_path, 'r') as f:
        content = f.read()

    # Patch the error() method in Tokenizer
    tokenizer_error_pattern = 'void error(String message) {'
    if tokenizer_error_pattern in content:
        parts = content.split(tokenizer_error_pattern)
        if len(parts) > 1 and 'if (Interpreter.suppressErrorDialogs)' not in parts[1].split('String title')[0]:
            content = parts[0] + tokenizer_error_pattern + '''
		// Check if error dialogs are suppressed (for silent macro execution)
		if (Interpreter.suppressErrorDialogs) {
			// Throw exception instead of showing dialog
			throw new RuntimeException(message + " in line " + lineNumber);
		}
''' + parts[1]
            print("✓ Patched Tokenizer.error() method")

    with open(file_path, 'w') as f:
        f.write(content)

    print("✓ Tokenizer.java patched successfully")
    return True

def patch_generic_dialog_java():
    """Patch GenericDialog.java to suppress dialogs during silent execution"""
    import os

    file_path = "ImageJ-build/ij/gui/GenericDialog.java"

    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found, skipping")
        return False

    with open(file_path, 'r') as f:
        content = f.read()

    # Add import for Interpreter at the top (if not already present)
    if 'import ij.macro.Interpreter;' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import ') and 'ij.macro.Interpreter' not in line:
                lines.insert(i, 'import ij.macro.Interpreter;')
                break
        content = '\n'.join(lines)
        print("✓ Added Interpreter import to GenericDialog.java")

    # Patch showDialog() method to check suppressErrorDialogs flag
    show_dialog_pattern = 'public void showDialog() {'
    if show_dialog_pattern in content:
        parts = content.split(show_dialog_pattern)
        if len(parts) > 1 and 'if (Interpreter.suppressErrorDialogs)' not in parts[1].split('if (IJ.macroRunning()')[0]:
            content = parts[0] + show_dialog_pattern + '''
		// Check if dialogs are suppressed (for silent macro execution)
		if (Interpreter.suppressErrorDialogs) {
			// Don't show dialog, just dispose immediately
			wasCanceled = true;
			dispose();
			return;
		}
''' + parts[1]
            print("✓ Patched GenericDialog.showDialog() method")

    with open(file_path, 'w') as f:
        f.write(content)

    print("✓ GenericDialog.java patched successfully")
    return True

def patch_label_sizing_global():
    """Work around CheerpJ's inflated java.awt.Label preferred height.

    CheerpJ's AWT backend returns a Label preferredSize.height ~2-3x larger
    than desktop Java (e.g., 39px for a 12pt font, vs the usual ~18px).
    AWT-based dialogs and tool windows in ImageJ rely on that preferred
    height for layout (GridBagLayout with weighty=0, FlowLayout, etc.), so
    every Label-heavy screen ends up with huge vertical gaps and content
    that overflows its window.

    Root fix: ship a public SizedLabel class (ij.gui.SizedLabel) that
    extends java.awt.Label and clamps getPreferredSize().height to
    round(fontSize*1.7)+2 — close to desktop Java's ~18px for 12pt and a
    no-op on desktop (super already returns a smaller height). Then
    rewrite every `new Label(...)` call site in ImageJ's source tree to
    instantiate SizedLabel instead. Because SizedLabel IS-A Label,
    every existing field/parameter typed as `Label` still works.

    Files touched: any .java under ij/ that contains `new Label(`. Imports
    for `ij.gui.SizedLabel` are added in files outside package ij.gui
    (ij.gui files see SizedLabel by the same-package rule).
    """
    import os
    import re

    root = "ImageJ-build/ij"
    if not os.path.isdir(root):
        print(f"Warning: {root} not found, skipping")
        return False

    # 1) Drop SizedLabel.java next to MultiLineLabel in ij/gui.
    trimmed_path = os.path.join(root, "gui", "SizedLabel.java")
    trimmed_src = '''package ij.gui;
import java.awt.*;

/**
 * A {@link java.awt.Label} subclass whose preferred and minimum sizes
 * clamp the height to a reasonable multiple of the font size. This works
 * around AWT backends such as CheerpJ that return an inflated preferred
 * height for Label (e.g. ~39px for a 12pt font vs. the desktop ~18px),
 * which otherwise causes dialogs to render with huge vertical gaps and
 * content that overflows the window.
 *
 * <p>Drop-in replacement for {@code new java.awt.Label(...)}. On desktop
 * Java the clamp is a no-op: the super class already reports a smaller
 * preferred height.
 */
public class SizedLabel extends Label {

\tpublic SizedLabel() { super(); }
\tpublic SizedLabel(String text) { super(text); }
\tpublic SizedLabel(String text, int alignment) { super(text, alignment); }

\tpublic Dimension getPreferredSize() {
\t\tDimension d = super.getPreferredSize();
\t\tif (d != null) {
\t\t\tFont f = getFont();
\t\t\tif (f != null) {
\t\t\t\tint cap = Math.round(f.getSize2D() * 1.7f) + 2;
\t\t\t\tif (d.height > cap) d.height = cap;
\t\t\t}
\t\t}
\t\treturn d;
\t}

\tpublic Dimension getMinimumSize() {
\t\treturn getPreferredSize();
\t}

}
'''
    with open(trimmed_path, 'w') as f:
        f.write(trimmed_src)
    print(f"  ✓ Wrote {trimmed_path}")

    # 2) Walk every .java under ij/, rewrite `new Label(` -> `new SizedLabel(`
    #    and add `import ij.gui.SizedLabel;` where needed.
    new_label_re = re.compile(r"\bnew\s+Label\s*\(")
    files_patched = 0
    sites_rewritten = 0
    imports_added = 0

    for dirpath, _dirnames, filenames in os.walk(root):
        for name in filenames:
            if not name.endswith(".java"):
                continue
            path = os.path.join(dirpath, name)
            # Skip SizedLabel itself.
            if os.path.basename(path) == "SizedLabel.java":
                continue

            with open(path, 'r') as f:
                source = f.read()

            if 'new Label(' not in source:
                continue

            # Rewrite constructor calls. Other uses of the word Label (static
            # constants Label.LEFT, type declarations, field names) are
            # untouched because the regex requires `new ` immediately before.
            new_source, n = new_label_re.subn('new SizedLabel(', source)
            if n == 0:
                continue

            # Add an import if the file is outside package ij.gui and
            # doesn't already import SizedLabel.
            package_match = re.search(r"^package\s+([\w.]+)\s*;", new_source, re.MULTILINE)
            pkg = package_match.group(1) if package_match else ""
            if pkg != "ij.gui" and "ij.gui.SizedLabel" not in new_source:
                # Insert the import after the last existing import line.
                lines = new_source.split('\n')
                last_import = -1
                for i, line in enumerate(lines):
                    if line.startswith('import '):
                        last_import = i
                if last_import >= 0:
                    lines.insert(last_import + 1, 'import ij.gui.SizedLabel;')
                else:
                    # Fallback: after package line.
                    for i, line in enumerate(lines):
                        if line.startswith('package '):
                            lines.insert(i + 1, 'import ij.gui.SizedLabel;')
                            break
                new_source = '\n'.join(lines)
                imports_added += 1

            with open(path, 'w') as f:
                f.write(new_source)
            files_patched += 1
            sites_rewritten += n
            rel = os.path.relpath(path, "ImageJ-build")
            print(f"    {rel}: {n} call site(s)")

    print(f"  ✓ Rewrote {sites_rewritten} `new Label(` call sites across "
          f"{files_patched} files ({imports_added} imports added)")
    return True

def patch_message_dialog_java():
    """Patch MessageDialog.java to suppress dialogs during silent execution"""
    import os

    file_path = "ImageJ-build/ij/gui/MessageDialog.java"

    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found, skipping")
        return False

    with open(file_path, 'r') as f:
        content = f.read()

    # Add import for Interpreter
    if 'import ij.macro.Interpreter;' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import ') and 'ij.macro.Interpreter' not in line:
                lines.insert(i, 'import ij.macro.Interpreter;')
                break
        content = '\n'.join(lines)
        print("✓ Added Interpreter import to MessageDialog.java")

    # Patch constructor to check suppressErrorDialogs before showing
    # Find the show() call at the end of the constructor
    constructor_pattern = 'public MessageDialog(Frame parent, String title, String message) {'
    if constructor_pattern in content:
        # Find and replace the show() call
        # Look for the pattern: show(); or setVisible(true);
        lines = content.split('\n')
        in_constructor = False
        brace_count = 0
        constructor_start = -1

        for i, line in enumerate(lines):
            if constructor_pattern in line:
                in_constructor = True
                constructor_start = i
                brace_count = 0
                continue

            if in_constructor:
                brace_count += line.count('{') - line.count('}')

                # Look for show() or setVisible calls
                if ('show();' in line or 'setVisible(true)' in line) and 'Interpreter.suppressErrorDialogs' not in ''.join(lines[max(0,i-5):i]):
                    # Replace with conditional check
                    indent = line[:len(line) - len(line.lstrip())]
                    lines[i] = f'''{indent}// Check if dialogs are suppressed (for silent macro execution)
{indent}if (!Interpreter.suppressErrorDialogs) {{
{indent}	show();
{indent}}}'''
                    print(f"✓ Patched MessageDialog constructor show() call at line {i+1}")
                    break

                if brace_count == 0 and i > constructor_start:
                    # End of constructor
                    break

        content = '\n'.join(lines)

    with open(file_path, 'w') as f:
        f.write(content)

    print("✓ MessageDialog.java patched successfully")
    return True

def patch_yes_no_cancel_dialog_java():
    """Patch YesNoCancelDialog.java to suppress dialogs during silent execution"""
    import os

    file_path = "ImageJ-build/ij/gui/YesNoCancelDialog.java"

    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found, skipping")
        return False

    with open(file_path, 'r') as f:
        content = f.read()

    # Add import for Interpreter
    if 'import ij.macro.Interpreter;' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import ') and 'ij.macro.Interpreter' not in line:
                lines.insert(i, 'import ij.macro.Interpreter;')
                break
        content = '\n'.join(lines)
        print("✓ Added Interpreter import to YesNoCancelDialog.java")

    # Patch constructor to check suppressErrorDialogs before showing
    lines = content.split('\n')

    # Find the constructors and patch show() calls
    for i, line in enumerate(lines):
        if ('show();' in line or 'setVisible(true)' in line) and 'YesNoCancelDialog' in ''.join(lines[max(0,i-30):i]):
            # Check if already patched
            if 'Interpreter.suppressErrorDialogs' not in ''.join(lines[max(0,i-5):i]):
                indent = line[:len(line) - len(line.lstrip())]
                lines[i] = f'''{indent}// Check if dialogs are suppressed (for silent macro execution)
{indent}if (!Interpreter.suppressErrorDialogs) {{
{indent}	show();
{indent}}}'''
                print(f"✓ Patched YesNoCancelDialog show() call at line {i+1}")

    content = '\n'.join(lines)

    with open(file_path, 'w') as f:
        f.write(content)

    print("✓ YesNoCancelDialog.java patched successfully")
    return True

def inject_viewer_sources():
    """Copy threadhack viewer sources (com.hack.viewer.*) into ImageJ-build/
    and update build.xml so ant compiles them alongside ij/**."""
    import os, shutil, glob

    src_dir = "threadhack/java/src/com/hack/viewer"
    dst_dir = "ImageJ-build/com/hack/viewer"

    if not os.path.isdir(src_dir):
        print(f"Warning: {src_dir} not found, skipping viewer injection")
        return False

    os.makedirs(dst_dir, exist_ok=True)
    for f in glob.glob(os.path.join(src_dir, "*.java")):
        shutil.copy2(f, dst_dir)
        print(f"✓ Copied {os.path.basename(f)} → {dst_dir}")

    # Add ./com as a second source root in build.xml so javac picks it up.
    build_xml = "ImageJ-build/build.xml"
    if os.path.exists(build_xml):
        with open(build_xml, 'r') as f:
            content = f.read()
        # Replace the single-srcdir <javac ... srcdir="./ij" ...> with one that
        # uses nested <src> elements pointing at both roots.
        old = '<javac srcdir="./ij"'
        new = '<javac srcdir="./ij:./com"'
        if old in content and new not in content:
            content = content.replace(old, new, 1)
            with open(build_xml, 'w') as f:
                f.write(content)
            print("✓ Updated build.xml javac srcdir → ./ij:./com")
        else:
            print("⊘ build.xml srcdir already updated (or unrecognised)")
    return True

def patch_lazy_image_plus_hooks():
    """Patch ImageWindow.mouseWheelMoved + ImageCanvas.mouseDragged to give
    LazyImagePlus images Google-Maps-style cursor-anchored zoom and drag-pan."""
    import os

    # ---- ImageWindow.java: cursor-anchored wheel zoom ------------------
    iw_path = "ImageJ-build/ij/gui/ImageWindow.java"
    if not os.path.exists(iw_path):
        print(f"Warning: {iw_path} not found, skipping")
    else:
        with open(iw_path, 'r') as f:
            content = f.read()

        marker = "public synchronized void mouseWheelMoved(MouseWheelEvent e) {"
        injection = (
            "\n\t\t// [threadhack] LazyImagePlus → cursor-anchored zoom\n"
            "\t\tif (imp instanceof com.hack.viewer.LazyImagePlus) {\n"
            "\t\t\tcom.hack.viewer.LazyImagePlus lip = (com.hack.viewer.LazyImagePlus) imp;\n"
            "\t\t\tint rot = e.getWheelRotation();\n"
            "\t\t\tif (rot == 0) return;\n"
            "\t\t\tdouble factor = Math.pow(1.25, -rot);\n"
            "\t\t\tjava.awt.Point p = ic.getCursorLoc();\n"
            "\t\t\tint sx = ic.screenX(p.x), sy = ic.screenY(p.y);\n"
            "\t\t\tint cw = ic.getWidth(), ch = ic.getHeight();\n"
            "\t\t\tdouble oldZ = lip.getZoomLevel();\n"
            "\t\t\tdouble cx = lip.getCx(), cy = lip.getCy();\n"
            "\t\t\tdouble level0X = cx + (sx - cw/2.0) / oldZ;\n"
            "\t\t\tdouble level0Y = cy + (sy - ch/2.0) / oldZ;\n"
            "\t\t\tdouble newZ = Math.max(1e-4, Math.min(32.0, oldZ * factor));\n"
            "\t\t\tdouble newCx = level0X - (sx - cw/2.0) / newZ;\n"
            "\t\t\tdouble newCy = level0Y - (sy - ch/2.0) / newZ;\n"
            "\t\t\tlip.setView(newCx, newCy, newZ);\n"
            "\t\t\treturn;\n"
            "\t\t}\n"
        )
        if marker in content and "[threadhack] LazyImagePlus" not in content:
            content = content.replace(marker, marker + injection, 1)
            with open(iw_path, 'w') as f:
                f.write(content)
            print("✓ Patched ImageWindow.mouseWheelMoved for LazyImagePlus")
        else:
            print("⊘ ImageWindow patch already applied or marker missing")

    # ---- ImageCanvas.java: full Google-Maps interaction for LazyImagePlus ----
    ic_path = "ImageJ-build/ij/gui/ImageCanvas.java"
    if not os.path.exists(ic_path):
        print(f"Warning: {ic_path} not found, skipping")
        return False

    with open(ic_path, 'r') as f:
        content = f.read()

    if "[threadhack] LazyImagePlus" in content:
        print("⊘ ImageCanvas patch already applied")
        return True

    # 1. Add drag-tracking field
    content = content.replace(
        "protected ImagePlus imp;",
        "protected ImagePlus imp;\n\t/** [threadhack] LazyImagePlus drag tracking */\n\tint lazyDragX, lazyDragY;",
        1
    )

    # 2. mousePressed: capture drag origin AND return early (suppresses
    #    ROI creation, magnifier click-zoom, tool-specific actions).
    press_marker = "public void mousePressed(final MouseEvent e) {"
    press_inject = (
        "\n\t\t// [threadhack] LazyImagePlus: capture drag origin + skip all tools\n"
        "\t\tif (imp instanceof com.hack.viewer.LazyImagePlus) {\n"
        "\t\t\tlazyDragX = e.getX(); lazyDragY = e.getY();\n"
        "\t\t\t// capture x/yMouse so other handlers (coord display) keep working\n"
        "\t\t\txMouse = offScreenX(e.getX()); yMouse = offScreenY(e.getY());\n"
        "\t\t\treturn;\n"
        "\t\t}\n"
    )
    content = content.replace(press_marker, press_marker + press_inject, 1)

    # 3. mouseDragged: pan via LazyImagePlus.setView()
    drag_marker = "public void mouseDragged(MouseEvent e) {"
    drag_inject = (
        "\n\t\t// [threadhack] LazyImagePlus: drag = pan (any tool)\n"
        "\t\tif (imp instanceof com.hack.viewer.LazyImagePlus) {\n"
        "\t\t\tcom.hack.viewer.LazyImagePlus lip = (com.hack.viewer.LazyImagePlus) imp;\n"
        "\t\t\tint x = e.getX(), y = e.getY();\n"
        "\t\t\tint dx = x - lazyDragX;\n"
        "\t\t\tint dy = y - lazyDragY;\n"
        "\t\t\tlazyDragX = x; lazyDragY = y;\n"
        "\t\t\tdouble z = lip.getZoomLevel();\n"
        "\t\t\tlip.setView(lip.getCx() - dx / z, lip.getCy() - dy / z, z);\n"
        "\t\t\treturn;\n"
        "\t\t}\n"
    )
    content = content.replace(drag_marker, drag_marker + drag_inject, 1)

    # 4. mouseClicked: swallow clicks so magnifier/ROI-tool clicks are inert
    click_marker = "public void mouseClicked(MouseEvent e) {"
    click_inject = (
        "\n\t\t// [threadhack] LazyImagePlus: clicks are inert (magnifier off)\n"
        "\t\tif (imp instanceof com.hack.viewer.LazyImagePlus) return;\n"
    )
    if click_marker in content:
        content = content.replace(click_marker, click_marker + click_inject, 1)

    # 5. mouseReleased: also return early so no ROI finalisation happens
    release_marker = "public void mouseReleased(MouseEvent e) {"
    release_inject = (
        "\n\t\t// [threadhack] LazyImagePlus: suppress ROI/tool release logic\n"
        "\t\tif (imp instanceof com.hack.viewer.LazyImagePlus) return;\n"
    )
    if release_marker in content:
        content = content.replace(release_marker, release_marker + release_inject, 1)

    with open(ic_path, 'w') as f:
        f.write(content)
    print("✓ Patched ImageCanvas.mousePressed/Dragged/Clicked/Released for LazyImagePlus")
    return True

if __name__ == "__main__":
    apply_patches()
