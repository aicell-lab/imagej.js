// Hypha ImageJ Service - Exposes ImageJ macro execution to Hypha server
// Based on: https://github.com/oeway/web-python-kernel

let hyphaServer = null;
let connectedService = null;

// Silent macro execution function that suppresses error dialogs
// Uses the patched Interpreter.runMacroSilent() method
async function runMacroSilent(macro) {
    try {
        // Use the patched runMacroSilent method from Interpreter class
        // This method is added via our imagej-patch/Interpreter.java.patch
        const Interpreter = await window.lib.ij.macro.Interpreter;
        const resultArray = await Interpreter.runMacroSilent(macro);

        // resultArray[0] = "success" or "error"
        // resultArray[1] = result or error message
        const status = await resultArray[0];
        const message = await resultArray[1];

        return {
            status: status,
            result: message || ''
        };
    } catch (error) {
        // Fallback: catch JavaScript-level errors
        const errorMessage = error.message || error.toString();
        console.error('Macro error (silent):', errorMessage);
        return {
            status: 'error',
            result: errorMessage
        };
    }
}

// JSON Schema definitions for service methods
const schemas = {
    runMacro: {
        name: "runMacro",
        description: `Execute an ImageJ macro script.

⚠️ IMPORTANT ENVIRONMENT INFORMATION:
This ImageJ instance runs in a BROWSER using CheerpJ - a technology that compiles Java applications
to WebAssembly/JavaScript. This is NOT a traditional server-side ImageJ installation.
ImageJ macros use a simple scripting language (similar to JavaScript but simpler).
Common commands: run(), open(), print(), getWidth(), getHeight(), setThreshold()
Full macro reference: https://imagej.net/ij/developer/macro/functions.html`,
        parameters: {
            type: "object",
            properties: {
                macro: {
                    type: "string",
                    description: "The ImageJ macro script to execute"
                },
                returnLog: {
                    type: "boolean",
                    description: "Whether to return the ImageJ log output",
                    default: false
                }
            },
            required: ["macro"]
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether the macro executed successfully"
                },
                error: {
                    type: "string",
                    description: "Error message if execution failed"
                },
                log: {
                    type: "string",
                    description: "ImageJ log output (if returnLog=true)"
                }
            }
        }
    },

    getStatus: {
        name: "getStatus",
        description: `Get the current status of ImageJ.

ENVIRONMENT: This ImageJ runs in a browser via CheerpJ (Java compiled to WebAssembly/JavaScript).
The 'ready' status indicates whether the Java-to-JavaScript conversion is complete and ImageJ is initialized.`,
        parameters: {
            type: "object",
            properties: {},
            required: []
        },
        returns: {
            type: "object",
            properties: {
                ready: {
                    type: "boolean",
                    description: "Whether ImageJ is ready to execute macros (Java classes loaded and initialized)"
                },
                version: {
                    type: "string",
                    description: "ImageJ version (running via CheerpJ 4.2 in browser)"
                }
            }
        }
    },

    getLogs: {
        name: "getLogs",
        description: "Get the ImageJ log window content",
        parameters: {
            type: "object",
            properties: {
                clear: {
                    type: "boolean",
                    description: "Whether to clear the log after retrieving",
                    default: false
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                logs: {
                    type: "string",
                    description: "The complete log content"
                }
            }
        }
    },

    takeScreenshot: {
        name: "takeScreenshot",
        description: "Take a screenshot of the current ImageJ window or active image",
        parameters: {
            type: "object",
            properties: {
                target: {
                    type: "string",
                    enum: ["active-image", "imagej-window"],
                    description: "What to capture: 'active-image' for current image, 'imagej-window' for entire ImageJ window",
                    default: "active-image"
                },
                format: {
                    type: "string",
                    enum: ["png", "jpeg"],
                    description: "Image format",
                    default: "png"
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                image: {
                    type: "string",
                    description: "Base64 encoded image data"
                },
                width: {
                    type: "integer",
                    description: "Image width in pixels"
                },
                height: {
                    type: "integer",
                    description: "Image height in pixels"
                }
            }
        }
    },

    openImage: {
        name: "openImage",
        description: "Open an image file in ImageJ",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to the image file (can be /local/, /files/, or /app/ paths)"
                },
                url: {
                    type: "string",
                    description: "URL to download and open the image from"
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether the image was opened successfully"
                },
                title: {
                    type: "string",
                    description: "Title of the opened image"
                }
            }
        }
    },

    getImageInfo: {
        name: "getImageInfo",
        description: "Get information about the currently active image",
        parameters: {
            type: "object",
            properties: {},
            required: []
        },
        returns: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Image title"
                },
                width: {
                    type: "integer",
                    description: "Image width in pixels"
                },
                height: {
                    type: "integer",
                    description: "Image height in pixels"
                },
                type: {
                    type: "string",
                    description: "Image type (e.g., '8-bit', 'RGB', '16-bit')"
                },
                slices: {
                    type: "integer",
                    description: "Number of slices (for stacks)"
                }
            }
        }
    },

    listImages: {
        name: "listImages",
        description: "List all currently open images",
        parameters: {
            type: "object",
            properties: {},
            required: []
        },
        returns: {
            type: "object",
            properties: {
                images: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            title: { type: "string" },
                            width: { type: "integer" },
                            height: { type: "integer" }
                        }
                    },
                    description: "List of open images"
                }
            }
        }
    },

    closeImage: {
        name: "closeImage",
        description: "Close an image by title",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Title of the image to close (or 'all' to close all images)"
                }
            },
            required: ["title"]
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether the image was closed successfully"
                }
            }
        }
    },

    listFiles: {
        name: "listFiles",
        description: "List files in the virtual file system",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Directory path to list (e.g., '/files/', '/local/'). Defaults to '/files/'",
                    default: "/files/"
                },
                pattern: {
                    type: "string",
                    description: "Optional file pattern/extension to filter (e.g., '*.tif', '*.jpg')"
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                files: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            path: { type: "string" },
                            isDirectory: { type: "boolean" }
                        }
                    },
                    description: "List of files and directories"
                }
            }
        }
    },

    getTextFromTable: {
        name: "getTextFromTable",
        description: "Get text content from an ImageJ table window",
        parameters: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Title of the table window (e.g., 'Results', 'Summary')"
                }
            },
            required: ["title"]
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether the table was found and read successfully"
                },
                text: {
                    type: "string",
                    description: "Tab-delimited text content of the table"
                },
                error: {
                    type: "string",
                    description: "Error message if reading failed"
                }
            }
        }
    },

    executeJavaScript: {
        name: "executeJavaScript",
        description: `Execute arbitrary JavaScript code in the ImageJ.js environment with full access to ImageJ classes.

⚠️⚠️⚠️ CRITICAL ENVIRONMENT INFORMATION ⚠️⚠️⚠️

THIS IS NOT A NORMAL IMAGEJ INSTALLATION!

ImageJ is running in a BROWSER using CheerpJ technology:
- CheerpJ compiles Java bytecode (.jar files) to WebAssembly and JavaScript
- The ENTIRE ImageJ application (a Java desktop app) is converted to run in the browser
- JavaScript can directly call Java methods and access Java objects
- Java objects are wrapped as JavaScript Promises (hence the 'await' requirement)

This unique setup means:
✓ You can use JavaScript to control Java objects
✓ All ImageJ classes/methods are accessible from JavaScript
✓ Java method calls return Promises that must be awaited
✓ No server required - everything runs client-side in the browser

IMPORTANT SETUP INFORMATION:
- All ImageJ Java classes are available through the 'lib' object
- Main entry points: window.IJ (or window.IJClass), window.lib
- This is a BROWSER environment, not a Node.js or server environment

AVAILABLE OBJECTS (Java classes accessible from JavaScript):

1. IJ - The main ImageJ utility class (Java class: ij.IJ)
   - This is a Java object exposed to JavaScript
   - Example: await IJ.log("message")  // Calls Java method IJ.log()
   - Example: await IJ.runMacro("print('hello');")  // Calls Java method IJ.runMacro()
   - Example: await IJ.getImage() // Returns Java ImagePlus object

2. lib - The root object containing ALL ImageJ Java classes
   - Think of 'lib' as the Java class loader in JavaScript
   - Structure mirrors Java package structure: lib.ij.ImagePlus = Java class ij.ImagePlus
   - Example: const Interpreter = await lib.ij.macro.Interpreter  // Gets Java class
   - Example: const ImagePlus = await lib.ij.ImagePlus  // Gets Java class
   - Example: const IJ = await lib.ij.IJ  // Gets Java class

3. ImagePlus objects - Java objects representing images
   - These are Java objects (ij.ImagePlus instances) wrapped for JavaScript
   - Access via: await IJ.getImage()
   - Methods: await imp.getProcessor(), await imp.getTitle(), await imp.show(), await imp.close()
   - Remember: ALL methods need 'await' because they're Java methods!

CRITICAL NOTES ABOUT CHEERPJ ENVIRONMENT:
- ALL Java method calls MUST use 'await' because CheerpJ wraps them as Promises
- Java objects cannot be directly returned - extract primitive values first
- Return values are automatically serialized to JSON
- Non-serializable objects (Java objects) will cause errors
- You're writing JavaScript that calls Java methods - think of it as a JavaScript-Java bridge

EXAMPLE 1 - Get image dimensions (JavaScript calling Java methods):
// Get the IJ utility class (a Java singleton)
const IJ = window.IJClass || window.IJ;
// Call Java method: IJ.getImage() - returns Java ImagePlus object
const imp = await IJ.getImage();
// Call Java methods on ImagePlus object
const width = await imp.getWidth();   // Java: imp.getWidth()
const height = await imp.getHeight(); // Java: imp.getHeight()
// Return JavaScript object (primitives extracted from Java)
return { width, height };

EXAMPLE 2 - Use ImageJ class directly (accessing Java static class):
// Access Java class ij.Prefs through lib
const Prefs = await window.lib.ij.Prefs;
// Call static Java method: Prefs.getThreads()
const threads = await Prefs.getThreads();
return { threads };

EXAMPLE 3 - Run ImageJ macro from JavaScript:
const IJ = window.IJClass || window.IJ;
// Call Java method IJ.runMacro() with macro code string
const result = await IJ.runMacro('getWidth() + "x" + getHeight()');
return { dimensions: result };

EXAMPLE 4 - Access Interpreter class (our custom patched Java class):
// Get the Java Interpreter class
const Interpreter = await window.lib.ij.macro.Interpreter;
// Call our custom static method runMacroSilent() we added via patch
const resultArray = await Interpreter.runMacroSilent('print("test");');
// resultArray is a Java String[] array - extract values
const status = await resultArray[0];   // Java array access
const message = await resultArray[1];  // Java array access
return { status, message };

COMMON PATTERNS FOR JAVASCRIPT-JAVA INTERACTION:
- Always declare IJ: const IJ = window.IJClass || window.IJ;
- Check initialization: if (!IJ) throw new Error('ImageJ not ready');
- Extract values from Java objects: const value = await javaObject.getValue();
- Return primitives only (not Java objects): return { result: value };
- Access Java classes via lib: const MyClass = await window.lib.ij.package.MyClass;
- Call static Java methods: await MyClass.staticMethod();
- Call instance Java methods: await javaInstance.instanceMethod();
- Remember: You're writing JavaScript that controls a Java application!`,
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "JavaScript code to execute. The code runs in an async context, so 'await' is available. Must return a JSON-serializable value."
                }
            },
            required: ["code"]
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether the code executed successfully"
                },
                result: {
                    description: "The return value from the executed code (must be JSON-serializable)"
                },
                error: {
                    type: "string",
                    description: "Error message if execution failed"
                }
            }
        }
    }
};

