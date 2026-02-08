# iOS Shortcut Creation Guide

This guide explains how to create the "Read So Very Phast" iOS Shortcut manually.

## Overview

The shortcut extracts article text from Safari and opens it in Read So Very Phast for speed reading.

## Steps to Create the Shortcut

### 1. Open Shortcuts App on iPhone/iPad

### 2. Create New Shortcut
- Tap the **+** button
- Name it: **Read So Very Phast**

### 3. Add These Actions (in order):

#### Action 1: Receive Safari web page from Share Sheet
- Search for "**Receive**"
- Select "**Receive [anything] input from [Share Sheet]**"
- Change to: "**Safari web pages**" from "**Share Sheet**"
- Tap "**Show More**" and enable "**Show in Share Sheet**"

#### Action 2: Get URLs from Input
- Search for "**Get URLs**"
- Select "**Get URLs from [input]**"
- Leave as "**Shortcut Input**"

#### Action 3: Get Contents of URL
- Search for "**Get Contents**"
- Select "**Get Contents of URL**"
- Set URL to: "**URLs**" (from previous action)

#### Action 4: Get Text from HTML
- Search for "**Get Text**"
- Select "**Get Text from [input]**"
- Set to get text from "**Contents of URL**"

#### Action 5: Run JavaScript on Web Page
- Search for "**Run JavaScript**"
- Select "**Run JavaScript on Web Page**"
- Paste this JavaScript code:

```javascript
(function() {
    // Get the HTML content
    const html = document.documentElement.outerHTML;
    
    // Simple text extraction (fallback if Readability isn't available)
    let text = document.body.innerText || document.body.textContent;
    
    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Return the cleaned text
    return text;
})();
```

#### Action 6: Base64 Encode
- Search for "**Base64**"
- Select "**Base64 Encode [input]**"
- Set to encode "**JavaScript Result**"

#### Action 7: URL Encode
- Search for "**URL Encode**"
- Select "**URL Encode [input]**"
- Set to encode "**Base64 Encoded**"

#### Action 8: Text - Build URL
- Search for "**Text**"
- Select "**Text**"
- Type: `https://terrycallen.github.io/ReadSoVeryPhast/#text=`
- Then tap the **variable button** and select "**URL Encoded**"
- Final text should be: `https://terrycallen.github.io/ReadSoVeryPhast/#text=[URL Encoded]`

#### Action 9: Open URL
- Search for "**Open**"
- Select "**Open URLs**"
- Set URL to: "**Text**" (from previous action)

### 4. Configure Share Sheet
- Tap the settings icon (three dots in circle) at top right
- Enable "**Show in Share Sheet**"
- Set accepted types to: "**URLs**" and "**Safari Web Pages**"

### 5. Save
- Tap "**Done**"

## Simplified Version (If Above is Too Complex)

If the JavaScript/Readability version is too complex, here's a simpler version:

1-3. Same as above (Receive, Get URLs, Get Contents)

4. **Get Text from HTML**
   - Gets plain text from the HTML

5. **Base64 Encode**
   - Encode the text

6. **URL Encode**
   - Encode for URL

7. **Text**: `https://terrycallen.github.io/ReadSoVeryPhast/#text=[URL Encoded]`

8. **Open URLs**

This simpler version won't use Readability but will still extract text from pages.

## Testing

1. Navigate to any article in Safari
2. Tap Share button
3. Select "Read So Very Phast"
4. Should open the speed reader with text loaded

## Exporting the Shortcut

Once created and tested:

1. Open Shortcuts app
2. Long-press on "Read So Very Phast" shortcut
3. Tap "**Share**"
4. Select "**Copy iCloud Link**"
5. This creates a shareable link that others can use to install

## Notes

- The shortcut needs "**Allow Sharing Large Amounts of Data**" permission
- First run may prompt for privacy permissions
- Works best with article-style pages
- May not work well with PDFs or heavily JavaScript sites

## Alternative: Use iCloud Link

Instead of manually creating, users can install from an iCloud link if you've already created and shared the shortcut.

The shortcuts.html page currently references:
```
https://raw.githubusercontent.com/TerryCAllen/ReadSoVeryPhast/main/Read-So-Very-Phast.shortcut
```

This should be replaced with your actual iCloud sharing link once you create and export the shortcut.