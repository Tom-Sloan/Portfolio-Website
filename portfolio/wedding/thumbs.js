// Client-side thumbnail generation. makeThumb(file) -> Promise<Blob|null>

const MAX_EDGE = 480;
const QUALITY = 0.8;
const VIDEO_TIMEOUT_MS = 8000;

function extOf(name) {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

function isHeic(file) {
  const t = (file.type || "").toLowerCase();
  return t === "image/heic" || t === "image/heif" || ["heic", "heif"].includes(extOf(file.name));
}

function isVideo(file) {
  return (file.type || "").startsWith("video/") || ["mov", "mp4", "m4v", "webm"].includes(extOf(file.name));
}

function drawToBlob(source, width, height, opts = {}) {
  const maxEdge = opts.maxEdge || MAX_EDGE;
  const quality = opts.quality || QUALITY;
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.drawImage(source, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", quality));
}

// <img> decode fallback (Safari decodes HEIC natively).
function decodeImg(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode failed"));
    };
    img.src = url;
  });
}

async function imageThumb(file, opts) {
  let source = null;
  try {
    source = await createImageBitmap(file);
  } catch {
    if (!isHeic(file)) return null;
    try {
      source = await decodeImg(file);
    } catch {
      return null;
    }
  }
  try {
    const w = source.naturalWidth || source.width;
    const h = source.naturalHeight || source.height;
    if (!w || !h) return null;
    return await drawToBlob(source, w, h, opts);
  } finally {
    if (source.close) source.close();
  }
}

function videoThumb(file, opts) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    let finished = false;
    const finish = (blob) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    const timer = setTimeout(() => finish(null), VIDEO_TIMEOUT_MS);
    video.addEventListener("error", () => finish(null));
    video.addEventListener("loadedmetadata", () => {
      const d = Number.isFinite(video.duration) ? video.duration : 0;
      try {
        video.currentTime = Math.min(1, d / 2);
      } catch {
        finish(null);
      }
    });
    video.addEventListener("seeked", () => {
      if (!video.videoWidth || !video.videoHeight) return finish(null);
      drawToBlob(video, video.videoWidth, video.videoHeight, opts).then(finish, () => finish(null));
    });
    video.src = url;
  });
}

// opts: { maxEdge, quality } override the defaults (480px, q0.8).
export async function makeThumb(file, opts = {}) {
  try {
    return isVideo(file) ? await videoThumb(file, opts) : await imageThumb(file, opts);
  } catch {
    return null;
  }
}
