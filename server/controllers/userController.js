// server/controllers/userController.js
import User from '../models/User.model.js'

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params
    
    let user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      // Create user profile if doesn't exist
      user = new User({
        supabaseId: userId,
        email: req.user?.email || 'unknown@example.com'
      })
      await user.save()
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          ...updates,
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    )
    
    res.json(user)
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user.settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params
    const settings = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          settings: { ...settings },
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    )
    
    res.json(user.settings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params
    
    // This would typically fetch reading sessions
    // For now, return mock data
    const progress = [
      {
        id: '1',
        title: 'Sample Reading',
        progress: 75,
        date: new Date().toISOString()
      }
    ]
    
    res.json(progress)
  } catch (error) {
    console.error('Error fetching user progress:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAchievements = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      return res.json([])
    }
    
    res.json(user.achievements || [])
  } catch (error) {
    console.error('Error fetching user achievements:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const addAchievement = async (req, res) => {
  try {
    const { userId } = req.params
    const achievement = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $push: {
          achievements: {
            ...achievement,
            earnedAt: new Date()
          }
        },
        $set: { updatedAt: Date.now() }
      },
      { new: true, upsert: true }
    )
    
    res.json(user.achievements)
  } catch (error) {
    console.error('Error adding achievement:', error)
    res.status(500).json({ message: 'Server error' })
  }
}