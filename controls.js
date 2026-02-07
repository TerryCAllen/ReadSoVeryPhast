// Controls Module - Handles UI controls and touch interactions
// Manages control buttons, settings panel, and text input

const ControlsManager = {
    // Control elements
    controlUp: null,
    controlDown: null,
    controlLeft: null,
    controlRight: null,
    controlCenter: null,
    
    // Settings elements
    settingsIcon: null,
    settingsPanel: null,
    closeSettingsButton: null,
    
    // Text input elements
    textInputPanel: null,
    closeTextInputButton: null,
    loadTextButton: null,
    textInputArea: null,
    loadTextPrompt: null,
    noTextMessage: null,

    // Initialize controls
    initialize: function() {
        this.setupControlElements();
        this.attachEventListeners();
    },

    // Set up control element references
    setupControlElements: function() {
        // Touch controls
        this.controlUp = document.getElementById('controlUp');
        this.controlDown = document.getElementById('controlDown');
        this.controlLeft = document.getElementById('controlLeft');
        this.controlRight = document.getElementById('controlRight');
        this.controlCenter = document.getElementById('controlCenter');
        
        // Settings
        this.settingsIcon = document.getElementById('settingsIcon');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettingsButton = document.getElementById('closeSettings');
        
        // Text input
        this.textInputPanel = document.getElementById('textInputPanel');
        this.closeTextInputButton = document.getElementById('closeTextInput');
        this.loadTextButton = document.getElementById('loadTextButton');
        this.textInputArea = document.getElementById('textInputArea');
        this.loadTextPrompt = document.getElementById('loadTextPrompt');
        this.noTextMessage = document.getElementById('noTextMessage');
    },

    // Attach all event listeners
    attachEventListeners: function() {
        // Control buttons
        this.controlCenter.addEventListener('click', () => this.handleCenterControl());
        this.controlUp.addEventListener('click', () => this.handleUpControl());
        this.controlDown.addEventListener('click', () => this.handleDownControl());
        this.controlLeft.addEventListener('click', () => this.handleLeftControl());
        this.controlRight.addEventListener('click', () => this.handleRightControl());

        // Settings
        this.settingsIcon.addEventListener('click', () => this.openSettings());
        this.closeSettingsButton.addEventListener('click', () => this.closeSettings());

        // Text input
        this.loadTextPrompt.addEventListener('click', () => this.openTextInput());
        this.closeTextInputButton.addEventListener('click', () => this.closeTextInput());
        this.loadTextButton.addEventListener('click', () => this.handleLoadText());

        // Keyboard controls
        this.attachKeyboardControls();

        // Prevent default touch behaviors
        this.preventDefaultTouchBehavior();
    },

    // Attach keyboard event listeners
    attachKeyboardControls: function() {
        document.addEventListener('keydown', (event) => {
            // Don't intercept keys when typing in input fields
            if (event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA' || 
                event.target.tagName === 'SELECT') {
                return;
            }

            // Don't intercept keys when settings or text input panel is open
            if (!this.settingsPanel.classList.contains('hidden') || 
                !this.textInputPanel.classList.contains('hidden')) {
                return;
            }

            switch(event.key) {
                case ' ':
                case 'Spacebar': // For older browsers
                    event.preventDefault();
                    this.handleCenterControl();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.handleUpControl();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.handleDownControl();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.handleLeftControl();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.handleRightControl();
                    break;
            }
        });
    },

    // Handle center control (play/pause)
    handleCenterControl: function() {
        ReaderEngine.toggleReading();
    },

    // Handle up control
    handleUpControl: function() {
        if (ReaderEngine.isReading) {
            // While reading: increase speed
            ReaderEngine.increaseSpeed();
        } else {
            // While paused: scroll up in paragraph
            this.scrollParagraphUp();
        }
    },

    // Handle down control
    handleDownControl: function() {
        if (ReaderEngine.isReading) {
            // While reading: decrease speed
            ReaderEngine.decreaseSpeed();
        } else {
            // While paused: scroll down in paragraph
            this.scrollParagraphDown();
        }
    },

    // Handle left control
    handleLeftControl: function() {
        if (ReaderEngine.isReading) {
            // While reading: jump to sentence start
            ReaderEngine.jumpToSentenceStart();
        } else {
            // While paused: navigate to previous sentence
            ReaderEngine.navigateToPreviousSentence();
        }
    },

    // Handle right control
    handleRightControl: function() {
        if (ReaderEngine.isReading) {
            // While reading: skip to next sentence
            ReaderEngine.skipToNextSentence();
        } else {
            // While paused: navigate to next sentence
            ReaderEngine.navigateToNextSentence();
        }
    },

    // Scroll paragraph display up
    scrollParagraphUp: function() {
        const paragraphDisplay = document.getElementById('paragraphDisplay');
        if (paragraphDisplay) {
            paragraphDisplay.scrollBy({
                top: -100,
                behavior: 'smooth'
            });
        }
    },

    // Scroll paragraph display down
    scrollParagraphDown: function() {
        const paragraphDisplay = document.getElementById('paragraphDisplay');
        if (paragraphDisplay) {
            paragraphDisplay.scrollBy({
                top: 100,
                behavior: 'smooth'
            });
        }
    },

    // Open settings panel
    openSettings: function() {
        // Load current settings into form using SettingsManager
        SettingsManager.loadSettingsIntoUI();
        
        // Show panel
        this.settingsPanel.classList.remove('hidden');
        this.settingsPanel.classList.add('visible');
    },

    // Close settings panel
    closeSettings: function() {
        this.settingsPanel.classList.remove('visible');
        this.settingsPanel.classList.add('hidden');
    },

    // Open text input panel
    openTextInput: function() {
        // Clear previous text
        this.textInputArea.value = '';
        
        // Show panel
        this.textInputPanel.classList.remove('hidden');
        this.textInputPanel.classList.add('visible');
        
        // Focus on textarea
        setTimeout(() => this.textInputArea.focus(), 100);
    },

    // Close text input panel
    closeTextInput: function() {
        this.textInputPanel.classList.remove('visible');
        this.textInputPanel.classList.add('hidden');
    },

    // Handle load text action
    handleLoadText: function() {
        const rawText = this.textInputArea.value.trim();
        
        if (!rawText) {
            alert('Please paste some text to read.');
            return;
        }

        // Save text to storage
        StorageManager.saveTextContent(rawText);
        
        // Reset reading position
        StorageManager.saveReadingPosition({
            wordIndex: 0,
            sentenceIndex: 0,
            paragraphIndex: 0
        });

        // Load text into reader
        const success = ReaderEngine.loadText(rawText, 0);
        
        if (success) {
            // Hide no text message
            this.noTextMessage.classList.add('hidden');
            
            // Close text input panel
            this.closeTextInput();
            
            // Show paragraph display (paused state)
            ReaderEngine.displayParagraph();
        } else {
            alert('Failed to load text. Please try again.');
        }
    },

    // Prevent default touch behaviors to avoid scrolling/zooming
    preventDefaultTouchBehavior: function() {
        const controlsArea = document.getElementById('controlsArea');
        
        if (controlsArea) {
            controlsArea.addEventListener('touchstart', (event) => {
                event.preventDefault();
            }, { passive: false });
            
            controlsArea.addEventListener('touchmove', (event) => {
                event.preventDefault();
            }, { passive: false });
        }
    },

    // Show no text message
    showNoTextMessage: function() {
        this.noTextMessage.classList.remove('hidden');
    },

    // Hide no text message
    hideNoTextMessage: function() {
        this.noTextMessage.classList.add('hidden');
    }
};