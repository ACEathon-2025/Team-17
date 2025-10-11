// Replace the entire NewPostModal.jsx:

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, AlertCircle } from 'lucide-react'
import { communityService } from '../../services/communityService'

const NewPostModal = ({ channelId, onClose, onSuccess, userEmail }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await communityService.createPost(
        channelId,
        { title: title.trim(), content: content.trim() },
        userEmail
      )
      onSuccess()
    } catch (err) {
      setError('Failed to create post. Please try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between z-10">
          <h2 className="text-3xl font-black text-white game-font">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 dark:text-red-400 fun-font">{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-lg font-bold text-gray-800 dark:text-white game-font mb-3">
              Post Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white fun-font text-lg focus:outline-none focus:border-purple-500 transition-colors"
              style={{ letterSpacing: '0.02em', lineHeight: '1.6' }}
              maxLength={100}
              autoFocus
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 fun-font text-right">
              {title.length}/100
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-lg font-bold text-gray-800 dark:text-white game-font mb-3">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or experiences..."
              rows={10}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white fun-font text-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
              style={{ letterSpacing: '0.02em', lineHeight: '1.8' }}
              maxLength={2000}
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 fun-font text-right">
              {content.length}/2000
            </div>
          </div>

          {/* Buttons - Fixed */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-6 pb-2 flex items-center justify-end space-x-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold fun-font hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold fun-font shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Post Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default NewPostModal
