import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link as LinkIcon, Download, AlertCircle } from 'lucide-react'

const URLImporter = ({ onImport }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Invalid URL format')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onImport(url)
    } catch (err) {
      setError(err.message || 'Failed to import from URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
          <LinkIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
            Import from URL
          </h3>
          <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
            Paste article or webpage link
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleImport()}
            placeholder="https://example.com/article"
            className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300 dyslexia-text">
              {error}
            </p>
          </motion.div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium dyslexia-text"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Download className="h-5 w-5" />
              </motion.div>
              <span>Importing...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Import Article</span>
            </>
          )}
        </button>

        <div className="text-xs text-[var(--text-secondary)] dyslexia-text space-y-1">
          <p>💡 <strong>Tip:</strong> Works best with article pages (news, blogs, Medium, etc.)</p>
          <p>⚠️ Some websites may block automated access</p>
        </div>
      </div>
    </div>
  )
}

export default URLImporter
