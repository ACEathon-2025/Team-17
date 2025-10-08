import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// MyMemory Translation API - FREE, no key required
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';
const DETECT_LANG_URL = 'https://ws.detectlanguage.com/0.2/detect';

// Language mapping
const LANGUAGES = {
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

// Language code mapping for MyMemory
const mapToMyMemoryCode = (code) => {
  const mapping = {
    'zh': 'zh-CN',
    'he': 'iw',
  };
  return mapping[code] || code;
};

// Simple language detection based on character patterns
const detectLanguage = (text) => {
  // Check for common patterns
  const patterns = {
    'zh': /[\u4e00-\u9fff]/,  // Chinese characters
    'ja': /[\u3040-\u309f\u30a0-\u30ff]/,  // Japanese hiragana/katakana
    'ko': /[\uac00-\ud7af]/,  // Korean
    'ar': /[\u0600-\u06ff]/,  // Arabic
    'th': /[\u0e00-\u0e7f]/,  // Thai
    'he': /[\u0590-\u05ff]/,  // Hebrew
    'ru': /[\u0400-\u04ff]/,  // Cyrillic
    'el': /[\u0370-\u03ff]/,  // Greek
    'hi': /[\u0900-\u097f]/,  // Hindi/Devanagari
  };

  // Check patterns
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }

  // Common words detection for European languages
  const lowerText = text.toLowerCase();
  const commonWords = {
    'es': ['el', 'la', 'de', 'que', 'en', 'los', 'las', 'del', 'hola', 'gracias', 'por favor'],
    'fr': ['le', 'la', 'de', 'et', 'est', 'un', 'une', 'les', 'bonjour', 'merci'],
    'de': ['der', 'die', 'das', 'ist', 'und', 'ich', 'du', 'sie', 'es', 'ein', 'eine', 'nicht'],
    'it': ['il', 'la', 'di', 'che', 'è', 'un', 'una', 'gli', 'le', 'ciao', 'grazie'],
    'pt': ['o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'os', 'as', 'olá', 'obrigado'],
    'nl': ['de', 'het', 'een', 'van', 'is', 'op', 'te', 'en', 'voor', 'met'],
    'sv': ['och', 'är', 'det', 'en', 'att', 'som', 'för', 'på', 'av', 'med'],
    'pl': ['to', 'jest', 'się', 'nie', 'na', 'w', 'z', 'do', 'od', 'dla'],
    'tr': ['bir', 've', 'bu', 'için', 'ile', 'var', 'mi', 'ne', 'ben', 'sen'],
  };

  for (const [lang, words] of Object.entries(commonWords)) {
    const matches = words.filter(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lowerText);
    });
    if (matches.length >= 2) {
      return lang;
    }
  }

  // Default to English
  return 'en';
};

// Rate limiting
const MAX_REQUESTS_PER_MINUTE = 30;
const REQUEST_INTERVAL = 60000 / MAX_REQUESTS_PER_MINUTE;
let lastRequestTime = 0;

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    const waitTime = REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

export const translateText = async (text, targetLanguage) => {
  console.log('[Translation Service] translateText called');

  if (!text || !text.trim()) {
    return {
      success: false,
      error: 'Text is required for translation',
    };
  }

  if (!LANGUAGES[targetLanguage]) {
    return {
      success: false,
      error: 'Invalid target language',
    };
  }

  await waitForRateLimit();

  try {
    console.log(`[Translation Service] Translating "${text.substring(0, 50)}..." to ${targetLanguage}`);
    
    // Detect source language
    const detectedLang = detectLanguage(text);
    console.log(`[Translation Service] Detected language: ${detectedLang}`);
    
    // If already in target language, return as is
    if (detectedLang === targetLanguage) {
      return {
        success: true,
        translatedText: text,
        detectedLanguage: LANGUAGES[detectedLang] || 'Unknown',
        model: 'no-translation-needed',
      };
    }
    
    const sourceCode = mapToMyMemoryCode(detectedLang);
    const targetCode = mapToMyMemoryCode(targetLanguage);
    
    // MyMemory API call with explicit source language
    const response = await axios.get(MYMEMORY_API_URL, {
      params: {
        q: text,
        langpair: `${sourceCode}|${targetCode}`,
        de: process.env.MYMEMORY_EMAIL || 'voxa.translation@gmail.com',
      },
      timeout: 10000,
    });

    const data = response.data;

    if (data.responseStatus === 200 || data.responseStatus === '200') {
      const translatedText = data.responseData.translatedText;

      console.log('[Translation Service] Translation successful');
      
      return {
        success: true,
        translatedText: translatedText,
        detectedLanguage: LANGUAGES[detectedLang] || 'Unknown',
        model: 'mymemory-free',
      };
    } else {
      console.error('[Translation Service] API returned error:', data);
      return {
        success: false,
        error: data.responseDetails || 'Translation failed',
      };
    }
  } catch (error) {
    console.error('[Translation Service] Translation error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Translation request timed out. Please try again.',
      };
    }
    
    if (error.response?.status === 429) {
      return {
        success: false,
        error: 'Daily limit reached (50,000 chars). Try again tomorrow.',
      };
    }

    if (error.response?.status === 403) {
      return {
        success: false,
        error: 'Translation service temporarily unavailable. Please try again.',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Translation failed. Please try again.',
    };
  }
};

export const getSupportedLanguages = () => {
  console.log('[Translation Service] getSupportedLanguages called');
  return Object.entries(LANGUAGES).map(([code, name]) => ({
    code,
    name,
  }));
};

export const getLanguageName = (code) => {
  return LANGUAGES[code] || code;
};

export const checkHealth = () => {
  console.log('[Translation Service] Health check');
  
  return {
    status: 'ok',
    hasApiKey: true,
    supportedLanguages: Object.keys(LANGUAGES).length,
    provider: 'MyMemory Translation API',
    freeLimit: '50,000 characters per day',
    notes: 'Completely free, no billing required',
  };
};
