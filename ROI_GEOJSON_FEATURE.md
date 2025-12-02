# ROI to GeoJSON Conversion Feature

## Overview

This feature enables conversion of ImageJ ROIs (Regions of Interest) to GeoJSON format, making it easy to export and use ROI data in web mapping applications, GIS systems, and other tools that support GeoJSON.

## Implementation

### Files Modified

1. **[hypha-imagej-service.js](hypha-imagej-service.js)** - Added:
   - `getRoisAsGeoJson` service method (lines 2148-2241)
   - `roiToGeoJson` helper function (lines 867-1083)
   - `floatPolygonToGeoJson` helper function (lines 1085-1127)
   - Schema definition for `getRoisAsGeoJson` (lines 657-698)

2. **[index.html](index.html)** - Modified:
   - Changed test button to "Test ROI→GeoJSON" (line 338)
   - Added test button handler to demonstrate ROI conversion (lines 618-745)

### API Method: `getRoisAsGeoJson`

```javascript
// Service method signature
getRoisAsGeoJson({
  source: 'current' | 'manager' | 'both',  // Default: 'both'
  includeProperties: boolean                // Default: true
})
```

**Parameters:**
- `source`: Where to get ROIs from
  - `'current'`: Only the current ROI from the active image
  - `'manager'`: All ROIs from the ROI Manager
  - `'both'`: Both sources (default)
- `includeProperties`: Include ROI metadata (name, type, index) in GeoJSON properties

**Returns:**
```javascript
{
  success: boolean,
  geojson: {
    type: "FeatureCollection",
    features: [...]
  },
  count: number,
  error?: string
}
```

### Supported ROI Types

The converter supports all standard ImageJ ROI types:

| ImageJ ROI Type | GeoJSON Geometry | Notes |
|----------------|------------------|-------|
| **Point** | Point or MultiPoint | Single point → Point, multiple points → MultiPoint |
| **Line** | LineString | Two-point line |
| **Rectangle** | Polygon | Converted to 5-point closed polygon |
| **Rounded Rectangle** | Polygon | Uses FloatPolygon approximation |
| **Oval/Ellipse** | Polygon | Polygon approximation with `shape: 'ellipse'` property |
| **Polygon** | Polygon | Closed polygon |
| **Freehand** | Polygon | Closed polygon |
| **Traced ROI** | Polygon | Closed polygon |
| **Polyline** | LineString | Open polyline |
| **Freeline** | LineString | Open freeline |
| **Angle** | LineString | Angle measurement line |
| **ShapeRoi** | GeometryCollection | Complex shapes with multiple sub-ROIs |

### GeoJSON Properties

When `includeProperties: true`, each feature includes:

```javascript
{
  "properties": {
    "name": "ROI name",
    "type": "Rectangle",        // ImageJ ROI type
    "index": 0,                 // Position in ROI Manager (if applicable)
    "source": "ROI Manager",    // "Current Selection" or "ROI Manager"
    "shape": "ellipse"          // Additional shape hint (for ovals)
  }
}
```

## Usage Examples

### Example 1: Get Current ROI

```javascript
// Via Hypha service
const result = await hyphaService.getRoisAsGeoJson({
  source: 'current',
  includeProperties: true
});

console.log(result.geojson);
// {
//   "type": "FeatureCollection",
//   "features": [{
//     "type": "Feature",
//     "geometry": {
//       "type": "Polygon",
//       "coordinates": [[...]]
//     },
//     "properties": {
//       "name": "Current Selection",
//       "type": "Rectangle"
//     }
//   }]
// }
```

### Example 2: Get All ROIs from ROI Manager

```javascript
const result = await hyphaService.getRoisAsGeoJson({
  source: 'manager',
  includeProperties: true
});

console.log(`Exported ${result.count} ROIs`);
console.log(result.geojson);
```

### Example 3: Direct Function Call (Browser)

