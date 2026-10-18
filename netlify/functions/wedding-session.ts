import { getRole } from "../lib/wedding/auth.js";
import { json, wrap } from "../lib/wedding/http.js";

export default wrap("GET", async (req) => {
  const role = getRole(req);
  return json({ guest: role !== null, admin: role === "admin" });
});

export const config = { path: "/api/wedding/session" };
