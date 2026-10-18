import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { MAX_THUMB_BYTES, mediaTypeForKey } from "./config.js";
import { bucketName, getS3, getText, presignGet } from "./s3.js";

export type Visibility = "shared" | "private";

export const ID_PATTERN = /^[a-z0-9]+-[0-9a-f-]{36}$/;
export const KEY_PATTERN = /^(shared|private)\/[a-z0-9]+-[0-9a-f-]{36}\/original\.[a-z0-9]{1,5}$/;

export interface Meta {
  id: string;
  visibility: Visibility;
  uploader: string;
  caption: string;
  originalName: string;
  contentType: string;
  size: number;
  createdAt: string;
  hasThumb: boolean;
  /** Object key of the original file (added by `complete`). */
  key?: string;
}

export interface Item {
  id: string;
  visibility: Visibility;
  uploader: string;
  caption: string;
  originalName: string;
  contentType: string;
  size: number;
  createdAt: string;
  thumbUrl: string | null;
  url: string;
}

export function metaKey(visibility: Visibility, id: string): string {
  return `${visibility}/${id}/meta.json`;
}

export function thumbKey(visibility: Visibility, id: string): string {
  return `${visibility}/${id}/thumb.jpg`;
}

export function parseMeta(text: string): Meta | null {
  try {
    const m = JSON.parse(text) as Partial<Meta>;
    if (typeof m.id !== "string" || (m.visibility !== "shared" && m.visibility !== "private")) return null;
    return {
      id: m.id,
      visibility: m.visibility,
      uploader: typeof m.uploader === "string" ? m.uploader : "",
      caption: typeof m.caption === "string" ? m.caption : "",
      originalName: typeof m.originalName === "string" ? m.originalName : "file",
      contentType: typeof m.contentType === "string" ? m.contentType : "application/octet-stream",
      size: typeof m.size === "number" ? m.size : 0,
      createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date(0).toISOString(),
      hasThumb: m.hasThumb === true,
      key: typeof m.key === "string" ? m.key : undefined,
    };
  } catch {
    return null;
  }
}

export async function readMeta(visibility: Visibility, id: string): Promise<Meta | null> {
  const text = await getText(metaKey(visibility, id));
  return text === null ? null : parseMeta(text);
}

const metaCache = new Map<string, Meta | null>();

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

interface Group {
  visibility: Visibility;
  id: string;
  metaEtag?: string;
  original?: { key: string; size: number };
  hasThumbObject: boolean;
}

async function listPrefix(visibility: Visibility): Promise<Group[]> {
  const groups = new Map<string, Group>();
  let token: string | undefined;
  do {
    const res = await getS3().send(
      new ListObjectsV2Command({
        Bucket: bucketName(),
        Prefix: `${visibility}/`,
        ContinuationToken: token,
      }),
    );
    for (const obj of res.Contents ?? []) {
      const key = obj.Key;
      if (!key) continue;
      const parts = key.split("/");
      if (parts.length !== 3 || parts[0] !== visibility || !ID_PATTERN.test(parts[1])) continue;
      const id = parts[1];
      const name = parts[2];
      let g = groups.get(id);
      if (!g) {
        g = { visibility, id, hasThumbObject: false };
        groups.set(id, g);
      }
      if (name === "meta.json") g.metaEtag = obj.ETag ?? "";
      else if (name === "thumb.jpg") g.hasThumbObject = (obj.Size ?? 0) <= MAX_THUMB_BYTES;
      else if (/^original\.[a-z0-9]{1,5}$/.test(name)) g.original = { key, size: obj.Size ?? 0 };
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return [...groups.values()];
}

async function loadMeta(g: Group): Promise<Meta | null> {
  const key = metaKey(g.visibility, g.id);
  const cacheKey = `${key}:${g.metaEtag ?? ""}`;
  if (metaCache.has(cacheKey)) return metaCache.get(cacheKey) ?? null;
  const meta = await readMeta(g.visibility, g.id);
  metaCache.set(cacheKey, meta);
  return meta;
}

/** List completed uploads under the given visibility prefixes only, newest first. */
export async function listItems(visibilities: Visibility[]): Promise<Item[]> {
  const groups: Group[] = [];
  for (const vis of visibilities) groups.push(...(await listPrefix(vis)));
  const complete = groups.filter((g) => g.metaEtag !== undefined && g.original !== undefined);

  const items = await mapLimit(complete, 16, async (g): Promise<Item | null> => {
    const meta = await loadMeta(g);
    if (!meta || !g.original) return null;
    // Served type comes from the key's extension, never from stored metadata.
    const contentType = mediaTypeForKey(g.original.key)?.mime ?? "application/octet-stream";
    const [url, thumbUrl] = await Promise.all([
      presignGet(g.original.key, { contentType }),
      meta.hasThumb && g.hasThumbObject
        ? presignGet(thumbKey(g.visibility, g.id), { contentType: "image/jpeg" })
        : Promise.resolve(null),
    ]);
    return {
      id: g.id,
      visibility: g.visibility,
      uploader: meta.uploader,
      caption: meta.caption,
      originalName: meta.originalName,
      contentType,
      size: g.original.size,
      createdAt: meta.createdAt,
      thumbUrl,
      url,
    };
  });

  return items
    .filter((i): i is Item => i !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}
