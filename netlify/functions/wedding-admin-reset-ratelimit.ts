import { json, requireRole, wrap } from "../lib/wedding/http.js";
import { resetAll } from "../lib/wedding/ratelimit.js";

export default wrap("POST", async (req) => {
  requireRole(req, "admin");
  return json({ deleted: await resetAll() });
});

export const config = { path: "/api/wedding/admin-reset-ratelimit" };
