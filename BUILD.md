# Building ImageJ.js with Patches

This project builds ImageJ from source with custom patches applied.

## Overview

Instead of downloading pre-built ImageJ binaries, we:
1. Clone the ImageJ source code from a specific commit
2. Apply custom patches from `imagej-patch/`
3. Build ImageJ using Apache Ant
4. Deploy the patched version

## Prerequisites

### Local Development
- **Java Development Kit (JDK) 8 or later**
  - macOS: `brew install openjdk@8`
  - Ubuntu: `sudo apt-get install openjdk-8-jdk`
- **Apache Ant**
  - macOS: `brew install ant`
  - Ubuntu: `sudo apt-get install ant`
- **Git**

### CI (GitHub Actions)
All dependencies are automatically installed in the workflow.

## Building Locally

```bash
# Run the build script
bash prepare.sh
```

This will:
1. Clone ImageJ source at commit `49f2c64ab0f5da08b23d5208e15f71ee386c0c82`
2. Apply all patches from `imagej-patch/*.patch`
3. Build ImageJ using Ant
4. Copy the built jar and resources to `lib/ImageJ/`
5. Download additional plugins from `plugins_manifest.txt`
6. Clean up build artifacts

## Current Patches

### `imagej-patch/Interpreter.java.patch`

Adds `runMacroSilent()` method to suppress error dialogs during macro execution.

**Features:**
- Returns errors as data instead of showing dialog boxes
- Returns `String[]` with `[status, message]` where status is "success" or "error"
- Useful for automation, testing, and remote macro execution

**Usage in JavaScript:**
```javascript
const Interpreter = await window.lib.ij.macro.Interpreter;
const [status, message] = await Interpreter.runMacroSilent(macroCode);
if (status === 'error') {
    console.error('Macro failed:', message);
}
```

## Adding New Patches

1. Create a `.patch` file in `imagej-patch/`
2. Follow unified diff format (`diff -u` or `git diff`)
3. Run `bash prepare.sh` to test
4. Commit the patch file

Example patch creation:
```bash
cd ImageJ-build
# Make changes to source files
git diff > ../imagej-patch/my-feature.patch
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/build-site.yml`) automatically:
1. Installs JDK 8 and Apache Ant
2. Runs `prepare.sh` to build ImageJ with patches
3. Deploys to GitHub Pages

## Troubleshooting

**Build fails with "ant: command not found"**
- Install Apache Ant (see Prerequisites)

**Build fails with Java errors**
- Ensure JDK 8 or later is installed
- Check `JAVA_HOME` environment variable

**Patch fails to apply**
- Verify patch file format (unified diff)
- Check that patch targets the correct commit
- Try applying manually: `cd ImageJ-build && patch -p1 < ../imagej-patch/your-patch.patch`

## References

- ImageJ source: https://github.com/imagej/ImageJ
- Target commit: https://github.com/imagej/ImageJ/tree/49f2c64ab0f5da08b23d5208e15f71ee386c0c82
