# Boojy Board - Design Document (Early Preview v0.1)

**Version:** 0.1 (Early Preview)  
**Target Release:** Q2 2026  
**Document Date:** November 8, 2025  
**Status:** Early Preview Planning

---

## Table of Contents

1. [Overview](#overview)
2. [Project Goals](#project-goals)
3. [Early Preview Objectives](#early-preview-objectives)
4. [Target Audience](#target-audience)
5. [Feature Specifications](#feature-specifications)
6. [Technical Architecture](#technical-architecture)
7. [UI/UX Design](#uiux-design)
8. [User Flows](#user-flows)
9. [Development Timeline](#development-timeline)
10. [Success Metrics](#success-metrics)
11. [Competitive Analysis](#competitive-analysis)
12. [Future Roadmap](#future-roadmap)

---

## Overview

### What is Boojy Board?

Boojy Board is a free, open-source, cross-platform whiteboard and note-taking application designed for students, hobbyists, and creative professionals. It combines the simplicity of digital note-taking apps like Notability with the flexibility of collaborative whiteboard tools like Miro, while maintaining the "just works" philosophy of the Boojy Suite ecosystem.

### Core Philosophy

- **Speed and Simplicity**: Open and start drawing within seconds, no setup required
- **Offline-First**: Full functionality without internet connection
- **Privacy-Friendly**: No ads, tracking, or AI data processing
- **Just Works**: Intuitive interface requiring no tutorial
- **Cross-Platform**: Works seamlessly on desktop and iPad
- **Free Forever**: Open-source with no feature paywalls

### Positioning

Boojy Board aims to be the fast, distraction-free alternative to GoodNotes and Notability while adding features they lack (cross-platform support, real-time collaboration, infinite canvas mode). It fills the gap between overly simple tools (Apple Notes) and complex professional software (Adobe Illustrator, Miro Enterprise).

---

## Project Goals

### Primary Goals

1. Create an intuitive note-taking and whiteboarding app accessible to everyone
2. Provide essential PDF annotation capabilities for students
3. Deliver smooth, zero-lag drawing experience with pressure sensitivity
4. Enable seamless integration with the broader Boojy Suite ecosystem
5. Establish a foundation for future collaboration features

### Success Definition

Early Preview is successful if:
- Drawing feels responsive and natural (perceived as "zero lag")
- PDF annotation workflow is smooth and intuitive
- Users can complete basic tasks without asking for help
- No critical bugs that prevent core functionality
- 4-5 testers provide positive feedback on core experience

---

## Early Preview Objectives

### What EP v0.1 Proves

Early Preview focuses on validating the **core note-taking experience**:

1. **Drawing engine works smoothly** - pen input feels natural with pressure sensitivity
2. **PDF annotation is functional** - can import and mark up PDFs effectively
3. **UI is intuitive** - users understand the interface without guidance
4. **Cross-platform viability** - works well on both desktop and iPad
5. **File management is solid** - library view, save/open, export all work reliably

### Out of Scope for EP

Features explicitly deferred to later versions:
- Real-time collaboration
- Boojy Cloud sync
- Infinite canvas/whiteboard mode (pages only in EP)
- Shape recognition and smart features
- Advanced selection tools (lasso)
- Ruler/straight edge tool
- Handwriting OCR/search
- Markdown/checkbox features
- Quick Notes feature
- Dark mode

### Timeline

**Target Duration:** 3 weeks  
**Testing Group:** Developer + 4 testers (family/students)  
**Platform Focus:** Desktop (Windows/Mac/Linux) + iPad

---

## Target Audience

### Primary Users

1. **Students (High School & University)**
   - Need: PDF annotation for lecture slides and textbooks
   - Need: Organized note-taking system for classes
   - Need: Free alternative to expensive apps like GoodNotes
   - Need: Cross-platform support (not locked to Apple ecosystem)

2. **Hobbyists**
   - Bullet journal enthusiasts
   - Digital sketchers and doodlers
   - Mood board creators
   - Personal project planners
   - Recipe collectors and organizers

3. **Educators**
   - Lesson planning and preparation
   - Annotating teaching materials
   - Creating visual aids and diagrams

### Secondary Users

4. **Creative Professionals**
   - Quick concept sketches
   - Brainstorming and ideation
   - Storyboarding (especially for Boojy Video/Animate users)
   - Visual note-taking in meetings

5. **Small Teams**
   - Study groups
   - Creative collaborators (future collaboration features)
   - Remote pair work sessions

---

## Feature Specifications

### Included in Early Preview v0.1

#### 1. Drawing Tools

**Pen Tool**
- Pressure-sensitive drawing with natural stroke variation
- Smooth line rendering with slight stabilization to reduce jitter
- Basic color palette: Black, Blue, Red, Green
- Three thickness options: Fine, Medium, Thick
- Anti-aliased rendering for clean appearance

**Highlighter Tool**
- Semi-transparent overlay effect
- Four highlighter colors: Yellow, Green, Blue, Pink
- Two thickness options: Standard, Wide
- Blends naturally over existing content

**Eraser Tool**
- Stroke-based erasing (removes entire strokes, not pixel-by-pixel)
- Two sizes: Standard, Large
- Visual feedback showing eraser size
- Can erase both pen and highlighter strokes

**Text Tool**
- Click to place text box anywhere on canvas
- Single font: Poppins (matching Boojy Suite)
- Font sizes: Small (12pt), Medium (16pt), Large (24pt), Extra Large (32pt)
- Text colors: Black, Blue, Red, Green (matching pen colors)
- Basic formatting: Bold toggle
- Auto-resize text box as you type
- Click outside to finish editing

#### 2. Page System

**Page Types**
- Blank: Clean white canvas
- Lined: College-ruled horizontal lines
- Grid: Square grid pattern (5mm spacing)

**Page Management**
- Vertical scrolling between pages
- Add new page button at bottom of scroll
- Page thumbnails in left sidebar for quick navigation
- Right-click page thumbnail for options:
  - Delete page
  - Duplicate page
  - Change paper type
  - Move page up/down

**Default Settings**
- New boards start with one blank page
- A4 page size (210mm × 297mm)
- Portrait orientation default

#### 3. PDF Import & Annotation

**Import Functionality**
- Drag-and-drop PDF file into app
- File picker for browsing to PDF
- Supports multi-page PDFs
- Each PDF page becomes a board page

**Annotation Capabilities**
- Draw with pen/highlighter over PDF content
- Add text annotations
- Erase annotations without affecting PDF
- PDF content remains as read-only background layer
- All annotation tools work identically to regular pages

**PDF Rendering**
- High-quality rendering at appropriate resolution
- Efficient memory management for large PDFs
- Lazy loading for multi-page documents

#### 4. Library & File Management

**Library View**
- Grid layout showing board thumbnails
- Thumbnail shows first page preview
- Display file name below thumbnail
- Last modified date shown
- Sort options: Name, Date Modified, Date Created

**Folder Organization**
- Create folders to organize boards
- Nested folder support (up to 3 levels deep)
- Drag-and-drop boards between folders
- Breadcrumb navigation at top

**File Operations**
- New Board button prominent in toolbar
- Open Recent list (last 10 boards)
- Duplicate board option
- Rename board
- Delete board (with confirmation)
- File properties view (size, page count, creation date)

**File Format**
- Extension: `.board`
- Internal structure: JSON + embedded assets
- Stores: strokes, text, page settings, metadata
- PDF pages stored as references with annotation layers

#### 5. Export Options

**Export Formats**

*PDF Export*
- Export entire board as PDF
- Export selected pages only
- Maintains page layout and sizing
- Annotations baked into PDF
- High-quality vector output where possible

*PNG Export*
- Export pages as PNG images
- Resolution options: 72dpi (screen), 150dpi (standard), 300dpi (print)
- Can export all pages or selected pages
- Transparent background option for blank pages

**Export Settings**
- Choose output location
- Batch naming for multi-page exports
- Preview before export
- Progress indicator for large exports

#### 6. Core UI Elements

**Top Toolbar**
- File operations: New, Open, Save, Export
- Edit operations: Undo, Redo
- View controls: Zoom (50%, 100%, 200%, Fit Page, Fit Width)
- Settings button (preferences panel)

**Left Sidebar**
- Tool palette (Pen, Highlighter, Eraser, Text)
- Color picker (for active tool)
- Thickness/size options
- Page thumbnails below tools

**Canvas Area**
- Central drawing surface
- Paper texture subtle background
- Clean, distraction-free
- Zoom level indicator bottom-right

**Status Bar (Bottom)**
- Current page number / total pages
- Active tool indicator
- File save status
- Zoom percentage

#### 7. User Preferences

**Settings Panel**
- Default paper type for new pages
- Default page size (A4, Letter, Legal)
- Pressure sensitivity curve adjustment
- Auto-save interval (1, 5, 10 minutes)
- Export default location
- UI theme (Light only in EP, Dark in v1.0)

---

## Technical Architecture

### Technology Stack

**Framework**
- **Flutter** - Cross-platform UI framework
  - Enables single codebase for desktop and mobile
  - High-performance rendering
  - Rich widget ecosystem
  - Custom painting for drawing engine

**Backend/Storage**
- **Firebase** - Backend services
  - Firebase Storage for future cloud sync (not in EP)
  - Firebase Auth for future user accounts (not in EP)
  - Local SQLite for EP metadata storage
- **Local File System** - Primary storage in EP
  - All boards stored locally as `.board` files
  - User controls file locations
  - No cloud dependency

**Drawing Engine**
- **Flutter CustomPainter** - Core rendering
- **Custom stroke algorithm** - Pressure-sensitive path generation
- **Catmull-Rom spline smoothing** - Reduces jitter while maintaining responsiveness

**PDF Rendering**
- **pdf_render package** - PDF rendering and interaction
- **syncfusion_flutter_pdf** - Backup option for advanced PDF features

### Platform Targets

**Desktop**
- Windows 10/11
- macOS 11+ (Big Sur and later)
- Linux (Ubuntu 20.04+, other distributions)

**Mobile/Tablet**
- iPad (iPadOS 14+)
- Apple Pencil support optimized
- Touch input fallback

**Future Platforms** (post-EP)
- iPhone
- Android tablets
- Android phones
- Web (via Flutter Web)

### File Format Specification

**`.board` File Structure**

```json
{
  "version": "0.1.0",
  "metadata": {
    "created": "ISO8601 timestamp",
    "modified": "ISO8601 timestamp",
    "title": "Board name",
    "pageCount": 5
  },
  "settings": {
    "defaultPaperType": "blank|lined|grid",
    "pageSize": "A4|Letter|Legal"
  },
  "pages": [
    {
      "id": "unique-page-id",
      "paperType": "blank|lined|grid",
      "backgroundColor": "#FFFFFF",
      "strokes": [
        {
          "id": "stroke-id",
          "tool": "pen|highlighter",
          "color": "#000000",
          "thickness": 2.0,
          "points": [
            {"x": 100, "y": 200, "pressure": 0.5, "timestamp": 1234567890}
          ]
        }
      ],
      "textBoxes": [
        {
          "id": "text-id",
          "x": 150,
          "y": 300,
          "width": 200,
          "content": "Text content",
          "fontSize": 16,
          "color": "#000000",
          "bold": false
        }
      ],
      "pdfBackground": {
        "filename": "original.pdf",
        "pageNumber": 1,
        "data": "base64-encoded-pdf-page"
      }
    }
  ]
}
```

**File Size Optimization**
- Stroke point thinning for long strokes
- PDF pages stored as compressed images
- JSON compression using gzip
- Lazy loading for large boards

### Performance Targets

**Drawing Latency**
- Pen-to-pixel latency: < 50ms (perceived as instant)
- Frame rate: 60 FPS minimum during drawing
- Smooth scrolling: 60 FPS when navigating pages

**Memory Usage**
- Maximum RAM usage: 500MB for typical board (50 pages)
- Efficient garbage collection during drawing
- PDF pages unloaded when not visible

**File Operations**
- Open board: < 2 seconds for 50-page document
- Save board: < 1 second (incremental saves)
- Export PDF: < 5 seconds for 20 pages
- Library thumbnail generation: < 100ms per thumbnail

---

## UI/UX Design

### Design Philosophy

**Minimal & Clean**
- Remove unnecessary chrome and decoration
- Focus attention on canvas
- Hide complexity until needed
- Consistent with Boojy Suite design language

**Discoverable Without Tutorial**
- Tool icons clearly indicate function
- Hover tooltips for all tools
- Sensible defaults require no configuration
- Common patterns from other apps

**Responsive & Fast**
- Immediate visual feedback for all actions
- No loading spinners for common operations
- Optimistic UI updates
- Smooth animations (200-300ms duration)

### Color Scheme

**Boojy Board Theme - Jupiter**
- **Primary Accent:** #E8B67F (warm Jupiter orange/tan)
- **Background:** #1A1B23 (Dark Space Grey)
- **Canvas:** #FFFFFF (pure white for paper)
- **UI Elements:** 
  - Selected tool: Jupiter color (#E8B67F)
  - Hover states: Jupiter at 60% opacity
  - Disabled tools: Grey (#8C8C8C)
  - Text/icons: White (#FFFFFF) on dark UI

**Paper Colors**
- Blank: #FFFFFF (pure white)
- Lined: #FFFFFF with #E0E0E0 lines
- Grid: #FFFFFF with #F0F0F0 grid lines

### Layout & Dimensions

**Left Sidebar**
- Width: 72px (collapsed), 240px (expanded for page thumbnails)
- Tool icons: 40x40px with 8px padding
- Color swatches: 32x32px
- Page thumbnails: 160x200px (maintains aspect ratio)

**Top Toolbar**
- Height: 56px
- Button size: 40x40px
- Icon size: 24x24px
- Spacing between groups: 16px

**Canvas**
- Centered with 40px margin on all sides (when zoomed to fit)
- Drop shadow around page: 0px 2px 8px rgba(0,0,0,0.15)
- Infinite scroll vertically for pages

**Status Bar**
- Height: 32px
- Font size: 12px
- Right-aligned information

### Typography

**Font Family**
- UI: Poppins (weight 400 for regular, 600 for semibold)
- Text tool: Poppins (matches Boojy Suite brand)

**Font Sizes**
- UI labels: 14px
- Button text: 14px
- Text tool options: 12pt, 16pt, 24pt, 32pt
- Status bar: 12px

### Iconography

**Tool Icons**
- Style: Line-based, minimal
- Stroke width: 2px
- Size: 24x24px
- Color: White with Jupiter highlight when selected

**Buttons**
- Rounded corners: 8px radius
- Hover elevation: slight drop shadow
- Active state: Jupiter background

### Interaction Patterns

**Tool Selection**
- Click tool to select
- Selected tool highlighted with Jupiter color
- Previously selected tool remembered per session
- Keyboard shortcuts: P (pen), H (highlighter), E (eraser), T (text)

**Drawing Gestures**
- Single touch/pen: Draw with current tool
- Two-finger drag (touch): Pan canvas
- Pinch (touch): Zoom in/out
- Mouse wheel: Zoom (with Ctrl/Cmd) or scroll vertically

**Context Menus**
- Right-click page thumbnail: Page options
- Right-click canvas: Canvas options (future)
- Right-click text box: Text options (future)

**Keyboard Shortcuts**
- Ctrl/Cmd + N: New board
- Ctrl/Cmd + O: Open board
- Ctrl/Cmd + S: Save
- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
- Ctrl/Cmd + E: Export
- Ctrl/Cmd + +/-: Zoom in/out
- Ctrl/Cmd + 0: Reset zoom to 100%
- Delete: Delete selected object (future)
- Space + drag: Pan canvas

---

## User Flows

### Flow 1: Creating First Board

1. User launches Boojy Board
2. Library view appears (empty on first launch)
3. Prominent "New Board" button in center
4. Click "New Board"
5. New board opens with single blank page
6. Pen tool selected by default, black color, medium thickness
7. User can immediately start drawing
8. Auto-save creates file in default location

**Success Criteria:**
- From launch to first stroke: < 10 seconds
- No confusing dialogs or choices
- Immediate feedback that drawing works

### Flow 2: PDF Annotation Workflow

1. User clicks "File" → "Import PDF"
2. File picker opens
3. User selects PDF file (e.g., lecture slides)
4. PDF imports, each page becomes a board page
5. User sees first PDF page with drawing tools available
6. User draws annotations over PDF content
7. User adds text notes using text tool
8. User scrolls to next page, continues annotations
9. User clicks "Export" → "Export as PDF"
10. Annotated PDF saves to chosen location

**Success Criteria:**
- PDF imports in < 5 seconds for 20-page document
- Annotations feel natural and responsive
- Exported PDF maintains quality and annotations

### Flow 3: Organizing Notes

1. User has multiple boards in library
2. User clicks "New Folder" button
3. Names folder (e.g., "Biology Notes")
4. Drags relevant boards into folder
5. Creates nested folder for specific topics
6. Uses search to find specific board
7. Double-clicks thumbnail to open board

**Success Criteria:**
- Drag-and-drop works smoothly
- Folder structure is clear and navigable
- Search returns relevant results quickly

### Flow 4: Changing Paper Types

1. User is drawing on blank page
2. Realizes they want lined paper for text notes
3. Right-clicks page thumbnail in sidebar
4. Selects "Change Paper Type" → "Lined"
5. Page instantly updates to lined paper
6. Existing drawings remain unchanged
7. Can change individual pages or all pages

**Success Criteria:**
- Paper type change is instant (< 100ms)
- No data loss or visual glitches
- Options are clear and accessible

### Flow 5: Cross-Platform Workflow

1. User creates board on desktop
2. Saves to local folder synced with cloud (Dropbox, iCloud, etc.)
3. Opens same file on iPad
4. Continues working with Apple Pencil
5. Saves changes
6. Returns to desktop, opens updated file
7. All changes preserved

**Success Criteria:**
- File format remains compatible
- No corruption or data loss
- User doesn't think about platform differences

---

## Development Timeline

### Week 1: Core Foundation (Days 1-7)

**Days 1-2: Project Setup & Architecture**
- Flutter project initialization for all platforms
- Firebase project setup (for future use)
- Basic app structure and navigation
- Git repository setup (tsbujacncl account)
- CI/CD pipeline configuration

**Days 3-5: Drawing Engine**
- CustomPainter implementation
- Pen tool with pressure sensitivity
- Stroke smoothing algorithm
- Canvas zoom and pan
- Undo/redo system
- Performance optimization for 60 FPS

**Days 6-7: Basic Tools**
- Highlighter tool
- Eraser tool
- Color picker UI
- Thickness selection UI
- Tool switching logic

**Deliverable:** Basic drawing app that can create strokes with pen/highlighter/eraser

### Week 2: Pages, PDF & UI (Days 8-14)

**Days 8-9: Page System**
- Page data model
- Multiple page support
- Page thumbnails rendering
- Scroll between pages
- Add/delete pages
- Paper types (blank, lined, grid)

**Days 10-11: PDF Integration**
- PDF import functionality
- PDF page rendering
- Annotation layer system
- Multi-page PDF handling
- PDF as background layer

**Days 12-13: Text Tool**
- Text box implementation
- Text editing UI
- Font size and color options
- Bold formatting
- Text positioning and resizing

**Day 14: UI Polish**
- Left sidebar with tools
- Top toolbar with file operations
- Status bar
- Settings panel
- Keyboard shortcuts

**Deliverable:** Functional note-taking app with PDF annotation

### Week 3: File Management & Export (Days 15-21)

**Days 15-16: File System**
- .board file format implementation
- Save/load functionality
- Auto-save system
- File metadata management
- Error handling and recovery

**Days 17-18: Library View**
- Grid layout for boards
- Thumbnail generation
- Folder system
- Search functionality
- Recent files list
- File operations (rename, delete, duplicate)

**Days 19-20: Export Features**
- PDF export implementation
- PNG export implementation
- Export options dialog
- Batch export for multiple pages
- Quality settings

**Day 21: Testing & Bug Fixes**
- Cross-platform testing (Windows, Mac, Linux, iPad)
- Performance profiling
- Memory leak detection
- Bug fixing prioritization
- Stability improvements

**Deliverable:** Shippable Early Preview v0.1

### Post-Week 3: Testing Period

**Week 4: Internal Testing**
- Deploy to 4 test users
- Gather feedback on UX
- Track crashes and bugs
- Iterate on critical issues
- Performance optimization based on real usage

---

## Success Metrics

### Technical Metrics

**Performance**
- Drawing latency: < 50ms (measured from input to visual feedback)
- Frame rate: Maintain 60 FPS during active drawing
- Memory usage: < 500MB for 50-page board
- Crash rate: < 1% of sessions
- File corruption rate: 0%

**Compatibility**
- Successfully runs on Windows 10/11
- Successfully runs on macOS 11+
- Successfully runs on Ubuntu 20.04+
- Successfully runs on iPad (iPadOS 14+)
- Apple Pencil pressure sensitivity works correctly

### User Experience Metrics

**Usability**
- Time to first stroke: < 10 seconds from launch
- Users complete PDF annotation task without asking for help: 80%+
- Users successfully export board on first attempt: 90%+
- Users understand tool icons without tooltips: 70%+

**Satisfaction** (from 4-5 test users)
- Overall satisfaction: 4/5 stars minimum
- "Would recommend to others": 80%+
- "Drawing feels natural": 4/5 stars minimum
- "Interface is intuitive": 4/5 stars minimum

### Feature Validation

**Core Features Working**
- ✓ Pen drawing with pressure sensitivity
- ✓ Highlighter and eraser tools
- ✓ Text tool with basic formatting
- ✓ PDF import and annotation
- ✓ Multiple paper types
- ✓ Library view and file management
- ✓ Export to PDF and PNG
- ✓ Cross-platform deployment

**Critical Bugs**
- Zero critical bugs (app crashes, data loss, corrupted files)
- < 5 high-priority bugs (features don't work as expected)
- < 15 medium-priority bugs (minor issues, workarounds exist)

### Feedback Goals

**Questions for Testers:**
1. How does the drawing feel compared to other apps you've used?
2. Is the PDF annotation workflow intuitive?
3. Did you need help figuring out any features?
4. What would make this app more useful for you?
5. Would you use this over [current tool they use]?
6. Any features you expected that were missing?
7. Performance issues or lag noticed?
8. Any bugs or crashes encountered?

**Success = Positive answers to:**
- Drawing feels good
- PDF annotation works well
- Didn't need tutorial
- Would consider using regularly
- No show-stopping bugs

---

## Competitive Analysis

### vs. Notability

**Advantages (Boojy Board)**
- ✓ Cross-platform (Windows, Mac, Linux, iPad vs. Apple only)
- ✓ Free and open-source (vs. $15 one-time purchase)
- ✓ Local file storage, no cloud lock-in
- ✓ Privacy-first (no data collection)
- ✓ Future: Real-time collaboration (v1.0)
- ✓ Future: Infinite canvas mode (v1.0)
- ✓ Future: Boojy Suite integration

**Disadvantages (Boojy Board EP)**
- ✗ No audio recording synced to notes (Notability's killer feature)
- ✗ No handwriting search/OCR (coming in v1.1)
- ✗ Less polished (first version vs. mature product)
- ✗ Smaller feature set initially
- ✗ No established user base or tutorials

**Feature Parity**
- = PDF annotation
- = Multiple paper types
- = Basic drawing tools
- = Text tool
- = Export options
- = Page-based system

### vs. GoodNotes

**Advantages (Boojy Board)**
- ✓ Cross-platform (vs. Apple only)
- ✓ Free (vs. $10)
- ✓ Simpler, less overwhelming interface
- ✓ Future: Real-time collaboration
- ✓ Future: Infinite canvas mode

**Disadvantages (Boojy Board EP)**
- ✗ No handwriting recognition/search (GoodNotes excels here)
- ✗ No shape recognition (coming v1.0)
- ✗ Fewer organization features (tags, notebooks)
- ✗ No template marketplace
- ✗ Less refined overall

**Feature Parity**
- = PDF annotation
- = Drawing tools
- = Page management
- = Export options

### vs. Miro/Mural

**Advantages (Boojy Board)**
- ✓ Offline-first (vs. cloud-dependent)
- ✓ Better drawing engine for handwriting
- ✓ PDF annotation (Miro doesn't focus on this)
- ✓ Privacy-first, no tracking
- ✓ Free (vs. freemium with limits)

**Disadvantages (Boojy Board EP)**
- ✗ No real-time collaboration yet (Miro's core feature)
- ✗ No sticky notes, connectors, frameworks
- ✗ No infinite canvas in EP
- ✗ Not team/enterprise focused

### vs. Microsoft OneNote

**Advantages (Boojy Board)**
- ✓ Simpler, more focused interface
- ✓ Better drawing experience
- ✓ Open-source
- ✓ No Microsoft account required
- ✓ Cleaner file format

**Disadvantages (Boojy Board EP)**
- ✗ No handwriting recognition
- ✗ No audio recording
- ✗ Less mature organization system
- ✗ Smaller ecosystem

### vs. Apple Notes/Freeform

**Advantages (Boojy Board)**
- ✓ Cross-platform (vs. Apple only)
- ✓ More powerful drawing tools
- ✓ PDF annotation
- ✓ Page-based structure (Notes is scrolling)
- ✓ Export flexibility

**Disadvantages (Boojy Board EP)**
- ✗ Not pre-installed/integrated with OS
- ✗ Less mature
- ✗ No quick capture widget (yet)

### Unique Value Proposition

**Boojy Board differentiates through:**

1. **Best of both worlds:** Note-taking (like Notability) + Whiteboarding (like Miro)
2. **True cross-platform:** Not limited to Apple ecosystem
3. **Free and open-source:** No subscriptions, no paywalls, community-driven
4. **Privacy-first:** Offline-first, local storage, no tracking
5. **Boojy Suite integration:** Part of larger creative ecosystem
6. **"Just works" philosophy:** Simple enough for anyone, powerful enough for serious use

**Target positioning:** "The free, cross-platform alternative to Notability with collaboration features borrowed from Miro"

---

## Future Roadmap

### Version 1.0 (Post-EP, ~3-4 months)

**Major Features**
- ✓ Infinite canvas / whiteboard mode (in addition to pages)
- ✓ Real-time collaboration with live cursors
- ✓ Shape recognition (squares, circles, arrows snap to perfect)
- ✓ Lasso selection tool (select, move, resize strokes)
- ✓ Ruler / straight edge tool
- ✓ Markdown support for text (checkboxes, bold, italic, headers)
- ✓ Interactive checkboxes / to-do lists
- ✓ Boojy Cloud sync (optional)
- ✓ Image import and basic manipulation
- ✓ Grid and guide overlays (optional toggles)
- ✓ Multiple background colors

**Improvements**
- UI polish and refinement
- Performance optimization
- More export formats (SVG for vectors)
- Enhanced folder organization
- Better search in library
- More paper templates
- Improved text formatting

### Version 1.1 (~2 months after v1.0)

**Major Features**
- ✓ Handwriting recognition and search (OCR)
- ✓ Quick Notes feature (Google Keep replacement)
- ✓ Voice-to-text for quick capture
- ✓ Templates library (meeting notes, Cornell notes, etc.)
- ✓ Dark mode
- ✓ Advanced selection tools

**Platform Expansion**
- iPhone support
- Android tablet support
- Web version (via Flutter Web)

### Version 1.2 and Beyond

**Advanced Features**
- Audio recording synced to notes (Notability-style)
- Handwriting-to-text conversion
- Advanced collaboration (comments, suggestions)
- Version history and time travel
- Plugin/extension system
- Presentation mode
- Mind mapping templates
- Kanban board templates
- Advanced shape library
- Custom brush creation

**Boojy Suite Integration**
- Seamless export to Boojy Draw for refinement
- Import Boojy Design files as images
- Storyboard mode for Boojy Animate
- Integration with Boojy Video timeline
- Shared asset library across apps

**Enterprise/Education Features**
- Team workspaces
- Admin controls for classrooms
- LTI integration for LMS (Canvas, Blackboard)
- Bulk deployment tools
- Advanced permissions

### Long-Term Vision (2+ years)

**Community & Ecosystem**
- Plugin marketplace
- Community template sharing
- Theme customization
- Custom tool creation
- API for third-party integrations

**AI Features (Optional, User-Controlled)**
- Smart shape completion
- Handwriting cleanup/beautification
- Auto-summarization of notes
- Smart search across content
- OCR improvements using ML

**Platform Maturity**
- Sub-50ms drawing latency on all platforms
- Support for 1000+ page documents
- Advanced caching and performance
- Offline collaboration (conflict resolution)
- Enterprise-grade security

---

## Appendix

### Design Resources

**Mockups Needed:**
- Library view (grid of thumbnails)
- Main canvas with left sidebar and top toolbar
- Tool selection states
- PDF import flow
- Export dialog
- Settings panel

**Assets Needed:**
- Tool icons (pen, highlighter, eraser, text, etc.)
- File operation icons (new, open, save, export)
- Paper texture for canvas background
- Boojy Board logo (Jupiter-themed)
- App icon for all platforms

### Technical Dependencies

**Flutter Packages (Planned)**
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Drawing & Canvas
  flutter_hooks: ^0.20.0
  
  # PDF
  pdf_render: ^1.4.0
  syncfusion_flutter_pdf: ^23.1.36
  
  # File Management
  path_provider: ^2.1.0
  file_picker: ^6.0.0
  
  # Storage
  sqflite: ^2.3.0
  
  # Firebase (for future)
  firebase_core: ^2.20.0
  firebase_storage: ^11.5.0
  
  # UI
  provider: ^6.1.0
  
  # Utils
  uuid: ^4.0.0
  intl: ^0.18.0
```

### Open Questions

**To Resolve Before Development:**
1. Exact pressure curve mapping for Apple Pencil
2. Memory limits for page count in single board
3. Firebase pricing for future cloud sync
4. App store submission requirements (Apple, Microsoft)
5. Linux package format preferences (snap, flatpak, AppImage)

**To Resolve During Development:**
1. Optimal stroke point sampling rate
2. Auto-save trigger conditions
3. Thumbnail cache invalidation strategy
4. PDF rendering library final choice
5. Cross-platform file path handling edge cases

---

## Document History

**v0.1 - November 8, 2025**
- Initial design document created
- Scope defined for Early Preview
- 3-week development timeline outlined
- Feature specifications detailed
- Competitive analysis completed

**Next Review:** After Week 1 of development (mid-November 2025)

---

## Contact & Feedback

**Project Lead:** Tyr  
**GitHub (Development):** tsbujacncl  
**GitHub (Public Release):** boojyorg  
**Target Testing Group:** 4-5 students and family members  

**Feedback Channels:**
- GitHub Issues (tsbujacncl/boojy-board)
- Direct testing feedback sessions
- Internal project notes

---

*This document is a living specification and will be updated as development progresses and feedback is gathered.*