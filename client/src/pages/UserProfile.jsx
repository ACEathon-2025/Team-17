import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Edit, Save, X, Trophy, MessageCircle, Heart, 
  Calendar, Award, Star, TrendingUp, Settings, Crown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { communityService } from '../services/communityService'
import AvatarPicker from '../components/community/AvatarPicker'

const UserProfile = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = () => {
    const data = communityService.getCurrentUser(user.email)
    const userStats = communityService.getUserStats(user.email)
    setUserData(data)
    setStats(userStats)
    setEditedName(data.name)
  }

  const handleSaveName = () => {
    if (editedName.trim()) {
      const data = communityService.getData()
      data.users[user.email].name = editedName.trim()
      communityService.saveData(data)
      setIsEditing(false)
      loadUserData()
    }
  }

  const handleAvatarChange = (newAvatar) => {
    const data = communityService.getData()
    data.users[user.email].avatar = newAvatar
    communityService.saveData(data)
    setShowAvatarPicker(false)
    loadUserData()
  }

  if (!userData || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const rankData = (() => {
    const rep = userData.reputation
    if (rep < 50) return { rank: 'Beginner', color: 'gray', next: 50 }
    if (rep < 100) return { rank: 'Reader', color: 'blue', next: 100 }
    if (rep < 250) return { rank: 'Contributor', color: 'green', next: 250 }
    if (rep < 500) return { rank: 'Expert', color: 'purple', next: 500 }
    if (rep < 1000) return { rank: 'Master', color: 'orange', next: 1000 }
    return { rank: 'Legend', color: 'yellow', next: null }
  })()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center text-7xl shadow-2xl">
                  {userData.avatar}
                </div>
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute -bottom-2 -right-2 p-3 bg-white text-purple-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Edit className="h-5 w-5" />
                </button>
                {userData.reputation > 500 && (
                  <div className="absolute -top-3 -right-3 p-2 bg-yellow-400 rounded-full shadow-lg">
                    <Crown className="h-6 w-6 text-yellow-800" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center md:text-left">
                {isEditing ? (
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="px-4 py-2 bg-white/20 backdrop-blur-lg text-white text-3xl font-black game-font rounded-xl border-2 border-white/30 focus:outline-none focus:border-white"
                      maxLength={20}
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditedName(userData.name)
                      }}
                      className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-4xl md:text-5xl font-black text-white game-font">
                      {userData.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                    >
                      <Edit className="h-5 w-5 text-white" />
                    </button>
                  </div>
                )}
                
                <p className="text-white/80 fun-font text-lg mb-4">{userData.email}</p>
                
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <div className={`px-4 py-2 bg-${rankData.color}-500 rounded-xl flex items-center space-x-2 shadow-lg`}>
                    <Star className="h-5 w-5 text-white" />
                    <span className="text-white font-bold fun-font">{rankData.rank}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-xl">
                    <span className="text-white font-bold fun-font">{userData.reputation} Points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="mt-6 md:mt-0 text-center md:text-right">
              <div className="text-white/60 fun-font mb-2">Member Since</div>
              <div className="text-white font-bold fun-font text-lg">
                {new Date(userData.joinedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Avatar Picker Modal */}
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font">
                Choose Your Avatar
              </h2>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <AvatarPicker
              currentAvatar={userData.avatar}
              onSelect={handleAvatarChange}
            />
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Posts', value: userData.posts, icon: MessageCircle, color: 'blue' },
            { label: 'Comments', value: userData.comments, icon: MessageCircle, color: 'green' },
            { label: 'Likes Given', value: userData.likes, icon: Heart, color: 'pink' },
            { label: 'Likes Received', value: stats.totalLikesReceived, icon: Heart, color: 'red' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30"
              >
                <div className={`inline-flex p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl mb-4`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-4xl font-black text-gray-800 dark:text-white game-font mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 fun-font text-lg">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress to Next Rank */}
        {rankData.next && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-purple-100 dark:border-purple-900/30 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font">
                Progress to {rankData.next === 50 ? 'Reader' : rankData.next === 100 ? 'Contributor' : rankData.next === 250 ? 'Expert' : rankData.next === 500 ? 'Master' : 'Legend'}
              </h3>
              <span className="text-lg font-bold text-purple-600 fun-font">
                {userData.reputation}/{rankData.next}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                style={{ width: `${Math.min((userData.reputation / rankData.next) * 100, 100)}%` }}
              >
                <span className="text-white text-sm font-bold fun-font">
                  {Math.round((userData.reputation / rankData.next) * 100)}%
                </span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 fun-font text-lg">
              Only {rankData.next - userData.reputation} more points to reach the next rank!
            </p>
          </motion.div>
        )}

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-purple-100 dark:border-purple-900/30"
        >
          <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-yellow-500" />
            Achievements
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Auto-unlock achievements */}
            {[
              { name: 'First Post', desc: 'Created first post', unlocked: userData.posts > 0, icon: '📝' },
              { name: 'Commentator', desc: '10 comments', unlocked: userData.comments >= 10, icon: '💬' },
              { name: 'Popular', desc: '50 likes received', unlocked: stats.totalLikesReceived >= 50, icon: '❤️' },
              { name: 'Helpful', desc: '100 reputation', unlocked: userData.reputation >= 100, icon: '⭐' },
              { name: 'Contributor', desc: '250 reputation', unlocked: userData.reputation >= 250, icon: '🎯' },
              { name: 'Expert', desc: '500 reputation', unlocked: userData.reputation >= 500, icon: '🏆' },
              { name: 'Social Butterfly', desc: '25 posts', unlocked: userData.posts >= 25, icon: '🦋' },
              { name: 'Legend', desc: '1000 reputation', unlocked: userData.reputation >= 1000, icon: '👑' }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-2xl text-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400 dark:border-yellow-600'
                    : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                }`}
              >
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <div className="font-bold text-gray-800 dark:text-white fun-font mb-1">
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 fun-font">
                  {achievement.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
