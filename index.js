const baseUrl = location.pathname === "/" ? "/" : location.pathname;


// function webListAsync(mp, path, fileRef, p)
// {
// 	var url = mp.mapPath(mp, path+"/index.list");
// 	var dl = new mp.downloader(url, "GET", "text");
// 	dl.fileRef = fileRef;
// 	dl.thread = currentThread;
// 	dl.onload = function(dlData) {
// 		if(dlData.response)
// 		{
// 			var files = dlData.response.split("\n");
// 			for(var i=0;i<files.length;i++)
// 			{
// 				if(files[i].length)
// 					dlData.fileRef.push(files[i]);
// 			}
// 		}
// 		dlData.thread.state = "READY";
// 		cheerpjSchedule();
// 	};
// 	dl.send();
// 	buildContinuations(p,false);
// 	currentThread.state = "BLOCKED_ON_STAT";
// 	throw "CheerpJContinue";
// }

function CheerpJChromeFSFolder(mp, directoryHandle) {
    CheerpJFolder.call(this, mp);
    this.mountOps = ChromeFSOps;
    this.inodeOps = ChromeFSInodeOps;
    // Initialize the directory handle
    this.directoryHandle = directoryHandle;
}

async function listPath(mp, path, fileRef) {
    const dirHandle = path === "" ? mp.directoryHandle: await mp.directoryHandle.getDirectoryHandle(path);
    for await (const entry of dirHandle.keys()) {
        fileRef.push(entry);
    }
}

var ChromeFSOps = {
    statAsync: function(mp, path, fileRef, p) {
        if (path === "") {
            // Special handling for the root directory
            fileRef.inodeId = 1; // Root inode ID
            fileRef.permType = CheerpJFileData.S_IFDIR | 365; // Directory with read and execute permissions
            fileRef.fileLength = 0; // No size for directories
        } else {
            const thread = currentThread;
            // remove starting slash
            if(path.startsWith("/")) path = path.substring(1);
            // First, try to get it as a file
            mp.directoryHandle.getFileHandle(path).then(fileHandle => {
                fileHandle.getFile().then(file => {
                    fileRef.fileLength = file.size;
                    fileRef.permType = CheerpJFileData.S_IFREG | 292; // Regular file with permissions
                    fileRef.inodeId = 1; // For simplicity, using 1 as inode ID for files
                    thread.state = "READY";
                    cheerpjSchedule();
                });
            }).catch(() => {
                // If it fails, try to get it as a directory
                mp.directoryHandle.getDirectoryHandle(path).then(() => {
                    fileRef.fileLength = 0;
                    fileRef.permType = CheerpJFileData.S_IFDIR | 292; // Directory with permissions
                    fileRef.inodeId = 2; // For simplicity, using 2 as inode ID for directories
                    thread.state = "READY";
                    cheerpjSchedule();
                }).catch(e => {
                    console.error("Error getting path:", e);
                    // Handle error, e.g., path not found
                });
            });
            buildContinuations(p,false);
            currentThread.state = "BLOCKED_ON_STAT";
            throw "CheerpJContinue";
        }
    
    },

    listAsync: async function(mp, path, fileRef, p) {
        const thread = currentThread;
        listPath(mp, path, fileRef).then(() => {
            thread.state = "READY";
            cheerpjSchedule();
        })
        buildContinuations(p,false);
        currentThread.state = "BLOCKED_ON_STAT";
        throw "CheerpJContinue";
    },

    // Other operations like makeFileData, loadAsync, etc. can be implemented similarly
};