// Get configuration from URL parameters
function getConfig() {
    const params = new URLSearchParams(window.location.search);
    return {
        server_url: params.get('server_url') || 'https://hypha.aicell.io',
        workspace: params.get('workspace') || null,
        token: params.get('token') || null,
        client_id: params.get('client_id') || 'imagej-client-' + Math.random().toString(36).substring(7),
        service_id: params.get('service_id') || 'imagej-service',
        visibility: params.get('visibility') || 'public'
    };
}

// Convert service URL to MCP URL format
function convertToMcpUrl(serviceUrl) {
    // Replace /services with /mcp and add /mcp at the end
    return serviceUrl.replace('/services/', '/mcp/') + '/mcp';
}

// Helper function to read a file from CheerpJ virtual file system via IndexedDB
async function readVirtualFile(path) {
    return new Promise((resolve, reject) => {
        try {
            // CheerpJ stores files in IndexedDB under the "cheerpjDB" database
            // Files in /files/ are stored with their path as the key
            const dbName = 'cheerpjDB';
            const storeName = 'files';

            // Remove leading slash if present
            const filePath = path.startsWith('/files/') ? path.substring(7) : path;

            const request = indexedDB.open(dbName);

            request.onerror = () => {
                reject(new Error(`Failed to open IndexedDB: ${request.error}`));
            };

            request.onsuccess = (event) => {
                const db = event.target.result;

                // Check if the object store exists
                if (!db.objectStoreNames.contains(storeName)) {
                    db.close();
                    reject(new Error(`Object store '${storeName}' not found`));
                    return;
                }

                const transaction = db.transaction([storeName], 'readonly');
                const objectStore = transaction.objectStore(storeName);
                const getRequest = objectStore.get(filePath);

                getRequest.onerror = () => {
                    db.close();
                    reject(new Error(`Failed to read file from IndexedDB: ${getRequest.error}`));
                };

                getRequest.onsuccess = () => {
                    db.close();
                    const fileData = getRequest.result;

                    if (!fileData) {
                        reject(new Error(`File not found: ${path}`));
                        return;
                    }

                    // The file data should be a Uint8Array or similar
                    resolve(fileData);
                };
            };
        } catch (error) {
            reject(error);
        }
    });
}

