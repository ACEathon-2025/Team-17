// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext.jsx'
import { api, cachedApiCall } from '../utils/api'

const UserContext = createContext({})

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [readingProgress, setReadingProgress] = useState([])
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({
    totalTextsRead: 0,
    totalReadingTime: 0,
    readingStreak: 0,
    averageSessionTime: 0
  })
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    fontFamily: 'lexend',
    wordSpacing: 'normal',
    readingSpeed: 1.0,
    voice: 'default',
    autoPlay: false,
    highlightReading: true,
    showProgress: true,
    dyslexiaFriendly: true,
    language: 'en',
    // Focus Mode Settings
    focusModeSpeed: 200,
    focusWordByWord: false,
    focusPauseTime: 500,
    // Translation Settings
    preferredTranslationLanguage: 'es',
    autoTranslate: true
  })
  const [loading, setLoading] = useState(false)

  // Refs to track last fetch times
  const lastFetchRef = useRef({
    profile: 0,
    progress: 0,
    achievements: 0,
    settings: 0,
    stats: 0
  })

  // Minimum time between requests (10 minutes to reduce server load)
  const MIN_FETCH_INTERVAL = 10 * 60 * 1000

  // Load settings from localStorage immediately
  useEffect(() => {
    const savedSettings = localStorage.getItem(`voxa-settings-${user?.id || 'guest'}`)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
        applySettingsToDocument(parsed)
      } catch (error) {
        console.error('Error loading settings from localStorage:', error)
      }
    }
  }, [user])

  useEffect(() => {
    if (user) {
      // Only fetch on initial load, then rely on local state
      fetchUserData()
    } else {
      resetUserData()
    }
  }, [user])

  const resetUserData = () => {
    setUserProfile(null)
    setReadingProgress([])
    setAchievements([])
    setStats({
      totalTextsRead: 0,
      totalReadingTime: 0,
      readingStreak: 0,
      averageSessionTime: 0
    })
  }

  const shouldFetch = (key) => {
    const now = Date.now()
    const lastFetch = lastFetchRef.current[key]
    return now - lastFetch > MIN_FETCH_INTERVAL
  }

  const updateLastFetch = (key) => {
    lastFetchRef.current[key] = Date.now()
  }

  const fetchUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Use cached API calls to reduce load
      const promises = []

      if (shouldFetch('settings')) {
        promises.push(
          cachedApiCall(`settings-${user.id}`, () => api.get(`/users/settings/${user.id}`))
            .then(data => {
              if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }))
                // Save to localStorage
                localStorage.setItem(`voxa-settings-${user.id}`, JSON.stringify(data))
                applySettingsToDocument(data)
              }
              updateLastFetch('settings')
              return data
            })
            .catch(() => ({ data: {} }))
        )
      }

      if (shouldFetch('stats')) {
        promises.push(
          cachedApiCall(`stats-${user.id}`, () => api.get(`/reading/stats/${user.id}`))
            .then(data => {
              if (data) setStats(prev => ({ ...prev, ...data }))
              updateLastFetch('stats')
              return data
            })
            .catch(() => ({ data: {} }))
        )
      }

      if (shouldFetch('progress')) {
        promises.push(
          cachedApiCall(`progress-${user.id}`, () => api.get(`/reading/activity/${user.id}?limit=10`))
            .then(data => {
              setReadingProgress(Array.isArray(data) ? data : [])
              updateLastFetch('progress')
              return data
            })
            .catch(() => ({ data: [] }))
        )
      }

      if (shouldFetch('achievements')) {
        promises.push(
          cachedApiCall(`achievements-${user.id}`, () => api.get(`/users/achievements/${user.id}`))
            .then(data => {
              setAchievements(Array.isArray(data) ? data : [])
              updateLastFetch('achievements')
              return data
            })
            .catch(() => ({ data: [] }))
        )
      }

      if (shouldFetch('profile')) {
        promises.push(
          cachedApiCall(`profile-${user.id}`, () => api.get(`/users/profile/${user.id}`))
            .then(data => {
              setUserProfile(data)
              updateLastFetch('profile')
              return data
            })
            .catch(() => ({ data: null }))
        )
      }

      await Promise.allSettled(promises)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put(`/users/profile/${user.id}`, profileData)
      setUserProfile(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error }
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      // Update local state immediately for responsive UI
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)

      // Save to localStorage immediately
      localStorage.setItem(`voxa-settings-${user.id}`, JSON.stringify(updatedSettings))

      // Apply settings immediately
      applySettingsToDocument(updatedSettings)

      // Update server in background (non-blocking)
      api.put(`/users/settings/${user.id}`, updatedSettings)
        .then(() => {
          updateLastFetch('settings')
        })
        .catch(error => {
          console.error('Error syncing settings to server:', error)
          // Settings are still saved locally, so this is not critical
        })

      return { success: true, data: updatedSettings }
    } catch (error) {
      console.error('Error updating settings:', error)
      // Still return success since local update worked
      return { success: true, data: newSettings }
    }
  }

  const applySettingsToDocument = (newSettings) => {
    const root = document.documentElement

    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
      xxl: '24px'
    }
    root.style.setProperty('--base-font-size', fontSizeMap[newSettings.fontSize] || '16px')

    const lineHeightMap = {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    }
    root.style.setProperty('--base-line-height', lineHeightMap[newSettings.lineHeight] || '1.5')

    const letterSpacingMap = {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }
    root.style.setProperty('--base-letter-spacing', letterSpacingMap[newSettings.letterSpacing] || '0')

    const wordSpacingMap = {
      tight: '0',
      normal: '0.1em',
      wide: '0.2em',
      wider: '0.3em'
    }
    root.style.setProperty('--word-spacing', wordSpacingMap[newSettings.wordSpacing] || '0.1em')

    // Background overlay
    if (newSettings.backgroundOverlay) {
      root.classList.add('background-overlay')
    } else {
      root.classList.remove('background-overlay')
    }

    // Dyslexia friendly
    if (newSettings.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly')
    } else {
      root.classList.remove('dyslexia-friendly')
    }
  }

  const saveReadingProgress = async (textId, progressData) => {
  try {
    if (!user || !user.id) {
      console.warn('No user logged in, progress not saved')
      return { success: false, error: 'No user' }
    }

    // Prepare session data
    const sessionData = {
      userId: user.id,
      textId: textId || `session-${Date.now()}`,
      text: progressData.text || progressData.summary || 'Reading Session',
      completed: progressData.completed || false,
      duration: progressData.duration || 0,
      sessionType: progressData.sessionType || 'regular',
      progress: progressData.progress || 0
    }

    // Calculate words read
    const text = sessionData.text || ''
    const wordsRead = text.split(/\s+/).filter(w => w.trim()).length

    // Update local stats IMMEDIATELY for responsive UI
    setStats(prev => ({
      ...prev,
      totalTextsRead: sessionData.completed ? (prev.totalTextsRead || 0) + 1 : (prev.totalTextsRead || 0),
      totalReadingTime: (prev.totalReadingTime || 0) + sessionData.duration,
      lastReadingDate: new Date()
    }))

    // Add to local reading progress IMMEDIATELY
    const newSession = {
      _id: sessionData.textId,
      title: sessionData.text.substring(0, 50) + (sessionData.text.length > 50 ? '...' : ''),
      content: sessionData.text,
      sessionType: sessionData.sessionType,
      progress: { 
        percentage: sessionData.progress,
        completed: sessionData.completed 
      },
      duration: sessionData.duration,
      wordsRead: wordsRead,
      createdAt: new Date()
    }
    
    setReadingProgress(prev => [newSession, ...prev.slice(0, 49)]) // Keep last 50

    // Update streak locally
    const newStreak = calculateLocalStreak([newSession, ...readingProgress])
    setStats(prev => ({
      ...prev,
      readingStreak: newStreak
    }))

    // Save to server in background (non-blocking)
    api.post('/reading/progress', sessionData)
      .then(() => {
        console.log('Progress synced to server')
        // Clear cache to force fresh data on next fetch
        localStorage.removeItem(`voxa-cache-progress-${user.id}`)
        localStorage.removeItem(`voxa-cache-stats-${user.id}`)
      })
      .catch(error => {
        console.error('Error saving progress to server:', error)
        // Still works locally!
      })

    return { success: true, session: newSession }
  } catch (error) {
    console.error('Error saving progress:', error)
    return { success: false, error }
  }
}

