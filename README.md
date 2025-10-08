# Portfolio Website

A clean, performant static HTML portfolio website built from LinkedIn profile data.

## 🚀 Quick Start

```bash
# Open the website directly in your browser
open linkedin_data_extraction/index.html
```

That's it! No build process, no dependencies, no npm install required.

## ✨ Features

- **Zero Dependencies** - Pure HTML, CSS, and vanilla JavaScript
- **Instant Updates** - Edit `data.js`, refresh browser, done
- **Performance Optimized** - Lazy loading, prioritized profile image
- **Fully Responsive** - Works seamlessly on desktop and mobile
- **Easy Maintenance** - All content in one JavaScript file

## 📝 Updating Content

All website content is managed through a single file:

```bash
linkedin_data_extraction/data.js
```

Edit this file to update:
- Profile information (name, bio, links)
- Work experience
- Projects
- Skills
- Certifications
- Education

**Changes take effect immediately** - just refresh your browser!

## 📁 Project Structure

```
Portfolio-Website/
├── linkedin_data_extraction/     # Your portfolio website
│   ├── index.html               # Main HTML file
│   ├── data.js                  # All content (EDIT THIS!)
│   ├── images/                  # All website images
│   ├── resume/                  # Resume PDF
│   ├── archive/                 # Original LinkedIn HTML files
│   └── README.md                # Detailed documentation
├── .gitignore
├── CLAUDE.md                    # Instructions for Claude Code
└── README.md                    # This file
```

## 📚 Documentation

For detailed information about the portfolio structure and how to customize it:

- **Main Documentation**: `linkedin_data_extraction/README.md`
- **Data Format Guide**: `linkedin_data_extraction/docs/DATA_README.md`

## 🖼️ Adding Images

1. Add your image to the appropriate folder in `linkedin_data_extraction/images/`:
   - `profile/` - Profile photos
   - `companies/` - Company/institution logos
   - `projects/` - Project screenshots
   - `skills/` - Technology/tool logos
   - `certifications/` - Certification badges

2. Update the image path in `data.js`:
   ```javascript
   profileImage: "images/profile/my-photo.jpg"
   ```

3. Refresh your browser to see the changes

## 🎨 Customizing Styles

The HTML file contains embedded CSS that can be customized directly in `linkedin_data_extraction/index.html`.

## 📦 What's in the Archive?

The `archive/` folder contains the original LinkedIn HTML pages (13.6MB total) that were used to create this portfolio. These are kept for reference but aren't used by the website.

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styles with flexbox/grid
- **Vanilla JavaScript** - No frameworks or libraries
- **Native Lazy Loading** - Built-in browser performance

## 📄 License

This is a personal portfolio website. Feel free to use the structure as inspiration for your own portfolio!

---

**Need help?** Check out `CLAUDE.md` for detailed guidance on working with this codebase.
