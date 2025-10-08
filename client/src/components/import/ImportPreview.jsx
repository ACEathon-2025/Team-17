import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, Volume2, Focus, FileText, Brain, Bookmark, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ImportPreview = ({ text, fileName, onConfirm, onCancel }) => {
  const navigate = useNavigate()
  const wordCount = text.split(/\s+/).filter(w => w.trim()).length
  const charCount = text.length

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  const quickActions = [
    { name: 'Listen', icon: Volume2, action: () => {
      localStorage.setItem('tts-text', text)
      navigate('/text-to-speech')
    }, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Focus', icon: Focus, action: () => {
      localStorage.setItem('focus-text', text)
      navigate('/focus-mode')
    }, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Summarize', icon: FileText, action: () => {
      localStorage.setItem('summarize-text', text)
      navigate('/summarize')
    }, gradient: 'from-pink-500 to-rose-500' },
    { name: 'Quiz', icon: Brain, action: () => {
      localStorage.setItem('quiz-text', text)
      navigate('/quiz')
    }, gradient: 'from-indigo-500 to-purple-500' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text">
            Text Extracted Successfully! ✨
          </h3>
          {fileName && (
            <p className="text-sm text-[var(--text-secondary)] dyslexia-text mt-1">
              From: {fileName}
            </p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-2 text-[var(--text-secondary)] hover:text-primary-600 transition-colors"
          title="Copy text"
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dyslexia-text">
            {wordCount.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--text-secondary)] dyslexia-text">
            Words
          </div>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
          <div className="text-2xl font-bold text-secondary-600 dyslexia-text">
            {Math.ceil(wordCount / 200)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] dyslexia-text">
            Min to Read
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--text-secondary)] dyslexia-text mb-2">
          Preview:
        </h4>
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg max-h-48 overflow-y-auto">
          <p className="text-[var(--text-primary)] dyslexia-text text-sm line-clamp-6">
            {text.substring(0, 500)}...
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--text-secondary)] dyslexia-text mb-3">
          Quick Actions:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.name}
                onClick={action.action}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg bg-gradient-to-br ${action.gradient} hover:shadow-lg transition-all group`}
              >
                <Icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                <span className="text-xs text-white font-medium dyslexia-text">
                  {action.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium dyslexia-text"
        >
          <Check className="h-5 w-5" />
          <span>Use This Text</span>
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition-all font-medium dyslexia-text"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}

export default ImportPreview
