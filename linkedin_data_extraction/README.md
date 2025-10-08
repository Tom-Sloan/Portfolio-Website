# LinkedIn Data Extraction & Portfolio Website

This folder contains a comprehensive portfolio website combining LinkedIn profile data with project showcase and thesis work.

## 🌐 Portfolio Website

### **`index.html`** ⭐ Main Website
Dynamic portfolio website that loads all content from `data.js`:
- ✅ **Easy to update** - Edit `data.js` to change content
- ✅ **Lazy loading** - Images load as you scroll for better performance
- ✅ **Single source of truth** - All content in one data file
- ✅ **No HTML editing** - Just update the data and refresh
- ✅ **Drone favicon** - 🛸 icon in browser tab

**How to use:**
1. Edit `data.js` to update content (profile, projects, skills, etc.)
2. Refresh the page - changes appear instantly
3. See `docs/DATA_README.md` for detailed instructions

## 📁 Folder Structure

```
linkedin_data_extraction/
├── index.html               ⭐ Main website (dynamic)
├── data.js                  📊 Website data (edit to update content)
├── README.md                📖 This file
│
├── images/                  🖼️ All website images
│   ├── profile/             Profile pictures
│   ├── companies/           Company/school logos
│   ├── projects/            Project screenshots and demos
│   ├── skills/              Technology skill icons
│   └── thesis/              Research visualizations
│
├── resume/                  📄 PDF resume
│   └── Tom-Sloan-Resume-2021.pdf
│
├── docs/                    📚 Documentation
│   ├── DATA_README.md       Guide for updating data.js
│   ├── LINKEDIN_PROFILE_DATA.md
│   └── linkedin_extractor.py Python extraction script
│
└── archive/                 🗄️ Archived files
    ├── index-static.html    Old static version (backup)
    ├── linked_in_page.html  (8.2MB)
    ├── school_page.html     (1.1MB)
    ├── experience_page.html (1.1MB)
    ├── certs_page.html      (1.1MB)
    └── skills_page.html     (2.2MB)
```

## 🚀 Quick Start

### View the Website
```bash
open index.html
```

Or double-click `index.html` in Finder.

### Update Content
1. Open `data.js` in any text editor
2. Edit the content (see examples below)
3. Save and refresh the website

**Example: Update profile headline**
```javascript
profile: {
  name: "Tom Sloan",
  headline: "NEW HEADLINE HERE",  // Change this
  // ...
}
```

**Example: Add new project**
```javascript
projects: [
  {
    title: "New Project",
    subtitle: "Project subtitle",
    description: "Detailed description",
    image: "images/projects/new-project.jpg",  // Add image first
    link: "https://github.com/...",
    category: [
      { tag: "Category", color: "#66023C" }
    ]
  },
  // ... existing projects
]
```

See `docs/DATA_README.md` for detailed instructions.

## ✨ Features

### Dynamic Website
- 🎓 **Thesis Work** - Prominent section showcasing Master's research in AI
- 👤 **Profile** - Professional profile with photo and bio
- 📚 **Education** - Bachelor's and Master's degrees with details
- 💼 **Work Experience** - Multiple positions with descriptions and skills
- 🚀 **Featured Projects** - Smart Band, Smart Home, Smart Pillbox, etc.
- 🛠️ **Technical Skills** - Organized by category with icons
- 🏆 **Certifications** - AWS Security Specialty & Cloud Practitioner
- 📄 **Resume** - Embedded PDF viewer with download option

### Design Features
- ✅ Clean, professional design using original portfolio color scheme
- ✅ Fully responsive layout (mobile, tablet, desktop)
- ✅ **Lazy loading** - Images only load when scrolling into view
- ✅ Smooth scrolling navigation
- ✅ Hover effects and transitions
- ✅ Back-to-top button
- ✅ Self-contained (no external dependencies)

## 📊 Data File

### `data.js` - Website Content
Single source of truth for all website content:
- Profile information
- Education history
- Work experience
- Projects with images
- Skills with icons
- Certifications
- Resume path

**JavaScript object format** (not JSON):
```javascript
const portfolioData = {
  profile: {
    name: "Tom Sloan",
    headline: "Software Developer & AI Researcher"
    // ...
  }
  // ...
};
```

**This is the only file you need to edit to update the website.**

## 🖼️ Managing Images

All images are organized by type:

| Folder | Contents | Usage |
|--------|----------|-------|
| `images/profile/` | Profile pictures | Profile section |
| `images/companies/` | Company/school logos | Education & Experience |
| `images/projects/` | Project screenshots, GIFs | Projects section |
| `images/skills/` | Technology icons | Skills section |
| `images/thesis/` | Research visualizations | Thesis highlight |

**To add new image:**
1. Copy image to appropriate folder
2. Update path in `data.js`
3. Refresh website

**Lazy loading:** All images use native browser lazy loading for optimal performance.

## 🛠️ Tools & Scripts

### LinkedIn Data Extractor
Python script to extract data from LinkedIn HTML pages:

```bash
cd docs
python3 linkedin_extractor.py
```

**Requirements:**
```bash
pip install beautifulsoup4
```

**Outputs:**
- `linkedin_data.json` - Structured JSON data
- Console summary with statistics

## 📚 Documentation

- **`docs/DATA_README.md`** - Complete guide for updating `data.js`
- **`docs/LINKEDIN_PROFILE_DATA.md`** - LinkedIn data extraction documentation
- **`docs/linkedin_extractor.py`** - Python extraction script

## 🗄️ Archive

The `archive/` folder contains raw LinkedIn HTML pages (13.6MB total):
- Original saved pages used for data extraction
- No longer needed for website operation
- Kept for reference and re-extraction if needed

## 🔗 Links

- [LinkedIn Profile](https://www.linkedin.com/in/tom-sloan)
- [Portfolio Website](https://tom-sloan.com)
- [GitHub](https://github.com/Tom-Sloan)
- [AWS Security Specialty Badge](https://www.credly.com/badges/c5e97a97-e61e-41b4-aa37-e03b6d62a3fa)
- [AWS Cloud Practitioner Badge](https://www.credly.com/badges/c9afdb1e-f344-459e-b580-4534fae732d3)

## 📈 Performance

**Lazy Loading Benefits:**
- Faster initial page load
- Reduced bandwidth usage
- Images load progressively as you scroll
- Better mobile performance

**File Sizes:**
- `index.html`: 22KB
- `data.js`: 9KB
- Total images: ~2MB (loaded on-demand)

## 🎯 Best Practices

1. **Always edit `data.js`** instead of HTML
2. **Test changes** by refreshing the browser
3. **Keep images optimized** (compress before adding)
4. **Use descriptive file names** for images
5. **Back up `data.js`** before major changes

## 📅 Last Updated

January 2025

## 💡 Tips

- Use browser DevTools (F12) to debug issues
- Check console for JavaScript errors
- Verify image paths are correct (relative to HTML file)
- Keep `data.js` formatted nicely for readability
- Images in projects/ can be .jpg, .png, or .gif (including animated GIFs)

---

**Need help?** See `docs/DATA_README.md` for detailed examples and troubleshooting.
