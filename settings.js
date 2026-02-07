// Settings Module - Handles settings management and persistence
// Manages user preferences and settings UI

const SettingsManager = {
    // Current settings
    currentSettings: null,

    // Initialize settings
    initialize: function() {
        const settings = this.loadSettings();
        this.attachEventListeners();
        return settings;
    },

    // Load settings from storage
    loadSettings: function() {
        this.currentSettings = StorageManager.loadSettings();
        return this.currentSettings;
    },

    // Attach event listeners for settings UI
    attachEventListeners: function() {
        const saveButton = document.getElementById('saveSettings');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.handleSaveSettings());
        }

        const loadNewTextButton = document.getElementById('loadNewTextButton');
        if (loadNewTextButton) {
            loadNewTextButton.addEventListener('click', () => this.handleLoadNewText());
        }
    },

    // Handle save settings button click
    handleSaveSettings: function() {
        const wpmInput = document.getElementById('wpmSetting');
        const wpmIncrementInput = document.getElementById('wpmIncrementSetting');
        const wordFontSizeInput = document.getElementById('wordFontSizeSetting');
        const paragraphFontSizeInput = document.getElementById('paragraphFontSizeSetting');
        const themeSelect = document.getElementById('themeToggle');

        if (!wpmInput || !wpmIncrementInput || !wordFontSizeInput || !paragraphFontSizeInput || !themeSelect) {
            console.error('Settings input elements not found');
            return;
        }

        // Get values from inputs
        const newWordsPerMinute = parseInt(wpmInput.value, 10);
        const newWordsPerMinuteIncrement = parseInt(wpmIncrementInput.value, 10);
        const newWordFontSize = parseInt(wordFontSizeInput.value, 10);
        const newParagraphFontSize = parseInt(paragraphFontSizeInput.value, 10);
        const newTheme = themeSelect.value;

        // Validate inputs
        if (isNaN(newWordsPerMinute) || newWordsPerMinute < 50 || newWordsPerMinute > 1000) {
            alert('Words Per Minute must be between 50 and 1000');
            return;
        }

        if (isNaN(newWordsPerMinuteIncrement) || newWordsPerMinuteIncrement < 1 || newWordsPerMinuteIncrement > 100) {
            alert('WPM Increment must be between 1 and 100');
            return;
        }

        if (isNaN(newWordFontSize) || newWordFontSize < 40 || newWordFontSize > 150) {
            alert('Word Font Size must be between 40 and 150');
            return;
        }

        if (isNaN(newParagraphFontSize) || newParagraphFontSize < 12 || newParagraphFontSize > 24) {
            alert('Paragraph Font Size must be between 12 and 24');
            return;
        }

        // Update settings
        this.currentSettings.wordsPerMinute = newWordsPerMinute;
        this.currentSettings.wordsPerMinuteIncrement = newWordsPerMinuteIncrement;
        this.currentSettings.wordFontSize = newWordFontSize;
        this.currentSettings.paragraphFontSize = newParagraphFontSize;
        this.currentSettings.theme = newTheme;

        // Save to storage
        const success = StorageManager.saveSettings(this.currentSettings);

        if (success) {
            // Apply all settings
            this.applyAllSettings();

            // Close settings panel
            const closeButton = document.getElementById('closeSettings');
            if (closeButton) {
                closeButton.click();
            }

            // Show success feedback
            this.showSettingsSavedFeedback();
        } else {
            alert('Failed to save settings. Please try again.');
        }
    },

    // Apply current settings to reader engine
    applySettingsToReader: function() {
        ReaderEngine.wordsPerMinute = this.currentSettings.wordsPerMinute;
        ReaderEngine.wordsPerMinuteIncrement = this.currentSettings.wordsPerMinuteIncrement;
        ReaderEngine.updateSpeedDisplay();
    },

    // Apply all settings (theme, fonts, etc.)
    applyAllSettings: function() {
        // Apply to reader engine
        this.applySettingsToReader();

        // Apply theme
        this.applyTheme(this.currentSettings.theme);

        // Apply font sizes
        this.applyFontSizes(this.currentSettings.wordFontSize, this.currentSettings.paragraphFontSize);
    },

    // Apply theme
    applyTheme: function(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    },

    // Apply font sizes
    applyFontSizes: function(wordFontSize, paragraphFontSize) {
        const currentWordElement = document.getElementById('currentWord');
        const paragraphContentElement = document.getElementById('paragraphContent');

        if (currentWordElement) {
            currentWordElement.style.fontSize = `${wordFontSize}px`;
        }

        if (paragraphContentElement) {
            paragraphContentElement.style.fontSize = `${paragraphFontSize}px`;
        }
    },

    // Handle load new text button click
    handleLoadNewText: function() {
        const confirmed = confirm('Loading new text will clear your current reading position. Continue?');
        
        if (!confirmed) {
            return;
        }

        // Clear current text and position
        StorageManager.clearTextData();

        // Close settings panel
        const closeSettingsButton = document.getElementById('closeSettings');
        if (closeSettingsButton) {
            closeSettingsButton.click();
        }

        // Open text input panel
        setTimeout(() => {
            ControlsManager.openTextInput();
        }, 300);
    },

    // Load settings into UI inputs
    loadSettingsIntoUI: function() {
        const wpmInput = document.getElementById('wpmSetting');
        const wpmIncrementInput = document.getElementById('wpmIncrementSetting');
        const wordFontSizeInput = document.getElementById('wordFontSizeSetting');
        const paragraphFontSizeInput = document.getElementById('paragraphFontSizeSetting');
        const themeSelect = document.getElementById('themeToggle');

        if (wpmInput) {
            wpmInput.value = this.currentSettings.wordsPerMinute;
        }
        if (wpmIncrementInput) {
            wpmIncrementInput.value = this.currentSettings.wordsPerMinuteIncrement;
        }
        if (wordFontSizeInput) {
            wordFontSizeInput.value = this.currentSettings.wordFontSize;
        }
        if (paragraphFontSizeInput) {
            paragraphFontSizeInput.value = this.currentSettings.paragraphFontSize;
        }
        if (themeSelect) {
            themeSelect.value = this.currentSettings.theme;
        }
    },

    // Show settings saved feedback
    showSettingsSavedFeedback: function() {
        // Brief visual feedback that settings were saved
        const saveButton = document.getElementById('saveSettings');
        if (saveButton) {
            const originalText = saveButton.textContent;
            saveButton.textContent = 'Saved!';
            
            setTimeout(() => {
                saveButton.textContent = originalText;
            }, 1500);
        }
    },

    // Get current setting value
    getSetting: function(settingName) {
        return this.currentSettings[settingName];
    },

    // Update a single setting
    updateSetting: function(settingName, settingValue) {
        this.currentSettings[settingName] = settingValue;
        StorageManager.saveSettings(this.currentSettings);
    },

    // Reset settings to defaults
    resetToDefaults: function() {
        this.currentSettings = { ...StorageManager.DEFAULT_SETTINGS };
        StorageManager.saveSettings(this.currentSettings);
        this.applySettingsToReader();
        
        // Update UI
        const wpmInput = document.getElementById('wpmSetting');
        const wpmIncrementInput = document.getElementById('wpmIncrementSetting');
        
        if (wpmInput) {
            wpmInput.value = this.currentSettings.wordsPerMinute;
        }
        if (wpmIncrementInput) {
            wpmIncrementInput.value = this.currentSettings.wordsPerMinuteIncrement;
        }
    }
};