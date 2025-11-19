# Tom Sloan

Robot Vision Engineer & AI Researcher based in Ottawa, Ontario, Canada.

<div align="center">
  <img src="portfolio/images/profile/tom-sloan-profile.png" alt="Tom Sloan" width="200" style="border-radius: 10%;">
</div>

## About

Robot Vision Engineer specializing in SLAM, computer vision, and drone-based 3D mapping systems. Expertise in AWS, Docker, Python, and embedded systems. Constantly working on projects to push the boundaries of autonomous systems and AI.

Currently working as a Researcher at Carleton University developing real-time indoor 3D mapping systems using consumer drones, cloud-based SLAM, and AR visualization. Previous experience includes DevOps engineering at Magnet Forensics and spectrum engineering at Telesat.

## Education

**Master of Applied Science - MASc**
Carleton University
Electrical and Computer Engineering
January 2024 - November 2025

Thesis: Indoor 3D Modeling Using Consumer Drones and Neural Simultaneous Localization and Mapping (SLAM) for Virtual Reality and a Cloud Architecture. Defending November 2025.

**Bachelor of Engineering - BE**
Carleton University
Computer Systems Engineering
September 2017 - December 2021
Graduated with distinction

## Experience

**Researcher**
Carleton University
October 2023 - Present

Leading the design and testing of a real-time indoor 3D mapping system using a consumer drone (DJI Mini 3), integrating monocular camera and IMU with cloud-based SLAM framework for AR applications. Implemented modular software architecture using Docker, RabbitMQ, and React.js to offload high-computation tasks to remote server, enabling real-time visualization on desktop and AR headsets.

**DevOps Engineer**
Magnet Forensics
April 2022 - June 2023

Worked in a small team environment using DevOps tools including Jenkins, Linux, Python and PowerShell to help manage thousands of software builds a day on dozens of on-premise servers. Helped with the migration from on-premise to AWS cloud using CloudFormation and EC2.

**Spectrum Engineering Co-Op**
Telesat
May 2020 - December 2021

Made an alternative user interface and API in Python to interact with MATLAB giving the ability to directly use satellite XML data without requiring expensive MATLAB add-ons. Wrote extensive tests and code to analyze satellite spectrum use for international telecommunications regulations.

## Technical Skills

**Programming Languages:** Python, C/C++, JavaScript/TypeScript, MATLAB, Swift

**AI & Computer Vision:** TensorFlow, PyTorch, OpenCV, SLAM, Neural Networks, Computer Vision

**Cloud & DevOps:** AWS (EC2, S3, Lambda, CloudFormation), Docker, Jenkins, Linux, Git

**Web Development:** React.js, Node.js, HTML/CSS, REST APIs

**Databases & Backend:** PostgreSQL, SQL, Redis, FastAPI

**Hardware & Embedded:** PCB Design, Arduino, Raspberry Pi, Sensors, IoT

## Certifications

-   AWS Certified Security - Specialty
-   AWS Certified Solutions Architect - Associate
-   AWS Certified Developer - Associate
-   AWS Certified SysOps Administrator - Associate
-   AWS Certified Cloud Practitioner

## MCP Server Integration

This portfolio includes a Model Context Protocol (MCP) server written in TypeScript that provides AI assistants like Claude Desktop with structured access to portfolio data.

**What it does:**
- Exposes portfolio resources (profile, projects, experience, skills, education, certifications)
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
