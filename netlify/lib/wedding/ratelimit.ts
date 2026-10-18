import { createHash, randomUUID } from "node:crypto";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { bucketName, getS3 } from "./s3.js";

export type Scope = "guest-login" | "admin-login" | "create";

export const WINDOW_MS = 15 * 60 * 1000;
export const RATELIMIT_PREFIX = "ratelimit/";

export interface Limits {
  perIp: number;
  /** Omitted when the scope has no global cap. */
  global?: number;
}

/** Exported (and deliberately mutable) so tests can lower the caps temporarily. */
export const LIMITS: Record<Scope, Limits> = {
  "guest-login": { perIp: 10, global: 300 },
  // No global cap: it would let an attacker lock the couple out entirely.
  "admin-login": { perIp: 10 },
  create: { perIp: 600, global: 5000 },
};

/** Thrown when the limiter cannot reach storage; callers answer 503 (fail closed). */
export class RateLimitUnavailable extends Error {
  constructor() {
    super("rate limiter unavailable");
    this.name = "RateLimitUnavailable";
  }
}

/** The trusted client IP: Netlify's `context.ip`, else the Netlify connection header. */
export function clientIp(req: Request, context?: unknown): string {
  const ip = (context as { ip?: unknown } | null | undefined)?.ip;
  if (typeof ip === "string" && ip.trim()) return ip.trim();
  return req.headers.get("x-nf-client-connection-ip")?.trim() || "unknown";
}

function ipHash(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

let pageSize = 1000;

/** Test hook: lower the ListObjectsV2 page size (pass nothing to restore the default). */
export function setPageSizeForTests(size = 1000): void {
  pageSize = size;
}

/** Counts objects under `prefix`, stopping as soon as the count exceeds `limit`. */
export async function countUpTo(prefix: string, limit: number): Promise<number> {
  const s3 = getS3();
  const bucket = bucketName();
  let count = 0;
  let token: string | undefined;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: Math.min(pageSize, limit - count + 1),
        ContinuationToken: token,
      }),
    );
    count += res.Contents?.length ?? 0;
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token && count <= limit);
  return count;
}

export interface Reservation {
  blocked: boolean;
  retryAfterSec: number;
  /** Remove this request's own reservation (use after a successful login). */
  release: () => Promise<void>;
}

/**
 * Reserve one attempt: write a per-attempt object FIRST, then list. Each request lists after
 * its own write, so at most `limit` concurrent requests can ever observe a count <= limit.
 */
export async function reserve(scope: Scope, ip: string, now: number = Date.now()): Promise<Reservation> {
  const limits = LIMITS[scope];
  const w = Math.floor(now / WINDOW_MS);
  const name = `${now.toString(36)}-${randomUUID()}`;
  const ipPrefix = `${RATELIMIT_PREFIX}${scope}/ip/${ipHash(ip)}/${w}/`;
  const globalPrefix = limits.global === undefined ? null : `${RATELIMIT_PREFIX}${scope}/global/${w}/`;
  const keys = [ipPrefix + name, ...(globalPrefix ? [globalPrefix + name] : [])];

  let blocked: boolean;
  try {
    const s3 = getS3();
    const bucket = bucketName();
    await Promise.all(keys.map((Key) => s3.send(new PutObjectCommand({ Bucket: bucket, Key, Body: "" }))));
    const [ipCount, globalCount] = await Promise.all([
      countUpTo(ipPrefix, limits.perIp),
      globalPrefix && limits.global !== undefined ? countUpTo(globalPrefix, limits.global) : 0,
    ]);
    blocked = ipCount > limits.perIp || (limits.global !== undefined && globalCount > limits.global);
  } catch {
    console.error("wedding ratelimit: storage error");
    throw new RateLimitUnavailable();
  }

  return {
    blocked,
    retryAfterSec: blocked ? Math.max(1, Math.ceil(((w + 1) * WINDOW_MS - now) / 1000)) : 0,
    release: async () => {
      try {
        await getS3().send(
          new DeleteObjectsCommand({
            Bucket: bucketName(),
            Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
          }),
        );
      } catch {
        console.error("wedding ratelimit: release failed");
      }
    },
  };
}

/** Delete every object under `ratelimit/`. Returns how many were deleted. */
export async function resetAll(): Promise<number> {
  const s3 = getS3();
  const bucket = bucketName();
  let deleted = 0;
  let token: string | undefined;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: RATELIMIT_PREFIX, ContinuationToken: token }),
    );
    const keys = (res.Contents ?? []).map((o) => o.Key).filter((k): k is string => typeof k === "string");
    for (let i = 0; i < keys.length; i += 1000) {
      const batch = keys.slice(i, i + 1000);
      const out = await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
        }),
      );
      deleted += batch.length - (out.Errors?.length ?? 0);
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return deleted;
}
