import { getRole, type Role } from "./auth.js";

export const MAX_BODY_BYTES = 64 * 1024;

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function json(data: unknown, status = 200, cookies: string[] = []): Response {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(JSON.stringify(data), { status, headers });
}

export function error(status: number, message: string): Response {
  return json({ error: message }, status);
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) throw new HttpError(413, "Request too large");
  const text = await req.text();
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) throw new HttpError(413, "Request too large");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new HttpError(400, "Expected a JSON object");
  }
  return parsed as Record<string, unknown>;
}

function checkSameOrigin(req: Request): void {
  const origin = req.headers.get("origin");
  if (origin === null) return;
  if (origin !== new URL(req.url).origin) throw new HttpError(403, "Cross-origin request rejected");
}

/** Wrap a handler: method check, same-origin check on POST, error mapping. */
export function wrap(
  method: "GET" | "POST",
  fn: (req: Request) => Promise<Response>,
): (req: Request, context?: unknown) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    try {
      if (req.method !== method) throw new HttpError(405, "Method not allowed");
      if (method === "POST") checkSameOrigin(req);
      return await fn(req);
    } catch (e) {
      if (e instanceof HttpError) return error(e.status, e.message);
      console.error("wedding function error:", e instanceof Error ? `${e.name}: ${e.message}` : "unknown");
      return error(500, "Server error");
    }
  };
}

/** Throws 401 if no valid guest/admin cookie, 403 if admin is required but missing. */
export function requireRole(req: Request, needed: Role): Role {
  const role = getRole(req);
  if (role === null) throw new HttpError(401, "Not signed in");
  if (needed === "admin" && role !== "admin") throw new HttpError(403, "Forbidden");
  return role;
}

export function str(value: unknown, field: string, min: number, max: number): string {
  if (typeof value !== "string") throw new HttpError(400, `Invalid ${field}`);
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) throw new HttpError(400, `Invalid ${field}`);
  return trimmed;
}
