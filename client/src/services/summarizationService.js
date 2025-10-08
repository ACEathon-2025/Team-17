const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const summarizationService = {
  /**
   * Summarize text via backend
   * @param {string} text - Text to summarize
   * @param {Object} options - Summarization options
   * @returns {Promise<Object>}
   */
  async summarizeText(text, options = {}) {
    try {
      const response = await fetch(`${API_URL}/summarization/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, options })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Summarization service error:', error);
      return {
        success: false,
        error: 'Failed to connect to summarization service'
      };
    }
  },

  /**
   * Get summary statistics
   * @param {string} originalText
   * @param {string} summaryText
   * @returns {Promise<Object>}
   */
  async getStats(originalText, summaryText) {
    try {
      const response = await fetch(`${API_URL}/summarization/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ originalText, summaryText })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Stats service error:', error);
      return {
        success: false,
        error: 'Failed to calculate statistics'
      };
    }
  }
};
