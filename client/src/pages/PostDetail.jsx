import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Heart, MessageCircle, Eye, Share2, Flag, Pin, 
  MoreVertical, Send, Reply, ThumbsUp, Award, Sparkles, Clock
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { communityService } from '../services/communityService'

const PostDetail = () => {
  const navigate = useNavigate()
  const { channelId, postId } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [channel, setChannel] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPost()
  }, [channelId, postId])

  const loadPost = () => {
    const channelData = communityService.getChannel(channelId)
    const postData = channelData?.posts.find(p => p.id === postId)
    
    if (postData) {
      // Increment views
      postData.views = (postData.views || 0) + 1
      const data = communityService.getData()
      const ch = data.channels.find(c => c.id === channelId)
      const p = ch.posts.find(p => p.id === postId)
      p.views = postData.views
      communityService.saveData(data)
    }

    setChannel(channelData)
    setPost(postData)
  }

  const handleLike = () => {
    communityService.toggleLike(channelId, postId, user.email)
    loadPost()
  }

  const handleCommentLike = (commentId) => {
    communityService.toggleCommentLike(channelId, postId, commentId, user.email)
    loadPost()
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setLoading(true)
    communityService.addComment(channelId, postId, { content: commentText.trim() }, user.email)
    setCommentText('')
    setLoading(false)
    loadPost()
  }

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return

    setLoading(true)
    communityService.addReply(channelId, postId, commentId, { content: replyText.trim() }, user.email)
    setReplyText('')
    setReplyTo(null)
    setLoading(false)
    loadPost()
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

  if (!post || !channel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const isLiked = post.likes.includes(user.email)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate('/community')}
          className="mb-6 flex items-center space-x-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg border border-purple-100 dark:border-purple-900/30"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-bold fun-font">Back to Community</span>
        </motion.button>

        {/* Channel Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 inline-flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg"
        >
          <span className="text-3xl">{channel.icon}</span>
          <span className="text-white font-bold fun-font text-lg">{channel.name}</span>
        </motion.div>

        {/* Post Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 overflow-hidden mb-8"
        >
          {/* Post Header */}
          <div className="p-8 border-b-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{post.author.avatar}</div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font">
                      {post.author.name}
                    </h3>
                    {post.author.reputation > 500 && (
                      <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center space-x-1">
                        <Award className="h-4 w-4 text-white" />
                        <span className="text-white text-xs font-bold">Legend</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-gray-500 dark:text-gray-400 fun-font">
                      {post.author.reputation} points
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="fun-font text-sm">{formatTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {post.isPinned && (
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                  <Pin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white game-font mb-6" style={{ lineHeight: '1.3' }}>
              {post.title}
            </h1>

            {/* Post Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-gray-700 dark:text-gray-300 fun-font leading-relaxed whitespace-pre-wrap" style={{ lineHeight: '2', letterSpacing: '0.02em' }}>
                {post.content}
              </p>
            </div>
          </div>

          {/* Post Actions */}
          <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Like Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold fun-font transition-all ${
                    isLiked
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes.length}</span>
                </motion.button>

                {/* Comments Count */}
                <div className="flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold fun-font">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments.length}</span>
                </div>

                {/* Views */}
                <div className="flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold fun-font">
                  <Eye className="h-5 w-5" />
                  <span>{post.views}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  <Flag className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 overflow-hidden"
        >
          {/* Comments Header */}
          <div className="p-8 border-b-2 border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font flex items-center">
              <MessageCircle className="h-8 w-8 mr-3 text-purple-600" />
              {post.comments.length} Comments
            </h2>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="p-8 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <div className="flex items-start space-x-4">
              <div className="text-4xl flex-shrink-0">
                {communityService.getCurrentUser(user.email).avatar}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-gray-800 dark:text-white fun-font text-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors resize-none"
                  style={{ letterSpacing: '0.02em', lineHeight: '1.8' }}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 fun-font">
                    {commentText.length}/1000
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!commentText.trim() || loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold fun-font shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Post Comment</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="p-8 space-y-6">
            {post.comments.length > 0 ? post.comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-4"
              >
                {/* Main Comment */}
                <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                  <div className="text-3xl flex-shrink-0">{comment.author.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-800 dark:text-white fun-font text-lg">
                          {comment.author.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 fun-font">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 fun-font text-lg mb-4 whitespace-pre-wrap" style={{ lineHeight: '1.8', letterSpacing: '0.02em' }}>
                      {comment.content}
                    </p>

                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold fun-font text-sm transition-all ${
                          comment.likes.includes(user.email)
                            ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                            : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${comment.likes.includes(user.email) ? 'fill-current' : ''}`} />
                        <span>{comment.likes.length}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-bold fun-font text-sm hover:bg-gray-100 dark:hover:bg-gray-500 transition-all"
                      >
                        <Reply className="h-4 w-4" />
                        <span>Reply</span>
                      </motion.button>
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                      {replyTo === comment.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pl-4 border-l-4 border-purple-300 dark:border-purple-700"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl flex-shrink-0">
                              {communityService.getCurrentUser(user.email).avatar}
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                rows={3}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-500 rounded-xl text-gray-800 dark:text-white fun-font focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors resize-none"
                                style={{ letterSpacing: '0.02em', lineHeight: '1.8' }}
                              />
                              <div className="flex items-center justify-end space-x-3 mt-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyTo(null)
                                    setReplyText('')
                                  }}
                                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold fun-font text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                  Cancel
                                </button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyText.trim()}
                                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold fun-font text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Reply
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="ml-12 space-y-4">
                    {comment.replies.map((reply, replyIndex) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: replyIndex * 0.05 }}
                        className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border-l-4 border-purple-300 dark:border-purple-700"
                      >
                        <div className="text-2xl flex-shrink-0">{reply.author.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-bold text-gray-800 dark:text-white fun-font">
                              {reply.author.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 fun-font">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 fun-font whitespace-pre-wrap" style={{ lineHeight: '1.8', letterSpacing: '0.02em' }}>
                            {reply.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="text-center py-12">
                <MessageCircle className="h-20 w-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-xl text-gray-500 dark:text-gray-400 fun-font font-semibold">
                  No comments yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 fun-font mt-2">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PostDetail
