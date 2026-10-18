export const MAX_FILE_BYTES = 4 * 1024 * 1024 * 1024; // 4 GiB
export const PART_SIZE = 10 * 1024 * 1024; // 10 MiB (S3 minimum is 5 MiB)
export const MAX_PARTS = 1000;
export const MAX_SIGN_PARTS_PER_CALL = 100;
export const URL_EXPIRY_SECONDS = 3600;
export const MAX_THUMB_BYTES = 2 * 1024 * 1024; // 2 MB
export const GUEST_COOKIE = "wed_g";
export const ADMIN_COOKIE = "wed_a";
export const GUEST_TTL_SECONDS = 60 * 24 * 60 * 60; // 60 days
export const ADMIN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

const OCTET_STREAM_EXTENSIONS = new Set([
  "heic",
  "heif",
  "mov",
  "mp4",
  "jpg",
  "jpeg",
  "png",
  "dng",
]);

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

/** Lower-case alphanumeric extension of 1-5 chars, or "bin". */
export function safeExt(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return "bin";
  const ext = filename.slice(dot + 1).toLowerCase();
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "bin";
}

export function isAllowedType(contentType: string, filename: string): boolean {
  const type = contentType.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9.+-]*\/[a-z0-9][a-z0-9.+-]*$/.test(type)) return false;
  if (type.startsWith("image/") || type.startsWith("video/")) return true;
  if (type === "application/octet-stream") {
    return OCTET_STREAM_EXTENSIONS.has(safeExt(filename));
  }
  return false;
}
