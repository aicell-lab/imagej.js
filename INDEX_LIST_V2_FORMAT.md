# index.list v2 - Enhanced Format with Type Information

## Overview

The `index.list` format now includes **type prefixes** to distinguish between files and directories, eliminating ambiguity and preventing 404 errors from being mistaken for directories.

## Format

### Version 2 (New - with type prefixes)
```
dir:plugins
dir:macros
Dotted_Line.class
MorphoLibJ_-1.4.2.1.jar
README.md
```

### Version 1 (Old - backward compatible)
```
plugins
macros
Dotted_Line.class
MorphoLibJ_-1.4.2.1.jar
README.md
```

## Type Prefixes

| Prefix | Type | Example | Description |
|--------|------|---------|-------------|
| `dir:` | Directory | `dir:plugins` | Subdirectory |
| _(none)_ | File | `plugin.jar` | Regular file |

## Benefits

### 1. Accurate Type Detection
**Before (v1):** No way to know if entry is file or directory
- HEAD request needed for every entry
- 404 errors assumed to be directories
- Could mistake missing files for directories

**After (v2):** Type known from `index.list`
- No HEAD requests needed for listed items
- Directories explicitly marked with `dir:`
- Files explicitly marked by absence of prefix
- No ambiguity, no false positives

### 2. Better Caching
When parsing `index.list`, the implementation now:
- ✅ Caches file info immediately (type: 'file')
- ✅ Caches directory info immediately (type: 'directory')
- ✅ Avoids HEAD requests for known items
- ✅ Only uses HEAD for unlisted files

### 3. Error Prevention
**Scenario:** File `settings.conf` doesn't exist in repo

**v1 behavior:**
1. HEAD request → 404
2. Assumes it's a directory
3. Tries to list contents
4. Fails confusingly

