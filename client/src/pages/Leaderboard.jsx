import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Crown, Medal, Star, Zap, TrendingUp, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { communityService } from '../services/communityService'

const Leaderboard = () => {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = () => {
    const allUsers = communityService.getLeaderboard(30) // Top 30 users
    setLeaderboard(allUsers)
  }

  const getRankBadge = (index) => {
    if (index === 0) return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '1st' }
    if (index === 1) return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700', label: '2nd' }
    if (index === 2) return { icon: Medal, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', label: '3rd' }
    return { icon: Star, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', label: `${index + 1}th` }
  }

  const getRankTitle = (reputation) => {
    if (reputation < 50) return { title: 'Beginner', color: 'text-gray-600' }
    if (reputation < 100) return { title: 'Reader', color: 'text-blue-600' }
    if (reputation < 250) return { title: 'Contributor', color: 'text-green-600' }
    if (reputation < 500) return { title: 'Expert', color: 'text-purple-600' }
    if (reputation < 1000) return { title: 'Master', color: 'text-orange-600' }
    return { title: 'Legend', color: 'text-yellow-600' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/community')}
            className="flex items-center space-x-2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold fun-font">Back to Community</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                    <Trophy className="h-14 w-14 text-white animate-bounce" />
                    <h1 className="text-5xl md:text-6xl font-black text-white game-font" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
                      LEADERBOARD
                    </h1>
                  </div>
                  <p className="text-xl md:text-2xl text-white/90 fun-font font-semibold">
                    Top 30 Contributors in VOXA Community 🌟
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 text-center">
                  <div className="text-7xl font-black text-white game-font mb-2">{leaderboard.length}</div>
                  <div className="text-lg text-white/90 fun-font font-bold">Total Users</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Podium - FIXED STYLING */}
        {leaderboard.length >= 3 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* 2nd Place (Left) */}
              <motion.div
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="md:mt-8"
              >
                <PodiumCard user={leaderboard[1]} index={1} getRankBadge={getRankBadge} getRankTitle={getRankTitle} />
              </motion.div>

              {/* 1st Place (Center) - TALLER */}
              <motion.div
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="md:-mt-4"
              >
                <PodiumCard user={leaderboard[0]} index={0} getRankBadge={getRankBadge} getRankTitle={getRankTitle} isFirst />
              </motion.div>

              {/* 3rd Place (Right) */}
              <motion.div
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="md:mt-12"
              >
                <PodiumCard user={leaderboard[2]} index={2} getRankBadge={getRankBadge} getRankTitle={getRankTitle} />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Show single user or fewer than 3 users
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto"
          >
            {leaderboard.slice(0, 3).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              >
                <PodiumCard user={user} index={index} getRankBadge={getRankBadge} getRankTitle={getRankTitle} isFirst={index === 0} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Rest of Leaderboard */}
        {leaderboard.length > 3 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b-2 border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font flex items-center">
                <TrendingUp className="h-8 w-8 mr-3 text-purple-600" />
                All Rankings
              </h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.slice(3).map((user, index) => {
                const actualIndex = index + 3
                const rank = getRankTitle(user.reputation)

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.02 }}
                    className="flex items-center justify-between p-6 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Rank Number */}
                      <div className="w-20 text-center">
                        <div className="text-3xl font-black text-gray-400 dark:text-gray-500 game-font group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          #{actualIndex + 1}
                        </div>
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex items-center space-x-5 flex-1 min-w-0">
                        <div className="text-6xl flex-shrink-0">{user.avatar}</div>
                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white game-font truncate">
                            {user.name}
                          </h3>
                          <div className={`text-base font-bold fun-font ${rank.color}`}>
                            {rank.title}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden lg:flex items-center space-x-8 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-3xl font-black text-purple-600 game-font">{user.reputation}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 fun-font font-bold">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black text-blue-600 game-font">{user.posts}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 fun-font font-bold">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black text-green-600 game-font">{user.comments}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 fun-font font-bold">Comments</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* No Users Message */}
        {leaderboard.length === 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center shadow-2xl border-2 border-purple-100 dark:border-purple-900/30"
          >
            <Trophy className="h-32 w-32 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
            <h3 className="text-4xl font-black text-gray-800 dark:text-white game-font mb-4">
              No users yet
            </h3>
            <p className="text-2xl text-gray-500 dark:text-gray-400 fun-font">
              Be the first to join the community!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Podium Card Component - IMPROVED
const PodiumCard = ({ user, index, getRankBadge, getRankTitle, isFirst = false }) => {
  const badge = getRankBadge(index)
  const rank = getRankTitle(user.reputation)
  const Icon = badge.icon

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border-4 transition-all hover:scale-105 ${
      index === 0 ? 'border-yellow-400 dark:border-yellow-600' :
      index === 1 ? 'border-gray-400 dark:border-gray-600' :
      'border-orange-400 dark:border-orange-600'
    } ${isFirst ? 'md:scale-110' : ''}`}>
      {/* Rank Badge */}
      <div className={`${badge.bg} rounded-2xl p-5 mb-5 text-center transform hover:rotate-3 transition-transform`}>
        <Icon className={`h-14 w-14 ${badge.color} mx-auto mb-3 animate-pulse`} />
        <div className="text-4xl font-black game-font text-gray-800 dark:text-white">
          {badge.label}
        </div>
      </div>

      {/* Avatar */}
      <div className="text-8xl text-center mb-5 animate-bounce">{user.avatar}</div>

      {/* Name */}
      <h3 className="text-2xl font-black text-center text-gray-800 dark:text-white game-font mb-3 truncate px-2">
        {user.name}
      </h3>

      {/* Rank Title */}
      <div className={`text-center font-bold fun-font text-lg mb-5 ${rank.color}`}>
        {rank.title}
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <span className="text-base text-gray-600 dark:text-gray-400 fun-font font-bold">Reputation</span>
          <span className="text-2xl font-black text-purple-600 game-font">{user.reputation}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
          <span className="text-base text-gray-600 dark:text-gray-400 fun-font font-bold">Posts</span>
          <span className="text-2xl font-black text-blue-600 game-font">{user.posts}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
          <span className="text-base text-gray-600 dark:text-gray-400 fun-font font-bold">Comments</span>
          <span className="text-2xl font-black text-green-600 game-font">{user.comments}</span>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
