# Speed Reading App - Requirements & Implementation Plan

## Project Overview
A simple, dependency-free HTML/JavaScript speed reading application that displays one word at a time for focused reading. Built with vanilla JavaScript, HTML, and CSS for maximum compatibility and zero build tools.

## Core Features

### 1. Text Input Methods
- **Load Text**: Copy/paste text into a textbox
- **URL Loading**: ~~Phase 2 feature - skipped for initial implementation~~

### 2. Display Layout (Three Sections)

#### Top Section - Word Display
- Single word displayed in large font
- Size: Large enough to fit very long words across most of the screen
- Visibility: Only shown when reading is active
- Font: High contrast (amber on black - retro monitor aesthetic)

#### Middle Section - Paragraph Display
- Shows entire paragraph containing current word when paused
- Current sentence subtly highlighted
- Scrollable content
- Auto-scrolls to keep current sentence centered/visible
- Hidden during active reading to avoid distraction

#### Bottom Section - Control Area
- Full bottom third of screen = touch-sensitive control area
- Layout: Center play/pause button with directional controls around it

```
┌─────────────────────┐
│         ↑           │
│    (Speed Up)       │
├──────┬──────┬───────┤
│  ←   │ ▶/⏸ │   →   │
│(Prev)│      │(Next) │
├──────┴──────┴───────┤
│         ↓           │
│   (Speed Down)      │
└─────────────────────┘
```

### 3. Control Behaviors

#### Center Button - Play/Pause Toggle
- Toggles between reading and paused states

#### While Reading (Active State)
- **Left**: Jump to beginning of current sentence
- **Right**: Skip to next sentence
- **Up**: Increase WPM by configured increment (default: 5)
- **Down**: Decrease WPM by configured increment (default: 5)
- **Middle section**: Hidden

#### While Paused
- **Left**: Navigate to previous sentence
- **Right**: Navigate to next sentence  
- **Up**: Scroll paragraph display up
- **Down**: Scroll paragraph display down
- **Middle section**: Visible with current sentence highlighted

### 4. Reading Logic

#### Word Display Timing
- Display words at configured WPM rate (default: 200 WPM)
- **Punctuation Pauses**: When encountering `.` `,` `;` `:` `?` `!` `—`, display the word for 2x normal duration

#### Text Processing
- Strip HTML tags from imported text
- Remove escape codes and special characters
- Clean formatting for readable text
- Parse into sentences for navigation
- Parse into paragraphs for display

### 5. Data Persistence (Browser LocalStorage)

#### Persisted Data
- Current text content
- Reading position (word index)
- User settings:
  - WPM speed (default: 200)
  - WPM increment (default: 5)
  - Theme (dark/light - start with dark)
  - Font size
  - Font color
  - Background color

#### Behavior
- Auto-save on changes
- Auto-load on app startup
- User can resume exactly where they left off

### 6. Settings Menu

#### Phase 1 Settings
- WPM speed configuration
- WPM increment/decrement amount
- Theme: Dark mode (amber on black) - default for Phase 1

#### Phase 2 Settings (Future)
- Light/dark mode toggle
- Font size adjustment
- Custom font colors
- Custom background colors
- URL loading feature

### 7. Design Specifications

