// file-browser.js — HTML file browser used as the File > Open / Save backend.
//
// Exposes window.hfs with two methods:
//   hfs.open({ title, dir, types }) -> Promise<path|null>
//   hfs.save({ title, dir, name, types }) -> Promise<path|null>
//
// Files live in CheerpJ's virtual FS. The dialog currently knows two roots:
//   /files/   ← window.nativeFS (showDirectoryPicker mount; read + write)
//   /local/   ← window.localFS (drag-drop or showOpenFilePicker upload)
//
// Design notes (per user feedback):
//   • Look like a native OS dialog. System font, plain chrome, no brand colors.
//   • Fully usable on phones (44 px touch targets, single-column on narrow).
//   • Double-click (or double-tap) a file to open it. "Open" button for
//     accessibility + desktop habits.
//   • "Mount another folder…" triggers showDirectoryPicker and refreshes.
//   • "Pick a single file…" triggers showOpenFilePicker / <input type=file>
//     when user wants a one-off without mounting.

(function () {
  const DIALOG_ID = "hfsDialog";

  // ---- DOM construction ----------------------------------------------------
  function buildDialog() {
    if (document.getElementById(DIALOG_ID)) return;
    const wrap = document.createElement("div");
    wrap.id = DIALOG_ID;
    wrap.innerHTML = `
      <div class="hfs-backdrop" data-hfs-close></div>
      <div class="hfs-panel" role="dialog" aria-modal="true" aria-labelledby="hfsTitle">
        <header class="hfs-titlebar">
          <div class="hfs-title" id="hfsTitle">Open</div>
          <button type="button" class="hfs-close" data-hfs-close aria-label="Close">×</button>
        </header>
        <div class="hfs-toolbar">
          <button type="button" class="hfs-up" data-hfs-up title="Up">↑</button>
          <div class="hfs-breadcrumb" data-hfs-crumb></div>
        </div>
        <ul class="hfs-list" data-hfs-list role="listbox" aria-label="Files"></ul>
        <div class="hfs-empty" data-hfs-empty hidden>
          <p>No folder mounted yet.</p>
          <p class="hfs-hint">Click <b>Mount folder…</b> to point this dialog at a folder on your computer, or <b>Pick file…</b> to import one file.</p>
        </div>
        <div class="hfs-filenamerow" data-hfs-filenamerow>
          <label>Name <input type="text" class="hfs-filename" data-hfs-name></label>
        </div>
        <footer class="hfs-footer">
          <button type="button" class="hfs-btn hfs-secondary" data-hfs-mount>Mount folder…</button>
          <button type="button" class="hfs-btn hfs-secondary" data-hfs-pick>Pick file…</button>
          <span class="hfs-spacer"></span>
          <button type="button" class="hfs-btn" data-hfs-cancel>Cancel</button>
          <button type="button" class="hfs-btn hfs-primary" data-hfs-ok>Open</button>
        </footer>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  function injectStyles() {
    if (document.getElementById("hfsStyle")) return;
    const s = document.createElement("style");
    s.id = "hfsStyle";
    s.textContent = `
      #${DIALOG_ID} {
        position: fixed; inset: 0; z-index: 100000;
        display: none; font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #1f2937;
      }
      #${DIALOG_ID}.hfs-open { display: flex; align-items: center; justify-content: center; }
      .hfs-backdrop { position: absolute; inset: 0; background: rgba(17,24,39,0.42); }
      .hfs-panel {
        position: relative;
        background: #f3f4f6;
        width: 560px; max-width: calc(100vw - 24px);
        height: 520px; max-height: calc(100vh - 24px);
        border-radius: 8px;
        box-shadow: 0 20px 50px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08);
        display: flex; flex-direction: column; overflow: hidden;
      }
      .hfs-titlebar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px; background: #e5e7eb; border-bottom: 1px solid #d1d5db;
      }
      .hfs-title { font-weight: 600; font-size: 13px; }
      .hfs-close {
        width: 24px; height: 24px; border: none; background: transparent;
        font-size: 18px; line-height: 1; cursor: pointer; color: #6b7280;
        border-radius: 4px;
      }
      .hfs-close:hover { background: rgba(0,0,0,0.06); color: #111827; }
      .hfs-toolbar {
        display: flex; align-items: center; gap: 6px;
        padding: 6px 10px; background: #ffffff; border-bottom: 1px solid #e5e7eb;
      }
      .hfs-up {
        width: 28px; height: 28px; border: 1px solid #d1d5db; background: #fff;
        border-radius: 4px; font-size: 14px; cursor: pointer; color: #374151;
      }
      .hfs-up:hover { background: #f3f4f6; }
      .hfs-up:disabled { opacity: 0.35; cursor: not-allowed; }
      .hfs-breadcrumb {
        flex: 1; min-width: 0; overflow: hidden; white-space: nowrap;
        text-overflow: ellipsis; font-size: 12px; color: #6b7280;
        direction: rtl; text-align: left;
      }
      .hfs-breadcrumb .hfs-crumb {
        cursor: pointer; padding: 2px 4px; border-radius: 3px; direction: ltr;
      }
      .hfs-breadcrumb .hfs-crumb:hover { background: #f3f4f6; color: #111827; }
      .hfs-breadcrumb .hfs-crumb-sep { color: #9ca3af; }
      .hfs-list {
        flex: 1; margin: 0; padding: 0; list-style: none; overflow-y: auto;
        background: #fff;
      }
      .hfs-empty {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        justify-content: center; padding: 24px; background: #fff;
        color: #6b7280; text-align: center;
      }
      .hfs-empty p { margin: 6px 0; }
      .hfs-empty .hfs-hint { font-size: 12px; }
      .hfs-item {
        display: grid; grid-template-columns: 20px 1fr auto auto;
        align-items: center; gap: 10px;
        padding: 6px 14px; cursor: default; user-select: none;
        border-bottom: 1px solid #f3f4f6; min-height: 32px;
      }
      .hfs-item[aria-selected="true"] { background: #dbeafe; }
      .hfs-item:hover { background: #eff6ff; }
      .hfs-item[aria-selected="true"]:hover { background: #bfdbfe; }
      .hfs-icon { font-size: 14px; text-align: center; }
      .hfs-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hfs-size, .hfs-date { color: #6b7280; font-size: 11px; white-space: nowrap; }
      .hfs-filenamerow {
        padding: 8px 12px; background: #fff; border-top: 1px solid #e5e7eb;
      }
      .hfs-filenamerow label { display: flex; align-items: center; gap: 8px; }
      .hfs-filename {
        flex: 1; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px;
        font: inherit;
      }
      .hfs-filename:focus { outline: 2px solid #3b82f6; outline-offset: -1px; }
      .hfs-footer {
        display: flex; align-items: center; gap: 8px; padding: 10px 12px;
        background: #e5e7eb; border-top: 1px solid #d1d5db;
      }
      .hfs-spacer { flex: 1; }
      .hfs-btn {
        min-height: 28px; padding: 4px 14px; font: inherit; cursor: pointer;
        border: 1px solid #d1d5db; border-radius: 4px; background: #fff;
        color: #111827;
      }
      .hfs-btn:hover { background: #f9fafb; }
      .hfs-btn.hfs-primary {
        background: #2563eb; border-color: #1d4ed8; color: #fff;
      }
      .hfs-btn.hfs-primary:hover { background: #1d4ed8; }
      .hfs-btn.hfs-primary:disabled { background: #93c5fd; border-color: #93c5fd; cursor: not-allowed; }
      .hfs-btn.hfs-secondary { font-size: 12px; padding: 4px 10px; }

      @media (max-width: 640px) {
        .hfs-panel { width: calc(100vw - 16px); height: calc(100vh - 16px); max-height: none; border-radius: 10px; }
        .hfs-close { width: 32px; height: 32px; font-size: 22px; }
        .hfs-up { width: 36px; height: 36px; font-size: 18px; }
        .hfs-item { padding: 10px 14px; min-height: 44px; font-size: 14px; }
        .hfs-filename { padding: 10px; font-size: 16px; }
        .hfs-btn { min-height: 40px; padding: 8px 16px; }
        .hfs-footer { flex-wrap: wrap; }
        .hfs-footer .hfs-btn.hfs-secondary { flex: 1 0 45%; }
      }
    `;
    document.head.appendChild(s);
  }

  // ---- Virtual-FS access ---------------------------------------------------
  // A "root" maps a prefix like "/files/" to either a FileSystemDirectoryHandle
  // (native-FS mounted folder) or our localFS key-value store. Each root knows
  // how to list a path's children.

  function getRoots() {
    const roots = [];
    if (window.nativeFS && window.nativeFS.directoryHandle) {
      roots.push({ kind: "nativeFS", prefix: "/files", label: "/files (mounted)" });
    }
    if (window.localFS) {
      const hasAny = [...window.localFS.files.keys()].length > 0 || window.localFS.directories.size > 0;
      if (hasAny) roots.push({ kind: "localFS", prefix: "/local", label: "/local (drag-drop)" });
    }
    return roots;
  }

  // Relative path inside a root.
  function splitPath(path, prefix) {
    if (!path.startsWith(prefix)) return null;
    const rest = path.slice(prefix.length).replace(/^\/+/, "");
    return rest;
  }

  async function listDir(root, relPath) {
    if (root.kind === "nativeFS") {
      let dh = window.nativeFS.directoryHandle;
      if (relPath) {
        for (const part of relPath.split("/").filter(Boolean)) {
          dh = await dh.getDirectoryHandle(part).catch(() => null);
          if (!dh) return [];
        }
      }
      const out = [];
      for await (const [name, entry] of dh.entries()) {
        if (entry.kind === "directory") out.push({ name, kind: "dir" });
        else {
          const f = await entry.getFile().catch(() => null);
          out.push({ name, kind: "file", size: f ? f.size : 0, mtime: f ? f.lastModified : 0 });
        }
      }
      return sortEntries(out);
    }
    if (root.kind === "localFS") {
      const entries = window.localFS.listDirectory(relPath || "");
      const out = entries.map(e => {
        if (e.isDirectory) return { name: e.name, kind: "dir" };
        const f = window.localFS.getFile((relPath ? relPath + "/" : "") + e.name);
        return { name: e.name, kind: "file", size: f ? f.size : 0, mtime: f ? f.lastModified : 0 };
      });
      return sortEntries(out);
    }
    return [];
  }

  function sortEntries(arr) {
    return arr.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  function formatSize(n) {
    if (!n && n !== 0) return "";
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + " MB";
    return (n / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  function formatDate(ms) {
    if (!ms) return "";
    const d = new Date(ms);
    const now = new Date();
    const oneDay = 24 * 3600 * 1000;
    if (now - d < oneDay && now.getDate() === d.getDate()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  }

  // ---- Pick-single-file → /local/ (one-off upload) -------------------------
  async function pickSingleFile() {
    if (!window.localFS) return null;
    let file = null;
    if (window.showOpenFilePicker) {
      try {
        const [h] = await window.showOpenFilePicker({ multiple: false });
        file = await h.getFile();
      } catch { return null; }
    } else {
      // Fallback: <input type="file">
      file = await new Promise(resolve => {
        const input = document.createElement("input");
        input.type = "file";
        input.addEventListener("change", () => {
          resolve(input.files[0] || null);
        }, { once: true });
        input.click();
      });
    }
    if (!file) return null;
    await window.localFS.addFile(file, file.name);
    return "/local/" + file.name;
  }

  // ---- Dialog controller ---------------------------------------------------
  const state = {
    mode: "open",      // "open" | "save"
    root: null,        // { kind, prefix, label }
    relPath: "",       // path inside current root
    selected: null,    // entry object
    resolve: null,
    typeFilter: null,
  };

  function show(opts) {
    buildDialog(); injectStyles();
    return new Promise(resolve => {
      state.resolve = resolve;
      state.mode = opts.mode || "open";
      state.typeFilter = opts.types || null;

      const el = document.getElementById(DIALOG_ID);
      el.classList.add("hfs-open");
      el.querySelector("#hfsTitle").textContent = opts.title
        || (state.mode === "save" ? "Save" : "Open");
      el.querySelector("[data-hfs-ok]").textContent = state.mode === "save" ? "Save" : "Open";
      const nameInput = el.querySelector("[data-hfs-name]");
      nameInput.value = opts.name || "";
      el.querySelector("[data-hfs-filenamerow]").style.display =
        state.mode === "save" ? "" : "none";

      // Pick initial root/path from the suggested dir if possible.
      const roots = getRoots();
      state.root = roots[0] || null;
      state.relPath = "";
      if (opts.dir) {
        for (const r of roots) {
          const rel = splitPath(opts.dir.replace(/\/$/, ""), r.prefix);
          if (rel != null) { state.root = r; state.relPath = rel; break; }
        }
      }

      wireEvents();
      render();
    });
  }

  function finish(path) {
    const el = document.getElementById(DIALOG_ID);
    if (el) el.classList.remove("hfs-open");
    const resolve = state.resolve;
    state.resolve = null;
    state.selected = null;
    if (resolve) resolve(path);
  }

  function wireEvents() {
    const el = document.getElementById(DIALOG_ID);
    if (el.__hfsWired) return;
    el.__hfsWired = true;
    el.addEventListener("click", async (e) => {
      const t = e.target;
      if (t.matches("[data-hfs-close], [data-hfs-cancel]")) { finish(null); return; }
      if (t.matches("[data-hfs-up]")) { goUp(); return; }
      if (t.closest(".hfs-crumb")) {
        const idx = parseInt(t.closest(".hfs-crumb").dataset.idx, 10);
        const parts = state.relPath.split("/").filter(Boolean);
        state.relPath = parts.slice(0, idx).join("/");
        render();
        return;
      }
      if (t.matches("[data-hfs-mount]")) {
        if (window.nativeFS) await window.nativeFS.loadDirectory();
        // Re-pick root
        const roots = getRoots();
        state.root = roots[0] || null;
        state.relPath = "";
        render();
        return;
      }
      if (t.matches("[data-hfs-pick]")) {
        const p = await pickSingleFile();
        if (p) finish(p);
        return;
      }
      if (t.matches("[data-hfs-ok]")) {
        commit();
        return;
      }
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") finish(null);
      else if (e.key === "Enter" && e.target.closest(".hfs-filename")) {
        e.preventDefault(); commit();
      }
    });
  }

  function goUp() {
    if (!state.relPath) return;
    const parts = state.relPath.split("/").filter(Boolean);
    parts.pop();
    state.relPath = parts.join("/");
    state.selected = null;
    render();
  }

  function commit() {
    if (state.mode === "save") {
      const el = document.getElementById(DIALOG_ID);
      const name = el.querySelector("[data-hfs-name]").value.trim();
      if (!name || !state.root) return;
      const path = state.root.prefix
        + (state.relPath ? "/" + state.relPath : "")
        + "/" + name;
      finish(path);
      return;
    }
    // Open mode: need a selected file.
    if (state.selected && state.selected.kind === "file") {
      const path = state.root.prefix
        + (state.relPath ? "/" + state.relPath : "")
        + "/" + state.selected.name;
      finish(path);
    }
  }

  async function render() {
    const el = document.getElementById(DIALOG_ID);
    const list = el.querySelector("[data-hfs-list]");
    const empty = el.querySelector("[data-hfs-empty]");
    const up = el.querySelector("[data-hfs-up]");

    // Breadcrumb.
    const crumb = el.querySelector("[data-hfs-crumb]");
    crumb.innerHTML = "";
    if (state.root) {
      const rootSpan = document.createElement("span");
      rootSpan.className = "hfs-crumb";
      rootSpan.dataset.idx = "0";
      rootSpan.textContent = state.root.label;
      crumb.appendChild(rootSpan);
      const parts = state.relPath ? state.relPath.split("/").filter(Boolean) : [];
      parts.forEach((p, i) => {
        const sep = document.createElement("span");
        sep.className = "hfs-crumb-sep"; sep.textContent = " › ";
        crumb.appendChild(sep);
        const s = document.createElement("span");
        s.className = "hfs-crumb";
        s.dataset.idx = String(i + 1);
        s.textContent = p;
        crumb.appendChild(s);
      });
    }
    up.disabled = !state.relPath;

    // Empty state?
    if (!state.root) {
      list.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    // List contents.
    let entries = await listDir(state.root, state.relPath);
    if (state.typeFilter && state.mode === "open") {
      const rx = new RegExp("\\.(?:" + state.typeFilter.join("|") + ")$", "i");
      entries = entries.filter(e => e.kind === "dir" || rx.test(e.name));
    }
    list.innerHTML = "";
    for (const e of entries) {
      const li = document.createElement("li");
      li.className = "hfs-item";
      li.setAttribute("role", "option");
      li.dataset.name = e.name;
      li.dataset.kind = e.kind;
      li.innerHTML = `
        <span class="hfs-icon">${e.kind === "dir" ? "📁" : "📄"}</span>
        <span class="hfs-name"></span>
        <span class="hfs-size">${e.kind === "file" ? formatSize(e.size) : ""}</span>
        <span class="hfs-date">${e.kind === "file" ? formatDate(e.mtime) : ""}</span>
      `;
      li.querySelector(".hfs-name").textContent = e.name;
      li.addEventListener("click", () => selectItem(li, e));
      li.addEventListener("dblclick", () => {
        if (e.kind === "dir") { enterDir(e.name); }
        else {
          state.selected = e;
          commit();
        }
      });
      list.appendChild(li);
    }
  }

  function selectItem(li, e) {
    document.querySelectorAll("#" + DIALOG_ID + " [aria-selected=\"true\"]")
      .forEach(x => x.setAttribute("aria-selected", "false"));
    li.setAttribute("aria-selected", "true");
    state.selected = e;
    if (state.mode === "save" && e.kind === "file") {
      const el = document.getElementById(DIALOG_ID);
      el.querySelector("[data-hfs-name]").value = e.name;
    }
  }

  function enterDir(name) {
    state.relPath = state.relPath ? state.relPath + "/" + name : name;
    state.selected = null;
    render();
  }

  window.hfs = {
    open:  (opts) => show({ ...opts, mode: "open" }),
    save:  (opts) => show({ ...opts, mode: "save" }),
  };
})();
