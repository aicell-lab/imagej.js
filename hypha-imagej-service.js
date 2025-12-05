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

// Drop-in replacement for IJ.runMacro() that suppresses dialogs
// Throws an error if the macro fails, so it behaves like IJ.runMacro()
async function runMacroSilentOrThrow(macro) {
    const result = await runMacroSilent(macro);
    if (result.status === 'error') {
        throw new Error(result.result);
    }
    return result.result;
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
        description: "Take a screenshot of an ImageJ image window, capturing the visual display including overlays, ROIs, and annotations",
        parameters: {
            type: "object",
            properties: {
                windowTitle: {
                    type: "string",
                    description: "Title of the image window to capture. If not specified, captures the active image window."
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
                type: {
                    type: "string",
                    description: "Content type, always 'image'",
                    enum: ["image"]
                },
                mimeType: {
                    type: "string",
                    description: "MIME type of the image",
                    enum: ["image/png", "image/jpeg"]
                },
                data: {
                    type: "string",
                    description: "Base64 encoded image data (without data URI prefix)"
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
    },

    searchCommands: {
        name: "searchCommands",
        description: "Search ImageJ's built-in command list to discover available functions",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search term (e.g., 'particle', 'threshold', 'ROI')"
                }
            },
            required: ["query"]
        },
        returns: {
            type: "object",
            properties: {
                commands: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            command: { type: "string" },
                            menuPath: { type: "string" }
                        }
                    },
                    description: "List of matching commands"
                }
            }
        }
    },

    listExamples: {
        name: "listExamples",
        description: "List available code examples from the markdown knowledge base (imagej-examples/)",
        parameters: {
            type: "object",
            properties: {
                category: {
                    type: "string",
                    description: "Filter by category folder name (e.g., 'segmentation', 'roi')"
                },
                tag: {
                    type: "string",
                    description: "Filter by tag (e.g., 'cheerpj-safe', 'roi')"
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                examples: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            path: { type: "string" },
                            title: { type: "string" },
                            category: { type: "string" },
                            tags: { type: "array", items: { type: "string" } },
                            difficulty: { type: "string" },
                            language: { type: "string" }
                        }
                    }
                }
            }
        }
    },

    readExample: {
        name: "readExample",
        description: "Read a specific example markdown file from the knowledge base",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Relative path to markdown file (e.g., 'segmentation/blob-segmentation-wand.md')"
                }
            },
            required: ["path"]
        },
        returns: {
            type: "object",
            properties: {
                content: {
                    type: "string",
                    description: "Full markdown content"
                },
                metadata: {
                    type: "object",
                    description: "Parsed YAML frontmatter metadata"
                }
            }
        }
    },

    searchExamples: {
        name: "searchExamples",
        description: "Search examples by keyword in title, description, or content",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query"
                }
            },
            required: ["query"]
        },
        returns: {
            type: "object",
            properties: {
                examples: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            path: { type: "string" },
                            title: { type: "string" },
                            matches: { type: "string", description: "Matching content snippet" }
                        }
                    }
                }
            }
        }
    },

    saveExample: {
        name: "saveExample",
        description: "Save a new example to the knowledge base as a markdown file",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Relative path for the new file (e.g., 'segmentation/new-technique.md')"
                },
                content: {
                    type: "string",
                    description: "Full markdown content including YAML frontmatter"
                }
            },
            required: ["path", "content"]
        },
        returns: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                path: { type: "string" }
            }
        }
    },

    getRoisAsGeoJson: {
        name: "getRoisAsGeoJson",
        description: "Get ROIs (Regions of Interest) in GeoJSON format. Returns the current ROI from the active image, or all ROIs from the ROI Manager if it's open.",
        parameters: {
            type: "object",
            properties: {
                source: {
                    type: "string",
                    enum: ["current", "manager", "both"],
                    description: "Source of ROIs: 'current' for active image ROI, 'manager' for all ROIs in ROI Manager, 'both' for both sources",
                    default: "both"
                },
                includeProperties: {
                    type: "boolean",
                    description: "Include ROI properties (name, type, measurements) in GeoJSON properties",
                    default: true
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether ROIs were retrieved successfully"
                },
                geojson: {
                    type: "object",
                    description: "GeoJSON FeatureCollection containing all ROIs"
                },
                count: {
                    type: "integer",
                    description: "Number of ROIs retrieved"
                },
                error: {
                    type: "string",
                    description: "Error message if retrieval failed"
                }
            }
        }
    },

    setRoisFromGeoJson: {
        name: "setRoisFromGeoJson",
        description: "Set ROIs from GeoJSON format. Converts GeoJSON features to ImageJ ROIs and adds them to the ROI Manager and/or sets them on the active image.",
        parameters: {
            type: "object",
            properties: {
                geojson: {
                    type: "object",
                    description: "GeoJSON FeatureCollection or single Feature containing ROI geometries"
                },
                target: {
                    type: "string",
                    enum: ["current", "manager", "both"],
                    description: "Where to add ROIs: 'current' sets last ROI on active image, 'manager' adds all to ROI Manager, 'both' does both",
                    default: "both"
                },
                clearExisting: {
                    type: "boolean",
                    description: "Whether to clear existing ROIs in ROI Manager before adding new ones",
                    default: false
                }
            },
            required: ["geojson"]
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether ROIs were set successfully"
                },
                count: {
                    type: "integer",
                    description: "Number of ROIs created"
                },
                error: {
                    type: "string",
                    description: "Error message if setting failed"
                }
            }
        }
    },

    getSummary: {
        name: "getSummary",
        description: "Get a comprehensive summary of the current ImageJ state and environment for AI agents to understand the context. Returns information about version, open windows, images, ROIs, tables, logs, and mounted file systems.",
        parameters: {
            type: "object",
            properties: {
                includeLog: {
                    type: "boolean",
                    description: "Include recent log entries (last 20 lines)",
                    default: true
                },
                includeFileSystem: {
                    type: "boolean",
                    description: "Include information about mounted file systems",
                    default: true
                }
            },
            required: []
        },
        returns: {
            type: "object",
            properties: {
                success: {
                    type: "boolean",
                    description: "Whether the summary was retrieved successfully"
                },
                summary: {
                    type: "string",
                    description: "Human-readable text summary of the current ImageJ state"
                },
                data: {
                    type: "object",
                    description: "Structured data about the ImageJ state"
                },
                error: {
                    type: "string",
                    description: "Error message if summary retrieval failed"
                }
            }
        }
    }
};

// Helper function to parse YAML frontmatter from markdown
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: content };
    }
    
    const yamlStr = match[1];
    const markdownContent = match[2];
    
    // Simple YAML parser (handles basic key: value pairs and arrays)
    const metadata = {};
    const lines = yamlStr.split('\n');
    
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Handle arrays [item1, item2]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
        }
        // Handle booleans
        else if (value === 'true') value = true;
        else if (value === 'false') value = false;
        
        metadata[key] = value;
    }
    
    return { metadata, content: markdownContent };
}

// Helper function to read file from local filesystem
async function readLocalFile(relativePath) {
    try {
        const response = await fetch(`imagej-examples/${relativePath}`);
        if (!response.ok) {
            throw new Error(`File not found: ${relativePath}`);
        }
        return await response.text();
    } catch (error) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
}

