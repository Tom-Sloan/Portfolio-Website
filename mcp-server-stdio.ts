#!/usr/bin/env node

/**
 * MCP Server - Stdio Transport
 * For Claude Desktop integration (local)
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp-core.js';

async function main() {
  // Create server with shared logic
  const server = createMcpServer();

  // Connect using stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Server is now running and will handle requests from Claude Desktop
  console.error('MCP Stdio server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
