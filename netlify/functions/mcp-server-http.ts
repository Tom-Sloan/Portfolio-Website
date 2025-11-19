/**
 * MCP Server - Streamable HTTP Transport
 * For remote/web clients (Netlify Function)
 */

import type { Handler, HandlerResponse } from '@netlify/functions';
import { createMcpServer } from '../../mcp-core.js';

// Create server instance (shared across invocations)
const server = createMcpServer();

/**
 * Netlify Function handler for HTTP MCP requests
 */
export const handler: Handler = async (event) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Method not allowed. Use POST for MCP requests.'
      }),
    } as HandlerResponse;
  }

  try {
    // Parse the MCP request
    const request = JSON.parse(event.body || '{}');

    // TODO: Implement StreamableHTTPServerTransport
    // The Server class is designed to work with transports, not direct HTTP requests
    // For now, returning a "not implemented" response
    // Future: Use StreamableHTTPServerTransport when implementing full HTTP support

    return {
      statusCode: 501,
      headers: corsHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: request.id || null,
        error: {
          code: -32601,
          message: 'HTTP transport not yet implemented. Please use the stdio server with Claude Desktop.',
        },
      }),
    } as HandlerResponse;
  } catch (error) {
    console.error('Error processing MCP request:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    } as HandlerResponse;
  }
};