var ChromeFSInodeOps = {
    // readAsync: async function(fileData, fileOffset, buf, off, len, flags, p) {
    //     try {
    //         const fileHandle = await fileData.parent.directoryHandle.getFileHandle(fileData.path);
    //         const file = await fileHandle.getFile();
    //         const slice = file.slice(fileOffset, fileOffset + len);
    //         const arrayBuffer = await slice.arrayBuffer();
    //         const data = new Uint8Array(arrayBuffer);
    //         buf.set(data, off);
    //         return data.length;
    //     } catch (e) {
    //         console.error("Read error:", e);
    //         // Handle error, e.g., file read error
    //     }
    // },
    readAsync: function(fileData, fileOffset, buf, off, len, flags, p) {
        fileData.parent.directoryHandle.getFileHandle(fileData.path).then(fileHandle => {
            fileHandle.getFile().then(file => {
                const slice = file.slice(fileOffset, fileOffset + len);
                slice.arrayBuffer().then(arrayBuffer => {
                    const data = new Uint8Array(arrayBuffer);
                    buf.set(data, off);
                    currentThread.state = "READY";
                    cheerpjSchedule();
                });
            });
        }
        );
        buildContinuations(p,false);
        currentThread.state = "BLOCKED_ON_FILE";
        throw "CheerpJContinue";
    },

    writeAsync: async function(fileData, fileOffset, buf, off, len, flags, p) {
        // Implementation for write operation
        // Note: File System Access API allows writing, but this requires additional handling
    },

    ioctlAsync: async function() {
        return -22;
    },

    // Other inode operations like commitFileData, readPoll, etc. can be implemented similarly
};

async function startImageJ(){
    await cheerpjInit({
        clipboardMode: "java", // "permission" | "system" | "java"
        javaProperties: [
        "os.name=Linux",
        "user.dir=/files",
        `plugins.dir=/app${baseUrl}lib/ImageJ/plugins`
        ],
        fetch(){
            debugger
            return fetch(...arguments);
        }
    });
    CheerpJChromeFSFolder.prototype = Object.create(CheerpJFolder.prototype);
    cheerpjFSMounts.unshift(new CheerpJChromeFSFolder("/fs/", directoryHandle));

    class CustomXMLHttpRequest extends XMLHttpRequest {
        send() {
            const path = this._url.startsWith("http") ? new URL(this._url).pathname.toLowerCase() : this._url.toLowerCase();
            if (path.startsWith(`${baseUrl}lib/imagej`) && (path.includes("cz.cuni.lf1.lge.thunderstorm") || path.endsWith('.jar.js') || path.endsWith('.class'))) {
                console.log("skipping", path)
                // Emulate a 404 error
                setTimeout(() => {
                    this.onload({
                        target: {
                            status: 404,
                            statusText: 'Not Found',
                            responseType: this.responseType,
                            response: null,
                            downloader: this.downloader, // Ensure downloader is set
                            responseURL: this._url
                        }
                    });
                }, 0);
            } else {
                // Call the original send method
                super.send();
            }
        }
    
        open(method, url) {
            this._url = url;  // Save the URL to check it in the send method
            super.open(method, url);
        }
    }
    

    function ddlSend()
    {
        if(this.url.startsWith(`${baseUrl}lib/ImageJ/samples/`)){
            this.url = this.url.replace(`${baseUrl}lib/ImageJ/samples/`, 'https://imagej.net/images/');
        }
        var xhr = new CustomXMLHttpRequest();
        xhr.downloader = this;
        xhr.open(this.method, this.url);
        xhr.responseType = this.responseType;
        xhr.onload = ddlOnLoad;
        xhr.onerror = ddlOnError;
        xhr.send();
    }
    DirectDownloader.prototype.send = ddlSend;
    cheerpjCreateDisplay(-1, -1, document.getElementById("container"));
    await cheerpjRunJar(`/app${baseUrl}lib/ImageJ/ij.jar`);
    // await cheerpjRunMain("net.imagej.Main", `/app${baseUrl}lib/ImageJ/imagej2-cheerpj-0-SNAPSHOT-all.jar`);
}

let directoryHandle = null;

window.openFolder = async function openFolder(){
    directoryHandle = await window.showDirectoryPicker()
    localStorage.setItem("fsDirectoryHandle", directoryHandle)
    await startImageJ();
}