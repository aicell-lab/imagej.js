// Native File System Integration Utilities for ImageJ.JS
// This file contains all the patches and utilities for native file system support

// Global variable to store the directory handle
let nativeDirectoryHandle = null;

// Local File System Handler for drag-and-drop files
class LocalFileSystemHandler {
  constructor() {
    this.files = new Map(); // Map of path -> File object
    this.directories = new Set(); // Set of directory paths
  }

  clear() {
    this.files.clear();
    this.directories.clear();
    console.log('Cleared all local files');
  }

  async addFile(file, path = null) {
    // Use provided path or construct from file name
    const filePath = path || file.name;
    this.files.set(filePath, file);

    // Add parent directories
    const parts = filePath.split('/');
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += (currentPath ? '/' : '') + parts[i];
      this.directories.add(currentPath);
    }

    console.log('Added file to local FS:', filePath);
  }

  async addFiles(files, basePath = '') {
    for (const file of files) {
      const path = basePath ? `${basePath}/${file.name}` : file.name;
      await this.addFile(file, path);
    }
  }

  async addFileTree(entries, basePath = '') {
    for (const entry of entries) {
      if (entry.kind === 'file') {
        const file = await entry.getAsFile();
        if (file) {
          const path = basePath ? `${basePath}/${file.name}` : file.name;
          await this.addFile(file, path);
        }
      } else if (entry.kind === 'directory') {
        const dirReader = entry.createReader();
        const childEntries = await new Promise((resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        });

        const dirPath = basePath ? `${basePath}/${entry.name}` : entry.name;
        this.directories.add(dirPath);

        await this.addFileTree(childEntries, dirPath);
      }
    }
  }

  getFile(path) {
    return this.files.get(path);
  }

  isDirectory(path) {
    return this.directories.has(path);
  }

  listDirectory(path) {
    const entries = [];
    const prefix = path ? `${path}/` : '';
    const prefixLength = prefix.length;

    // List files
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(prefix)) {
        const remainder = filePath.substring(prefixLength);
        const slashIndex = remainder.indexOf('/');
        if (slashIndex === -1) {
          // Direct child file
          entries.push(remainder);
        } else {
          // Child directory
          const dirName = remainder.substring(0, slashIndex);
          if (!entries.includes(dirName)) {
            entries.push(dirName);
          }
        }
      }
    }

    // List directories
    for (const dirPath of this.directories) {
      if (dirPath.startsWith(prefix) && dirPath !== path) {
        const remainder = dirPath.substring(prefixLength);
        const slashIndex = remainder.indexOf('/');
        if (slashIndex === -1) {
          // Direct child directory
          if (!entries.includes(remainder)) {
            entries.push(remainder);
          }
        } else {
          // Nested directory
          const dirName = remainder.substring(0, slashIndex);
          if (!entries.includes(dirName)) {
            entries.push(dirName);
          }
        }
      }
    }

    return entries;
  }

  isEmpty() {
    return this.files.size === 0 && this.directories.size === 0;
  }
}

// Native File System Integration
class NativeFileSystemHandler {
  constructor() {
    this.directoryHandle = null;
    this.fileCache = new Map();
  }

  async loadDirectory() {
    try {
      if ('showDirectoryPicker' in window) {
        this.directoryHandle = await window.showDirectoryPicker();
        nativeDirectoryHandle = this.directoryHandle;

        // Update global window reference
        window.nativeDirectoryHandle = this.directoryHandle;
        window.nativeFS = this;

        // Update button to show mounted folder
        const loadBtnEl = document.getElementById('loadFolderBtn');
        const btnIcon = loadBtnEl.querySelector('svg');
        const btnText = loadBtnEl.querySelector('span');
        const tooltip = document.getElementById('loadFolderTooltip');

        // Change button appearance to show it's mounted
        loadBtnEl.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        loadBtnEl.classList.add('bg-green-600', 'hover:bg-green-700');

        // Add checkmark indicator
        btnIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';

        // Update text to show folder name
        btnText.textContent = `📁 ${this.directoryHandle.name}`;

        // Update tooltip message for mounted state
        if (tooltip) {
          tooltip.innerHTML = `Folder mounted under <strong>/files/</strong><br>Use <strong>File → Open</strong> in ImageJ to load files<br><em style="opacity: 0.7; font-size: 0.85em;">Click to change folder</em>`;
        }

        console.log('Native directory loaded:', this.directoryHandle.name);
        console.log('Global nativeDirectoryHandle set:', window.nativeDirectoryHandle);
        return true;
      } else {
        alert('File System Access API is not supported in this browser. Please use Chrome 86+ or Edge 86+.');
        return false;
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading directory:', err);
        alert('Error loading directory: ' + err.message);
      }
      return false;
    }
  }

