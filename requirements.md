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

**Current Status**: Step 1 in progress
**Last Updated**: 2025-02-07