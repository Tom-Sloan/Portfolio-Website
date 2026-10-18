export const MAX_FILE_BYTES = 4 * 1024 * 1024 * 1024; // 4 GiB
export const PART_SIZE = 10 * 1024 * 1024; // 10 MiB (S3 minimum is 5 MiB)
export const MAX_PARTS = 1000;
export const MAX_SIGN_PARTS_PER_CALL = 100;
export const URL_EXPIRY_SECONDS = 3600;
export const MAX_THUMB_BYTES = 300 * 1024; // 300 KB
export const GUEST_COOKIE = "wed_g";
export const ADMIN_COOKIE = "wed_a";
export const GUEST_TTL_SECONDS = 60 * 24 * 60 * 60; // 60 days
export const ADMIN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

export interface MediaType {
  /** Canonical lower-case extension used in stored keys (jpeg -> jpg). */
  ext: string;
  /** Canonical MIME type, the only content type ever stored or served. */
  mime: string;
}

const MEDIA_TYPES = new Map<string, MediaType>([
  ["jpg", { ext: "jpg", mime: "image/jpeg" }],
  ["jpeg", { ext: "jpg", mime: "image/jpeg" }],
  ["png", { ext: "png", mime: "image/png" }],
  ["gif", { ext: "gif", mime: "image/gif" }],
  ["webp", { ext: "webp", mime: "image/webp" }],
  ["heic", { ext: "heic", mime: "image/heic" }],
  ["heif", { ext: "heif", mime: "image/heif" }],
  ["avif", { ext: "avif", mime: "image/avif" }],
  ["dng", { ext: "dng", mime: "image/x-adobe-dng" }],
  ["mp4", { ext: "mp4", mime: "video/mp4" }],
  ["m4v", { ext: "m4v", mime: "video/x-m4v" }],
  ["mov", { ext: "mov", mime: "video/quicktime" }],
  ["webm", { ext: "webm", mime: "video/webm" }],
  ["3gp", { ext: "3gp", mime: "video/3gpp" }],
]);

/** Extensions that must not appear as a non-final segment (e.g. `x.exe.jpg`). */
const DANGEROUS_EXTENSIONS = new Set([
  "exe", "html", "htm", "xhtml", "svg", "xml", "js", "mjs", "bat", "cmd", "scr", "app",
  "com", "msi", "dll", "jar", "vbs", "ps1", "sh", "php", "pdf", "swf",
]);

/**
 * Classify an upload by the filename's LAST extension. Returns null for anything that
 * is not an allowlisted photo/video type, or whose earlier extension segments are dangerous.
 */
export function classifyFilename(filename: string): MediaType | null {
  const parts = filename.split(".");
  if (parts.length < 2) return null;
  const media = MEDIA_TYPES.get(parts[parts.length - 1].toLowerCase());
  if (!media) return null;
  // Segment 0 is the file's stem, not an extension.
  for (const seg of parts.slice(1, -1)) {
    if (DANGEROUS_EXTENSIONS.has(seg.trim().toLowerCase())) return null;
  }
  return media;
}

/** Media type derived from a stored object key's extension (never from stored metadata). */
export function mediaTypeForKey(key: string): MediaType | null {
  const dot = key.lastIndexOf(".");
  if (dot < 0) return null;
  return MEDIA_TYPES.get(key.slice(dot + 1).toLowerCase()) ?? null;
}

/** Read a required env var. The error names the variable, never its value. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value === "" ? undefined : value;
}

export interface R2Config {
  accountId: string | undefined;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string;
  forcePathStyle: boolean;
}

export function loadR2Config(): R2Config {
  const override = optionalEnv("R2_ENDPOINT");
  const accountId = override ? optionalEnv("R2_ACCOUNT_ID") : requireEnv("R2_ACCOUNT_ID");
  return {
    accountId,
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    bucket: requireEnv("R2_BUCKET"),
    endpoint: override ?? `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: override !== undefined,
  };
}

export function cookieSecret(): string {
  return requireEnv("WEDDING_COOKIE_SECRET");
}

export function cookieInsecure(): boolean {
  return process.env.WEDDING_COOKIE_INSECURE === "1";
}
