import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Moon, Sun, Type, Eye, Volume2, Bell, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useEyeComfort } from '../context/EyeComfortContext'

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { settings: eyeSettings, updateSettings: updateEyeSettings, getStats } = useEyeComfort()
  const eyeStats = getStats()

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Font settings
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('voxa-font-size') || '16')
  })
  
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('voxa-font-family') || 'system'
  })

  // TTS settings
  const [ttsRate, setTtsRate] = useState(() => {
    return parseFloat(localStorage.getItem('voxa-tts-rate') || '1.0')
  })
  
  const [ttsPitch, setTtsPitch] = useState(() => {
    return parseFloat(localStorage.getItem('voxa-tts-pitch') || '1.0')
  })
  
  const [ttsVolume, setTtsVolume] = useState(() => {
    return parseFloat(localStorage.getItem('voxa-tts-volume') || '1.0')
  })

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('voxa-notifications') === 'true'
  })

  const handleSave = () => {
    try {
      // Save font settings
      localStorage.setItem('voxa-font-size', fontSize.toString())
      localStorage.setItem('voxa-font-family', fontFamily)
      
      // Save TTS settings
      localStorage.setItem('voxa-tts-rate', ttsRate.toString())
      localStorage.setItem('voxa-tts-pitch', ttsPitch.toString())
      localStorage.setItem('voxa-tts-volume', ttsVolume.toString())
      
      // Save notification settings
      localStorage.setItem('voxa-notifications', notificationsEnabled.toString())
      
      // Apply font settings to root
      document.documentElement.style.fontSize = `${fontSize}px`
      
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save settings')
      setTimeout(() => setError(''), 3000)
    }
  }

  // Apply font settings on mount
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  const fontFamilies = [
    { value: 'system', label: 'System Default', class: 'font-sans' },
    { value: 'serif', label: 'Serif', class: 'font-serif' },
    { value: 'mono', label: 'Monospace', class: 'font-mono' },
    { value: 'opendyslexic', label: 'OpenDyslexic', class: 'dyslexia-text' }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Settings
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Customize your VOXA experience
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-700 dark:text-green-300 text-sm dyslexia-text">{success}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 text-sm dyslexia-text">{error}</p>
          </motion.div>
        )}

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text">
                Account
              </h2>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Manage your account settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] dyslexia-text opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1 dyslexia-text">
                Email cannot be changed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              {isDark ? <Moon className="h-6 w-6 text-white" /> : <Sun className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text">
                Appearance
              </h2>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Customize how VOXA looks
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                  Dark Mode
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Switch between light and dark theme
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Font Family
              </label>
              <div className="grid grid-cols-2 gap-3">
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${font.class} ${
                      fontFamily === font.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : 'border-[var(--border-color)] hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold">{font.label}</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">Aa</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reading Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Type className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text">
                Reading
              </h2>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Optimize your reading experience
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TTS Speed */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Text-to-Speech Speed: {ttsRate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={ttsRate}
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            {/* TTS Pitch */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Voice Pitch: {ttsPitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={ttsPitch}
                onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* TTS Volume */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Volume: {Math.round(ttsVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={ttsVolume}
                onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Quiet</span>
                <span>Loud</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Eye Comfort Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text">
                Eye Comfort Timer
              </h2>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                20-20-20 rule: Rest your eyes every 20 minutes
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{eyeStats.totalBreaksTaken}</div>
              <div className="text-xs text-[var(--text-secondary)] dyslexia-text">Breaks Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{eyeStats.totalBreaksSkipped}</div>
              <div className="text-xs text-[var(--text-secondary)] dyslexia-text">Breaks Skipped</div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                  Enable Eye Comfort Timer
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Remind you to rest your eyes regularly
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={eyeSettings.enabled}
                  onChange={(e) => updateEyeSettings({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Interval */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Reminder Interval: {eyeSettings.interval} minutes
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 15, 20, 30].map((interval) => (
                  <button
                    key={interval}
                    onClick={() => updateEyeSettings({ interval })}
                    className={`p-3 rounded-lg border-2 transition-all dyslexia-text ${
                      eyeSettings.interval === interval
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : 'border-[var(--border-color)] hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold">{interval}</div>
                    <div className="text-xs text-[var(--text-secondary)]">min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Break Duration */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-3">
                Break Duration: {eyeSettings.breakDuration} seconds
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="10"
                value={eyeSettings.breakDuration}
                onChange={(e) => updateEyeSettings({ breakDuration: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>10s</span>
                <span>60s</span>
              </div>
            </div>

            {/* Sound Notification */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                  Sound Notification
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Play sound when break starts
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={eyeSettings.soundEnabled}
                  onChange={(e) => updateEyeSettings({ soundEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Auto Start */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                  Auto Start on Login
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Start timer automatically when you login
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={eyeSettings.autoStart}
                  onChange={(e) => updateEyeSettings({ autoStart: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 dyslexia-text flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              About the 20-20-20 Rule
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300 dyslexia-text">
              Every 20 minutes, look at something 20 feet away for 20 seconds. This helps reduce eye strain, 
              prevents dry eyes, and maintains focus during long reading sessions.
            </p>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dyslexia-text">
                Notifications
              </h2>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Manage your notification preferences
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--text-primary)] dyslexia-text">
                Enable Notifications
              </div>
              <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Receive achievement and progress updates
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg flex items-center space-x-2 dyslexia-text"
          >
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
