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

    # Patch MessageDialog.java to suppress dialogs
    print("\n--- Patching MessageDialog.java ---")
    patch_message_dialog_java()

    # Patch YesNoCancelDialog.java to suppress dialogs
    print("\n--- Patching YesNoCancelDialog.java ---")
    patch_yes_no_cancel_dialog_java()

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

if __name__ == "__main__":
    apply_patches()
