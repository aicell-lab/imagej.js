// Copyright 2017-2022 Leaning Technologies Ltd
if(!self.cj3LoaderPath)
{

var cj3LoaderPath = cj3InitPath();
var cj3Module = null;
var cj3InitOptions = {version:8};

function cj3GetStackEntry(s)
{
	var frames=s.split("  at ");
	if(frames.length == 1)
	{
		// It was not chrome probably, try again
		frames=s.split("@");
	}
	var firstFrame=frames[1];
	var path=firstFrame.split('.js:')[0]+".js";
	return path;
}

function cj3GetCurrentScript()
{
	try
	{
		throw new Error();
	}
	catch(e)
	{
		var stack = e.stack;
	}
	var part=cj3GetStackEntry(stack);
	var loaderStart = part.indexOf("http://");
	if(loaderStart == -1)
		loaderStart = part.indexOf("https://");
	if(loaderStart == -1)
		loaderStart = part.indexOf("chrome-extension://");
	var loaderEnd = part.indexOf(".js");
	if(!(loaderStart >= 0 && loaderEnd > 0)) debugger;
	return part.substring(loaderStart, loaderEnd+3);
}

function cj3InitPath()
{
	var loaderFile = cj3GetCurrentScript();
	return loaderFile.substr(0, loaderFile.length - "/loader.js".length);
}

function cj3LoadImpl(options)
{
	cj3Loaded = 1;
	return import(cj3LoaderPath + "/cj3.js").then(function(module)
	{
		return module.default({absPath:cj3LoaderPath + "/cj3.wasm"}).then(function(m)
		{
			cj3Module = m;
			// Expose the public API
			self.cheerpjRunMain = m.cheerpjRunMain;
			self.cheerpjRunJar = m.cheerpjRunJar;
			self.cheerpjRunLibrary = m.cheerpjRunLibrary;
			self.cheerpjCreateDisplay = m.cheerpjCreateDisplay;
			self.cjFileBlob = m.cjFileBlob;
			self.cjGetRuntimeResources = m.cjGetRuntimeResources;
			self.cjGetProguardConfiguration = m.cjGetProguardConfiguration;
			self.dumpMethod = m.dumpMethod;
			self.dumpClass = m.dumpClass;
			self.dumpAllThreads = m.dumpAllThreads;
			return m.cj3Init(options, cj3LoaderPath, m).then(function()
			{
				if(cj3PendingReplace.length == 0)
					return;
				return cj3StartApplets();
			});
		});
	});
}

function cj3StartApplets()
{
	if(cj3Loaded == 0)
		return cj3LoadImpl(cj3InitOptions);
	else if(cj3Loaded == 1)
	{
		cj3Loaded = 2;
		// Initialize applet support
		return cj3Module.cj3AppletInit().then(function()
		{
			assert(cj3PendingReplace !== null);
			// Start all applets
			var ps = [];
			for(var i=0;i<cj3PendingReplace.length;i++)
			{
				ps.push(cj3Module.cj3RunApplet(cj3PendingReplace[i]));
			}
			cj3PendingReplace = null;
			Promise.all(ps).then(function()
			{
				if(cj3PendingOnload)
				{
					cj3PendingOnload();
				}
			});
			// Don't wait on all the onloads, after replacing the element we are good
		});
	}
}

var cj3Loaded = 0;
var cj3AppletObserver = null;
var cj3InjectInFrames = false;
var cj3PendingReplace = [];
var cj3PendingOnload = null;

function cj3MutationObserver(e)
{
	for(var i=0;i<e.length;i++)
	{
		var addedNodes = [].slice.call(e[i].addedNodes);
		while(addedNodes.length > 0)
		{
			var n = addedNodes.pop();
			var lowerCaseNodeName = n.nodeName.toLowerCase();
			if(lowerCaseNodeName == "applet" || lowerCaseNodeName == "object" || lowerCaseNodeName == "embed" ||
				lowerCaseNodeName == "cheerpj-applet" || lowerCaseNodeName == "cheerpj-object" || lowerCaseNodeName == "cheerpj-embed")
			{
				if(n.getAttribute("data-cheerpj") !== null)
					continue;
				if(cj3PendingReplace === null)
				{
					cj3Module.cj3RunApplet(n);
				}
				else
				{
					if(cj3PendingReplace.length == 0)
						cj3StartApplets();
					cj3PendingReplace.push(n);
				}
			}
			else if(cj3InjectInFrames && (lowerCaseNodeName == "frame" || lowerCaseNodeName == "iframe"))
			{
				var injectedCode = cj3InjectLoader.toString()+";cj3InjectLoader('" + cj3LoaderPath + `', ${JSON.stringify(cj3InitOptions)});`;
				if(window.hasOwnProperty("spoofFunc"))
					injectedCode = spoofFunc.toString()+";try{spoofFunc();}catch(e){}"+injectedCode;
				cj3InjectInFrame(n, injectedCode);
			}
			else
			{
				if(n.hasChildNodes())
				{
					addedNodes = addedNodes.concat([].slice.call(n.children));
				}
			}
		}
	}
}

function cj3InjectLoader(p, options)
{
	// NOTE: Automatic injection into iframes only happen in applet runner mode
	//       The idea is that if CJ is manually integrated it can be placed in the appropriate frame
	if(document.getElementById("cjLoader"))
	{
		// loader.js may still being loaded, if so the observer will be attached on load
		if(self.hasOwnProperty("cj3AttachBodyObserver"))
			cj3AttachBodyObserver(/*appletRunnerMode*/true, options);
		return;
	}
	var s = document.createElement("script");
	s.src = p + "/loader.js";
	s.id = "cjLoader";
	s.onload = function(e)
	{
		cj3AttachBodyObserver(/*appletRunnerMode*/true, options);
	};
	document.head.insertBefore(s, document.head.firstChild);
}

function cj3InjectInFrame(f, scriptText)
{
	f.addEventListener("load", function() { cj3InjectInFrame(f, scriptText); });
	if(f.contentDocument == null)
	{
		// Third party frame
		return;
	}
	if(f.contentDocument.readyState != "loading")
	{
		var s = f.contentDocument.createElement("script");
		s.textContent = scriptText;
		f.contentDocument.head.appendChild(s);
	}
	else
	{
		f.contentDocument.addEventListener("DOMContentLoaded", function(e) {
			var s = e.target.createElement("script");
			s.textContent = scriptText;
			e.target.head.appendChild(s);
		});
	}
}

function cj3AttachBodyObserver(appletRunnerMode, options)
{
	if (appletRunnerMode) // Add Applet Runner options to the global cj3InitOptions object
		Object.assign(cj3InitOptions, options);
	if(cj3AppletObserver == null)
		cj3AppletObserver = new MutationObserver(cj3MutationObserver);
	if(!document.body)
	{
		window.addEventListener("DOMContentLoaded", function() { cj3AttachBodyObserver(appletRunnerMode, cj3InitOptions); });
		return;
	}
	// Register an observer listener for dynamically loaded applets
	cj3AppletObserver.observe(document, { subtree: true, childList: true });
	var elemNames = ["applet", "cheerpj-applet", "object", "cheerpj-object", "embed", "cheerpj-embed"];
	for(var i=0;i<elemNames.length;i++)
	{
		var elems = document.getElementsByTagName(elemNames[i]);
		for(var j=0;j<elems.length;j++)
			cj3PendingReplace.push(elems[j]);
	}
	cj3InjectInFrames = appletRunnerMode;
	if(cj3InjectInFrames)
	{
		var scriptText = cj3InjectLoader.toString()+";cj3InjectLoader('" + cj3LoaderPath + `', ${JSON.stringify(cj3InitOptions)});`;
		var elems = document.getElementsByTagName("frame");
		// Do not the spoof func, we expect that it has been already done by the extension
		for(var i=0;i<elems.length;i++)
		{
			var f = elems[i];
			cj3InjectInFrame(f, scriptText);
		}
		var elems = document.getElementsByTagName("iframe");
		for(var i=0;i<elems.length;i++)
		{
			var f = elems[i];
			cj3InjectInFrame(f, scriptText);
		}
	}
	// If no applets were found, there is nothing to do
	if(cj3PendingReplace.length == 0)
		return;
	// Delay body onload after all applets are initialized (only in applet runner mode)
	if(appletRunnerMode)
	{
		cj3LoadImpl(cj3InitOptions);
		var bodyOnLoad = document.body.onload;
		if(bodyOnLoad)
		{
			// We are injected as a content script very early, but due to races it may still be too late for onload
			// In that case we run onload twice
			cj3PendingOnload = bodyOnLoad.bind(document.body);
			if(document.readyState != "complete")
			{
				// Replace onload with a placeholder
				document.body.onload = function() { };
			}
		}
	}
}

function cheerpjInit(options)
{
	if(cj3Module)
		throw new Error("CheerpJ: Already initialized");
	if(self.window)
		cj3AttachBodyObserver(/*appletRunnerMode*/false, cj3InitOptions);
	return cj3LoadImpl(options);
}

}
