/**
 * Goals Service - Reading goals, challenges, and habit tracking
 */

const STORAGE_KEY = 'voxa-reading-goals'
const CHALLENGES_KEY = 'voxa-challenges'

export const goalsService = {
  /**
   * Get user's goals
   */
  getGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : this.getDefaultGoals()
    } catch (error) {
      console.error('Error loading goals:', error)
      return this.getDefaultGoals()
    }
  },

  /**
   * Default goals structure
   */
  getDefaultGoals() {
    return {
      daily: {
        type: 'words', // 'words' or 'minutes'
        target: 1000,
        current: 0,
        lastUpdated: Date.now(),
        streak: 0,
        longestStreak: 0
      },
      weekly: {
        target: 5, // days
        current: 0,
        daysCompleted: [],
        startOfWeek: this.getStartOfWeek()
      },
      monthly: {
        target: 20000, // words
        current: 0,
        startOfMonth: this.getStartOfMonth()
      }
    }
  },

  /**
   * Save goals
   */
  saveGoals(goals) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
      return true
    } catch (error) {
      console.error('Error saving goals:', error)
      return false
    }
  },

  /**
   * Update daily progress
   */
  updateDailyProgress(wordsRead, timeSpent) {
    const goals = this.getGoals()
    const today = new Date().toDateString()
    const lastUpdated = new Date(goals.daily.lastUpdated).toDateString()

    // Check if it's a new day
    if (today !== lastUpdated) {
      // Check if streak should continue
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      if (lastUpdated === yesterday && goals.daily.current >= goals.daily.target) {
        // Continue streak
        goals.daily.streak++
        goals.daily.longestStreak = Math.max(goals.daily.longestStreak, goals.daily.streak)
      } else if (lastUpdated !== yesterday) {
        // Break streak
        goals.daily.streak = 0
      }

      // Reset daily progress
      goals.daily.current = 0
      goals.daily.lastUpdated = Date.now()
    }

    // Update progress
    if (goals.daily.type === 'words') {
      goals.daily.current += wordsRead
    } else {
      goals.daily.current += Math.floor(timeSpent / 60000) // Convert to minutes
    }

    // Update weekly progress
    if (!goals.weekly.daysCompleted.includes(today)) {
      if (goals.daily.current >= goals.daily.target) {
        goals.weekly.daysCompleted.push(today)
        goals.weekly.current = goals.weekly.daysCompleted.length
      }
    }

    // Update monthly progress
    goals.monthly.current += wordsRead

    // Check if we need to reset weekly/monthly
    const currentWeekStart = this.getStartOfWeek()
    if (goals.weekly.startOfWeek !== currentWeekStart) {
      goals.weekly.current = 0
      goals.weekly.daysCompleted = []
      goals.weekly.startOfWeek = currentWeekStart
    }

    const currentMonthStart = this.getStartOfMonth()
    if (goals.monthly.startOfMonth !== currentMonthStart) {
      goals.monthly.current = 0
      goals.monthly.startOfMonth = currentMonthStart
    }

    this.saveGoals(goals)
    return goals
  },

  /**
   * Set new goal target
   */
  setGoalTarget(period, value) {
    const goals = this.getGoals()
    
    if (period === 'daily') {
      goals.daily.target = value
    } else if (period === 'weekly') {
      goals.weekly.target = value
    } else if (period === 'monthly') {
      goals.monthly.target = value
    }

    this.saveGoals(goals)
    return goals
  },

  /**
   * Get start of week (Sunday)
   */
  getStartOfWeek() {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day
    const startOfWeek = new Date(now.setDate(diff))
    startOfWeek.setHours(0, 0, 0, 0)
    return startOfWeek.getTime()
  },

  /**
   * Get start of month
   */
  getStartOfMonth() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    startOfMonth.setHours(0, 0, 0, 0)
    return startOfMonth.getTime()
  },

  /**
   * Get challenges
   */
  getChallenges() {
    try {
      const data = localStorage.getItem(CHALLENGES_KEY)
      return data ? JSON.parse(data) : this.getDefaultChallenges()
    } catch (error) {
      console.error('Error loading challenges:', error)
      return this.getDefaultChallenges()
    }
  },

  /**
   * Default challenges
   */
  getDefaultChallenges() {
    return [
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Read for 7 consecutive days',
        type: 'streak',
        target: 7,
        current: 0,
        reward: 100,
        icon: '🔥',
        completed: false
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Read 5000 words in one day',
        type: 'daily-words',
        target: 5000,
        current: 0,
        reward: 50,
        icon: '⚡',
        completed: false
      },
      {
        id: 'knowledge-seeker',
        title: 'Knowledge Seeker',
        description: 'Complete 10 quizzes',
        type: 'quizzes',
        target: 10,
        current: 0,
        reward: 75,
        icon: '🧠',
        completed: false
      },
      {
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Translate text in 3 different languages',
        type: 'translations',
        target: 3,
        current: 0,
        reward: 60,
        icon: '🌍',
        completed: false
      },
      {
        id: 'summarizer',
        title: 'Summary Master',
        description: 'Generate 20 summaries',
        type: 'summaries',
        target: 20,
        current: 0,
        reward: 80,
        icon: '📝',
        completed: false
      }
    ]
  },

  /**
   * Save challenges
   */
  saveChallenges(challenges) {
    try {
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges))
      return true
    } catch (error) {
      console.error('Error saving challenges:', error)
      return false
    }
  },

  /**
   * Update challenge progress
   */
  updateChallengeProgress(type, amount = 1) {
    const challenges = this.getChallenges()
    let updated = false

    challenges.forEach(challenge => {
      if (challenge.type === type && !challenge.completed) {
        challenge.current = Math.min(challenge.current + amount, challenge.target)
        
        if (challenge.current >= challenge.target) {
          challenge.completed = true
          challenge.completedAt = Date.now()
          updated = true
        }
      }
    })

    if (updated) {
      this.saveChallenges(challenges)
    }

    return challenges
  },

  /**
   * Get statistics
   */
  getStats() {
    const goals = this.getGoals()
    const challenges = this.getChallenges()

    return {
      currentStreak: goals.daily.streak,
      longestStreak: goals.daily.longestStreak,
      dailyProgress: Math.round((goals.daily.current / goals.daily.target) * 100),
      weeklyProgress: Math.round((goals.weekly.current / goals.weekly.target) * 100),
      monthlyProgress: Math.round((goals.monthly.current / goals.monthly.target) * 100),
      challengesCompleted: challenges.filter(c => c.completed).length,
      totalChallenges: challenges.length,
      totalRewardsEarned: challenges
        .filter(c => c.completed)
        .reduce((sum, c) => sum + c.reward, 0)
    }
  }
}
