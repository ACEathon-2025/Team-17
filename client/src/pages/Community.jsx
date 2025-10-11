import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Users, TrendingUp, Search, Filter, Plus, 
  Heart, MessageCircle, Eye, Clock, Award, Star, Flame,
  Hash, Pin, ChevronDown, Send, Sparkles, Crown, Zap, Trophy
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { communityService } from '../services/communityService'
import NewPostModal from '../components/community/NewPostModal'

const Community = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [channels, setChannels] = useState([])
  const [posts, setPosts] = useState([])
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (user) {
      loadCommunityData()
    }
  }, [user, selectedChannel, sortBy])

  const loadCommunityData = () => {
    const channelsData = communityService.getChannels()
    setChannels(channelsData)

    const postsData = communityService.getPosts(selectedChannel, sortBy)
    setPosts(postsData)

    const leaderboardData = communityService.getLeaderboard(5)
    setLeaderboard(leaderboardData)

    const userData = communityService.getCurrentUser(user.email)
    setCurrentUser(userData)
  }

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId)
  }

  const handlePostClick = (post) => {
    navigate(`/community/post/${selectedChannel}/${post.id}`)
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInMs = now - postDate
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return postDate.toLocaleDateString()
  }

  const selectedChannelData = channels.find(c => c.id === selectedChannel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Animated background circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                      VOXA COMMUNITY
                    </h1>
                  </div>
                  <p className="text-xl text-white/90 fun-font font-semibold">
                    Connect, Share, and Grow Together! 🌟
                  </p>
                </div>
                
                <div className="hidden lg:flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white game-font">{posts.length}</div>
                    <div className="text-sm text-white/80 fun-font">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white game-font">{leaderboard.length * 50}+</div>
                    <div className="text-sm text-white/80 fun-font">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white game-font">{channels.length}</div>
                    <div className="text-sm text-white/80 fun-font">Channels</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Channels */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 sticky top-8">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Hash className="h-6 w-6 mr-2 text-purple-600" />
                Channels
              </h2>
              
              <div className="space-y-2">
                {channels.map((channel) => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChannelClick(channel.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedChannel === channel.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{channel.icon}</span>
                        <div>
                          <div className={`font-bold fun-font text-base ${selectedChannel === channel.id ? 'text-white' : ''}`}>
                            {channel.name}
                          </div>
                          <div className={`text-xs fun-font ${selectedChannel === channel.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            {channel.posts.length} posts
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* User Card */}
              {currentUser && (
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-4xl">{currentUser.avatar}</div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 fun-font">
                        {currentUser.reputation} points
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">{currentUser.posts}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-pink-600">{currentUser.comments}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Comments</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{currentUser.likes}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Likes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* CENTER - Posts Feed */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            {/* Channel Header */}
            {selectedChannelData && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{selectedChannelData.icon}</div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font">
                        {selectedChannelData.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 fun-font text-lg">
                        {selectedChannelData.description}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewPost(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold fun-font shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Post</span>
                  </motion.button>
                </div>

                {/* Sort & Filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-2">
                    {['recent', 'popular', 'mostLiked'].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className={`px-4 py-2 rounded-lg font-bold fun-font text-sm transition-all ${
                          sortBy === sort
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {sort === 'recent' && '🕐 Recent'}
                        {sort === 'popular' && '🔥 Popular'}
                        {sort === 'mostLiked' && '❤️ Most Liked'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts List - WITH INTERACTIVE LIKE/COMMENT */}
            <div className="space-y-4">
              {posts.length > 0 ? posts.map((post, index) => {
                const isLiked = post.likes.includes(user.email)
                
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900/30 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{post.author.avatar}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-800 dark:text-white fun-font text-lg">
                              {post.author.name}
                            </span>
                            {post.author.reputation > 100 && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 fun-font">
                            {formatTimeAgo(post.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      {post.isPinned && (
                        <Pin className="h-5 w-5 text-purple-500" />
                      )}
                    </div>

                    {/* Post Title - Clickable */}
                    <h3 
                      onClick={() => handlePostClick(post)}
                      className="text-2xl font-black text-gray-800 dark:text-white game-font mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      {post.title}
                    </h3>

                    {/* Post Content Preview */}
                    <p className="text-gray-600 dark:text-gray-400 fun-font text-lg mb-4 line-clamp-3" style={{ lineHeight: '1.8' }}>
                      {post.content}
                    </p>

                    {/* Post Actions - INTERACTIVE */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        {/* Like Button - WORKING */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            communityService.toggleLike(selectedChannel, post.id, user.email)
                            loadCommunityData()
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold fun-font transition-all ${
                            isLiked
                              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes.length}</span>
                        </motion.button>

                        {/* Comments Button - WORKING */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePostClick(post)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold fun-font hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>{post.comments.length}</span>
                        </motion.button>

                        {/* Views */}
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold fun-font">
                          <Eye className="h-5 w-5" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      
                      {/* Read More Button */}
                      <button 
                        onClick={() => handlePostClick(post)}
                        className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-bold fun-font text-sm hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all"
                      >
                        Read More →
                      </button>
                    </div>
                  </motion.div>
                )
              }) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-xl border border-purple-100 dark:border-purple-900/30">
                  <MessageSquare className="h-20 w-20 mx-auto mb-4 text-purple-300" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white game-font mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 fun-font text-lg mb-6">
                    Be the first to start a conversation!
                  </p>
                  <button
                    onClick={() => setShowNewPost(true)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold fun-font shadow-lg hover:shadow-xl transition-all"
                  >
                    Create First Post
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR - Leaderboard & Trending */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 sticky top-8">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                Top Contributors
              </h2>
              
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="relative">
                      <div className="text-3xl">{user.avatar}</div>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-orange-600'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 dark:text-white fun-font">
                        {user.name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 fun-font">
                          {user.reputation} points
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/leaderboard"
                className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold fun-font shadow-lg hover:shadow-xl transition-all text-center block"
              >
                View Full Leaderboard
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
              <h3 className="text-xl font-black game-font mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Community Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="fun-font text-white/80">Total Posts</span>
                  <span className="text-2xl font-black game-font">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="fun-font text-white/80">Active Today</span>
                  <span className="text-2xl font-black game-font">{leaderboard.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="fun-font text-white/80">Total Likes</span>
                  <span className="text-2xl font-black game-font">
                    {posts.reduce((sum, p) => sum + p.likes.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <NewPostModal
            channelId={selectedChannel}
            onClose={() => setShowNewPost(false)}
            onSuccess={() => {
              setShowNewPost(false)
              loadCommunityData()
            }}
            userEmail={user.email}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Community
