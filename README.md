# Tom Sloan

Payload Sensor Specialist at NRC Aerospace, based in Nepean, Ontario, Canada.

## About

I integrate sensors into autonomous systems and build the software that makes their data usable. At the National Research Council Canada's Aerospace Research Centre, I integrate and test sensor payloads on aircraft, including drones.

I finished my MASc at Carleton, where I built a drone-based indoor mapping system using neural SLAM.

## Publications

-   Drone-Based Indoor Mapping for Augmented Indoor 3D Modeling Using Neural SLAM, ICCE 2026
-   System for Drone-Based Indoor Mapping for Augmented Reality, I2MTC 2025
-   Impact of Image Resolution on Controlling Drones Using Remote VR Headset Visualization and a Cloud Architecture, SAS 2025

## Site

A single static page, `portfolio/index.html`, rendered from `portfolio/data.js`. Edit `data.js` to change the content.

## Wedding uploads

A private photo/video upload page at `/wedding` (guests) and `/wedding/admin` (the couple). Files go straight from the browser to a Cloudflare R2 bucket via presigned multipart uploads; Netlify Functions (`netlify/functions/wedding-*.ts`, shared code in `netlify/lib/wedding/`) handle auth and signing. Guests can upload as "shared" (visible in the guest gallery) or "private" (admin only).

Environment variables (names only): `WEDDING_PASSWORD`, `WEDDING_COOKIE_SECRET`, `COUPLE_PASSWORD`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. Dev/test only: `R2_ENDPOINT`, `WEDDING_COOKIE_INSECURE`.

The R2 bucket needs a CORS rule allowing `PUT`/`GET` from the site origin and exposing the `ETag` header.

Local dev and tests:

```
npm install
npx tsc
node scripts/wedding-dev-server.mjs      # PORT env, default 8888
npm run test:wedding                     # API tests need R2_ENDPOINT etc. pointing at an S3-compatible server
```

## MCP Server Integration

This portfolio includes a Model Context Protocol (MCP) server written in TypeScript that provides AI assistants like Claude Desktop with structured access to portfolio data.

**What it does:**
- Exposes portfolio resources (profile, projects, experience, skills, education, certifications, publications)
- Provides tools to search projects, filter experience, and query skills
- Fetches live data from the deployed website
- Uses Zod for runtime schema validation

**Architecture:**
- `mcp-core.ts` - Shared logic (tools, resources, data fetching)
- `mcp-server-stdio.ts` - Stdio transport for Claude Desktop (local)
- `netlify/functions/mcp-server-http.ts` - HTTP transport for remote access (in progress)

**Setup for Claude Desktop:**

1. Build the TypeScript: `npm run build`

2. Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "tom-sloan-portfolio": {
      "command": "node",
      "args": ["/absolute/path/to/Portfolio-Website/dist/mcp-server-stdio.js"]
    }
  }
}
```

3. Restart Claude Desktop

After setup, you can ask questions like:
- "What projects has Tom worked on with Python?"
- "Show me Tom's AWS experience"
- "What are Tom's AI-related skills?"

## Connect

-   Portfolio: [tom-sloan.com](https://tom-sloan.com)
-   LinkedIn: [linkedin.com/in/tom-sloan](https://www.linkedin.com/in/tom-sloan)
-   GitHub: [github.com/Tom-Sloan](https://github.com/Tom-Sloan)
