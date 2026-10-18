// Tiny dev server: serves portfolio/ and routes /api/wedding/<name> to the compiled
// Netlify functions in dist/netlify/functions/wedding-<name>.js. Run `npx tsc` first.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicDir = join(root, "portfolio");
const functionsDir = join(root, "dist", "netlify", "functions");
const port = Number(process.env.PORT || 8888);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const REWRITES = new Map([
  ["/wedding", "/wedding/index.html"],
  ["/wedding/", "/wedding/index.html"],
  ["/wedding/admin", "/wedding/admin/index.html"],
  ["/wedding/admin/", "/wedding/admin/index.html"],
]);

// Minimal parser for the [[headers]] blocks in netlify.toml: `for = "..."` plus the
// `key = "value"` lines under [headers.values]. Returns [{ for, values }].
function loadHeaderRules() {
  let text = "";
  try {
    text = readFileSync(join(root, "netlify.toml"), "utf8");
  } catch {
    return [];
  }
  const rules = [];
  let rule = null;
  let inValues = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "[[headers]]") {
      rule = { for: "", values: {} };
      rules.push(rule);
      inValues = false;
    } else if (line === "[headers.values]") {
      inValues = rule !== null;
    } else if (line.startsWith("[")) {
      rule = null;
      inValues = false;
    } else if (rule) {
      const m = /^([A-Za-z0-9_-]+)\s*=\s*"(.*)"\s*(?:#.*)?$/.exec(line);
      if (!m) continue;
      if (inValues) rule.values[m[1]] = m[2];
      else if (m[1] === "for") rule.for = m[2];
    }
  }
  return rules;
}

const headerRules = loadHeaderRules();

function ruleMatches(pattern, pathname) {
  if (pattern.endsWith("/*")) return pathname === pattern.slice(0, -2) || pathname.startsWith(pattern.slice(0, -1));
  return pathname === pattern;
}

// With R2_ENDPOINT set (local S3-compatible server), allow its origin for media and uploads.
function r2Origin() {
  try {
    return process.env.R2_ENDPOINT ? new URL(process.env.R2_ENDPOINT).origin : null;
  } catch {
    return null;
  }
}

function withR2Origin(csp, origin) {
  return csp
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (/^(img-src|media-src|connect-src)\s/.test(d) ? `${d} ${origin}` : d))
    .join("; ");
}

function headersFor(pathname) {
  const out = {};
  for (const rule of headerRules) {
    if (ruleMatches(rule.for, pathname)) Object.assign(out, rule.values);
  }
  const origin = r2Origin();
  if (origin && out["Content-Security-Policy"]) {
    out["Content-Security-Policy"] = withR2Origin(out["Content-Security-Policy"], origin);
  }
  return out;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function handleApi(req, res, url) {
  const name = url.pathname.slice("/api/wedding/".length);
  if (!/^[a-z-]+$/.test(name)) {
    res.writeHead(404).end("Not found");
    return;
  }
  let handler;
  try {
    const mod = await import(pathToFileURL(join(functionsDir, `wedding-${name}.js`)).href);
    handler = mod.default;
  } catch {
    res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Not found" }));
    return;
  }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => headers.append(k, x));
    else if (v !== undefined) headers.set(k, v);
  }
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const request = new Request(`http://${req.headers.host || `localhost:${port}`}${req.url}`, {
    method: req.method,
    headers,
    body: hasBody ? await readBody(req) : undefined,
  });
  const response = await handler(request, { ip: req.headers["x-nf-client-connection-ip"] ?? req.socket.remoteAddress });
  const out = {};
  response.headers.forEach((value, key) => {
    if (key !== "set-cookie") out[key] = value;
  });
  const cookies = response.headers.getSetCookie();
  if (cookies.length) out["set-cookie"] = cookies;
  res.writeHead(response.status, out);
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function handleStatic(req, res, url) {
  let path = REWRITES.get(url.pathname) ?? url.pathname;
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(publicDir, decodeURIComponent(path)));
  if (!file.startsWith(publicDir)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    if (!(await stat(file)).isFile()) throw new Error("not a file");
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      ...headersFor(url.pathname),
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname.startsWith("/api/wedding/")) await handleApi(req, res, url);
    else await handleStatic(req, res, url);
  } catch (e) {
    console.error("dev server error:", e instanceof Error ? e.message : e);
    if (!res.headersSent) res.writeHead(500);
    res.end("Server error");
  }
}).listen(port, () => console.log(`wedding dev server on http://localhost:${port}/wedding`));
