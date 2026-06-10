# Boojy Website – Development Plan

This document tracks planned enhancements and features for the Boojy Suite website.

---

## ✅ Completed Features

### Phase 1: Core Website (Completed)
- [x] Landing page with app showcase
- [x] Individual app detail pages (Audio, Draw, Design, Cloud)
- [x] About page with mission and team info
- [x] Privacy Policy and Terms of Service
- [x] Roadmap page
- [x] Devlog page structure
- [x] Downloads page
- [x] Donate page
- [x] Feature request form
- [x] Contact form with categories
- [x] Custom 404 error page
- [x] SEO optimization (sitemap.xml, robots.txt, meta tags)
- [x] Responsive mobile-first design
- [x] Space-themed dark design
- [x] Email signup form with subscription options
- [x] Cloud pricing display

---

## 🚧 In Progress

*No items currently in development*

---

## 📋 Planned Features

### High Priority (Next 6 Months)

#### Language Support
- Multi-language support for website content
- Language selector in navigation
- Options:
  - Simple: Separate HTML files per language (`index-es.html`, `index-fr.html`, etc.)
  - Advanced: JavaScript i18n library with dynamic content swapping
- Priority languages: English (default), Spanish, French, German, Portuguese
- **Reasoning**: Deferred until after app launches to prioritize based on user requests

#### OS Logo Integration
- Replace emoji icons (🪟 🍎 🐧) with official platform logos
- Download Windows, macOS, Linux logos (SVG format)
- Ensure proper licensing/attribution
- Add to `/images/` folder
- Update downloads.html and app detail pages

#### Interactive Content
- Add app screenshots and mockups when apps reach preview stage
- Interactive app demos or video walkthroughs
- Screenshot galleries for each app
- Before/after examples of creative work

#### Dynamic Blog System
- Replace static devlog.html with dynamic blog engine
- Options:
  - Markdown-based static site generator (11ty, Jekyll)
  - Headless CMS (Strapi, Ghost)
  - Simple JSON-based blog with JavaScript rendering
- RSS feed for blog updates
- Categories and tags for posts
- Search functionality

### Medium Priority (6-12 Months)

#### Light Mode
- Light theme variant (toggle in nav or auto-detect system preference)
- Ensure accessibility contrast ratios in both themes
- Preserve space theme aesthetic in light mode

#### Community Features
- User testimonials section
- Community showcase (user-submitted work)
- Forum or discussion board integration
- Community-driven feature voting

#### Email System Improvements
- Integrate Formspree or similar for form handling
- Set up actual email endpoints (replace `YOUR_FORM_ID` placeholders)
- Email confirmation and subscription management
- Newsletter system (monthly updates, devlog summaries)

#### Performance Enhancements
- Add favicon and app icons
- Lazy loading for images
- Service worker for offline browsing
- Optimize asset delivery (CDN, compression)
- Target Lighthouse score 95+

### Low Priority (12+ Months)

#### Advanced Features
- Interactive feature comparison tables (Boojy vs Adobe)
- Animated app transitions and micro-interactions
- Web-based app previews (limited functionality demos)
- Integration with GitHub API for live stats
- Real-time donation progress bars
- User account system (for Cloud subscription management)

#### Content Expansion
- Downloadable press kit
- Tutorials and documentation portal
- Video tutorials library
- Developer documentation
- Plugin/extension marketplace page

---

## 🎨 Design System Improvements

- Create comprehensive style guide documentation
- Component library for reusable UI elements
- Animation library for consistent motion
- Accessibility audit and improvements
- Performance monitoring and optimization

---

## 📊 Metrics & Analytics

### Current Status
- Privacy-focused approach (no Google Analytics)
- No tracking pixels or third-party scripts
- Performance: Lighthouse 90+ (target: 95+)

### Future Considerations
- Privacy-respecting analytics (Plausible, Fathom)
- Server-side analytics only
- User-controlled (opt-in) feedback collection
- Transparent data usage policy

---

## 🛠️ Technical Debt

### Code Quality
- Consolidate inline styles into CSS classes
- Improve semantic HTML structure
- Add ARIA labels for better accessibility
- Refactor JavaScript (modularize, add comments)

### Infrastructure
- Set up automated testing (link checking, HTML validation)
- CI/CD pipeline for deployments
- Staging environment for testing
- Backup and version control for content

---

## 📝 Content Updates

### Regular Maintenance
- Update roadmap as milestones complete
- Add devlog entries monthly
- Update download links when apps launch
- Refresh screenshots when UI improves
- Keep pricing information current

### SEO & Marketing
- Expand meta descriptions
- Add structured data (JSON-LD)
- Create dedicated landing pages for campaigns
- A/B test copy and CTAs
- Build backlinks and partnerships

---

## 🗺️ Roadmap Timeline

### Q1 2026 (Jan-Mar)
- OS logo integration
- Email system setup (actual Formspree integration)
- Favicon and app icons

### Q2 2026 (Apr-Jun)
- Add first batch of app screenshots
- Language support implementation (if demand exists)
- Dynamic blog system

### Q3 2026 (Jul-Sep)
- Light mode theme
- Community testimonials
- Performance optimization sprint

### Q4 2026 (Oct-Dec)
- Community showcase
- Advanced features (user accounts for Cloud)
- Documentation portal

---

## 📌 Notes

- **Mobile-first**: All features must work perfectly on mobile
- **Performance**: No feature should reduce Lighthouse score below 90
- **Privacy**: Never add tracking without user consent
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Simplicity**: Avoid JavaScript frameworks; keep site fast and simple

---

**Last Updated:** November 2025
**Maintained by:** Tyr Bujac
