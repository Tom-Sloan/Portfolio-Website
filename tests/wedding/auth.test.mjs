import assert from "node:assert/strict";
import { test } from "node:test";

process.env.WEDDING_COOKIE_SECRET = "test-secret-for-auth-tests";
delete process.env.WEDDING_COOKIE_INSECURE;

const auth = await import("../../dist/netlify/lib/wedding/auth.js");

test("sign and verify a session token", () => {
  const token = auth.signToken("guest", 60);
  const payload = auth.verifyToken(token);
  assert.equal(payload?.role, "guest");
  const admin = auth.verifyToken(auth.signToken("admin", 60));
  assert.equal(admin?.role, "admin");
});

test("tampered token is rejected", () => {
  const token = auth.signToken("guest", 60);
  const [body, sig] = token.split(".");
  const forgedBody = Buffer.from(JSON.stringify({ role: "admin", exp: 9999999999 })).toString("base64url");
  assert.equal(auth.verifyToken(`${forgedBody}.${sig}`), null);
  assert.equal(auth.verifyToken(`${body}.${sig.slice(0, -2)}AA`), null);
  assert.equal(auth.verifyToken("garbage"), null);
  assert.equal(auth.verifyToken(""), null);
});

test("token signed with another secret is rejected", () => {
  const token = auth.signToken("guest", 60);
  process.env.WEDDING_COOKIE_SECRET = "a-different-secret";
  try {
    assert.equal(auth.verifyToken(token), null);
  } finally {
    process.env.WEDDING_COOKIE_SECRET = "test-secret-for-auth-tests";
  }
});

test("expired token is rejected", () => {
  const token = auth.signToken("guest", 60, Date.now() - 120_000);
  assert.equal(auth.verifyToken(token), null);
});

test("upload token binds key, uploadId and size", () => {
  const key = "shared/abc-12345678-1234-1234-1234-123456789012/original.jpg";
  const token = auth.signUploadToken(key, "upload-1", 5000);
  assert.equal(auth.verifyUploadToken(key, "upload-1", 5000, token), true);
  assert.equal(auth.verifyUploadToken(key, "upload-2", 5000, token), false);
  assert.equal(auth.verifyUploadToken(key, "upload-1", 5001, token), false);
  assert.equal(auth.verifyUploadToken(key.replace("shared", "private"), "upload-1", 5000, token), false);
  assert.equal(auth.verifyUploadToken(key, "upload-1", 5000, ""), false);
  assert.equal(auth.verifyUploadToken(key, "upload-1", 5000, "nope"), false);
});

test("password comparison", () => {
  assert.equal(auth.passwordMatches("hunter2", "hunter2"), true);
  assert.equal(auth.passwordMatches("hunter2", "hunter3"), false);
  assert.equal(auth.passwordMatches("", "hunter2"), false);
});

test("cookies carry the required attributes", () => {
  const cookie = auth.guestCookie();
  assert.match(cookie, /^wed_g=/);
  for (const attr of ["HttpOnly", "SameSite=Lax", "Path=/", "Secure"]) assert.ok(cookie.includes(attr), attr);
  assert.ok(auth.adminCookie().startsWith("wed_a="));
});

test("admin token satisfies guest checks", () => {
  const req = new Request("http://localhost/x", {
    headers: { cookie: `wed_a=${auth.signToken("admin", 60)}` },
  });
  assert.equal(auth.getRole(req), "admin");
  const guestOnly = new Request("http://localhost/x", {
    headers: { cookie: `wed_g=${auth.signToken("guest", 60)}` },
  });
  assert.equal(auth.getRole(guestOnly), "guest");
  // A guest token placed in the admin cookie must not grant admin.
  const swapped = new Request("http://localhost/x", {
    headers: { cookie: `wed_a=${auth.signToken("guest", 60)}` },
  });
  assert.equal(auth.getRole(swapped), null);
});
