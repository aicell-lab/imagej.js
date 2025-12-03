# ImageJ.js Build System Changes

## Summary

Converted from downloading pre-built ImageJ binaries to building from source with custom patches.

## Changes Made

### 1. Patch System (`imagej-patch/`)

Created a patch directory containing:
- **`Interpreter.java.patch`**: Adds `runMacroSilent()` static method to suppress error dialogs
- **`README.md`**: Documentation for patches

The `runMacroSilent()` method:
- Suppresses error dialogs during macro execution
- Returns errors as data: `String[]{status, message}`
- Enables silent macro execution for automation

### 2. Updated Build Script (`prepare.sh`)

**Old behavior:**
- Downloaded pre-built ImageJ from `wsr.imagej.net`
- Extracted zip file directly to `lib/ImageJ/`

**New behavior:**
- Clones ImageJ source from GitHub at commit `49f2c64ab0f5da08b23d5208e15f71ee386c0c82`
- Applies all patches from `imagej-patch/*.patch`
- Builds ImageJ using Apache Ant
- Copies built jar and resources to `lib/ImageJ/`
- Downloads additional plugins from `plugins_manifest.txt`
- Generates index.list files for CheerpJ

### 3. Updated CI Workflow (`.github/workflows/build-site.yml`)

Added build dependencies:
- Java Development Kit 8 (using `actions/setup-java@v3`)
- Apache Ant (via `apt-get`)

Added files to dist:
- `hypha-imagej-service.js`
- `utils.js`

### 4. Updated Service Code (`hypha-imagej-service.js`)

Modified `runMacroSilent()` function to use the new Java method:
```javascript
const Interpreter = await window.lib.ij.macro.Interpreter;
const resultArray = await Interpreter.runMacroSilent(macro);
const status = await resultArray[0];  // "success" or "error"
const message = await resultArray[1]; // result or error message
```

This properly suppresses error dialogs at the Java level instead of trying to catch them in JavaScript.

### 5. Updated `.gitignore`

Added `ImageJ-build/` to ignore the temporary build directory.

## Prerequisites

### Local Development
- Java Development Kit (JDK) 8+
- Apache Ant
- Git

### CI
All dependencies installed automatically via GitHub Actions.

## Testing

### Local Build
```bash
bash prepare.sh
```

### Test Silent Macro Execution
After rebuilding and reloading the page:
```javascript
// Test error handling (should NOT show dialog)
await window.hyphaService.runMacro({
    macro: 'invalid syntax here',
    returnLog: true
});
```

## Benefits

1. **Full Control**: We can patch ImageJ with custom features
2. **Reproducible**: Builds from specific commit with versioned patches
3. **No Dialogs**: Error dialogs are suppressed for automation
4. **Transparent**: All changes are in version-controlled patch files
5. **CI/CD Ready**: Automated builds in GitHub Actions

## Migration Path

Users don't need to change anything - the MCP interface remains the same. The only difference is:
- Error macros now return errors as data instead of showing dialogs
- Build process takes longer but happens automatically in CI

## Files Modified

- `prepare.sh` - Completely rewritten for source builds
- `.github/workflows/build-site.yml` - Added JDK and Ant setup
- `hypha-imagej-service.js` - Updated to use Java runMacroSilent
- `.gitignore` - Added build directory

## Files Added

- `imagej-patch/Interpreter.java.patch` - Java source patch
- `imagej-patch/README.md` - Patch documentation
- `BUILD.md` - Build instructions
- `CHANGES.md` - This file
