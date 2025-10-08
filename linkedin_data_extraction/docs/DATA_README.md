# Dynamic Portfolio Website

## Overview

This portfolio website now loads all content dynamically from a single data file (`data.js`). This makes it easy to update the website without editing HTML.

## Files

- **`../index.html`** - Main website (dynamic, loads from data.js) ⭐
- **`../data.js`** - Single source of truth for all website content (JavaScript format)
- **`../archive/index-static.html`** - Old static version (backup)

**Note:** This documentation is in the `docs/` folder. The main files are one level up (`../`)

## How It Works

1. **Data File (`data.js`)**: Contains all content including:
   - Profile information with local image path
   - Education with local logo paths
   - Work experience with local logo paths
   - Projects with local image paths
   - Skills with local icon paths
   - Certifications with badge URLs
   - Resume path

2. **Dynamic HTML (`index.html`)**:
   - Loads `data.js` on page load
   - JavaScript functions render each section from the data
   - All content is generated dynamically

## Updating the Website

### To Update Content:

1. **Edit `../data.js`** - Change any text, dates, descriptions, etc.
2. **Refresh the page** - Changes appear immediately

**Note:** `data.js` is already in JavaScript format (not JSON). You can edit it with any text editor.

### Examples:

#### Update Profile Information:
```javascript
profile: {
  name: "Tom Sloan",
  headline: "NEW HEADLINE HERE",
  about: [
    "Updated bio paragraph 1",
    "Updated bio paragraph 2"
  ]
}
```

#### Add New Work Experience:
```javascript
experience: [
  {
    company: "New Company",
    title: "New Position",
    employmentType: "Full-time",
    location: "City, Country",
    startDate: "Month Year",
    endDate: "Present",
    current: true,
    description: "Job description here",
    skills: ["Skill 1", "Skill 2"],
    logo: "images/companies/new-company.png"  // Add logo to this folder first
  },
  // ... existing entries
]
```

#### Add New Project:
```javascript
projects: [
  {
    title: "New Project",
    subtitle: "Project Subtitle",
    description: "Detailed description",
    startDate: "Month Year",
    endDate: "Month Year",
    current: false,
    category: [
      { tag: "Category", color: "#66023C" }
    ],
    image: "images/projects/new-project.jpg",  // Add image first
    link: "https://github.com/...",
    featured: true
  },
  // ... existing entries
]
```

#### Update Image:
1. Add new image to appropriate folder:
   - Profile: `images/profile/`
   - Companies: `images/companies/`
   - Projects: `images/projects/`
   - Skills: `images/skills/`
   - Thesis: `images/thesis/`

2. Update path in `data.js`:
```javascript
image: "images/profile/new-photo.png"
```

#### Add New Skill Category:
```javascript
skills: {
  "New Category Name": [
    { name: "Skill Name", icon: "images/skills/skill-icon.png" }
  ]
}
```

## Image Paths

All image paths in `data.js` are relative to the HTML file location:

```
linkedin_data_extraction/
├── index.html                ⭐ Main website
├── data.js                   📊 Edit this to update content
├── README.md
├── images/
│   ├── profile/
│   │   └── tom-sloan-profile.png
│   ├── companies/
│   │   ├── carleton-university.png
│   │   └── telesat.jpg
│   ├── projects/
│   │   ├── smartBand.gif
│   │   └── smartHome.gif
│   ├── skills/
│   │   ├── javascript.png
│   │   ├── python.png
│   │   └── ...
│   └── thesis/
│       └── thesis-main-visualization.png
├── resume/
│   └── Tom-Sloan-Resume-2021.pdf
├── docs/                     📚 You are here
│   ├── DATA_README.md        (this file)
│   ├── LINKEDIN_PROFILE_DATA.md
│   └── linkedin_extractor.py
└── archive/                  🗄️ Archived files
    ├── index-static.html     Old static version
    └── ...                   Raw LinkedIn HTML files
```

## Data Format

**`data.js`** is a JavaScript file containing a single object:

```javascript
const portfolioData = {
  profile: {
    name: "Tom Sloan",
    headline: "Software Developer"
  }
  // ...
};
```

**Key features:**
- JavaScript object format (not JSON)
- Can include comments with `//`
- Easier to edit than strict JSON
- **This is the single source of truth for the website**

## Benefits

✅ **Easy Updates**: Change content in one place (`data.js`)
✅ **No HTML Editing**: Never touch HTML again
✅ **Consistent Structure**: All data follows the same format
✅ **Image Management**: All image paths in one file
✅ **Fast Updates**: Just edit the JavaScript object and refresh
✅ **Comments Allowed**: Add notes directly in `data.js`

## Migration

**Migration complete!** The dynamic version is now the main `index.html` file.

The old static version has been archived at `../archive/index-static.html` for reference.

## Troubleshooting

**Content not showing?**
- Check browser console (F12) for errors
- Verify `data.js` is in the same folder as the HTML file
- Check image paths are correct relative to HTML file
- Make sure you saved `data.js` after editing

**Images not loading?**
- Verify image exists in specified path (case-sensitive)
- Paths should be relative to HTML file: `images/profile/image.png`
- Use forward slashes `/` not backslashes `\`
- Don't use absolute paths like `/Users/...`

**Changes not appearing?**
- Hard refresh the browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Make sure you saved `data.js` after editing
- Check for JavaScript errors in console (F12)
