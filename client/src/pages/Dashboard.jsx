import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BookOpen, Volume2, Languages, Focus, Award, Clock, BarChart3, Trophy, Flame, ArrowRight, Zap, TrendingUp, Brain, FileText, Bookmark, Folder, Eye, Target, Star, CheckCircle } from 'lucide-react'
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
  const { userProfile, readingProgress, achievements, stats, fetchUserData, setStats } = useUser()
  const [greeting, setGreeting] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 7 })
  const [lastFetch, setLastFetch] = useState(0)

  const [analyticsData, setAnalyticsData] = useState(null)
  const [insights, setInsights] = useState([])
  const [weeklyActivity, setWeeklyActivity] = useState([])

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

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
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
  }, [user])

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

  useEffect(() => {
    const speedHistory = localStorage.getItem('speed-reading-history')
    if (speedHistory) {
      try {
        const history = JSON.parse(speedHistory)
        if (history.length > 0) {
          const avgWPM = Math.round(
            history.reduce((sum, h) => sum + h.wpm, 0) / history.length
          )
          setStats(prev => ({
            ...prev,
            averageReadingSpeed: avgWPM
          }))
        }
      } catch (e) {
        console.error('Error loading speed reading data:', e)
      }
    }
  }, [])

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
      description: 'Convert text to natural speech',
      href: '/text-to-speech',
      icon: Volume2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Translation',
      description: 'Translate text to any language',
      href: '/translation',
      icon: Languages,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Focus Mode',
      description: 'Distraction-free reading',
      href: '/focus-mode',
      icon: Focus,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Summarize',
      description: 'AI-powered text summarization',
      href: '/summarize',
      icon: FileText,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Quiz',
      description: 'Test reading comprehension',
      href: '/quiz',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Speed Reading',
      description: 'Train and improve reading speed',
      href: '/speed-reading',
      icon: Zap,
      color: 'from-orange-500 to-amber-500'
    }
  ]

  const dashboardStats = [
    {
      label: 'Texts Read',
      value: stats.totalTextsRead || 0,
      icon: BookOpen,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      label: 'Reading Time',
      value: formatReadingTime(stats.totalReadingTime || 0),
      icon: Clock,
      change: '+8%',
      color: 'text-green-600'
    },
    {
      label: 'Achievements',
      value: achievements?.length || 0,
      icon: Award,
      change: `+${achievements?.filter(a => {
        const earnedDate = new Date(a.earnedAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return earnedDate > weekAgo
      }).length || 0}`,
      color: 'text-yellow-600'
    },
    {
      label: 'Streak',
      value: `${stats.readingStreak || 0} days`,
      icon: Flame,
      change: stats.readingStreak > 0 ? '+1' : '0',
      color: 'text-red-600'
    }
  ]

  const recentAchievements = achievements?.slice(-3).reverse() || []

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--border-color)] bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                  {greeting}, {user.email?.split('@')[0] || 'Reader'}!
                </h1>
                <p className="text-[var(--text-secondary)] dyslexia-text">
                  Ready to continue your reading journey? Let's make today count!
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dyslexia-text">
                    {stats.readingStreak || 0}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                    Day Streak
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600 dyslexia-text">
                    {achievements?.length || 0}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                    Achievements
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-[var(--bg-primary)] rounded-xl p-4 lg:p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-800 dark:to-secondary-800 rounded-lg">
                    <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs lg:text-sm text-green-600 dark:text-green-400 font-medium">
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] dyslexia-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-[var(--text-secondary)] dyslexia-text">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI-Powered Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <InsightCard key={insight.type} insight={insight} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Weekly Activity Chart */}
        {weeklyActivity.length > 0 && (
          <div className="mb-8">
            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weekly Activity
              </h2>
              <WeeklyChart data={weeklyActivity} />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <div key={action.title} className="group">
                  <Link to={action.href}>
                    <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-xl transition-all duration-300 group-hover:border-primary-300">
                      <div className={`inline-flex p-3 bg-gradient-to-r ${action.color} rounded-xl mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 dyslexia-text">
                        {action.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] dyslexia-text mb-4 text-sm">
                        {action.description}
                      </p>
                      <div className="flex items-center text-primary-600 font-medium dyslexia-text text-sm">
                        Start now
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* THREE COLUMN LAYOUT: Recent Activity, Collections, Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity - Spans 2 columns */}
          <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {activity.text}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                        {activity.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-xs text-[var(--text-secondary)] dyslexia-text">
                    {activity.time}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-[var(--text-secondary)] dyslexia-text">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity yet.</p>
                  <p>Start reading to see your progress here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Goals Widget - NEW! */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            {(() => {
              const goals = goalsService.getGoals()
              const goalStats = goalsService.getStats()

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      Daily Goal
                    </h3>
                    <Link
                      to="/goals"
                      className="text-primary-600 hover:text-primary-700 text-sm dyslexia-text"
                    >
                      View All
                    </Link>
                  </div>

                  {/* Progress Circle */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(goalStats.dailyProgress / 100, 1))}`}
                          className="text-green-600 transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text">
                          {goalStats.dailyProgress}%
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] dyslexia-text">
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-[var(--text-secondary)] dyslexia-text">Streak</span>
                      </div>
                      <span className="font-bold text-orange-600 dyslexia-text">{goalStats.currentStreak} days</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-[var(--text-secondary)] dyslexia-text">Challenges</span>
                      </div>
                      <span className="font-bold text-yellow-600 dyslexia-text">
                        {goalStats.challengesCompleted}/{goalStats.totalChallenges}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-[var(--text-secondary)] dyslexia-text">Points</span>
                      </div>
                      <span className="font-bold text-blue-600 dyslexia-text">{goalStats.totalRewardsEarned}</span>
                    </div>
                  </div>

                  {/* Current Goal */}
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="text-sm text-green-700 dark:text-green-300 dyslexia-text">
                      <strong>Today's Goal:</strong> {goals.daily.current} / {goals.daily.target} {goals.daily.type}
                    </div>
                  </div>

                  {goalStats.dailyProgress >= 100 && (
                    <div className="mt-3 flex items-center justify-center space-x-2 text-green-600 text-sm dyslexia-text">
                      <CheckCircle className="h-5 w-5" />
                      <span>Goal completed! 🎉</span>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>

        {/* TWO COLUMN LAYOUT: Collections, Eye Comfort, Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Collections Widget */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text flex items-center">
                <Bookmark className="h-5 w-5 mr-2 text-primary-600" />
                Collections
              </h3>
              <Link
                to="/collections"
                className="text-primary-600 hover:text-primary-700 text-sm dyslexia-text"
              >
                View All
              </Link>
            </div>

            {(() => {
              const collectionStats = collectionsService.getStats()
              const collections = collectionsService.getAllCollections().collections

              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="text-xl font-bold text-primary-600">{collectionStats.totalItems}</div>
                      <div className="text-xs text-[var(--text-secondary)] dyslexia-text">Saved</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="text-xl font-bold text-green-600">{collectionStats.totalCollections}</div>
                      <div className="text-xs text-[var(--text-secondary)] dyslexia-text">Folders</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {Math.ceil(collectionStats.totalWords / 200)}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] dyslexia-text">Min</div>
                    </div>
                  </div>

                  {collections.slice(0, 3).map((collection) => (
                    <div
                      key={collection.id}
                      className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
                      onClick={() => navigate('/collections')}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{collection.icon}</span>
                        <div>
                          <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                            {collection.name}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {collection.items.length} items
                          </div>
                        </div>
                      </div>
                      <Folder className="h-5 w-5 text-[var(--text-secondary)]" />
                    </div>
                  ))}

                  {collectionStats.totalItems === 0 && (
                    <div className="text-center py-6">
                      <Bookmark className="h-12 w-12 mx-auto mb-3 text-[var(--text-secondary)] opacity-50" />
                      <p className="text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                        No saved texts yet
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] dyslexia-text">
                        Start saving your favorite texts!
                      </p>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Eye Comfort Widget */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            {(() => {
              const { settings: eyeSettings, isActive, getStats } = useEyeComfort()
              const eyeStats = getStats()

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-blue-600" />
                      Eye Comfort
                    </h3>
                    {isActive && (
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full dyslexia-text">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-600 dyslexia-text">
                      <Eye className="h-4 w-4" />
                      <span>
                        {eyeSettings.enabled 
                          ? `Reminder every ${eyeSettings.interval} minutes` 
                          : 'Timer disabled'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <span className="text-sm text-[var(--text-secondary)] dyslexia-text">Breaks Taken</span>
                      <span className="font-bold text-green-600 dyslexia-text">{eyeStats.totalBreaksTaken}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <span className="text-sm text-[var(--text-secondary)] dyslexia-text">Breaks Skipped</span>
                      <span className="font-bold text-red-600 dyslexia-text">{eyeStats.totalBreaksSkipped}</span>
                    </div>
                  </div>

                  {eyeStats.lastBreakDate && (
                    <div className="mt-4 text-xs text-[var(--text-secondary)] text-center dyslexia-text">
                      Last break: {new Date(eyeStats.lastBreakDate).toLocaleTimeString()}
                    </div>
                  )}

                  <Link
                    to="/settings"
                    className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 dyslexia-text"
                  >
                    Configure Settings →
                  </Link>
                </>
              )
            })()}
          </div>

          {/* Achievements - Spans 1 column */}
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text mb-6 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Achievements
            </h2>
            <div className="space-y-4">
              {recentAchievements.length > 0 ? recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-800 dark:to-orange-800 rounded-full">
                    <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] dyslexia-text mb-2">
                      {achievement.description}
                    </p>
                    <span className="text-xs text-[var(--text-secondary)] dyslexia-text">
                      {formatTimeAgo(achievement.earnedAt)}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-[var(--text-secondary)] dyslexia-text">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No achievements yet.</p>
                  <p>Keep reading to unlock rewards!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dyslexia-text">
              Weekly Reading Goal
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold dyslexia-text">
                {weeklyGoal.current}/{weeklyGoal.target}
              </div>
              <div className="text-sm text-primary-100 dyslexia-text">days</div>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-3 mb-4">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }}
            />
          </div>
          <p className="text-primary-100 dyslexia-text">
            {weeklyGoal.current === weeklyGoal.target
              ? "🎉 Congratulations! You've reached your weekly goal!"
              : `Great progress! ${weeklyGoal.target - weeklyGoal.current} more ${weeklyGoal.target - weeklyGoal.current === 1 ? 'day' : 'days'} to reach your weekly goal.`
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
