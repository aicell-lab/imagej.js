# ROI ↔ GeoJSON Conversion

This document describes the bidirectional conversion between ImageJ ROIs and GeoJSON format implemented in `hypha-imagej-service.js`.

## Features

### 1. ROI → GeoJSON (`roiToGeoJson`)

Converts ImageJ ROIs to GeoJSON features with full geometry support.

**Supported ROI Types:**
- **Point** → GeoJSON `Point`
- **Multi-point** → GeoJSON `MultiPoint`
- **Line** → GeoJSON `LineString` (2 points)
- **Polyline** → GeoJSON `LineString` (multiple points)
- **Polygon** → GeoJSON `Polygon`
- **Rectangle** → GeoJSON `Polygon` (4 vertices)
- **Oval/Ellipse** → GeoJSON `Polygon` (approximated with vertices)
- **Freehand** → GeoJSON `Polygon`
- **Traced** → GeoJSON `Polygon`
- **ShapeRoi** (composite) → GeoJSON `GeometryCollection`

**Properties preserved:**
- ROI name
- ROI type
- Custom properties (when `includeProperties=true`)
- For ellipses: `shape: 'ellipse'` property

### 2. GeoJSON → ROI (`geoJsonToRoi`)

Converts GeoJSON features back to ImageJ ROIs.

**Supported GeoJSON Types:**
- **Point** → `PointRoi` (single point)
- **MultiPoint** → `PointRoi` (multiple points)
- **LineString** → `Line` (2 points) or `PolygonRoi.POLYLINE` (more points)
- **Polygon** → `Roi` (rectangle), `OvalRoi` (if marked as ellipse), or `PolygonRoi`
- **MultiPolygon** → Multiple `PolygonRoi` combined with `ShapeRoi`
- **GeometryCollection** → Multiple ROIs combined with `ShapeRoi`

**Properties supported:**
- `name` → ROI name
- `shape: 'ellipse'` → Creates `OvalRoi` instead of polygon
- `strokeColor` → ROI color (supports `#RGB`, `#RRGGBB`, `rgb(r,g,b)`)

## API Methods

### Service Method: `getRoisAsGeoJson`

Get ROIs from ImageJ and convert to GeoJSON format.

```javascript
{
  source: "current" | "manager" | "both",  // Default: "both"
  includeProperties: boolean  // Default: true
}
```

Returns:
```javascript
{
  success: boolean,
  geojson: FeatureCollection,
  count: number,
  error?: string
}
```

### Service Method: `setRoisFromGeoJson`

Set ROIs in ImageJ from GeoJSON format.

```javascript
{
  geojson: FeatureCollection | Feature,
  target: "current" | "manager" | "both",  // Default: "both"
  clearExisting: boolean  // Default: false
}
```

Returns:
```javascript
{
  success: boolean,
  count: number,
  error?: string
}
```

## Usage Examples

### Example 1: Export ROIs to GeoJSON

```javascript
// Via service
const result = await service.getRoisAsGeoJson({
  source: "both",
  includeProperties: true
});

console.log(result.geojson);
```

### Example 2: Import ROIs from GeoJSON

```javascript
const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[10, 10], [100, 10], [100, 100], [10, 100], [10, 10]]]
      },
      properties: {
        name: "My Rectangle"
      }
    }
  ]
};

const result = await service.setRoisFromGeoJson({
  geojson: geojson,
  target: "both",
  clearExisting: true
});

console.log(`Imported ${result.count} ROIs`);
```

### Example 3: Round-trip Conversion

```javascript
// Export
const exported = await service.getRoisAsGeoJson({ source: "manager" });

// Modify GeoJSON (e.g., transform coordinates, filter, etc.)
const modified = transformGeoJSON(exported.geojson);

// Import back
const imported = await service.setRoisFromGeoJson({
  geojson: modified,
  target: "manager",
  clearExisting: true
});
```

## Testing

A test button is available in the UI (bottom-right, green button) that performs:

1. **ROI → GeoJSON**: Exports all current ROIs to GeoJSON
2. **GeoJSON → ROI**: Imports the GeoJSON back as new ROIs
3. **Verification**: Check ROI Manager to compare original vs imported ROIs

### Test Steps:

1. Open an image in ImageJ
2. Draw some ROIs (rectangle, oval, polygon, etc.)
3. Add them to ROI Manager (press `t`)
4. Click "Test ROI↔GeoJSON" button
5. Check ImageJ Log window for conversion details
6. Check ROI Manager for imported ROIs (prefixed with `[GeoJSON]`)
7. Open browser console (F12) to see the GeoJSON output

## Technical Details

### Coordinate System

- GeoJSON uses `[x, y]` coordinates
- ImageJ ROIs use pixel coordinates
- No coordinate transformation is applied (1:1 mapping)

### Polygon Closing

- GeoJSON Polygons require the first point to be repeated at the end
- When converting from ROI → GeoJSON, the closing point is added
- When converting from GeoJSON → ROI, the closing point is removed

### Rectangle Detection

When converting GeoJSON Polygon → ROI, the converter checks if the polygon is a perfect rectangle:
- Must have exactly 4 vertices
- All vertices must lie on rectangle edges (right angles)
- If true, creates `Roi` (rectangle) instead of `PolygonRoi`

### Ellipse Handling

Ellipses are approximated as polygons in GeoJSON:
- ROI → GeoJSON: `OvalRoi` becomes `Polygon` with `shape: 'ellipse'` property
- GeoJSON → ROI: `Polygon` with `shape: 'ellipse'` becomes `OvalRoi` (bounding box)

### Color Support

ROI colors can be preserved via the `strokeColor` property:
```javascript
{
  properties: {
    strokeColor: "#FF0000"  // or "rgb(255, 0, 0)"
  }
}
```

## Limitations

1. **Holes in Polygons**: Currently only the exterior ring is used; holes (interior rings) are ignored
2. **Ellipse Precision**: Ellipses are approximated, not exact
3. **Z-position/Time**: Currently not preserved (ROIs are 2D only)
4. **ROI Properties**: Only basic properties (name, type, color) are preserved
5. **Complex ShapeRoi**: Very complex composite shapes may not convert perfectly

## Future Enhancements

- Support for polygon holes (interior rings)
- Preserve z-position and time-point
- Support for more ROI properties (stroke width, fill color, etc.)
- 3D ROI support
- Better ellipse fitting (convert polygon to ellipse parameters)
