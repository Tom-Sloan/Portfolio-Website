#!/usr/bin/env node

/**
 * Stdio-based MCP server for Claude Desktop
 * Fetches data from the live portfolio site
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Cache for portfolio data
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch portfolio data from live site
async function fetchPortfolioData() {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  try {
    // Fetch data.js from the live site
    const response = await fetch('https://tom-sloan.com/data.js');
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio data: ${response.statusText}`);
    }

    const text = await response.text();

    // Extract the portfolioData object from the JavaScript file
    const dataMatch = text.match(/const\s+portfolioData\s*=\s*({[\s\S]*?});?\s*$/m);
    if (!dataMatch) {
      throw new Error('Could not extract portfolioData from data.js');
    }

    // Use eval to parse the JavaScript object (safe - we control the source)
    const portfolioData = eval(`(${dataMatch[1]})`);

    // Cache the data
    cachedData = portfolioData;
    cacheTimestamp = now;

    return portfolioData;
  } catch (error) {
    throw new Error(`Error fetching portfolio data: ${error}`);
  }
}

// Create MCP server
const server = new Server(
  {
    name: 'tom-sloan-portfolio',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'portfolio://profile',
        name: 'Profile Information',
        description: "Tom Sloan's professional profile including name, headline, bio, and links",
        mimeType: 'application/json',
      },
      {
        uri: 'portfolio://projects',
        name: 'All Projects',
        description: 'Complete list of projects with descriptions, technologies, and links',
        mimeType: 'application/json',
      },
      {
        uri: 'portfolio://experience',
        name: 'Work Experience',
        description: 'Professional work history including roles, companies, and skills',
        mimeType: 'application/json',
      },
      {
        uri: 'portfolio://skills',
        name: 'Technical Skills',
        description: 'Categorized technical skills and competencies',
        mimeType: 'application/json',
      },
      {
        uri: 'portfolio://education',
        name: 'Education',
        description: 'Academic background and degrees',
        mimeType: 'application/json',
      },
      {
        uri: 'portfolio://certifications',
        name: 'Certifications',
        description: 'Professional certifications and credentials',
        mimeType: 'application/json',
      },
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const data = await fetchPortfolioData();

  let content;
  let description;

  switch (uri) {
    case 'portfolio://profile':
      content = data.profile;
      description = 'Profile information';
      break;
    case 'portfolio://projects':
      content = data.projects;
      description = 'All projects';
      break;
    case 'portfolio://experience':
      content = data.experience;
      description = 'Work experience';
      break;
    case 'portfolio://skills':
      content = data.skills;
      description = 'Technical skills';
      break;
    case 'portfolio://education':
      content = data.education;
      description = 'Education history';
      break;
    case 'portfolio://certifications':
      content = data.certifications;
      description = 'Certifications';
      break;
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(content, null, 2),
      },
    ],
  };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_projects',
        description: 'Search projects by title, description, or technology tag',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (searches in title, description, and tags)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'filter_experience',
        description: 'Filter work experience by company, skill, or date range',
        inputSchema: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              description: 'Filter by company name (partial match)',
            },
            skill: {
              type: 'string',
              description: 'Filter by required skill',
            },
          },
        },
      },
      {
        name: 'get_projects_by_tag',
        description: 'Get all projects that have a specific technology tag',
        inputSchema: {
          type: 'object',
          properties: {
            tag: {
              type: 'string',
              description: 'Technology tag to filter by (e.g., "Python", "Docker", "AI")',
            },
          },
          required: ['tag'],
        },
      },
      {
        name: 'find_skills',
        description: 'Search for skills by name or category',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Skill name or category to search for',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const data = await fetchPortfolioData();

  switch (name) {
    case 'search_projects': {
      const query = args.query.toLowerCase();
      const results = data.projects.filter((project) => {
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = project.description.toLowerCase().includes(query);
        const tagMatch = project.category.some((cat) =>
          cat.tag.toLowerCase().includes(query)
        );
        return titleMatch || descMatch || tagMatch;
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'filter_experience': {
      let results = data.experience;

      if (args.company) {
        const company = args.company.toLowerCase();
        results = results.filter((exp) =>
          exp.company.toLowerCase().includes(company)
        );
      }

      if (args.skill) {
        const skill = args.skill.toLowerCase();
        results = results.filter((exp) =>
          exp.skills.some((s) => s.toLowerCase().includes(skill))
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'get_projects_by_tag': {
      const tag = args.tag.toLowerCase();
      const results = data.projects.filter((project) =>
        project.category.some((cat) => cat.tag.toLowerCase().includes(tag))
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case 'find_skills': {
      const query = args.query.toLowerCase();
      const results = [];

      for (const [category, skills] of Object.entries(data.skills)) {
        if (category.toLowerCase().includes(query)) {
          // Category name matches
          results.push({ category, skills });
        } else {
          // Check if any skills in this category match
          const matchingSkills = skills.filter((skill) =>
            skill.name.toLowerCase().includes(query)
          );
          if (matchingSkills.length > 0) {
            results.push({ category, skills: matchingSkills });
          }
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Connect to stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Server is now running and will handle requests from Claude Desktop
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
