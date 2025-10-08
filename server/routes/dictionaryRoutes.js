import express from 'express';
import { dictionaryService } from '../services/dictionaryService.js';

const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Dictionary Route] ${req.method} ${req.path}`);
  next();
});

// Get word definition
router.get('/define/:word', async (req, res) => {
  try {
    const { word } = req.params;
    const { language = 'en' } = req.query;

    console.log(`[Dictionary] Looking up: ${word} (${language})`);

    const result = await dictionaryService.getWordDefinition(word, language);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('[Dictionary] Route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Batch word lookup
router.post('/batch', async (req, res) => {
  try {
    const { words } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid words array'
      });
    }

    console.log(`[Dictionary] Batch lookup for ${words.length} words`);

    const results = await dictionaryService.getBatchDefinitions(words);
    res.json(results);
  } catch (error) {
    console.error('[Dictionary] Batch route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'dictionary',
    provider: 'Free Dictionary API'
  });
});

export default router;
