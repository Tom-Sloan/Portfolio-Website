import { MAX_THUMB_BYTES } from "../lib/wedding/config.js";
import { HttpError, json, requireRole, wrap } from "../lib/wedding/http.js";
import { isJpegThumb } from "../lib/wedding/media.js";
import { getText, putJson, putObject } from "../lib/wedding/s3.js";
import { metaKey, parseMeta, thumbKey } from "../lib/wedding/store.js";
import { authorizeUpload } from "../lib/wedding/uploads.js";

/** Read the body, refusing to buffer more than `max` bytes. */
async function readCapped(req: Request, max: number): Promise<Uint8Array> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > max) throw new HttpError(413, "Thumbnail too large");
  if (!req.body) return new Uint8Array(0);
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => undefined);
      throw new HttpError(413, "Thumbnail too large");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

function headerSize(value: string | null): number {
  return value !== null && /^[0-9]{1,15}$/.test(value) ? Number(value) : Number.NaN;
}

export default wrap("POST", async (req) => {
  requireRole(req, "guest");
  const o = authorizeUpload({
    key: req.headers.get("x-upload-key"),
    uploadId: req.headers.get("x-upload-id"),
    size: headerSize(req.headers.get("x-upload-size")),
    token: req.headers.get("x-upload-token"),
  });

  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (type !== "image/jpeg") throw new HttpError(400, "Thumbnail must be a JPEG");
  const bytes = await readCapped(req, MAX_THUMB_BYTES);
  if (!isJpegThumb(bytes)) {
    throw new HttpError(400, "Thumbnail must be a JPEG");
  }

  const text = await getText(metaKey(o.visibility, o.id));
  const meta = text === null ? null : parseMeta(text);
  if (!meta) throw new HttpError(409, "Upload not complete");

  await putObject(thumbKey(o.visibility, o.id), bytes, "image/jpeg");
  meta.hasThumb = true;
  await putJson(metaKey(o.visibility, o.id), meta);
  return json({ ok: true });
});

export const config = { path: "/api/wedding/thumb" };
