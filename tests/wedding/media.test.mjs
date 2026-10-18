import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { atomBytes } from "./_helpers.mjs";
import {
  Jar,
  call,
  createUpload,
  exists,
  ftypBytes,
  jpegBytes,
  loginGuest,
  makeS3,
  presign,
  putPart,
  skip,
  thumbCall,
  uploadSmall,
} from "./_helpers.mjs";

const bucket = () => process.env.R2_BUCKET;

describe("media type, size and thumbnail enforcement", { skip }, () => {
  let guest;
  let S3;
  let s3;

  before(async () => {
    ({ S3, client: s3 } = await makeS3());
    guest = await loginGuest(new Jar());
  });

  test("create rejects non-media extensions", async () => {
    for (const name of ["a.svg", "a.html", "a.exe", "x.exe.jpg", "x.html.png", "noextension", "photo.", "a.pdf"]) {
      const r = await createUpload(guest, { name, size: 10, contentType: "image/jpeg" });
      assert.equal(r.status, 400, `${name}: ${JSON.stringify(r.data)}`);
      assert.equal(r.data.error, "Only photos and videos can be uploaded", name);
    }
  });

  test("create accepts upper-case HEIC / MOV and uses canonical extensions", async () => {
    const heic = await createUpload(guest, { name: "IMG_1.HEIC", size: 10 });
    assert.equal(heic.status, 200, JSON.stringify(heic.data));
    assert.match(heic.data.key, /\/original\.heic$/);
    const mov = await createUpload(guest, { name: "clip.MOV", size: 10 });
    assert.equal(mov.status, 200, JSON.stringify(mov.data));
    assert.match(mov.data.key, /\/original\.mov$/);
    const jpeg = await createUpload(guest, { name: "pic.JPEG", size: 10 });
    assert.equal(jpeg.status, 200);
    assert.match(jpeg.data.key, /\/original\.jpg$/);
  });

  test("stored ContentType is canonical regardless of the declared one", async () => {
    const up = await uploadSmall(guest, {
      visibility: "shared",
      name: "sneaky.jpg",
      bytes: jpegBytes(600),
      contentType: "text/html",
    });
    const head = await s3.send(new S3.HeadObjectCommand({ Bucket: bucket(), Key: up.key }));
    assert.equal(head.ContentType, "image/jpeg");
    assert.equal(head.Metadata?.declaredsize, "600");

    const heic = await uploadSmall(guest, {
      visibility: "private",
      name: "IMG.HEIC",
      bytes: ftypBytes(700, "heic"),
      contentType: "application/x-evil",
    });
    const h2 = await s3.send(new S3.HeadObjectCommand({ Bucket: bucket(), Key: heic.key }));
    assert.equal(h2.ContentType, "image/heic");
  });

  test("sign-parts rejects part numbers beyond partCount and signs content-length", async () => {
    const size = 4000;
    const created = await createUpload(guest, { name: "p.jpg", size });
    assert.equal(created.status, 200);
    assert.equal(created.data.partCount, 1);
    const auth = { key: created.data.key, uploadId: created.data.uploadId, token: created.data.token, size };

    for (const bad of [[2], [0], [1, 2], [1.5]]) {
      const r = await presign(guest, { action: "sign-parts", ...auth, partNumbers: bad });
      assert.equal(r.status, 400, JSON.stringify(bad));
    }

    const ok = await presign(guest, { action: "sign-parts", ...auth, partNumbers: [1] });
    assert.equal(ok.status, 200);
    const signedHeaders = new URL(ok.data.urls["1"]).searchParams.get("X-Amz-SignedHeaders") ?? "";
    assert.ok(signedHeaders.split(";").includes("content-length"), `SignedHeaders: ${signedHeaders}`);
  });

  test("multi-part sizing: partCount and token binding", async () => {
    const size = 10 * 1024 * 1024 + 1;
    const created = await createUpload(guest, { name: "two.mp4", size });
    assert.equal(created.status, 200);
    assert.equal(created.data.partCount, 2);
    const auth = { key: created.data.key, uploadId: created.data.uploadId, token: created.data.token, size };
    assert.equal((await presign(guest, { action: "sign-parts", ...auth, partNumbers: [3] })).status, 400);
    assert.equal((await presign(guest, { action: "sign-parts", ...auth, partNumbers: [1, 2] })).status, 200);
    // A different size with the same token is forged.
    assert.equal((await presign(guest, { action: "sign-parts", ...auth, size: size - 1, partNumbers: [1] })).status, 403);
    await presign(guest, { action: "abort", ...auth });
  });

  test("complete: size mismatch -> 400 and object deleted", async () => {
    const declared = 6000;
    const bytes = jpegBytes(3000);
    const created = await createUpload(guest, { name: "short.jpg", size: declared });
    assert.equal(created.status, 200);
    const { key, uploadId, token } = created.data;
    const etag = await putPart(guest, created.data, declared, bytes);
    const done = await presign(guest, {
      action: "complete",
      key,
      uploadId,
      token,
      size: declared,
      parts: [{ PartNumber: 1, ETag: etag }],
    });
    assert.equal(done.status, 400, JSON.stringify(done.data));
    assert.equal(done.data.error, "Size mismatch");
    assert.equal(await exists(S3, s3, key), false);
  });

  test("complete: magic-bytes mismatch -> 415 and object deleted", async () => {
    const bytes = Buffer.from("<html><script>alert(1)</script></html>");
    const created = await createUpload(guest, { name: "fake.jpg", size: bytes.length });
    assert.equal(created.status, 200);
    const { key, uploadId, token } = created.data;
    const etag = await putPart(guest, created.data, bytes.length, bytes);
    const done = await presign(guest, {
      action: "complete",
      key,
      uploadId,
      token,
      size: bytes.length,
      parts: [{ PartNumber: 1, ETag: etag }],
    });
    assert.equal(done.status, 415, JSON.stringify(done.data));
    assert.equal(done.data.error, "File content doesn't match its type");
    assert.equal(await exists(S3, s3, key), false);
  });

  test("thumb: validation and success", async () => {
    const up = await uploadSmall(guest, { visibility: "shared", bytes: jpegBytes(1500), name: "t.jpg" });

    // forged token
    assert.equal((await thumbCall(guest, up, jpegBytes(500), { token: "forged" })).status, 403);
    // no cookie
    assert.equal((await thumbCall(null, up, jpegBytes(500))).status, 401);
    // not a JPEG (right header, wrong bytes; and wrong content-type)
    assert.equal((await thumbCall(guest, up, Buffer.from("\x89PNG\r\n\x1a\n-----"))).status, 400);
    // Starts like a JPEG but is truncated (no FF D9 trailer).
    const truncated = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]);
    assert.equal((await thumbCall(guest, up, truncated)).status, 400);
    assert.equal((await thumbCall(guest, up, jpegBytes(500), { type: "text/plain" })).status, 400);
    // too big
    const big = await thumbCall(guest, up, jpegBytes(300 * 1024 + 1));
    assert.equal(big.status, 413);

    // upload not completed yet
    const pending = await createUpload(guest, { name: "pending.jpg", size: 100 });
    assert.equal(pending.status, 200);
    const early = await thumbCall(guest, { ...pending.data, size: 100 }, jpegBytes(500));
    assert.ok([400, 409].includes(early.status), `status ${early.status}`);
    assert.equal(early.status, 409);

    // valid: exactly at the cap
    const ok = await thumbCall(guest, up, jpegBytes(300 * 1024));
    assert.equal(ok.status, 200, JSON.stringify(ok.data));
    const listed = await call("list-shared", { method: "GET", jar: guest });
    assert.ok(listed.data.items.find((i) => i.id === up.id)?.thumbUrl);
  });

  test("oversized thumb.jpg already in storage is ignored by the listing", async () => {
    const up = await uploadSmall(guest, { visibility: "shared", bytes: jpegBytes(900), name: "o.jpg" });
    assert.equal((await thumbCall(guest, up, jpegBytes(400))).status, 200);
    const thumbKey = up.key.replace(/original\.jpg$/, "thumb.jpg");
    await s3.send(
      new S3.PutObjectCommand({ Bucket: bucket(), Key: thumbKey, Body: jpegBytes(300 * 1024 + 10), ContentType: "image/jpeg" }),
    );
    const listed = await call("list-shared", { method: "GET", jar: guest });
    assert.equal(listed.data.items.find((i) => i.id === up.id)?.thumbUrl, null);
  });
});

