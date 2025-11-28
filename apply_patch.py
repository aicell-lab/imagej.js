#!/usr/bin/env python3
"""
Applies patches to ImageJ source code.
This is more reliable than using the patch command with complex patches.
"""

def apply_patches():
    import os

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

    # Path to the Interpreter.java file
    file_path = "ImageJ-build/ij/macro/Interpreter.java"

    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return False

    # Read the original file
    with open(file_path, 'r') as f:
        lines = f.readlines()

    # Modification 1: Add static field after line 42 (0-indexed: 41)
    # Find the line "static Vector imageTable"
    for i, line in enumerate(lines):
        if 'static Vector imageTable' in line and 'images opened in batch mode' in line:
            # Insert after this line
            lines.insert(i + 1, '\tstatic boolean suppressErrorDialogs;\n')
            print(f"✓ Added suppressErrorDialogs static field at line {i+2}")
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

    print("\n✓ Successfully applied all patches!")
    return True

if __name__ == "__main__":
    apply_patches()