// Convert Uint8Array to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Update UI status
function updateStatus(status, text, serviceUrl = null) {
    const statusEl = document.getElementById('hyphaStatus');
    const statusTextEl = document.getElementById('hyphaStatusText');
    const statusDotEl = document.getElementById('hyphaStatusDot');
    const copyBtn = document.getElementById('copyMcpBtn');
    const connectBtn = document.getElementById('connectBtn');

    // Show status indicator when connecting or connected
    if (statusEl && statusTextEl && statusDotEl) {
        if (status === 'connecting') {
            statusEl.classList.remove('hidden');
            statusTextEl.textContent = 'Connecting...';
            statusDotEl.classList.remove('bg-green-400', 'bg-red-400');
            statusDotEl.classList.add('bg-yellow-400');
        } else if (status === 'connected') {
            statusEl.classList.remove('hidden');
            statusTextEl.textContent = '✓ Connected';
            statusDotEl.classList.remove('bg-yellow-400', 'bg-red-400');
            statusDotEl.classList.add('bg-green-400');

            // Hide status after 3 seconds and show hint
            setTimeout(() => {
                if (statusTextEl.textContent === '✓ Connected') {
                    statusTextEl.textContent = '💡 Click "Copy MCP URL" button';
                    setTimeout(() => {
                        statusEl.classList.add('hidden');
                    }, 5000);
                }
            }, 3000);
        } else if (status === 'error') {
            statusEl.classList.remove('hidden');
            statusTextEl.textContent = '✗ Connection failed';
            statusDotEl.classList.remove('bg-green-400', 'bg-yellow-400');
            statusDotEl.classList.add('bg-red-400');

            // Hide error after 5 seconds
            setTimeout(() => {
                statusEl.classList.add('hidden');
            }, 5000);
        } else {
            // Don't show "disconnected" status
            statusEl.classList.add('hidden');
        }
    }

    // Toggle between connect and copy MCP URL button
    if (copyBtn && connectBtn) {
        if (status === 'connected' && serviceUrl) {
            connectBtn.classList.add('hidden');
            copyBtn.classList.remove('hidden');

            // Convert to MCP URL and store
            const mcpUrl = convertToMcpUrl(serviceUrl);
            copyBtn.dataset.serviceUrl = mcpUrl;
        } else {
            connectBtn.classList.remove('hidden');
            copyBtn.classList.add('hidden');
        }
    }
}

