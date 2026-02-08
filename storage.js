// Storage Module - Handles all LocalStorage operations
// Manages persistence of settings, text content, and reading position
// Note: Text content and position are now managed by LibraryManager
// This module maintains legacy functions for backward compatibility

const StorageManager = {
    // Storage keys
    KEYS: {
        SETTINGS: 'speedReader_settings',
        TEXT_CONTENT: 'speedReader_textContent',  // Legacy - migrated to library
        READING_POSITION: 'speedReader_readingPosition'  // Legacy - migrated to library
    },

    // Default settings
    DEFAULT_SETTINGS: {
        wordsPerMinute: 200,
        wordsPerMinuteIncrement: 5,
        theme: 'dark',
        wordFontSize: (window.innerWidth <= 768) ? 50 : 80,  // 50 on mobile, 80 on desktop
        paragraphFontSize: 16,
        fontColor: '#FFB000',
        backgroundColor: '#000000'
    },

    // Save settings to LocalStorage
    saveSettings: function(settings) {
        try {
            const settingsToSave = { ...this.DEFAULT_SETTINGS, ...settings };
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settingsToSave));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    },

    // Load settings from LocalStorage
    loadSettings: function() {
        try {
            const storedSettings = localStorage.getItem(this.KEYS.SETTINGS);
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                return { ...this.DEFAULT_SETTINGS, ...parsedSettings };
            }
            return { ...this.DEFAULT_SETTINGS };
        } catch (error) {
            console.error('Failed to load settings:', error);
            return { ...this.DEFAULT_SETTINGS };
        }
    },

    // Legacy functions - kept for backward compatibility
    // Text content and positions are now managed by LibraryManager
    
    // Save text content to LocalStorage (legacy)
    saveTextContent: function(textContent) {
        console.warn('saveTextContent is deprecated - use LibraryManager instead');
        try {
            localStorage.setItem(this.KEYS.TEXT_CONTENT, textContent);
            return true;
        } catch (error) {
            console.error('Failed to save text content:', error);
            return false;
        }
    },

    // Load text content from LocalStorage (legacy)
    loadTextContent: function() {
        try {
            const textContent = localStorage.getItem(this.KEYS.TEXT_CONTENT);
            return textContent || '';
        } catch (error) {
            console.error('Failed to load text content:', error);
            return '';
        }
    },

    // Save reading position to LocalStorage (legacy)
    saveReadingPosition: function(position) {
        console.warn('saveReadingPosition is deprecated - use LibraryManager instead');
        try {
            const positionData = {
                wordIndex: position.wordIndex || 0,
                sentenceIndex: position.sentenceIndex || 0,
                paragraphIndex: position.paragraphIndex || 0,
                lastUpdated: Date.now()
            };
            localStorage.setItem(this.KEYS.READING_POSITION, JSON.stringify(positionData));
            return true;
        } catch (error) {
            console.error('Failed to save reading position:', error);
            return false;
        }
    },

    // Load reading position from LocalStorage (legacy)
    loadReadingPosition: function() {
        try {
            const storedPosition = localStorage.getItem(this.KEYS.READING_POSITION);
            if (storedPosition) {
                return JSON.parse(storedPosition);
            }
            return {
                wordIndex: 0,
                sentenceIndex: 0,
                paragraphIndex: 0,
                lastUpdated: null
            };
        } catch (error) {
            console.error('Failed to load reading position:', error);
            return {
                wordIndex: 0,
                sentenceIndex: 0,
                paragraphIndex: 0,
                lastUpdated: null
            };
        }
    },

    // Clear all stored data
    clearAllData: function() {
        try {
            localStorage.removeItem(this.KEYS.SETTINGS);
            localStorage.removeItem(this.KEYS.TEXT_CONTENT);
            localStorage.removeItem(this.KEYS.READING_POSITION);
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            return false;
        }
    },

    // Clear only text content and position (keep settings)
    clearTextData: function() {
        try {
            localStorage.removeItem(this.KEYS.TEXT_CONTENT);
            localStorage.removeItem(this.KEYS.READING_POSITION);
            return true;
        } catch (error) {
            console.error('Failed to clear text data:', error);
            return false;
        }
    },

    // Check if text content exists
    hasTextContent: function() {
        const textContent = this.loadTextContent();
        return textContent.length > 0;
    },

    // Get storage usage information (for debugging)
    getStorageInfo: function() {
        try {
            const settings = localStorage.getItem(this.KEYS.SETTINGS);
            const textContent = localStorage.getItem(this.KEYS.TEXT_CONTENT);
            const position = localStorage.getItem(this.KEYS.READING_POSITION);

            return {
                settingsSize: settings ? settings.length : 0,
                textContentSize: textContent ? textContent.length : 0,
                positionSize: position ? position.length : 0,
                totalSize: (settings?.length || 0) + (textContent?.length || 0) + (position?.length || 0)
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return null;
        }
    }
};