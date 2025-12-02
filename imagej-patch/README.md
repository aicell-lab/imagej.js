# ImageJ Patches

This directory contains patches to be applied to the ImageJ source code before building.

## Overview

These patches enable **silent macro execution** for ImageJ, suppressing ALL error dialogs and message boxes during automated macro runs. This is essential for remote API access and automation scenarios where dialogs would block execution.

## Patches Applied

### 1. Interpreter.java
**Purpose:** Core silent execution support

**Changes:**
- Adds `static boolean suppressErrorDialogs` flag
- Adds `runMacroSilent(String macro)` static method that:
  - Sets the `suppressErrorDialogs` flag
  - Returns errors as String array `[status, message]` instead of showing dialogs
  - Catches all exceptions and returns them as data
- Modifies `error(String message)` method to throw exception instead of showing dialog when flag is set

### 2. IJ.java
**Purpose:** Suppress global error and message dialogs

**Changes:**
- Adds import for `ij.macro.Interpreter`
- Patches `error(String msg)` - logs error instead of showing dialog
- Patches `error(String title, String msg)` - logs error instead of showing dialog
- Patches `showMessage(String msg)` - logs message instead of showing dialog
- Patches `showMessage(String title, String msg)` - logs message instead of showing dialog

### 3. Tokenizer.java
**Purpose:** Suppress macro parsing/syntax error dialogs

**Changes:**
- Modifies `error(String message)` method to throw `RuntimeException` instead of showing "Macro Error" dialog when `suppressErrorDialogs` is true
- Errors include line number information for debugging

### 4. GenericDialog.java
**Purpose:** Suppress generic input dialogs during silent execution

**Changes:**
- Adds import for `ij.macro.Interpreter`
- Patches `showDialog()` method to check `suppressErrorDialogs` flag
- If suppressed, sets `wasCanceled = true` and calls `dispose()` immediately without showing dialog

### 5. MessageDialog.java
**Purpose:** Suppress informational message dialogs

**Changes:**
- Adds import for `ij.macro.Interpreter`
- Patches constructor to wrap `show()` call in conditional check
- Dialog only appears if `!Interpreter.suppressErrorDialogs`

### 6. YesNoCancelDialog.java
**Purpose:** Suppress yes/no/cancel confirmation dialogs

**Changes:**
- Adds import for `ij.macro.Interpreter`
- Patches constructor to wrap `show()` call in conditional check
- Dialog only appears if `!Interpreter.suppressErrorDialogs`

## Comprehensive Coverage

These patches ensure that **ALL** dialog types are suppressed during silent macro execution:

✅ Macro syntax/parsing errors (Tokenizer)
✅ Runtime macro errors (Interpreter)
✅ IJ.error() calls
✅ IJ.showMessage() calls
✅ Generic input dialogs (GenericDialog)
✅ Information dialogs (MessageDialog)
✅ Confirmation dialogs (YesNoCancelDialog)

## Usage

The patches are automatically applied during the build process by `prepare.sh`, which:
1. Clones the ImageJ source repository
2. Runs `apply_patch.py` to apply all patches
3. Builds ImageJ with Apache Ant
4. Copies the patched `ij.jar` to `lib/ImageJ/`

## API Usage

From JavaScript (via CheerpJ):

```javascript
// Access the Interpreter class
const Interpreter = await window.lib.ij.macro.Interpreter;

// Run macro silently (no dialogs)
const resultArray = await Interpreter.runMacroSilent(macroCode);
const status = await resultArray[0];   // "success" or "error"
const message = await resultArray[1];  // result or error message
```

## Testing

To verify the patches work:

1. Rebuild ImageJ: `./prepare.sh`
2. Test with a macro that would normally show an error:
   ```javascript
   const result = await Interpreter.runMacroSilent('invalid syntax here');
   console.log(result[0]); // Should be "error" instead of showing dialog
   ```

## Notes

- All suppressed messages are logged to the ImageJ log window for debugging
- The `suppressErrorDialogs` flag is automatically managed by `runMacroSilent()`
- Original ImageJ behavior is preserved when not using `runMacroSilent()`