  async getFileHandle(path) {
    if (!this.directoryHandle) return null;
    
    try {
      const pathParts = path.split('/').filter(part => part.length > 0);
      let currentHandle = this.directoryHandle;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
      }
      
      const fileName = pathParts[pathParts.length - 1];
      return await currentHandle.getFileHandle(fileName);
    } catch (err) {
      return null;
    }
  }

  async createFileHandle(path) {
    if (!this.directoryHandle) return null;
    
    try {
      const pathParts = path.split('/').filter(part => part.length > 0);
      let currentHandle = this.directoryHandle;
      
      // Create directories if they don't exist
      for (let i = 0; i < pathParts.length - 1; i++) {
        try {
          currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
        } catch {
          currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
        }
      }
      
      const fileName = pathParts[pathParts.length - 1];
      return await currentHandle.getFileHandle(fileName, { create: true });
    } catch (err) {
      console.error('Error creating file:', path, err);
      return null;
    }
  }

  async listDirectory(path) {
    if (!this.directoryHandle) return [];
    
    try {
      const pathParts = path.split('/').filter(part => part.length > 0);
      let currentHandle = this.directoryHandle;
      
      for (const part of pathParts) {
        currentHandle = await currentHandle.getDirectoryHandle(part);
      }
      
      const entries = [];
      for await (const [name, handle] of currentHandle.entries()) {
        entries.push(name);
      }
      return entries;
    } catch (err) {
      throw err;  // Re-throw the error instead of returning empty array
    }
  }
}

// Custom read function for native files (also used for local FS)
function nativeFileReadAsync(fileData, fileOffset, buf, off, len, flags, cb) {
    if (fileOffset >= fileData.length) {
        return cb(0);
    }

    if (fileOffset + len > fileData.length) {
        len = fileData.length - fileOffset;
    }

    if (len <= 0) {
        return cb(0);
    }

    // Use the direct data if available
    if (fileData.data) {
        for (let i = 0; i < len; i++) {
            buf[off + i] = fileData.data[fileOffset + i];
        }
        return cb(len);
    }

    // Fall back to chunk-based reading
    const chunkSize = 1024 * 1024;
    let bytesRead = 0;

    while (bytesRead < len) {
        const currentOffset = fileOffset + bytesRead;
        const chunkIndex = Math.floor(currentOffset / chunkSize);
        const chunkOffset = currentOffset % chunkSize;

        if (chunkIndex >= fileData.chunks.length) {
            break;
        }

        const chunk = fileData.chunks[chunkIndex];
        if (!chunk) {
            break;
        }

        const bytesToRead = Math.min(len - bytesRead, chunkSize - chunkOffset);
        for (let i = 0; i < bytesToRead; i++) {
            buf[off + bytesRead + i] = chunk[chunkOffset + i];
        }

        bytesRead += bytesToRead;
    }

    return cb(bytesRead);
}

// Streaming read function for local files (drag-and-drop)
// This reads from the File object on-demand without loading entire file into memory
function localFileReadAsync(fileData, fileOffset, buf, off, len, flags, cb) {
    if (fileOffset >= fileData.length) {
        return cb(0);
    }

    if (fileOffset + len > fileData.length) {
        len = fileData.length - fileOffset;
    }

    if (len <= 0) {
        return cb(0);
    }

    // Read the requested slice from the File object
    const file = fileData.localFile;
    if (!file) {
        console.error('No localFile reference in fileData');
        return cb(0);
    }

    // Use File.slice() to read only the requested portion
    const blob = file.slice(fileOffset, fileOffset + len);

    blob.arrayBuffer().then(arrayBuffer => {
        const data = new Uint8Array(arrayBuffer);
        for (let i = 0; i < data.length; i++) {
            buf[off + i] = data[i];
        }
        cb(data.length);
    }).catch(err => {
        console.error('Error reading file slice:', err);
        cb(0);
    });
}

