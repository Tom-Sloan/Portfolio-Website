// Custom multipart uploader: presigned part uploads straight to R2, resumable.
import { api, ApiError } from "./common.js";
import { makeThumb } from "./thumbs.js";

const PART_CONCURRENCY = 3;
const MAX_ATTEMPTS = 5;
const SIGN_BATCH = 50;
const STATE_PREFIX = "wedding-upload:";
const STATE_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

const MAX_THUMB_BYTES = 300 * 1024;
const THUMB_TIMEOUT_MS = 15000;
// Thumbnail attempts, smallest-effort first; the server rejects anything over 300 KB.
const THUMB_ATTEMPTS = [
  { maxEdge: 480, quality: 0.8 },
  { maxEdge: 480, quality: 0.6 },
  { maxEdge: 320, quality: 0.6 },
];

const fingerprintOf = (file) => `${file.name}|${file.size}|${file.lastModified}`;

// Every upload call carries the key, uploadId, declared size and the token bound to all three.
const authOf = (state, file) => ({ key: state.key, uploadId: state.uploadId, token: state.token, size: file.size });

function loadState(fp) {
  try {
    const raw = localStorage.getItem(STATE_PREFIX + fp);
    if (!raw) return null;
    const state = JSON.parse(raw);
    if (!state || Date.now() - (state.savedAt || 0) > STATE_MAX_AGE_MS) {
      localStorage.removeItem(STATE_PREFIX + fp);
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    state.savedAt = state.savedAt || Date.now();
    localStorage.setItem(STATE_PREFIX + state.fingerprint, JSON.stringify(state));
  } catch {
    // storage full or unavailable: resume across reloads simply won't work
  }
}

function clearState(fp) {
  try {
    localStorage.removeItem(STATE_PREFIX + fp);
  } catch {
    // ignore
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function waitOnline() {
  if (navigator.onLine) return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("online", () => resolve(), { once: true }));
}

function putPart(url, blob, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.ontimeout = () => reject(new Error("Timeout"));
    xhr.onabort = () => reject(new Error("Aborted"));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader("ETag");
        if (!etag) {
          const err = new Error("Upload storage did not return an ETag (check CORS ExposeHeaders)");
          err.fatal = true;
          reject(err);
          return;
        }
        resolve(etag);
      } else {
        const err = new Error(`Part upload failed (${xhr.status})`);
        err.status = xhr.status;
        reject(err);
      }
    };
    xhr.send(blob);
  });
}