#### Visual Design
- **Phase 1 Theme**: Dark mode with high contrast
  - Background: Black (#000000)
  - Text: Amber (#FFB000 or similar retro monitor color)
  - Highlighted sentence: Subtle amber glow/underline
  
#### Responsive Design
- Must work on mobile devices (touch-enabled)
- Touch-friendly control areas
- Readable on various screen sizes

### 8. Code Quality Standards

#### Naming Conventions
- **Full, descriptive names** - no abbreviations
- **Self-documenting code** - minimal comments needed
- **Consistent naming** - don't rename the same concept
  - Example: Use `paragraph` consistently, not `paragraph` then `textBlock`
- **Lambda parameters**: Full names matching the type
  - Good: `sentences.map(sentence => ...)`
  - Bad: `sentences.map(s => ...)`

#### Code Organization
- Break into small, understandable functions
- Separate concerns into individual files:
  - `index.html` - Main HTML structure
  - `styles.css` - All styling
  - `storage.js` - LocalStorage operations
  - `textProcessor.js` - Text parsing and cleaning
  - `reader.js` - Reading engine and word display
  - `controls.js` - UI controls and touch handling
  - `settings.js` - Settings management
  - `main.js` - App initialization and coordination

#### Modern Conventions
- Use modern JavaScript (ES6+)
- No external dependencies or libraries
- No build tools required (webpack, etc.)

---

## Implementation Plan

### Phase 1: Core Functionality

- [ ] **Step 1: Project Setup & Requirements**
  - [x] Create requirements.md document
  - [ ] Create basic HTML structure
  - [ ] Create CSS with dark theme (amber on black)
  - [ ] Set up file organization

- [ ] **Step 2: Storage Module**
  - [ ] Implement LocalStorage wrapper functions
  - [ ] Create settings save/load functions
  - [ ] Create text content save/load functions
  - [ ] Create position save/load functions
  - [ ] Test persistence across browser sessions

- [ ] **Step 3: Text Processing Module**
  - [ ] Implement HTML tag stripping
  - [ ] Implement special character cleaning
  - [ ] Implement sentence detection/parsing
  - [ ] Implement paragraph detection/parsing
  - [ ] Implement word tokenization
  - [ ] Test with various text inputs

- [ ] **Step 4: Basic UI Layout**
  - [ ] Create three-section layout (top/middle/bottom)
  - [ ] Style word display area (top)
  - [ ] Style paragraph display area (middle)
  - [ ] Style control area (bottom)
  - [ ] Implement responsive sizing
  - [ ] Test on different screen sizes

- [ ] **Step 5: Settings UI**
  - [ ] Create hamburger menu icon
  - [ ] Create settings panel/modal
  - [ ] Implement WPM input control
  - [ ] Implement WPM increment input control
  - [ ] Connect settings to storage
  - [ ] Test settings persistence

- [ ] **Step 6: Text Input UI**
  - [ ] Create "Load Text" interface
  - [ ] Implement text paste functionality
  - [ ] Connect to text processor
  - [ ] Connect to storage
  - [ ] Test with various text lengths

- [ ] **Step 7: Reading Engine**
  - [ ] Implement word-by-word display
  - [ ] Implement WPM-based timing
  - [ ] Implement punctuation pause logic (2x duration)
  - [ ] Implement play/pause toggle
  - [ ] Test reading flow and timing

- [ ] **Step 8: Control Buttons - Reading Mode**
  - [ ] Implement center play/pause button
  - [ ] Implement left (jump to sentence start)
  - [ ] Implement right (skip to next sentence)
  - [ ] Implement up (increase WPM)
  - [ ] Implement down (decrease WPM)
  - [ ] Test all controls while reading

- [ ] **Step 9: Control Buttons - Paused Mode**
  - [ ] Implement paragraph display on pause
  - [ ] Implement sentence highlighting
  - [ ] Implement left (previous sentence)
  - [ ] Implement right (next sentence)
  - [ ] Implement up/down scrolling
  - [ ] Auto-scroll to current sentence
  - [ ] Test all controls while paused

- [ ] **Step 10: Integration & Testing**
  - [ ] Connect all modules together
  - [ ] Test complete reading workflow
  - [ ] Test persistence (close/reopen browser)
  - [ ] Test edge cases (empty text, very long words, etc.)
  - [ ] Test on mobile device or emulator
  - [ ] Fix any bugs discovered

- [ ] **Step 11: Polish & Refinement**
  - [ ] Optimize performance
  - [ ] Improve visual feedback
  - [ ] Add loading states if needed
  - [ ] Final testing
  - [ ] Documentation updates

### Phase 2: Future Enhancements (Not in initial scope)
- [ ] URL loading with CORS handling
- [ ] Light mode theme
- [ ] Custom color picker
- [ ] Font size adjustment
- [ ] Additional settings options
- [ ] Keyboard shortcuts
- [ ] Progress indicators
- [ ] Bookmarks/favorites

---

## Technical Constraints

- **No Dependencies**: Pure HTML, CSS, JavaScript
- **No Build Tools**: Must run directly in browser
- **Mobile-First**: Touch controls must work well
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Storage**: LocalStorage only (no server required)

## Success Criteria

1. User can paste text and start reading immediately
2. Words display one at a time at configured WPM
3. Punctuation causes appropriate pauses
4. Controls work intuitively in both reading and paused modes
5. Settings and position persist across browser sessions
6. App works smoothly on mobile devices
7. Code is clean, readable, and well-organized

---

**Current Status**: Phase 1 Complete! App is live and fully functional.
**Last Updated**: 2026-02-07

---

## Completed Features

### ✅ All Phase 1 Features Implemented

**Core Functionality:**
- [x] Text input via copy/paste
- [x] Word-by-word display with configurable WPM
- [x] Punctuation-aware pauses (2x duration)
- [x] Sentence navigation (forward/backward)
- [x] Smart left arrow (restart sentence or jump to previous)
- [x] LocalStorage persistence (text, position, settings)
- [x] Dark mode theme (retro amber on black)
- [x] Light mode theme (blue on light)

**User Interface:**
- [x] Three-section layout (word/paragraph/controls)
- [x] Touch-friendly controls (mobile support)
- [x] Settings panel with hamburger menu
- [x] Help panel with usage instructions
- [x] Paragraph display with current sentence highlighting
- [x] Progress tracking (word count, %, time remaining)
- [x] Keyboard shortcuts (Space, arrows)

**Mobile Optimizations:**
- [x] Touch event support (touchend + click)
- [x] Prevented unwanted zoom
- [x] Scrollable settings panel
- [x] Icon management (no overlaps)
- [x] Click-outside-to-close panels
- [x] Responsive design

**Code Quality:**
- [x] Modular file structure (8 separate JS files)
- [x] Self-documenting naming conventions
- [x] No external dependencies
- [x] Zero build tools required

**Published:**
- [x] GitHub repository created
- [x] MIT License added
- [x] Comprehensive README
- [x] Live demo on GitHub Pages

**Live Demo:** https://terrycallen.github.io/ReadSoVeryPhast/

---

## Recent Updates (Latest Session - Feb 7, 2026)

### Progress Stats Enhancement
- [x] **Clickable progress stats** - Click bottom-right stats to see detailed info
- [x] **3-line compact format** on all devices:
  ```
  1,234/5,678
  22.5%
  3h 42m
  ```
- [x] **Progress detail dialog** with full information:
  - "Word 1,234 of 5,678"
  - "22.5% Complete"
  - "3 hours, 42 min remaining"
- [x] Hover effect on progress stats (color change)
- [x] Click outside or × button to close dialog
- [x] Touch-friendly on mobile

### Mobile-Specific Improvements
- [x] **Default word font size = 50px on mobile** (≤768px screens)
- [x] Desktop remains at 80px default
- [x] Replaced pause emoji (⏸) with ASCII (❚❚) to stay in amber theme
- [x] Touch events (touchend + click) for all controls
- [x] Prevented unwanted zoom with viewport meta tag
- [x] Scrollable settings panel on iPhone
- [x] Icons hide when panels open (no overlap)

### Settings Improvements
- [x] "Load New Text" button moved to top of settings
- [x] Speed changes (up/down arrows) persist automatically
- [x] Panel mutual exclusivity (settings/help/progress detail)
- [x] Click-outside-to-close for all panels

### Previous Updates
- [x] Help system with keyboard shortcuts and RSVP title
- [x] Smart sentence navigation (left arrow behavior)
- [x] Progress tracking with time estimates
- [x] Dual themes (dark/light)
- [x] LocalStorage persistence
- [x] Punctuation-aware pauses

---

## Important Implementation Details

### Touch Event Handling
**File:** `controls.js`
- All buttons use both `click` and `touchend` events via `addClickAndTouchListener()`
- Prevents default on touchend with `{ passive: false }`
- Critical for iPhone/mobile compatibility

### Progress Stats System
**Files:** `reader.js`, `controls.js`, `index.html`
- Compact display: 3 lines always visible (bottom-right)
- Detail dialog: Populated from `ReaderEngine.currentProgressDetails`
- Click handler in `controls.js`: `openProgressDetail()`
- Auto-formats time differently for compact vs detail view
- Uses `toLocaleString()` for number formatting with commas

### Mobile Font Size Detection
**File:** `storage.js`
```javascript
wordFontSize: (window.innerWidth <= 768) ? 50 : 80
```
- Evaluated at initialization
- Only affects new users (existing settings preserved)
- Breakpoint matches mobile responsive CSS

### Icon Visibility Management
**File:** `controls.js`
- Help icon (?) only visible when paused
- Both hamburger and help hide when any panel opens
- Prevents overlap on small screens
- Managed by `showHelpIcon()`, `hideHelpIcon()`, etc.

### Panel System
**All panels:** Help, Settings, Text Input, Progress Detail
- Mutual exclusivity enforced (only one open at a time)
- Click-outside-to-close via `attachClickOutsideListeners()`
- Both click and touch events handled
- Checks for both panel.contains() and icon.contains() to prevent accidental closes

### Pause Button Fix
**File:** `reader.js`
- Uses ASCII characters: `▶` (play) and `❚❚` (pause)
- NOT emojis - emojis render blue on iOS
- Stays in amber theme on all devices

### Sentence Navigation Logic
**File:** `reader.js` - `jumpToSentenceStart()`
- Smart behavior: If within first 2 words of sentence, jump to PREVIOUS sentence
- Prevents accidental restarts when user means to go back
- Sets `justJumpedToSentence = true` for 2x pause duration

### Storage Structure
**File:** `storage.js`
- Uses 3 localStorage keys:
  - `speedReader_settings` - User preferences
  - `speedReader_textContent` - Current text
  - `speedReader_readingPosition` - Word/sentence/paragraph indices
- Default settings include theme, fonts, colors, WPM
- All saves merge with defaults to ensure no missing fields

### Timing System
**File:** `reader.js`
- Base delay: `(60 / WPM) * 1000` milliseconds
- 2x delay for: punctuation OR sentence jumps
- `scheduleNextWord()` uses setTimeout (not setInterval)
- Allows dynamic WPM changes during reading
- Auto-saves position every 10 words

### CSS Mobile Responsiveness
**File:** `styles.css`
- Breakpoint: `@media (max-width: 768px)`
- Smaller fonts and padding on mobile
- Full-width settings panel on mobile
- Maintains 3-section layout (33.33vh each)

### File Organization
```
SpeedRead/
├── index.html          - Structure & DOM
├── styles.css          - All styling & themes
├── storage.js          - LocalStorage operations
├── textProcessor.js    - Text parsing & cleaning
├── reader.js           - Reading engine & timing
├── controls.js         - UI controls & touch handling
├── settings.js         - Settings management
└── main.js             - App initialization
```

### Key Functions to Remember

**ReaderEngine (reader.js):**
- `loadText()` - Process and load text
- `startReading()` / `pauseReading()` - Control reading state
- `jumpToSentenceStart()` - Smart backward navigation
- `showProgressStats()` - Calculate and display progress
- `scheduleNextWord()` - Timing engine

**ControlsManager (controls.js):**
- `handleCenterControl()` - Play/pause toggle
- `handleUpControl()` / `handleDownControl()` - Context-aware (speed vs scroll)
- `handleLeftControl()` / `handleRightControl()` - Sentence navigation
- `openProgressDetail()` - Show progress dialog
- `addClickAndTouchListener()` - Dual event support

**TextProcessor (textProcessor.js):**
- `processText()` - Parse into paragraphs/sentences/words
- `cleanText()` - Remove HTML/escape codes
- `getAllWordsFlat()` - Get flat array for reading

**SettingsManager (settings.js):**
- `applyAllSettings()` - Theme, fonts, reader config
- `loadSettingsIntoUI()` - Populate settings form

### Known Quirks & Solutions

1. **Auto-formatting:** After file edits, formatters may change quotes, spacing
   - Always use final_file_content for next SEARCH block

2. **toLocaleString():** Adds commas as thousands separator
   - "1,234" not "1, 234" (no space after comma)

3. **Mobile zoom prevention:** 
   - Viewport: `maximum-scale=1.0, user-scalable=no`

4. **Third-party emoji rendering:**
   - iOS renders ⏸ as blue emoji
   - Solution: Use ASCII/Unicode characters (❚❚)

5. **Touch event passive flag:**
   - Must be `{ passive: false }` to call preventDefault()

6. **Panel z-index hierarchy:**
   - Panels: 998
   - Icons: 1000
   - Settings panel: 999

---

## Recent Updates (Continued)

### Bookmarklet Feature (Feb 7, 2026 - Evening Session)
- [x] **Created bookmarklet for importing web articles**
  - Uses Readability.js to extract clean article text from any webpage
  - Installed via bookmarklet.html page
  - Drag-and-drop installation to bookmarks bar
  - One-click import from any article

**How it works:**
1. User visits bookmarklet.html and drags link to bookmarks bar
2. While reading any web article, click the bookmarklet
3. Readability.js extracts main content (removes ads, nav, etc.)
4. Text is stored in localStorage
5. User switches to speed reader tab/window
6. Speed reader auto-detects new text and loads it

**Files:**
- `bookmarklet.html` - Installation page with instructions
- Bookmarklet code uses: Mozilla Readability.js (CDN)
- Storage key: `speedReader_importedText`

**CORS Considerations:**
- Cannot fetch external URLs directly from the app (CORS blocked)
- Bookmarklet runs in context of source page (no CORS issues)
- Clever workaround: localStorage as communication channel between tabs

### Text Processing Improvements (Feb 7, 2026 - Evening Session)
- [x] **Fixed missing spaces after sentence-ending punctuation**
  - Issue: Web articles sometimes have `primates.Since` instead of `primates. Since`
  - Cause: HTML structure like `<p>...primates.</p><p>Since...</p>` loses spacing
  - Solution: Regex to insert space after `.!?` when followed by capital letter
  
- [x] **Fixed missing spaces after punctuation + quotes**
  - Issue: Text like `it."Praying` instead of `it." Praying`
  - Challenge: Ambiguous quote placement without semantic understanding
  - Solution: Multiple regex patterns for all quote types using Unicode escapes
  
**Implementation Details:**

```javascript
// Fix direct punctuation-to-capital: "primates.Since" -> "primates. Since"
cleanedText = cleanedText.replace(/([.!?])([A-Z])/g, '$1 $2');

// Fix punctuation + quotes + capital using Unicode escape sequences
cleanedText = cleanedText.replace(/([.!?])(")([A-Z])/g, '$1$2 $3');        // Straight double quote U+0022
cleanedText = cleanedText.replace(/([.!?])(')([A-Z])/g, '$1$2 $3');        // Straight single quote U+0027
cleanedText = cleanedText.replace(/([.!?])(\u201C)([A-Z])/g, '$1$2 $3');   // Curly left double quote U+201C
cleanedText = cleanedText.replace(/([.!?])(\u201D)([A-Z])/g, '$1$2 $3');   // Curly right double quote U+201D
cleanedText = cleanedText.replace(/([.!?])(\u2018)([A-Z])/g, '$1$2 $3');   // Curly left single quote U+2018
cleanedText = cleanedText.replace(/([.!?])(\u2019)([A-Z])/g, '$1$2 $3');   // Curly right single quote U+2019
```

**Why Unicode escapes?**
- File encoding can corrupt literal curly quote characters
- Unicode escape sequences (`\u201D`) are guaranteed to work
- Handles both straight quotes (`"` `'`) and curly quotes (`"` `"` `'` `'`)

**Known Limitation:**
- Regex cannot determine grammatically correct quote placement
- Example ambiguity:
  - `They were mad."They should be"` - Space should be: `mad. "They` (before quote)
  - `"They should be mad."They were` - Space should be: `mad." They` (after quote)
- Current solution: Always puts space after quote (pragmatic "good enough")
- Rationale: Fixes readability for speed reading; perfect grammar not critical at 200+ WPM

**File:** `textProcessor.js` - `cleanText()` function

### Testing & Debugging
- [x] Tested bookmarklet on real news articles
- [x] Identified quote character Unicode codes using browser console
- [x] Verified fix works with both straight and curly quotes
- [x] Confirmed GitHub Pages deployment (24-minute deploy cycle)
- [x] Tested in incognito mode to avoid cache issues

---

## Future Enhancements (Phase 2)

Potential features for future development:
- [x] ~~URL loading with text extraction~~ → **Implemented via bookmarklet!**
- [ ] Additional theme options
- [ ] Custom color picker
- [ ] Font family selection
- [ ] Export/import settings
- [ ] Reading history/statistics
- [ ] Bookmarks feature
- [ ] Multiple saved texts
- [ ] Smarter quote handling (ML-based or heuristic quote pairing)
- [ ] Browser extension version (better than bookmarklet)
