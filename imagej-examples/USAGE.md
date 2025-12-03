# ImageJ.js Knowledge Base - Usage Guide

## Overview

The ImageJ.js knowledge base is a collection of working code examples that demonstrate how to accomplish various image analysis tasks using ImageJ in the browser via CheerpJ.

## Available MCP Tools

### Core ImageJ Tools
- `runMacro(macro, returnLog)` - Execute ImageJ macro code
- `executeJavaScript(code)` - Execute JavaScript with direct Java API access
- `takeScreenshot(windowTitle, format)` - Capture image window visuals
- `getImageInfo()` - Get current image properties
- `listImages()` - List all open images

### Knowledge Base Tools
- `searchCommands(query)` - Search ImageJ's built-in commands
- `listExamples(category, tag)` - Browse available code examples
- `readExample(path)` - Read full example with code
- `searchExamples(query)` - Search examples by keyword
- `saveExample(path, content)` - Save new examples (downloads file)

## Workflow Example

### 1. Find What You Need

**Search for commands:**
```
searchCommands("threshold")
→ Returns: "Auto Threshold", "Set Threshold...", etc.
```

**Browse examples:**
```
listExamples(category="segmentation")
→ Returns: List of segmentation examples
```

**Search examples:**
```
searchExamples("ROI")
→ Returns: Examples mentioning ROI
```

### 2. Read and Use Examples

```
readExample("segmentation/blob-segmentation-wand.md")
→ Returns: Full example with code and explanation
```

Then copy the code and execute:
```
runMacro("""
    run("Blobs (25K)");
    doWand(134, 87);
    roiManager("Add");
    ...
""")
```

### 3. Save Your Discoveries

When you find something that works:
```markdown
saveExample("segmentation/my-new-technique.md", """
---
title: My New Technique
category: segmentation
tags: [roi, cheerpj-safe]
language: macro
---

# My New Technique

## Description
What this does...

## Code
```imagej-macro
// Your working code
```

## Notes
- What worked
- What to watch out for
```
""")
```

## Tips for Success

### 1. Check CheerpJ Compatibility
Look for examples tagged with `cheerpj-safe` - these are confirmed to work in the browser environment.

### 2. Prefer Direct API When Macros Fail
If a macro command doesn't work, try the JavaScript/Java API version:
```javascript
// Instead of: run("Analyze Particles...")
// Use direct API:
const ParticleAnalyzer = await window.lib.ij.plugin.filter.ParticleAnalyzer;
```

### 3. Use Screenshots to Verify
Always take screenshots to confirm results:
```
runMacro("your code");
takeScreenshot();
```

### 4. Build on Existing Examples
Start with working examples and modify them rather than starting from scratch.

## Example Categories

- **segmentation/** - Object detection, thresholding, particle analysis
- **roi/** - ROI Manager operations, measurements
- **measurement/** - Extracting quantitative data
- **preprocessing/** - Image enhancement, filtering

## Contributing Guidelines

When saving new examples:

1. **Use descriptive titles**: "Blob Segmentation with Magic Wand" not "blob.md"
2. **Include YAML frontmatter**: Add metadata for searchability
3. **Document what works**: Explain why this approach works in CheerpJ
4. **Note limitations**: Mention what doesn't work
5. **Provide context**: When to use this technique
6. **Add tags**: Use tags like `cheerpj-safe`, `workaround`, etc.

## Troubleshooting

### Example not found
- Check the path is relative to `imagej-examples/`
- Verify the file exists in the repository

### saveExample downloads instead of saving
- This is expected in browser environment
- Manually place the file in the correct folder
- Commit to git to share with others

### Command search returns nothing
- Try broader search terms
- Use partial words: "thresh" instead of "threshold"

## Future Improvements

- [ ] Add more examples from user contributions
- [ ] Create video tutorials for common tasks
- [ ] Add difficulty ratings to examples
- [ ] Build interactive example browser UI
- [ ] Add code validation/testing

