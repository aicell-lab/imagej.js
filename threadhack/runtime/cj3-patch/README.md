# cj3.js-level patch — zero-file-deployment target

**Status:** Architecture + proof-of-concept sketch. Not production-ready.

## Goal

Modify the CheerpJ runtime (`cj3.js`) so a hosting app swaps **only one CDN URL**
and pays **zero** cost for additional hosted files (no `parallel-tool.jar`, no
`s2-worker.js`, etc.). A self-hosted, patched cj3.js that auto-rewrites Java
class bytes as they're being defined.

## Mechanism

1. **Download cj3.js from leaningtech's CDN** (the 642 KB Cheerp-compiled JS bundle).
2. **Identify the class-loading entry point.** From our earlier analysis
   (`FINDINGS.md §1`), the runtime's module-level export `azh` contains
   `cj3SetClassByteCode: cj3SetClassByteCode`. This is called by the JIT
   when a Java class is about to be JIT-compiled into JS.
3. **Monkey-patch it**: wrap the function so incoming class bytes pass
   through a JS-side bytecode rewriter before reaching the original.
4. **JS-side bytecode rewriter** — a minimal implementation that handles
   the specific call-site patterns:
   - `INVOKEVIRTUAL java/lang/Thread.{start,join,interrupt,isAlive}(…)` → `INVOKESTATIC com/hack/ThreadHook.<same>(Thread, …)`
   - `INVOKESTATIC java/util/concurrent/Executors.new{Fixed,Cached,Single,WorkStealing}ThreadPool(…)` → `INVOKESTATIC com/hack/ExecutorHook.<same>(…)`
   - `NEW java/util/concurrent/ThreadPoolExecutor` + `INVOKESPECIAL <init>` → remove NEW/DUP + `INVOKESTATIC ExecutorHook.newThreadPoolExecutor(…)`
   - `INVOKESTATIC java/util/concurrent/ForkJoinPool.commonPool()` → our common-pool static
   - `INVOKESTATIC java/util/concurrent/CompletableFuture.{supplyAsync,runAsync}(single-arg)` → ours

## JS-side bytecode rewriter — what's needed

A Java .class file format parser + minimal editor. Structure:

```
ClassFile {
    magic: 0xCAFEBABE
    minor_version, major_version
    constant_pool_count u2
    constant_pool[] (variable-size entries)
    access_flags u2
    this_class u2
    super_class u2
    interfaces_count u2, interfaces[]
    fields_count u2, fields[]
    methods_count u2, methods[]
    attributes_count u2, attributes[]
}
```

For each method, the `Code` attribute contains the bytecode. Patterns to match are sequences like:

```
Opcode 0xB6 (INVOKEVIRTUAL) ii jj      ; where (ii<<8|jj) is a constant-pool index
```

For our rewrites, the challenge is:
- **Adding new constant-pool entries**: our hooks reference `com/hack/ThreadHook.start(Ljava/lang/Thread;)V`, which probably isn't in the original constant pool. We must append CONSTANT_Class + CONSTANT_NameAndType + CONSTANT_Methodref entries (with correct tag bytes + cross-references).
- **Updating bytecode references**: the new INVOKESTATIC needs to point at our new Methodref index.
- **Preserving StackMapTable frames**: Java 7+ bytecode uses StackMapTable attributes to describe frame types. Adding/removing instructions (like the NEW+DUP removal for TPE) may require recomputing frames. For INVOKEVIRTUAL→INVOKESTATIC, the receiver becomes an argument, stack shape is unchanged — safe.
- **ClassFile length**: all method and attribute size headers need updating after bytecode changes.

**Estimated LOC**: 500-1000 LOC for a minimal rewriter covering our patterns. Reference: java-class-tools, jbytecode-js.

## PoC code sketch (not production)

```js
// runtime/cj3-patch/patched-loader.js
(async function () {
  // 1. Fetch + textually modify cj3.js to expose cj3SetClassByteCode
  const srcUrl = 'https://cjrtnc.leaningtech.com/4.2/cj3.js';
  let src = await fetch(srcUrl).then(r => r.text());

  // 2. Inject an export hook at the point where azh is constructed.
  //    Find "return azh;" at module-exit and add:
  //      azh.__thHooks = { get setClassByteCode() { return cj3SetClassByteCode; },
  //                        set setClassByteCode(fn) { cj3SetClassByteCode = fn; } };
  src = src.replace(/};return azh;\}/, 
      "};azh.__thHooks={get setClassByteCode(){return cj3SetClassByteCode;}," +
      "set setClassByteCode(fn){cj3SetClassByteCode=fn}};return azh;}");

  // 3. Write the modified cj3.js to a Blob URL and redirect imports there.
  const blob = new Blob([src], { type: 'application/javascript' });
  const modifiedUrl = URL.createObjectURL(blob);

  // 4. Override the dynamic import used by the stock loader so it fetches OUR blob.
  //    Need to intercept `import(cj3LoaderPath + '/cj3.js')` — done by patching
  //    cj3LoaderPath before the dynamic import runs.
  // ...

  // 5. After init, install our JS-side rewriter
  const rt = cj3Module.__thHooks;
  const orig = rt.setClassByteCode;
  rt.setClassByteCode = function (classObj, bytes) {
    return orig.call(this, classObj, rewriteClassBytes(bytes));
  };
})();

function rewriteClassBytes(bytes) {
  // Parse constant pool, patch methodrefs, rewrite INVOKE* opcodes
  // ... 500 LOC ...
  return bytes;
}
```

## Tradeoff vs current runtime loader

| Aspect | Current `runtime/loader.js` | `cj3.js` patch |
|---|---|---|
| Files to deploy alongside app | 3 (`loader.js`, `parallel-tool.jar`, `s2-worker.js`) | 1 (`loader.js` that embeds everything) — still need hosted `cj3.js` fork |
| Engineering effort | **Already shipped** | ~1 week (JS bytecode rewriter + test corpus) |
| Coverage | Everything loaded via user classloaders | Everything the JVM JITs (including JDK internals) |
| Risk of breaking JDK | None (JDK excluded by classloader rules) | **High** — rewriting java.util.concurrent.* bytes is dangerous |
| Maintenance vs upstream CheerpJ | Tracks the stock loader wrapper API only | Must track every cj3.js change from leaningtech |

## Recommendation

The current `runtime/loader.js` approach is **good enough for 99% of the goal** (one-URL swap, zero app code changes). The cj3.js patch is a future optimization that shaves 2 hosted files at the cost of ~1 week of engineering + ongoing maintenance.

If pursued, the right order is:

1. Build the JS-side bytecode rewriter (self-contained).
2. Validate it rewrites a small corpus of stock ImageJ classes identically to our ASM-based rewriter.
3. Write the cj3.js monkey-patch wrapper.
4. Do a staged rollout with extensive regression tests.
