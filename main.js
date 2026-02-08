// Main Module - Application initialization and coordination
// Ties all modules together and manages application lifecycle

const SpeedReaderApp = {
    // Application state
    isInitialized: false,

    // Initialize the application
    initialize: function() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        console.log('Initializing Speed Reader application...');

        // Load settings first
        const settings = SettingsManager.initialize();
        console.log('Settings loaded:', settings);

        // Apply all settings (theme, fonts, etc.)
        SettingsManager.applyAllSettings();
        console.log('Settings applied');

        // Initialize reader engine with settings
        ReaderEngine.initialize(settings);
        console.log('Reader engine initialized');

        // Initialize controls
        ControlsManager.initialize();
        console.log('Controls initialized');

        // Check if text was passed via URL parameter (from bookmarklet)
        const urlText = this.getTextFromUrlParameter();
        if (urlText) {
            console.log('Text received from URL parameter, loading...');
            this.loadTextFromBookmarklet(urlText);
        } else {
            // Try to load previously saved text and position
            this.loadSavedContent();
        }

        // Mark as initialized
        this.isInitialized = true;
        console.log('Speed Reader application ready');
    },

    // Get text from URL parameter (from bookmarklet)
    getTextFromUrlParameter: function() {
        try {
            const urlParameters = new URLSearchParams(window.location.search);
            const encodedText = urlParameters.get('text');
            
            if (encodedText) {
                const decodedText = decodeURIComponent(encodedText);
                console.log('Found text in URL parameter, length:', decodedText.length);
                return decodedText;
            }
        } catch (error) {
            console.error('Error reading URL parameter:', error);
        }
        return null;
    },

    // Load text from bookmarklet
    loadTextFromBookmarklet: function(text) {
        if (!text || text.length === 0) {
            console.warn('No text provided from bookmarklet');
            this.showNoContentState();
            return;
        }

        // Load text into reader (starting from beginning)
        const success = ReaderEngine.loadText(text, 0);

        if (success) {
            console.log('Bookmarklet text loaded successfully');
            
            // Hide no text message
            ControlsManager.hideNoTextMessage();
            
            // Close any open panels
            ControlsManager.closeAllPanels();
            
            // Display paragraph (app starts in paused state)
            ReaderEngine.displayParagraph();
            
            // Show help icon
            ControlsManager.showHelpIcon();
            
            // Clear URL parameter from address bar (optional - keeps URL clean)
            if (window.history && window.history.replaceState) {
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }
        } else {
            console.error('Failed to load bookmarklet text');
            this.showNoContentState();
        }
    },

    // Load saved content from storage
    loadSavedContent: function() {
        const savedText = StorageManager.loadTextContent();
        
        if (savedText && savedText.length > 0) {
            console.log('Found saved text, loading...');
            
            // Load saved reading position
            const savedPosition = StorageManager.loadReadingPosition();
            const startWordIndex = savedPosition.wordIndex || 0;

            // Load text into reader
            const success = ReaderEngine.loadText(savedText, startWordIndex);

            if (success) {
                console.log('Saved text loaded successfully. Position:', startWordIndex);
                
                // Hide no text message
                ControlsManager.hideNoTextMessage();
                
                // Display paragraph (app starts in paused state)
                ReaderEngine.displayParagraph();
                
                // Show help icon (app starts paused)
                ControlsManager.showHelpIcon();
            } else {
                console.error('Failed to load saved text');
                this.showNoContentState();
            }
        } else {
            console.log('No saved text found');
            this.showNoContentState();
        }
    },

    // Show no content state
    showNoContentState: function() {
        ControlsManager.showNoTextMessage();
    },

    // Get application state for debugging
    getAppState: function() {
        return {
            isInitialized: this.isInitialized,
            readerState: ReaderEngine.getCurrentState(),
            settings: SettingsManager.currentSettings,
            hasTextContent: StorageManager.hasTextContent(),
            storageInfo: StorageManager.getStorageInfo()
        };
    },

    // Clear all data and reset application
    resetApplication: function() {
        // Confirm with user
        const confirmed = confirm('This will clear all saved text and reset to default settings. Continue?');
        
        if (!confirmed) {
            return;
        }

        // Stop reading if active
        if (ReaderEngine.isReading) {
            ReaderEngine.pauseReading();
        }

        // Clear all stored data
        StorageManager.clearAllData();

        // Reset settings to defaults
        SettingsManager.resetToDefaults();

        // Reload page to start fresh
        window.location.reload();
    },

    // Export current text (for debugging/backup)
    exportCurrentText: function() {
        const textContent = StorageManager.loadTextContent();
        const position = StorageManager.loadReadingPosition();
        
        return {
            text: textContent,
            position: position,
            settings: SettingsManager.currentSettings,
            exportDate: new Date().toISOString()
        };
    }
};

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting Speed Reader...');
    SpeedReaderApp.initialize();
});

// Handle page visibility changes (pause reading when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && ReaderEngine.isReading) {
        console.log('Tab hidden, pausing reading');
        ReaderEngine.pauseReading();
    }
});

// Save position before page unload
window.addEventListener('beforeunload', function() {
    if (ReaderEngine.allWords && ReaderEngine.allWords.length > 0) {
        ReaderEngine.saveCurrentPosition();
        console.log('Position saved before page unload');
    }
});

// Expose app to global scope for debugging (optional, can be removed in production)
window.SpeedReaderApp = SpeedReaderApp;
window.ReaderEngine = ReaderEngine;
window.StorageManager = StorageManager;
window.TextProcessor = TextProcessor;
window.ControlsManager = ControlsManager;
window.SettingsManager = SettingsManager;