// Text Processor Module - Handles text cleaning, parsing, and organization
// Processes raw text into structured data for reading

const TextProcessor = {
    
    // Clean raw text by removing HTML tags, escape codes, and unwanted characters
    cleanText: function(rawText) {
        if (!rawText || typeof rawText !== 'string') {
            return '';
        }

        let cleanedText = rawText;

        // Remove HTML tags
        cleanedText = this.removeHtmlTags(cleanedText);

        // Decode HTML entities
        cleanedText = this.decodeHtmlEntities(cleanedText);

        // Remove escape codes and special characters
        cleanedText = this.removeEscapeCodes(cleanedText);

        // Normalize whitespace
        cleanedText = this.normalizeWhitespace(cleanedText);

        // Remove excessive line breaks (more than 2 consecutive)
        cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');

        return cleanedText.trim();
    },

    // Remove HTML tags from text
    removeHtmlTags: function(text) {
        // Remove script and style tags with their content
        text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        
        // Remove all other HTML tags
        text = text.replace(/<[^>]+>/g, ' ');
        
        return text;
    },

    // Decode HTML entities
    decodeHtmlEntities: function(text) {
        const entities = {
            '&nbsp;': ' ',
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&apos;': "'",
            '&mdash;': '—',
            '&ndash;': '–',
            '&hellip;': '...',
            '&ldquo;': '"',
            '&rdquo;': '"',
            '&lsquo;': "'",
            '&rsquo;': "'"
        };

        let decodedText = text;
        for (const [entity, character] of Object.entries(entities)) {
            decodedText = decodedText.split(entity).join(character);
        }

        // Decode numeric entities
        decodedText = decodedText.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        decodedText = decodedText.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

        return decodedText;
    },

    // Remove escape codes and unwanted special characters
    removeEscapeCodes: function(text) {
        // Remove common escape sequences
        text = text.replace(/\\n/g, '\n');
        text = text.replace(/\\t/g, ' ');
        text = text.replace(/\\r/g, '');
        text = text.replace(/\\/g, '');

        // Remove control characters except newlines and tabs
        text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

        return text;
    },

    // Normalize whitespace
    normalizeWhitespace: function(text) {
        // Replace multiple spaces with single space
        text = text.replace(/ +/g, ' ');
        
        // Replace tabs with spaces
        text = text.replace(/\t/g, ' ');
        
        // Trim spaces around newlines
        text = text.replace(/ *\n */g, '\n');
        
        return text;
    },

    // Parse text into paragraphs
    parseParagraphs: function(text) {
        if (!text) {
            return [];
        }

        // Split by double newlines or more
        const paragraphTexts = text.split(/\n\n+/);
        
        const paragraphs = paragraphTexts
            .map(paragraphText => paragraphText.trim())
            .filter(paragraphText => paragraphText.length > 0)
            .map((paragraphText, paragraphIndex) => ({
                paragraphIndex: paragraphIndex,
                text: paragraphText,
                sentences: this.parseSentences(paragraphText)
            }));

        return paragraphs;
    },

    // Parse text into sentences
    parseSentences: function(text) {
        if (!text) {
            return [];
        }

        // Split on sentence-ending punctuation followed by space or end of text
        // Handles ., ?, !, and combinations with quotes
        const sentenceRegex = /[.!?]+(?:\s+|$)/g;
        const matches = [...text.matchAll(sentenceRegex)];
        
        if (matches.length === 0) {
            // No sentence endings found, treat entire text as one sentence
            return [{
                sentenceIndex: 0,
                text: text.trim(),
                words: this.parseWords(text.trim())
            }];
        }

        const sentences = [];
        let currentPosition = 0;

        matches.forEach((match, matchIndex) => {
            const endPosition = match.index + match[0].length;
            const sentenceText = text.substring(currentPosition, endPosition).trim();
            
            if (sentenceText.length > 0) {
                sentences.push({
                    sentenceIndex: matchIndex,
                    text: sentenceText,
                    words: this.parseWords(sentenceText)
                });
            }
            
            currentPosition = endPosition;
        });

        // Add any remaining text as final sentence
        if (currentPosition < text.length) {
            const remainingText = text.substring(currentPosition).trim();
            if (remainingText.length > 0) {
                sentences.push({
                    sentenceIndex: sentences.length,
                    text: remainingText,
                    words: this.parseWords(remainingText)
                });
            }
        }

        return sentences;
    },

    // Parse sentence into words
    parseWords: function(sentenceText) {
        if (!sentenceText) {
            return [];
        }

        // Split on whitespace
        const wordTokens = sentenceText.split(/\s+/);
        
        const words = wordTokens
            .filter(token => token.length > 0)
            .map((wordText, wordIndex) => ({
                wordIndex: wordIndex,
                text: wordText,
                hasPunctuation: this.hasPausingPunctuation(wordText)
            }));

        return words;
    },

    // Check if word has punctuation that requires a pause
    hasPausingPunctuation: function(word) {
        // Check for sentence-ending or pausing punctuation: . , ; : ? ! —
        return /[.,;:?!—]/.test(word);
    },

    // Process raw text into complete structured data
    processText: function(rawText) {
        const cleanedText = this.cleanText(rawText);
        
        if (!cleanedText) {
            return {
                originalText: rawText,
                cleanedText: '',
                paragraphs: [],
                totalWords: 0,
                totalSentences: 0,
                totalParagraphs: 0
            };
        }

        const paragraphs = this.parseParagraphs(cleanedText);
        
        // Calculate totals
        let totalWords = 0;
        let totalSentences = 0;

        paragraphs.forEach(paragraph => {
            totalSentences += paragraph.sentences.length;
            paragraph.sentences.forEach(sentence => {
                totalWords += sentence.words.length;
            });
        });

        return {
            originalText: rawText,
            cleanedText: cleanedText,
            paragraphs: paragraphs,
            totalWords: totalWords,
            totalSentences: totalSentences,
            totalParagraphs: paragraphs.length
        };
    },

    // Get all words in reading order as flat array
    getAllWordsFlat: function(processedText) {
        const allWords = [];
        let globalWordIndex = 0;

        processedText.paragraphs.forEach(paragraph => {
            paragraph.sentences.forEach(sentence => {
                sentence.words.forEach(word => {
                    allWords.push({
                        ...word,
                        globalWordIndex: globalWordIndex,
                        sentenceIndex: sentence.sentenceIndex,
                        paragraphIndex: paragraph.paragraphIndex,
                        sentenceText: sentence.text,
                        paragraphText: paragraph.text
                    });
                    globalWordIndex++;
                });
            });
        });

        return allWords;
    },

    // Find paragraph containing a specific global word index
    findParagraphByWordIndex: function(processedText, globalWordIndex) {
        let currentWordCount = 0;

        for (const paragraph of processedText.paragraphs) {
            const paragraphWordCount = paragraph.sentences.reduce(
                (sum, sentence) => sum + sentence.words.length, 
                0
            );

            if (globalWordIndex < currentWordCount + paragraphWordCount) {
                return paragraph;
            }

            currentWordCount += paragraphWordCount;
        }

        return processedText.paragraphs[processedText.paragraphs.length - 1] || null;
    },

    // Find sentence containing a specific global word index
    findSentenceByWordIndex: function(processedText, globalWordIndex) {
        let currentWordCount = 0;

        for (const paragraph of processedText.paragraphs) {
            for (const sentence of paragraph.sentences) {
                if (globalWordIndex < currentWordCount + sentence.words.length) {
                    return sentence;
                }
                currentWordCount += sentence.words.length;
            }
        }

        return null;
    }
};