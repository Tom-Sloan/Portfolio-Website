import { verifyUploadToken } from "./auth.js";
import { MAX_FILE_BYTES, PART_SIZE } from "./config.js";
import { HttpError } from "./http.js";
import { KEY_PATTERN, type Visibility } from "./store.js";

export interface Owned {
  key: string;
  uploadId: string;
  size: number;
  partCount: number;
  visibility: Visibility;
  id: string;
}

export function partCountFor(size: number): number {
  return Math.ceil(size / PART_SIZE);
}

/** Exact byte length of a (1-based) part: PART_SIZE, except the last part. */
export function partLength(o: Owned, partNumber: number): number {
  return partNumber < o.partCount ? PART_SIZE : o.size - PART_SIZE * (o.partCount - 1);
}

/** Validates key/uploadId/size and that the token was issued for exactly this triple. */
export function authorizeUpload(fields: Record<string, unknown>): Owned {
  const { key, uploadId, size, token } = fields;
  if (typeof key !== "string" || !KEY_PATTERN.test(key)) throw new HttpError(403, "Forbidden");
  if (typeof uploadId !== "string" || uploadId.length === 0 || uploadId.length > 1024) {
    throw new HttpError(403, "Forbidden");
  }
  if (typeof size !== "number" || !Number.isInteger(size) || size < 1 || size > MAX_FILE_BYTES) {
    throw new HttpError(403, "Forbidden");
  }
  if (typeof token !== "string" || !verifyUploadToken(key, uploadId, size, token)) {
    throw new HttpError(403, "Forbidden");
  }
  const [visibility, id] = key.split("/");
  return { key, uploadId, size, partCount: partCountFor(size), visibility: visibility as Visibility, id };
}
