export const analyticsService = {
  /**
   * Calculate reading statistics from sessions
   */
  calculateStats(sessions) {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalWords: 0,
        totalMinutes: 0,
        avgWordsPerMinute: 0,
        completionRate: 0,
        favoriteFeature: 'None',
        featureBreakdown: {}
      }
    }

    const totalSessions = sessions.length
    const totalWords = sessions.reduce((sum, s) => sum + (s.wordsRead || 0), 0)
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60000
    const completedSessions = sessions.filter(s => s.progress?.completed).length
    
    // Calculate feature usage
    const featureCount = {}
    sessions.forEach(s => {
      const type = s.sessionType || 'regular'
      featureCount[type] = (featureCount[type] || 0) + 1
    })
    
    const favoriteFeature = Object.keys(featureCount).length > 0
      ? Object.keys(featureCount).reduce((a, b) => 
          featureCount[a] > featureCount[b] ? a : b
        )
      : 'None'

    return {
      totalSessions,
      totalWords,
      totalMinutes: Math.round(totalMinutes),
      avgWordsPerMinute: totalMinutes > 0 ? Math.round(totalWords / totalMinutes) : 0,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      favoriteFeature: this.formatFeatureName(favoriteFeature),
      featureBreakdown: featureCount
    }
  },

  /**
   * Generate AI-powered insights
   */
  generateInsights(stats, sessions) {
    const insights = []

    // Reading speed insight
    if (stats.avgWordsPerMinute > 0) {
      if (stats.avgWordsPerMinute < 150) {
        insights.push({
          type: 'speed',
          icon: '🐢',
          title: 'Take Your Time',
          message: `Your reading speed is ${stats.avgWordsPerMinute} WPM. Focus on comprehension over speed!`,
          color: 'blue'
        })
      } else if (stats.avgWordsPerMinute > 250) {
        insights.push({
          type: 'speed',
          icon: '🚀',
          title: 'Speed Reader!',
          message: `Impressive ${stats.avgWordsPerMinute} WPM! You're reading faster than average.`,
          color: 'green'
        })
      } else {
        insights.push({
          type: 'speed',
          icon: '✨',
          title: 'Great Pace',
          message: `Your ${stats.avgWordsPerMinute} WPM is perfect for comprehension and speed.`,
          color: 'purple'
        })
      }
    }

    // Completion rate insight
    if (stats.completionRate < 50 && stats.totalSessions > 5) {
      insights.push({
        type: 'completion',
        icon: '🎯',
        title: 'Finish What You Start',
        message: `You complete ${stats.completionRate}% of sessions. Try shorter texts to build the habit!`,
        color: 'orange'
      })
    } else if (stats.completionRate > 80 && stats.totalSessions > 3) {
      insights.push({
        type: 'completion',
        icon: '🏆',
        title: 'Dedicated Reader',
        message: `${stats.completionRate}% completion rate! Your consistency is outstanding.`,
        color: 'green'
      })
    }

    // Feature usage insight
    if (stats.favoriteFeature !== 'None' && stats.totalSessions > 10) {
      insights.push({
        type: 'feature',
        icon: '⭐',
        title: 'Favorite Feature',
        message: `You love using ${stats.favoriteFeature}! Try other features for variety.`,
        color: 'purple'
      })
    }

    // Activity insight
    if (stats.totalSessions < 5) {
      insights.push({
        type: 'activity',
        icon: '🌱',
        title: 'Just Getting Started',
        message: 'Keep going! Reading regularly improves comprehension and focus.',
        color: 'green'
      })
    } else if (stats.totalSessions > 50) {
      insights.push({
        type: 'activity',
        icon: '🔥',
        title: 'Power User',
        message: `${stats.totalSessions} sessions! You're a VOXA champion!`,
        color: 'red'
      })
    }

    // Encourage trying new features
    if (Object.keys(stats.featureBreakdown).length === 1 && stats.totalSessions > 5) {
      insights.push({
        type: 'explore',
        icon: '🎨',
        title: 'Explore More',
        message: 'Try our AI Summarization, Translation, or Focus Mode for a complete experience!',
        color: 'blue'
      })
    }

    return insights
  },

  /**
   * Format feature names
   */
  formatFeatureName(feature) {
    const names = {
      'text-to-speech': 'Text-to-Speech',
      'translation': 'Translation',
      'focus-mode': 'Focus Mode',
      'summarization': 'AI Summarization',
      'regular': 'General Reading'
    }
    return names[feature] || feature
  },

  /**
   * Get weekly activity data for charts
   */
  getWeeklyActivity(sessions) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.createdAt)
        return sessionDate >= date && sessionDate < nextDate
      })

      weekData.push({
        day: days[date.getDay()],
        sessions: daySessions.length,
        words: daySessions.reduce((sum, s) => sum + (s.wordsRead || 0), 0),
        minutes: Math.round(daySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60000)
      })
    }

    return weekData
  },

  /**
   * Calculate reading streak from sessions
   */
  calculateStreak(sessions) {
    if (!sessions || sessions.length === 0) return 0

    // Get unique dates
    const dates = sessions
      .map(s => {
        const date = new Date(s.createdAt)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => b - a) // Most recent first

    if (dates.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTime = today.getTime()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayTime = yesterday.getTime()

    // Must have read today or yesterday to have an active streak
    if (dates[0] !== todayTime && dates[0] !== yesterdayTime) {
      return 0
    }

    // Count consecutive days
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)
      expectedDate.setHours(0, 0, 0, 0)
      const expectedTime = expectedDate.getTime()

      if (dates[i] === expectedTime) {
        streak++
      } else {
        break
      }
    }

    return streak
  }
}