export function createUploader() {
  const listeners = new Map();
  const queue = [];
  let running = false;
  let nextId = 1;

  const on = (event, fn) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
    return () => listeners.get(event).delete(fn);
  };
  const emit = (event, task) => {
    for (const fn of listeners.get(event) || []) {
      try {
        fn(task);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const update = (task, patch) => {
    Object.assign(task, patch);
    emit("update", task);
  };

  window.addEventListener("offline", () => {
    for (const t of queue) if (t.status === "uploading") update(t, { status: "paused" });
    if (current && current.status === "uploading") update(current, { status: "paused" });
  });
  window.addEventListener("online", () => {
    if (current && current.status === "paused") update(current, { status: "uploading" });
  });

  let current = null;

  async function startOrResume(task) {
    const { file } = task;
    const fp = fingerprintOf(file);
    let state = loadState(fp);
    let done = new Map(); // partNumber -> ETag

    if (state && state.visibility !== task.visibility) {
      // The saved upload targets a different visibility; start over.
      api("presign", { method: "POST", body: { action: "abort", ...authOf(state, file) } }).catch(() => {});
      clearState(fp);
      state = null;
    }

    if (state) {
      try {
        const { parts } = await api("presign", {
          method: "POST",
          body: { action: "list-parts", ...authOf(state, file) },
        });
        for (const p of parts) {
          const expected = Math.min(state.partSize, file.size - (p.PartNumber - 1) * state.partSize);
          if (p.Size === expected) done.set(p.PartNumber, p.ETag);
        }
        task.caption = state.caption;
      } catch (e) {
        if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
          clearState(fp);
          state = null;
          done = new Map();
        } else {
          throw e;
        }
      }
    }

    if (!state) {
      const created = await api("presign", {
        method: "POST",
        body: {
          action: "create",
          filename: file.name,
          size: file.size,
          visibility: task.visibility,
          uploader: task.uploader,
          caption: task.caption || undefined,
        },
      });
      state = {
        fingerprint: fp,
        id: created.id,
        key: created.key,
        uploadId: created.uploadId,
        token: created.token,
        partSize: created.partSize,
        partCount: created.partCount,
        visibility: task.visibility,
        uploader: task.uploader,
        caption: task.caption || "",
        parts: {},
        savedAt: Date.now(),
      };
      saveState(state);
    }
    return { state, done };
  }

  async function uploadParts(task, state, done) {
    const { file } = task;
    const total = file.size;
    const partBytes = (n) => Math.min(state.partSize, total - (n - 1) * state.partSize);
    const inFlight = new Map(); // partNumber -> bytes loaded
    const report = () => {
      let sum = 0;
      for (const n of done.keys()) sum += partBytes(n);
      for (const v of inFlight.values()) sum += v;
      update(task, { progress: Math.min(1, sum / total) });
    };

    const missing = [];
    for (let n = 1; n <= state.partCount; n++) if (!done.has(n)) missing.push(n);

    const urls = new Map();
    const batches = new Map();
    const signBatch = (index) => {
      if (!batches.has(index)) {
        const nums = missing.slice(index * SIGN_BATCH, (index + 1) * SIGN_BATCH);
        batches.set(
          index,
          api("presign", {
            method: "POST",
            body: { action: "sign-parts", ...authOf(state, file), partNumbers: nums },
          }).then((res) => {
            for (const [k, v] of Object.entries(res.urls)) urls.set(Number(k), v);
          }),
        );
        batches.get(index).catch(() => batches.delete(index));
      }
      return batches.get(index);
    };
    const resign = async (n) => {
      const res = await api("presign", {
        method: "POST",
        body: { action: "sign-parts", ...authOf(state, file), partNumbers: [n] },
      });
      urls.set(n, res.urls[String(n)]);
    };

    let cursor = 0;
    report();

    async function uploadOne(n, index) {
      const blob = file.slice((n - 1) * state.partSize, (n - 1) * state.partSize + partBytes(n));
      let attempt = 0;
      let forceResign = false;
      for (;;) {
        await waitOnline();
        try {
          if (forceResign) {
            await resign(n);
            forceResign = false;
          } else if (!urls.has(n)) {
            await signBatch(Math.floor(index / SIGN_BATCH));
          }
          inFlight.set(n, 0);
          const etag = await putPart(urls.get(n), blob, (loaded) => {
            inFlight.set(n, loaded);
            report();
          });
          inFlight.delete(n);
          done.set(n, etag);
          state.parts[n] = etag;
          saveState(state);
          report();
          return;
        } catch (e) {
          inFlight.delete(n);
          report();
          if (e.fatal || (e instanceof ApiError && e.status >= 400 && e.status < 500 && e.status !== 429)) throw e;
          if (!navigator.onLine) continue; // offline: wait, don't burn an attempt
          attempt++;
          if (attempt >= MAX_ATTEMPTS) throw e;
          if (e.status === 403) forceResign = true; // probably an expired URL
          await sleep(Math.min(15000, 1000 * 2 ** (attempt - 1)));
        }
      }
    }

    async function worker() {
      while (cursor < missing.length) {
        const index = cursor++;
        await uploadOne(missing[index], index);
      }
    }
    await Promise.all(Array.from({ length: Math.min(PART_CONCURRENCY, missing.length) }, worker));
  }

  async function uploadThumbInner(task, state, signal) {
    let blob = null;
    for (const opts of THUMB_ATTEMPTS) {
      blob = await makeThumb(task.file, opts);
      if (!blob || blob.size <= MAX_THUMB_BYTES) break;
    }
    if (!blob || blob.size > MAX_THUMB_BYTES) return;
    const auth = authOf(state, task.file);
    await fetch("/api/wedding/thumb", {
      method: "POST",
      credentials: "same-origin",
      signal,
      headers: {
        "Content-Type": "image/jpeg",
        "x-upload-key": auth.key,
        "x-upload-id": auth.uploadId,
        "x-upload-size": String(auth.size),
        "x-upload-token": auth.token,
      },
      body: blob,
    });
  }

  // Best effort: never throws, never takes longer than THUMB_TIMEOUT_MS.
  async function uploadThumb(task, state) {
    const ctrl = new AbortController();
    let timer;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => {
        ctrl.abort();
        resolve();
      }, THUMB_TIMEOUT_MS);
    });
    try {
      await Promise.race([uploadThumbInner(task, state, ctrl.signal), timeout]);
    } catch {
      // thumbnails are best effort
    } finally {
      clearTimeout(timer);
    }
  }

  async function runTask(task) {
    current = task;
    update(task, { status: navigator.onLine ? "uploading" : "paused", error: null, progress: task.progress || 0 });
    let state = null;
    try {
      const started = await startOrResume(task);
      state = started.state;
      await uploadParts(task, state, started.done);
      const parts = [...started.done.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([PartNumber, ETag]) => ({ PartNumber, ETag }));
      await api("presign", {
        method: "POST",
        body: { action: "complete", ...authOf(state, task.file), parts, caption: state.caption },
      });
      clearState(state.fingerprint);
      update(task, { status: "done", progress: 1 });
    } catch (e) {
      update(task, { status: "failed", error: e && e.message ? e.message : "Upload failed" });
      state = null;
    }
    current = null;
    if (task.status === "done" && state) {
      await uploadThumb(task, state);
      emit("settled", task);
    }
  }

  async function pump() {
    if (running) return;
    running = true;
    while (queue.length) {
      const task = queue.shift();
      await runTask(task);
    }
    running = false;
  }

  function add(files, { visibility, uploader, caption }) {
    const tasks = [];
    for (const file of files) {
      const task = {
        id: nextId++,
        file,
        visibility,
        uploader,
        caption: caption || "",
        status: "queued",
        progress: 0,
        error: null,
      };
      tasks.push(task);
      queue.push(task);
      emit("update", task);
    }
    pump();
    return tasks;
  }

  function retry(task) {
    if (task.status !== "failed") return;
    update(task, { status: "queued", error: null });
    queue.push(task);
    pump();
  }

  return { on, add, retry };
}
