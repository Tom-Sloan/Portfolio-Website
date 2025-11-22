/**
 * MCP Core - Shared logic for both Stdio and HTTP transports
 * Contains all tools, resources, data fetching, and types
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Portfolio data types
export interface PortfolioData {
  profile: {
    name: string;
    headline: string;
    location: string;
    image?: string;
    about: string[];
    links: Record<string, string>;
  };
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
    logo?: string;
  }>;
  experience: Array<{
    company: string;
    title: string;
    employmentType?: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    skills: string[];
    logo?: string;
  }>;
  projects: Array<{
    title: string;
    subtitle?: string;
    description: string;
    dates?: string;
    category: Array<{ tag: string; color: string }>;
    image?: string;
    link?: string;
    featured?: boolean;
  }>;
  skills: Record<string, Array<{ name: string; icon?: string }>>;
  certifications: Array<{
    name: string;
    organization: string;
    issueDate: string;
    expirationDate: string | null;
    description: string;
    credentialUrl: string;
    badgeImage: string;
  }>;
}

/**
 * Fetch portfolio data from live site
 */
export async function fetchPortfolioData(): Promise<PortfolioData> {
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
    const portfolioData = eval(`(${dataMatch[1]})`) as PortfolioData;

    return portfolioData;
  } catch (error) {
    throw new Error(`Error fetching portfolio data: ${error}`);
  }
}

// Zod schemas for tool validation
const SearchProjectsSchema = z.object({
  query: z.string().describe('Search query (searches in title, description, and tags)'),
});

const FilterExperienceSchema = z.object({
  company: z.string().optional().describe('Filter by company name (partial match)'),
  skill: z.string().optional().describe('Filter by required skill'),
});

const GetProjectsByTagSchema = z.object({
  tag: z.string().describe('Technology tag to filter by (e.g., "Python", "Docker", "AI")'),
});

const FindSkillsSchema = z.object({
  query: z.string().describe('Skill name or category to search for. Use "all" to return all skills.'),
});

/**
 * Create and configure an MCP server with all tools and resources
 */
export function createMcpServer(): Server {
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

  // ========== RESOURCES ==========

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

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const data = await fetchPortfolioData();

    let content: unknown;

    switch (uri) {
      case 'portfolio://profile':
        content = data.profile;
        break;
      case 'portfolio://projects':
        content = data.projects;
        break;
      case 'portfolio://experience':
        content = data.experience;
        break;
      case 'portfolio://skills':
        content = data.skills;
        break;
      case 'portfolio://education':
        content = data.education;
        break;
      case 'portfolio://certifications':
        content = data.certifications;
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

  // ========== TOOLS ==========

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
          description: 'Search for skills by name or category. Use "all" to get all skills.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Skill name or category to search for. Use "all" to return all skills.',
              },
            },
            required: ['query'],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'search_projects': {
        const { query } = SearchProjectsSchema.parse(args);
        const data = await fetchPortfolioData();
        const queryLower = query.toLowerCase();

        const results = data.projects.filter((project) => {
          const titleMatch = project.title.toLowerCase().includes(queryLower);
          const descMatch = project.description.toLowerCase().includes(queryLower);
          const tagMatch = project.category.some((cat) =>
            cat.tag.toLowerCase().includes(queryLower)
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
        const { company, skill } = FilterExperienceSchema.parse(args);
        const data = await fetchPortfolioData();
        let results = data.experience;

        if (company) {
          const companyLower = company.toLowerCase();
          results = results.filter((exp) =>
            exp.company.toLowerCase().includes(companyLower)
          );
        }

        if (skill) {
          const skillLower = skill.toLowerCase();
          results = results.filter((exp) =>
            exp.skills.some((s) => s.toLowerCase().includes(skillLower))
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
        const { tag } = GetProjectsByTagSchema.parse(args);
        const data = await fetchPortfolioData();
        const tagLower = tag.toLowerCase();

        const results = data.projects.filter((project) =>
          project.category.some((cat) => cat.tag.toLowerCase().includes(tagLower))
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
        const { query } = FindSkillsSchema.parse(args);
        const data = await fetchPortfolioData();
        const queryLower = query.toLowerCase();
        const results: Array<{ category: string; skills: Array<{ name: string; icon?: string }> }> = [];

        // If query is 'all' or empty, return all skills
        if (queryLower === 'all' || queryLower.trim() === '') {
          for (const [category, skills] of Object.entries(data.skills)) {
            results.push({ category, skills });
          }
        } else {
          // Search for specific skills/categories
          for (const [category, skills] of Object.entries(data.skills)) {
            if (category.toLowerCase().includes(queryLower)) {
              // Category name matches
              results.push({ category, skills });
            } else {
              // Check if any skills in this category match
              const matchingSkills = skills.filter((skill) =>
                skill.name.toLowerCase().includes(queryLower)
              );
              if (matchingSkills.length > 0) {
                results.push({ category, skills: matchingSkills });
              }
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

  return server;
}
