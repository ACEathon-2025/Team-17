import express from 'express';
import * as translationService from '../services/translationService.js';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`[Translation Route] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint - MUST be before any other routes
router.get('/health', (req, res) => {
  try {
    console.log('[Translation] Health check requested');
    const health = translationService.checkHealth();
    console.log('[Translation] Health status:', health);
    res.json(health);
  } catch (error) {
    console.error('[Translation] Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      hasApiKey: false
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  try {
    console.log('[Translation] Languages requested');
    const languages = translationService.getSupportedLanguages();
    console.log(`[Translation] Returning ${languages.length} languages`);
    res.json(languages);
  } catch (error) {
    console.error('[Translation] Languages error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch languages',
      message: error.message 
    });
  }
});

// Translate text
router.post('/translate', async (req, res) => {
  try {
    console.log('[Translation] Translate request received');
    console.log('[Translation] Body:', req.body);
    
    const { text, targetLanguage } = req.body;

    if (!text) {
      console.log('[Translation] Missing text');
      return res.status(400).json({ 
        success: false,
        error: 'Text is required' 
      });
    }

    if (!targetLanguage) {
      console.log('[Translation] Missing target language');
      return res.status(400).json({ 
        success: false,
        error: 'Target language is required' 
      });
    }

    console.log(`[Translation] Translating "${text.substring(0, 50)}..." to ${targetLanguage}`);
    const result = await translationService.translateText(text, targetLanguage);
    console.log('[Translation] Result:', result.success ? 'Success' : 'Failed');
    
    res.json(result);
  } catch (error) {
    console.error('[Translation] Route error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Translation failed',
      message: error.message 
    });
  }
});

// Catch-all for undefined routes
router.all('*', (req, res) => {
  console.log(`[Translation] 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Translation route not found',
    path: req.path,
    availableRoutes: [
      'GET /api/translation/health',
      'GET /api/translation/languages',
      'POST /api/translation/translate'
    ]
  });
});

export default router;
