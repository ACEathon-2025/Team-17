const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const dictionaryService = {
  /**
   * Get word definition
   * @param {string} word - Word to look up
   * @param {string} language - Language code (default: 'en')
   * @returns {Promise<Object>}
   */
  async getDefinition(word, language = 'en') {
    try {
      const response = await fetch(`${API_URL}/dictionary/define/${encodeURIComponent(word)}?language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Dictionary service error:', error);
      return {
        success: false,
        error: 'Failed to fetch definition'
      };
    }
  },

  /**
   * Get multiple definitions at once
   * @param {Array<string>} words - Array of words
   * @returns {Promise<Object>}
   */
  async getBatchDefinitions(words) {
    try {
      const response = await fetch(`${API_URL}/dictionary/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ words })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Dictionary batch service error:', error);
      return {
        success: false,
        error: 'Failed to fetch definitions'
      };
    }
  },

  /**
   * Play pronunciation audio
   * @param {string} audioUrl - Audio URL from API
   */
  playPronunciation(audioUrl) {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Audio playback error:', error);
    });
  }
};
