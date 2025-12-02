---
title: Blob Segmentation Using Magic Wand
category: segmentation
tags: [roi, wand, cheerpj-safe, manual-selection]
language: macro
difficulty: easy
works_in_cheerpj: true
date_added: 2024-12-02
---

# Blob Segmentation Using Magic Wand

## Description
Select individual blobs using the `doWand()` (magic wand) tool. This method is reliable in the CheerpJ/browser environment when automated Analyze Particles fails.

## When to Use
- Analyze Particles returns 0 results
- Need precise control over which blobs to select
- Working with overlapping or touching objects
- CheerpJ environment limitations

## Code

### Macro Version
```imagej-macro
// Start fresh
run("Close All");
roiManager("reset");

// Load sample image
run("Blobs (25K)");

// Click on blob centers with magic wand
// Automatically selects connected pixels
doWand(134, 87);  // Blob 1
roiManager("Add");

doWand(88, 75);   // Blob 2
roiManager("Add");

doWand(175, 161); // Blob 3
roiManager("Add");

doWand(106, 142); // Blob 4
roiManager("Add");

doWand(65, 145);  // Blob 5
roiManager("Add");

// Show all ROIs with labels
count = roiManager("count");
print("Manually selected blobs: " + count);

roiManager("Show All");
roiManager("Show All with labels");
```

## Notes
- **Works reliably**: The wand tool directly accesses pixel values via Java API
- **Finding coordinates**: You may need to identify blob centers first (can use Image > Adjust > Threshold to visualize)
- **Tolerance**: Default tolerance is 0 (exact match). Lower tolerance = more precise selection
- **Why it works**: Unlike Analyze Particles which has issues in CheerpJ, `doWand()` uses simpler pixel connectivity checking

## Common Issues

### No ROI added
- Click didn't land on a blob. Verify coordinates are correct.
- Try clicking more towards the center of the blob.

### Wrong selection / Selects too much
- Adjust wand tolerance: `setTool("wand");` then adjust in ImageJ UI
- Or use different threshold settings before using wand

## Alternative Approaches

If you know blob locations, you can loop:
```imagej-macro
// Array of blob center coordinates
x = newArray(134, 88, 175, 106, 65);
y = newArray(87, 75, 161, 142, 145);

for (i = 0; i < x.length; i++) {
    doWand(x[i], y[i]);
    roiManager("Add");
}
```

## Related Examples
- [ROI Manager Basics](../roi/roi-manager-basics.md)

## See Also
- ImageJ macro function: `doWand(x, y)`
- Java class: `ij.plugin.frame.RoiManager`
- ImageJ documentation: https://imagej.net/ij/developer/macro/functions.html#doWand

