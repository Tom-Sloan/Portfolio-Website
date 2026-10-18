// Shared setup for the wedding API integration tests (not a test file itself).
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

export const endpoint = process.env.R2_ENDPOINT;
export const skip = endpoint
  ? false
  : "R2_ENDPOINT is not set; skipping API integration tests (set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET to an S3-compatible server)";

export const GUEST_PW = "test-guest-password";
export const COUPLE_PW = "test-couple-password";
process.env.WEDDING_PASSWORD = GUEST_PW;
process.env.COUPLE_PASSWORD = COUPLE_PW;
process.env.WEDDING_COOKIE_SECRET = "test-cookie-secret-for-api-tests";
process.env.WEDDING_COOKIE_INSECURE = "1";
process.env.R2_ACCOUNT_ID ??= "test-account";
process.env.R2_BUCKET ??= "wedding-test";

export const BASE = "http://localhost/api/wedding";
export const PART_SIZE = 10 * 1024 * 1024;

/** A random client IP, unique per call, so rate-limit state never leaks between tests/runs. */
export const uniqueIp = () => `192.0.2.${Math.floor(Math.random() * 250) + 1}-${randomBytes(6).toString("hex")}`;

export class Jar {
  cookies = new Map();
  absorb(res) {
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(";");
      const idx = pair.indexOf("=");
      const name = pair.slice(0, idx);
      const value = pair.slice(idx + 1);
      if (value === "" || /Max-Age=0/i.test(line)) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
  }
  header() {
    return [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  }
}

export const JPEG_HEAD = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
/** n bytes that start with the JPEG magic. */
export const jpegBytes = (n) =>
  Buffer.concat([JPEG_HEAD, randomBytes(Math.max(0, n - JPEG_HEAD.length - 2)), Buffer.from([0xff, 0xd9])]).subarray(0, n);
/** n bytes with an ISO-BMFF `ftyp` box whose major brand is `brand` (4 chars). */
export const ftypBytes = (n, brand = "mov ") =>
  Buffer.concat([
    Buffer.from([0, 0, 0, 0x18]),
    Buffer.from(`ftyp${brand}`),
    Buffer.alloc(4),
    Buffer.from("isom"),
    randomBytes(Math.max(0, n - 24)),
  ]);
/** n bytes starting with a bare ISO-BMFF atom of the given type (e.g. moov, mdat, wide). */
export const atomBytes = (n, type) =>
  Buffer.concat([Buffer.from([0, 0, 0x10, 0]), Buffer.from(type), randomBytes(Math.max(0, n - 8))]);

let fns;
export async function loadFns() {
  if (fns) return fns;
  const dir = "../../dist/netlify/functions";
  const load = async (n) => (await import(`${dir}/wedding-${n}.js`)).default;
  fns = {};
  for (const n of [
    "login",
    "admin-login",
    "session",
    "presign",
    "list-shared",
    "admin-list",
    "sign-download",
    "thumb",
    "admin-reset-ratelimit",
  ]) {
    fns[n] = await load(n);
  }
  return fns;
}

export async function call(name, { method = "POST", body, jar, query = "", ip } = {}) {
  const f = await loadFns();
  const headers = { "Content-Type": "application/json" };
  if (jar && jar.cookies.size) headers.cookie = jar.header();
  if (ip) headers["x-nf-client-connection-ip"] = ip;
  const req = new Request(`${BASE}/${name}${query}`, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
  });
  const res = await f[name](req, ip ? { ip } : {});
  if (jar) jar.absorb(res);
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    // leave null
  }
  return { res, status: res.status, data };
}

export const presign = (jar, body) => call("presign", { jar, body });

export async function loginGuest(jar = new Jar()) {
  const r = await call("login", { jar, body: { password: GUEST_PW }, ip: uniqueIp() });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  return jar;
}

export async function loginAdmin(jar = new Jar()) {
  const r = await call("admin-login", { jar, body: { password: COUPLE_PW }, ip: uniqueIp() });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  return jar;
}

/** create + (optionally) upload one single-part file. Returns the create response data. */
export async function createUpload(jar, { visibility = "shared", name = "photo.jpg", size, contentType, caption = "hello", uploader = "Test Guest" }) {
  const created = await presign(jar, {
    action: "create",
    filename: name,
    ...(contentType ? { contentType } : {}),
    size,
    visibility,
    uploader,
    caption,
  });
  return created;
}

export async function putPart(jar, upload, size, bytes, partNumber = 1) {
  const auth = { key: upload.key, uploadId: upload.uploadId, token: upload.token, size };
  const signed = await presign(jar, { action: "sign-parts", ...auth, partNumbers: [partNumber] });
  assert.equal(signed.status, 200, JSON.stringify(signed.data));
  const put = await fetch(signed.data.urls[String(partNumber)], { method: "PUT", body: bytes });
  assert.ok(put.ok, `part PUT failed: ${put.status}`);
  const etag = put.headers.get("etag");
  assert.ok(etag, "ETag header missing");
  return etag;
}

export async function uploadSmall(jar, { visibility, name = "photo.jpg", bytes, caption = "hello", uploader = "Test Guest", contentType }) {
  const created = await createUpload(jar, { visibility, name, size: bytes.length, caption, uploader, contentType });
  assert.equal(created.status, 200, JSON.stringify(created.data));
  const { key, uploadId, token, id } = created.data;
  assert.ok(key.startsWith(`${visibility}/`));
  const etag = await putPart(jar, created.data, bytes.length, bytes);
  const done = await presign(jar, {
    action: "complete",
    key,
    uploadId,
    token,
    size: bytes.length,
    parts: [{ PartNumber: 1, ETag: etag }],
  });
  assert.equal(done.status, 200, JSON.stringify(done.data));
  assert.equal(done.data.id, id);
  return { id, key, uploadId, token, etag, size: bytes.length };
}

export async function thumbCall(jar, upload, body, { type = "image/jpeg", ip, token } = {}) {
  const f = await loadFns();
  const headers = {
    "Content-Type": type,
    "x-upload-key": upload.key,
    "x-upload-id": upload.uploadId,
    "x-upload-size": String(upload.size),
    "x-upload-token": token ?? upload.token,
  };
  if (jar && jar.cookies.size) headers.cookie = jar.header();
  if (ip) headers["x-nf-client-connection-ip"] = ip;
  const res = await f.thumb(new Request(`${BASE}/thumb`, { method: "POST", headers, body }), ip ? { ip } : {});
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    // leave null
  }
  return { status: res.status, data };
}

export async function makeS3() {
  const S3 = await import("@aws-sdk/client-s3");
  const client = new S3.S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  try {
    await client.send(new S3.CreateBucketCommand({ Bucket: process.env.R2_BUCKET }));
  } catch (e) {
    if (!["BucketAlreadyOwnedByYou", "BucketAlreadyExists"].includes(e?.name)) throw e;
  }
  return { S3, client };
}

export async function exists(S3, client, key) {
  try {
    await client.send(new S3.HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
    return true;
  } catch (e) {
    if (e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404) return false;
    throw e;
  }
}