// Helper function to list files in examples directory
async function listExampleFiles() {
    // Since we can't directly list directories in browser, we'll use a catalog approach
    // Read the README.md to get the list of examples, or have a manifest file
    try {
        const response = await fetch('imagej-examples/README.md');
        if (!response.ok) {
            throw new Error('Failed to load examples catalog');
        }
        const readmeContent = await response.text();
        
        // Extract markdown links to find example files
        const linkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g;
        const examples = [];
        let match;
        
        while ((match = linkRegex.exec(readmeContent)) !== null) {
            examples.push({
                title: match[1],
                path: match[2]
            });
        }
        
        return examples;
    } catch (error) {
        console.error('Error listing examples:', error);
        return [];
    }
}

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

// Helper function to convert ImageJ ROI to GeoJSON geometry
// Based on QuPath's IJTools.java conversion patterns
async function roiToGeoJson(roi, roiName = null, includeProperties = true) {
    try {
        if (!roi) return null;

        const Roi = await window.lib.ij.gui.Roi;
        const PointRoi = await window.lib.ij.gui.PointRoi;
        const Line = await window.lib.ij.gui.Line;
        const PolygonRoi = await window.lib.ij.gui.PolygonRoi;
        const ShapeRoi = await window.lib.ij.gui.ShapeRoi;
        const OvalRoi = await window.lib.ij.gui.OvalRoi;

        // Get ROI type constants
        const RECTANGLE = 0;
        const OVAL = 1;
        const POLYGON = 2;
        const FREEROI = 3;
        const TRACED_ROI = 4;
        const LINE = 5;
        const POLYLINE = 6;
        const FREELINE = 7;
        const ANGLE = 8;
        const POINT = 10;

        const roiType = await roi.getType();
        const roiTypeName = await roi.getTypeAsString();

        // Get ROI name
        if (!roiName) {
            roiName = await roi.getName();
        }

        // Initialize properties
        const properties = {};
        if (includeProperties) {
            properties.name = roiName || 'Unnamed';
            properties.type = roiTypeName || 'Unknown';
        }

        let geometry = null;

        // Handle Point ROI
        if (roi instanceof PointRoi || roiType === POINT) {
            const pointRoi = roi;

            // Use FloatPolygon to get all points
            const floatPoly = await pointRoi.getFloatPolygon();
            const nPoints = await floatPoly.npoints;

            if (nPoints === 1) {
                // Single point
                const xPoints = await floatPoly.xpoints;
                const yPoints = await floatPoly.ypoints;
                const x = await xPoints[0];
                const y = await yPoints[0];
                geometry = {
                    type: "Point",
                    coordinates: [x, y]
                };
            } else {
                // Multiple points - use MultiPoint
                const xPoints = await floatPoly.xpoints;
                const yPoints = await floatPoly.ypoints;

                const coordinates = [];
                for (let i = 0; i < nPoints; i++) {
                    const x = await xPoints[i];
                    const y = await yPoints[i];
                    coordinates.push([x, y]);
                }
                geometry = {
                    type: "MultiPoint",
                    coordinates: coordinates
                };
            }
        }
        // Handle Line ROI
        else if (roi instanceof Line || roiType === LINE || roiType === ANGLE) {
            const lineRoi = roi;
            const x1 = await lineRoi.x1d || await lineRoi.x1;
            const y1 = await lineRoi.y1d || await lineRoi.y1;
            const x2 = await lineRoi.x2d || await lineRoi.x2;
            const y2 = await lineRoi.y2d || await lineRoi.y2;

            geometry = {
                type: "LineString",
                coordinates: [[x1, y1], [x2, y2]]
            };
        }
        // Handle Rectangle ROI (with no corner diameter = not rounded)
        else if (roiType === RECTANGLE) {
            const cornerDiameter = await roi.getCornerDiameter();
            if (cornerDiameter === 0) {
                const bounds = await roi.getBounds();
                const x = await bounds.x;
                const y = await bounds.y;
                const w = await bounds.width;
                const h = await bounds.height;

                // Rectangle as Polygon (closed ring)
                geometry = {
                    type: "Polygon",
                    coordinates: [[
                        [x, y],
                        [x + w, y],
                        [x + w, y + h],
                        [x, y + h],
                        [x, y]  // Close the ring
                    ]]
                };
            } else {
                // Rounded rectangle - convert to polygon using float polygon
                const floatPoly = await roi.getFloatPolygon();
                geometry = await floatPolygonToGeoJson(floatPoly);
            }
        }
        // Handle Oval/Ellipse ROI
        else if (roiType === OVAL || roi instanceof OvalRoi) {
            // Convert ellipse to polygon approximation
            const floatPoly = await roi.getFloatPolygon();
            geometry = await floatPolygonToGeoJson(floatPoly);
            if (includeProperties) {
                properties.shape = 'ellipse';
            }
        }
        // Handle Polygon ROI (includes POLYGON, FREEROI, TRACED_ROI, POLYLINE, FREELINE)
        else if (roi instanceof PolygonRoi || roiType === POLYGON || roiType === FREEROI ||
                 roiType === TRACED_ROI || roiType === POLYLINE || roiType === FREELINE) {
            const polygonRoi = roi;

            // Get polygon coordinates
            const floatPoly = await polygonRoi.getFloatPolygon();

            // Check if it's a polyline or polygon
            const isLine = roiType === POLYLINE || roiType === FREELINE;

            if (isLine) {
                geometry = await floatPolygonToGeoJson(floatPoly, false);  // Don't close
            } else {
                geometry = await floatPolygonToGeoJson(floatPoly, true);   // Close polygon
            }
        }
        // Handle ShapeRoi (complex shapes)
        else if (roi instanceof ShapeRoi) {
            const shapeRoi = roi;
            const rois = await shapeRoi.getRois();

            if (rois && (await rois.length) > 0) {
                // Multiple sub-ROIs - use GeometryCollection or MultiPolygon
                const geometries = [];
                const roiCount = await rois.length;

                for (let i = 0; i < roiCount; i++) {
                    const subRoi = await rois[i];
                    const subGeom = await roiToGeoJson(subRoi, null, false);
                    if (subGeom && subGeom.geometry) {
                        geometries.push(subGeom.geometry);
                    }
                }

                geometry = {
                    type: "GeometryCollection",
                    geometries: geometries
                };
            } else {
                // Single shape - convert using float polygon
                const floatPoly = await shapeRoi.getFloatPolygon();
                geometry = await floatPolygonToGeoJson(floatPoly, true);
            }
        }
        // Fallback: try to get float polygon
        else {
            try {
                const floatPoly = await roi.getFloatPolygon();
                if (floatPoly) {
                    geometry = await floatPolygonToGeoJson(floatPoly, true);
                }
            } catch (e) {
                console.warn('Could not convert ROI to polygon:', e);
                // Last resort: use bounding box
                const bounds = await roi.getBounds();
                const x = await bounds.x;
                const y = await bounds.y;
                const w = await bounds.width;
                const h = await bounds.height;

                geometry = {
                    type: "Polygon",
                    coordinates: [[
                        [x, y],
                        [x + w, y],
                        [x + w, y + h],
                        [x, y + h],
                        [x, y]
                    ]]
                };
                if (includeProperties) {
                    properties.warning = 'Converted to bounding box';
                }
            }
        }

        if (!geometry) {
            console.warn('Failed to convert ROI to geometry');
            return null;
        }

        return {
            type: "Feature",
            geometry: geometry,
            properties: properties
        };

    } catch (error) {
        console.error('Error converting ROI to GeoJSON:', error);
        return null;
    }
}