// Create and apply all patches to CheerpOS
function createNativeFileSystemPatches() {
    // Store original functions
    const originalIdbStatAsync = IdbOps.statAsync;
    const originalIdbListAsync = IdbOps.listAsync;
    const originalIdbMakeFileData = IdbOps.makeFileData;
    const originalIdbCommitFileData = IdbInodeOps.close;

    // Patch IndexedDB folder operations to use native file system
    function patchedIdbStatAsync(mp, path, fileRef, cb) {
        if (window.nativeDirectoryHandle && (path.startsWith('/') || path === '')) {
            // Map paths to the root of the mounted directory
            let nativePath;
            if (path === '' || path === '/' || path === '/files' || path === '/files/') {
                nativePath = '';  // Root of mounted directory
            } else if (path.startsWith('/files/')) {
                nativePath = path.substring('/files/'.length);  // Remove /files/ prefix
            } else if (path.startsWith('/') && !path.startsWith('/.') && !path.includes('C:\\')) {
                // Handle other root-level paths that might be user files
                nativePath = path.substring(1);  // Remove leading slash
            } else {
                // For system paths like /.java or Windows paths, fall back to original implementation
                return originalIdbStatAsync.call(this, mp, path, fileRef, cb);
            }
            
            // Handle root directory case (mounted folder root)
            if (nativePath === '') {
                fileRef.inodeId = Math.floor(Math.random() * 1000000);
                fileRef.uid = 0;
                fileRef.gid = 0;
                fileRef.permType = CheerpJFileData.S_IFDIR | 0o777;
                fileRef.lastModified = Math.floor(Date.now() / 1000);
                return cb();
            }
            
            // First try to get the file
            window.nativeFS.getFileHandle(nativePath).then(async (handle) => {
                if (handle) {
                    const file = await handle.getFile();
                    fileRef.inodeId = Math.floor(Math.random() * 1000000);
                    fileRef.uid = 0;
                    fileRef.gid = 0;
                    fileRef.permType = CheerpJFileData.S_IFREG | 0o666;
                    fileRef.fileLength = file.size;
                    fileRef.lastModified = Math.floor(file.lastModified / 1000);
                    cb();
                } else {
                    // This shouldn't happen, but if it does, treat as not found
                    fileRef.permType = 0;
                    cb();
                }
            }).catch(async (err) => {
                // File doesn't exist, try as directory
                try {
                    const entries = await window.nativeFS.listDirectory(nativePath);
                    fileRef.inodeId = Math.floor(Math.random() * 1000000);
                    fileRef.uid = 0;
                    fileRef.gid = 0;
                    fileRef.permType = CheerpJFileData.S_IFDIR | 0o777;
                    fileRef.lastModified = Math.floor(Date.now() / 1000);
                    cb();
                } catch (dirErr) {
                    // Neither file nor directory exists
                    fileRef.permType = 0;  // Indicate that the file/directory doesn't exist
                    cb();
                }
            });
            return;
        }
        
        // Fall back to original implementation
        return originalIdbStatAsync.call(this, mp, path, fileRef, cb);
    }

    function patchedIdbListAsync(mp, path, fileRef, cb) {
        if (window.nativeDirectoryHandle && (path.startsWith('/') || path === '')) {
            // Map paths to the root of the mounted directory
            let nativePath;
            if (path === '' || path === '/' || path === '/files' || path === '/files/') {
                nativePath = '';  // Root of mounted directory
            } else if (path.startsWith('/files/')) {
                nativePath = path.substring('/files/'.length);  // Remove /files/ prefix
            } else if (path.startsWith('/') && !path.startsWith('/.') && !path.includes('C:\\')) {
                // Handle other root-level paths that might be user files
                nativePath = path.substring(1);  // Remove leading slash
            } else {
                // For system paths like /.java or Windows paths, fall back to original implementation
                return originalIdbListAsync.call(this, mp, path, fileRef, cb);
            }
            
            window.nativeFS.listDirectory(nativePath).then((entries) => {
                for (const entry of entries) {
                    fileRef.push(entry);
                }
                cb();
            }).catch((err) => {
                cb();
            });
            return;
        }
        
        // Fall back to original implementation
        return originalIdbListAsync.call(this, mp, path, fileRef, cb);
    }

    function patchedIdbMakeFileData(mp, path, mode, uid, gid, cb) {
        if (window.nativeDirectoryHandle && (path.startsWith('/') || path === '')) {
            // Map paths to the root of the mounted directory
            let nativePath;
            if (path === '' || path === '/' || path === '/files' || path === '/files/') {
                nativePath = '';  // Root of mounted directory
            } else if (path.startsWith('/files/')) {
                nativePath = path.substring('/files/'.length);  // Remove /files/ prefix
            } else if (path.startsWith('/') && !path.startsWith('/.') && !path.includes('C:\\')) {
                // Handle other root-level paths that might be user files
                nativePath = path.substring(1);  // Remove leading slash
            } else {
                // For system paths like /.java or Windows paths, fall back to original implementation
                return originalIdbMakeFileData.call(this, mp, path, mode, uid, gid, cb);
            }
            
            // Handle root directory case (mounted folder root)
            if (nativePath === '') {
                const fileData = new CheerpJFileData(
                    mp, 
                    path, 
                    0, 
                    Math.floor(Math.random() * 1000000), 
                    CheerpJFileData.S_IFDIR | 0o777, 
                    Math.floor(Date.now() / 1000), 
                    uid, 
                    gid
                );
                fileData.mount = mp.inodeOps;
                return cb(fileData);
            }
            
            if (mode === "r") {
                window.nativeFS.getFileHandle(nativePath).then(async (handle) => {
                    if (handle) {
                        const file = await handle.getFile();
                        const arrayBuffer = await file.arrayBuffer();
                        const data = new Uint8Array(arrayBuffer);
                        
                        const fileData = new CheerpJFileData(
                            mp, 
                            path, 
                            data.length, 
                            Math.floor(Math.random() * 1000000), 
                            CheerpJFileData.S_IFREG | 0o666, 
                            Math.floor(file.lastModified / 1000), 
                            uid, 
                            gid
                        );
                        
                        // Set up the file data properly for ImageJ
                        fileData.data = data;
                        
                        // Also set up chunks for compatibility with CheerpJ's chunked reading
                        const chunkSize = 1024 * 1024; // 1MB chunks
                        const chunks = [];
                        let offset = 0;
                        
                        while (offset < data.length) {
                            const chunkLength = Math.min(chunkSize, data.length - offset);
                            const chunk = new Uint8Array(chunkSize);
                            chunk.set(data.subarray(offset, offset + chunkLength));
                            chunks.push(chunk);
                            offset += chunkLength;
                        }
                        
                        fileData.chunks = chunks;
                        
                        // Create custom inode operations for native files
                        fileData.mount = {
                            readAsync: nativeFileReadAsync,
                            writeAsync: mp.inodeOps.writeAsync,
                            close: mp.inodeOps.close
                        };
                        
                        cb(fileData);
                    } else {
                        cb(null);
                    }
                }).catch((err) => {
                    cb(null);
                });
                return;
            } else if (mode === "w" || mode === "r+") {
                // Create or open for writing
                window.nativeFS.createFileHandle(nativePath).then(async (handle) => {
                    if (handle) {
                        console.log('Created file for writing:', nativePath);
                        const fileData = new CheerpJFileData(
                            mp, 
                            path, 
                            0, 
                            Math.floor(Math.random() * 1000000), 
                            CheerpJFileData.S_IFREG | 0o666, 
                            Math.floor(Date.now() / 1000), 
                            uid, 
                            gid
                        );
                        fileData.mount = mp.inodeOps;
                        fileData.dirty = 1;
                        fileData.chunks = [];
                        fileData.nativeHandle = handle;
                        cb(fileData);
                    } else {
                        console.error('Failed to create file handle:', nativePath);
                        cb(null);
                    }
                }).catch((err) => {
                    console.error('Error creating file handle:', nativePath, err.message);
                    cb(null);
                });
                return;
            }
        }
        
        // Fall back to original implementation
        return originalIdbMakeFileData.call(this, mp, path, mode, uid, gid, cb);
    }

    function patchedIdbCommitFileData(fileData, cb) {
        if (fileData.nativeHandle && fileData.dirty) {
            // Write to native file system
            const writeToNativeFile = async () => {
                try {
                    const writable = await fileData.nativeHandle.createWritable();

                    // Reconstruct file content from chunks
                    const chunkSize = 1024 * 1024;

                    // Calculate actual file size based on chunks
                    let totalSize = 0;
                    for (let i = 0; i < fileData.chunks.length; i++) {
                        if (fileData.chunks[i]) {
                            totalSize += chunkSize;
                        }
                    }

                    // Use either the calculated size or fileData.length, whichever is larger
                    const fileSize = Math.max(totalSize, fileData.length);

                    if (fileSize === 0 && fileData.chunks.length === 0) {
                        // Empty file, just close it
                        await writable.write(new Uint8Array(0));
                        await writable.close();
                        console.log('Wrote empty file to native file system');
                        fileData.dirty = 0;
                        cb();
                        return;
                    }

                    // Write chunks directly
                    for (let i = 0; i < fileData.chunks.length; i++) {
                        const chunk = fileData.chunks[i];
                        if (chunk) {
                            // For the last chunk, only write the actual data length
                            if (i === fileData.chunks.length - 1 && fileData.length > 0) {
                                const lastChunkSize = fileData.length - (i * chunkSize);
                                if (lastChunkSize > 0 && lastChunkSize < chunkSize) {
                                    await writable.write(chunk.subarray(0, lastChunkSize));
                                } else {
                                    await writable.write(chunk);
                                }
                            } else {
                                await writable.write(chunk);
                            }
                        }
                    }

                    await writable.close();
                    console.log('Successfully wrote file to native file system:', fileData.path, 'size:', fileData.length);

                    fileData.dirty = 0;
                    cb();
                } catch (err) {
                    console.error('Error writing to native file:', fileData.path, err);
                    cb();
                }
            };

            writeToNativeFile();
            return;
        }

        // Fall back to original implementation
        return originalIdbCommitFileData.call(this, fileData, cb);
    }

    // Apply patches
    IdbOps.statAsync = patchedIdbStatAsync;
    IdbOps.listAsync = patchedIdbListAsync;
    IdbOps.makeFileData = patchedIdbMakeFileData;
    IdbInodeOps.close = patchedIdbCommitFileData;

    // Expose to global window object for CheerpJ runtime access
    window.IdbOps = IdbOps;
    window.IdbInodeOps = IdbInodeOps;
    window.DirectDownloader = DirectDownloader;
    window.nativeDirectoryHandle = nativeDirectoryHandle;
    window.nativeFS = window.nativeFS || new NativeFileSystemHandler();
    window.CheerpJFileData = CheerpJFileData;
    
    // Also expose the patched functions directly
    window.patchedIdbStatAsync = patchedIdbStatAsync;
    window.patchedIdbListAsync = patchedIdbListAsync;
    window.patchedIdbMakeFileData = patchedIdbMakeFileData;
    window.patchedIdbCommitFileData = patchedIdbCommitFileData;
}