// Connect to Hypha server and register service
async function connectToHypha() {
    try {
        updateStatus('connecting', 'Connecting...');

        const config = getConfig();

        // Load Hypha RPC client
        console.log('Loading Hypha RPC client...');
        const hyphaWebsocketClient = await import("https://cdn.jsdelivr.net/npm/hypha-rpc@0.20.79/dist/hypha-rpc-websocket.min.mjs");

        // Connect to server
        console.log('Connecting to Hypha server:', config.server_url);
        hyphaServer = await hyphaWebsocketClient.connectToServer({
            server_url: config.server_url,
            workspace: config.workspace,
            token: config.token,
            client_id: config.client_id
        });

        console.log('Connected to workspace:', hyphaServer.config.workspace);

        // Wait for ImageJ to be ready
        if (!window.IJClass) {
            console.log('Waiting for ImageJ to initialize...');
            console.log('window.IJClass is currently:', window.IJClass);
            updateStatus('connecting', 'Waiting for ImageJ...');

            // Poll until IJClass is available (with timeout)
            const timeout = 60000; // 60 seconds timeout
            const startTime = Date.now();

            await new Promise((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    if (window.IJClass) {
                        console.log('ImageJ ready! window.IJClass found');
                        clearInterval(checkInterval);
                        resolve();
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(checkInterval);
                        reject(new Error('Timeout waiting for ImageJ to initialize'));
                    }
                }, 100);
            });
        } else {
            console.log('ImageJ already initialized');
        }

        // Register ImageJ service
        console.log('Registering ImageJ service...');
        const service = await hyphaServer.registerService({
            type: 'imagej-macro-executor',
            id: config.service_id,
            name: 'ImageJ Macro Executor',
            description: 'Execute ImageJ macros remotely via Hypha',
            config: {
                visibility: config.visibility,
                require_context: true
            },

            // Run ImageJ macro
            runMacro: Object.assign(
                async ({ macro, returnLog = false }, context = null) => {
                    console.log('🌐 Remote call: runMacro()');
                    console.log('Macro:', macro);

                    try {
                        // Log to ImageJ log window
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                            await IJ.log('🌐 Remote API Call: runMacro()');
                            await IJ.log('Macro length: ' + macro.length + ' chars');
                            await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        }

                        // Use our silent macro execution function
                        const macroResult = await runMacroSilent(macro);

                        if (macroResult.status === 'error') {
                            console.error('✗ Macro error:', macroResult.result);
                            return {
                                success: false,
                                error: macroResult.result
                            };
                        }

                        const result = {
                            success: true,
                            result: macroResult.result || ''
                        };

                        // Optionally return log output
                        if (returnLog) {
                            try {
                                const IJ = window.IJClass || window.IJ;
                                result.log = await IJ.getLog() || '';
                            } catch (e) {
                                result.log = '';
                            }
                        }

                        console.log('✓ Macro executed successfully');
                        return result;

                    } catch (error) {
                        console.error('✗ Error executing macro:', error);
                        return {
                            success: false,
                            error: error.message || error.toString()
                        };
                    }
                },
                { __schema__: schemas.runMacro }
            ),

            // Get ImageJ status
            getStatus: Object.assign(
                async ({}, context = null) => {
                    console.log('🌐 Remote call: getStatus()');

                    const IJ = window.IJClass || window.IJ;
                    if (IJ) {
                        await IJ.log('🌐 Remote API Call: getStatus()');
                    }
                    return {
                        ready: !!IJ,
                        version: 'ImageJ 1.54r (via CheerpJ 4.2)'
                    };
                },
                { __schema__: schemas.getStatus }
            ),

            // Get logs
            getLogs: Object.assign(
                async ({ clear = false }, context = null) => {
                    console.log('🌐 Remote call: getLogs()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ (unless we're clearing)
                        if (!clear) {
                            await IJ.log('🌐 Remote API Call: getLogs(clear=' + clear + ')');
                        }

                        // Get log content using IJ.getLog() directly
                        let logs = '';
                        try {
                            logs = await IJ.getLog();
                        } catch (e) {
                            // Fallback to macro approach if direct call fails
                            console.log('Direct IJ.getLog() failed, trying macro approach');
                            logs = await IJ.runMacro('getInfo("log");');
                        }

                        // Clear log if requested
                        if (clear) {
                            await IJ.runMacro('print("\\\\Clear");');
                        }

                        return { logs: logs || '' };
                    } catch (error) {
                        console.error('✗ Error getting logs:', error);
                        return { logs: '', error: error.message };
                    }
                },
                { __schema__: schemas.getLogs }
            ),

            // Take screenshot
            takeScreenshot: Object.assign(
                async ({ target = 'active-image', format = 'png' }, context = null) => {
                    console.log('🌐 Remote call: takeScreenshot()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('🌐 Remote API Call: takeScreenshot(target=' + target + ', format=' + format + ')');

                        let imageData, width, height;

                        if (target === 'active-image') {
                            // Capture active image
                            const macro = `
                                if (nImages == 0) exit("No image open");
                                w = getWidth();
                                h = getHeight();
                                title = getTitle();
                                // Save to temp location
                                saveAs("PNG", "/files/temp_screenshot.png");
                                return w + "," + h;
                            `;
                            const dims = await IJ.runMacro(macro);
                            [width, height] = dims.split(',').map(Number);

                            // Read the saved file from virtual file system
                            try {
                                console.log('Reading screenshot from virtual file system...');
                                const fileBuffer = await readVirtualFile('/files/temp_screenshot.png');
                                const base64Data = arrayBufferToBase64(fileBuffer);
                                imageData = `data:image/png;base64,${base64Data}`;
                                console.log(`✓ Screenshot captured: ${width}x${height}, ${base64Data.length} bytes base64`);
                            } catch (readError) {
                                console.error('Failed to read screenshot file:', readError);
                                // Fallback to placeholder if reading fails
                                throw new Error(`Failed to read screenshot file: ${readError.message}`);
                            }
                        } else {
                            // Capture ImageJ window using browser APIs
                            // This would require additional implementation
                            throw new Error('imagej-window capture not yet implemented');
                        }

                        return { image: imageData, width, height };
                    } catch (error) {
                        console.error('✗ Error taking screenshot:', error);
                        return { error: error.message };
                    }
                },
                { __schema__: schemas.takeScreenshot }
            ),

            // Open image
            openImage: Object.assign(
                async ({ path, url }, context = null) => {
                    console.log('🌐 Remote call: openImage()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        if (path) {
                            await IJ.log('🌐 Remote API Call: openImage(path=' + path + ')');
                        } else if (url) {
                            await IJ.log('🌐 Remote API Call: openImage(url=' + url + ')');
                        }

                        let macro;
                        if (path) {
                            macro = `open("${path}"); getTitle();`;
                        } else if (url) {
                            macro = `run("URL...", "url=${url}"); getTitle();`;
                        } else {
                            throw new Error('Either path or url must be provided');
                        }

                        const title = await IJ.runMacro(macro);
                        return { success: true, title };
                    } catch (error) {
                        console.error('✗ Error opening image:', error);
                        return { success: false, error: error.message };
                    }
                },
                { __schema__: schemas.openImage }
            ),

            // Get image info
            getImageInfo: Object.assign(
                async ({}, context = null) => {
                    console.log('🌐 Remote call: getImageInfo()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('🌐 Remote API Call: getImageInfo()');

                        const macro = `
                            if (nImages == 0) exit("No image open");
                            title = getTitle();
                            w = getWidth();
                            h = getHeight();
                            bitDepth = bitDepth();
                            type = "";
                            if (bitDepth == 8) type = "8-bit";
                            else if (bitDepth == 16) type = "16-bit";
                            else if (bitDepth == 24) type = "RGB";
                            else if (bitDepth == 32) type = "32-bit";
                            slices = nSlices;
                            return title + "," + w + "," + h + "," + type + "," + slices;
                        `;

                        const result = await IJ.runMacro(macro);
                        const [title, width, height, type, slices] = result.split(',');

                        return {
                            title,
                            width: parseInt(width),
                            height: parseInt(height),
                            type,
                            slices: parseInt(slices)
                        };
                    } catch (error) {
                        console.error('✗ Error getting image info:', error);
                        return { error: error.message };
                    }
                },
                { __schema__: schemas.getImageInfo }
            ),

            // List images
            listImages: Object.assign(
                async ({}, context = null) => {
                    console.log('🌐 Remote call: listImages()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('🌐 Remote API Call: listImages()');

                        const macro = `
                            if (nImages == 0) exit("[]");
                            ids = newArray(nImages);
                            for (i = 0; i < nImages; i++) {
                                selectImage(i + 1);
                                ids[i] = getImageID() + ":" + getTitle() + ":" + getWidth() + ":" + getHeight();
                            }
                            return String.join(ids, "|");
                        `;

                        const result = await IJ.runMacro(macro);
                        if (result === '[]') return { images: [] };

                        const images = result.split('|').map(img => {
                            const [id, title, width, height] = img.split(':');
                            return {
                                id: parseInt(id),
                                title,
                                width: parseInt(width),
                                height: parseInt(height)
                            };
                        });

                        return { images };
                    } catch (error) {
                        console.error('✗ Error listing images:', error);
                        return { images: [], error: error.message };
                    }
                },
                { __schema__: schemas.listImages }
            ),

            // Close image
            closeImage: Object.assign(
                async ({ title }, context = null) => {
                    console.log('🌐 Remote call: closeImage()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('🌐 Remote API Call: closeImage(title=' + title + ')');

                        let macro;
                        if (title === 'all') {
                            macro = 'run("Close All");';
                        } else {
                            macro = `
                                selectWindow("${title}");
                                close();
                            `;
                        }

                        await IJ.runMacro(macro);
                        return { success: true };
                    } catch (error) {
                        console.error('✗ Error closing image:', error);
                        return { success: false, error: error.message };
                    }
                },
                { __schema__: schemas.closeImage }
            ),

            // Get text from table
            getTextFromTable: Object.assign(
                async ({ title }, context = null) => {
                    console.log('🌐 Remote call: getTextFromTable()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('🌐 Remote API Call: getTextFromTable(title=' + title + ')');

                        // Use macro to get table contents
                        const macro = `
                            // Check if table exists
                            if (!isOpen("${title}")) {
                                exit("Table not found: ${title}");
                            }

                            // Select the table window
                            selectWindow("${title}");

                            // Get the table as a string
                            tableString = getInfo("window.contents");

                            return tableString;
                        `;

                        const tableText = await IJ.runMacro(macro);

                        if (tableText && tableText.startsWith('Table not found:')) {
                            return {
                                success: false,
                                error: tableText
                            };
                        }

                        console.log('✓ Retrieved table text:', tableText ? tableText.length + ' chars' : 'empty');
                        return {
                            success: true,
                            text: tableText || ''
                        };

                    } catch (error) {
                        console.error('✗ Error getting table text:', error);
                        return {
                            success: false,
                            error: error.message || error.toString()
                        };
                    }
                },
                { __schema__: schemas.getTextFromTable }
            ),

            // Execute arbitrary JavaScript code
            executeJavaScript: Object.assign(
                async ({ code }, context = null) => {
                    console.log('🌐 Remote call: executeJavaScript()');
                    console.log('Code length:', code.length, 'chars');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        await IJ.log('🌐 Remote API Call: executeJavaScript()');
                        await IJ.log('Code length: ' + code.length + ' chars');
                        await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                        // Create an async function from the code
                        // This allows the code to use 'await' and access local variables
                        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                        const fn = new AsyncFunction(code);

                        // Execute the code
                        const result = await fn();

                        console.log('✓ JavaScript executed successfully');
                        await IJ.log('✓ JavaScript execution completed');

                        return {
                            success: true,
                            result: result
                        };

                    } catch (error) {
                        console.error('✗ Error executing JavaScript:', error);
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('✗ JavaScript execution failed: ' + error.message);
                        }
                        return {
                            success: false,
                            error: error.message || error.toString(),
                            stack: error.stack
                        };
                    }
                },
                { __schema__: schemas.executeJavaScript }
            ),

            // List files in virtual file system
            listFiles: Object.assign(
                async ({ path = '/files/', pattern = null }, context = null) => {
                    console.log('🌐 Remote call: listFiles()');

                    try {
                        // Log to ImageJ
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('🌐 Remote API Call: listFiles(path=' + path + ', pattern=' + (pattern || 'null') + ')');
                        }

                        const files = [];

                        if (path.startsWith('/local/') || path === '/local') {
                            // List files from localFS (drag-and-drop files)
                            if (window.localFS && !window.localFS.isEmpty()) {
                                const localPath = path === '/local' ? '' : path.substring(7); // Remove '/local/'

                                for (const [filePath, file] of window.localFS.files) {
                                    // Filter by directory if specified
                                    if (localPath && !filePath.startsWith(localPath)) continue;

                                    // Filter by pattern if specified
                                    if (pattern) {
                                        const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
                                        if (!regex.test(filePath)) continue;
                                    }

                                    files.push({
                                        name: filePath.split('/').pop(),
                                        path: `/local/${filePath}`,
                                        isDirectory: false
                                    });
                                }

                                // Add directories
                                for (const dirPath of window.localFS.directories) {
                                    if (localPath && !dirPath.startsWith(localPath)) continue;

                                    files.push({
                                        name: dirPath.split('/').pop(),
                                        path: `/local/${dirPath}`,
                                        isDirectory: true
                                    });
                                }
                            }
                        } else if (path.startsWith('/files/') || path === '/files') {
                            // List files from native FS or IndexedDB
                            if (window.nativeFS && window.nativeFS.handle) {
                                // List from native file system
                                const entries = await window.nativeFS.listDirectory(path.substring(7) || '');
                                for (const entry of entries) {
                                    // Filter by pattern if specified
                                    if (pattern) {
                                        const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
                                        if (!regex.test(entry.name)) continue;
                                    }

                                    files.push({
                                        name: entry.name,
                                        path: `/files/${entry.name}`,
                                        isDirectory: entry.kind === 'directory'
                                    });
                                }
                            } else {
                                // Fallback: use ImageJ macro to list files
                                const macro = `
                                    dir = "${path}";
                                    list = getFileList(dir);
                                    if (list.length == 0) exit("[]");
                                    result = "";
                                    for (i = 0; i < list.length; i++) {
                                        if (i > 0) result += "|";
                                        result += list[i];
                                    }
                                    return result;
                                `;

                                const result = await IJ.runMacro(macro);
                                if (result && result !== '[]') {
                                    const fileList = result.split('|');
                                    for (const fileName of fileList) {
                                        // Filter by pattern if specified
                                        if (pattern) {
                                            const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
                                            if (!regex.test(fileName)) continue;
                                        }

                                        files.push({
                                            name: fileName,
                                            path: path + (path.endsWith('/') ? '' : '/') + fileName,
                                            isDirectory: fileName.endsWith('/')
                                        });
                                    }
                                }
                            }
                        } else {
                            throw new Error(`Unsupported path: ${path}. Use /files/ or /local/`);
                        }

                        console.log(`✓ Found ${files.length} file(s) in ${path}`);
                        return { files };
                    } catch (error) {
                        console.error('✗ Error listing files:', error);
                        return { files: [], error: error.message };
                    }
                },
                { __schema__: schemas.listFiles }
            )
        });

        connectedService = service;

        // Expose service globally for testing
        window.hyphaService = service;

        // Build service URL
        const serviceUrl = `${config.server_url}/${hyphaServer.config.workspace}/services/${config.service_id}`;
        const mcpUrl = convertToMcpUrl(serviceUrl);

        console.log('✓ Service registered successfully!');
        console.log('Service URL:', serviceUrl);
        console.log('MCP URL:', mcpUrl);

        updateStatus('connected', 'Connected', serviceUrl);
        return service;

    } catch (error) {
        console.error('Failed to connect to Hypha:', error);
        updateStatus('error', 'Connection failed');
        alert(`Failed to connect to Hypha: ${error.message}`);
        throw error;
    }
}