```javascript
// Import the function
import { roiToGeoJson } from './hypha-imagej-service.js';

// Get current ROI
const IJ = window.IJClass;
const imp = await IJ.getImage();
const roi = await imp.getRoi();

// Convert to GeoJSON
const feature = await roiToGeoJson(roi, 'My ROI', true);
console.log(JSON.stringify(feature, null, 2));
```

### Example 4: Using the Test Button

1. Open ImageJ.js in your browser
2. Open an image (File → Open Samples → Blobs)
3. Draw an ROI using selection tools (Rectangle, Oval, Freehand, etc.)
4. Click the green "Test ROI→GeoJSON" button (bottom-right)
5. Check the browser console (F12) to see the GeoJSON output
6. Check the ImageJ Log window for conversion status

## Technical Details

### Coordinate System

- **GeoJSON coordinates**: `[x, y]` format (standard GeoJSON)
- **ImageJ coordinates**: Pixel coordinates from the image
- **No transformation**: Coordinates are exported as-is from ImageJ (no CRS transformation)

### Polygon Closure

- **Closed polygons**: First and last coordinates are the same
- **Open polylines**: First and last coordinates are different
- The converter automatically handles polygon closure based on ROI type

### Complex Shapes (ShapeRoi)

For complex shapes with multiple sub-ROIs:
- Converted to `GeometryCollection`
- Each sub-ROI becomes a separate geometry in the collection
- Preserves the hierarchical structure

### Fallback Behavior

If a specific ROI type cannot be converted:
1. Attempts to use `getFloatPolygon()` for polygon approximation
2. Falls back to bounding box (Rectangle)
3. Adds `warning: 'Converted to bounding box'` to properties

## Integration with QuPath

The conversion logic is based on QuPath's `IJTools.java` implementation:
- Reference: https://github.com/qupath/qupath (IJTools.java)
- Handles all standard ImageJ ROI types
- Compatible with QuPath's coordinate conventions

## Testing

### Manual Test Steps

1. **Test Current ROI**:
   ```
   - Open an image
   - Draw a rectangle: Toolbar → Rectangle tool → drag on image
   - Click "Test ROI→GeoJSON" button
   - Check console for output
   ```

2. **Test ROI Manager**:
   ```
   - Open sample image: File → Open Samples → Blobs (25K)
   - Open ROI Manager: Analyze → Tools → ROI Manager
   - Add ROI: Press 't' key or click "Add [t]"
   - Draw more ROIs and add them
   - Click "Test ROI→GeoJSON" button
   ```

3. **Test Different ROI Types**:
   ```
   - Rectangle: Rectangle tool → drag
   - Oval: Oval tool → drag
   - Polygon: Polygon tool → click points → double-click to close
   - Freehand: Freehand tool → drag
   - Line: Line tool → drag
   - Point: Point tool → click
   ```

### Via Hypha MCP Server

1. Connect to Hypha:
   ```
   - Click "Hypha MCP Server" button
   - Copy the MCP URL
   - Configure in Claude Desktop
   ```

2. Call from Claude:
   ```
   Can you get the ROIs from ImageJ as GeoJSON?
   ```

## Future Enhancements

Potential improvements:

1. **CRS Support**: Add coordinate reference system metadata
2. **Calibration**: Apply ImageJ's spatial calibration to coordinates
3. **Z-stack Support**: Export 3D ROIs with Z-coordinate
4. **Time Series**: Export ROIs from multiple time points
5. **ROI Properties**: Include more ImageJ properties (color, stroke width, etc.)
6. **Reverse Conversion**: Import GeoJSON to create ImageJ ROIs

## References

- **GeoJSON Specification**: https://geojson.org/
- **ImageJ ROI API**: https://imagej.net/ij/developer/api/ij/gui/Roi.html
- **QuPath IJTools**: https://github.com/qupath/qupath/blob/main/qupath-core-processing/src/main/java/qupath/imagej/tools/IJTools.java
- **ROI File Format**: https://github.com/cgohlke/roifile (Python reference)

## License

Same as ImageJ.js project.
