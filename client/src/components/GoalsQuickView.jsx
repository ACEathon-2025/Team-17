import React from 'react'
import { motion } from 'framer-motion'
import { Target, Flame, Trophy } from 'lucide-react'
import { goalsService } from '../services/goalsService'
import { Link } from 'react-router-dom'

const GoalsQuickView = () => {
  const stats = goalsService.getStats()

  return (
    <Link to="/goals">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span className="font-semibold dyslexia-text">Today's Goal</span>
          </div>
          <span className="text-2xl font-bold dyslexia-text">{stats.dailyProgress}%</span>
        </div>

        <div className="h-2 bg-white/30 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(stats.dailyProgress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Flame className="h-4 w-4" />
            <span>{stats.currentStreak} day streak</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4" />
            <span>{stats.challengesCompleted} completed</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default GoalsQuickView
