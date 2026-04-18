# SharedArrayBuffer POC — zero-copy pixel sharing

**Status**: Minimal proof of concept. Demonstrates the mechanism; not wired into the CheerpJ bytecode rewriter yet.

## Goal

Show that worker JVMs can READ the same pixel bytes via a `SharedArrayBuffer` with zero copy, avoiding the ~1-2 ms structured-clone cost per postMessage for large pixel arrays.

## Mechanism

1. Main page creates a `SharedArrayBuffer` of N bytes (N = image pixels).
2. Fills it with pixel data.
3. Creates `Uint8Array` view over the SAB.
4. Spawns worker(s), transfers SAB handle via `postMessage` (SAB is transferable).
5. Workers create their own `Uint8Array` view over the same SAB → they see the SAME bytes.
6. Optional: coordination via `Atomics.wait`/`Atomics.notify` on a small int32 control buffer.

## Required HTTP headers

Hosting page must set:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Every fetched subresource (CheerpJ CDN, worker scripts, jars) must include:
```
Cross-Origin-Resource-Policy: cross-origin
```
or be same-origin.

Without these, `SharedArrayBuffer` is disabled by the browser (this is a post-Spectre mitigation). The CheerpJ CDN (leaningtech) does NOT currently emit CORP headers, so self-hosting CheerpJ runtime is required.

## What's demonstrated in `poc.html`

- Main allocates SAB of size 1 MiB.
- Writes a ramp pattern.
- Spawns 4 workers with SAB transferred.
- Each worker reads the ramp + writes to its assigned 256 KB region.
- Main reads back: sees workers' writes in-place.
- Timing comparison vs equivalent postMessage-copy approach.

## What's NOT demonstrated (the hard part)

**Tying SAB into CheerpJ's Java `byte[]`**. CheerpJ allocates `byte[]` as a JS object with a `.d` property that's a `Uint8Array`. For a Java `byte[]` to be backed by a SAB view, we'd need CheerpJ runtime cooperation to accept a custom-backed TypedArray, OR a custom `ij.process.SharedByteProcessor` that wraps a SAB view without going through standard `byte[]` semantics. Neither exists yet.

Estimated work to ship end-to-end:
- Patch CheerpJ runtime to accept SAB-backed `byte[]`: weeks (requires Leaning Tech).
- Write custom `SharedByteProcessor` subclass + convince filters to use it: ~1 week.
- Workers + runtime loader coordination: ~2 days.
- COOP/COEP header deployment: coordination with Leaning Tech CDN.

## Files

- `poc.html` — bare demo of SAB + workers (no CheerpJ).
- `poc-worker.js` — worker that reads/writes shared bytes.
- `README.md` — this file.
