import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, ChevronDown, ChevronUp, Search } from 'lucide-react'

const VoiceCommandPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const commandCategories = {
    navigation: {
      name: 'Navigation',
      icon: '🧭',
      commands: [
        { phrase: 'Open dashboard', description: 'Go to dashboard page' },
        { phrase: 'Go to text to speech', description: 'Open TTS feature' },
        { phrase: 'Show translation', description: 'Open translation page' },
        { phrase: 'Open focus mode', description: 'Start focus reading' },
        { phrase: 'Show collections', description: 'View saved texts' },
        { phrase: 'Go to settings', description: 'Open settings page' }
      ]
    },
    reading: {
      name: 'Reading',
      icon: '📖',
      commands: [
        { phrase: 'Read this aloud', description: 'Start text-to-speech' },
        { phrase: 'Stop reading', description: 'Stop TTS playback' },
        { phrase: 'Pause', description: 'Pause current reading' },
        { phrase: 'Resume', description: 'Resume reading' }
      ]
    },
    features: {
      name: 'Features',
      icon: '⚡',
      commands: [
        { phrase: 'Translate to Spanish', description: 'Translate text to Spanish' },
        { phrase: 'Summarize this', description: 'Generate AI summary' },
        { phrase: 'Quiz me', description: 'Start comprehension quiz' },
        { phrase: 'Speed reading', description: 'Open speed trainer' },
        { phrase: 'Speed level 3', description: 'Set speed level (1-5)' }
      ]
    },
    collections: {
      name: 'Collections',
      icon: '📚',
      commands: [
        { phrase: 'Save this', description: 'Save current text' },
        { phrase: 'Save to favorites', description: 'Add to favorites' },
        { phrase: 'My collections', description: 'View all collections' },
        { phrase: 'Search for article', description: 'Search saved texts' }
      ]
    },
    goals: {
      name: 'Goals & Progress',
      icon: '🎯',
      commands: [
        { phrase: 'Show goals', description: 'View reading goals' },
        { phrase: 'My progress', description: 'See progress stats' },
        { phrase: 'What is my streak', description: 'Check reading streak' }
      ]
    },
    settings: {
      name: 'Settings',
      icon: '⚙️',
      commands: [
        { phrase: 'Open settings', description: 'Go to settings' },
        { phrase: 'Dark mode', description: 'Switch to dark theme' },
        { phrase: 'Light mode', description: 'Switch to light theme' },
        { phrase: 'Take a break', description: 'Start eye comfort timer' }
      ]
    }
  }

  const filteredCommands = Object.entries(commandCategories)
    .filter(([key]) => activeCategory === 'all' || key === activeCategory)
    .map(([key, category]) => ({
      ...category,
      commands: category.commands.filter(cmd =>
        cmd.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.commands.length > 0)

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
              Voice Commands
            </h3>
            <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
              Control VOXA with your voice
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[var(--text-secondary)]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[var(--text-secondary)]" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-[var(--border-color)]"
        >
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands..."
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium dyslexia-text transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-primary-100 dark:hover:bg-primary-900/20'
                }`}
              >
                All
              </button>
              {Object.entries(commandCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium dyslexia-text transition-colors ${
                    activeCategory === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-primary-100 dark:hover:bg-primary-900/20'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>

            {/* Commands List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredCommands.map((category) => (
                <div key={category.name}>
                  <h4 className="text-sm font-semibold text-[var(--text-secondary)] dyslexia-text mb-2">
                    {category.icon} {category.name}
                  </h4>
                  <div className="space-y-2">
                    {category.commands.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-3 p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      >
                        <Mic className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] dyslexia-text">
                            "{cmd.phrase}"
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                            {cmd.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredCommands.length === 0 && (
                <div className="text-center py-8 text-[var(--text-secondary)] dyslexia-text">
                  No commands found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 dyslexia-text">
                💡 Voice Tips:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 dyslexia-text">
                <li>• Speak clearly and naturally</li>
                <li>• Use the exact phrases shown above</li>
                <li>• Works best in quiet environments</li>
                <li>• Requires Chrome, Edge, or Safari browser</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VoiceCommandPanel
