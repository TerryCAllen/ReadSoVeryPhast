// Reader Module - Handles the reading engine and word display
// Manages timing, word progression, and reading state

const ReaderEngine = {
    // Reading state
    isReading: false,
    isPaused: true,
    currentWordIndex: 0,
    wordsPerMinute: 200,
    wordsPerMinuteIncrement: 5,
    
    // Text data
    processedText: null,
    allWords: [],
    
    // Timing
    readingTimer: null,
    justJumpedToSentence: false,
    
    // DOM elements (set during initialization)
    wordDisplayElement: null,
    paragraphDisplayElement: null,
    paragraphContentElement: null,
    speedDisplayElement: null,
    playPauseIconElement: null,
    progressStatsElement: null,
    progressLine1Element: null,
    progressLine2Element: null,
    progressLine3Element: null,

    // Initialize the reading engine
    initialize: function(settings) {
        this.wordsPerMinute = settings.wordsPerMinute || 200;
        this.wordsPerMinuteIncrement = settings.wordsPerMinuteIncrement || 5;
        
        // Get DOM elements
        this.wordDisplayElement = document.getElementById('wordDisplay');
        this.paragraphDisplayElement = document.getElementById('paragraphDisplay');
        this.paragraphContentElement = document.getElementById('paragraphContent');
        this.speedDisplayElement = document.getElementById('speedDisplay');
        this.playPauseIconElement = document.getElementById('playPauseIcon');
        this.progressStatsElement = document.getElementById('progressStats');
        this.progressLine1Element = document.getElementById('progressLine1');
        this.progressLine2Element = document.getElementById('progressLine2');
        this.progressLine3Element = document.getElementById('progressLine3');
        
        this.updateSpeedDisplay();
    },

    // Load text into the reading engine
    loadText: function(rawText, startPosition = 0) {
        // Process the text
        this.processedText = TextProcessor.processText(rawText);
        
        if (this.processedText.totalWords === 0) {
            console.warn('No words found in processed text');
            return false;
        }

        // Get flat array of all words
        this.allWords = TextProcessor.getAllWordsFlat(this.processedText);
        
        // Set starting position
        this.currentWordIndex = Math.min(startPosition, this.allWords.length - 1);
        
        // Display first word
        this.displayCurrentWord();
        
        return true;
    },

    // Start reading
    startReading: function() {
        if (!this.allWords || this.allWords.length === 0) {
            console.warn('No text loaded');
            return;
        }

        this.isReading = true;
        this.isPaused = false;
        
        // Hide paragraph display
        this.paragraphDisplayElement.classList.remove('visible');
        
        // Hide progress stats
        this.hideProgressStats();
        
        // Hide help icon
        ControlsManager.hideHelpIcon();
        
        // Update play/pause icon
        this.playPauseIconElement.textContent = '❚❚';
        
        // Start the reading timer
        this.scheduleNextWord();
    },

    // Pause reading
    pauseReading: function() {
        this.isReading = false;
        this.isPaused = true;
        
        // Clear timer
        if (this.readingTimer) {
            clearTimeout(this.readingTimer);
            this.readingTimer = null;
        }
        
        // Update play/pause icon
        this.playPauseIconElement.textContent = '▶';
        
        // Show paragraph display with current position
        this.displayParagraph();
        
        // Show progress stats
        this.showProgressStats();
        
        // Show help icon
        ControlsManager.showHelpIcon();
        
        // Save position
        this.saveCurrentPosition();
    },

    // Toggle between reading and paused
    toggleReading: function() {
        if (this.isReading) {
            this.pauseReading();
        } else {
            this.startReading();
        }
    },

    // Schedule the next word to be displayed
    scheduleNextWord: function() {
        if (!this.isReading) {
            return;
        }

        const currentWord = this.allWords[this.currentWordIndex];
        
        // Calculate delay based on WPM
        const baseDelay = (60 / this.wordsPerMinute) * 1000;
        
        // Double delay for words with punctuation OR if we just jumped to a sentence
        const delay = (currentWord.hasPunctuation || this.justJumpedToSentence) ? baseDelay * 2 : baseDelay;
        
        // Reset the flag after using it
        if (this.justJumpedToSentence) {
            this.justJumpedToSentence = false;
        }
        
        this.readingTimer = setTimeout(() => {
            this.advanceToNextWord();
        }, delay);
    },

    // Advance to the next word
    advanceToNextWord: function() {
        if (this.currentWordIndex < this.allWords.length - 1) {
            this.currentWordIndex++;
            this.displayCurrentWord();
            this.scheduleNextWord();
            
            // Periodically save position (every 10 words)
            if (this.currentWordIndex % 10 === 0) {
                this.saveCurrentPosition();
            }
        } else {
            // Reached end of text
            this.pauseReading();
        }
    },

    // Display the current word
    displayCurrentWord: function() {
        if (!this.allWords || this.currentWordIndex >= this.allWords.length) {
            return;
        }

        const currentWord = this.allWords[this.currentWordIndex];
        const wordElement = document.getElementById('currentWord');
        
        if (wordElement) {
            wordElement.textContent = currentWord.text;
        }
    },

    // Display paragraph with current sentence highlighted
    displayParagraph: function() {
        if (!this.processedText || !this.allWords) {
            return;
        }

        const currentWord = this.allWords[this.currentWordIndex];
        const currentParagraph = TextProcessor.findParagraphByWordIndex(
            this.processedText, 
            this.currentWordIndex
        );

        if (!currentParagraph) {
            return;
        }

        // Build HTML for paragraph with highlighted sentence
        let paragraphHtml = '';
        
        currentParagraph.sentences.forEach(sentence => {
            const isCurrentSentence = (sentence.sentenceIndex === currentWord.sentenceIndex);
            const sentenceClass = isCurrentSentence ? 'sentence current' : 'sentence';
            
            paragraphHtml += `<span class="${sentenceClass}">${sentence.text}</span> `;
        });

        this.paragraphContentElement.innerHTML = paragraphHtml;
        this.paragraphDisplayElement.classList.add('visible');

        // Scroll to current sentence
        this.scrollToCurrentSentence();
    },

    // Scroll paragraph display to show current sentence
    scrollToCurrentSentence: function() {
        setTimeout(() => {
            const currentSentenceElement = this.paragraphContentElement.querySelector('.sentence.current');
            if (currentSentenceElement) {
                currentSentenceElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    },

    // Jump to beginning of current sentence
    jumpToSentenceStart: function() {
        const currentWord = this.allWords[this.currentWordIndex];
        
        // Find first word of current sentence
        let sentenceStartIndex = this.currentWordIndex;
        
        for (let index = this.currentWordIndex; index >= 0; index--) {
            if (this.allWords[index].sentenceIndex === currentWord.sentenceIndex) {
                sentenceStartIndex = index;
            } else {
                break;
            }
        }

        // Smart behavior: If already at or near start of sentence (within first 2 words),
        // jump to previous sentence instead
        const wordsIntoSentence = this.currentWordIndex - sentenceStartIndex;
        
        if (this.isReading && wordsIntoSentence <= 1) {
            // Jump to previous sentence
            this.jumpToPreviousSentence();
            return;
        }

        this.currentWordIndex = sentenceStartIndex;
        this.displayCurrentWord();
        
        // If reading, cancel old timeout and start fresh
        if (this.isReading) {
            // Cancel any existing timeout
            if (this.readingTimer) {
                clearTimeout(this.readingTimer);
                this.readingTimer = null;
            }
            
            this.justJumpedToSentence = true;
            
            // Start fresh timeout immediately
            this.scheduleNextWord();
        }
        
        if (this.isPaused) {
            this.displayParagraph();
        }
        
        this.saveCurrentPosition();
    },

    // Jump to previous sentence (helper for smart left arrow)
    jumpToPreviousSentence: function() {
        const currentWord = this.allWords[this.currentWordIndex];
        
        // Find first word of current sentence
        let currentSentenceStart = this.currentWordIndex;
        for (let index = this.currentWordIndex; index >= 0; index--) {
            if (this.allWords[index].sentenceIndex === currentWord.sentenceIndex) {
                currentSentenceStart = index;
            } else {
                break;
            }
        }

        // Go to previous sentence if possible
        if (currentSentenceStart > 0) {
            const previousSentenceIndex = this.allWords[currentSentenceStart - 1].sentenceIndex;
            
            // Find the first word of the previous sentence
            for (let index = currentSentenceStart - 1; index >= 0; index--) {
                if (this.allWords[index].sentenceIndex === previousSentenceIndex) {
                    this.currentWordIndex = index;
                } else {
                    break;
                }
            }
            
            this.displayCurrentWord();
            
            // If reading, cancel old timeout and start fresh
            if (this.isReading) {
                // Cancel any existing timeout
                if (this.readingTimer) {
                    clearTimeout(this.readingTimer);
                    this.readingTimer = null;
                }
                
                this.justJumpedToSentence = true;
                
                // Start fresh timeout immediately
                this.scheduleNextWord();
            }
            
            if (this.isPaused) {
                this.displayParagraph();
            }
            
            this.saveCurrentPosition();
        }
    },

    // Skip to next sentence
    skipToNextSentence: function() {
        const currentWord = this.allWords[this.currentWordIndex];
        
        // Find first word of next sentence
        let nextSentenceIndex = this.currentWordIndex + 1;
        
        for (let index = this.currentWordIndex + 1; index < this.allWords.length; index++) {
            if (this.allWords[index].sentenceIndex !== currentWord.sentenceIndex) {
                nextSentenceIndex = index;
                break;
            }
        }

        this.currentWordIndex = Math.min(nextSentenceIndex, this.allWords.length - 1);
        this.displayCurrentWord();
        
        // If reading, cancel old timeout and start fresh
        if (this.isReading) {
            // Cancel any existing timeout
            if (this.readingTimer) {
                clearTimeout(this.readingTimer);
                this.readingTimer = null;
            }
            
            this.justJumpedToSentence = true;
            
            // Start fresh timeout immediately
            this.scheduleNextWord();
        }
        
        if (this.isPaused) {
            this.displayParagraph();
        }
        
        this.saveCurrentPosition();
    },

    // Navigate to previous sentence (paused mode only)
    navigateToPreviousSentence: function() {
        if (!this.isPaused) {
            return;
        }

        const currentWord = this.allWords[this.currentWordIndex];
        
        // Find first word of current sentence
        let currentSentenceStart = this.currentWordIndex;
        for (let index = this.currentWordIndex; index >= 0; index--) {
            if (this.allWords[index].sentenceIndex === currentWord.sentenceIndex) {
                currentSentenceStart = index;
            } else {
                break;
            }
        }

        // Go to previous sentence
        if (currentSentenceStart > 0) {
            const previousSentenceIndex = this.allWords[currentSentenceStart - 1].sentenceIndex;
            
            // Find the first word of the previous sentence
            for (let index = currentSentenceStart - 1; index >= 0; index--) {
                if (this.allWords[index].sentenceIndex === previousSentenceIndex) {
                    this.currentWordIndex = index;
                } else {
                    break;
                }
            }
        }

        this.displayCurrentWord();
        this.displayParagraph();
        this.saveCurrentPosition();
    },

    // Navigate to next sentence (paused mode only)
    navigateToNextSentence: function() {
        if (!this.isPaused) {
            return;
        }

        this.skipToNextSentence();
    },

    // Increase reading speed
    increaseSpeed: function() {
        this.wordsPerMinute += this.wordsPerMinuteIncrement;
        this.updateSpeedDisplay();
        this.saveSettings();
    },

    // Decrease reading speed
    decreaseSpeed: function() {
        this.wordsPerMinute = Math.max(50, this.wordsPerMinute - this.wordsPerMinuteIncrement);
        this.updateSpeedDisplay();
        this.saveSettings();
    },

    // Update speed display
    updateSpeedDisplay: function() {
        if (this.speedDisplayElement) {
            this.speedDisplayElement.textContent = `${this.wordsPerMinute} WPM`;
        }
    },

    // Save current reading position
    saveCurrentPosition: function() {
        const currentWord = this.allWords[this.currentWordIndex];
        
        StorageManager.saveReadingPosition({
            wordIndex: this.currentWordIndex,
            sentenceIndex: currentWord.sentenceIndex,
            paragraphIndex: currentWord.paragraphIndex
        });
    },

    // Save settings
    saveSettings: function() {
        // Update the full settings object with current WPM
        if (SettingsManager && SettingsManager.currentSettings) {
            SettingsManager.currentSettings.wordsPerMinute = this.wordsPerMinute;
            StorageManager.saveSettings(SettingsManager.currentSettings);
        } else {
            // Fallback if SettingsManager not available
            const settings = {
                wordsPerMinute: this.wordsPerMinute,
                wordsPerMinuteIncrement: this.wordsPerMinuteIncrement
            };
            StorageManager.saveSettings(settings);
        }
    },

    // Get current state for debugging
    getCurrentState: function() {
        return {
            isReading: this.isReading,
            isPaused: this.isPaused,
            currentWordIndex: this.currentWordIndex,
            totalWords: this.allWords.length,
            wordsPerMinute: this.wordsPerMinute,
            currentWord: this.allWords[this.currentWordIndex]?.text
        };
    },

    // Show progress stats (only when paused)
    showProgressStats: function() {
        if (!this.progressStatsElement || !this.allWords || this.allWords.length === 0) {
            return;
        }

        // Calculate statistics
        const currentWordNumber = this.currentWordIndex + 1; // 1-based for display
        const totalWords = this.allWords.length;
        const percentComplete = ((this.currentWordIndex / totalWords) * 100).toFixed(1);
        
        // Calculate remaining words and time
        const wordsRemaining = totalWords - this.currentWordIndex;
        const minutesRemaining = wordsRemaining / this.wordsPerMinute;
        
        // Format time remaining
        let timeRemainingText;
        if (minutesRemaining < 1) {
            timeRemainingText = 'Less than 1 minute';
        } else if (minutesRemaining < 60) {
            const minutes = Math.ceil(minutesRemaining);
            timeRemainingText = `${minutes} minute${minutes === 1 ? '' : 's'}`;
        } else {
            const hours = Math.floor(minutesRemaining / 60);
            const minutes = Math.ceil(minutesRemaining % 60);
            timeRemainingText = `${hours} hour${hours === 1 ? '' : 's'}`;
            if (minutes > 0) {
                timeRemainingText += `, ${minutes} min`;
            }
        }

        // Format numbers with commas
        const formattedCurrent = currentWordNumber.toLocaleString();
        const formattedTotal = totalWords.toLocaleString();

        // Compact 3-line format for all devices
        this.progressLine1Element.textContent = `${formattedCurrent}/${formattedTotal}`;
        this.progressLine2Element.textContent = `${percentComplete}%`;
        
        // Shorten time for display
        let shortTime = timeRemainingText;
        if (minutesRemaining < 1) {
            shortTime = '<1 min';
        } else if (minutesRemaining < 60) {
            const minutes = Math.ceil(minutesRemaining);
            shortTime = `${minutes} min`;
        } else {
            const hours = Math.floor(minutesRemaining / 60);
            const minutes = Math.ceil(minutesRemaining % 60);
            shortTime = `${hours}h`;
            if (minutes > 0) {
                shortTime += ` ${minutes}m`;
            }
        }
        this.progressLine3Element.textContent = shortTime;
        
        // Store detailed info for the detail panel
        // Format time for detail view (shorter format)
        let detailTime = timeRemainingText;
        if (minutesRemaining >= 60) {
            const hours = Math.floor(minutesRemaining / 60);
            const minutes = Math.ceil(minutesRemaining % 60);
            detailTime = `${hours} hour${hours === 1 ? '' : 's'}`;
            if (minutes > 0) {
                detailTime += `, ${minutes} min`;
            }
        }
        
        this.currentProgressDetails = {
            wordText: `Word ${formattedCurrent} of ${formattedTotal}`,
            percentText: `${percentComplete}% Complete`,
            timeText: `${detailTime} remaining`
        };

        // Show the stats
        this.progressStatsElement.classList.remove('hidden');
    },

    // Hide progress stats (when reading)
    hideProgressStats: function() {
        if (this.progressStatsElement) {
            this.progressStatsElement.classList.add('hidden');
        }
    }
};
