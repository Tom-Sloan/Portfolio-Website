# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a static HTML portfolio website built from LinkedIn data.

**Location:** `linkedin_data_extraction/`
**Tech Stack:** Pure HTML/CSS/JavaScript (no build process or dependencies)
**Content Management:** All content loaded dynamically from `data.js`

## How to Use

### Viewing the Website
```bash
# Open directly in browser - no build process needed
open linkedin_data_extraction/index.html
```

### Updating Content
1. Edit `linkedin_data_extraction/data.js` - this is a JavaScript file with a `portfolioData` object
2. Refresh browser - changes appear immediately

**IMPORTANT:** Edit `data.js` NOT `linkedin_data.json`. The website loads from `data.js` (JavaScript), not the JSON file.

## Architecture

### Data-Driven Design
All content is loaded from a single source:
- **`data.js`** - JavaScript object containing all website content
- **`index.html`** - Renders content dynamically on page load
- No build process or dependencies required

### Content Structure in `data.js`

```javascript
const portfolioData = {
  profile: {
    name, headline, bio, links, profileImage
  },
  education: [
    { degree, institution, logo, description, dates }
  ],
  experience: [
    { title, company, logo, skills, dates, description }
  ],
  projects: [
    { title, image, tags, description, github }
  ],
  skills: {
    languages: [], webDev: [], hardware: [], ...
  },
  certifications: [
    { name, image, url }
  ],
  resume: "path/to/resume.pdf"
};
```

### Image Organization

All images stored in `linkedin_data_extraction/images/`:
- `profile/` - Profile photo
- `companies/` - Company/institution logos
- `projects/` - Project screenshots
- `skills/` - Technology logos
- `certifications/` - Certification badges
- `thesis/` - Thesis/research images

**Image paths in `data.js`:** Relative to HTML file (e.g., `images/profile/photo.png`)

### Performance Features

- **Profile image:** Loaded immediately with `fetchpriority="high"` (no lazy loading)
- **All other images:** Native lazy loading with `loading="lazy"`
- **About section:** Renders first for fast initial load
- **No JavaScript dependencies:** Pure vanilla JS for maximum performance

## LinkedIn Data Archive

The `archive/` folder contains raw LinkedIn HTML files that were used to extract the data:
- `linked_in_page.html` (8.6MB) - Full LinkedIn profile
- `experience_page.html`, `certs_page.html`, `skills_page.html`, etc.
- These are kept for reference but not used by the website

## Making Changes

### Content Updates
Edit `linkedin_data_extraction/data.js` and refresh the browser. That's it!

### Image Updates
1. Add image to appropriate folder in `linkedin_data_extraction/images/`
2. Update image path in `data.js`
3. Refresh browser

### Structure/Style Changes
Edit `linkedin_data_extraction/index.html` directly

### Documentation
See `linkedin_data_extraction/README.md` for complete folder structure documentation

## Important Notes

- **No build process** - Changes appear immediately on refresh
- **No dependencies** - Pure HTML/CSS/JavaScript
- **Data source** - Always edit `data.js` for content updates
- **Image optimization** - Profile image loads first, others lazy load
- **Archive files** - 13.6MB of raw LinkedIn HTML kept for reference

## Project Structure

```
Portfolio-Website/
├── linkedin_data_extraction/     # The entire website
│   ├── index.html               # Main HTML file
│   ├── data.js                  # All content (EDIT THIS)
│   ├── images/                  # All images
│   │   ├── profile/
│   │   ├── companies/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── certifications/
│   │   └── thesis/
│   ├── resume/                  # Resume PDF
│   ├── archive/                 # Raw LinkedIn HTML files
│   ├── docs/                    # Documentation
│   └── README.md                # Detailed documentation
├── .gitignore
├── CLAUDE.md                    # This file
└── README.md                    # Project readme
```
