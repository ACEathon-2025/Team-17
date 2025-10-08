// Use dedicated translation API URL
const API_URL = import.meta.env.VITE_TRANSLATION_API_URL || 'http://localhost:5000/api/translation';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const translationService = {
  async translateText(text, targetLanguage) {
    try {
      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLanguage }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Translation service error:', error);
      return {
        success: false,
        error: error.message || 'Translation failed',
      };
    }
  },

  async getSupportedLanguages() {
    try {
      const response = await fetch(`${API_URL}/languages`);
      const languages = await handleResponse(response);
      return languages;
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      // Return default languages if API fails
      return [
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hi', name: 'Hindi' },
        { code: 'nl', name: 'Dutch' },
        { code: 'pl', name: 'Polish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ru', name: 'Russian' },
        { code: 'sv', name: 'Swedish' },
        { code: 'da', name: 'Danish' },
        { code: 'no', name: 'Norwegian' },
        { code: 'fi', name: 'Finnish' },
        { code: 'cs', name: 'Czech' },
        { code: 'el', name: 'Greek' },
        { code: 'he', name: 'Hebrew' },
        { code: 'th', name: 'Thai' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ms', name: 'Malay' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'ro', name: 'Romanian' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'bg', name: 'Bulgarian' },
      ];
    }
  },

  async checkServerHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      const health = await handleResponse(response);
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'error',
        hasApiKey: false,
        message: error.message,
      };
    }
  },

  getLanguageName(code) {
    const languageMap = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'nl': 'Dutch',
      'pl': 'Polish',
      'tr': 'Turkish',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'cs': 'Czech',
      'el': 'Greek',
      'he': 'Hebrew',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'id': 'Indonesian',
      'ms': 'Malay',
      'uk': 'Ukrainian',
      'ro': 'Romanian',
      'hu': 'Hungarian',
      'bg': 'Bulgarian',
    };
    return languageMap[code] || code;
  },
};
