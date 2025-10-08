# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two distinct portfolio websites:

1. **React Portfolio (Main)** - Interactive portfolio with React, Redux, and Matter.js physics
   - Located in: `src/`, `public/`
   - Built with Create React App
   - Two versions: standard site (tom-sloan.com) and physics-based landing (version2.tom-sloan.com)

2. **LinkedIn Portfolio (Static)** - Standalone HTML portfolio with dynamic data loading
   - Located in: `linkedin_data_extraction/`
   - Pure HTML/CSS/JavaScript (no build process)
   - Loads content from `data.js` for easy updates
   - See `linkedin_data_extraction/README.md` for full details

## Common Commands

### React Portfolio (Main)
```bash
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run tests with Jest
```

### LinkedIn Portfolio (Static HTML)
```bash
# No build process - open directly in browser
open linkedin_data_extraction/index.html

# To update content:
# 1. Edit linkedin_data_extraction/data.js
# 2. Refresh browser - changes appear immediately
```

## Architecture

### React Portfolio Architecture

**State Management** - Redux store configured in `src/app/store.js` with slices for:
- `project` - Portfolio projects data (projectsSlice)
- `work` - Work experience (workplaceSlice)
- `experience` - Technical skills (experienceSlice)
- `general` - General information/sports/hobbies (generalSlice)
- `photos` - Photo gallery (photoSlice)
- `home` - Home page state (homeSlice)

**Context API** - Two global contexts defined in `src/AllContexts.js`:
- `NameContext` - Controls which portfolio version to display (tom/dan)
- `IsDarkThemeContext` - Theme toggle state

**Routing Structure** - Main routes in `src/components/body.js`:
- `/` - Home page
- `/about` - Interactive bubble tiles (currently under construction)
- `/projects` - Project showcase
- `/resume` - Resume viewer
- `/contact` - Contact information

### LinkedIn Portfolio Architecture

**Data-Driven Design** - All content loaded from single source:
- `linkedin_data_extraction/data.js` - JavaScript object containing all website content
- `linkedin_data_extraction/index.html` - Renders content dynamically on page load
- No build process or dependencies required

**Content Structure** in `data.js`:
- `profile` - Name, headline, bio, links, profile image path
- `education` - Array of degrees with logos and descriptions
- `experience` - Array of jobs with company logos, skills, dates
- `projects` - Array with images, tags, descriptions, GitHub links
- `skills` - Object organized by category (languages, web dev, hardware)
- `certifications` - Array with badge images and credential URLs
- `resume` - Path to PDF file

**Performance Features**:
- Native lazy loading on all images except profile picture
- Profile image preloaded with `fetchpriority="high"` for instant display
- About section renders first for fast initial load

### Key Components

**BubbleTiles System** (`src/components/BubbleTiles/`):
- Complex scrolling interaction system with floating bubbles and sticky tiles
- Uses position-based ordering where tiles reorder based on scroll
- `BubbleTilesController.js` - Main orchestrator managing tile positions and heights
- `Tiles.js` - Individual tile/paddle components
- `Bubbles.js` - Floating bubble navigation elements
- `NextBack.js` - Mobile navigation arrows

**Landing Page** (`src/components/LandingPage/`):
- Interactive physics-based landing using Matter.js
- Creates a cloth simulation with clickable "teleportation balls" for navigation
- `World.js` - Matter.js physics engine setup
- `Render.js` - Custom renderer for the physics scene
- Can be scrolled past to reach standard site navigation

### React Portfolio Data Structure

Project data is stored as Redux slice initial state in `src/features/projects/projectsSlice.js`. Each project contains:
- `title`, `subtitle`, `description`
- `date`, `enddate`
- `category` array with `{tag, color}`
- `image` path or URL
- `link` to project/GitHub

Similar structure for work experience in `workplaceSlice.js` and skills in `experienceSlice.js`.

**Important**: When updating React portfolio content, edit the Redux slices. When updating LinkedIn portfolio, edit `linkedin_data_extraction/data.js`.

## Styling

- Mix of SCSS modules (`.module.scss`) and CSS modules (`.module.css`)
- Component-specific styles colocated with components
- Global styles in `src/App.scss`
- Light/dark theme controlled via `IsDarkThemeContext` (currently defaults to light theme)

## Important Notes

### React Portfolio
- The landing page physics engine must be properly cleaned up when unmounted to prevent memory leaks
- BubbleTiles component calculates positions dynamically based on content height - resize events trigger recalculation
- Responsive breakpoints managed via `react-socks` BreakpointProvider
- Several experimental/unused components exist in `Unused/` directories - these are from development exploration
- Matter.js wrap plugin used for physics boundaries

### LinkedIn Portfolio
- **Edit `data.js` NOT `linkedin_data.json`** - The website loads from `data.js` (JavaScript), not the JSON file
- All image paths in `data.js` are relative to HTML file: `images/profile/photo.png`
- Images organized in folders: `profile/`, `companies/`, `projects/`, `skills/`, `thesis/`
- Profile image uses `fetchpriority="high"` (not lazy loaded) for instant display
- All other images use `loading="lazy"` for performance
- Raw LinkedIn HTML files (13.6MB) archived in `linkedin_data_extraction/archive/`
- Documentation for updating content: `linkedin_data_extraction/docs/DATA_README.md`

## Working with LinkedIn Portfolio

When user requests changes to the LinkedIn portfolio website:

1. **Content updates**: Edit `linkedin_data_extraction/data.js` - this is a JavaScript file with a `portfolioData` object
2. **Image updates**:
   - Add images to appropriate folder in `linkedin_data_extraction/images/`
   - Update image path in `data.js`
3. **Structure changes**: Edit `linkedin_data_extraction/index.html`
4. **No build process**: Changes appear immediately on browser refresh

See `linkedin_data_extraction/README.md` for complete folder documentation.
