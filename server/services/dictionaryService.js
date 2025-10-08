import axios from 'axios';

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Cache for storing recent lookups (reduce API calls)
const definitionCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

export const dictionaryService = {
  /**
   * Get word definition, pronunciation, and examples
   * @param {string} word - The word to look up
   * @param {string} language - Language code (default: 'en')
   * @returns {Object} Word data or error
   */
  async getWordDefinition(word, language = 'en') {
    try {
      // Sanitize input
      const cleanWord = word.trim().toLowerCase();
      
      if (!cleanWord || cleanWord.length > 50) {
        return {
          success: false,
          error: 'Invalid word format'
        };
      }

      // Check cache first
      const cacheKey = `${language}:${cleanWord}`;
      const cached = definitionCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`[Dictionary] Cache hit for: ${cleanWord}`);
        return cached.data;
      }

      // Fetch from API
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/${language}/${cleanWord}`;
      console.log(`[Dictionary] Fetching definition for: ${cleanWord}`);
      
      const response = await axios.get(apiUrl, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      });

      // Parse response
      const wordData = response.data[0];
      
      const result = {
        success: true,
        word: wordData.word,
        phonetic: wordData.phonetic || wordData.phonetics?.[0]?.text || '',
        audioUrl: wordData.phonetics?.find(p => p.audio)?.audio || '',
        origin: wordData.origin || '',
        meanings: wordData.meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.slice(0, 3).map(def => ({
            definition: def.definition,
            example: def.example || '',
            synonyms: def.synonyms?.slice(0, 5) || [],
            antonyms: def.antonyms?.slice(0, 5) || []
          }))
        }))
      };

      // Cache the result
      definitionCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      // Limit cache size
      if (definitionCache.size > 500) {
        const firstKey = definitionCache.keys().next().value;
        definitionCache.delete(firstKey);
      }

      return result;

    } catch (error) {
      console.error('[Dictionary] Error:', error.message);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Word not found in dictionary'
        };
      }

      return {
        success: false,
        error: 'Failed to fetch word definition'
      };
    }
  },

  /**
   * Get multiple word definitions in batch
   * @param {Array<string>} words - Array of words to look up
   * @returns {Object} Results for each word
   */
  async getBatchDefinitions(words) {
    const results = {};
    
    for (const word of words.slice(0, 10)) { // Limit to 10 words
      results[word] = await this.getWordDefinition(word);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return {
      success: true,
      results
    };
  },

  /**
   * Clear cache (useful for memory management)
   */
  clearCache() {
    definitionCache.clear();
    console.log('[Dictionary] Cache cleared');
  }
};
