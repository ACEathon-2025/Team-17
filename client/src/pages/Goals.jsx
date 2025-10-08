import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, Trophy, Flame, Calendar, Award, TrendingUp, 
  CheckCircle, Lock, Star, Zap, Edit2, Save, X 
} from 'lucide-react'
import { goalsService } from '../services/goalsService'

const Goals = () => {
  const [goals, setGoals] = useState(goalsService.getGoals())
  const [challenges, setChallenges] = useState(goalsService.getChallenges())
  const [stats, setStats] = useState(goalsService.getStats())
  const [editingGoal, setEditingGoal] = useState(null)
  const [tempTarget, setTempTarget] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setGoals(goalsService.getGoals())
    setChallenges(goalsService.getChallenges())
    setStats(goalsService.getStats())
  }

  const handleEditGoal = (period, currentTarget) => {
    setEditingGoal(period)
    setTempTarget(currentTarget)
  }

  const handleSaveGoal = (period) => {
    goalsService.setGoalTarget(period, tempTarget)
    setEditingGoal(null)
    loadData()
  }

  const getDailyProgressColor = () => {
    const progress = stats.dailyProgress
    if (progress >= 100) return 'from-green-500 to-emerald-500'
    if (progress >= 75) return 'from-blue-500 to-cyan-500'
    if (progress >= 50) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Reading Goals & Challenges
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Track your progress and complete challenges
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                {stats.currentStreak}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
              Day Streak
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                {stats.longestStreak}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
              Longest Streak
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                {stats.challengesCompleted}/{stats.totalChallenges}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
              Challenges
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                {stats.totalRewardsEarned}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
              Points Earned
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-br ${getDailyProgressColor()} rounded-lg`}>
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                      Daily Goal
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                      {goals.daily.current} / {goals.daily.target} {goals.daily.type}
                    </p>
                  </div>
                </div>
                {editingGoal === 'daily' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={tempTarget}
                      onChange={(e) => setTempTarget(parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-[var(--border-color)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                    <button onClick={() => handleSaveGoal('daily')} className="p-1 text-green-600">
                      <Save className="h-5 w-5" />
                    </button>
                    <button onClick={() => setEditingGoal(null)} className="p-1 text-red-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEditGoal('daily', goals.daily.target)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <Edit2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-[var(--text-primary)] dyslexia-text">
                      {stats.dailyProgress}% Complete
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.dailyProgress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${getDailyProgressColor()}`}
                  />
                </div>
              </div>

              {stats.dailyProgress >= 100 && (
                <div className="flex items-center space-x-2 text-green-600 text-sm dyslexia-text">
                  <CheckCircle className="h-5 w-5" />
                  <span>Daily goal completed! 🎉</span>
                </div>
              )}
            </motion.div>

            {/* Weekly Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                      Weekly Goal
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                      {goals.weekly.current} / {goals.weekly.target} days
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                  const isCompleted = index < goals.weekly.current
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold dyslexia-text ${
                        isCompleted
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-[var(--text-secondary)]'
                      }`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>

              <div className="text-sm text-[var(--text-secondary)] text-center dyslexia-text">
                {goals.weekly.target - goals.weekly.current} more days to reach weekly goal
              </div>
            </motion.div>

            {/* Monthly Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                      Monthly Goal
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                      {goals.monthly.current.toLocaleString()} / {goals.monthly.target.toLocaleString()} words
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.monthlyProgress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              </div>

              <div className="text-sm text-[var(--text-secondary)] text-center dyslexia-text">
                {(goals.monthly.target - goals.monthly.current).toLocaleString()} words remaining
              </div>
            </motion.div>
          </div>

          {/* Challenges Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Challenges
            </h2>

            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-[var(--bg-primary)] rounded-xl p-4 border ${
                  challenge.completed
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-[var(--text-primary)] dyslexia-text">
                        {challenge.title}
                      </h4>
                      {challenge.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] dyslexia-text mb-2">
                      {challenge.description}
                    </p>
                    
                    {!challenge.completed && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                          <span>{challenge.current} / {challenge.target}</span>
                          <span>{Math.round((challenge.current / challenge.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-yellow-600 text-xs dyslexia-text">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{challenge.reward} points</span>
                      </div>
                      {challenge.completed && (
                        <span className="text-xs text-green-600 dyslexia-text">
                          Completed!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Goals
