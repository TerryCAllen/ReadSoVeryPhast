// Storage Module - Handles all LocalStorage operations
// Manages persistence of settings, text content, and reading position

const StorageManager = {
    // Storage keys
    KEYS: {
        SETTINGS: 'speedReader_settings',
        TEXT_CONTENT: 'speedReader_textContent',
        READING_POSITION: 'speedReader_readingPosition'
    },

    // Default settings
    DEFAULT_SETTINGS: {
        wordsPerMinute: 200,
        wordsPerMinuteIncrement: 5,
        theme: 'dark',
        wordFontSize: 80,
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

    // Save text content to LocalStorage
    saveTextContent: function(textContent) {
        try {
            localStorage.setItem(this.KEYS.TEXT_CONTENT, textContent);
            return true;
        } catch (error) {
            console.error('Failed to save text content:', error);
            return false;
        }
    },

    // Load text content from LocalStorage
    loadTextContent: function() {
        try {
            const textContent = localStorage.getItem(this.KEYS.TEXT_CONTENT);
            return textContent || '';
        } catch (error) {
            console.error('Failed to load text content:', error);
            return '';
        }
    },

    // Save reading position to LocalStorage
    saveReadingPosition: function(position) {
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

    // Load reading position from LocalStorage
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