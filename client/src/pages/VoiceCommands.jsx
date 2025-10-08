import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Sparkles, Volume2, Languages, Focus, FileText, Brain, Zap, Settings, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import SpeechRecognition from 'react-speech-recognition'

const VoiceCommands = () => {
  const [localListening, setLocalListening] = useState(false)

  // Check if speech recognition is supported
  const browserSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const handleStart = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
    setLocalListening(true)
  }

  const handleStop = () => {
    SpeechRecognition.stopListening()
    setLocalListening(false)
  }

  const commandCategories = [
    {
      title: 'Navigation Commands',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      commands: [
        { phrase: 'Go to dashboard', description: 'Navigate to dashboard' },
        { phrase: 'Open text to speech', description: 'Open TTS page' },
        { phrase: 'Show translation', description: 'Go to translation' },
        { phrase: 'Open focus mode', description: 'Start focus reading' },
        { phrase: 'Go to summarize', description: 'Open summarizer' },
        { phrase: 'Start quiz', description: 'Take comprehension quiz' },
        { phrase: 'Open speed reading', description: 'Practice speed reading' },
        { phrase: 'Show collections', description: 'View saved items' },
        { phrase: 'Open goals', description: 'Track reading goals' },
        { phrase: 'Go to import', description: 'Import text' },
        { phrase: 'Open settings', description: 'Adjust settings' }
      ]
    },
    {
      title: 'Scroll Commands',
      icon: Focus,
      color: 'from-orange-500 to-red-500',
      commands: [
        { phrase: 'Scroll down', description: 'Scroll page down' },
        { phrase: 'Scroll up', description: 'Scroll page up' },
        { phrase: 'Scroll to top', description: 'Go to top of page' },
        { phrase: 'Scroll to bottom', description: 'Go to bottom of page' }
      ]
    },
    {
      title: 'Dictation Commands',
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      commands: [
        { phrase: 'Start dictation', description: 'Enable voice typing' },
        { phrase: 'Stop dictation', description: 'Disable voice typing' }
      ]
    },
    {
      title: 'Page-Specific Commands',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      commands: [
        { phrase: 'Summarize this', description: 'Generate summary (Summarize page)' },
        { phrase: 'Translate this', description: 'Translate text (Translation page)' },
        { phrase: 'Play / Pause', description: 'Control playback (TTS page)' },
        { phrase: 'Start reading', description: 'Begin focus mode (Focus page)' },
        { phrase: 'Clear text', description: 'Clear input text' }
      ]
    },
    {
      title: 'Theme Commands',
      icon: Settings,
      color: 'from-indigo-500 to-purple-500',
      commands: [
        { phrase: 'Dark mode', description: 'Switch to dark theme' },
        { phrase: 'Light mode', description: 'Switch to light theme' }
      ]
    },
    {
      title: 'Control Commands',
      icon: MicOff,
      color: 'from-red-500 to-pink-500',
      commands: [
        { phrase: 'Stop listening', description: 'Disable voice commands' },
        { phrase: 'Help', description: 'Show this page' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4"
          >
            <Mic className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Voice Commands
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Control VOXA hands-free with 50+ voice commands
          </p>
        </div>

        {/* Browser Support Check */}
        {!browserSupported && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 dyslexia-text mb-2">
                  Voice Recognition Not Supported
                </h3>
                <p className="text-red-700 dark:text-red-300 dyslexia-text mb-2">
                  Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Voice Control */}
        {browserSupported && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                  Global Voice Control
                </h2>
                <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Click to start - works on all pages with floating button
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={localListening ? handleStop : handleStart}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold dyslexia-text transition-all shadow-lg ${
                  localListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                {localListening ? (
                  <>
                    <MicOff className="h-6 w-6" />
                    <span>Stop Voice Commands</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6" />
                    <span>Start Voice Commands</span>
                  </>
                )}
              </motion.button>
            </div>

            {localListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-sm text-green-700 dark:text-green-300 dyslexia-text font-medium">
                    🎤 Voice commands active! Look for the red floating button in bottom-right corner.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Command Categories */}
        <div className="space-y-6">
          {commandCategories.map((category, idx) => {
            const Icon = category.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
              >
                <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${category.color} rounded-lg mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-bold text-white dyslexia-text">
                    {category.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.commands.map((cmd, cmdIdx) => (
                    <div
                      key={cmdIdx}
                      className="flex items-start p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-transparent hover:border-primary-300"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-[var(--text-primary)] dyslexia-text mb-1">
                          "{cmd.phrase}"
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] dyslexia-text">
                          {cmd.description}
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2 mt-1" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-[var(--text-secondary)] dyslexia-text text-sm">
            <li>💡 Voice commands work on ALL pages after you start them</li>
            <li>💡 Red floating button shows voice is active</li>
            <li>💡 Click the floating button or say "stop listening" to stop</li>
            <li>💡 Navigate between pages while keeping voice active</li>
            <li>💡 Use "start dictation" to type with your voice</li>
            <li>💡 Say commands clearly at normal speaking pace</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default VoiceCommands
