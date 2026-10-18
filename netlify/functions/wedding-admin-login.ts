import { adminCookie, failedLoginDelay, guestCookie, passwordMatches } from "../lib/wedding/auth.js";
import { requireEnv } from "../lib/wedding/config.js";
import { error, json, readJson, wrap } from "../lib/wedding/http.js";

export default wrap("POST", async (req) => {
  const body = await readJson(req);
  const password = typeof body.password === "string" ? body.password : "";
  if (!passwordMatches(password, requireEnv("COUPLE_PASSWORD"))) {
    await failedLoginDelay();
    return error(401, "Wrong password");
  }
  return json({ ok: true }, 200, [adminCookie(), guestCookie()]);
});

export const config = { path: "/api/wedding/admin-login" };
