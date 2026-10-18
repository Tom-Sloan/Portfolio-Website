import { randomUUID } from "node:crypto";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListPartsCommand,
} from "@aws-sdk/client-s3";
import { signUploadToken, verifyUploadToken } from "../lib/wedding/auth.js";
import {
  MAX_FILE_BYTES,
  MAX_PARTS,
  MAX_SIGN_PARTS_PER_CALL,
  MAX_THUMB_BYTES,
  PART_SIZE,
  isAllowedType,
  safeExt,
} from "../lib/wedding/config.js";
import { HttpError, json, readJson, requireRole, str, wrap } from "../lib/wedding/http.js";
import {
  bucketName,
  getS3,
  getText,
  isNoSuchUpload,
  isNotFound,
  presignPut,
  presignUploadPart,
  putJson,
} from "../lib/wedding/s3.js";
import { KEY_PATTERN, metaKey, parseMeta, thumbKey, type Meta, type Visibility } from "../lib/wedding/store.js";

interface Owned {
  key: string;
  uploadId: string;
  visibility: Visibility;
  id: string;
}

/** Validates key/uploadId and that the token was issued for exactly this pair. */
function authorizeUpload(body: Record<string, unknown>): Owned {
  const { key, uploadId, token } = body;
  if (typeof key !== "string" || !KEY_PATTERN.test(key)) throw new HttpError(403, "Forbidden");
  if (typeof uploadId !== "string" || uploadId.length === 0 || uploadId.length > 1024) {
    throw new HttpError(403, "Forbidden");
  }
  if (typeof token !== "string" || !verifyUploadToken(key, uploadId, token)) {
    throw new HttpError(403, "Forbidden");
  }
  const [visibility, id] = key.split("/");
  return { key, uploadId, visibility: visibility as Visibility, id };
}

function decode(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function create(body: Record<string, unknown>): Promise<Response> {
  const filename = str(body.filename, "filename", 1, 255);
  const contentType = str(body.contentType, "contentType", 1, 127).toLowerCase();
  const uploader = str(body.uploader, "uploader", 1, 60);
  let caption = "";
  if (typeof body.caption === "string") caption = body.caption.trim();
  else if (body.caption !== undefined && body.caption !== null) throw new HttpError(400, "Invalid caption");
  if (caption.length > 280) throw new HttpError(400, "Invalid caption");
  const size = body.size;
  const visibility = body.visibility;
  if (visibility !== "shared" && visibility !== "private") throw new HttpError(400, "Invalid visibility");
  if (typeof size !== "number" || !Number.isInteger(size) || size < 1) throw new HttpError(400, "Invalid size");
  if (size > MAX_FILE_BYTES) throw new HttpError(413, "File too large");
  if (!isAllowedType(contentType, filename)) throw new HttpError(415, "Unsupported file type");

  const partCount = Math.ceil(size / PART_SIZE);
  if (partCount > MAX_PARTS) throw new HttpError(413, "File too large");

  const id = `${Date.now().toString(36)}-${randomUUID()}`;
  const key = `${visibility}/${id}/original.${safeExt(filename)}`;
  const metadata: Record<string, string> = {
    uploader: encodeURIComponent(uploader),
    visibility,
    originalname: encodeURIComponent(filename),
  };
  const encodedCaption = encodeURIComponent(caption);
  if (encodedCaption.length > 0 && encodedCaption.length <= 700) metadata.caption = encodedCaption;

  const res = await getS3().send(
    new CreateMultipartUploadCommand({
      Bucket: bucketName(),
      Key: key,
      ContentType: contentType,
      Metadata: metadata,
    }),
  );
  if (!res.UploadId) throw new Error("CreateMultipartUpload returned no UploadId");
  return json({
    id,
    key,
    uploadId: res.UploadId,
    token: signUploadToken(key, res.UploadId),
    partSize: PART_SIZE,
    partCount,
  });
}

async function signParts(body: Record<string, unknown>): Promise<Response> {
  const o = authorizeUpload(body);
  const nums = body.partNumbers;
  if (!Array.isArray(nums) || nums.length === 0 || nums.length > MAX_SIGN_PARTS_PER_CALL) {
    throw new HttpError(400, "Invalid partNumbers");
  }
  for (const n of nums) {
    if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > MAX_PARTS) {
      throw new HttpError(400, "Invalid partNumbers");
    }
  }
  const list = nums as number[];
  const signed = await Promise.all(list.map((n) => presignUploadPart(o.key, o.uploadId, n)));
  const urls: Record<string, string> = {};
  list.forEach((n, i) => {
    urls[String(n)] = signed[i];
  });
  return json({ urls });
}

