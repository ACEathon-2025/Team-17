import User from '../models/User.model.js'

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params
    
    // Try to find existing user
    let user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      // Get email from authenticated user or generate unique one
      const email = req.user?.email || `user-${userId}-${Date.now()}@voxa.app`
      
      try {
        // Create new user with valid email
        user = new User({
          supabaseId: userId,
          email: email,
          profile: {
            firstName: req.user?.user_metadata?.name || 'User',
            avatar: '👤'
          }
        })
        await user.save()
      } catch (createError) {
        // Handle duplicate key error (E11000)
        if (createError.code === 11000) {
          // Try to find the user again (might have been created by another request)
          user = await User.findOne({ supabaseId: userId })
          
          if (!user) {
            // Last resort: create with unique timestamp email
            user = new User({
              supabaseId: userId,
              email: `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@voxa.app`,
              profile: {
                firstName: 'User',
                avatar: '👤'
              }
            })
            await user.save()
          }
        } else {
          throw createError
        }
      }
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body
    
    // Remove fields that shouldn't be updated directly
    delete updates.supabaseId
    delete updates.email
    delete updates.createdAt
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          ...updates,
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: false } // Don't upsert, user should exist
    )
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    })
  }
}

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      // Return default settings instead of 404
      return res.json({
        fontSize: 'medium',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        readingSpeed: 1.0,
        voice: 'default',
        autoPlay: false,
        highlightReading: true,
        showProgress: true,
        language: 'en'
      })
    }
    
    res.json(user.settings || {})
  } catch (error) {
    console.error('Error fetching user settings:', error)
    // Return default settings on error instead of 500
    res.json({
      fontSize: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      readingSpeed: 1.0,
      voice: 'default',
      autoPlay: false,
      highlightReading: true,
      showProgress: true,
      language: 'en'
    })
  }
}

// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params
    const settings = req.body
    
    const user = await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          settings: settings,
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: false }
    )
    
    if (!user) {
      // If user doesn't exist, still return the settings they tried to save
      return res.json(settings)
    }
    
    res.json(user.settings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    // Return the settings they tried to save even on error
    res.json(settings)
  }
}

// Get user progress
export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params
    
    const user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      return res.json([])
    }
    
    // Return reading sessions from user or empty array
    res.json(user.readingSessions || [])
  } catch (error) {
    console.error('Error fetching user progress:', error)
    res.json([])
  }
}

// Get user achievements
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
    res.json([])
  }
}

// Add user achievement
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
            id: achievement.id || `achievement-${Date.now()}`,
            earnedAt: new Date()
          }
        },
        $set: { updatedAt: Date.now() }
      },
      { new: true, upsert: false }
    )
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user.achievements)
  } catch (error) {
    console.error('Error adding achievement:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    })
  }
}
