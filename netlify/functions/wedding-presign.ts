import { randomUUID } from "node:crypto";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListPartsCommand,
} from "@aws-sdk/client-s3";
import { signUploadToken } from "../lib/wedding/auth.js";
import {
  MAX_FILE_BYTES,
  MAX_PARTS,
  MAX_SIGN_PARTS_PER_CALL,
  PART_SIZE,
  classifyFilename,
  mediaTypeForKey,
} from "../lib/wedding/config.js";
import { HttpError, error, json, rateLimited, readJson, requireRole, str, unavailable, wrap } from "../lib/wedding/http.js";
import { matchesMagic } from "../lib/wedding/media.js";
import { RateLimitUnavailable, clientIp, reserve, type Reservation } from "../lib/wedding/ratelimit.js";
import {
  bucketName,
  getS3,
  isNoSuchUpload,
  isNotFound,
  presignUploadPart,
  putJson,
} from "../lib/wedding/s3.js";
import { metaKey, type Meta } from "../lib/wedding/store.js";
import { authorizeUpload, partCountFor, partLength } from "../lib/wedding/uploads.js";

function decode(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function create(req: Request, context: unknown, body: Record<string, unknown>): Promise<Response> {
  let r: Reservation;
  try {
    r = await reserve("create", clientIp(req, context));
  } catch (e) {
    if (e instanceof RateLimitUnavailable) return unavailable();
    throw e;
  }
  if (r.blocked) return rateLimited(r.retryAfterSec);

  const filename = str(body.filename, "filename", 1, 255);
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
  // The client-declared contentType is ignored; the type comes from the filename's extension.
  const media = classifyFilename(filename);
  if (!media) throw new HttpError(400, "Only photos and videos can be uploaded");

  const partCount = partCountFor(size);
  if (partCount > MAX_PARTS) throw new HttpError(413, "File too large");

  const id = `${Date.now().toString(36)}-${randomUUID()}`;
  const key = `${visibility}/${id}/original.${media.ext}`;
  const metadata: Record<string, string> = {
    uploader: encodeURIComponent(uploader),
    visibility,
    originalname: encodeURIComponent(filename),
    declaredsize: String(size),
  };
  const encodedCaption = encodeURIComponent(caption);
  if (encodedCaption.length > 0 && encodedCaption.length <= 700) metadata.caption = encodedCaption;

  const res = await getS3().send(
    new CreateMultipartUploadCommand({
      Bucket: bucketName(),
      Key: key,
      ContentType: media.mime,
      Metadata: metadata,
    }),
  );
  if (!res.UploadId) throw new Error("CreateMultipartUpload returned no UploadId");
  return json({
    id,
    key,
    uploadId: res.UploadId,
    token: signUploadToken(key, res.UploadId, size),
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
    if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > o.partCount) {
      throw new HttpError(400, "Invalid partNumbers");
    }
  }
  const list = nums as number[];
  const signed = await Promise.all(list.map((n) => presignUploadPart(o.key, o.uploadId, n, partLength(o, n))));
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
  if (!Array.isArray(rawParts) || rawParts.length !== o.partCount) {
    throw new HttpError(400, "Invalid parts");
  }
  const parts = rawParts.map((p) => {
    const part = p as { PartNumber?: unknown; ETag?: unknown } | null;
    if (
      !part ||
      typeof part.PartNumber !== "number" ||
      !Number.isInteger(part.PartNumber) ||
      part.PartNumber < 1 ||
      part.PartNumber > o.partCount ||
      typeof part.ETag !== "string" ||
      part.ETag.length === 0 ||
      part.ETag.length > 200
    ) {
      throw new HttpError(400, "Invalid parts");
    }
    return { PartNumber: part.PartNumber, ETag: part.ETag };
  });
  parts.sort((a, b) => a.PartNumber - b.PartNumber);
  // Exactly parts 1..partCount, each once.
  if (parts.some((p, i) => p.PartNumber !== i + 1)) throw new HttpError(400, "Invalid parts");

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
  const discard = async (): Promise<void> => {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: o.key }));
  };
  if (head.ContentLength !== o.size) {
    await discard();
    throw new HttpError(400, "Size mismatch");
  }

  // Content must look like what its extension claims.
  const media = mediaTypeForKey(o.key);
  const first = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: o.key, Range: "bytes=0-63" }));
  const prefix = (await first.Body?.transformToByteArray()) ?? new Uint8Array(0);
  if (!media || !matchesMagic(media.ext, prefix)) {
    await discard();
    throw new HttpError(415, "File content doesn't match its type");
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
    contentType: media.mime,
    size: o.size,
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

export default wrap("POST", async (req, context) => {
  requireRole(req, "guest");
  const body = await readJson(req);
  switch (body.action) {
    case "create":
      return create(req, context, body);
    case "sign-parts":
      return signParts(body);
    case "list-parts":
      return listParts(body);
    case "complete":
      return complete(body);
    case "abort":
      return abort(body);
    default:
      return error(400, "Unknown action");
  }
});

export const config = { path: "/api/wedding/presign" };