describe("matchesMagic (unit)", () => {
  let matchesMagic;
  before(async () => {
    ({ matchesMagic } = await import("../../dist/netlify/lib/wedding/media.js"));
  });

  test("QuickTime/MP4 files may start with moov, mdat, wide, free, skip, pnot or ftyp", () => {
    for (const type of ["moov", "mdat", "wide", "free", "skip", "pnot"]) {
      assert.equal(matchesMagic("mov", atomBytes(64, type)), true, type);
    }
    assert.equal(matchesMagic("mp4", ftypBytes(64, "isom")), true);
    assert.equal(matchesMagic("mov", atomBytes(64, "junk")), false);
  });

  test("HEIC/HEIF need a HEIF brand, AVIF an AVIF brand", () => {
    assert.equal(matchesMagic("heic", ftypBytes(64, "mif1")), true);
    assert.equal(matchesMagic("heic", ftypBytes(64, "heic")), true);
    assert.equal(matchesMagic("heic", ftypBytes(64, "isom")), false);
    assert.equal(matchesMagic("heif", ftypBytes(64, "mp42")), false);
    assert.equal(matchesMagic("avif", ftypBytes(64, "avif")), true);
    assert.equal(matchesMagic("avif", ftypBytes(64, "avis")), true);
    assert.equal(matchesMagic("avif", ftypBytes(64, "heic")), false);
    // mif1 + heic brands only (no avif/avis) is HEIC, not AVIF.
    const heicOnly = Buffer.concat([
      Buffer.from([0, 0, 0, 0x18]),
      Buffer.from("ftypmif1"),
      Buffer.alloc(4),
      Buffer.from("heic"),
      Buffer.alloc(4),
    ]);
    assert.equal(matchesMagic("avif", heicOnly), false);
    assert.equal(matchesMagic("heic", heicOnly), true);
    // A compatible brand (after major brand + minor version) counts.
    const compat = Buffer.concat([
      Buffer.from([0, 0, 0, 0x1c]),
      Buffer.from("ftypisom"),
      Buffer.alloc(4),
      Buffer.from("isomheic"),
      Buffer.alloc(8),
    ]);
    assert.equal(matchesMagic("heic", compat), true);
  });

  test("image/container signatures", () => {
    assert.equal(matchesMagic("jpg", Buffer.from([0xff, 0xd8, 0xff, 0xe1])), true);
    assert.equal(matchesMagic("jpg", Buffer.from([0xff, 0xd8, 0xff, 0x00])), false);
    assert.equal(matchesMagic("png", Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), true);
    assert.equal(matchesMagic("png", Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0])), false);
    assert.equal(matchesMagic("gif", Buffer.from("GIF89a")), true);
    assert.equal(matchesMagic("gif", Buffer.from("GIF88a")), false);
    assert.equal(matchesMagic("webp", Buffer.from("RIFF\0\0\0\0WEBP")), true);
    assert.equal(matchesMagic("webm", Buffer.from([0x1a, 0x45, 0xdf, 0xa3])), true);
    assert.equal(matchesMagic("dng", Buffer.from("II*\0")), true);
    assert.equal(matchesMagic("dng", Buffer.from("MM\0*")), true);
  });
});
