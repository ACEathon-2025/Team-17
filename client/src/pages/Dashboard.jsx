import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Volume2, Languages, Focus, Award, Clock, BarChart3, Trophy, Flame, 
  ArrowRight, Zap, TrendingUp, Brain, FileText, Bookmark, Folder, Eye, Target, 
  Star, CheckCircle, Gamepad2, Users, Sparkles, Crown, Medal, Gift, Rocket,
  Activity, Calendar, ChevronRight, Play, PlusCircle, Smile
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useUser } from '../context/UserContext.jsx'
import { analyticsService } from '../services/analyticsService'
import InsightCard from '../components/InsightCard'
import WeeklyChart from '../components/WeeklyChart'
import { collectionsService } from '../services/collectionsService'
import { useEyeComfort } from '../context/EyeComfortContext'
import { goalsService } from '../services/goalsService'

const formatTimeAgo = (date) => {
  if (!date) return 'Just now'

  const now = new Date()
  const sessionDate = new Date(date)
  const diffInMs = now - sessionDate
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`
}

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { userProfile, readingProgress, achievements, stats, fetchUserData } = useUser()
  const [greeting, setGreeting] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 7 })
  const [lastFetch, setLastFetch] = useState(0)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [insights, setInsights] = useState([])
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const recentActivity = useMemo(() => {
    if (readingProgress && readingProgress.length > 0) {
      return readingProgress.slice(0, 5).map((session, index) => ({
        id: session._id || `session-${index}`,
        text: session.title || `Reading Session ${index + 1}`,
        progress: session.progress?.percentage || 0,
        time: formatTimeAgo(session.createdAt || new Date()),
        type: session.sessionType || 'regular'
      }))
    }
    return []
  }, [readingProgress])

  // ADD THIS - FIX FOR ERROR
  const recentAchievements = useMemo(() => {
    return achievements?.slice(-3).reverse() || []
  }, [achievements])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('voxa-game-stats') || '{}')
    setGamesPlayed(stats.gamesPlayed || 0)
  }, [])

  const fetchDataOptimized = useCallback(async () => {
    const now = Date.now()
    if (now - lastFetch > 300000) {
      try {
        await fetchUserData()
        setLastFetch(now)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
  }, [fetchUserData, lastFetch])

  useEffect(() => {
    if (user) {
      fetchDataOptimized()
    }
  }, [user, fetchDataOptimized])

  useEffect(() => {
    if (readingProgress && readingProgress.length > 0) {
      const calculatedStats = analyticsService.calculateStats(readingProgress)
      setAnalyticsData(calculatedStats)

      const generatedInsights = analyticsService.generateInsights(calculatedStats, readingProgress)
      setInsights(generatedInsights)

      const weekData = analyticsService.getWeeklyActivity(readingProgress)
      setWeeklyActivity(weekData)
    }
  }, [readingProgress])

  useEffect(() => {
    if (readingProgress && readingProgress.length > 0) {
      const today = new Date()
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
      startOfWeek.setHours(0, 0, 0, 0)

      const weeklyProgress = readingProgress.filter(session => {
        const sessionDate = new Date(session.createdAt)
        return sessionDate >= startOfWeek
      }).length

      setWeeklyGoal({ current: Math.min(weeklyProgress, 7), target: 7 })
    }
  }, [readingProgress])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const formatReadingTime = (milliseconds) => {
    if (!milliseconds) return '0m'
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const quickActions = [
    {
      title: 'Text to Speech',
      description: 'Listen to any text with natural AI voices',
      href: '/text-to-speech',
      icon: Volume2,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      emoji: '🎤',
      stats: '12 texts read today'
    },
    {
      title: 'Translation',
      description: 'Translate to 100+ languages instantly',
      href: '/translation',
      icon: Languages,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      emoji: '🌍',
      stats: '5 languages used'
    },
    {
      title: 'Focus Mode',
      description: 'Eliminate distractions & read better',
      href: '/focus-mode',
      icon: Focus,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      emoji: '🎯',
      stats: '2.5 hours focused'
    },
    {
      title: 'Summarize',
      description: 'Get instant AI-powered summaries',
      href: '/summarize',
      icon: FileText,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      emoji: '📝',
      stats: '8 texts summarized'
    },
    {
      title: 'Quiz Mode',
      description: 'Test your reading comprehension',
      href: '/quiz',
      icon: Brain,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      emoji: '🧠',
      stats: '85% average score'
    },
    {
      title: 'Speed Reading',
      description: 'Train & improve your reading speed',
      href: '/speed-reading',
      icon: Zap,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      emoji: '⚡',
      stats: '450 WPM current'
    },
    {
      title: 'Reading Games',
      description: 'Fun games to boost your skills',
      href: '/games',
      icon: Gamepad2,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      emoji: '🎮',
      stats: `${gamesPlayed} games played`
    },
    {
      title: 'Community',
      description: 'Connect with readers worldwide',
      href: '/community',
      icon: Users,
      gradient: 'from-purple-500 via-blue-500 to-cyan-500',
      emoji: '👥',
      stats: '1.2K active members'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-20">
      
      {/* MEGA HERO SECTION */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30"
        />
        
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-16 shadow-2xl relative overflow-hidden"
          >
            {/* Animated orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-8xl lg:text-9xl mb-6"
                  >
                    👋
                  </motion.div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 game-font leading-tight" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.3)', letterSpacing: '0.02em' }}>
                    {greeting},<br/>
                    <span className="bg-white/20 px-4 py-2 rounded-2xl inline-block mt-3">
                      {user.email?.split('@')[0]}!
                    </span>
                  </h1>
                  
                  <p className="text-2xl lg:text-3xl text-white/95 fun-font font-bold mb-8 leading-relaxed" style={{ lineHeight: '1.8', letterSpacing: '0.03em' }}>
                    Ready to continue your amazing reading journey? Let's make today count! 🚀✨
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link to="/focus-mode">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center space-x-3"
                      >
                        <Play className="h-6 w-6" />
                        <span>Start Reading</span>
                      </motion.button>
                    </Link>
                    <Link to="/community">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:bg-white/30 transition-all flex items-center space-x-3 border-2 border-white/30"
                      >
                        <Users className="h-6 w-6" />
                        <span>Join Community</span>
                      </motion.button>
                    </Link>
                  </div>
                </div>
                
                {/* Floating Stats Cards */}
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-white/20 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border-2 border-white/30 shadow-2xl"
                  >
                    <div className="text-6xl mb-4">🔥</div>
                    <div className="text-6xl lg:text-7xl font-black text-white game-font mb-2">
                      {stats.readingStreak || 0}
                    </div>
                    <div className="text-xl text-white/90 fun-font font-bold">
                      Day Streak
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="bg-white/20 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border-2 border-white/30 shadow-2xl"
                  >
                    <div className="text-6xl mb-4">🏆</div>
                    <div className="text-6xl lg:text-7xl font-black text-white game-font mb-2">
                      {achievements?.length || 0}
                    </div>
                    <div className="text-xl text-white/90 fun-font font-bold">
                      Achievements
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-white/20 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border-2 border-white/30 shadow-2xl"
                  >
                    <div className="text-6xl mb-4">📚</div>
                    <div className="text-6xl lg:text-7xl font-black text-white game-font mb-2">
                      {stats.totalTextsRead || 0}
                    </div>
                    <div className="text-xl text-white/90 fun-font font-bold">
                      Texts Read
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="bg-white/20 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border-2 border-white/30 shadow-2xl"
                  >
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="text-4xl lg:text-5xl font-black text-white game-font mb-2">
                      {formatReadingTime(stats.totalReadingTime || 0)}
                    </div>
                    <div className="text-xl text-white/90 fun-font font-bold">
                      Reading Time
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* QUICK ACTIONS - STUNNING GRID */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl shadow-xl">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                  Quick Actions
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 fun-font font-bold mt-2">
                  Choose your next reading adventure ⚡
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Link to={action.href}>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-6xl">{action.emoji}</span>
                          <div className={`p-4 bg-gradient-to-br ${action.gradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-3" style={{ letterSpacing: '0.02em' }}>
                          {action.title}
                        </h3>
                        
                        <p className="text-lg text-gray-600 dark:text-gray-400 fun-font font-bold mb-4 leading-relaxed" style={{ lineHeight: '1.8' }}>
                          {action.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-500 fun-font font-bold">
                            {action.stats}
                          </span>
                          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-black fun-font group-hover:translate-x-2 transition-transform">
                            <span className="text-lg">Go</span>
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

                {/* AI INSIGHTS - PREMIUM CARDS */}
        {insights.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl shadow-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                  AI-Powered Insights
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 fun-font font-bold mt-2">
                  Personalized recommendations just for you 🤖
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <InsightCard insight={insight} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TWO COLUMN LAYOUT: Activity Chart + Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* WEEKLY ACTIVITY - LARGE CARD */}
          {weeklyActivity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 lg:p-10 shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 h-full">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-xl">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                      Weekly Activity
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 fun-font font-bold mt-1">
                      Your reading progress this week 📊
                    </p>
                  </div>
                </div>
                <WeeklyChart data={weeklyActivity} />
              </div>
            </motion.div>
          )}

          {/* DAILY GOALS - PREMIUM CARD */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-[2rem] p-8 lg:p-10 shadow-2xl border-2 border-green-200 dark:border-green-800 h-full">
              {(() => {
                const goals = goalsService.getGoals()
                const goalStats = goalsService.getStats()

                return (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-xl">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                          Daily Goal
                        </h3>
                      </div>
                      <Link to="/goals">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 py-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl font-black fun-font text-base hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                        >
                          View All
                        </motion.button>
                      </Link>
                    </div>

                    {/* MEGA Progress Circle */}
                    <div className="flex items-center justify-center mb-10">
                      <div className="relative w-48 h-48">
                        <svg className="transform -rotate-90 w-48 h-48">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="16"
                            fill="none"
                            className="text-green-100 dark:text-green-900/30"
                          />
                          <motion.circle
                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                            animate={{ 
                              strokeDashoffset: 2 * Math.PI * 88 * (1 - Math.min(goalStats.dailyProgress / 100, 1))
                            }}
                            transition={{ duration: 2, delay: 0.8 }}
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="url(#greenGradient)"
                            strokeWidth="16"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 88}`}
                            strokeLinecap="round"
                            className="drop-shadow-2xl"
                          />
                          <defs>
                            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: 'spring' }}
                            className="text-6xl lg:text-7xl font-black text-gray-800 dark:text-white game-font"
                          >
                            {goalStats.dailyProgress}%
                          </motion.span>
                          <span className="text-xl text-gray-600 dark:text-gray-400 fun-font font-bold mt-2">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Goal Stats */}
                    <div className="space-y-4 mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-5xl">🔥</div>
                          <span className="text-xl text-gray-700 dark:text-gray-300 fun-font font-bold">Streak</span>
                        </div>
                        <span className="text-3xl font-black text-orange-600 game-font">{goalStats.currentStreak} days</span>
                      </motion.div>

                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-5xl">🏆</div>
                          <span className="text-xl text-gray-700 dark:text-gray-300 fun-font font-bold">Challenges</span>
                        </div>
                        <span className="text-3xl font-black text-yellow-600 game-font">
                          {goalStats.challengesCompleted}/{goalStats.totalChallenges}
                        </span>
                      </motion.div>

                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-5xl">⭐</div>
                          <span className="text-xl text-gray-700 dark:text-gray-300 fun-font font-bold">Points</span>
                        </div>
                        <span className="text-3xl font-black text-blue-600 game-font">{goalStats.totalRewardsEarned}</span>
                      </motion.div>
                    </div>

                    {/* Current Goal Info */}
                    <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border-2 border-green-300 dark:border-green-700 rounded-2xl">
                      <div className="text-xl text-green-700 dark:text-green-300 fun-font font-bold leading-relaxed">
                        <strong className="text-2xl">Today's Goal:</strong><br/>
                        {goals.daily.current} / {goals.daily.target} {goals.daily.type}
                      </div>
                    </div>

                    {goalStats.dailyProgress >= 100 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 1.2 }}
                        className="mt-6 flex items-center justify-center space-x-3 text-green-600 text-xl fun-font font-black p-5 bg-green-100 dark:bg-green-900/40 rounded-2xl border-2 border-green-300 dark:border-green-700"
                      >
                        <CheckCircle className="h-8 w-8" />
                        <span>Goal completed! 🎉🎊</span>
                      </motion.div>
                    )}
                  </>
                )
              })()}
            </div>
          </motion.div>
        </div>

        {/* THREE COLUMN LAYOUT: Activity, Collections, Eye Comfort */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* RECENT ACTIVITY - SPANS 2/3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 lg:p-10 shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 h-full">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl shadow-xl">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                    Recent Activity
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 fun-font font-bold mt-1">
                    Your latest reading sessions 📖
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="group relative"
                  >
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-gray-800 dark:text-white fun-font mb-2 leading-tight">
                            📖 {activity.text}
                          </h3>
                          <span className="text-base text-gray-500 dark:text-gray-400 fun-font font-bold">
                            {activity.time}
                          </span>
                        </div>
                        <ChevronRight className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform" />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${activity.progress}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.05 }}
                            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-4 rounded-full shadow-lg"
                          />
                        </div>
                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400 game-font min-w-[80px] text-right">
                          {activity.progress}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-16">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-9xl mb-8"
                    >
                      📚
                    </motion.div>
                    <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-4">
                      No recent activity yet
                    </h3>
                    <p className="text-2xl text-gray-600 dark:text-gray-400 fun-font font-bold mb-8 leading-relaxed">
                      Start your reading journey now! 🚀
                    </p>
                    <Link to="/focus-mode">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black fun-font text-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center space-x-3 mx-auto"
                      >
                        <Play className="h-7 w-7" />
                        <span>Start Reading</span>
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR: Collections + Eye Comfort */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* COLLECTIONS */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-[2rem] p-8 shadow-2xl border-2 border-pink-200 dark:border-pink-800">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl shadow-xl">
                      <Bookmark className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                      Collections
                    </h3>
                  </div>
                  <Link to="/collections">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl font-black fun-font text-base hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-all"
                    >
                      View All
                    </motion.button>
                  </Link>
                </div>

                {(() => {
                  const collectionStats = collectionsService.getStats()
                  const collections = collectionsService.getAllCollections().collections

                  return (
                    <div className="space-y-5">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-5 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
                          <div className="text-4xl font-black text-purple-600 game-font mb-1">{collectionStats.totalItems}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 fun-font font-bold">Saved</div>
                        </div>
                        <div className="text-center p-5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-green-200 dark:border-green-800">
                          <div className="text-4xl font-black text-green-600 game-font mb-1">{collectionStats.totalCollections}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 fun-font font-bold">Folders</div>
                        </div>
                        <div className="text-center p-5 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                          <div className="text-4xl font-black text-blue-600 game-font mb-1">
                            {Math.ceil(collectionStats.totalWords / 200)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 fun-font font-bold">Min</div>
                        </div>
                      </div>

                      {collections.slice(0, 3).map((collection, index) => (
                        <motion.div
                          key={collection.id}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: -5 }}
                          className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => navigate('/collections')}
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-4xl">{collection.icon}</span>
                            <div>
                              <div className="font-black text-gray-800 dark:text-white fun-font text-xl">
                                {collection.name}
                              </div>
                              <div className="text-base text-gray-600 dark:text-gray-400 fun-font font-bold">
                                {collection.items.length} items
                              </div>
                            </div>
                          </div>
                          <Folder className="h-7 w-7 text-purple-600 group-hover:scale-110 transition-transform" />
                        </motion.div>
                      ))}

                      {collectionStats.totalItems === 0 && (
                        <div className="text-center py-10">
                          <div className="text-7xl mb-5">📚</div>
                          <p className="text-xl text-gray-600 dark:text-gray-400 fun-font font-bold mb-3">
                            No saved texts yet
                          </p>
                          <p className="text-lg text-gray-500 dark:text-gray-500 fun-font">
                            Start collecting! 💫
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </motion.div>

            {/* EYE COMFORT */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-[2rem] p-8 shadow-2xl border-2 border-blue-200 dark:border-blue-800">
                {(() => {
                  const { settings: eyeSettings, isActive, getStats } = useEyeComfort()
                  const eyeStats = getStats()

                  return (
                    <>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-xl">
                            <Eye className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                            Eye Comfort
                          </h3>
                        </div>
                        {isActive && (
                          <span className="px-4 py-2 text-base bg-green-100 dark:bg-green-900/40 text-green-600 rounded-2xl fun-font font-black border-2 border-green-300 dark:border-green-700">
                            Active ✓
                          </span>
                        )}
                      </div>

                      <div className="mb-6 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl border-2 border-blue-300 dark:border-blue-700">
                        <div className="flex items-center space-x-4 text-xl text-blue-600 fun-font font-bold leading-relaxed">
                          <Eye className="h-7 w-7" />
                          <span>
                            {eyeSettings.enabled 
                              ? `Reminder every ${eyeSettings.interval} minutes` 
                              : 'Timer disabled'
                            }
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-green-200 dark:border-green-800"
                        >
                          <span className="text-xl text-gray-700 dark:text-gray-300 fun-font font-bold">Breaks Taken</span>
                          <span className="text-3xl font-black text-green-600 game-font">{eyeStats.totalBreaksTaken}</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-800"
                        >
                          <span className="text-xl text-gray-700 dark:text-gray-300 fun-font font-bold">Breaks Skipped</span>
                          <span className="text-3xl font-black text-red-600 game-font">{eyeStats.totalBreaksSkipped}</span>
                        </motion.div>
                      </div>

                      {eyeStats.lastBreakDate && (
                        <div className="mb-6 text-lg text-gray-600 dark:text-gray-400 text-center fun-font font-bold p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          Last break: {new Date(eyeStats.lastBreakDate).toLocaleTimeString()}
                        </div>
                      )}

                      <Link to="/settings">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-center text-xl text-white fun-font font-black py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl hover:shadow-xl transition-all flex items-center justify-center space-x-3"
                        >
                          <span>Configure Settings</span>
                          <ArrowRight className="h-6 w-6" />
                        </motion.button>
                      </Link>
                    </>
                  )
                })()}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ACHIEVEMENTS - FULL WIDTH CAROUSEL */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-[2rem] p-8 lg:p-10 shadow-2xl border-2 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl shadow-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                  Recent Achievements
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 fun-font font-bold mt-1">
                  Your latest accomplishments 🏆
                </p>
              </div>
            </div>

            {recentAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="group"
                  >
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-2xl transition-all overflow-hidden">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="p-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                            <Award className="h-10 w-10 text-white" />
                          </div>
                          <div className="text-5xl">{achievement.icon || '🏅'}</div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white fun-font mb-3 leading-tight">
                          {achievement.title}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 fun-font font-bold mb-4 leading-relaxed">
                          {achievement.description}
                        </p>
                        <span className="text-base text-gray-500 dark:text-gray-500 fun-font font-bold flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>{formatTimeAgo(achievement.earnedAt)}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-9xl mb-8"
                >
                  🏆
                </motion.div>
                <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-4">
                  No achievements yet
                </h3>
                <p className="text-2xl text-gray-600 dark:text-gray-400 fun-font font-bold mb-8">
                  Keep reading to unlock amazing rewards! 🌟
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* WEEKLY GOAL - GRAND FINALE BANNER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, type: 'spring' }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-[2rem] lg:rounded-[3rem] p-10 lg:p-16 text-white shadow-2xl overflow-hidden">
            {/* Mega animated background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
                <div className="flex items-center space-x-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-8xl lg:text-9xl"
                  >
                    🎯
                  </motion.div>
                  <div>
                    <h2 className="text-4xl lg:text-6xl font-black game-font leading-tight" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.3)', letterSpacing: '0.02em' }}>
                      Weekly Reading Goal
                    </h2>
                    <p className="text-2xl lg:text-3xl text-white/90 fun-font font-bold mt-3 leading-relaxed">
                      Push yourself to read every day! 💪
                    </p>
                  </div>
                </div>
                <div className="bg-white/30 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/50 shadow-2xl">
                  <div className="text-7xl lg:text-8xl font-black game-font mb-2 text-center">
                    {weeklyGoal.current}/{weeklyGoal.target}
                  </div>
                  <div className="text-2xl text-white/90 fun-font font-black text-center">days completed</div>
                </div>
              </div>
              
              <div className="bg-white/30 backdrop-blur-lg rounded-full h-8 mb-8 overflow-hidden border-2 border-white/40 shadow-xl">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }}
                  transition={{ duration: 2, delay: 1.5 }}
                  className="bg-white h-8 rounded-full shadow-2xl flex items-center justify-end pr-6"
                >
                  <span className="text-purple-600 font-black game-font text-2xl">
                    {Math.round((weeklyGoal.current / weeklyGoal.target) * 100)}%
                  </span>
                </motion.div>
              </div>
              
              <p className="text-2xl lg:text-3xl text-white/95 fun-font font-black text-center leading-relaxed">
                {weeklyGoal.current === weeklyGoal.target
                  ? "🎉 Congratulations! You've crushed your weekly goal! You're amazing! 🌟"
                  : `Fantastic progress! Just ${weeklyGoal.target - weeklyGoal.current} more ${weeklyGoal.target - weeklyGoal.current === 1 ? 'day' : 'days'} to reach your goal. You got this! 🚀`
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

