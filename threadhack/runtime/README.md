# threadhack runtime — drop-in CheerpJ 4.2 replacement

Replaces `https://cjrtnc.leaningtech.com/4.2/loader.js` with a loader that:

- Auto-spawns a Web Worker pool (sized to `navigator.hardwareConcurrency`, min 2, max 10)
- Auto-loads a bytecode-rewriting tool jar (`parallel-tool.jar`) onto the CheerpJ classpath
- Injects native hooks so rewritten `Thread.start` / `Executors.*` / `ForkJoinPool.commonPool` / `CompletableFuture.*Async` / `new ThreadPoolExecutor` sites dispatch to the worker pool
- Requires **zero code changes** in the CheerpJ-using application. `cheerpjInit(...)` continues to work unchanged.

## Deployment

1. Copy the contents of this directory to a folder on your web server:
   ```
   /your-app/runtime/
     loader.js
     parallel-tool.jar
     s2-worker.js
   ```
2. In your HTML, change
   ```html
   <script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
   ```
   to
   ```html
   <script src="/your-app/runtime/loader.js"></script>
   ```
3. Everything else stays the same.

## How it works

The loader.js you load does two synchronous `document.write` calls:
1. Pulls in the stock CheerpJ loader from Leaning Tech's CDN (defines `cheerpjInit` and friends as globals).
2. Appends an inline wrapper that:
   - Overrides `cheerpjInit` to inject our natives and spawn the pool after the stock init resolves.
   - Overrides `cheerpjRunLibrary` to prepend `parallel-tool.jar` to the classpath.

Because both scripts run synchronously during HTML parsing, `cheerpjInit` is our wrapped version by the time the host app's `<script type="module">` block runs. No race.

The wrapper reads its own base URL from the outer `<script>` element (before `document.write`) and stores it on `window.__threadhackBase__` so the inline wrapper can locate the tool jar and worker file.

## What gets parallelized

Any Java code in the host app (or its plugins) that uses standard concurrency APIs:

- `new Thread(runnable).start(); t.join();` — if the `Runnable` implements `Serializable`
- `Executors.newFixedThreadPool(n).submit(task)` (plus `newCachedThreadPool`, `newSingleThreadExecutor`, `newWorkStealingPool`)
- `new ThreadPoolExecutor(...).submit(task)` (direct-constructor path, covered by ASM tree-API pre-pass)
- `ForkJoinPool.commonPool().execute(task)` — also catches `CompletableFuture.supplyAsync(supplier)` and `runAsync(runnable)` since those default to the common pool
- `Executors.newScheduledThreadPool(n)` — falls back to a real scheduled executor (scheduled semantics preserved, no parallelization)

Non-Serializable Runnables/Callables fall through to cooperative execution (CheerpJ green threads), unchanged. No regressions.

## What doesn't parallelize

- **ImageJ built-in `PARALLELIZE_STACKS` filters** (Gaussian Blur stack, Median stack, etc.). Reason: `PlugInFilterRunner` uses `new Thread(this, name)` where `this` is itself, holding non-Serializable fields (`GenericDialog`, `Thread previewThread`, `Hashtable<Thread, …>`). Rewrites *apply* (12 sites), but the Runnable can't serialize, so our hook falls through to cooperative. Addressing this requires a targeted ASM method-body rewrite of `processImageUsingThreads` — tracked as future work.
- Any code that shares mutable state across threads via `synchronized(sharedObj)` / `volatile` / `AtomicReference` / `ThreadLocal` where the object isn't owned by the task. Fundamental: each worker JVM has its own heap. Our rewriter emits a `[WARN]` when a class contains both `MONITORENTER`/`MONITOREXIT` and rewritten dispatch calls.

## Options

Pass `threadhackPool: N` to `cheerpjInit` to override the pool size (0 disables the pool entirely, falling back to pure cooperative execution).

```js
await cheerpjInit({
  threadhackPool: 6,      // or 0 to disable
  status: "none",
  javaProperties: ["user.dir=/files"],
});
```

## Measured results

Benchmarks in the parent `threadhack/FINDINGS.md`:

- Worker-pool dispatch: 6.50× speedup on a 10-job / 10-worker CPU-bound bench (Apple M2 Pro, 6P+4E cores)
- Pool reuse across runs: additional 1.3–1.6× via JIT warm-up amortization
- 21 rewrite sites found in stock `ij.jar` across 9 classes

## Caveats & tradeoffs

- `document.write` is technically deprecated but works reliably for script inclusion during initial HTML parsing. For tighter browser policies, swap both `document.write` calls for a synchronous `XMLHttpRequest` + inline `eval`.
- The worker-pool cold start costs ~1 s/worker. Spawned once per page load, then reused across every subsequent `cheerpjInit`-scoped operation.
- The tool jar adds ~280 KB to the app's first-load size (ASM 9.7 shaded). Cached after first load.

## Files

| File | Purpose |
|---|---|
| `loader.js` | Drop-in replacement for stock CheerpJ loader. |
| `parallel-tool.jar` | ASM-based bytecode rewriter + worker-shipping ClassLoader + ExecutorHook / ThreadHook / WorkerFuture / WorkerBackedThreadPoolExecutor / WorkerBackedForkJoinPool. |
| `s2-worker.js` | Worker entry point. Boots its own CheerpJ instance and runs shipped Runnables. |
| `demo.html` + `run-runtime-demo.mjs` | Zero-change end-to-end demo. |
| `original-loader.js` | Reference copy of the stock loader (for diffing). |

## Universal / not ImageJ-specific

Nothing in this loader is specific to ImageJ. It works for any CheerpJ 4.2 app that uses standard Java concurrency APIs. ImageJ plugins that use these APIs (MorphoLibJ's `Executors.newFixedThreadPool` path, Thunder_STORM's `Thread.start` path) parallelize transparently.
