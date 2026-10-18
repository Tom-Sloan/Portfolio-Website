import { clearCookies } from "../lib/wedding/auth.js";
import { json, wrap } from "../lib/wedding/http.js";

export default wrap("POST", async () => json({ ok: true }, 200, clearCookies()));

export const config = { path: "/api/wedding/logout" };
