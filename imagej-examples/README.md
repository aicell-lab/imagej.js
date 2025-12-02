# ImageJ.js Code Examples

A growing collection of working code examples for ImageJ running in the browser via CheerpJ.

## 🎯 Quick Start

Use the MCP tools to browse examples:
- `listExamples()` - See all available examples
- `readExample(path)` - Read a specific example
- `searchExamples(query)` - Search examples by keyword
- `searchCommands(query)` - Find ImageJ commands

## 📚 Categories

### Segmentation
- [Blob Segmentation with Magic Wand](segmentation/blob-segmentation-wand.md) ⭐ CheerpJ-safe

### ROI Management  
- [ROI Manager Basics](roi/roi-manager-basics.md)

### Measurement
- Coming soon...

### Preprocessing
- Coming soon...

## 🏷️ Common Tags
- `cheerpj-safe` - Confirmed to work reliably in browser environment
- `macro` - Uses ImageJ macro language
- `javascript` - Uses direct JavaScript/Java API calls
- `workaround` - Alternative when standard method fails

## ⚠️ CheerpJ Compatibility Notes

Some ImageJ functions behave differently in the browser:
- ❌ `Analyze Particles` via macro - Often returns 0 results in CheerpJ
- ✅ `doWand()` - Works reliably
- ✅ Direct Java API calls via JavaScript - Most reliable
- ✅ ROI Manager - Works well

## 🤝 Contributing

When you discover a working solution, save it using `saveExample()` with proper markdown formatting.

