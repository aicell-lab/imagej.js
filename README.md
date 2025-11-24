# ImageJ.JS

A browser-based version of ImageJ powered by CheerpJ 4.2, enabling full-featured image processing directly in the browser without any server-side processing.

![ImageJ.JS Screenshot](static/imagej.js-screenshot.png)

## Project Goals

The primary objective of ImageJ.JS is to bring the powerful ImageJ desktop application to the web browser, making it accessible across all devices including mobile and tablets. Key goals include:

- **Universal Accessibility**: Run ImageJ without installation on any device with a modern browser
- **Native File System Integration**: Load and save files directly from the user's local file system
- **Full Plugin Support**: Enable ImageJ plugins (MorphoLibJ, ThunderSTORM, etc.) to work in the browser
- **Performance**: Maintain reasonable performance for image processing tasks despite browser constraints

Read the [blog post](https://aicell.io/post/improving-imagej.js/) for more details about the journey from CheerpJ 3 to 4.x.

![Running MorphoLibJ in the browser](static/morpholibj-filters.gif)

## What is CheerpJ?

[CheerpJ](https://cheerpj.com/) is a WebAssembly-based Java Virtual Machine that runs entirely in the browser. It allows Java applications to run without plugins or server-side compilation:

- **Direct JAR Loading**: Load `.jar` files directly in the browser without preprocessing
- **JVM in WASM**: Complete Java runtime compiled to WebAssembly
- **Dynamic Patching**: Override Java methods with JavaScript at runtime
- **Virtual File System**: Complete file system implementation using IndexedDB

### CheerpJ 4.2 API

The main CheerpJ APIs used in this project:

```javascript
// Initialize CheerpJ
await cheerpjInit({
  clipboardMode: "java",  // Clipboard integration mode
  javaProperties: [       // Java system properties
    "user.dir=/files",
    "plugins.dir=/app/lib/ImageJ/plugins"
  ]
});

// Create the display area
cheerpjCreateDisplay(-1, -1, element);

// Run a JAR file
await cheerpjRunJar("/app/lib/ImageJ/ij.jar");
```

## Critical Implementation Challenges

While CheerpJ provides excellent Java-in-browser capabilities, several hacks are required to make ImageJ fully functional:

### 1. File System Access

**Challenge**: ImageJ needs to read/write files from the user's local file system, but CheerpJ's default file system is isolated in IndexedDB.

**Solution**: We patch CheerpJ's internal `IdbOps` (IndexedDB Operations) to intercept file system calls and redirect them to the browser's Native File System API when a folder is mounted.

### 2. DirectDownloader Patching

**Challenge**: CheerpJ 4.2 requires HTTP servers to support Range headers for partial content requests. Not all servers support this.

**Solution**: We override `DirectDownloader.prototype.send` to customize download behavior and handle edge cases.

### 3. Range Header Requirements

**Challenge**: Python's built-in HTTP server doesn't support Range headers, causing "CheerpJ cannot run" errors.

**Solution**: Use `http-server` npm package which properly supports Range headers and CORS.

## Architecture & Implementation

### File System Hierarchy

```
/                      # Root (CheerpJRootFolder)
├── /app/             # Application files (CheerpJWebFolder) - served via HTTP
│   └── /lib/ImageJ/  # ImageJ installation
├── /files/           # User files (CheerpJIndexedDBFolder) - persistent storage
├── /lt/              # CheerpJ runtime files
└── /dev/             # Device files (CheerpJDevFolder)
```

### Native File System Integration

Located in `utils.js`, this is the core hack that makes local file access work:

```javascript
class NativeFileSystemHandler {
  async loadDirectory() {
    // Use File System Access API to get a directory handle
    this.directoryHandle = await window.showDirectoryPicker();
  }

  async getFileHandle(path) {
    // Navigate path and return file handle
  }
}
```

### IdbOps Patching

CheerpJ's internal file system operations are exposed through:

```javascript
// File system mount operations
var IdbOps = {
  statAsync,      // Get file metadata
  listAsync,      // List directory contents
  makeFileData,   // Create/open file
  createDirAsync, // Create directory
  renameAsync,    // Rename file
  linkAsync,      // Create symlink
  unlinkAsync     // Delete file
};

// File I/O operations
var IdbInodeOps = {
  readAsync,      // Read file data
  writeAsync,     // Write file data
  close           // Close and commit changes
};
```

We patch these functions to:
1. Check if a native directory is mounted (`window.nativeDirectoryHandle`)
2. If yes, redirect operations to the Native File System API
3. If no, fall back to original IndexedDB implementation

### DirectDownloader Override

```javascript
function patchDownloader() {
  function ddlSend() {
    var downloader = this;
    var headers = {};
    if(downloader.rangeHeader)
      headers["Range"] = downloader.rangeHeader;

    fetch(downloader.url, {"method": "GET", "headers": headers})
      .then(response => ddlOnLoad(response, downloader))
      .catch(err => ddlOnError(downloader, err));
  }

  DirectDownloader.prototype.send = ddlSend;
}
```

## Key Differences: CheerpJ 2 → 3 → 4.2

### CheerpJ 2
- Required pre-compilation of Java to JavaScript
- No dynamic JAR loading
- Limited plugin support

### CheerpJ 3
- Direct JAR loading in browser
- Dynamic patching capabilities
- Full classloader support

### CheerpJ 4.2 (Current)
- Java 8, 11, and 17 (preview) support
- **Stricter Range header requirements**
- Improved performance and stability
- Better WASM implementation

### Migration Challenges (4.0 → 4.2)

1. **Path Concatenation Bug**: Fixed `baseUrl` calculation to properly handle `/index.html` vs `/`
2. **Range Headers**: Had to switch from Python HTTP server to `http-server` npm package
3. **API Compatibility**: Internal APIs (`IdbOps`, `DirectDownloader`) remain stable

## Files Structure

```
imagej.js2/
├── index.html              # Main application entry point
├── utils.js                # Native file system integration utilities
├── package.json            # Dev server dependencies
├── docs/
│   └── cheerpOS.js        # Reference copy of CheerpJ internals
├── lib/
│   └── ImageJ/            # ImageJ installation (gitignored)
│       ├── ij.jar
│       ├── plugins/
│       └── macros/
└── README.md              # This file
```

### Key Implementation Files

#### `index.html`
- CheerpJ initialization
- DirectDownloader patching
- Main application bootstrap

#### `utils.js`
- `NativeFileSystemHandler`: Manages native folder access
- `createNativeFileSystemPatches()`: Patches IdbOps for native FS integration
- File I/O wrappers for native file handles

## Development Setup

### Prerequisites
- Node.js and npm
- Modern browser with File System Access API support (Chrome 86+, Edge 86+)

### Installation

1. Clone the repository
2. Download and prepare ImageJ:
   ```bash
   sh prepare.sh
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

The project requires a web server that supports Range headers:

```bash
npm run dev
```

Then open http://localhost:8000 in your browser.

**Note**: Do not use Python's built-in HTTP server (`python3 -m http.server`) as it doesn't support Range headers required by CheerpJ 4.2.

## Usage

### Basic Usage
1. Open the application in your browser
2. ImageJ will load automatically with the default interface

### Loading Local Files
1. Click the "Load Folder" button in the bottom-left corner
2. Select a folder containing your images
3. The folder will be mounted and accessible from within ImageJ
4. Use ImageJ's File menu to open images from the mounted folder

### Saving Files
Files saved from ImageJ will be written back to the mounted folder in real-time using the Native File System API.

## Browser Compatibility

### Fully Supported
- Chrome 86+ (Desktop)
- Edge 86+ (Desktop)

### Limited Support
- Safari: No File System Access API support (falls back to IndexedDB only)
- Firefox: No File System Access API support (falls back to IndexedDB only)
- Mobile browsers: Limited support due to File System Access API constraints

## Known Issues & Limitations

### File System Access
- **Safari/Firefox**: Native file system mounting not available, must use IndexedDB-based virtual file system
- **Mobile browsers**: File System Access API not widely supported

### Range Header Errors
Some external resources (like imagej.net sample images) don't support Range headers. These are non-critical and don't affect core functionality.

### Performance
- Large file processing may be slower than desktop due to browser constraints
- Multi-threading support is limited by browser security model

### Plugin Compatibility
Most ImageJ plugins work, but some with native dependencies may fail. Successfully tested:
- MorphoLibJ
- ThunderSTORM
- Bio-Formats (limited)

## Technical Deep Dive

### How File System Patching Works

1. **Initialization**: After `cheerpjInit()`, we call `createNativeFileSystemPatches()`
2. **Override**: We replace `IdbOps.statAsync`, `IdbOps.makeFileData`, etc. with our implementations
3. **Detection**: Each patched function checks if `window.nativeDirectoryHandle` exists
4. **Routing**:
   - If native handle exists → use File System Access API
   - If not → fall back to original IndexedDB implementation
5. **Path Mapping**: Paths like `/files/image.tif` are mapped to native file system paths

### File Reading Flow

```
ImageJ opens file
    ↓
Java File I/O call
    ↓
CheerpJ intercepts
    ↓
IdbOps.makeFileData (patched)
    ↓
Check window.nativeDirectoryHandle
    ↓
[If exists] Use File System Access API
    ↓
Read file via FileHandle.getFile()
    ↓
Create CheerpJFileData with actual data
    ↓
Return to ImageJ
```

### File Writing Flow

```
ImageJ saves file
    ↓
Java File I/O call
    ↓
IdbOps.makeFileData (mode="w")
    ↓
Create writable CheerpJFileData
    ↓
ImageJ writes data chunks
    ↓
IdbInodeOps.close (patched)
    ↓
Check fileData.nativeHandle
    ↓
[If exists] Create writable stream
    ↓
Write data to native file
    ↓
Close stream
```

## Debugging Tips

### Enable CheerpJ Debug Mode

```javascript
await cheerpjInit({
  enablePreciseAppEnv: true,  // More accurate environment
  logCanvasUpdates: true      // Log rendering updates
});
```

### Check Patch Status

Open browser console and run:

```javascript
// Check if patches are applied
console.log({
  hasDirectDownloader: typeof DirectDownloader !== 'undefined',
  hasIdbOps: typeof IdbOps !== 'undefined',
  hasNativeFS: typeof window.nativeFS !== 'undefined',
  nativeFolderMounted: !!window.nativeDirectoryHandle
});
```

### Common Errors

**"HTTP server does not support Range header"**
- Solution: Make sure you're using `npm run dev`, not Python's HTTP server

**"File not found" when accessing mounted folder**
- Check that folder was mounted via "Load Folder" button
- Verify browser supports File System Access API
- Check browser console for permission errors

**ImageJ fails to start**
- Check that lib/ImageJ/ij.jar exists
- Verify no errors in browser console
- Try clearing browser cache and IndexedDB

## Future Improvements

- [ ] Support for Safari/Firefox file system access via alternative APIs
- [ ] Better error handling for unsupported browsers
- [ ] Implement file size limit increases (currently 4GB limit in some browsers)
- [ ] Add support for Fiji distribution with full plugin ecosystem
- [ ] Implement proper multi-threading using Web Workers
- [ ] Optimize initial load time and caching

## Contributing

This project demonstrates the integration between CheerpJ and the File System Access API. Contributions are welcome, especially for:

- Browser compatibility improvements
- Additional plugin support
- Performance optimizations
- Documentation improvements

## References

- [CheerpJ Documentation](https://cheerpj.com/docs/)
- [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [ImageJ](https://imagej.net/)
- [Original Blog Post](https://aicell.io/post/improving-imagej.js/)

## License

See individual component licenses:
- ImageJ: Public domain
- CheerpJ: Commercial license (Community Edition for non-commercial use)

---

**Note**: This project uses CheerpJ Community Edition which is free for personal and non-commercial use. For commercial use, a CheerpJ license is required.
