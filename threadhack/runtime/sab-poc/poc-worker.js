// SAB POC worker — reads the shared bytes, writes a signature byte,
// signals completion via Atomics.

self.onmessage = (e) => {
  const { sab, ctrlSab, offset, length, workerId } = e.data;
  const view = new Uint8Array(sab);
  const ctrl = new Int32Array(ctrlSab);

  // Read a chunk (no copy — this is a view over shared memory)
  let checksum = 0;
  for (let i = offset; i < offset + length; i++) checksum = (checksum + view[i]) | 0;

  // Write signature byte to the first byte of our region
  view[offset] = 0xA0 + workerId;

  // Signal "one more worker done" via atomic add
  Atomics.add(ctrl, 0, 1);

  self.postMessage({ workerId, checksum });
};