// Local file system operations - Define these first before CheerpJLocalFolder
function localStatAsync(mp, path, fileRef, cb) {
    // Remove the mount point prefix to get the local path
    const localPath = path === '' || path === '/' ? '' : path.substring(1);

    // Handle root directory
    if (localPath === '') {
        fileRef.inodeId = Math.floor(Math.random() * 1000000);
        fileRef.uid = 0;
        fileRef.gid = 0;
        fileRef.permType = CheerpJFileData.S_IFDIR | 0o777;
        fileRef.lastModified = Math.floor(Date.now() / 1000);
        return cb();
    }

    // Check if it's a file
    const file = window.localFS.getFile(localPath);
    if (file) {
        fileRef.inodeId = Math.floor(Math.random() * 1000000);
        fileRef.uid = 0;
        fileRef.gid = 0;
        fileRef.permType = CheerpJFileData.S_IFREG | 0o666;
        fileRef.fileLength = file.size;
        fileRef.lastModified = Math.floor(file.lastModified / 1000);
        return cb();
    }

    // Check if it's a directory
    if (window.localFS.isDirectory(localPath)) {
        fileRef.inodeId = Math.floor(Math.random() * 1000000);
        fileRef.uid = 0;
        fileRef.gid = 0;
        fileRef.permType = CheerpJFileData.S_IFDIR | 0o777;
        fileRef.lastModified = Math.floor(Date.now() / 1000);
        return cb();
    }

    // File/directory doesn't exist
    fileRef.permType = 0;
    return cb();
}

