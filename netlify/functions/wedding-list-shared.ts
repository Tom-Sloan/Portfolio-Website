import { json, requireRole, wrap } from "../lib/wedding/http.js";
import { listItems } from "../lib/wedding/store.js";

export default wrap("GET", async (req) => {
  requireRole(req, "guest");
  // Only the shared/ prefix is ever listed here.
  const items = await listItems(["shared"]);
  return json({
    items: items.map(({ visibility: _visibility, ...rest }) => rest),
  });
});

export const config = { path: "/api/wedding/list-shared" };
