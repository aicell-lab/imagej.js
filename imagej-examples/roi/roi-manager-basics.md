---
title: ROI Manager Basics
category: roi
tags: [roi, cheerpj-safe, basics]
language: macro
difficulty: easy
works_in_cheerpj: true
date_added: 2024-12-02
---

# ROI Manager Basics

## Description
Basic operations with the ROI Manager in ImageJ - adding, listing, measuring, and managing regions of interest.

## Code

### Creating and Adding ROIs
```imagej-macro
// Clear any existing ROIs
roiManager("reset");

// Method 1: Create ROI programmatically
makeOval(50, 50, 100, 100);
roiManager("Add");

// Method 2: Use selection tools (after user draws)
// User draws selection, then:
roiManager("Add");

// Method 3: Use wand tool
doWand(x, y);
roiManager("Add");

// Get count
count = roiManager("count");
print("Total ROIs: " + count);
```

### Displaying ROIs
```imagej-macro
// Show all ROIs on image
roiManager("Show All");

// Show with labels (numbers)
roiManager("Show All with labels");

// Hide all
roiManager("Show None");
```

### Selecting and Deleting ROIs
```imagej-macro
// Select specific ROI by index (0-based)
roiManager("select", 0);

// Delete selected ROI
roiManager("delete");

// Delete all
roiManager("reset");
```

### Measuring ROIs
```imagej-macro
// Set measurements to include
run("Set Measurements...", "area mean perimeter display redirect=None decimal=3");

// Measure all ROIs
roiManager("Deselect");
roiManager("Measure");

// Results will appear in Results table
```

## JavaScript Version

For more reliable access in CheerpJ:
```javascript
const IJ = window.IJClass || window.IJ;
const RoiManager = await window.lib.ij.plugin.frame.RoiManager;

// Get or create ROI Manager instance
let rm = await RoiManager.getInstance();
if (!rm) {
    rm = await new RoiManager();
}

// Get count
const count = await rm.getCount();
console.log('ROI count:', count);

// Get specific ROI
const roi = await rm.getRoi(0);  // First ROI

// Reset (clear all)
await rm.reset();
```

## Common Operations

### Save ROIs
```imagej-macro
// Save all ROIs to a zip file
roiManager("Save", "/path/to/RoiSet.zip");
```

### Load ROIs
```imagej-macro
// Load ROIs from file
roiManager("Open", "/path/to/RoiSet.zip");
```

### Combine ROIs
```imagej-macro
// Select multiple ROIs (hold Shift)
roiManager("select", newArray(0,1,2));

// Combine
roiManager("Combine");

// OR/AND/XOR operations
roiManager("OR");
roiManager("AND");
roiManager("XOR");
```

## Notes
- ROI Manager works reliably in CheerpJ environment
- ROIs are numbered starting from 0
- Use "Deselect" before "Measure" to measure all ROIs
- ROIs can be saved/loaded in .zip format

## See Also
- [Blob Segmentation with Wand](../segmentation/blob-segmentation-wand.md)
- Java class: `ij.plugin.frame.RoiManager`