function localListAsync(mp, path, fileRef, cb) {
    const localPath = path === '' || path === '/' ? '' : path.substring(1);

    try {
        const entries = window.localFS.listDirectory(localPath);
        for (const entry of entries) {
            fileRef.push(entry);
        }
        return cb();
    } catch (err) {
        console.error('Error listing local directory:', localPath, err);
        return cb();
    }
}

function localMakeFileData(mp, path, mode, uid, gid, cb) {
    const localPath = path === '' || path === '/' ? '' : path.substring(1);

    // Handle root directory
    if (localPath === '') {
        const fileData = new CheerpJFileData(
            mp,
            path,
            0,
            Math.floor(Math.random() * 1000000),
            CheerpJFileData.S_IFDIR | 0o777,
            Math.floor(Date.now() / 1000),
            uid,
            gid
        );
        fileData.mount = mp.inodeOps;
        return cb(fileData);
    }

    if (mode === "r") {
        // Read mode - get file from local FS
        const file = window.localFS.getFile(localPath);
        if (!file) {
            return cb(null);
        }

        // Create file data WITHOUT loading the entire file into memory
        // We'll use streaming reads via localFileReadAsync
        const fileData = new CheerpJFileData(
            mp,
            path,
            file.size,  // Just store the size, not the data
            Math.floor(Math.random() * 1000000),
            CheerpJFileData.S_IFREG | 0o666,
            Math.floor(file.lastModified / 1000),
            uid,
            gid
        );

        // Store reference to the File object for streaming reads
        fileData.localFile = file;

        // Use streaming read function that reads chunks on-demand
        fileData.mount = mp.inodeOps;

        return cb(fileData);
    } else if (mode === "w" || mode === "r+") {
        // Write mode not supported for local FS (read-only)
        console.warn('Write mode not supported for /local (drag-and-drop files are read-only)');
        return cb(null);
    }

    return cb(null);
}

