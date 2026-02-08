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

        console.log('Initializing Read So Very Phast application...');

        // Load settings first
        const settings = SettingsManager.initialize();
        console.log('Settings loaded:', settings);

        // Apply all settings (theme, fonts, etc.)
        SettingsManager.applyAllSettings();
        console.log('Settings applied');

        // Initialize library manager
        LibraryManager.initialize();
        console.log('Library initialized');

        // Migrate old storage format if needed
        LibraryManager.migrateOldStorage();

        // Initialize reader engine with settings
        ReaderEngine.initialize(settings);
        console.log('Reader engine initialized');

        // Initialize controls
        ControlsManager.initialize();
        console.log('Controls initialized');

        // Check if text was imported via URL hash (from bookmarklet) - prioritize this
        const hashText = this.getTextFromUrlHash();
        if (hashText) {
            console.log('Text received from URL hash, loading...');
            this.loadTextFromBookmarklet(hashText);
        } else {
            // Check if text was imported via localStorage (legacy support)
            const importedText = this.getTextFromLocalStorage();
            if (importedText) {
                console.log('Text received from localStorage import, loading...');
                this.loadTextFromBookmarklet(importedText);
            } else {
                // Check if text was passed via URL parameter (legacy bookmarklet support)
                const urlText = this.getTextFromUrlParameter();
                if (urlText) {
                    console.log('Text received from URL parameter, loading...');
                    this.loadTextFromBookmarklet(urlText);
                } else {
                    // Try to load previously saved content from library
                    this.loadSavedContent();
                }
            }
        }

        // Mark as initialized
        this.isInitialized = true;
        console.log('Read So Very Phast application ready');
    },

    // Get text from URL hash (from bookmarklet) - method for large content
    getTextFromUrlHash: function() {
        try {
            const hash = window.location.hash;
            
            if (hash && hash.startsWith('#text=')) {
                const encodedText = hash.substring(6); // Remove '#text='
                
                // Decode the base64-encoded text
                const decodedText = decodeURIComponent(atob(encodedText));
                
                console.log('Found text in URL hash, length:', decodedText.length);
                
                // Clear the hash from the URL
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
                
                return decodedText;
            }
        } catch (error) {
            console.error('Error reading text from URL hash:', error);
        }
        return null;
    },

    // Get text from localStorage (from bookmarklet) - legacy support
    getTextFromLocalStorage: function() {
        try {
            const importedText = localStorage.getItem('speedReader_importedText');
            
            if (importedText) {
                console.log('Found text in localStorage, length:', importedText.length);
                
                // Clear the imported text from localStorage after reading
                localStorage.removeItem('speedReader_importedText');
                
                return importedText;
            }
        } catch (error) {
            console.error('Error reading imported text from localStorage:', error);
        }
        return null;
    },

    // Get text from URL parameter (from bookmarklet) - legacy support
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

        // Save as temporary text (unsaved until user clicks save button)
        LibraryManager.saveTempText(text, { wordIndex: 0, sentenceIndex: 0, paragraphIndex: 0 });

        // Load text into reader (starting from beginning)
        const success = ReaderEngine.loadText(text, 0);

        if (success) {
            console.log('Bookmarklet text loaded successfully (unsaved)');
            
            // Hide no text message
            ControlsManager.hideNoTextMessage();
            
            // Close any open panels
            ControlsManager.closeAllPanels();
            
            // Show save icon (this is unsaved text)
            ControlsManager.showSaveIcon();
            
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

    // Load saved content from library
    loadSavedContent: function() {
        // Check if there's an active document in the library
        if (LibraryManager.activeDocumentId) {
            const activeDocument = LibraryManager.getDocument(LibraryManager.activeDocumentId);
            
            if (activeDocument) {
                console.log('Loading active document from library:', activeDocument.title);
                
                const success = ReaderEngine.loadText(activeDocument.textContent, activeDocument.position.wordIndex);
                
                if (success) {
                    console.log('Active document loaded successfully');
                    
                    // Hide no text message
                    ControlsManager.hideNoTextMessage();
                    
                    // Hide save icon (this is a saved document)
                    ControlsManager.hideSaveIcon();
                    
                    // Display paragraph (app starts in paused state)
                    ReaderEngine.displayParagraph();
                    
                    // Show help icon
                    ControlsManager.showHelpIcon();
                    
                    return;
                }
            }
        }
        
        // Check if there are any documents in the library
        const library = LibraryManager.getLibrarySortedByRecent();
        
        if (library.length > 0) {
            // Load most recent document
            const mostRecentDocument = library[0];
            console.log('Loading most recent document:', mostRecentDocument.title);
            
            LibraryManager.saveActiveDocumentId(mostRecentDocument.id);
            
            const success = ReaderEngine.loadText(mostRecentDocument.textContent, mostRecentDocument.position.wordIndex);
            
            if (success) {
                console.log('Most recent document loaded successfully');
                
                // Hide no text message
                ControlsManager.hideNoTextMessage();
                
                // Hide save icon (this is a saved document)
                ControlsManager.hideSaveIcon();
                
                // Display paragraph (app starts in paused state)
                ReaderEngine.displayParagraph();
                
                // Show help icon
                ControlsManager.showHelpIcon();
                
                return;
            }
        }
        
        // No documents found
        console.log('No documents in library');
        this.showNoContentState();
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
window.LibraryManager = LibraryManager;
window.TextProcessor = TextProcessor;
window.ControlsManager = ControlsManager;
window.SettingsManager = SettingsManager;