// Helper function to calculate streak locally
const calculateLocalStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0
  
  const dates = sessions
    .map(s => {
      const date = new Date(s.createdAt)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => b - a)

  if (dates.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayTime = yesterday.getTime()

  if (dates[0] !== todayTime && dates[0] !== yesterdayTime) {
    return 0
  }

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


  const addAchievement = async (achievement) => {
    try {
      // Add to local state immediately
      const newAchievement = {
        ...achievement,
        earnedAt: new Date(),
        id: `achievement-${Date.now()}`
      }
      setAchievements(prev => [...prev, newAchievement])

      // Save to server in background
      api.post(`/users/achievements/${user.id}`, achievement)
        .catch(error => {
          console.error('Error syncing achievement to server:', error)
        })

      return { success: true, data: newAchievement }
    } catch (error) {
      console.error('Error adding achievement:', error)
      return { success: false, error }
    }
  }

  const updateReadingStreak = async () => {
    try {
      // Update locally first
      const today = new Date()
      const lastReading = stats.lastReadingDate ? new Date(stats.lastReadingDate) : null

      let newStreak = stats.readingStreak || 0

      if (lastReading) {
        const daysDiff = Math.floor((today - lastReading) / (1000 * 60 * 60 * 24))
        if (daysDiff === 0) {
          // Same day
          return { success: true, data: { streak: newStreak } }
        } else if (daysDiff === 1) {
          // Consecutive day
          newStreak += 1
        } else {
          // Streak broken
          newStreak = 1
        }
      } else {
        newStreak = 1
      }

      setStats(prev => ({
        ...prev,
        readingStreak: newStreak,
        lastReadingDate: today
      }))

      // Sync to server in background
      api.put(`/reading/streak/${user.id}`)
        .catch(error => {
          console.error('Error syncing streak to server:', error)
        })

      return { success: true, data: { streak: newStreak } }
    } catch (error) {
      console.error('Error updating streak:', error)
      return { success: false, error }
    }
  }

  const value = {
    userProfile,
    readingProgress,
    achievements,
    stats,
    settings,
    loading,
    updateUserProfile,
    updateSettings,
    saveReadingProgress,
    addAchievement,
    updateReadingStreak,
    fetchUserData
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
