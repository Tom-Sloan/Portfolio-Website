import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), "utf8");
const toml = read("netlify.toml");

const EXPECTED_CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data: https://*.r2.cloudflarestorage.com; media-src 'self' blob: https://*.r2.cloudflarestorage.com; connect-src 'self' https://*.r2.cloudflarestorage.com; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";

/** Minimal [[headers]] parser: returns Map(for -> values). */
function headerBlocks(text) {
  const out = new Map();
  let cur = null;
  let inValues = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "[[headers]]") {
      cur = { for: "", values: {} };
      inValues = false;
    } else if (line === "[headers.values]") {
      inValues = true;
    } else if (line.startsWith("[")) {
      cur = null;
      inValues = false;
    } else if (cur) {
      const m = /^([A-Za-z0-9_-]+)\s*=\s*"(.*)"\s*$/.exec(line);
      if (!m) continue;
      if (inValues) cur.values[m[1]] = m[2];
      else if (m[1] === "for") {
        cur.for = m[2];
        out.set(cur.for, cur.values);
      }
    }
  }
  return out;
}

describe("wedding headers and config", () => {
  const blocks = headerBlocks(toml);

  for (const path of ["/wedding", "/wedding/*"]) {
    test(`${path} has CSP, Referrer-Policy, robots and cache headers`, () => {
      const v = blocks.get(path);
      assert.ok(v, `no [[headers]] block for ${path}`);
      assert.equal(v["Content-Security-Policy"], EXPECTED_CSP);
      assert.equal(v["Referrer-Policy"], "same-origin");
      assert.equal(v["X-Robots-Tag"], "noindex, nofollow");
      assert.equal(v["Cache-Control"], "no-cache");
      assert.ok(!v["Content-Security-Policy"].includes("unsafe-"));
    });
  }

  test("global X-Frame-Options stays in netlify.toml; _headers no longer sets it", () => {
    assert.equal(blocks.get("/*")?.["X-Frame-Options"], "DENY");
    assert.ok(!/x-frame-options/i.test(read("portfolio/_headers")));
  });

  test("wedding redirects come before the /* catch-all", () => {
    const froms = [...toml.matchAll(/^\s*from\s*=\s*"([^"]+)"/gm)].map((m) => m[1]);
    const catchAll = froms.indexOf("/*");
    assert.ok(catchAll >= 0, "catch-all missing");
    for (const p of ["/wedding", "/wedding/", "/wedding/admin", "/wedding/admin/", "/api/wedding/*"]) {
      const i = froms.indexOf(p);
      assert.ok(i >= 0 && i < catchAll, `${p} must precede /*`);
    }
  });

  test("wedding HTML has no inline script or style (CSP-safe)", () => {
    for (const file of ["portfolio/wedding/index.html", "portfolio/wedding/admin/index.html"]) {
      const html = read(file);
      assert.ok(!/<style/i.test(html), `${file}: <style>`);
      assert.ok(!/\sstyle\s*=/i.test(html), `${file}: style attribute`);
      assert.ok(!/\son[a-z]+\s*=/i.test(html), `${file}: inline event handler`);
      for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) assert.match(tag, /\ssrc=/i, `${file}: inline <script>`);
    }
  });
});
