import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE,
  ADMIN_TTL_SECONDS,
  GUEST_COOKIE,
  GUEST_TTL_SECONDS,
  cookieInsecure,
  cookieSecret,
} from "./config.js";

export type Role = "guest" | "admin";

interface TokenPayload {
  role: Role;
  exp: number; // unix seconds
}

function hmac(data: string): Buffer {
  return createHmac("sha256", cookieSecret()).update(data).digest();
}

function safeEqualBuffers(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Constant-time string comparison (compares sha256 digests). */
export function passwordMatches(supplied: string, expected: string): boolean {
  const a = createHash("sha256").update(supplied).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function signToken(role: Role, ttlSeconds: number, now: number = Date.now()): string {
  const payload: TokenPayload = { role, exp: Math.floor(now / 1000) + ttlSeconds };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = hmac(`session:${body}`).toString("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string, now: number = Date.now()): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expected = hmac(`session:${body}`);
  let given: Buffer;
  try {
    given = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (!safeEqualBuffers(expected, given)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<TokenPayload>;
    if (parsed.role !== "guest" && parsed.role !== "admin") return null;
    if (typeof parsed.exp !== "number" || parsed.exp * 1000 <= now) return null;
    return { role: parsed.role, exp: parsed.exp };
  } catch {
    return null;
  }
}

export function signUploadToken(key: string, uploadId: string): string {
  return hmac(`upload:${key}\n${uploadId}`).toString("base64url");
}

export function verifyUploadToken(key: string, uploadId: string, token: string): boolean {
  if (typeof token !== "string" || token.length === 0) return false;
  const expected = hmac(`upload:${key}\n${uploadId}`);
  let given: Buffer;
  try {
    given = Buffer.from(token, "base64url");
  } catch {
    return false;
  }
  return safeEqualBuffers(expected, given);
}

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const name = part.slice(0, idx).trim();
    if (name && !(name in out)) out[name] = part.slice(idx + 1).trim();
  }
  return out;
}

/** Highest role proven by the request cookies, or null. Admin implies guest. */
export function getRole(req: Request): Role | null {
  const cookies = parseCookies(req.headers.get("cookie"));
  const admin = cookies[ADMIN_COOKIE];
  if (admin && verifyToken(admin)?.role === "admin") return "admin";
  const guest = cookies[GUEST_COOKIE];
  if (guest && verifyToken(guest)?.role === "guest") return "guest";
  return null;
}

function cookieString(name: string, value: string, maxAge: number): string {
  const attrs = [`${name}=${value}`, `Max-Age=${maxAge}`, "HttpOnly", "SameSite=Lax", "Path=/"];
  if (!cookieInsecure()) attrs.push("Secure");
  return attrs.join("; ");
}

export function guestCookie(): string {
  return cookieString(GUEST_COOKIE, signToken("guest", GUEST_TTL_SECONDS), GUEST_TTL_SECONDS);
}

export function adminCookie(): string {
  return cookieString(ADMIN_COOKIE, signToken("admin", ADMIN_TTL_SECONDS), ADMIN_TTL_SECONDS);
}

export function clearCookies(): string[] {
  return [cookieString(GUEST_COOKIE, "", 0), cookieString(ADMIN_COOKIE, "", 0)];
}

export function failedLoginDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}
