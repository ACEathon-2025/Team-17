// server/routes/userRoutes.js
import express from 'express'
import { authenticateUser, optionalAuth } from '../middlewares/auth.js'
import {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  getProgress,
  getAchievements,
  addAchievement
} from '../controllers/userController.js'

const router = express.Router()

// User profile routes
router.get('/profile/:userId', optionalAuth, getProfile)
router.put('/profile/:userId', authenticateUser, updateProfile)

// User settings routes
router.get('/settings/:userId', optionalAuth, getSettings)
router.put('/settings/:userId', authenticateUser, updateSettings)

// User progress routes
router.get('/progress/:userId', optionalAuth, getProgress)

// User achievements routes
router.get('/achievements/:userId', optionalAuth, getAchievements)
router.post('/achievements/:userId', authenticateUser, addAchievement)

export default router