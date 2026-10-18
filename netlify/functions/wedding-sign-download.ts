import { HttpError, json, readJson, requireRole, wrap } from "../lib/wedding/http.js";
import { presignGet } from "../lib/wedding/s3.js";
import { ID_PATTERN, KEY_PATTERN, readMeta, type Visibility } from "../lib/wedding/store.js";

const MAX_IDS = 500;

function sanitizeName(name: string): string {
  const cleaned = name
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f"\\/:*?<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  return cleaned || "file";
}

function asciiFallback(name: string): string {
  return name.replace(/[^\x20-\x7e]/g, "_").replace(/[%;]/g, "_");
}

function rfc5987(name: string): string {
  return encodeURIComponent(name).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function contentDisposition(name: string): string {
  return `attachment; filename="${asciiFallback(name)}"; filename*=UTF-8''${rfc5987(name)}`;
}

export default wrap("POST", async (req) => {
  const role = requireRole(req, "guest");
  const body = await readJson(req);
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_IDS) {
    throw new HttpError(400, "Invalid ids");
  }

  const wanted: { id: string; visibility: Visibility }[] = [];
  for (const entry of ids) {
    const e = entry as { id?: unknown; visibility?: unknown } | null;
    if (!e || typeof e.id !== "string" || !ID_PATTERN.test(e.id)) throw new HttpError(400, "Invalid ids");
    if (e.visibility !== "shared" && e.visibility !== "private") throw new HttpError(400, "Invalid ids");
    if (role !== "admin" && e.visibility !== "shared") throw new HttpError(403, "Forbidden");
    wanted.push({ id: e.id, visibility: e.visibility });
  }

  const files: unknown[] = [];
  const queue = [...wanted];
  async function worker(): Promise<void> {
    for (let w = queue.shift(); w; w = queue.shift()) {
      const meta = await readMeta(w.visibility, w.id);
      if (!meta || typeof meta.key !== "string" || !KEY_PATTERN.test(meta.key)) continue;
      if (!meta.key.startsWith(`${w.visibility}/${w.id}/`)) continue;
      const name = sanitizeName(`${meta.uploader}-${meta.originalName}`);
      const url = await presignGet(meta.key, {
        disposition: contentDisposition(name),
        contentType: meta.contentType,
      });
      files.push({
        id: w.id,
        name,
        size: meta.size,
        url,
        uploader: meta.uploader,
        originalName: meta.originalName,
        createdAt: meta.createdAt,
      });
    }
  }
  await Promise.all(Array.from({ length: Math.min(8, wanted.length) }, worker));

  // Preserve request order.
  const order = new Map(wanted.map((w, i) => [w.id, i]));
  (files as { id: string }[]).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  return json({ files });
});

export const config = { path: "/api/wedding/sign-download" };