// Helper function to convert FloatPolygon to GeoJSON geometry
async function floatPolygonToGeoJson(floatPolygon, closePolygon = true) {
    if (!floatPolygon) return null;

    try {
        const xPoints = await floatPolygon.xpoints;
        const yPoints = await floatPolygon.ypoints;
        const nPoints = await floatPolygon.npoints;

        const coordinates = [];
        for (let i = 0; i < nPoints; i++) {
            const x = await xPoints[i];
            const y = await yPoints[i];
            coordinates.push([x, y]);
        }

        if (closePolygon && nPoints > 0) {
            // Close the polygon by adding first point at end
            const firstX = await xPoints[0];
            const firstY = await yPoints[0];
            const lastX = await xPoints[nPoints - 1];
            const lastY = await yPoints[nPoints - 1];

            // Only close if not already closed
            if (firstX !== lastX || firstY !== lastY) {
                coordinates.push([firstX, firstY]);
            }

            return {
                type: "Polygon",
                coordinates: [coordinates]
            };
        } else {
            return {
                type: "LineString",
                coordinates: coordinates
            };
        }
    } catch (error) {
        console.error('Error converting FloatPolygon:', error);
        return null;
    }
}

// Helper function to convert GeoJSON geometry to ImageJ ROI
async function geoJsonToRoi(feature) {
    try {
        if (!feature || !feature.geometry) {
            throw new Error('Invalid feature: missing geometry');
        }

        const geometry = feature.geometry;
        const properties = feature.properties || {};
        const name = properties.name || 'Unnamed';

        // Get ROI classes
        const Roi = await window.lib.ij.gui.Roi;
        const PointRoi = await window.lib.ij.gui.PointRoi;
        const Line = await window.lib.ij.gui.Line;
        const PolygonRoi = await window.lib.ij.gui.PolygonRoi;
        const OvalRoi = await window.lib.ij.gui.OvalRoi;
        const ShapeRoi = await window.lib.ij.gui.ShapeRoi;

        let roi = null;

        switch (geometry.type) {
            case 'Point': {
                // Single point
                const [x, y] = geometry.coordinates;
                const xPoints = [x];
                const yPoints = [y];
                roi = await new PointRoi(xPoints, yPoints, 1);
                break;
            }

            case 'MultiPoint': {
                // Multiple points
                const coordinates = geometry.coordinates;
                const xPoints = coordinates.map(coord => coord[0]);
                const yPoints = coordinates.map(coord => coord[1]);
                roi = await new PointRoi(xPoints, yPoints, coordinates.length);
                break;
            }

            case 'LineString': {
                // Line or polyline
                const coordinates = geometry.coordinates;
                if (coordinates.length === 2) {
                    // Simple line
                    const [x1, y1] = coordinates[0];
                    const [x2, y2] = coordinates[1];
                    roi = await new Line(x1, y1, x2, y2);
                } else {
                    // Polyline
                    const xPoints = coordinates.map(coord => coord[0]);
                    const yPoints = coordinates.map(coord => coord[1]);
                    const nPoints = coordinates.length;
                    roi = await new PolygonRoi(xPoints, yPoints, nPoints, Roi.POLYLINE);
                }
                break;
            }

            case 'Polygon': {
                // Polygon (first ring is exterior, rest are holes - we'll use first ring only for now)
                const rings = geometry.coordinates;
                if (rings.length === 0) {
                    throw new Error('Polygon has no rings');
                }

                const exteriorRing = rings[0];
                // Remove last point if it's a duplicate of the first (GeoJSON spec requires closing)
                const coordinates = exteriorRing.slice(0, -1);

                const xPoints = coordinates.map(coord => coord[0]);
                const yPoints = coordinates.map(coord => coord[1]);
                const nPoints = coordinates.length;

                // Check if it's a rectangle (4 points with right angles)
                if (nPoints === 4) {
                    const minX = Math.min(...xPoints);
                    const maxX = Math.max(...xPoints);
                    const minY = Math.min(...yPoints);
                    const maxY = Math.max(...yPoints);

                    // Check if all points lie on the rectangle edges
                    const isRect = xPoints.every((x, i) =>
                        (x === minX || x === maxX) && (yPoints[i] === minY || yPoints[i] === maxY)
                    );

                    if (isRect && properties.shape !== 'ellipse') {
                        // Create rectangle ROI
                        roi = await new Roi(minX, minY, maxX - minX, maxY - minY);
                    } else {
                        // Create polygon ROI
                        roi = await new PolygonRoi(xPoints, yPoints, nPoints, Roi.POLYGON);
                    }
                } else if (properties.shape === 'ellipse') {
                    // Create oval ROI from bounding box
                    const minX = Math.min(...xPoints);
                    const maxX = Math.max(...xPoints);
                    const minY = Math.min(...yPoints);
                    const maxY = Math.max(...yPoints);
                    roi = await new OvalRoi(minX, minY, maxX - minX, maxY - minY);
                } else {
                    // Create polygon ROI
                    roi = await new PolygonRoi(xPoints, yPoints, nPoints, Roi.POLYGON);
                }
                break;
            }

            case 'MultiPolygon': {
                // Multiple polygons - combine into ShapeRoi
                const polygons = geometry.coordinates;
                const rois = [];

                for (const polygonRings of polygons) {
                    if (polygonRings.length === 0) continue;

                    const exteriorRing = polygonRings[0];
                    const coordinates = exteriorRing.slice(0, -1);

                    const xPoints = coordinates.map(coord => coord[0]);
                    const yPoints = coordinates.map(coord => coord[1]);
                    const nPoints = coordinates.length;

                    const polygonRoi = await new PolygonRoi(xPoints, yPoints, nPoints, Roi.POLYGON);
                    rois.push(polygonRoi);
                }

                if (rois.length === 1) {
                    roi = rois[0];
                } else if (rois.length > 1) {
                    // Combine using ShapeRoi
                    roi = await new ShapeRoi(rois[0]);
                    for (let i = 1; i < rois.length; i++) {
                        const shapeRoi = await new ShapeRoi(rois[i]);
                        roi = await roi.or(shapeRoi);
                    }
                }
                break;
            }

            case 'GeometryCollection': {
                // Multiple geometries - convert each and combine
                const geometries = geometry.geometries;
                const rois = [];

                for (const geom of geometries) {
                    const subFeature = { type: 'Feature', geometry: geom, properties: {} };
                    const subRoi = await geoJsonToRoi(subFeature);
                    if (subRoi) {
                        rois.push(subRoi);
                    }
                }

                if (rois.length === 1) {
                    roi = rois[0];
                } else if (rois.length > 1) {
                    // Combine using ShapeRoi
                    roi = await new ShapeRoi(rois[0]);
                    for (let i = 1; i < rois.length; i++) {
                        const shapeRoi = await new ShapeRoi(rois[i]);
                        roi = await roi.or(shapeRoi);
                    }
                }
                break;
            }

            default:
                throw new Error(`Unsupported geometry type: ${geometry.type}`);
        }

        if (roi) {
            // Set ROI name
            await roi.setName(name);

            // Set ROI color if specified in properties
            if (properties.strokeColor) {
                try {
                    const Color = await window.lib.java.awt.Color;
                    // Parse color (supports hex colors like "#FF0000" or rgb like "rgb(255,0,0)")
                    const color = parseColor(properties.strokeColor);
                    if (color) {
                        const javaColor = await new Color(color.r, color.g, color.b);
                        await roi.setStrokeColor(javaColor);
                    }
                } catch (colorError) {
                    console.warn('Failed to set ROI color:', colorError);
                }
            }
        }

        return roi;

    } catch (error) {
        console.error('Error converting GeoJSON to ROI:', error);
        throw error;
    }
}

