import { HttpError, json, requireRole, wrap } from "../lib/wedding/http.js";
import { listItems, type Visibility } from "../lib/wedding/store.js";

export default wrap("GET", async (req) => {
  requireRole(req, "admin");
  const filter = new URL(req.url).searchParams.get("visibility") ?? "all";
  let visibilities: Visibility[];
  if (filter === "all") visibilities = ["shared", "private"];
  else if (filter === "shared" || filter === "private") visibilities = [filter];
  else throw new HttpError(400, "Invalid visibility");
  return json({ items: await listItems(visibilities) });
});

export const config = { path: "/api/wedding/admin-list" };
