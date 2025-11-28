# ImageJ Patches

This directory contains patches to be applied to the ImageJ source code before building.

## Patches

### Interpreter.java.patch

Adds a `runMacroSilent()` static method to the `ij.macro.Interpreter` class that:
- Suppresses error dialogs when running macros
- Returns errors as data instead of showing them in dialog boxes
- Returns a String array: `[status, message]` where status is "success" or "error"

This enables silent macro execution for automation and testing purposes.

## Usage

The patches are automatically applied during the build process by `prepare.sh`.