// Helper function to parse color strings
function parseColor(colorStr) {
    if (!colorStr) return null;

    // Handle hex colors (#RRGGBB or #RGB)
    if (colorStr.startsWith('#')) {
        const hex = colorStr.substring(1);
        if (hex.length === 3) {
            // #RGB -> #RRGGBB
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return { r, g, b };
        } else if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return { r, g, b };
        }
    }

    // Handle rgb(r, g, b) format
    const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3])
        };
    }

    return null;
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

            // Track MCP URL creation in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mcp_url_created', {
                    'event_category': 'MCP',
                    'event_label': 'MCP URL Created',
                    'service_url': serviceUrl
                });
            }
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

                        // Get log content directly from IJ
                        let logs = '';
                        try {
                            logs = await IJ.getLog() || '';
                        } catch (e) {
                            console.error('Error getting logs:', e);
                            logs = '';
                        }

                        // Clear log if requested
                        if (clear) {
                            try {
                                await IJ.log('\\Clear');
                            } catch (e) {
                                console.error('Error clearing logs:', e);
                            }
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
                async ({ windowTitle = null, format = 'png' }, context = null) => {
                    console.log('🌐 Remote call: takeScreenshot(windowTitle=' + (windowTitle || 'active') + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        // Log to ImageJ
                        await IJ.log('🌐 Remote API Call: takeScreenshot(windowTitle=' + (windowTitle || 'active') + ', format=' + format + ')');

                        // Get the image to capture
                        let imp;
                        if (windowTitle) {
                            // Get specific window by title
                            const WindowManager = await window.lib.ij.WindowManager;
                            imp = await WindowManager.getImage(windowTitle);
                            if (!imp) {
                                throw new Error('Image window not found: ' + windowTitle);
                            }
                        } else {
                            // Get active image
                            imp = await IJ.getImage();
                            if (!imp) {
                                throw new Error('No image open');
                            }
                        }

                        console.log('Capturing visual display with flatten()...');

                        // Create a flattened copy that includes overlays, ROIs, annotations, etc.
                        // This is what the user sees in the window
                        const flattenedImp = await imp.flatten();

                        if (!flattenedImp) {
                            // If flatten() returns null, the image has no overlays
                            // Use a duplicate of the original image
                            const duplicateImp = await imp.duplicate();
                            const width = await duplicateImp.getWidth();
                            const height = await duplicateImp.getHeight();

                            // Get BufferedImage from the duplicate
                            const bufferedImage = await duplicateImp.getBufferedImage();

                            // Convert to PNG bytes
                            const ByteArrayOutputStream = await window.lib.java.io.ByteArrayOutputStream;
                            const ImageIO = await window.lib.javax.imageio.ImageIO;

                            const baos = await new ByteArrayOutputStream();
                            await ImageIO.write(bufferedImage, 'png', baos);
                            const byteArray = await baos.toByteArray();

                            // Convert Java byte array to JavaScript Uint8Array
                            const length = await byteArray.length;
                            const uint8Array = new Uint8Array(length);
                            for (let i = 0; i < length; i++) {
                                uint8Array[i] = await byteArray[i];
                            }

                            // Clean up
                            await duplicateImp.close();

                            // Convert to base64
                            const base64Data = arrayBufferToBase64(uint8Array);

                            console.log(`✓ Screenshot captured: ${width}x${height}, ${base64Data.length} bytes base64`);

                            // Return in standard format
                            return {
                                type: "image",
                                mimeType: "image/png",
                                data: base64Data,
                                width: width,
                                height: height
                            };
                        } else {
                            // Use the flattened image (includes all visual elements)
                            const width = await flattenedImp.getWidth();
                            const height = await flattenedImp.getHeight();

                            // Get BufferedImage from the flattened ImagePlus
                            const bufferedImage = await flattenedImp.getBufferedImage();

                            // Convert to PNG bytes
                            const ByteArrayOutputStream = await window.lib.java.io.ByteArrayOutputStream;
                            const ImageIO = await window.lib.javax.imageio.ImageIO;

                            const baos = await new ByteArrayOutputStream();
                            await ImageIO.write(bufferedImage, 'png', baos);
                            const byteArray = await baos.toByteArray();

                            // Convert Java byte array to JavaScript Uint8Array
                            const length = await byteArray.length;
                            const uint8Array = new Uint8Array(length);
                            for (let i = 0; i < length; i++) {
                                uint8Array[i] = await byteArray[i];
                            }

                            // Clean up the flattened image
                            await flattenedImp.close();

                            // Convert to base64
                            const base64Data = arrayBufferToBase64(uint8Array);

                            console.log(`✓ Screenshot captured (flattened): ${width}x${height}, ${base64Data.length} bytes base64`);

                            // Return in standard format
                            return {
                                type: "image",
                                mimeType: "image/png",
                                data: base64Data,
                                width: width,
                                height: height
                            };
                        }
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

                        // Use IJ.openImage for direct access
                        if (path) {
                            // Direct file open using IJ.openImage
                            const imp = await IJ.openImage(path);
                            if (!imp) {
                                throw new Error('Failed to open image: ' + path);
                            }
                            await imp.show();
                            const title = await imp.getTitle();
                            return { success: true, title };
                        } else if (url) {
                            // Direct URL opening using IJ.openImage
                            const imp = await IJ.openImage(url);
                            if (!imp) {
                                throw new Error('Failed to open image from URL: ' + url);
                            }
                            await imp.show();
                            const title = await imp.getTitle();
                            return { success: true, title };
                        } else {
                            throw new Error('Either path or url must be provided');
                        }
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

                        // Use JavaScript to access ImagePlus directly - no macro needed
                        const imp = await IJ.getImage();
                        if (!imp) {
                            throw new Error('No image open');
                        }

                        const title = await imp.getTitle();
                        const width = await imp.getWidth();
                        const height = await imp.getHeight();
                        const bitDepth = await imp.getBitDepth();
                        const slices = await imp.getNSlices();

                        let type = '';
                        if (bitDepth === 8) type = '8-bit';
                        else if (bitDepth === 16) type = '16-bit';
                        else if (bitDepth === 24) type = 'RGB';
                        else if (bitDepth === 32) type = '32-bit';

                        return {
                            title,
                            width,
                            height,
                            type,
                            slices
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

                        // Use JavaScript to access WindowManager directly - no macro needed
                        const WindowManager = await window.lib.ij.WindowManager;
                        const imageCount = await WindowManager.getImageCount();

                        if (imageCount === 0) {
                            return { images: [] };
                        }

                        const images = [];
                        const imageIDs = await WindowManager.getIDList();

                        if (!imageIDs) {
                            return { images: [] };
                        }

                        for (let i = 0; i < imageCount; i++) {
                            const id = await imageIDs[i];
                            const imp = await WindowManager.getImage(id);
                            if (imp) {
                                const title = await imp.getTitle();
                                const width = await imp.getWidth();
                                const height = await imp.getHeight();

                                images.push({
                                    id: id,
                                    title: title,
                                    width: width,
                                    height: height
                                });
                            }
                        }

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

                        // Use WindowManager to close images - direct API only
                        const WindowManager = await window.lib.ij.WindowManager;

                        if (title === 'all') {
                            // Close all images using WindowManager
                            const imageIDs = await WindowManager.getIDList();
                            if (imageIDs) {
                                const imageCount = await WindowManager.getImageCount();
                                for (let i = 0; i < imageCount; i++) {
                                    const id = await imageIDs[i];
                                    const imp = await WindowManager.getImage(id);
                                    if (imp) {
                                        await imp.close();
                                    }
                                }
                            }
                        } else {
                            // Close specific image by title
                            const imp = await WindowManager.getImage(title);
                            if (!imp) {
                                throw new Error('Image not found: ' + title);
                            }
                            await imp.close();
                        }

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

                        // Use direct API to access table - try ResultsTable first
                        try {
                            const ResultsTable = await window.lib.ij.measure.ResultsTable;

                            // Check if this is the Results table
                            if (title === 'Results') {
                                const rt = await ResultsTable.getResultsTable();
                                if (rt) {
                                    const tableText = await rt.toString();
                                    console.log('✓ Retrieved Results table:', tableText ? tableText.length + ' chars' : 'empty');
                                    return {
                                        success: true,
                                        text: tableText || ''
                                    };
                                }
                            }

                            // For other tables, try to get from WindowManager
                            const WindowManager = await window.lib.ij.WindowManager;
                            const frame = await WindowManager.getFrame(title);

                            if (!frame) {
                                return {
                                    success: false,
                                    error: 'Table not found: ' + title
                                };
                            }

                            // Try to get TextWindow
                            const TextWindow = await window.lib.ij.text.TextWindow;
                            if (frame instanceof TextWindow) {
                                const textPanel = await frame.getTextPanel();
                                const tableText = await textPanel.getText();
                                console.log('✓ Retrieved table text:', tableText ? tableText.length + ' chars' : 'empty');
                                return {
                                    success: true,
                                    text: tableText || ''
                                };
                            }

                            return {
                                success: false,
                                error: 'Window is not a text table: ' + title
                            };
                        } catch (apiError) {
                            console.error('Error accessing table via API:', apiError);
                            return {
                                success: false,
                                error: 'Failed to access table: ' + apiError.message
                            };
                        }

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
                                // Use Java File class directly to list files
                                try {
                                    const File = await window.lib.java.io.File;
                                    const dirFile = await new File(path);
                                    const exists = await dirFile.exists();

                                    if (!exists) {
                                        console.log('Directory does not exist:', path);
                                        // Return empty list instead of error
                                    } else {
                                        const isDir = await dirFile.isDirectory();

                                        if (isDir) {
                                            const fileArray = await dirFile.listFiles();

                                            if (fileArray) {
                                                const arrayLength = await fileArray.length;
                                                for (let i = 0; i < arrayLength; i++) {
                                                    const file = await fileArray[i];
                                                    const fileName = await file.getName();
                                                    const isDirectory = await file.isDirectory();

                                                    // Filter by pattern if specified
                                                    if (pattern) {
                                                        const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
                                                        if (!regex.test(fileName)) continue;
                                                    }

                                                    files.push({
                                                        name: fileName,
                                                        path: path + (path.endsWith('/') ? '' : '/') + fileName,
                                                        isDirectory: isDirectory
                                                    });
                                                }
                                            }
                                        }
                                    }
                                } catch (fileError) {
                                    console.error('Error listing files with Java File API:', fileError);
                                    // Don't throw, just return empty list
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
            ),

            // Search ImageJ commands
            searchCommands: Object.assign(
                async ({ query }, context = null) => {
                    console.log('🌐 Remote call: searchCommands(query=' + query + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        await IJ.log('🌐 Remote API Call: searchCommands(query=' + query + ')');

                        // Use ImageJ's CommandFinder to search commands
                        const Menus = await window.lib.ij.Menus;
                        const commands = await Menus.getCommands();
                        
                        const results = [];
                        const queryLower = query.toLowerCase();
                        
                        // Search through command hashtable
                        const keys = await commands.keys();
                        while (await keys.hasMoreElements()) {
                            const key = await keys.nextElement();
                            const keyStr = String(key);
                            
                            if (keyStr.toLowerCase().includes(queryLower)) {
                                const value = await commands.get(key);
                                results.push({
                                    command: keyStr,
                                    menuPath: String(value)
                                });
                            }
                        }
                        
                        console.log(`✓ Found ${results.length} matching command(s)`);
                        return { commands: results };
                        
                    } catch (error) {
                        console.error('✗ Error searching commands:', error);
                        return { commands: [], error: error.message };
                    }
                },
                { __schema__: schemas.searchCommands }
            ),

            // List examples from knowledge base
            listExamples: Object.assign(
                async ({ category = null, tag = null }, context = null) => {
                    console.log('🌐 Remote call: listExamples()');

                    try {
                        await IJ.log('🌐 Remote API Call: listExamples(category=' + category + ', tag=' + tag + ')');
                        
                        // Get list of examples from catalog
                        const catalogExamples = await listExampleFiles();
                        const examples = [];
                        
                        // Read metadata from each example
                        for (const ex of catalogExamples) {
                            try {
                                const content = await readLocalFile(ex.path);
                                const { metadata } = parseFrontmatter(content);
                                
                                // Apply filters
                                if (category && metadata.category !== category) continue;
                                if (tag && (!metadata.tags || !metadata.tags.includes(tag))) continue;
                                
                                examples.push({
                                    path: ex.path,
                                    title: metadata.title || ex.title,
                                    category: metadata.category || '',
                                    tags: metadata.tags || [],
                                    difficulty: metadata.difficulty || '',
                                    language: metadata.language || ''
                                });
                            } catch (readError) {
                                console.error(`Error reading example ${ex.path}:`, readError);
                            }
                        }
                        
                        console.log(`✓ Found ${examples.length} example(s)`);
                        return { examples };
                        
                    } catch (error) {
                        console.error('✗ Error listing examples:', error);
                        return { examples: [], error: error.message };
                    }
                },
                { __schema__: schemas.listExamples }
            ),

            // Read specific example
            readExample: Object.assign(
                async ({ path }, context = null) => {
                    console.log('🌐 Remote call: readExample(path=' + path + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('🌐 Remote API Call: readExample(path=' + path + ')');
                        }
                        
                        const content = await readLocalFile(path);
                        const { metadata, content: markdownContent } = parseFrontmatter(content);
                        
                        console.log(`✓ Read example: ${metadata.title || path}`);
                        return {
                            content: markdownContent,
                            metadata: metadata,
                            fullContent: content
                        };
                        
                    } catch (error) {
                        console.error('✗ Error reading example:', error);
                        return { error: error.message };
                    }
                },
                { __schema__: schemas.readExample }
            ),

            // Search examples
            searchExamples: Object.assign(
                async ({ query }, context = null) => {
                    console.log('🌐 Remote call: searchExamples(query=' + query + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('🌐 Remote API Call: searchExamples(query=' + query + ')');
                        }
                        
                        const catalogExamples = await listExampleFiles();
                        const results = [];
                        const queryLower = query.toLowerCase();
                        
                        for (const ex of catalogExamples) {
                            try {
                                const content = await readLocalFile(ex.path);
                                const { metadata, content: markdownContent } = parseFrontmatter(content);
                                
                                // Search in title, tags, and content
                                const title = (metadata.title || '').toLowerCase();
                                const tags = (metadata.tags || []).join(' ').toLowerCase();
                                const contentLower = markdownContent.toLowerCase();
                                
                                if (title.includes(queryLower) || 
                                    tags.includes(queryLower) || 
                                    contentLower.includes(queryLower)) {
                                    
                                    // Extract matching snippet
                                    const index = contentLower.indexOf(queryLower);
                                    const start = Math.max(0, index - 50);
                                    const end = Math.min(markdownContent.length, index + 100);
                                    const snippet = markdownContent.substring(start, end);
                                    
                                    results.push({
                                        path: ex.path,
                                        title: metadata.title || ex.title,
                                        matches: '...' + snippet + '...'
                                    });
                                }
                            } catch (readError) {
                                console.error(`Error searching example ${ex.path}:`, readError);
                            }
                        }
                        
                        console.log(`✓ Found ${results.length} matching example(s)`);
                        return { examples: results };
                        
                    } catch (error) {
                        console.error('✗ Error searching examples:', error);
                        return { examples: [], error: error.message };
                    }
                },
                { __schema__: schemas.searchExamples }
            ),

            // Save new example
            saveExample: Object.assign(
                async ({ path, content }, context = null) => {
                    console.log('🌐 Remote call: saveExample(path=' + path + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('🌐 Remote API Call: saveExample(path=' + path + ')');
                        }

                        // For now, we can't directly write files in browser environment
                        // Instead, provide download or localStorage option
                        // Return the content so user can save it manually

                        console.log('Note: Saving examples requires manual download in browser environment');

                        // Create a downloadable blob
                        const blob = new Blob([content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);

                        // Trigger download
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = path.split('/').pop();
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);

                        console.log(`✓ Example download triggered: ${path}`);
                        return {
                            success: true,
                            path: path,
                            message: 'Example file downloaded. Please save it to imagej-examples/' + path
                        };

                    } catch (error) {
                        console.error('✗ Error saving example:', error);
                        return {
                            success: false,
                            error: error.message
                        };
                    }
                },
                { __schema__: schemas.saveExample }
            ),

            // Get ROIs as GeoJSON
            getRoisAsGeoJson: Object.assign(
                async ({ source = 'current', includeProperties = true }, context = null) => {
                    console.log('🌐 Remote call: getRoisAsGeoJson(source=' + source + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        await IJ.log('🌐 Remote API Call: getRoisAsGeoJson(source=' + source + ', includeProperties=' + includeProperties + ')');

                        const features = [];

                        // Get current ROI from active image
                        if (source === 'current' || source === 'both') {
                            try {
                                const imp = await IJ.getImage();
                                if (imp) {
                                    const currentRoi = await imp.getRoi();
                                    if (currentRoi) {
                                        const feature = await roiToGeoJson(currentRoi, 'Current Selection', includeProperties);
                                        if (feature) {
                                            features.push(feature);
                                        }
                                    }
                                }
                            } catch (e) {
                                console.log('No current ROI:', e.message);
                            }
                        }

                        // Get ROIs from ROI Manager
                        if (source === 'manager' || source === 'both') {
                            try {
                                const RoiManager = await window.lib.ij.plugin.frame.RoiManager;
                                const rm = await RoiManager.getInstance();

                                if (rm) {
                                    const count = await rm.getCount();
                                    console.log(`Found ${count} ROIs in ROI Manager`);

                                    for (let i = 0; i < count; i++) {
                                        const roi = await rm.getRoi(i);
                                        if (roi) {
                                            const roiName = await roi.getName() || `ROI ${i + 1}`;
                                            const feature = await roiToGeoJson(roi, roiName, includeProperties);
                                            if (feature) {
                                                // Add index to properties
                                                if (includeProperties) {
                                                    feature.properties.index = i;
                                                    feature.properties.source = 'ROI Manager';
                                                }
                                                features.push(feature);
                                            }
                                        }
                                    }
                                } else {
                                    console.log('ROI Manager not open');
                                }
                            } catch (e) {
                                console.log('No ROI Manager:', e.message);
                            }
                        }

                        // Create GeoJSON FeatureCollection
                        const geojson = {
                            type: "FeatureCollection",
                            features: features
                        };

                        console.log(`✓ Converted ${features.length} ROI(s) to GeoJSON`);
                        await IJ.log(`✓ Exported ${features.length} ROI(s) to GeoJSON`);

                        return {
                            success: true,
                            geojson: geojson,
                            count: features.length
                        };

                    } catch (error) {
                        console.error('✗ Error getting ROIs as GeoJSON:', error);
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('✗ Error getting ROIs: ' + error.message);
                        }
                        return {
                            success: false,
                            error: error.message || error.toString(),
                            geojson: { type: "FeatureCollection", features: [] },
                            count: 0
                        };
                    }
                },
                { __schema__: schemas.getRoisAsGeoJson }
            ),

            // Set ROIs from GeoJSON
            setRoisFromGeoJson: Object.assign(
                async ({ geojson, target = 'both', clearExisting = false }, context = null) => {
                    console.log('🌐 Remote call: setRoisFromGeoJson(target=' + target + ', clearExisting=' + clearExisting + ')');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) throw new Error('ImageJ not initialized');

                        await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        await IJ.log('🌐 Remote API Call: setRoisFromGeoJson()');
                        await IJ.log('Target: ' + target + ', Clear existing: ' + clearExisting);
                        await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                        // Parse GeoJSON
                        let features = [];
                        if (geojson.type === 'FeatureCollection') {
                            features = geojson.features || [];
                        } else if (geojson.type === 'Feature') {
                            features = [geojson];
                        } else {
                            throw new Error('Invalid GeoJSON: must be FeatureCollection or Feature');
                        }

                        if (features.length === 0) {
                            await IJ.log('⚠️  No features in GeoJSON');
                            return {
                                success: true,
                                count: 0
                            };
                        }

                        await IJ.log(`Converting ${features.length} GeoJSON feature(s) to ROIs...`);

                        // Convert GeoJSON features to ROIs
                        const rois = [];
                        for (let i = 0; i < features.length; i++) {
                            try {
                                const roi = await geoJsonToRoi(features[i]);
                                if (roi) {
                                    rois.push(roi);
                                    const roiName = await roi.getName();
                                    await IJ.log(`  ✓ Converted: ${roiName}`);
                                } else {
                                    await IJ.log(`  ✗ Failed to convert feature ${i + 1}`);
                                }
                            } catch (convError) {
                                console.error(`Error converting feature ${i}:`, convError);
                                await IJ.log(`  ✗ Error converting feature ${i + 1}: ${convError.message}`);
                            }
                        }

                        if (rois.length === 0) {
                            throw new Error('Failed to convert any features to ROIs');
                        }

                        await IJ.log(`✓ Successfully converted ${rois.length} ROI(s)`);

                        // Add ROIs to ROI Manager if requested
                        if (target === 'manager' || target === 'both') {
                            const RoiManager = await window.lib.ij.plugin.frame.RoiManager;
                            let rm = await RoiManager.getInstance();

                            // Create ROI Manager if it doesn't exist
                            if (!rm) {
                                await IJ.log('Creating ROI Manager...');
                                rm = await new RoiManager();
                            }

                            // Clear existing ROIs if requested
                            if (clearExisting) {
                                const count = await rm.getCount();
                                if (count > 0) {
                                    await IJ.log(`Clearing ${count} existing ROI(s) from ROI Manager...`);
                                    await rm.runCommand('Delete');
                                }
                            }

                            // Add ROIs to manager
                            await IJ.log('Adding ROIs to ROI Manager...');
                            for (const roi of rois) {
                                await rm.addRoi(roi);
                            }

                            await IJ.log(`✓ Added ${rois.length} ROI(s) to ROI Manager`);
                        }

                        // Set last ROI on active image if requested
                        if (target === 'current' || target === 'both') {
                            try {
                                const imp = await IJ.getImage();
                                if (imp) {
                                    // Set the last ROI on the image
                                    const lastRoi = rois[rois.length - 1];
                                    await imp.setRoi(lastRoi);
                                    const roiName = await lastRoi.getName();
                                    await IJ.log(`✓ Set ROI on active image: ${roiName}`);
                                } else {
                                    await IJ.log('⚠️  No active image to set ROI on');
                                }
                            } catch (imgError) {
                                console.error('Error setting ROI on image:', imgError);
                                await IJ.log(`⚠️  Could not set ROI on image: ${imgError.message}`);
                            }
                        }

                        console.log(`✓ Set ${rois.length} ROI(s) from GeoJSON`);
                        await IJ.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        await IJ.log(`✓ Complete: ${rois.length} ROI(s) loaded from GeoJSON`);

                        return {
                            success: true,
                            count: rois.length
                        };

                    } catch (error) {
                        console.error('✗ Error setting ROIs from GeoJSON:', error);
                        const IJ = window.IJClass || window.IJ;
                        if (IJ) {
                            await IJ.log('✗ Error setting ROIs: ' + error.message);
                        }
                        return {
                            success: false,
                            error: error.message || error.toString(),
                            count: 0
                        };
                    }
                },
                { __schema__: schemas.setRoisFromGeoJson }
            ),

            // Get comprehensive summary of ImageJ state
            getSummary: Object.assign(
                async ({ includeLog = true, includeFileSystem = true }, context = null) => {
                    console.log('🌐 Remote call: getSummary()');

                    try {
                        const IJ = window.IJClass || window.IJ;
                        if (!IJ) {
                            return {
                                success: false,
                                error: 'ImageJ not initialized',
                                summary: 'ImageJ is not ready. Please wait for ImageJ to initialize.',
                                data: { ready: false }
                            };
                        }

                        const data = {};
                        const summaryLines = [];

                        // ===== VERSION & ENVIRONMENT =====
                        summaryLines.push('=== ImageJ.JS Environment ===');
                        data.version = 'ImageJ 1.54r (via CheerpJ 4.2 in browser)';
                        data.environment = 'Browser-based (WebAssembly/JavaScript)';
                        summaryLines.push(`Version: ${data.version}`);
                        summaryLines.push(`Environment: ${data.environment}`);
                        summaryLines.push('');

                        // ===== OPEN IMAGES =====
                        summaryLines.push('=== Open Images ===');
                        try {
                            const WindowManager = await window.lib.ij.WindowManager;
                            const imageCount = await WindowManager.getImageCount();
                            data.imageCount = imageCount;

                            if (imageCount === 0) {
                                summaryLines.push('No images currently open.');
                                data.images = [];
                            } else {
                                summaryLines.push(`Total images open: ${imageCount}`);
                                const images = [];
                                const imageIDs = await WindowManager.getIDList();

                                if (imageIDs) {
                                    for (let i = 0; i < imageCount; i++) {
                                        const id = await imageIDs[i];
                                        const imp = await WindowManager.getImage(id);
                                        if (imp) {
                                            const title = await imp.getTitle();
                                            const width = await imp.getWidth();
                                            const height = await imp.getHeight();
                                            const bitDepth = await imp.getBitDepth();
                                            const slices = await imp.getNSlices();

                                            let type = '';
                                            if (bitDepth === 8) type = '8-bit';
                                            else if (bitDepth === 16) type = '16-bit';
                                            else if (bitDepth === 24) type = 'RGB';
                                            else if (bitDepth === 32) type = '32-bit';

                                            const imageInfo = {
                                                id,
                                                title,
                                                width,
                                                height,
                                                type,
                                                slices
                                            };
                                            images.push(imageInfo);

                                            summaryLines.push(`  ${i + 1}. "${title}" - ${width}x${height} ${type}${slices > 1 ? `, ${slices} slices` : ''}`);
                                        }
                                    }
                                }
                                data.images = images;

                                // Active image
                                try {
                                    const activeImp = await IJ.getImage();
                                    if (activeImp) {
                                        const activeTitle = await activeImp.getTitle();
                                        data.activeImage = activeTitle;
                                        summaryLines.push(`  Active: "${activeTitle}"`);
                                    }
                                } catch (e) {
                                    data.activeImage = null;
                                }
                            }
                        } catch (e) {
                            summaryLines.push('Error checking images: ' + e.message);
                            data.imageCount = 0;
                            data.images = [];
                        }
                        summaryLines.push('');

                        // ===== ROI INFORMATION =====
                        summaryLines.push('=== ROI (Regions of Interest) ===');
                        try {
                            // Current ROI on active image
                            let hasCurrentRoi = false;
                            try {
                                const imp = await IJ.getImage();
                                if (imp) {
                                    const roi = await imp.getRoi();
                                    if (roi) {
                                        hasCurrentRoi = true;
                                        const roiType = await roi.getTypeAsString();
                                        const roiName = await roi.getName();
                                        data.currentRoi = { type: roiType, name: roiName || 'Unnamed' };
                                        summaryLines.push(`Current ROI: ${roiType}${roiName ? ` ("${roiName}")` : ''}`);
                                    }
                                }
                            } catch (e) {
                                // No current ROI
                            }

                            if (!hasCurrentRoi) {
                                summaryLines.push('No ROI selected on active image.');
                                data.currentRoi = null;
                            }

                            // ROI Manager
                            const RoiManager = await window.lib.ij.plugin.frame.RoiManager;
                            const rm = await RoiManager.getInstance();

                            if (rm) {
                                const roiCount = await rm.getCount();
                                data.roiManagerCount = roiCount;
                                summaryLines.push(`ROI Manager: ${roiCount} ROI(s) stored`);

                                if (roiCount > 0 && roiCount <= 10) {
                                    // List ROIs if not too many
                                    const rois = [];
                                    for (let i = 0; i < roiCount; i++) {
                                        const roi = await rm.getRoi(i);
                                        const roiName = await roi.getName();
                                        const roiType = await roi.getTypeAsString();
                                        rois.push({ name: roiName || `ROI ${i + 1}`, type: roiType });
                                        summaryLines.push(`  ${i + 1}. ${roiName || `ROI ${i + 1}`} (${roiType})`);
                                    }
                                    data.roiManagerRois = rois;
                                } else if (roiCount > 10) {
                                    summaryLines.push('  (Too many to list individually)');
                                }
                            } else {
                                summaryLines.push('ROI Manager: Not open');
                                data.roiManagerCount = 0;
                            }
                        } catch (e) {
                            summaryLines.push('Error checking ROIs: ' + e.message);
                            data.currentRoi = null;
                            data.roiManagerCount = 0;
                        }
                        summaryLines.push('');

                        // ===== OPEN WINDOWS & TABLES =====
                        summaryLines.push('=== Open Windows & Tables ===');
                        try {
                            const WindowManager = await window.lib.ij.WindowManager;
                            const windowList = await WindowManager.getWindowList();

                            if (windowList && (await windowList.length) > 0) {
                                const windowCount = await windowList.length;
                                data.openWindows = [];
                                summaryLines.push(`Open windows: ${windowCount}`);

                                for (let i = 0; i < Math.min(windowCount, 20); i++) {
                                    const window = await windowList[i];
                                    const title = await window.getTitle();
                                    data.openWindows.push(title);

                                    // Check if it's a table
                                    const TextWindow = await window.lib.ij.text.TextWindow;
                                    if (window instanceof TextWindow) {
                                        summaryLines.push(`  - "${title}" (Table/Text Window)`);
                                    } else {
                                        summaryLines.push(`  - "${title}"`);
                                    }
                                }

                                if (windowCount > 20) {
                                    summaryLines.push(`  ... and ${windowCount - 20} more`);
                                }
                            } else {
                                summaryLines.push('No additional windows open.');
                                data.openWindows = [];
                            }

                            // Check for Results table specifically
                            const ResultsTable = await window.lib.ij.measure.ResultsTable;
                            const rt = await ResultsTable.getResultsTable();
                            if (rt) {
                                const rowCount = await rt.size();
                                data.resultsTableRows = rowCount;
                                summaryLines.push(`Results table: ${rowCount} row(s)`);
                            } else {
                                data.resultsTableRows = 0;
                            }
                        } catch (e) {
                            summaryLines.push('Error checking windows: ' + e.message);
                            data.openWindows = [];
                            data.resultsTableRows = 0;
                        }
                        summaryLines.push('');

                        // ===== FILE SYSTEMS =====
                        if (includeFileSystem) {
                            summaryLines.push('=== Mounted File Systems ===');
                            data.fileSystems = {};

                            // Native FS (mounted folder)
                            if (window.nativeFS && window.nativeFS.handle) {
                                try {
                                    const dirName = await window.nativeFS.handle.name;
                                    data.fileSystems.native = { mounted: true, name: dirName };
                                    summaryLines.push(`✓ Native folder mounted: "${dirName}" at /files/`);
                                } catch (e) {
                                    data.fileSystems.native = { mounted: false };
                                    summaryLines.push('✗ Native folder: Not mounted');
                                }
                            } else {
                                data.fileSystems.native = { mounted: false };
                                summaryLines.push('✗ Native folder: Not mounted (Chrome/Edge only)');
                            }

                            // Local FS (drag & drop)
                            if (window.localFS) {
                                const fileCount = window.localFS.files ? window.localFS.files.size : 0;
                                const dirCount = window.localFS.directories ? window.localFS.directories.size : 0;
                                data.fileSystems.local = { fileCount, dirCount };
                                if (fileCount > 0 || dirCount > 0) {
                                    summaryLines.push(`✓ Local files (drag & drop): ${fileCount} file(s), ${dirCount} folder(s) at /local/`);
                                } else {
                                    summaryLines.push('○ Local files: Empty (drag & drop files to add)');
                                }
                            } else {
                                data.fileSystems.local = { fileCount: 0, dirCount: 0 };
                                summaryLines.push('○ Local files: Not initialized');
                            }

                            // GitHub FS
                            if (window.githubFS && window.githubFS.mountedRepos && window.githubFS.mountedRepos.size > 0) {
                                const repos = Array.from(window.githubFS.mountedRepos.keys());
                                data.fileSystems.github = { mounted: true, repos };
                                summaryLines.push(`✓ GitHub repos mounted: ${repos.length}`);
                                repos.forEach(repo => {
                                    summaryLines.push(`  - ${repo} at /github/${repo}/`);
                                });
                            } else {
                                data.fileSystems.github = { mounted: false, repos: [] };
                                summaryLines.push('○ GitHub repos: None mounted');
                            }
                            summaryLines.push('');
                        }

                        // ===== LOG (recent entries) =====
                        if (includeLog) {
                            summaryLines.push('=== Recent Log Entries (last 20 lines) ===');
                            try {
                                const logContent = await IJ.getLog() || '';
                                if (logContent) {
                                    const logLines = logContent.split('\n').filter(line => line.trim());
                                    const recentLines = logLines.slice(-20);
                                    data.logLineCount = logLines.length;
                                    data.recentLog = recentLines.join('\n');

                                    if (recentLines.length > 0) {
                                        recentLines.forEach(line => {
                                            summaryLines.push(`  ${line}`);
                                        });
                                    } else {
                                        summaryLines.push('Log is empty.');
                                    }

                                    if (logLines.length > 20) {
                                        summaryLines.push(`  ... (${logLines.length - 20} earlier lines not shown)`);
                                    }
                                } else {
                                    summaryLines.push('Log is empty.');
                                    data.logLineCount = 0;
                                    data.recentLog = '';
                                }
                            } catch (e) {
                                summaryLines.push('Error reading log: ' + e.message);
                                data.logLineCount = 0;
                                data.recentLog = '';
                            }
                            summaryLines.push('');
                        }

                        // ===== ADDITIONAL INFO =====
                        summaryLines.push('=== Additional Information ===');
                        summaryLines.push('Available commands: Use searchCommands() to find ImageJ commands');
                        summaryLines.push('Code examples: Use listExamples() or searchExamples() for working code');
                        summaryLines.push('JavaScript access: Use executeJavaScript() for direct Java API access');
                        summaryLines.push('');

                        // Build summary text
                        const summary = summaryLines.join('\n');

                        console.log('✓ Summary generated successfully');

                        return {
                            success: true,
                            summary: summary,
                            data: data
                        };

                    } catch (error) {
                        console.error('✗ Error getting summary:', error);
                        return {
                            success: false,
                            error: error.message || error.toString(),
                            summary: 'Failed to generate summary: ' + error.message,
                            data: {}
                        };
                    }
                },
                { __schema__: schemas.getSummary }
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

                    // Track MCP URL copy in Google Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'mcp_url_copied', {
                            'event_category': 'MCP',
                            'event_label': 'MCP URL Copied to Clipboard',
                            'value': 1
                        });
                    }

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
export { connectToHypha, disconnectFromHypha, hyphaServer, connectedService, roiToGeoJson, floatPolygonToGeoJson, geoJsonToRoi };