// Disconnect from Hypha
async function disconnectFromHypha() {
    if (hyphaServer) {
        console.log('Disconnecting from Hypha...');
        // Note: The Hypha client doesn't have an explicit disconnect method
        // The connection will be cleaned up when the page closes
        hyphaServer = null;
        connectedService = null;
        window.hyphaService = null;
        updateStatus('disconnected', 'Disconnected');
    }
}

// Setup button click handlers
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const copyMcpBtn = document.getElementById('copyMcpBtn');

    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            if (hyphaServer) {
                await disconnectFromHypha();
            } else {
                await connectToHypha();
            }
        });
    }

    if (copyMcpBtn) {
        copyMcpBtn.addEventListener('click', async () => {
            const serviceUrl = copyMcpBtn.dataset.serviceUrl;
            if (serviceUrl) {
                try {
                    await navigator.clipboard.writeText(serviceUrl);

                    // Show feedback
                    const originalText = copyMcpBtn.querySelector('span').textContent;
                    copyMcpBtn.querySelector('span').textContent = 'Copied!';

                    setTimeout(() => {
                        copyMcpBtn.querySelector('span').textContent = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy URL:', err);
                    alert('Failed to copy URL to clipboard');
                }
            }
        });
    }
});

// Export for external use
export { connectToHypha, disconnectFromHypha, hyphaServer, connectedService };
