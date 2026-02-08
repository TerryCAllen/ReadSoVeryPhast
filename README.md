# Read So Very Phast

A minimalist, no-dependency speed reading web application that displays text one word at a time to help you read faster and with better focus.

**🚀 [Try it now!](https://terrycallen.github.io/ReadSoVeryPhast/)**

![Read So Very Phast](screenshot-placeholder.png)

## Features

### Core Reading Experience
- **One-Word-At-A-Time Display**: Focus on a single word with large, readable text
- **Adjustable Reading Speed**: 50-1000 words per minute (WPM)
- **Smart Punctuation Pauses**: Automatically pauses longer on periods, commas, and semicolons
- **Sentence Navigation**: Jump backward/forward by sentence while reading
- **Progress Tracking**: See your current position, percentage complete, and estimated time remaining

### Customization
- **Dual Themes**: 
  - Dark Mode: Retro amber-on-black (inspired by classic CRT terminals)
  - Light Mode: Dark blue on light background
- **Font Size Control**: Separate controls for word display and paragraph text
- **Adjustable Speed Increments**: Customize how much the speed changes with each adjustment

### User Experience
- **Touch-Friendly Controls**: Designed for both desktop and mobile devices
- **Keyboard Shortcuts**: 
  - Space: Play/Pause
  - Arrow Keys: Navigate and adjust speed
- **Persistent Storage**: Your text and reading position are saved automatically
- **No Text Limits**: Handle full books or single paragraphs with ease

### Smart Features
- **Smart Sentence Jumping**: Press left arrow twice at sentence start to jump to previous sentence
- **Highlighted Current Sentence**: When paused, see your current sentence highlighted
- **Copy/Paste Support**: Select and copy text from the paragraph view
- **Text Persistence**: Resume reading exactly where you left off

## How to Use

### Getting Started

#### Option 1: Bookmarklet (Recommended for Web Articles)
1. Visit [bookmarklet.html](https://terrycallen.github.io/ReadSoVeryPhast/bookmarklet.html)
2. Drag the "📖 Speed Read This" button to your bookmarks bar
3. When browsing any article or web page, click the bookmarklet
4. The text is automatically extracted and loaded into SpeedRead
5. Start reading immediately!

**Smart Content Extraction**: The bookmarklet uses Mozilla's Readability technology to extract clean article content, filtering out ads, navigation, and clutter.

#### Option 2: Copy and Paste
1. Open `index.html` in your web browser
2. Click "Load Text" and paste in any text you want to read
3. Press the play button (center control) or spacebar to start reading

### Controls

#### Touch/Click Controls
- **Center**: Play/Pause toggle
- **Up**: Increase speed (reading) / Scroll up (paused)
- **Down**: Decrease speed (reading) / Scroll down (paused)
- **Left**: Jump to sentence start (reading) / Previous sentence (paused)
- **Right**: Skip to next sentence (reading) / Next sentence (paused)

#### Keyboard Shortcuts
- **Space**: Play/Pause
- **↑**: Up control
- **↓**: Down control  
- **←**: Left control
- **→**: Right control

### Settings
Click the hamburger menu (☰) to access:
- Words Per Minute (WPM)
- WPM Increment step
- Word display font size
- Paragraph font size
- Theme (Dark/Light)
- Load new text

## Installation

### Download and Use
1. Download all files in this repository
2. Keep all files in the same directory
3. Open `index.html` in any modern web browser
4. No server or installation required!

### Required Files
- `index.html` - Main application file
- `styles.css` - Styling
- `storage.js` - LocalStorage management
- `textProcessor.js` - Text parsing and processing
- `reader.js` - Reading engine and timing
- `controls.js` - UI controls and interactions
- `settings.js` - Settings management
- `main.js` - Application initialization

## Technical Details

- **Zero Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks or libraries
- **LocalStorage**: Text and position are saved to your browser
- **Modular Design**: Clean separation of concerns across multiple JS modules
- **Self-Documenting Code**: Thoughtful naming conventions, no abbreviations
- **Mobile-Responsive**: Works on phones, tablets, and desktops

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- LocalStorage
- CSS Grid and Flexbox

Tested on: Chrome, Firefox, Edge, Safari

## Storage Limits

- Most browsers: 5-10 MB per domain
- A typical novel (100,000 words) uses ~500-600 KB
- You can easily store multiple books

## Privacy

All data is stored locally in your browser. Nothing is sent to any server. Your reading content and progress stay completely private.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Created by Terry Allen

## Contributing

This is an open-source project. Feel free to fork, modify, and use as you wish!

## Acknowledgments

Inspired by classic speed reading tools, but designed to fix their common flaws with smart timing, intuitive navigation, and persistent storage.