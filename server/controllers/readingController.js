// server/controllers/readingController.js
import ReadingSession from '../models/ReadingSession.model.js'
import User from '../models/User.model.js'

// Update saveProgress function
export const saveProgress = async (req, res) => {
  try {
    const { userId, textId, progress, text, completed, duration, sessionType } = req.body
    
    // Calculate words
    const wordsRead = text ? text.split(/\s+/).filter(w => w.trim()).length : 0
    
    const session = new ReadingSession({
      userId,
      textId: textId || `session-${Date.now()}`,
      title: text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : 'Reading Session',
      content: text || '',
      sessionType: sessionType || 'regular',
      progress: {
        percentage: progress || 0,
        completed: completed || false
      },
      duration: duration || 0,
      wordsRead: wordsRead
    })
    
    await session.save()
    
    // Update user stats
    const updateData = {
      $set: { 
        'stats.lastReadingDate': new Date(),
        updatedAt: Date.now()
      }
    }
    
    if (completed) {
      updateData.$inc = { 
        'stats.totalTextsRead': 1,
        'stats.totalReadingTime': duration || 0
      }
    } else {
      updateData.$inc = { 
        'stats.totalReadingTime': duration || 0
      }
    }
    
    await User.findOneAndUpdate(
      { supabaseId: userId },
      updateData,
      { upsert: true, new: true }
    )
    
    // Update reading streak
    const newStreak = await updateUserStreak(userId)
    
    res.json({ 
      success: true, 
      session,
      streak: newStreak
    })
  } catch (error) {
    console.error('Error saving reading progress:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    })
  }
}


export const getReadingHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const sessions = await ReadingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await ReadingSession.countDocuments({ userId })
    
    res.json({
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reading history:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getReadingStats = async (req, res) => {
  try {
    const { userId } = req.params
    
    let user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      // Create user if doesn't exist
      user = new User({
        supabaseId: userId,
        email: 'unknown@example.com',
        stats: {
          totalTextsRead: 0,
          totalReadingTime: 0,
          readingStreak: 0
        }
      })
      await user.save()
    }
    
    // Calculate additional stats from sessions
    const sessions = await ReadingSession.find({ userId })
    const totalSessions = sessions.length
    const completedSessions = sessions.filter(s => s.progress.completed).length
    const averageSessionTime = totalSessions > 0 
      ? sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / totalSessions
      : 0
    
    // Calculate words per minute
    const totalWordsRead = sessions.reduce((acc, session) => acc + (session.wordsRead || 0), 0)
    const totalTimeInMinutes = (user.stats.totalReadingTime || 0) / (1000 * 60)
    const wordsPerMinute = totalTimeInMinutes > 0 ? Math.round(totalWordsRead / totalTimeInMinutes) : 0
    
    res.json({
      totalTextsRead: user.stats.totalTextsRead || 0,
      totalReadingTime: user.stats.totalReadingTime || 0,
      readingStreak: user.stats.readingStreak || 0,
      averageSessionTime: Math.round(averageSessionTime),
      totalSessions,
      completedSessions,
      wordsPerMinute,
      lastReadingDate: user.stats.lastReadingDate
    })
  } catch (error) {
    console.error('Error fetching reading stats:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateReadingStreak = async (req, res) => {
  try {
    const { userId } = req.params
    const newStreak = await updateUserStreak(userId)
    res.json({ streak: newStreak })
  } catch (error) {
    console.error('Error updating reading streak:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Helper function to update user streak
const updateUserStreak = async (userId) => {
  try {
    let user = await User.findOne({ supabaseId: userId })
    
    if (!user) {
      user = new User({
        supabaseId: userId,
        email: 'unknown@example.com',
        stats: { readingStreak: 1, lastReadingDate: new Date() }
      })
      await user.save()
      return 1
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastReading = user.stats.lastReadingDate
    let newStreak = user.stats.readingStreak || 0
    
    if (lastReading) {
      const lastReadingDate = new Date(lastReading)
      lastReadingDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today - lastReadingDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 0) {
        // Same day, no change to streak
        return newStreak
      } else if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1
      }
    } else {
      // First reading
      newStreak = 1
    }
    
    await User.findOneAndUpdate(
      { supabaseId: userId },
      { 
        $set: {
          'stats.readingStreak': newStreak,
          'stats.lastReadingDate': new Date(),
          updatedAt: Date.now()
        }
      }
    )
    
    return newStreak
  } catch (error) {
    console.error('Error updating user streak:', error)
    return 0
  }
}

export const getRecentActivity = async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 10 } = req.query
    
    const sessions = await ReadingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('title content sessionType progress duration createdAt')
    
    const activity = sessions.map(session => ({
      id: session._id,
      text: session.title || 'Reading Session',
      progress: session.progress.percentage || 0,
      time: session.createdAt,
      type: session.sessionType || 'regular',
      duration: session.duration || 0
    }))
    
    res.json(activity)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    res.status(500).json({ message: 'Server error' })
  }
}