// Controls Module - Handles UI controls and touch interactions
// Manages control buttons, settings panel, and text input

const ControlsManager = {
    // Control elements
    controlUp: null,
    controlDown: null,
    controlLeft: null,
    controlRight: null,
    controlCenter: null,
    controlPageUp: null,
    controlPageDown: null,
    
    // Settings elements
    settingsIcon: null,
    settingsPanel: null,
    closeSettingsButton: null,
    
    // Help elements
    helpIcon: null,
    helpPanel: null,
    closeHelpButton: null,
    
    // Search elements
    searchIcon: null,
    searchPanel: null,
    closeSearchButton: null,
    searchInput: null,
    searchButton: null,
    searchResultsList: null,
    searchNoResults: null,
    searchPrompt: null,
    
    // Save icon element
    saveIcon: null,
    
    // Library elements
    libraryPanel: null,
    closeLibraryButton: null,
    myLibraryButton: null,
    
    // Save to library elements
    saveToLibraryPanel: null,
    closeSaveToLibraryButton: null,
    saveToLibraryButton: null,
    documentTitleInput: null,
    
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
    
    // Document title element
    documentTitle: null,

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
        this.controlPageUp = document.getElementById('controlPageUp');
        this.controlPageDown = document.getElementById('controlPageDown');
        
        // Settings
        this.settingsIcon = document.getElementById('settingsIcon');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettingsButton = document.getElementById('closeSettings');
        
        // Help
        this.helpIcon = document.getElementById('helpIcon');
        this.helpPanel = document.getElementById('helpPanel');
        this.closeHelpButton = document.getElementById('closeHelp');
        
        // Search
        this.searchIcon = document.getElementById('searchIcon');
        this.searchPanel = document.getElementById('searchPanel');
        this.closeSearchButton = document.getElementById('closeSearch');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.searchNoResults = document.getElementById('searchNoResults');
        this.searchPrompt = document.getElementById('searchPrompt');
        
        // Save icon
        this.saveIcon = document.getElementById('saveIcon');
        
        // Library
        this.libraryPanel = document.getElementById('libraryPanel');
        this.closeLibraryButton = document.getElementById('closeLibrary');
        this.myLibraryButton = document.getElementById('myLibraryButton');
        
        // Save to library
        this.saveToLibraryPanel = document.getElementById('saveToLibraryPanel');
        this.closeSaveToLibraryButton = document.getElementById('closeSaveToLibrary');
        this.saveToLibraryButton = document.getElementById('saveToLibraryButton');
        this.documentTitleInput = document.getElementById('documentTitleInput');
        
        // Progress detail (now using combined stats)
        this.progressStats = document.getElementById('combinedStats');
        this.progressDetailPanel = document.getElementById('progressDetailPanel');
        this.closeProgressDetailButton = document.getElementById('closeProgressDetail');
        
        // Text input
        this.textInputPanel = document.getElementById('textInputPanel');
        this.closeTextInputButton = document.getElementById('closeTextInput');
        this.loadTextButton = document.getElementById('loadTextButton');
        this.textInputArea = document.getElementById('textInputArea');
        this.loadTextPrompt = document.getElementById('loadTextPrompt');
        this.noTextMessage = document.getElementById('noTextMessage');
        
        // Document title
        this.documentTitle = document.getElementById('documentTitle');
    },

    // Attach all event listeners
    attachEventListeners: function() {
        // Control buttons - use both click and touchend for mobile support
        this.addClickAndTouchListener(this.controlCenter, () => this.handleCenterControl());
        this.addClickAndTouchListener(this.controlUp, () => this.handleUpControl());
        this.addClickAndTouchListener(this.controlDown, () => this.handleDownControl());
        this.addClickAndTouchListener(this.controlLeft, () => this.handleLeftControl());
        this.addClickAndTouchListener(this.controlRight, () => this.handleRightControl());
        this.addClickAndTouchListener(this.controlPageUp, () => this.handlePageUpControl());
        this.addClickAndTouchListener(this.controlPageDown, () => this.handlePageDownControl());

        // Settings
        this.addClickAndTouchListener(this.settingsIcon, () => this.openSettings());
        this.addClickAndTouchListener(this.closeSettingsButton, () => this.closeSettings());

        // Help
        this.addClickAndTouchListener(this.helpIcon, () => this.openHelp());
        this.addClickAndTouchListener(this.closeHelpButton, () => this.closeHelp());
        
        // Save icon
        this.addClickAndTouchListener(this.saveIcon, () => this.openSaveToLibrary());
        
        // Search
        this.addClickAndTouchListener(this.searchIcon, () => this.openSearch());
        this.addClickAndTouchListener(this.closeSearchButton, () => this.closeSearch());
        this.addClickAndTouchListener(this.searchButton, () => this.performSearch());
        
        // Search input - enable button when text entered
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                const hasText = this.searchInput.value.trim().length > 0;
                this.searchButton.disabled = !hasText;
            });
            
            // Allow Enter key to search
            this.searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !this.searchButton.disabled) {
                    this.performSearch();
                }
            });
        }
        
        // Library
        this.addClickAndTouchListener(this.myLibraryButton, () => this.openLibrary());
        this.addClickAndTouchListener(this.closeLibraryButton, () => this.closeLibrary());
        
        // Save to library
        this.addClickAndTouchListener(this.closeSaveToLibraryButton, () => this.closeSaveToLibrary());
        this.addClickAndTouchListener(this.saveToLibraryButton, () => this.handleSaveToLibrary());

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
                case 'PageUp':
                    event.preventDefault();
                    this.handlePageUpControl();
                    break;
                case 'PageDown':
                    event.preventDefault();
                    this.handlePageDownControl();
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

    // Handle page up control (paused only)
    handlePageUpControl: function() {
        if (ReaderEngine.isPaused) {
            ReaderEngine.navigateToPreviousParagraph();
        }
    },

    // Handle page down control (paused only)
    handlePageDownControl: function() {
        if (ReaderEngine.isPaused) {
            ReaderEngine.navigateToNextParagraph();
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

        // Save as temp text (unsaved - will show save icon)
        LibraryManager.saveTempText(rawText, 0);
        
        // Load text into reader
        const success = ReaderEngine.loadText(rawText, 0);
        
        if (success) {
            // Hide no text message
            this.noTextMessage.classList.add('hidden');
            
            // Close text input panel
            this.closeTextInput();
            
            // Show save icon (unsaved text from textbox)
            this.showSaveIcon();
            
            // Update document title
            this.updateDocumentTitle('Unsaved Text');
            
            // Show paragraph display (paused state)
            ReaderEngine.displayParagraph();
            
            // Show help and search icons (text loaded in paused state)
            this.showHelpIcon();
            this.showSearchIcon();
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

        // Populate detail panel with current progress info (including WPM)
        document.getElementById('progressDetailLine1').textContent = ReaderEngine.currentProgressDetails.wordText;
        document.getElementById('progressDetailLine2').textContent = ReaderEngine.currentProgressDetails.percentText;
        document.getElementById('progressDetailLine3').textContent = ReaderEngine.currentProgressDetails.timeText;
        document.getElementById('progressDetailLine4').textContent = ReaderEngine.currentProgressDetails.wpmText;

        // Show panel
        this.progressDetailPanel.classList.remove('hidden');
        this.progressDetailPanel.classList.add('visible');
    },

    // Close progress detail panel
    closeProgressDetail: function() {
        this.progressDetailPanel.classList.remove('visible');
        this.progressDetailPanel.classList.add('hidden');
    },

    // Close all panels (settings, help, text input, progress detail, library, save to library)
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
        if (this.libraryPanel.classList.contains('visible')) {
            this.closeLibrary();
        }
        if (this.saveToLibraryPanel.classList.contains('visible')) {
            this.closeSaveToLibrary();
        }
    },

    // Show save icon (when unsaved text is loaded)
    showSaveIcon: function() {
        if (this.saveIcon) {
            this.saveIcon.classList.remove('hidden');
        }
    },

    // Hide save icon (when no unsaved text)
    hideSaveIcon: function() {
        if (this.saveIcon) {
            this.saveIcon.classList.add('hidden');
        }
    },

    // Open library panel
    openLibrary: function() {
        // Close settings if open
        if (this.settingsPanel.classList.contains('visible')) {
            this.closeSettings();
        }

        // Populate library list
        this.populateLibraryList();

        // Show panel
        this.libraryPanel.classList.remove('hidden');
        this.libraryPanel.classList.add('visible');
    },

    // Close library panel
    closeLibrary: function() {
        this.libraryPanel.classList.remove('visible');
        this.libraryPanel.classList.add('hidden');
    },

    // Populate library list with documents
    populateLibraryList: function() {
        const libraryList = document.getElementById('libraryList');
        const libraryEmpty = document.getElementById('libraryEmpty');
        const storagePercent = document.getElementById('storagePercent');
        const storageDocCount = document.getElementById('storageDocCount');

        // Get sorted library (most recent first)
        const documents = LibraryManager.getLibrarySortedByRecent();

        // Clear current list
        libraryList.innerHTML = '';

        // Show empty message if no documents
        if (documents.length === 0) {
            libraryEmpty.classList.remove('hidden');
        } else {
            libraryEmpty.classList.add('hidden');

            // Create list items for each document
            documents.forEach(document => {
                const listItem = this.createLibraryListItem(document);
                libraryList.appendChild(listItem);
            });
        }

        // Update storage usage
        const usage = LibraryManager.getStorageUsage();
        if (usage) {
            storagePercent.textContent = Math.round(usage.usagePercent);
            storageDocCount.textContent = usage.documentCount;
        }
    },

    // Create library list item element
    createLibraryListItem: function(libraryDocument) {
        const listItem = document.createElement('div');
        listItem.className = 'library-item';
        listItem.dataset.documentId = libraryDocument.id;

        // Calculate document size
        const docSize = this.formatDocumentSize(libraryDocument.textContent);

        // Calculate progress percentage
        const totalWords = libraryDocument.textContent.split(/\s+/).length;
        const progressPercent = totalWords > 0 ? Math.round((libraryDocument.position.wordIndex / totalWords) * 100) : 0;

        // Format last read time
        const lastReadDate = new Date(libraryDocument.lastRead);
        const now = new Date();
        const diffMs = now - lastReadDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo;
        if (diffMins < 1) {
            timeAgo = 'Just now';
        } else if (diffMins < 60) {
            timeAgo = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }

        listItem.innerHTML = `
            <div class="library-item-content">
                <div class="library-item-title">${this.escapeHtml(libraryDocument.title)}</div>
                <div class="library-item-meta">${docSize} • ${progressPercent}% complete • ${timeAgo}</div>
            </div>
            <button class="library-item-delete" data-document-id="${libraryDocument.id}">×</button>
        `;

        // Add click handler for switching to document
        const contentArea = listItem.querySelector('.library-item-content');
        this.addClickAndTouchListener(contentArea, () => {
            this.handleSwitchToDocument(libraryDocument.id);
        });

        // Add click handler for delete button
        const deleteButton = listItem.querySelector('.library-item-delete');
        this.addClickAndTouchListener(deleteButton, (event) => {
            event.stopPropagation();
            this.handleDeleteDocument(libraryDocument.id);
        });

        return listItem;
    },

    // Escape HTML to prevent XSS
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Handle switching to a document
    handleSwitchToDocument: function(documentId) {
        const document = LibraryManager.getDocument(documentId);
        
        if (!document) {
            alert('Document not found.');
            return;
        }

        // Set as active document
        LibraryManager.saveActiveDocumentId(documentId);

        // Load document into reader
        const success = ReaderEngine.loadText(document.textContent, document.position.wordIndex);

        if (success) {
            // Close library panel
            this.closeLibrary();

            // Hide save icon (this is a saved document)
            this.hideSaveIcon();
            
            // Update document title
            this.updateDocumentTitle(document.title);

            // Show paragraph display
            ReaderEngine.displayParagraph();

            // Show help icon
            this.showHelpIcon();
        } else {
            alert('Failed to load document.');
        }
    },

    // Handle deleting a document
    handleDeleteDocument: function(documentId) {
        const document = LibraryManager.getDocument(documentId);
        
        if (!document) {
            return;
        }

        const confirmed = confirm(`Delete "${document.title}"?`);
        
        if (!confirmed) {
            return;
        }

        const success = LibraryManager.deleteDocument(documentId);

        if (success) {
            // Refresh library list
            this.populateLibraryList();

            // If this was the active document, we need to clear the reader
            if (LibraryManager.activeDocumentId === documentId) {
                // Check if there are other documents to switch to
                const remainingDocuments = LibraryManager.getLibrarySortedByRecent();
                
                if (remainingDocuments.length > 0) {
                    // Switch to most recent document
                    this.handleSwitchToDocument(remainingDocuments[0].id);
                } else {
                    // No documents left, show empty state
                    this.closeLibrary();
                    this.showNoTextMessage();
                }
            }
        } else {
            alert('Failed to delete document.');
        }
    },

    // Open save to library panel
    openSaveToLibrary: function() {
        // Generate title from current temp text
        const tempData = LibraryManager.loadTempText();
        const suggestedTitle = LibraryManager.generateTitle(tempData.textContent);

        // Pre-populate title input
        this.documentTitleInput.value = suggestedTitle;

        // Show panel
        this.saveToLibraryPanel.classList.remove('hidden');
        this.saveToLibraryPanel.classList.add('visible');

        // Focus on title input and select all
        setTimeout(() => {
            this.documentTitleInput.focus();
            this.documentTitleInput.select();
        }, 100);
    },

    // Close save to library panel
    closeSaveToLibrary: function() {
        this.saveToLibraryPanel.classList.remove('visible');
        this.saveToLibraryPanel.classList.add('hidden');
    },

    // Handle save to library action
    handleSaveToLibrary: function() {
        const title = this.documentTitleInput.value.trim();

        // Use title if provided, otherwise use auto-generated
        const result = LibraryManager.saveCurrentTempTextToLibrary(title || null);

        if (result.success) {
            // Close save panel
            this.closeSaveToLibrary();

            // Hide save icon
            this.hideSaveIcon();
            
            // Update document title to the saved title
            this.updateDocumentTitle(result.document.title);

            // Show success message
            alert('Saved to library!');
        } else if (result.error === 'storage_full') {
            alert('Storage is full! Please delete some documents from your library before saving new ones.');
        } else if (result.error === 'no_temp_text') {
            alert('No text to save.');
            this.closeSaveToLibrary();
        } else {
            alert('Failed to save to library.');
        }
    },

    // Show search icon (only when paused)
    showSearchIcon: function() {
        if (this.searchIcon) {
            this.searchIcon.classList.remove('hidden');
        }
    },

    // Hide search icon (when reading)
    hideSearchIcon: function() {
        if (this.searchIcon) {
            this.searchIcon.classList.add('hidden');
        }
    },

    // Open search panel
    openSearch: function() {
        // Clear previous search
        this.searchInput.value = '';
        this.searchButton.disabled = true;
        this.searchResultsList.innerHTML = '';
        this.searchNoResults.classList.add('hidden');
        this.searchPrompt.classList.remove('hidden');

        // Show panel
        this.searchPanel.classList.remove('hidden');
        this.searchPanel.classList.add('visible');

        // Focus on search input
        setTimeout(() => this.searchInput.focus(), 100);
    },

    // Close search panel
    closeSearch: function() {
        this.searchPanel.classList.remove('visible');
        this.searchPanel.classList.add('hidden');
    },

    // Perform search
    performSearch: function() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            return;
        }

        // Get all sentences from ReaderEngine
        const allSentences = ReaderEngine.allSentences;

        if (!allSentences || allSentences.length === 0) {
            this.searchPrompt.classList.add('hidden');
            this.searchNoResults.classList.remove('hidden');
            return;
        }

        // Search sentences (case-insensitive)
        const results = [];
        
        for (let arrayIndex = 0; arrayIndex < allSentences.length && results.length < 100; arrayIndex++) {
            const sentenceObject = allSentences[arrayIndex];
            
            if (sentenceObject.text.toLowerCase().includes(searchTerm)) {
                results.push({
                    sentenceIndex: sentenceObject.sentenceIndex,
                    sentence: sentenceObject.text
                });
            }
        }

        // Display results
        this.displaySearchResults(results, searchTerm);
    },

    // Display search results
    displaySearchResults: function(results, searchTerm) {
        // Clear previous results
        this.searchResultsList.innerHTML = '';
        this.searchPrompt.classList.add('hidden');

        if (results.length === 0) {
            this.searchNoResults.classList.remove('hidden');
            return;
        }

        this.searchNoResults.classList.add('hidden');

        // Create result items
        results.forEach(result => {
            const resultItem = this.createSearchResultItem(result, searchTerm);
            this.searchResultsList.appendChild(resultItem);
        });
    },

    // Create search result item
    createSearchResultItem: function(result, searchTerm) {
        const item = document.createElement('div');
        item.className = 'search-result-item';

        // Highlight search term in sentence
        const highlightedSentence = this.highlightSearchTerm(result.sentence, searchTerm);

        item.innerHTML = highlightedSentence;

        // Add click handler to jump to this sentence
        this.addClickAndTouchListener(item, () => {
            this.handleSearchResultClick(result.sentenceIndex);
        });

        return item;
    },

    // Highlight search term in text
    highlightSearchTerm: function(text, searchTerm) {
        // Escape HTML
        const escapedText = this.escapeHtml(text);
        const escapedTerm = this.escapeHtml(searchTerm);

        // Create regex for case-insensitive search
        const regex = new RegExp(`(${escapedTerm})`, 'gi');

        // Replace with marked version
        return escapedText.replace(regex, '<mark>$1</mark>');
    },

    // Handle search result click
    handleSearchResultClick: function(sentenceIndex) {
        // Find the word index for the start of this sentence
        const wordIndex = ReaderEngine.getWordIndexForSentence(sentenceIndex);

        if (wordIndex === -1) {
            alert('Could not find sentence position.');
            return;
        }

        // Jump to this position
        ReaderEngine.currentWordIndex = wordIndex;

        // Display current word and paragraph
        ReaderEngine.displayCurrentWord();
        ReaderEngine.displayParagraph();

        // Close search panel
        this.closeSearch();
    },

    // Format document size for display
    formatDocumentSize: function(textContent) {
        const bytes = new Blob([textContent]).size;
        const kilobytes = bytes / 1024;

        if (kilobytes < 1000) {
            return Math.round(kilobytes) + 'KB';
        } else {
            const megabytes = kilobytes / 1024;
            return megabytes.toFixed(1) + 'MB';
        }
    },

    // Update document title display
    updateDocumentTitle: function(title) {
        if (this.documentTitle) {
            this.documentTitle.textContent = title || '';
        }
    },

    // Show document title (when paused)
    showDocumentTitle: function() {
        if (this.documentTitle) {
            this.documentTitle.classList.remove('hidden');
        }
    },

    // Hide document title (when reading)
    hideDocumentTitle: function() {
        if (this.documentTitle) {
            this.documentTitle.classList.add('hidden');
        }
    }
};
