import express from 'express';
import { summarizationService } from '../services/summarizationService.js';

const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Summarization Route] ${req.method} ${req.path}`);
  next();
});

// Summarize text
router.post('/summarize', async (req, res) => {
  try {
    const { text, options } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    console.log(`[Summarization] Request for ${text.split(/\s+/).length} words`);

    const result = await summarizationService.summarizeText(text, options);
    
    if (result.success) {
      res.json(result);
    } else if (result.loading) {
      res.status(503).json(result); // Service Unavailable
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('[Summarization] Route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get summary statistics
router.post('/stats', async (req, res) => {
  try {
    const { originalText, summaryText } = req.body;

    if (!originalText || !summaryText) {
      return res.status(400).json({
        success: false,
        error: 'Both original and summary text are required'
      });
    }

    const stats = summarizationService.getSummaryStats(originalText, summaryText);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[Summarization] Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate statistics'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'summarization',
    model: 'facebook/bart-large-cnn',
    provider: 'Hugging Face'
  });
});

export default router;
