// ============================================================
//  threadhack drop-in runtime for CheerpJ 4.2
//  ============================================================
//  Swap `<script src="https://cjrtnc.leaningtech.com/4.2/loader.js">`
//  for `<script src="…/runtime/loader.js">` and any CheerpJ app
//  auto-gains a worker pool + bytecode rewriter. No other changes.
// ============================================================

(function () {
  // Capture OUR URL in the outer scope (document.currentScript works here
  // because we haven't used document.write yet).
  var ourScriptEl = document.currentScript;
  var ourUrl = (ourScriptEl && ourScriptEl.src) ? ourScriptEl.src : '';
  var base = ourUrl ? ourUrl.substring(0, ourUrl.lastIndexOf('/') + 1) : '/';

  // Stash for the inline wrapper to read
  window.__threadhackBase__ = base;

  // Pull in the stock CheerpJ loader SYNCHRONOUSLY so cheerpjInit is defined
  // before the app's <script type="module"> block runs.
  document.write('<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"><\/script>');

  // Inline wrapper — runs synchronously after the stock loader finishes parsing.
  document.write('<script>' + `
(function () {
  'use strict';

  var base = window.__threadhackBase__;
  var TOOL_JAR_URL_ABS = base + 'parallel-tool.jar';
  var WORKER_URL       = base + 's2-worker.js';

  // Path CheerpJ can see via /app/ — i.e. pathname part relative to origin
  var toolJarPath;
  try {
    var u = new URL(TOOL_JAR_URL_ABS, location.href);
    toolJarPath = '/app' + u.pathname;
  } catch (_) {
    toolJarPath = '/app/' + TOOL_JAR_URL_ABS.replace(/^.*?\\/\\//, '').replace(/^[^/]+/, '');
  }

  console.log('[threadhack-runtime] base=' + base);
  console.log('[threadhack-runtime] TOOL_JAR=' + TOOL_JAR_URL_ABS + ' → ' + toolJarPath);
  console.log('[threadhack-runtime] WORKER=' + WORKER_URL);

  // Worker pool + natives ---------------------------------------------------
  var pool = [];
  var nextWorker = 0, nextHandle = 1;
  var pending = new Map();
  var handleResults = new Map();

  async function spawnPool(n) {
    var t0 = performance.now();
    var WORKER_TIMEOUT_MS = 30000;
    for (var i = 0; i < n; i++) {
      var w = new Worker(WORKER_URL + '?cb=' + Date.now() + '_' + i, { name: 'w' + i });
      w.__name = 'w' + i;
      var workerName = 'w' + i;
      var readyP = new Promise(function (res, rej) { w._res = res; w._rej = rej; });
      w.onmessage = function (e) {
        var d = e.data;
        if (d.kind === 'ready') { w._res(); }
        else if (d.kind === 'log') { /* quiet */ }
        else if (d.kind === 'done' || d.kind === 'error') {
          var p = pending.get(d.id); if (!p) return;
          pending.delete(d.id);
          d.kind === 'error' ? p.reject(new Error(d.err)) : p.resolve(d);
        }
      };
      w.onerror = (function(name, rej) { return function(ev) {
        console.warn('[threadhack-runtime] ' + name + ' onerror: ' + (ev.message || ev));
        try { rej(new Error('worker onerror')); } catch(_){}
      }; })(workerName, w._rej);
      var timeoutP = new Promise(function (res, rej) {
        setTimeout(function () { rej(new Error('boot timeout (' + WORKER_TIMEOUT_MS + 'ms)')); }, WORKER_TIMEOUT_MS);
      });
      try {
        await Promise.race([readyP, timeoutP]);
        pool.push(w);
      } catch (e) {
        console.warn('[threadhack-runtime] ' + workerName + ' failed: ' + e.message + ' — skipping');
        try { w.terminate(); } catch(_){}
      }
    }
    console.log('[threadhack-runtime] ' + pool.length + '/' + n + ' workers ready in ' + (performance.now() - t0).toFixed(0) + 'ms');
  }

  var threadHookNatives = {
    Java_com_hack_ThreadHook_nativeWorkerAvailable: async function () {
      return pool.length > 0;
    },
    Java_com_hack_ThreadHook_nativeDispatch: async function (lib, bytes, className) {
      var handle = nextHandle++;
      var buf = new Uint8Array(bytes).buffer.slice(0);
      var w = pool[nextWorker++ % pool.length];
      var resultPromise = new Promise(function (resolve, reject) {
        pending.set(handle, { resolve: resolve, reject: reject });
      });
      w.postMessage({ kind: 'run', id: handle, bytes: buf }, [buf]);
      handleResults.set(Number(handle), resultPromise);
      return handle;
    },
    Java_com_hack_ThreadHook_nativeAwait: async function (lib, handle) {
      var key = Number(handle);
      var p = handleResults.get(key); handleResults.delete(key);
      if (!p) throw new Error('no such handle: ' + handle);
      var r = await p;
      return new Int8Array(r.resultBuf);
    }
  };

  // ---- LazyImagePlus / TileSource natives -----------------------------
  // JS-side data sources register themselves as window.__tileSources[key].
  // A provider has shape: { levels:[{w,h,scaleFactor}], bitsPerSample,
  //   async getRegion(level,x,y,w,h) -> { data: TypedArray, width, height } }
  window.__tileSources = window.__tileSources || {};

  function getSrc(key) {
    var s = window.__tileSources[key];
    if (!s) throw new Error('[threadhack] no tile source registered for key=' + key);
    return s;
  }

  // Per-(key,level) min/max cache for auto-stretch (avoids re-scanning).
  var _statsCache = new Map();

  function autoStretchToU8(typedArr, bits, statKey) {
    if (bits <= 8) {
      return (typedArr instanceof Uint8Array) ? typedArr : new Uint8Array(typedArr);
    }
    var stats = _statsCache.get(statKey);
    if (!stats) {
      var mn = Infinity, mx = -Infinity;
      var stride = Math.max(1, Math.floor(typedArr.length / 50000));
      for (var i = 0; i < typedArr.length; i += stride) {
        var v = typedArr[i];
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      if (!isFinite(mn) || mx <= mn) { mn = 0; mx = bits <= 16 ? 65535 : 1; }
      stats = { mn: mn, mx: mx };
      _statsCache.set(statKey, stats);
    }
    var scale = 255 / (stats.mx - stats.mn);
    var out = new Uint8Array(typedArr.length);
    for (var j = 0; j < typedArr.length; j++) {
      var w = (typedArr[j] - stats.mn) * scale;
      if (w < 0) w = 0; else if (w > 255) w = 255;
      out[j] = w;
    }
    return out;
  }

  // ---- MenuRegistry native ----------------------------------------------
  // Java calls this when a menu item is clicked; dispatches to the JS-side
  // handler registered under window.__menuHandlers[key].
  window.__menuHandlers = window.__menuHandlers || {};
  var menuRegistryNatives = {
    Java_com_hack_menu_MenuRegistry_nativeInvokeJSHandler: async function (lib, key) {
      try {
        var h = window.__menuHandlers && window.__menuHandlers[key];
        if (typeof h === 'function') {
          await h();
        } else {
          console.warn('[MenuRegistry] no handler for key=' + key);
        }
      } catch (e) {
        console.error('[MenuRegistry] handler ' + key + ' threw:', e);
      }
    }
  };

  var tileSourceNatives = {
    Java_com_hack_viewer_JSTileSource_nativeLevelCount:    async function (lib, key) { return getSrc(key).levels.length; },
    Java_com_hack_viewer_JSTileSource_nativeBitsPerSample: async function (lib, key) { return getSrc(key).bitsPerSample || 8; },
    Java_com_hack_viewer_JSTileSource_nativeLevelWidth:    async function (lib, key, level) { return getSrc(key).levels[level].w; },
    Java_com_hack_viewer_JSTileSource_nativeLevelHeight:   async function (lib, key, level) { return getSrc(key).levels[level].h; },
    Java_com_hack_viewer_JSTileSource_nativeLevelScale:    async function (lib, key, level) { return getSrc(key).levels[level].scaleFactor; },
    Java_com_hack_viewer_JSTileSource_nativeGetTile: async function (lib, key, level, x, y, w, h) {
      var src = getSrc(key);
      var region = await src.getRegion(level, x, y, w, h);
      if (!region.data) {
        return new Int8Array(w * h); // black tile
      }
      var u8 = autoStretchToU8(region.data, src.bitsPerSample || 8, key + '|' + level);
      return new Int8Array(u8.buffer, u8.byteOffset, u8.byteLength);
    },
    /**
     * Fire-and-forget tile request. The Java caller is unblocked the
     * instant this native returns (which is immediate — the actual
     * fetch runs in the background). When the fetch resolves we call
     * back into Java via LazyImagePlus.onTileReady(id, bytes).
     */
    Java_com_hack_viewer_JSTileSource_nativeRequestTile: function (lib, id, key, level, x, y, w, h) {
      // Fetch in parallel; serialize the CALLBACK into Java because
      // CheerpJ's Java thread is single-threaded and concurrent JS→Java
      // calls throw "Java code still running, check for a missing 'await'".
      (async function () {
        try {
          var src = getSrc(key);
          var region = await src.getRegion(level, x, y, w, h);
          var bytes = region.data
            ? autoStretchToU8(region.data, src.bitsPerSample || 8, key + '|' + level)
            : new Uint8Array(w * h);
          var javaBytes = new Int8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          // Serialize delivery via a single promise chain.
          window.__tileDeliverTail = (window.__tileDeliverTail || Promise.resolve()).then(async function () {
            try {
              var LIB = window.lib || lib;
              var LazyImagePlus = await LIB.com.hack.viewer.LazyImagePlus;
              await LazyImagePlus.onTileReady(id, javaBytes);
            } catch (e) {
              console.warn('[tile] deliver id=' + id + ' failed:', e && (e.message || e));
            }
          });
        } catch (e) {
          console.warn('[tile] fetch id=' + id + ' failed:', e && (e.stack || e.message || e));
        }
      })();
    }
  };

  // Wrap cheerpjInit --------------------------------------------------------
  if (typeof cheerpjInit !== 'function') {
    console.error('[threadhack-runtime] stock cheerpjInit not defined — stock loader failed?');
    return;
  }
  var realInit = cheerpjInit;
  var DEFAULT_POOL = Math.max(2, Math.min(10, (navigator.hardwareConcurrency || 4)));

  self.cheerpjInit = async function (opts) {
    opts = Object.assign({}, opts || {});
    var poolSize = opts.threadhackPool !== undefined ? opts.threadhackPool : DEFAULT_POOL;
    delete opts.threadhackPool;
    opts.natives = Object.assign({}, threadHookNatives, tileSourceNatives, menuRegistryNatives, opts.natives || {});

    // Install our classloader as the system classloader so plugin jars
    // loaded by ImageJ's internal PluginClassLoader (and any child
    // classloader) delegate to us and get bytecode-rewritten.
    var existingProps = opts.javaProperties || [];
    var hasSysCl = existingProps.some(function (p) { return /^java\\.system\\.class\\.loader=/.test(p); });
    opts.javaProperties = existingProps.concat(hasSysCl ? [] : ['java.system.class.loader=com.hack.ParallelClassLoader']);

    // Pre-warm cheerpj CDN cache
    try {
      await Promise.all([
        'https://cjrtnc.leaningtech.com/4.2/cj3.js',
        'https://cjrtnc.leaningtech.com/4.2/cj3.wasm'
      ].map(function (u) { return fetch(u, { cache: 'force-cache' }).then(function (r) { return r.arrayBuffer(); }); }));
    } catch (_) {}

    var res = await realInit(opts);

    if (poolSize > 0) {
      try { await spawnPool(poolSize); } catch (e) { console.error('[threadhack-runtime] pool failed: ' + e); }
    }

    // Wrap cheerpjRunLibrary NOW (it's only defined after realInit returns).
    if (typeof self.cheerpjRunLibrary === 'function' && !self.cheerpjRunLibrary.__thWrapped) {
      var orig = self.cheerpjRunLibrary;
      self.cheerpjRunLibrary = function (cp) {
        var newCp = (typeof cp === 'string' && cp.indexOf('parallel-tool.jar') === -1)
          ? (toolJarPath + ':' + cp) : cp;
        console.log('[threadhack-runtime] cheerpjRunLibrary: ' + cp + ' → ' + newCp);
        return orig.apply(this, [newCp].concat(Array.prototype.slice.call(arguments, 1)));
      };
      self.cheerpjRunLibrary.__thWrapped = true;
    }
    return res;
  };

  console.log('[threadhack-runtime] ready. Call cheerpjInit(...) as usual. Pool default=' + DEFAULT_POOL + '.');
})();
` + '<\/script>');
})();
