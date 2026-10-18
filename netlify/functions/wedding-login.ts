import { failedLoginDelay, guestCookie, passwordMatches } from "../lib/wedding/auth.js";
import { requireEnv } from "../lib/wedding/config.js";
import { error, json, rateLimited, readJson, unavailable, wrap } from "../lib/wedding/http.js";
import { RateLimitUnavailable, clientIp, reserve, type Reservation } from "../lib/wedding/ratelimit.js";

export default wrap("POST", async (req, context) => {
  let r: Reservation;
  try {
    r = await reserve("guest-login", clientIp(req, context));
  } catch (e) {
    if (e instanceof RateLimitUnavailable) return unavailable();
    throw e;
  }
  if (r.blocked) return rateLimited(r.retryAfterSec);
  const body = await readJson(req);
  const password = typeof body.password === "string" ? body.password : "";
  if (!passwordMatches(password, requireEnv("WEDDING_PASSWORD"))) {
    await failedLoginDelay();
    return error(401, "Wrong password");
  }
  await r.release();
  return json({ ok: true }, 200, [guestCookie()]);
});

export const config = { path: "/api/wedding/login" };
