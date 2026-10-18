import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { createHash } from "node:crypto";
import { COUPLE_PW, GUEST_PW, Jar, call, loginAdmin, makeS3, skip, uniqueIp } from "./_helpers.mjs";

const bucket = () => process.env.R2_BUCKET;
const MSG = "Too many attempts. Please wait a few minutes and try again.";

describe("login rate limiting", { skip }, () => {
  let S3;
  let s3;
  let rl;
  let s3mod;

  async function listKeys() {
    const out = [];
    let token;
    do {
      const res = await s3.send(new S3.ListObjectsV2Command({ Bucket: bucket(), Prefix: "ratelimit/", ContinuationToken: token }));
      for (const o of res.Contents ?? []) out.push(o.Key);
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    return out;
  }

  async function wipe() {
    for (const Key of await listKeys()) await s3.send(new S3.DeleteObjectCommand({ Bucket: bucket(), Key }));
  }

  const wrongGuest = (ip) => call("login", { body: { password: "wrong" }, ip });
  const wrongAdmin = (ip) => call("admin-login", { body: { password: "wrong" }, ip });

  before(async () => {
    ({ S3, client: s3 } = await makeS3());
    rl = await import("../../dist/netlify/lib/wedding/ratelimit.js");
    s3mod = await import("../../dist/netlify/lib/wedding/s3.js");
    await wipe();
  });

  test("10 wrong guest logins -> 11th is 429 even with the right password; other IPs unaffected", async () => {
    const ip = uniqueIp();
    for (let i = 0; i < rl.LIMITS["guest-login"].perIp; i++) {
      const r = await wrongGuest(ip);
      assert.equal(r.status, 401, `attempt ${i + 1}`);
    }
    const blocked = await call("login", { body: { password: GUEST_PW }, ip });
    assert.equal(blocked.status, 429);
    assert.equal(blocked.data.error, MSG);
    const retry = Number(blocked.res.headers.get("retry-after"));
    assert.ok(retry >= 1 && retry <= 900, `Retry-After ${retry}`);
    assert.equal(blocked.res.headers.getSetCookie().length, 0);

    const other = new Jar();
    const ok = await call("login", { jar: other, body: { password: GUEST_PW }, ip: uniqueIp() });
    assert.equal(ok.status, 200);
    assert.ok(other.cookies.has("wed_g"));
  });

  test("concurrent wrong logins from one IP: at most `perIp` get 401, the rest 429", async () => {
    const ip = uniqueIp();
    const results = await Promise.all(Array.from({ length: 40 }, () => wrongGuest(ip)));
    const n401 = results.filter((r) => r.status === 401).length;
    const n429 = results.filter((r) => r.status === 429).length;
    assert.ok(n401 <= rl.LIMITS["guest-login"].perIp, `${n401} were allowed through`);
    assert.equal(n401 + n429, 40, JSON.stringify(results.map((r) => r.status)));
    const after = await call("login", { body: { password: GUEST_PW }, ip });
    assert.equal(after.status, 429);
  });

  test("successful logins release their reservation", async () => {
    const ip = uniqueIp();
    for (let i = 0; i < rl.LIMITS["guest-login"].perIp + 5; i++) {
      const r = await call("login", { body: { password: GUEST_PW }, ip });
      assert.equal(r.status, 200, `login ${i + 1}`);
    }
    const hash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
    assert.ok(!(await listKeys()).some((k) => k.includes(`/ip/${hash}/`)), "reservations should be released");
  });

  test("no raw IP is stored; one object per attempt under ratelimit/", async () => {
    const ip = `203.0.113.${Math.floor(Math.random() * 200)}-raw-check`;
    await wrongGuest(ip);
    const keys = await listKeys();
    assert.ok(keys.length > 0);
    assert.ok(keys.every((k) => k.startsWith("ratelimit/")));
    assert.ok(!keys.some((k) => k.includes(ip)));
    const hash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
    assert.ok(keys.some((k) => k.includes(`/ip/${hash}/`)), "hashed ip key missing");
  });

  test("the trusted context ip is used (header is only a fallback)", async () => {
    const ip = uniqueIp();
    for (let i = 0; i < rl.LIMITS["guest-login"].perIp; i++) await wrongGuest(ip);
    // Spoofed header with a different value must not escape the limit when context.ip is set.
    const f = (await import("../../dist/netlify/functions/wedding-login.js")).default;
    const req = new Request("http://localhost/api/wedding/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-nf-client-connection-ip": uniqueIp(), "x-forwarded-for": uniqueIp() },
      body: JSON.stringify({ password: GUEST_PW }),
    });
    assert.equal((await f(req, { ip })).status, 429);
  });

  test("window rollover unblocks (injected time)", async () => {
    const ip = uniqueIp();
    const t0 = Date.UTC(2030, 0, 1, 12, 0, 0);
    const limit = rl.LIMITS["guest-login"].perIp;
    for (let i = 0; i < limit; i++) assert.equal((await rl.reserve("guest-login", ip, t0)).blocked, false);
    const during = await rl.reserve("guest-login", ip, t0 + 1000);
    assert.equal(during.blocked, true);
    assert.ok(during.retryAfterSec >= 1 && during.retryAfterSec <= 900);
    const later = await rl.reserve("guest-login", ip, t0 + rl.WINDOW_MS + 1000);
    assert.equal(later.blocked, false);
  });

  test("global cap blocks every IP in the window", async () => {
    const scope = "guest-login";
    const original = rl.LIMITS[scope].global;
    rl.LIMITS[scope].global = 3;
    try {
      const now = Date.UTC(2031, 5, 1, 8, 0, 0);
      for (let i = 0; i < 3; i++) assert.equal((await rl.reserve(scope, uniqueIp(), now)).blocked, false);
      assert.equal((await rl.reserve(scope, uniqueIp(), now)).blocked, true);
      assert.equal((await rl.reserve(scope, uniqueIp(), now + rl.WINDOW_MS)).blocked, false);
    } finally {
      rl.LIMITS[scope].global = original;
    }
  });

  test("countUpTo paginates across pages (pageSize 3, limit 7)", async () => {
    const prefix = `ratelimit/test-pagination/${uniqueIp()}/`;
    const put = (n) =>
      Promise.all(
        Array.from({ length: n }, (_, i) =>
          s3.send(new S3.PutObjectCommand({ Bucket: bucket(), Key: `${prefix}${i}`, Body: "" })),
        ),
      );
    rl.setPageSizeForTests(3);
    try {
      await put(5);
      assert.equal(await rl.countUpTo(prefix, 7), 5, "listing ends before the limit");
      await put(12);
      assert.equal(await rl.countUpTo(prefix, 7), 8, "stops once the count exceeds the limit");
    } finally {
      rl.setPageSizeForTests();
    }
  });

  test("admin scope has no global cap", async () => {
    assert.equal(rl.LIMITS["admin-login"].global, undefined);
    for (let i = 0; i < 40; i++) assert.equal((await wrongAdmin(uniqueIp())).status, 401);
    const jar = new Jar();
    const ok = await call("admin-login", { jar, body: { password: COUPLE_PW }, ip: uniqueIp() });
    assert.equal(ok.status, 200);
    assert.ok(jar.cookies.has("wed_a") || jar.cookies.size > 0);
  });

  test("create scope: per-IP cap, reservations are never released", async () => {
    const original = rl.LIMITS.create.perIp;
    rl.LIMITS.create.perIp = 2;
    try {
      const ip = uniqueIp();
      assert.equal((await rl.reserve("create", ip)).blocked, false);
      assert.equal((await rl.reserve("create", ip)).blocked, false);
      assert.equal((await rl.reserve("create", ip)).blocked, true);
      assert.equal((await rl.reserve("create", uniqueIp())).blocked, false);
    } finally {
      rl.LIMITS.create.perIp = original;
    }
  });

  test("fails closed with 503 when storage is unreachable", async () => {
    const saved = process.env.R2_ENDPOINT;
    process.env.R2_ENDPOINT = "http://127.0.0.1:1";
    s3mod.resetS3Cache();
    try {
      const guest = await call("login", { body: { password: GUEST_PW }, ip: uniqueIp() });
      assert.equal(guest.status, 503, JSON.stringify(guest.data));
      assert.equal(guest.data.error, "Temporarily unavailable, please try again shortly.");
      assert.equal(guest.res.headers.getSetCookie().length, 0);
      const admin = await call("admin-login", { body: { password: COUPLE_PW }, ip: uniqueIp() });
      assert.equal(admin.status, 503);
    } finally {
      process.env.R2_ENDPOINT = saved;
      s3mod.resetS3Cache();
    }
    assert.equal((await call("login", { body: { password: GUEST_PW }, ip: uniqueIp() })).status, 200);
  });

  test("admin scope is independent of guest scope", async () => {
    const ip = uniqueIp();
    for (let i = 0; i < rl.LIMITS["guest-login"].perIp; i++) await wrongGuest(ip);
    assert.equal((await call("login", { body: { password: GUEST_PW }, ip })).status, 429);
    assert.equal((await call("admin-login", { body: { password: COUPLE_PW }, ip })).status, 200);

    const ip2 = uniqueIp();
    for (let i = 0; i < rl.LIMITS["admin-login"].perIp; i++) {
      assert.equal((await wrongAdmin(ip2)).status, 401);
    }
    const blocked = await call("admin-login", { body: { password: COUPLE_PW }, ip: ip2 });
    assert.equal(blocked.status, 429);
    assert.ok(blocked.res.headers.get("retry-after"));
    assert.equal((await call("login", { body: { password: GUEST_PW }, ip: ip2 })).status, 200);
  });

  test("admin-reset-ratelimit requires admin and clears lockouts", async () => {
    const ip = uniqueIp();
    for (let i = 0; i < rl.LIMITS["guest-login"].perIp; i++) await wrongGuest(ip);
    assert.equal((await call("login", { body: { password: GUEST_PW }, ip })).status, 429);

    assert.equal((await call("admin-reset-ratelimit", { body: {} })).status, 401);
    const guestJar = new Jar();
    assert.equal((await call("login", { jar: guestJar, body: { password: GUEST_PW }, ip: uniqueIp() })).status, 200);
    assert.equal((await call("admin-reset-ratelimit", { jar: guestJar, body: {} })).status, 403);
    assert.equal((await call("login", { body: { password: GUEST_PW }, ip })).status, 429);

    const admin = await loginAdmin(new Jar());
    const reset = await call("admin-reset-ratelimit", { jar: admin, body: {} });
    assert.equal(reset.status, 200, JSON.stringify(reset.data));
    assert.ok(reset.data.deleted >= 2, JSON.stringify(reset.data));
    // (Other test files may be writing reservations concurrently, so only check this IP's.)
    const hash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
    assert.ok(!(await listKeys()).some((k) => k.includes(`/ip/${hash}/`)));

    assert.equal((await call("login", { body: { password: GUEST_PW }, ip })).status, 200);
  });
});
