import { api, el, fmtDate, fmtSize, setupLightbox, thumbButton } from "./common.js";

// Cumulative size cap per zip file (bytes). A single larger file gets its own zip.
const ZIP_BATCH_BYTES = 1.5 * 1024 * 1024 * 1024;
const SIGN_CHUNK = 500;

const $ = (id) => document.getElementById(id);
const openLightbox = setupLightbox();

let allItems = [];
let filter = "all";
const selected = new Set();

function show(signedIn) {
  $("login-view").hidden = signedIn;
  $("main-view").hidden = !signedIn;
}

function setError(msg) {
  $("admin-error").textContent = msg || "";
}

// ---- login / logout ----
$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("login-error");
  err.textContent = "";
  try {
    await api("admin-login", { method: "POST", body: { password: $("password").value } });
    $("password").value = "";
    show(true);
    await load();
  } catch (ex) {
    err.textContent = ex.status === 401 ? "Wrong password." : ex.message;
  }
});

$("logout-btn").addEventListener("click", async () => {
  try {
    await api("logout", { method: "POST", body: {} });
  } finally {
    allItems = [];
    selected.clear();
    show(false);
  }
});

// ---- listing ----
const visible = () => allItems.filter((i) => filter === "all" || i.visibility === filter);

async function load() {
  setError("");
  try {
    const { items } = await api("admin-list", { query: { visibility: "all" } });
    allItems = items;
    for (const id of [...selected]) if (!items.some((i) => i.id === id)) selected.delete(id);
    render();
  } catch (ex) {
    if (ex.status === 401 || ex.status === 403) show(false);
    else setError(ex.message);
  }
}

function render() {
  const shared = allItems.filter((i) => i.visibility === "shared");
  $("st-total").textContent = String(allItems.length);
  $("st-shared").textContent = String(shared.length);
  $("st-private").textContent = String(allItems.length - shared.length);
  $("st-size").textContent = fmtSize(allItems.reduce((s, i) => s + i.size, 0));

  for (const chip of document.querySelectorAll("#chips .chip")) {
    chip.setAttribute("aria-pressed", String(chip.dataset.filter === filter));
  }

  const items = visible();
  $("gallery").replaceChildren(...items.map(tile));
  $("gallery-empty").hidden = items.length > 0;
  updateSelectionUi();
}

function tile(item) {
  const cb = el("input", { type: "checkbox", class: "sel", "aria-label": `Select ${item.originalName}` });
  cb.checked = selected.has(item.id);
  cb.addEventListener("change", () => {
    if (cb.checked) selected.add(item.id);
    else selected.delete(item.id);
    updateSelectionUi();
  });
  const dl = el("button", {
    type: "button",
    class: "small",
    text: "Download",
    onclick: async (e) => {
      e.currentTarget.disabled = true;
      try {
        const { files } = await api("sign-download", {
          method: "POST",
          body: { ids: [{ id: item.id, visibility: item.visibility }] },
        });
        if (files[0]) triggerLink(files[0].url, files[0].name);
      } catch (ex) {
        setError(ex.message);
      } finally {
        e.currentTarget.disabled = false;
      }
    },
  });
  return el("div", { class: "tile" }, [
    cb,
    el("span", { class: `badge ${item.visibility}`, text: item.visibility }),
    thumbButton(item, () => openLightbox(item)),
    el("div", { class: "info" }, [
      el("span", { class: "who", text: item.uploader }),
      el("span", { class: "mono", text: `${fmtDate(item.createdAt)} · ${fmtSize(item.size)}` }),
      el("div", { class: "actions" }, [dl]),
    ]),
  ]);
}

function updateSelectionUi() {
  const btn = $("dl-selected-btn");
  btn.disabled = selected.size === 0;
  btn.textContent = selected.size ? `Download selected (${selected.size})` : "Download selected";
  const items = visible();
  $("select-all-btn").textContent = items.length && items.every((i) => selected.has(i.id)) ? "Select none" : "Select all";
}

$("chips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  filter = chip.dataset.filter;
  render();
});

$("select-all-btn").addEventListener("click", () => {
  const items = visible();
  if (items.length && items.every((i) => selected.has(i.id))) for (const i of items) selected.delete(i.id);
  else for (const i of items) selected.add(i.id);
  render();
});

$("refresh-btn").addEventListener("click", load);

