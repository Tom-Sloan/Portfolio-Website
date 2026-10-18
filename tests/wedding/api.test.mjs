import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { randomBytes } from "node:crypto";

const endpoint = process.env.R2_ENDPOINT;
const skip = endpoint
  ? false
  : "R2_ENDPOINT is not set; skipping API integration tests (set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET to an S3-compatible server)";

const GUEST_PW = "test-guest-password";
const COUPLE_PW = "test-couple-password";
process.env.WEDDING_PASSWORD = GUEST_PW;
process.env.COUPLE_PASSWORD = COUPLE_PW;
process.env.WEDDING_COOKIE_SECRET = "test-cookie-secret-for-api-tests";
process.env.WEDDING_COOKIE_INSECURE = "1";
process.env.R2_ACCOUNT_ID ??= "test-account";
process.env.R2_BUCKET ??= "wedding-test";

const BASE = "http://localhost/api/wedding";

class Jar {
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

let fns;
async function call(name, { method = "POST", body, jar, query = "" } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (jar && jar.cookies.size) headers.cookie = jar.header();
  const req = new Request(`${BASE}/${name}${query}`, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
  });
  const res = await fns[name](req, {});
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

const presign = (jar, body) => call("presign", { jar, body });

async function uploadSmall(jar, { visibility, name = "photo.jpg", bytes, caption = "hello", uploader = "Test Guest" }) {
  const created = await presign(jar, {
    action: "create",
    filename: name,
    contentType: "image/jpeg",
    size: bytes.length,
    visibility,
    uploader,
    caption,
  });
  assert.equal(created.status, 200, JSON.stringify(created.data));
  const { key, uploadId, token, id } = created.data;
  assert.match(key, /^(shared|private)\/[a-z0-9]+-[0-9a-f-]{36}\/original\.jpg$/);
  assert.ok(key.startsWith(`${visibility}/`));
  const signed = await presign(jar, { action: "sign-parts", key, uploadId, token, partNumbers: [1] });
  assert.equal(signed.status, 200, JSON.stringify(signed.data));
  const put = await fetch(signed.data.urls["1"], { method: "PUT", body: bytes });
  assert.ok(put.ok, `part PUT failed: ${put.status}`);
  const etag = put.headers.get("etag");
  assert.ok(etag, "ETag header missing");
  const done = await presign(jar, { action: "complete", key, uploadId, token, parts: [{ PartNumber: 1, ETag: etag }] });
  assert.equal(done.status, 200, JSON.stringify(done.data));
  assert.equal(done.data.id, id);
  return { id, key, uploadId, token, etag };
}

describe("wedding API", { skip }, () => {
  const guest = new Jar();
  const admin = new Jar();
  const sharedBytes = randomBytes(5000);
  const privateBytes = randomBytes(3000);
  let shared;
  let priv;
  let s3Client;
  let S3;

  before(async () => {
    S3 = await import("@aws-sdk/client-s3");
    s3Client = new S3.S3Client({
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
      await s3Client.send(new S3.CreateBucketCommand({ Bucket: process.env.R2_BUCKET }));
    } catch (e) {
      if (!["BucketAlreadyOwnedByYou", "BucketAlreadyExists"].includes(e?.name)) throw e;
    }
    const dir = "../../dist/netlify/functions";
    fns = {
      login: (await import(`${dir}/wedding-login.js`)).default,
      "admin-login": (await import(`${dir}/wedding-admin-login.js`)).default,
      session: (await import(`${dir}/wedding-session.js`)).default,
      presign: (await import(`${dir}/wedding-presign.js`)).default,
      "list-shared": (await import(`${dir}/wedding-list-shared.js`)).default,
      "admin-list": (await import(`${dir}/wedding-admin-list.js`)).default,
      "sign-download": (await import(`${dir}/wedding-sign-download.js`)).default,
    };
  });

  test("wrong guest password -> 401 and no cookie", async () => {
    const jar = new Jar();
    const { status, data } = await call("login", { jar, body: { password: "nope" } });
    assert.equal(status, 401);
    assert.equal(data.error, "Wrong password");
    assert.equal(jar.cookies.size, 0);
  });

  test("no cookie -> list-shared 401", async () => {
    const { status } = await call("list-shared", { method: "GET" });
    assert.equal(status, 401);
  });

  test("cross-origin POST is rejected", async () => {
    const req = new Request(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://evil.example" },
      body: JSON.stringify({ password: GUEST_PW }),
    });
    const res = await fns.login(req, {});
    assert.equal(res.status, 403);
    assert.equal(res.headers.get("cache-control"), "no-store");
  });

  test("guest login ok", async () => {
    const { status, res } = await call("login", { jar: guest, body: { password: GUEST_PW } });
    assert.equal(status, 200);
    assert.ok(guest.cookies.has("wed_g"));
    assert.ok(!guest.cookies.has("wed_a"));
    assert.equal(res.headers.get("cache-control"), "no-store");
    const s = await call("session", { method: "GET", jar: guest });
    assert.deepEqual(s.data, { guest: true, admin: false });
  });

  test("shared upload appears in list-shared with identical bytes", async () => {
    shared = await uploadSmall(guest, { visibility: "shared", bytes: sharedBytes, caption: "a shared one" });
    const { status, data } = await call("list-shared", { method: "GET", jar: guest });
    assert.equal(status, 200);
    const item = data.items.find((i) => i.id === shared.id);
    assert.ok(item, "shared item not listed");
    assert.equal(item.uploader, "Test Guest");
    assert.equal(item.caption, "a shared one");
    assert.equal(item.originalName, "photo.jpg");
    assert.equal(item.size, sharedBytes.length);
    assert.equal(item.thumbUrl, null);
    const dl = await fetch(item.url);
    assert.ok(dl.ok);
    assert.ok(Buffer.from(await dl.arrayBuffer()).equals(sharedBytes));
  });

  test("private upload never appears in list-shared; guest cannot sign it", async () => {
    priv = await uploadSmall(guest, { visibility: "private", bytes: privateBytes, name: "secret.jpg" });
    const { data } = await call("list-shared", { method: "GET", jar: guest });
    assert.ok(!data.items.some((i) => i.id === priv.id));
    const denied = await call("sign-download", {
      jar: guest,
      body: { ids: [{ id: priv.id, visibility: "private" }] },
    });
    assert.equal(denied.status, 403);
    const adminList = await call("admin-list", { method: "GET", jar: guest });
    assert.equal(adminList.status, 403);
  });

  test("forged key / token -> 403", async () => {
    const badToken = await presign(guest, {
      action: "sign-parts",
      key: shared.key,
      uploadId: shared.uploadId,
      token: "forged",
      partNumbers: [1],
    });
    assert.equal(badToken.status, 403);

    // A valid token for one upload must not work for another key.
    const otherKey = "shared/abc123-00000000-0000-0000-0000-000000000000/original.jpg";
    const crossed = await presign(guest, {
      action: "abort",
      key: otherKey,
      uploadId: shared.uploadId,
      token: shared.token,
    });
    assert.equal(crossed.status, 403);

    // Flipping visibility in the key invalidates the token too.
    const flipped = await presign(guest, {
      action: "thumb",
      key: shared.key.replace("shared/", "private/"),
      uploadId: shared.uploadId,
      token: shared.token,
    });
    assert.equal(flipped.status, 403);

    const malformed = await presign(guest, {
      action: "thumb",
      key: "../private/x/original.jpg",
      uploadId: shared.uploadId,
      token: shared.token,
    });
    assert.equal(malformed.status, 403);
  });

  test("create validates input", async () => {
    const base = { action: "create", filename: "a.jpg", contentType: "image/jpeg", size: 10, visibility: "shared", uploader: "X" };
    assert.equal((await presign(guest, { ...base, contentType: "application/pdf" })).status, 415);
    assert.equal((await presign(guest, { ...base, size: 5 * 1024 ** 3 })).status, 413);
    assert.equal((await presign(guest, { ...base, uploader: "   " })).status, 400);
    assert.equal((await presign(guest, { ...base, visibility: "everyone" })).status, 400);
    assert.equal((await presign(guest, { ...base, contentType: "application/octet-stream", filename: "a.exe" })).status, 415);
  });

  test("admin wrong password -> 401", async () => {
    const jar = new Jar();
    const { status } = await call("admin-login", { jar, body: { password: GUEST_PW } });
    assert.equal(status, 401);
    assert.equal(jar.cookies.size, 0);
  });

  test("admin login, admin-list shows both with correct visibility", async () => {
    const { status } = await call("admin-login", { jar: admin, body: { password: COUPLE_PW } });
    assert.equal(status, 200);
    assert.ok(admin.cookies.has("wed_a"));
    assert.ok(admin.cookies.has("wed_g"));
    const all = await call("admin-list", { method: "GET", jar: admin, query: "?visibility=all" });
    assert.equal(all.status, 200);
    assert.equal(all.data.items.find((i) => i.id === shared.id)?.visibility, "shared");
    assert.equal(all.data.items.find((i) => i.id === priv.id)?.visibility, "private");
    const onlyPrivate = await call("admin-list", { method: "GET", jar: admin, query: "?visibility=private" });
    assert.ok(onlyPrivate.data.items.every((i) => i.visibility === "private"));
    assert.ok(onlyPrivate.data.items.some((i) => i.id === priv.id));
  });

  test("admin sign-download returns working attachment URLs", async () => {
    const { status, data } = await call("sign-download", {
      jar: admin,
      body: {
        ids: [
          { id: shared.id, visibility: "shared" },
          { id: priv.id, visibility: "private" },
        ],
      },
    });
    assert.equal(status, 200);
    assert.equal(data.files.length, 2);
    const file = data.files.find((f) => f.id === priv.id);
    assert.equal(file.name, "Test Guest-secret.jpg");
    const res = await fetch(file.url);
    assert.ok(res.ok);
    assert.match(res.headers.get("content-disposition") ?? "", /^attachment/);
    assert.ok(Buffer.from(await res.arrayBuffer()).equals(privateBytes));

    // A guest may sign shared items.
    const ok = await call("sign-download", { jar: guest, body: { ids: [{ id: shared.id, visibility: "shared" }] } });
    assert.equal(ok.status, 200);
    assert.equal(ok.data.files.length, 1);
  });

  test("large multipart upload (200 MiB, 20 parts, concurrency 4)", { timeout: 600_000 }, async () => {
    const PART = 10 * 1024 * 1024;
    const PARTS = 20;
    const size = PART * PARTS;
    const created = await presign(guest, {
      action: "create",
      filename: "big.mov",
      contentType: "video/quicktime",
      size,
      visibility: "private",
      uploader: "Big Uploader",
    });
    assert.equal(created.status, 200, JSON.stringify(created.data));
    const { key, uploadId, token, partSize, partCount } = created.data;
    assert.equal(partSize, PART);
    assert.equal(partCount, PARTS);

    const numbers = Array.from({ length: PARTS }, (_, i) => i + 1);
    const signed = await presign(guest, { action: "sign-parts", key, uploadId, token, partNumbers: numbers });
    assert.equal(signed.status, 200);

    const chunk = Buffer.alloc(PART, 0x5a);
    const etags = new Map();
    const queue = [...numbers];
    async function worker() {
      for (let n = queue.shift(); n !== undefined; n = queue.shift()) {
        const res = await fetch(signed.data.urls[String(n)], { method: "PUT", body: chunk });
        assert.ok(res.ok, `part ${n} failed: ${res.status}`);
        etags.set(n, res.headers.get("etag"));
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);

    const listed = await presign(guest, { action: "list-parts", key, uploadId, token });
    assert.equal(listed.status, 200);
    assert.equal(listed.data.parts.length, PARTS);

    const parts = numbers.map((n) => ({ PartNumber: n, ETag: etags.get(n) }));
    const done = await presign(guest, { action: "complete", key, uploadId, token, parts });
    assert.equal(done.status, 200, JSON.stringify(done.data));

    const head = await s3Client.send(new S3.HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
    assert.equal(head.ContentLength, size);
  });

  test("thumbnail flow sets hasThumb", async () => {
    const tok = { key: shared.key, uploadId: shared.uploadId, token: shared.token };
    const t = await presign(guest, { action: "thumb", ...tok });
    assert.equal(t.status, 200);
    const jpegish = randomBytes(2048);
    const put = await fetch(t.data.url, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: jpegish });
    assert.ok(put.ok, `thumb PUT failed: ${put.status}`);
    const doneRes = await presign(guest, { action: "thumb-done", ...tok });
    assert.equal(doneRes.status, 200, JSON.stringify(doneRes.data));

    const { data } = await call("list-shared", { method: "GET", jar: guest });
    const item = data.items.find((i) => i.id === shared.id);
    assert.ok(item.thumbUrl, "thumbUrl should be set");
    const thumb = await fetch(item.thumbUrl);
    assert.ok(Buffer.from(await thumb.arrayBuffer()).equals(jpegish));
  });
});
