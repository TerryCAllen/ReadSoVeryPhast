// Library Module - Manages multiple documents and reading library
// Handles document storage, retrieval, switching, and deletion

const LibraryManager = {
    // Storage keys
    KEYS: {
        LIBRARY: 'speedReader_library',
        ACTIVE_DOCUMENT_ID: 'speedReader_activeDocumentId',
        TEMP_TEXT: 'speedReader_tempText',  // For unsaved bookmarklet text
        TEMP_POSITION: 'speedReader_tempPosition'
    },

    // Current state
    currentLibrary: [],
    activeDocumentId: null,
    hasUnsavedText: false,

    // Initialize library
    initialize: function() {
        this.currentLibrary = this.loadLibrary();
        this.activeDocumentId = this.loadActiveDocumentId();
        this.checkForUnsavedText();
        
        console.log('Library initialized:', {
            documentCount: this.currentLibrary.length,
            activeDocumentId: this.activeDocumentId,
            hasUnsavedText: this.hasUnsavedText
        });
    },

    // Load library from storage
    loadLibrary: function() {
        try {
            const libraryJson = localStorage.getItem(this.KEYS.LIBRARY);
            if (libraryJson) {
                return JSON.parse(libraryJson);
            }
            return [];
        } catch (error) {
            console.error('Failed to load library:', error);
            return [];
        }
    },

    // Save library to storage
    saveLibrary: function() {
        try {
            localStorage.setItem(this.KEYS.LIBRARY, JSON.stringify(this.currentLibrary));
            return true;
        } catch (error) {
            console.error('Failed to save library:', error);
            return false;
        }
    },

    // Load active document ID
    loadActiveDocumentId: function() {
        try {
            return localStorage.getItem(this.KEYS.ACTIVE_DOCUMENT_ID);
        } catch (error) {
            console.error('Failed to load active document ID:', error);
            return null;
        }
    },

    // Save active document ID
    saveActiveDocumentId: function(documentId) {
        try {
            if (documentId) {
                localStorage.setItem(this.KEYS.ACTIVE_DOCUMENT_ID, documentId);
            } else {
                localStorage.removeItem(this.KEYS.ACTIVE_DOCUMENT_ID);
            }
            this.activeDocumentId = documentId;
            return true;
        } catch (error) {
            console.error('Failed to save active document ID:', error);
            return false;
        }
    },

    // Check for unsaved temporary text
    checkForUnsavedText: function() {
        try {
            const tempText = localStorage.getItem(this.KEYS.TEMP_TEXT);
            this.hasUnsavedText = !!(tempText && tempText.length > 0);
            return this.hasUnsavedText;
        } catch (error) {
            console.error('Failed to check for unsaved text:', error);
            return false;
        }
    },

    // Save temporary text (from bookmarklet, unsaved)
    saveTempText: function(textContent, position) {
        try {
            localStorage.setItem(this.KEYS.TEMP_TEXT, textContent);
            if (position) {
                localStorage.setItem(this.KEYS.TEMP_POSITION, JSON.stringify(position));
            }
            this.hasUnsavedText = true;
            return true;
        } catch (error) {
            console.error('Failed to save temporary text:', error);
            return false;
        }
    },

    // Load temporary text
    loadTempText: function() {
        try {
            const textContent = localStorage.getItem(this.KEYS.TEMP_TEXT);
            const positionJson = localStorage.getItem(this.KEYS.TEMP_POSITION);
            const position = positionJson ? JSON.parse(positionJson) : { wordIndex: 0, sentenceIndex: 0, paragraphIndex: 0 };
            
            return {
                textContent: textContent || '',
                position: position
            };
        } catch (error) {
            console.error('Failed to load temporary text:', error);
            return { textContent: '', position: { wordIndex: 0, sentenceIndex: 0, paragraphIndex: 0 } };
        }
    },

    // Clear temporary text
    clearTempText: function() {
        try {
            localStorage.removeItem(this.KEYS.TEMP_TEXT);
            localStorage.removeItem(this.KEYS.TEMP_POSITION);
            this.hasUnsavedText = false;
            return true;
        } catch (error) {
            console.error('Failed to clear temporary text:', error);
            return false;
        }
    },

    // Update temporary position (while reading unsaved text)
    updateTempPosition: function(position) {
        try {
            localStorage.setItem(this.KEYS.TEMP_POSITION, JSON.stringify(position));
            return true;
        } catch (error) {
            console.error('Failed to update temporary position:', error);
            return false;
        }
    },

    // Generate title from text (first 50 characters)
    generateTitle: function(textContent) {
        const cleaned = textContent.trim().substring(0, 50);
        const title = cleaned.length < textContent.trim().length ? cleaned + '...' : cleaned;
        return title || 'Untitled Document';
    },

    // Create new document object
    createDocument: function(textContent, source = 'textbox', title = null) {
        const now = Date.now();
        return {
            id: `doc_${now}`,
            title: title || this.generateTitle(textContent),
            textContent: textContent,
            position: { wordIndex: 0, sentenceIndex: 0, paragraphIndex: 0 },
            lastRead: now,
            dateAdded: now,
            source: source,
            autoSave: true
        };
    },

    // Add document to library
    addDocument: function(document) {
        try {
            // Check storage space before adding
            if (!this.hasStorageSpace(document.textContent)) {
                return { success: false, error: 'storage_full' };
            }

            this.currentLibrary.push(document);
            this.saveLibrary();
            return { success: true, documentId: document.id };
        } catch (error) {
            console.error('Failed to add document:', error);
            return { success: false, error: error.message };
        }
    },

    // Save current temporary text to library
    saveCurrentTempTextToLibrary: function(title = null) {
        const tempData = this.loadTempText();
        
        if (!tempData.textContent || tempData.textContent.length === 0) {
            return { success: false, error: 'no_temp_text' };
        }

        const document = this.createDocument(tempData.textContent, 'bookmarklet', title);
        document.position = tempData.position;

        const result = this.addDocument(document);
        
        if (result.success) {
            this.clearTempText();
            this.saveActiveDocumentId(document.id);
        }

        return result;
    },

    // Get document by ID
    getDocument: function(documentId) {
        return this.currentLibrary.find(document => document.id === documentId);
    },

    // Update document in library
    updateDocument: function(documentId, updates) {
        try {
            const documentIndex = this.currentLibrary.findIndex(document => document.id === documentId);
            
            if (documentIndex === -1) {
                return false;
            }

            this.currentLibrary[documentIndex] = {
                ...this.currentLibrary[documentIndex],
                ...updates,
                lastRead: Date.now()
            };

            this.saveLibrary();
            return true;
        } catch (error) {
            console.error('Failed to update document:', error);
            return false;
        }
    },

    // Update document position
    updateDocumentPosition: function(documentId, position) {
        return this.updateDocument(documentId, { position: position });
    },

    // Update document title
    updateDocumentTitle: function(documentId, title) {
        return this.updateDocument(documentId, { title: title });
    },

    // Delete document from library
    deleteDocument: function(documentId) {
        try {
            const initialLength = this.currentLibrary.length;
            this.currentLibrary = this.currentLibrary.filter(document => document.id !== documentId);

            if (this.currentLibrary.length < initialLength) {
                this.saveLibrary();

                // If deleted document was active, clear active ID
                if (this.activeDocumentId === documentId) {
                    this.saveActiveDocumentId(null);
                }

                return true;
            }

            return false;
        } catch (error) {
            console.error('Failed to delete document:', error);
            return false;
        }
    },

    // Get library sorted by most recently read
    getLibrarySortedByRecent: function() {
        return [...this.currentLibrary].sort((documentA, documentB) => documentB.lastRead - documentA.lastRead);
    },

    // Get storage usage information
    getStorageUsage: function() {
        try {
            const libraryJson = localStorage.getItem(this.KEYS.LIBRARY) || '';
            const tempText = localStorage.getItem(this.KEYS.TEMP_TEXT) || '';
            
            const librarySize = libraryJson.length;
            const tempSize = tempText.length;
            const totalSize = librarySize + tempSize;

            // LocalStorage typically has 5-10MB limit, using 5MB as conservative estimate
            const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
            const usagePercent = (totalSize / estimatedLimit) * 100;

            return {
                librarySize: librarySize,
                tempSize: tempSize,
                totalSize: totalSize,
                estimatedLimit: estimatedLimit,
                usagePercent: Math.min(usagePercent, 100),
                documentCount: this.currentLibrary.length
            };
        } catch (error) {
            console.error('Failed to get storage usage:', error);
            return null;
        }
    },

    // Check if there's enough storage space for new text
    hasStorageSpace: function(newTextContent) {
        try {
            const usage = this.getStorageUsage();
            if (!usage) return true; // If we can't check, allow it

            const newTextSize = newTextContent.length;
            const projectedTotal = usage.totalSize + newTextSize;
            const projectedPercent = (projectedTotal / usage.estimatedLimit) * 100;

            // Allow if projected usage is under 95%
            return projectedPercent < 95;
        } catch (error) {
            console.error('Failed to check storage space:', error);
            return true; // If check fails, allow it
        }
    },

    // Migrate old storage format to new library format
    migrateOldStorage: function() {
        try {
            // Check if old format exists
            const oldTextContent = localStorage.getItem('speedReader_textContent');
            const oldPosition = localStorage.getItem('speedReader_readingPosition');

            if (!oldTextContent || oldTextContent.length === 0) {
                console.log('No old storage to migrate');
                return false;
            }

            // Check if already migrated (library exists)
            if (this.currentLibrary.length > 0) {
                console.log('Library already exists, skipping migration');
                return false;
            }

            console.log('Migrating old storage format to library...');

            // Create document from old storage
            const document = this.createDocument(oldTextContent, 'textbox');
            
            // Use old position if available
            if (oldPosition) {
                try {
                    document.position = JSON.parse(oldPosition);
                } catch (error) {
                    console.error('Failed to parse old position:', error);
                }
            }

            // Add to library
            const result = this.addDocument(document);

            if (result.success) {
                // Set as active document
                this.saveActiveDocumentId(document.id);

                // Clear old storage keys
                localStorage.removeItem('speedReader_textContent');
                localStorage.removeItem('speedReader_readingPosition');

                console.log('Migration successful');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Migration failed:', error);
            return false;
        }
    },

    // Clear entire library
    clearLibrary: function() {
        try {
            this.currentLibrary = [];
            this.activeDocumentId = null;
            localStorage.removeItem(this.KEYS.LIBRARY);
            localStorage.removeItem(this.KEYS.ACTIVE_DOCUMENT_ID);
            this.clearTempText();
            return true;
        } catch (error) {
            console.error('Failed to clear library:', error);
            return false;
        }
    }
};