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
    
    // Help elements
    helpIcon: null,
    helpPanel: null,
    closeHelpButton: null,
    
    // Progress detail elements
    progressStats: null,
    progressDetailPanel: null,
    closeProgressDetailButton: null,
    
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
        
        // Help
        this.helpIcon = document.getElementById('helpIcon');
        this.helpPanel = document.getElementById('helpPanel');
        this.closeHelpButton = document.getElementById('closeHelp');
        
        // Progress detail
        this.progressStats = document.getElementById('progressStats');
        this.progressDetailPanel = document.getElementById('progressDetailPanel');
        this.closeProgressDetailButton = document.getElementById('closeProgressDetail');
        
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
        // Control buttons - use both click and touchend for mobile support
        this.addClickAndTouchListener(this.controlCenter, () => this.handleCenterControl());
        this.addClickAndTouchListener(this.controlUp, () => this.handleUpControl());
        this.addClickAndTouchListener(this.controlDown, () => this.handleDownControl());
        this.addClickAndTouchListener(this.controlLeft, () => this.handleLeftControl());
        this.addClickAndTouchListener(this.controlRight, () => this.handleRightControl());

        // Settings
        this.addClickAndTouchListener(this.settingsIcon, () => this.openSettings());
        this.addClickAndTouchListener(this.closeSettingsButton, () => this.closeSettings());

        // Help
        this.addClickAndTouchListener(this.helpIcon, () => this.openHelp());
        this.addClickAndTouchListener(this.closeHelpButton, () => this.closeHelp());

        // Progress detail
        this.addClickAndTouchListener(this.progressStats, () => this.openProgressDetail());
        this.addClickAndTouchListener(this.closeProgressDetailButton, () => this.closeProgressDetail());

        // Text input
        this.addClickAndTouchListener(this.loadTextPrompt, () => this.openTextInput());
        this.addClickAndTouchListener(this.closeTextInputButton, () => this.closeTextInput());
        this.addClickAndTouchListener(this.loadTextButton, () => this.handleLoadText());

        // Keyboard controls
        this.attachKeyboardControls();

        // Click outside to close panels
        this.attachClickOutsideListeners();

        // Prevent default touch behaviors
        this.preventDefaultTouchBehavior();
    },

    // Add both click and touch listeners to support desktop and mobile
    addClickAndTouchListener: function(element, handler) {
        if (!element) return;
        
        element.addEventListener('click', handler);
        element.addEventListener('touchend', (event) => {
            event.preventDefault();
            handler();
        }, { passive: false });
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
        // Close help panel if open
        if (this.helpPanel.classList.contains('visible')) {
            this.closeHelp();
        }
        
        // Load current settings into form using SettingsManager
        SettingsManager.loadSettingsIntoUI();
        
        // Hide both hamburger and help icons
        this.hideHamburgerIcon();
        this.hideHelpIcon();
        
        // Show panel
        this.settingsPanel.classList.remove('hidden');
        this.settingsPanel.classList.add('visible');
    },

    // Close settings panel
    closeSettings: function() {
        this.settingsPanel.classList.remove('visible');
        this.settingsPanel.classList.add('hidden');
        
        // Show both icons again (help icon only if paused)
        this.showHamburgerIcon();
        if (ReaderEngine.isPaused) {
            this.showHelpIcon();
        }
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
            
            // Show help icon (text loaded in paused state)
            this.showHelpIcon();
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
    },

    // Open help panel
    openHelp: function() {
        // Close settings panel if open
        if (this.settingsPanel.classList.contains('visible')) {
            this.closeSettings();
        }
        
        // Hide both hamburger and help icons
        this.hideHamburgerIcon();
        this.hideHelpIcon();
        
        this.helpPanel.classList.remove('hidden');
        this.helpPanel.classList.add('visible');
    },

    // Close help panel
    closeHelp: function() {
        this.helpPanel.classList.remove('visible');
        this.helpPanel.classList.add('hidden');
        
        // Show both icons again (help icon only if paused)
        this.showHamburgerIcon();
        if (ReaderEngine.isPaused) {
            this.showHelpIcon();
        }
    },

    // Show help icon (only when paused)
    showHelpIcon: function() {
        if (this.helpIcon) {
            this.helpIcon.classList.remove('hidden');
        }
    },

    // Hide help icon (when reading)
    hideHelpIcon: function() {
        if (this.helpIcon) {
            this.helpIcon.classList.add('hidden');
        }
    },

    // Hide hamburger menu (when settings panel is open)
    hideHamburgerIcon: function() {
        if (this.settingsIcon) {
            this.settingsIcon.classList.add('hidden-by-panel');
        }
    },

    // Show hamburger menu (when settings panel closes)
    showHamburgerIcon: function() {
        if (this.settingsIcon) {
            this.settingsIcon.classList.remove('hidden-by-panel');
        }
    },

    // Attach click outside listeners to close panels
    attachClickOutsideListeners: function() {
        document.addEventListener('click', (event) => {
            // Check if settings panel is open
            if (this.settingsPanel.classList.contains('visible')) {
                // If click is outside settings panel and not on settings icon, close it
                if (!this.settingsPanel.contains(event.target) && 
                    !this.settingsIcon.contains(event.target)) {
                    this.closeSettings();
                }
            }

            // Check if help panel is open
            if (this.helpPanel.classList.contains('visible')) {
                // If click is outside help panel and not on help icon, close it
                if (!this.helpPanel.contains(event.target) && 
                    !this.helpIcon.contains(event.target)) {
                    this.closeHelp();
                }
            }

            // Check if progress detail panel is open
            if (this.progressDetailPanel.classList.contains('visible')) {
                // If click is outside progress detail panel and not on progress stats, close it
                if (!this.progressDetailPanel.contains(event.target) && 
                    !this.progressStats.contains(event.target)) {
                    this.closeProgressDetail();
                }
            }
        });

        // Also handle touch events for mobile
        document.addEventListener('touchend', (event) => {
            // Check if settings panel is open
            if (this.settingsPanel.classList.contains('visible')) {
                // If touch is outside settings panel and not on settings icon, close it
                if (!this.settingsPanel.contains(event.target) && 
                    !this.settingsIcon.contains(event.target)) {
                    this.closeSettings();
                }
            }

            // Check if help panel is open
            if (this.helpPanel.classList.contains('visible')) {
                // If touch is outside help panel and not on help icon, close it
                if (!this.helpPanel.contains(event.target) && 
                    !this.helpIcon.contains(event.target)) {
                    this.closeHelp();
                }
            }

            // Check if progress detail panel is open
            if (this.progressDetailPanel.classList.contains('visible')) {
                // If touch is outside progress detail panel and not on progress stats, close it
                if (!this.progressDetailPanel.contains(event.target) && 
                    !this.progressStats.contains(event.target)) {
                    this.closeProgressDetail();
                }
            }
        });
    },

    // Open progress detail panel
    openProgressDetail: function() {
        if (!ReaderEngine.currentProgressDetails) {
            return;
        }

        // Populate detail panel with current progress info
        document.getElementById('progressDetailLine1').textContent = ReaderEngine.currentProgressDetails.wordText;
        document.getElementById('progressDetailLine2').textContent = ReaderEngine.currentProgressDetails.percentText;
        document.getElementById('progressDetailLine3').textContent = ReaderEngine.currentProgressDetails.timeText;

        // Show panel
        this.progressDetailPanel.classList.remove('hidden');
        this.progressDetailPanel.classList.add('visible');
    },

    // Close progress detail panel
    closeProgressDetail: function() {
        this.progressDetailPanel.classList.remove('visible');
        this.progressDetailPanel.classList.add('hidden');
    },

    // Close all panels (settings, help, text input, progress detail)
    closeAllPanels: function() {
        if (this.settingsPanel.classList.contains('visible')) {
            this.closeSettings();
        }
        if (this.helpPanel.classList.contains('visible')) {
            this.closeHelp();
        }
        if (this.textInputPanel.classList.contains('visible')) {
            this.closeTextInput();
        }
        if (this.progressDetailPanel.classList.contains('visible')) {
            this.closeProgressDetail();
        }
    }
};
