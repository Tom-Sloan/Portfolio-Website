// Small helpers shared by the guest and admin pages.

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api(name, { method = "GET", body, query } = {}) {
  const qs = query ? `?${new URLSearchParams(query)}` : "";
  const init = { method, credentials: "same-origin", headers: {} };
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`/api/wedding/${name}${qs}`, init);
  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON error body
  }
  if (!res.ok) throw new ApiError(res.status, (data && data.error) || `Request failed (${res.status})`);
  return data;
}

export function fmtSize(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${i === 0 ? n : n.toFixed(n >= 100 ? 0 : 1)} ${units[i]}`;
}

export function fmtDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function isVideoType(type) {
  return typeof type === "string" && type.startsWith("video/");
}

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, "");
    else if (v !== false && v != null) node.setAttribute(k, String(v));
  }
  for (const c of [].concat(children)) {
    if (c != null) node.append(c);
  }
  return node;
}

/** Thumbnail tile button (no text for the image to keep the DOM light). */
export function thumbButton(item, onOpen) {
  const inner = item.thumbUrl
    ? el("img", { src: item.thumbUrl, alt: item.caption || item.originalName, loading: "lazy", decoding: "async" })
    : el("div", { class: "ph", text: isVideoType(item.contentType) ? "VIDEO" : "PHOTO" });
  const btn = el("button", { type: "button", class: "thumb", "aria-label": `Open ${item.originalName}`, onclick: onOpen }, [inner]);
  if (isVideoType(item.contentType)) btn.append(el("span", { class: "play", text: "▶" }));
  return btn;
}

export function setupLightbox() {
  const box = document.getElementById("lightbox");
  const body = document.getElementById("lightbox-body");
  const cap = document.getElementById("lightbox-cap");
  const close = () => {
    body.replaceChildren();
    box.hidden = true;
  };
  document.getElementById("lightbox-close").addEventListener("click", close);
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !box.hidden) close();
  });
  return function open(item) {
    body.replaceChildren();
    let node;
    if (isVideoType(item.contentType)) {
      node = el("video", { src: item.url, controls: true, playsinline: true, autoplay: true });
    } else {
      node = el("img", { src: item.url, alt: item.caption || item.originalName });
      // HEIC and other formats the browser cannot show fall back to the thumbnail.
      node.addEventListener("error", () => {
        if (item.thumbUrl && node.src !== item.thumbUrl) node.src = item.thumbUrl;
      });
    }
    body.append(node);
    cap.textContent = [item.uploader, item.caption].filter(Boolean).join(" — ");
    box.hidden = false;
  };
}
