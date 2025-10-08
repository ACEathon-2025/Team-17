// server/routes/readingRoutes.js
import express from 'express'
import { authenticateUser, optionalAuth } from '../middlewares/auth.js'
import {
  saveProgress,
  getReadingHistory,
  getReadingStats,
  updateReadingStreak,
  getRecentActivity
} from '../controllers/readingController.js'

const router = express.Router()

// Reading progress routes
router.post('/progress', optionalAuth, saveProgress)
router.get('/history/:userId', optionalAuth, getReadingHistory)
router.get('/stats/:userId', optionalAuth, getReadingStats)
router.put('/streak/:userId', optionalAuth, updateReadingStreak)
router.get('/activity/:userId', optionalAuth, getRecentActivity)

export default router