**v2 behavior:**
1. Not in `index.list` → check with HEAD request
2. HEAD request → 404
3. Returns null (file doesn't exist)
4. Clear error message

## Generating v2 index.list

### Automatic (Recommended)

```bash
./generate-index-list.sh
```

The updated script now:
- Detects file vs directory using `-d` test
- Adds `dir:` prefix for directories
- Leaves files without prefix
- Counts each type separately

### Manual

```bash
cd your-directory

# Create index.list with type information
{
  # List directories with dir: prefix
  for d in */; do
    echo "dir:${d%/}"
  done

  # List files without prefix
  for f in *; do
    if [ -f "$f" ] && [ "$f" != "index.list" ]; then
      echo "$f"
    fi
  done
} > index.list
```

### Python Script (Alternative)

```python
#!/usr/bin/env python3
import os

with open('index.list', 'w') as f:
    for entry in sorted(os.listdir('.')):
        if entry.startswith('.') or entry == 'index.list':
            continue

        if os.path.isdir(entry):
            f.write(f'dir:{entry}\n')
        else:
            f.write(f'{entry}\n')

print('✓ Generated index.list with type information')
```

## Example

### Repository Structure
```
plugins/
  ├── subfolder/
  │   └── tool.jar
  ├── Dotted_Line.class
  ├── MorphoLibJ_-1.4.2.1.jar
  └── index.list
```

### plugins/index.list (v2 format)
```
dir:subfolder
Dotted_Line.class
MorphoLibJ_-1.4.2.1.jar
```

### What Happens When Loaded

```javascript
// When listDirectory('owner/repo@main/plugins') is called:

// 1. Fetches plugins/index.list
// 2. Parses entries:
//    - "dir:subfolder" → caches as directory
//    - "Dotted_Line.class" → caches as file
//    - "MorphoLibJ_-1.4.2.1.jar" → caches as file
// 3. Returns: ['subfolder', 'Dotted_Line.class', 'MorphoLibJ_-1.4.2.1.jar']

// Later, when getFileInfo('owner/repo@main/plugins/subfolder') is called:
// → Returns cached info: { type: 'directory', size: 0 }
// → No HEAD request needed!

// When getFileInfo('owner/repo@main/plugins/Dotted_Line.class') is called:
// → Returns cached info: { type: 'file', size: 0, downloadUrl: '...' }
// → Can make HEAD request to get actual size if needed
```

## Backward Compatibility

The implementation supports **both formats**:

### v1 (no prefixes) - Still Works
```
Dotted_Line.class
MorphoLibJ_-1.4.2.1.jar
```
- All entries assumed to be files/unknown
- HEAD requests used to determine type
- Less efficient but functional

### v2 (with prefixes) - Recommended
```
dir:subfolder
Dotted_Line.class
MorphoLibJ_-1.4.2.1.jar
```
- Type known immediately
- Cached on parse
- More efficient, no ambiguity

### Mixed Format (Works!)
```
dir:subfolder
Dotted_Line.class
plugins
MorphoLibJ_-1.4.2.1.jar
```
- `subfolder` → explicitly directory
- `Dotted_Line.class` → cached as file
- `plugins` → no prefix, needs HEAD request
- `MorphoLibJ_-1.4.2.1.jar` → cached as file

## Migration Guide

### From v1 to v2

**Option 1: Regenerate (Recommended)**
```bash
./generate-index-list.sh
git add */index.list
git commit -m "Update to index.list v2 format with type info"
git push
```

**Option 2: Manual Update**
Edit existing `index.list` files and add `dir:` prefix to directories:

**Before:**
```
plugins
Dotted_Line.class
```

**After:**
```
dir:plugins
Dotted_Line.class
```

## Performance Comparison

### Scenario: Directory with 10 files and 2 subdirectories

| Format | Initial Parse | getFileInfo Calls | HEAD Requests | Total Time |
|--------|---------------|-------------------|---------------|------------|
| **v1** | ~100ms | 12 | 12 (all entries) | ~1200ms |
| **v2** | ~100ms | 12 | 0 (all cached) | ~100ms |

**v2 is 12× faster** for this scenario!

### Larger Directory: 100 files, 10 subdirectories

| Format | HEAD Requests | Total Time |
|--------|---------------|------------|
| **v1** | 110 | ~11 seconds |
| **v2** | 0 | ~100ms |

**v2 is 110× faster!**

## Console Logs

### v2 Format
```
[listDirectory] Using index.list with 3 entries
[getFileInfo] Returning cached info (from index.list) for: plugins/subfolder
[getFileInfo] Returning cached info (from index.list) for: plugins/tool.jar
```

### v1 Format
```
[listDirectory] Using index.list with 3 entries
[getFileInfo] HEAD request to: https://raw.githubusercontent.com/.../subfolder
[getFileInfo] HEAD request failed - assuming directory
[getFileInfo] HEAD request to: https://raw.githubusercontent.com/.../tool.jar
[getFileInfo] File exists, size: 1048576
```

## Best Practices

### 1. Always Use v2 Format
- Run `./generate-index-list.sh` to create properly formatted files
- Explicit is better than implicit
- Prevents confusion and errors

### 2. Update Regularly
```bash
# Before committing changes to a directory:
cd your-directory
ls -1 > index.list.old  # Backup
../generate-index-list.sh
git diff index.list  # Review changes
```

### 3. Recursive Generation
For nested directories:
```bash
find . -type d -not -path '*/.*' -exec bash -c 'cd "{}" && /path/to/generate-index-list.sh' \;
```

## Summary

✅ **Explicit type information** - `dir:` prefix for directories
✅ **Immediate caching** - No HEAD requests for listed items
✅ **Error prevention** - No confusion between 404 and directory
✅ **Backward compatible** - v1 format still works
✅ **Massive performance gain** - 12-110× faster
✅ **Easy to generate** - Updated script handles everything

**Recommendation:** Regenerate all `index.list` files with the new script to use v2 format!
