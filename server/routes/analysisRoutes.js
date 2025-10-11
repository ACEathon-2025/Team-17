import express from 'express'
import upload from '../config/multer.js'
import { optionalAuth, authenticateUser } from '../middlewares/auth.js'
import {
  saveAnalysis,
  uploadImage,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getAnalysisStats
} from '../controllers/analysisController.js'

const router = express.Router()

// Upload image only
router.post('/upload', optionalAuth, upload.single('image'), uploadImage)

// Save analysis results (from frontend AI)
router.post('/save', optionalAuth, saveAnalysis)

// Get analysis history
router.get('/history/:userId', optionalAuth, getAnalysisHistory)

// Get single analysis
router.get('/:analysisId', optionalAuth, getAnalysisById)

// Delete analysis
router.delete('/:analysisId', authenticateUser, deleteAnalysis)

// Get user stats
router.get('/stats/:userId', optionalAuth, getAnalysisStats)

export default router
