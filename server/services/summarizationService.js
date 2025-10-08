import axios from 'axios';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Cache for summarization results
const summaryCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

export const summarizationService = {
  /**
   * Summarize text using Hugging Face API
   * @param {string} text - Text to summarize
   * @param {Object} options - Summarization options
   * @returns {Object} Summarization result
   */
  async summarizeText(text, options = {}) {
    try {
      // Validate input
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: 'No text provided for summarization'
        };
      }

      const wordCount = text.split(/\s+/).length;
      
      // Text should have at least 50 words to summarize meaningfully
      if (wordCount < 50) {
        return {
          success: false,
          error: 'Text is too short. Please provide at least 50 words for summarization.'
        };
      }

      // Check if text is too long (model limit is ~1024 tokens, roughly 700-800 words)
      if (wordCount > 800) {
        text = text.split(/\s+/).slice(0, 800).join(' ');
        console.log('[Summarization] Text truncated to 800 words');
      }

      // Check cache
      const cacheKey = text.substring(0, 100); // Use first 100 chars as key
      const cached = summaryCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('[Summarization] Cache hit');
        return cached.data;
      }

      // Call Hugging Face API
      console.log('[Summarization] Calling Hugging Face API...');
      
      const response = await axios.post(
        HUGGINGFACE_API_URL,
        {
          inputs: text,
          parameters: {
            max_length: options.maxLength || 130,
            min_length: options.minLength || 30,
            do_sample: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      // Handle model loading state
      if (response.data.error && response.data.error.includes('loading')) {
        return {
          success: false,
          error: 'AI model is loading. Please try again in 20 seconds.',
          loading: true,
          estimatedTime: response.data.estimated_time || 20
        };
      }

      // Parse response
      let summaryText = '';
      
      if (Array.isArray(response.data) && response.data[0]?.summary_text) {
        summaryText = response.data[0].summary_text;
      } else if (response.data.summary_text) {
        summaryText = response.data.summary_text;
      } else {
        throw new Error('Unexpected API response format');
      }

      const result = {
        success: true,
        summary: summaryText,
        originalWordCount: wordCount,
        summaryWordCount: summaryText.split(/\s+/).length,
        compressionRatio: ((summaryText.split(/\s+/).length / wordCount) * 100).toFixed(1),
        model: 'facebook/bart-large-cnn'
      };

      // Cache the result
      summaryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      // Limit cache size
      if (summaryCache.size > 100) {
        const firstKey = summaryCache.keys().next().value;
        summaryCache.delete(firstKey);
      }

      console.log('[Summarization] Success');
      return result;

    } catch (error) {
      console.error('[Summarization] Error:', error.message);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your Hugging Face API token.'
        };
      }

      if (error.response?.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again in a few minutes.'
        };
      }

      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timed out. Please try with shorter text.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate summary. Please try again.'
      };
    }
  },

  /**
   * Get summarization statistics
   */
  getSummaryStats(originalText, summaryText) {
    const originalWords = originalText.split(/\s+/).length;
    const summaryWords = summaryText.split(/\s+/).length;
    const originalChars = originalText.length;
    const summaryChars = summaryText.length;

    return {
      originalWordCount: originalWords,
      summaryWordCount: summaryWords,
      originalCharCount: originalChars,
      summaryCharCount: summaryChars,
      wordReduction: originalWords - summaryWords,
      charReduction: originalChars - summaryChars,
      compressionRatio: ((summaryWords / originalWords) * 100).toFixed(1),
      timeSaved: Math.ceil((originalWords - summaryWords) / 200) // Assuming 200 WPM reading speed
    };
  },

  /**
   * Clear cache
   */
  clearCache() {
    summaryCache.clear();
    console.log('[Summarization] Cache cleared');
  }
};