function triggerLink(url, name) {
  const a = el("a", { href: url, download: name || "" });
  document.body.append(a);
  a.click();
  a.remove();
}

// ---- zip downloads ----
function planBatches(items) {
  const sorted = [...items].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const batches = [];
  let cur = [];
  let size = 0;
  for (const item of sorted) {
    if (cur.length && size + item.size > ZIP_BATCH_BYTES) {
      batches.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(item);
    size += item.size;
  }
  if (cur.length) batches.push(cur);
  return batches;
}

function uniqueName(base, used) {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  const dot = base.lastIndexOf(".");
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : "";
  for (let n = 2; ; n++) {
    const candidate = `${stem} (${n})${ext}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
}

function progressRow(label) {
  const bar = el("i");
  const text = el("span", { class: "hint", text: label });
  $("zip-progress").append(el("div", { class: "row" }, [text, el("div", { class: "bar" }, [bar])]));
  return {
    set(fraction, note) {
      bar.style.width = `${Math.round(Math.min(1, fraction) * 100)}%`;
      text.textContent = note ? `${label} — ${note}` : label;
    },
  };
}

async function signFiles(batch) {
  const files = [];
  for (let i = 0; i < batch.length; i += SIGN_CHUNK) {
    const ids = batch.slice(i, i + SIGN_CHUNK).map((it) => ({ id: it.id, visibility: it.visibility }));
    const res = await api("sign-download", { method: "POST", body: { ids } });
    files.push(...res.files);
  }
  return files;
}

async function saveZipResponse(response, filename) {
  if (window.showSaveFilePicker) {
    let handle = null;
    try {
      handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "Zip archive", accept: { "application/zip": [".zip"] } }],
      });
    } catch (e) {
      if (e && e.name === "AbortError") {
        await response.body.cancel();
        throw e;
      }
      // Usually the picker needs a fresh user gesture (later batches): use the blob fallback.
    }
    if (handle) {
      const writable = await handle.createWritable();
      await response.body.pipeTo(writable);
      return;
    }
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  triggerLink(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

let zipping = false;

async function downloadZips(items) {
  if (zipping || !items.length) return;
  zipping = true;
  setError("");
  $("zip-progress").replaceChildren();
  $("dl-selected-btn").disabled = true;
  $("dl-all-btn").disabled = true;
  try {
    const { downloadZip } = await import("./vendor/client-zip.js");
    const batches = planBatches(items);
    for (let b = 0; b < batches.length; b++) {
      const filename = `tom-dani-wedding-part-${b + 1}-of-${batches.length}.zip`;
      const total = batches[b].reduce((s, i) => s + i.size, 0) || 1;
      const row = progressRow(`Part ${b + 1} of ${batches.length}`);
      row.set(0, "preparing…");
      const files = await signFiles(batches[b]);
      let loaded = 0;
      let finished = 0;
      const used = new Set();

      async function* entries() {
        for (const f of files) {
          const res = await fetch(f.url);
          if (!res.ok || !res.body) throw new Error(`Could not fetch ${f.originalName || f.name} (${res.status})`);
          const counter = new TransformStream({
            transform(chunk, controller) {
              loaded += chunk.byteLength;
              row.set(loaded / total, `${finished}/${files.length} files`);
              controller.enqueue(chunk);
            },
            flush() {
              finished++;
            },
          });
          const day = (f.createdAt || "").slice(0, 10);
          const name = uniqueName(`${day}_${f.name}`.replace(/^_/, ""), used);
          yield {
            name,
            lastModified: f.createdAt ? new Date(f.createdAt) : new Date(),
            input: new Response(res.body.pipeThrough(counter)),
          };
        }
      }

      try {
        await saveZipResponse(downloadZip(entries()), filename);
        row.set(1, "done");
      } catch (e) {
        if (e && e.name === "AbortError") {
          row.set(0, "cancelled");
          break;
        }
        throw e;
      }
    }
  } catch (ex) {
    setError(ex.message || "Download failed");
  } finally {
    zipping = false;
    $("dl-all-btn").disabled = false;
    updateSelectionUi();
  }
}

$("dl-selected-btn").addEventListener("click", () => downloadZips(allItems.filter((i) => selected.has(i.id))));
$("dl-all-btn").addEventListener("click", () => downloadZips(visible()));

// ---- boot ----
(async () => {
  try {
    const s = await api("session");
    show(s.admin);
    if (s.admin) await load();
  } catch {
    show(false);
  }
})();
