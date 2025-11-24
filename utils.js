// Native File System Integration Utilities for ImageJ.JS
// This file contains all the patches and utilities for native file system support

// Global variable to store the directory handle
let nativeDirectoryHandle = null;

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
        
        // Update UI
        const statusEl = document.getElementById('folderStatus');
        const folderNameEl = document.getElementById('folderName');
        const loadBtnEl = document.getElementById('loadFolderBtn');
        
        folderNameEl.textContent = this.directoryHandle.name;
        statusEl.classList.remove('hidden');
        loadBtnEl.style.display = 'none';
        
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

// Custom read function for native files
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

// Initialize the native file system handler
const nativeFS = new NativeFileSystemHandler();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NativeFileSystemHandler,
        createNativeFileSystemPatches,
        nativeFS
    };
} 