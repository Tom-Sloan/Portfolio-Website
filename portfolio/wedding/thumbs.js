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

function drawToBlob(source, width, height) {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.drawImage(source, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", QUALITY));
}

let heicLoader = null;
function loadHeic2any() {
  if (window.heic2any) return Promise.resolve(window.heic2any);
  if (!heicLoader) {
    heicLoader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "/wedding/vendor/heic2any.min.js";
      s.onload = () => (window.heic2any ? resolve(window.heic2any) : reject(new Error("heic2any missing")));
      s.onerror = () => reject(new Error("heic2any failed to load"));
      document.head.append(s);
    });
    heicLoader.catch(() => {
      heicLoader = null;
    });
  }
  return heicLoader;
}

async function imageThumb(file) {
  let bitmap = null;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    if (!isHeic(file)) return null;
    const heic2any = await loadHeic2any();
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: QUALITY });
    const jpeg = Array.isArray(out) ? out[0] : out;
    bitmap = await createImageBitmap(jpeg);
  }
  try {
    return await drawToBlob(bitmap, bitmap.width, bitmap.height);
  } finally {
    if (bitmap.close) bitmap.close();
  }
}

function videoThumb(file) {
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
      drawToBlob(video, video.videoWidth, video.videoHeight).then(finish, () => finish(null));
    });
    video.src = url;
  });
}

export async function makeThumb(file) {
  try {
    return isVideo(file) ? await videoThumb(file) : await imageThumb(file);
  } catch {
    return null;
  }
}
