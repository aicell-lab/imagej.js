// ============================================================
//   Java .class bytecode rewriter — JS edition
// ============================================================
//  Complete impl for INVOKEVIRTUAL Thread.* → INVOKESTATIC ThreadHook
//  and INVOKESTATIC Executors.newXxx → INVOKESTATIC ExecutorHook.
//
//  Strategy:
//    1. Parse class file.
//    2. Build a mutable constant pool list.
//    3. For each rewrite pattern needed, append new CP entries
//       (Utf8, Class, NameAndType, Methodref) and record the new
//       methodref index keyed by pattern.
//    4. Walk every method's Code attribute. For each INVOKE*
//       opcode whose CP index maps to an original rewrite target,
//       replace opcode byte + CP index.
//    5. Re-serialize the whole class file.
//
//  INVOKEVIRTUAL → INVOKESTATIC preserves stack shape (the receiver
//  was below the args; it now becomes the first arg). No
//  StackMapTable changes needed for THIS specific transformation
//  (args-on-stack are identical).
// ============================================================

(function (global) {
  'use strict';

  const TAG = {
    Utf8: 1, Integer: 3, Float: 4, Long: 5, Double: 6,
    Class: 7, String: 8, Fieldref: 9, Methodref: 10,
    InterfaceMethodref: 11, NameAndType: 12, MethodHandle: 15,
    MethodType: 16, InvokeDynamic: 18, Module: 19, Package: 20,
  };
  const OP = { INVOKEVIRTUAL: 0xB6, INVOKESTATIC: 0xB8 };

  const REWRITES = {
    // INVOKEVIRTUAL Thread.start()V  →  INVOKESTATIC ThreadHook.start(Thread)V
    'java/lang/Thread.start()V':     { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ThreadHook', newName: 'start',     newDesc: '(Ljava/lang/Thread;)V' },
    'java/lang/Thread.join()V':      { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ThreadHook', newName: 'join',      newDesc: '(Ljava/lang/Thread;)V' },
    'java/lang/Thread.join(J)V':     { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ThreadHook', newName: 'join',      newDesc: '(Ljava/lang/Thread;J)V' },
    'java/lang/Thread.join(JI)V':    { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ThreadHook', newName: 'join',      newDesc: '(Ljava/lang/Thread;JI)V' },
    'java/lang/Thread.isAlive()Z':   { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ThreadHook', newName: 'isAlive',   newDesc: '(Ljava/lang/Thread;)Z' },
    'java/lang/Thread.interrupt()V': { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ThreadHook', newName: 'interrupt', newDesc: '(Ljava/lang/Thread;)V' },
    'java/util/concurrent/Executors.newFixedThreadPool(I)Ljava/util/concurrent/ExecutorService;':
      { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ExecutorHook', newName: 'newFixedThreadPool', newDesc: '(I)Ljava/util/concurrent/ExecutorService;' },
    'java/util/concurrent/Executors.newCachedThreadPool()Ljava/util/concurrent/ExecutorService;':
      { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ExecutorHook', newName: 'newCachedThreadPool', newDesc: '()Ljava/util/concurrent/ExecutorService;' },
    'java/util/concurrent/Executors.newSingleThreadExecutor()Ljava/util/concurrent/ExecutorService;':
      { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ExecutorHook', newName: 'newSingleThreadExecutor', newDesc: '()Ljava/util/concurrent/ExecutorService;' },
    'java/util/concurrent/ForkJoinPool.commonPool()Ljava/util/concurrent/ForkJoinPool;':
      { newOp: 'INVOKESTATIC', newOwner: 'com/hack/ExecutorHook', newName: 'forkJoinCommonPool', newDesc: '()Ljava/util/concurrent/ForkJoinPool;' },
  };

  class ByteWriter {
    constructor() { this.chunks = []; this.len = 0; }
    u1(v) { this.chunks.push(new Uint8Array([v & 0xFF])); this.len++; }
    u2(v) { this.chunks.push(new Uint8Array([(v>>>8)&0xFF, v&0xFF])); this.len += 2; }
    u4(v) { this.chunks.push(new Uint8Array([(v>>>24)&0xFF, (v>>>16)&0xFF, (v>>>8)&0xFF, v&0xFF])); this.len += 4; }
    bytes(arr) { this.chunks.push(new Uint8Array(arr)); this.len += arr.length; }
    concat(u8) { this.chunks.push(u8); this.len += u8.length; }
    toUint8Array() {
      const out = new Uint8Array(this.len);
      let o = 0; for (const c of this.chunks) { out.set(c, o); o += c.length; }
      return out;
    }
  }

  class ClassParser {
    constructor(bytes) {
      this.bytes = bytes;
      this.dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      this.off = 0;
    }
    u1() { const v = this.dv.getUint8(this.off); this.off++; return v; }
    u2() { const v = this.dv.getUint16(this.off); this.off += 2; return v; }
    u4() { const v = this.dv.getUint32(this.off); this.off += 4; return v; }
    raw(n) { const out = this.bytes.subarray(this.off, this.off + n); this.off += n; return out; }
  }

  function parseConstantPool(p) {
    const count = p.u2();
    const pool = [null];
    let i = 1;
    while (i < count) {
      const tag = p.u1();
      switch (tag) {
        case TAG.Utf8: { const len = p.u2(); const bytes = p.raw(len); pool[i] = { tag, utf8: new TextDecoder().decode(bytes), _len: len, _bytes: bytes }; break; }
        case TAG.Integer: case TAG.Float: { pool[i] = { tag, val: p.u4() }; break; }
        case TAG.Long: case TAG.Double: { pool[i] = { tag, hi: p.u4(), lo: p.u4() }; i++; pool[i] = null; break; }
        case TAG.Class: case TAG.String: case TAG.MethodType: case TAG.Module: case TAG.Package:
          pool[i] = { tag, ref1: p.u2() }; break;
        case TAG.Fieldref: case TAG.Methodref: case TAG.InterfaceMethodref: case TAG.NameAndType: case TAG.InvokeDynamic:
          pool[i] = { tag, ref1: p.u2(), ref2: p.u2() }; break;
        case TAG.MethodHandle:
          pool[i] = { tag, kind: p.u1(), ref1: p.u2() }; break;
        default: throw new Error('unknown CP tag ' + tag + ' at ' + i);
      }
      i++;
    }
    return pool;
  }

  function methodrefKey(pool, idx) {
    const e = pool[idx];
    if (!e || (e.tag !== TAG.Methodref && e.tag !== TAG.InterfaceMethodref)) return null;
    const cls = pool[e.ref1], nt = pool[e.ref2];
    if (!cls || !nt) return null;
    const clsName = pool[cls.ref1] && pool[cls.ref1].utf8;
    const mName   = pool[nt.ref1]  && pool[nt.ref1].utf8;
    const mDesc   = pool[nt.ref2]  && pool[nt.ref2].utf8;
    if (!clsName || !mName || !mDesc) return null;
    return clsName + '.' + mName + mDesc;
  }

  function addUtf8(pool, str) {
    const enc = new TextEncoder().encode(str);
    pool.push({ tag: TAG.Utf8, utf8: str, _len: enc.length, _bytes: enc });
    return pool.length - 1;
  }
  function addClassRef(pool, name) {
    const nIdx = addUtf8(pool, name);
    pool.push({ tag: TAG.Class, ref1: nIdx });
    return pool.length - 1;
  }
  function addNameAndType(pool, name, desc) {
    const nIdx = addUtf8(pool, name);
    const dIdx = addUtf8(pool, desc);
    pool.push({ tag: TAG.NameAndType, ref1: nIdx, ref2: dIdx });
    return pool.length - 1;
  }
  function addMethodref(pool, owner, name, desc) {
    const cIdx = addClassRef(pool, owner);
    const ntIdx = addNameAndType(pool, name, desc);
    pool.push({ tag: TAG.Methodref, ref1: cIdx, ref2: ntIdx });
    return pool.length - 1;
  }

  function serializeCP(w, pool) {
    w.u2(pool.length);  // count
    for (let i = 1; i < pool.length; i++) {
      const e = pool[i];
      if (!e) continue;  // double-wide slot
      w.u1(e.tag);
      switch (e.tag) {
        case TAG.Utf8: w.u2(e._len); w.concat(e._bytes); break;
        case TAG.Integer: case TAG.Float: w.u4(e.val); break;
        case TAG.Long: case TAG.Double: w.u4(e.hi); w.u4(e.lo); break;
        case TAG.Class: case TAG.String: case TAG.MethodType: case TAG.Module: case TAG.Package:
          w.u2(e.ref1); break;
        case TAG.Fieldref: case TAG.Methodref: case TAG.InterfaceMethodref: case TAG.NameAndType: case TAG.InvokeDynamic:
          w.u2(e.ref1); w.u2(e.ref2); break;
        case TAG.MethodHandle: w.u1(e.kind); w.u2(e.ref1); break;
      }
    }
  }

  // Rewrite pass: takes original class bytes, returns rewritten bytes.
  function rewriteClassBytes(bytes) {
    const p = new ClassParser(bytes);
    const magic = p.u4();
    if (magic !== 0xCAFEBABE) return bytes;
    const minor = p.u2(), major = p.u2();
    const pool = parseConstantPool(p);

    // Find rewrite-target CP indices (original methodrefs)
    const origToNew = new Map();  // origCpIdx → { newCpIdx, newOp }
    for (let i = 1; i < pool.length; i++) {
      const key = methodrefKey(pool, i);
      if (!key) continue;
      const spec = REWRITES[key];
      if (!spec) continue;
      const newIdx = addMethodref(pool, spec.newOwner, spec.newName, spec.newDesc);
      origToNew.set(i, { newIdx, newOp: OP[spec.newOp] });
    }

    if (origToNew.size === 0) return bytes;  // nothing to rewrite

    // Parse rest of class file, rewriting method Code attributes in-place.
    const access_flags = p.u2();
    const this_class = p.u2();
    const super_class = p.u2();
    const ifaceCount = p.u2();
    const ifaces = []; for (let i = 0; i < ifaceCount; i++) ifaces.push(p.u2());

    const fields = readMembers(p, pool);
    const methods = readMembers(p, pool);
    rewriteMethodsInPlace(methods, pool, origToNew);
    const classAttrs = readAttributes(p);

    // Serialize
    const w = new ByteWriter();
    w.u4(0xCAFEBABE); w.u2(minor); w.u2(major);
    serializeCP(w, pool);
    w.u2(access_flags); w.u2(this_class); w.u2(super_class);
    w.u2(ifaceCount); for (const i of ifaces) w.u2(i);
    writeMembers(w, fields);
    writeMembers(w, methods);
    writeAttributes(w, classAttrs);
    return w.toUint8Array();
  }

  function readMembers(p, pool) {
    const count = p.u2();
    const arr = [];
    for (let i = 0; i < count; i++) {
      const access = p.u2(), nameIdx = p.u2(), descIdx = p.u2();
      const attrs = readAttributes(p);
      arr.push({ access, nameIdx, descIdx, attrs });
    }
    return arr;
  }
  function writeMembers(w, members) {
    w.u2(members.length);
    for (const m of members) {
      w.u2(m.access); w.u2(m.nameIdx); w.u2(m.descIdx);
      writeAttributes(w, m.attrs);
    }
  }
  function readAttributes(p) {
    const count = p.u2();
    const out = [];
    for (let i = 0; i < count; i++) {
      const nameIdx = p.u2();
      const len = p.u4();
      const data = p.raw(len);
      out.push({ nameIdx, data: new Uint8Array(data) });  // copy to avoid aliasing
    }
    return out;
  }
  function writeAttributes(w, attrs) {
    w.u2(attrs.length);
    for (const a of attrs) { w.u2(a.nameIdx); w.u4(a.data.length); w.concat(a.data); }
  }

  // Rewrite INVOKEVIRTUAL/STATIC in Code attributes of methods
  function rewriteMethodsInPlace(methods, pool, origToNew) {
    for (const m of methods) {
      for (const a of m.attrs) {
        const name = pool[a.nameIdx] && pool[a.nameIdx].utf8;
        if (name !== 'Code') continue;
        a.data = rewriteCodeAttribute(a.data, origToNew, pool);
      }
    }
  }
  function rewriteCodeAttribute(data, origToNew, pool) {
    // Code attr layout: max_stack u2, max_locals u2, code_length u4, code[code_length], exception_table_length u2, ..., attributes
    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const maxStack = dv.getUint16(0);
    const maxLocals = dv.getUint16(2);
    const codeLen = dv.getUint32(4);
    const codeStart = 8;
    const codeEnd = codeStart + codeLen;

    // Walk bytecode, find INVOKEVIRTUAL/INVOKESTATIC with a target CP idx
    // Opcode tables are complex; for our rewrites we only care about INVOKEVIRTUAL/INVOKESTATIC which are 3 bytes (op + u2 index).
    // But we have to SKIP over other instructions correctly. Use a minimal opcode-length table.
    const newData = new Uint8Array(data);  // copy so we can mutate
    let i = codeStart;
    while (i < codeEnd) {
      const op = newData[i];
      const len = instructionLength(newData, i, codeStart);
      if (op === OP.INVOKEVIRTUAL || op === OP.INVOKESTATIC) {
        const cpIdx = (newData[i+1] << 8) | newData[i+2];
        const rw = origToNew.get(cpIdx);
        if (rw) {
          newData[i] = rw.newOp;
          newData[i+1] = (rw.newIdx >> 8) & 0xFF;
          newData[i+2] = rw.newIdx & 0xFF;
        }
      }
      i += len;
    }
    return newData;
  }

  // Minimal opcode-length table (sufficient for walking bytecode).
  // Covers common Java 8 opcodes. Returns instruction length in bytes.
  const FIXED_LEN = (() => {
    const t = new Uint8Array(256);
    // Default: 1 byte
    for (let i = 0; i < 256; i++) t[i] = 1;
    // 2-byte: bipush, ldc, newarray, aload/astore (non-standard), iload/istore etc with index
    [0x10 /*bipush*/, 0x12 /*ldc*/, 0xBC /*newarray*/, 0x15,0x16,0x17,0x18,0x19 /*iload/lload/fload/dload/aload*/,
     0x36,0x37,0x38,0x39,0x3A /*istore..astore*/, 0xA9 /*ret*/].forEach(o => t[o] = 2);
    // 3-byte: sipush, ldc_w, ldc2_w, iinc, getstatic/putstatic/getfield/putfield, invokevirtual/special/static,
    //         new, anewarray, checkcast, instanceof, ifXxx (branches with u2 offset), goto, jsr
    [0x11 /*sipush*/, 0x13 /*ldc_w*/, 0x14 /*ldc2_w*/, 0x84 /*iinc*/,
     0xB2,0xB3,0xB4,0xB5 /*getstatic..putfield*/, 0xB6,0xB7,0xB8 /*invokevirtual/special/static*/,
     0xBB /*new*/, 0xBD /*anewarray*/, 0xC0 /*checkcast*/, 0xC1 /*instanceof*/,
     0x99,0x9A,0x9B,0x9C,0x9D,0x9E,0x9F,0xA0,0xA1,0xA2,0xA3,0xA4,0xA5,0xA6,0xA7,0xA8 /*ifXxx+goto+jsr*/,
     0xC6,0xC7 /*ifnull, ifnonnull*/].forEach(o => t[o] = 3);
    // 4-byte: multianewarray (index u2 + dimensions u1)
    t[0xC5] = 4;
    // 5-byte: invokeinterface (u2 idx + u1 count + u1 0), invokedynamic (u2 idx + u2 0),
    //         goto_w, jsr_w
    t[0xB9] = 5; t[0xBA] = 5; t[0xC8] = 5; t[0xC9] = 5;
    // wide (0xC4): variable; tableswitch (0xAA) and lookupswitch (0xAB): variable — handled specially
    t[0xC4] = 0; t[0xAA] = 0; t[0xAB] = 0;
    return t;
  })();

  function instructionLength(code, i, codeStart) {
    const op = code[i];
    const fixed = FIXED_LEN[op];
    if (fixed > 0) return fixed;
    if (op === 0xC4) {
      // wide: op + subop + u2 index (+ u2 const for iinc)
      return code[i+1] === 0x84 ? 6 : 4;
    }
    if (op === 0xAA) {  // tableswitch
      // skip to 4-byte boundary
      let p = i + 1;
      while ((p - codeStart) % 4 !== 0) p++;
      const def = p; // default: u4
      const low = (code[p+4]<<24) | (code[p+5]<<16) | (code[p+6]<<8) | code[p+7];
      const high = (code[p+8]<<24) | (code[p+9]<<16) | (code[p+10]<<8) | code[p+11];
      const n = high - low + 1;
      return p + 12 + n * 4 - i;
    }
    if (op === 0xAB) {  // lookupswitch
      let p = i + 1;
      while ((p - codeStart) % 4 !== 0) p++;
      const npairs = (code[p+4]<<24) | (code[p+5]<<16) | (code[p+6]<<8) | code[p+7];
      return p + 8 + npairs * 8 - i;
    }
    return 1;
  }

  // ---- Hook installation: monkey-patch cj3Module.cj3SetClassByteCode ----
  // If user's cj3Module exposes setClassByteCode (needs a patched cj3.js that
  // exports it as window.__cj3_internals__.setClassByteCode), wrap it.
  function installIntoCj3() {
    const ref = global.__cj3_internals__;
    if (!ref || typeof ref.setClassByteCode !== 'function') {
      console.warn('[js-rewriter] cj3 internals not exposed; install a patched cj3.js');
      return false;
    }
    const orig = ref.setClassByteCode;
    ref.setClassByteCode = function (classObj, bytes) {
      try {
        const rewritten = rewriteClassBytes(bytes);
        return orig.call(this, classObj, rewritten);
      } catch (e) {
        console.error('[js-rewriter] rewrite failed, passing through: ' + e);
        return orig.call(this, classObj, bytes);
      }
    };
    console.log('[js-rewriter] installed hook into cj3Module.cj3SetClassByteCode');
    return true;
  }

  global.__threadhackJsRewriter__ = { rewriteClassBytes, installIntoCj3, REWRITES };
})(typeof globalThis !== 'undefined' ? globalThis : window);