async function listParts(body: Record<string, unknown>): Promise<Response> {
  const o = authorizeUpload(body);
  const parts: { PartNumber: number; ETag: string; Size: number }[] = [];
  let marker: string | undefined;
  try {
    for (;;) {
      const res = await getS3().send(
        new ListPartsCommand({
          Bucket: bucketName(),
          Key: o.key,
          UploadId: o.uploadId,
          PartNumberMarker: marker,
        }),
      );
      for (const p of res.Parts ?? []) {
        if (p.PartNumber !== undefined && p.ETag !== undefined) {
          parts.push({ PartNumber: p.PartNumber, ETag: p.ETag, Size: p.Size ?? 0 });
        }
      }
      if (!res.IsTruncated || !res.NextPartNumberMarker) break;
      marker = res.NextPartNumberMarker;
    }
  } catch (e) {
    if (isNoSuchUpload(e)) throw new HttpError(404, "Upload not found");
    throw e;
  }
  return json({ parts });
}

async function complete(body: Record<string, unknown>): Promise<Response> {
  const o = authorizeUpload(body);
  const rawParts = body.parts;
  if (!Array.isArray(rawParts) || rawParts.length === 0 || rawParts.length > MAX_PARTS) {
    throw new HttpError(400, "Invalid parts");
  }
  const parts = rawParts.map((p) => {
    const part = p as { PartNumber?: unknown; ETag?: unknown } | null;
    if (
      !part ||
      typeof part.PartNumber !== "number" ||
      !Number.isInteger(part.PartNumber) ||
      part.PartNumber < 1 ||
      part.PartNumber > MAX_PARTS ||
      typeof part.ETag !== "string" ||
      part.ETag.length === 0 ||
      part.ETag.length > 200
    ) {
      throw new HttpError(400, "Invalid parts");
    }
    return { PartNumber: part.PartNumber, ETag: part.ETag };
  });
  parts.sort((a, b) => a.PartNumber - b.PartNumber);

  const s3 = getS3();
  const bucket = bucketName();
  try {
    await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: o.key,
        UploadId: o.uploadId,
        MultipartUpload: { Parts: parts },
      }),
    );
  } catch (e) {
    // A retried `complete` after a lost response: fall through if the object already exists.
    if (!isNoSuchUpload(e)) throw e;
  }

  let head;
  try {
    head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: o.key }));
  } catch (e) {
    if (isNotFound(e)) throw new HttpError(404, "Upload not found");
    throw e;
  }
  const size = head.ContentLength ?? 0;
  if (size > MAX_FILE_BYTES) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: o.key }));
    throw new HttpError(413, "File too large");
  }

  const md = head.Metadata ?? {};
  let caption = decode(md.caption);
  if (typeof body.caption === "string") caption = body.caption.trim().slice(0, 280);
  const meta: Meta = {
    id: o.id,
    visibility: o.visibility,
    uploader: decode(md.uploader),
    caption,
    originalName: decode(md.originalname),
    contentType: head.ContentType ?? "application/octet-stream",
    size,
    createdAt: new Date().toISOString(),
    hasThumb: false,
    key: o.key,
  };
  await putJson(metaKey(o.visibility, o.id), meta);
  return json({ ok: true, id: o.id });
}

async function abort(body: Record<string, unknown>): Promise<Response> {
  const o = authorizeUpload(body);
  try {
    await getS3().send(
      new AbortMultipartUploadCommand({ Bucket: bucketName(), Key: o.key, UploadId: o.uploadId }),
    );
  } catch (e) {
    if (!isNoSuchUpload(e)) throw e;
  }
  return json({ ok: true });
}

async function thumb(body: Record<string, unknown>): Promise<Response> {
  const o = authorizeUpload(body);
  const url = await presignPut(thumbKey(o.visibility, o.id), "image/jpeg");
  return json({ url });
}

async function thumbDone(body: Record<string, unknown>): Promise<Response> {
  const o = authorizeUpload(body);
  const s3 = getS3();
  const bucket = bucketName();
  const key = thumbKey(o.visibility, o.id);
  let head;
  try {
    head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  } catch (e) {
    if (isNotFound(e)) throw new HttpError(404, "Thumbnail not found");
    throw e;
  }
  if ((head.ContentLength ?? 0) > MAX_THUMB_BYTES) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    throw new HttpError(413, "Thumbnail too large");
  }
  const text = await getText(metaKey(o.visibility, o.id));
  const meta = text === null ? null : parseMeta(text);
  if (!meta) throw new HttpError(409, "Upload not complete");
  meta.hasThumb = true;
  await putJson(metaKey(o.visibility, o.id), meta);
  return json({ ok: true });
}

export default wrap("POST", async (req) => {
  requireRole(req, "guest");
  const body = await readJson(req);
  switch (body.action) {
    case "create":
      return create(body);
    case "sign-parts":
      return signParts(body);
    case "list-parts":
      return listParts(body);
    case "complete":
      return complete(body);
    case "abort":
      return abort(body);
    case "thumb":
      return thumb(body);
    case "thumb-done":
      return thumbDone(body);
    default:
      throw new HttpError(400, "Unknown action");
  }
});

export const config = { path: "/api/wedding/presign" };
