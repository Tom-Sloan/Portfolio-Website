import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import {
  COUPLE_PW,
  GUEST_PW,
  BASE,
  Jar,
  PART_SIZE,
  call,
  createUpload,
  ftypBytes,
  jpegBytes,
  loadFns,
  makeS3,
  presign,
  skip,
  thumbCall,
  uniqueIp,
  uploadSmall,
} from "./_helpers.mjs";

describe("wedding API", { skip }, () => {
  const guest = new Jar();
  const admin = new Jar();
  const sharedBytes = jpegBytes(5000);
  const privateBytes = jpegBytes(3000);
  let shared;
  let priv;
  let s3Client;
  let S3;
  let fns;

  before(async () => {
    ({ S3, client: s3Client } = await makeS3());
    fns = await loadFns();
  });

  test("wrong guest password -> 401 and no cookie", async () => {
    const jar = new Jar();
    const { status, data } = await call("login", { jar, body: { password: "nope" }, ip: uniqueIp() });
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
      headers: { "Content-Type": "application/json", Origin: "https://evil.example", "x-nf-client-connection-ip": uniqueIp() },
      body: JSON.stringify({ password: GUEST_PW }),
    });
    const res = await fns.login(req, {});
    assert.equal(res.status, 403);
    assert.equal(res.headers.get("cache-control"), "no-store");
  });

  test("guest login ok", async () => {
    const { status, res } = await call("login", { jar: guest, body: { password: GUEST_PW }, ip: uniqueIp() });
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
    assert.equal(item.contentType, "image/jpeg");
    assert.equal(item.size, sharedBytes.length);
    assert.equal(item.thumbUrl, null);
    const dl = await fetch(item.url);
    assert.ok(dl.ok);
    assert.equal(dl.headers.get("content-type"), "image/jpeg");
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

  test("forged key / token / size -> 403", async () => {
    const auth = { key: shared.key, uploadId: shared.uploadId, token: shared.token, size: shared.size };
    const badToken = await presign(guest, { action: "sign-parts", ...auth, token: "forged", partNumbers: [1] });
    assert.equal(badToken.status, 403);

    // A valid token for one upload must not work for another key.
    const otherKey = "shared/abc123-00000000-0000-0000-0000-000000000000/original.jpg";
    const crossed = await presign(guest, { action: "abort", ...auth, key: otherKey });
    assert.equal(crossed.status, 403);

    // Flipping visibility in the key invalidates the token too.
    const flipped = await presign(guest, { action: "abort", ...auth, key: shared.key.replace("shared/", "private/") });
    assert.equal(flipped.status, 403);

    // The token is bound to the declared size.
    const resized = await presign(guest, { action: "abort", ...auth, size: shared.size + 1 });
    assert.equal(resized.status, 403);
    const noSize = await presign(guest, { action: "abort", key: auth.key, uploadId: auth.uploadId, token: auth.token });
    assert.equal(noSize.status, 403);

    const malformed = await presign(guest, { action: "abort", ...auth, key: "../private/x/original.jpg" });
    assert.equal(malformed.status, 403);
  });

  test("create validates input", async () => {
    const base = { action: "create", filename: "a.jpg", size: 10, visibility: "shared", uploader: "X" };
    assert.equal((await presign(guest, { ...base, size: 5 * 1024 ** 3 })).status, 413);
    assert.equal((await presign(guest, { ...base, size: 0 })).status, 400);
    assert.equal((await presign(guest, { ...base, size: 1.5 })).status, 400);
    assert.equal((await presign(guest, { ...base, uploader: "   " })).status, 400);
    assert.equal((await presign(guest, { ...base, visibility: "everyone" })).status, 400);
    assert.equal((await presign(guest, { ...base, filename: "a.exe", contentType: "application/octet-stream" })).status, 400);
  });

  test("admin wrong password -> 401", async () => {
    const jar = new Jar();
    const { status } = await call("admin-login", { jar, body: { password: GUEST_PW }, ip: uniqueIp() });
    assert.equal(status, 401);
    assert.equal(jar.cookies.size, 0);
  });

  test("admin login, admin-list shows both with correct visibility", async () => {
    const { status } = await call("admin-login", { jar: admin, body: { password: COUPLE_PW }, ip: uniqueIp() });
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
    assert.equal(res.headers.get("content-type"), "image/jpeg");
    assert.ok(Buffer.from(await res.arrayBuffer()).equals(privateBytes));

    // A guest may sign shared items.
    const ok = await call("sign-download", { jar: guest, body: { ids: [{ id: shared.id, visibility: "shared" }] } });
    assert.equal(ok.status, 200);
    assert.equal(ok.data.files.length, 1);
  });

  test("sign-download name uses the canonical extension and neutralises dots", async () => {
    const up = await uploadSmall(guest, {
      visibility: "shared",
      bytes: jpegBytes(800),
      name: "My.Holiday.Pic.JPEG",
      uploader: "Sam",
    });
    const { status, data } = await call("sign-download", { jar: guest, body: { ids: [{ id: up.id, visibility: "shared" }] } });
    assert.equal(status, 200);
    const f = data.files[0];
    assert.equal(f.name, "Sam-My_Holiday_Pic.jpg");
    const res = await fetch(f.url);
    assert.match(res.headers.get("content-disposition") ?? "", /^attachment; filename="Sam-My_Holiday_Pic\.jpg"/);
    await res.arrayBuffer();
  });

  test("large multipart upload (200 MiB, 20 parts, concurrency 4)", { timeout: 600_000 }, async () => {
    const PARTS = 20;
    const size = PART_SIZE * PARTS;
    const created = await createUpload(guest, { visibility: "private", name: "big.mov", size, uploader: "Big Uploader" });
    assert.equal(created.status, 200, JSON.stringify(created.data));
    const { key, uploadId, token, partSize, partCount } = created.data;
    assert.equal(partSize, PART_SIZE);
    assert.equal(partCount, PARTS);
    const auth = { key, uploadId, token, size };

    const numbers = Array.from({ length: PARTS }, (_, i) => i + 1);
    const signed = await presign(guest, { action: "sign-parts", ...auth, partNumbers: numbers });
    assert.equal(signed.status, 200);

    const first = Buffer.alloc(PART_SIZE, 0x5a);
    ftypBytes(32).copy(first);
    const chunk = Buffer.alloc(PART_SIZE, 0x5a);
    const etags = new Map();
    const queue = [...numbers];
    async function worker() {
      for (let n = queue.shift(); n !== undefined; n = queue.shift()) {
        const res = await fetch(signed.data.urls[String(n)], { method: "PUT", body: n === 1 ? first : chunk });
        assert.ok(res.ok, `part ${n} failed: ${res.status}`);
        etags.set(n, res.headers.get("etag"));
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);

    const listed = await presign(guest, { action: "list-parts", ...auth });
    assert.equal(listed.status, 200);
    assert.equal(listed.data.parts.length, PARTS);

    // Wrong number of parts is refused.
    const short = numbers.slice(1).map((n) => ({ PartNumber: n, ETag: etags.get(n) }));
    const refused = await presign(guest, { action: "complete", ...auth, parts: short });
    assert.equal(refused.status, 400);

    const parts = numbers.map((n) => ({ PartNumber: n, ETag: etags.get(n) }));
    const done = await presign(guest, { action: "complete", ...auth, parts });
    assert.equal(done.status, 200, JSON.stringify(done.data));

    const head = await s3Client.send(new S3.HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
    assert.equal(head.ContentLength, size);
    assert.equal(head.ContentType, "video/quicktime");
  });

  test("thumbnail flow sets hasThumb (see media.test.mjs for the rejection cases)", async () => {
    const jpegish = jpegBytes(2048);
    const t = await thumbCall(guest, shared, jpegish);
    assert.equal(t.status, 200, JSON.stringify(t.data));

    const { data } = await call("list-shared", { method: "GET", jar: guest });
    const item = data.items.find((i) => i.id === shared.id);
    assert.ok(item.thumbUrl, "thumbUrl should be set");
    const thumb = await fetch(item.thumbUrl);
    assert.equal(thumb.headers.get("content-type"), "image/jpeg");
    assert.ok(Buffer.from(await thumb.arrayBuffer()).equals(jpegish));
  });

  test("removed presigned-thumbnail actions are unknown", async () => {
    const auth = { key: shared.key, uploadId: shared.uploadId, token: shared.token, size: shared.size };
    assert.equal((await presign(guest, { action: "thumb", ...auth })).status, 400);
    assert.equal((await presign(guest, { action: "thumb-done", ...auth })).status, 400);
  });
});