// Local file system operations
var LocalOps = {
    statAsync: localStatAsync,
    listAsync: localListAsync,
    makeFileData: localMakeFileData,
    createDirAsync: null,
    renameAsync: null,
    linkAsync: null,
    unlinkAsync: null
};

var LocalInodeOps = {
    readAsync: localFileReadAsync,
    writeAsync: null,
    close: null
};

// Custom CheerpJFolder for local file system (drag-and-drop)
// We create a folder object that matches the CheerpJFolder structure
function CheerpJLocalFolder(mp) {
    this.mountPoint = mp;
    this.isSplit = false;
    this.mountOps = LocalOps;
    this.inodeOps = LocalInodeOps;
    this.devId = 100; // Arbitrary device ID
    this.fileCache = {};
    this.cacheThreads = {};
    this.inodeCache = [];
}

// Add the cache methods that CheerpJFolder has
CheerpJLocalFolder.prototype.getCached = function(fileName) {
    var c = this.fileCache;
    if(!c.hasOwnProperty(fileName))
        return null;
    var inodeId = c[fileName];
    var ret = this.inodeCache[inodeId];
    return ret;
};

CheerpJLocalFolder.prototype.setCached = function(fileName, fileData) {
    var c = this.fileCache;
    var inodeId = fileData.inodeId;
    c[fileName] = inodeId;
    this.inodeCache[inodeId] = fileData;
};

CheerpJLocalFolder.prototype.clearCached = function(fileName) {
    var c = this.fileCache;
    if(c.hasOwnProperty(fileName)) {
        delete c[fileName];
    }
};

CheerpJLocalFolder.prototype.decRefCached = function(fileName, fileData) {
    // No-op for local FS
};

// Create and apply patches for local file system (drag-and-drop)
// This registers /local as a proper mount point
function createLocalFileSystemPatches() {
    // Add /local mount to the global cheerpjFSMounts array
    // Insert before the root folder (which is always last)
    const localFolder = new CheerpJLocalFolder("/local/");

    // Find the index of the root folder
    const rootIndex = cheerpjFSMounts.findIndex(m => m.mountPoint === "/");

    if (rootIndex !== -1) {
        // Insert before root
        cheerpjFSMounts.splice(rootIndex, 0, localFolder);
    } else {
        // Root not found, just push (shouldn't happen)
        cheerpjFSMounts.push(localFolder);
    }

    console.log('Local file system mount registered at /local/');
}

// Initialize the handlers
const nativeFS = new NativeFileSystemHandler();
const localFS = new LocalFileSystemHandler();

// Expose globally for access from other scripts
window.nativeFS = nativeFS;
window.localFS = localFS;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NativeFileSystemHandler,
        LocalFileSystemHandler,
        createNativeFileSystemPatches,
        createLocalFileSystemPatches,
        nativeFS,
        localFS
    };
} 