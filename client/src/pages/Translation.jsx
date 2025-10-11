import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Languages, Volume2, Copy, CheckCircle, Loader2, Info, RefreshCw, 
  Sparkles, AlertCircle, CheckCircle2, ArrowLeftRight, Zap, Globe, 
  Mic, ArrowLeft, BookOpen, Flag, Users, TrendingUp, ChevronDown
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { translationService } from '../services/translationService.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { goalsService } from '../services/goalsService'
import VoiceButton from '../components/voice/VoiceButton'

// Safe settings hook with fallback
const useSettingsSafe = () => {
  try {
    const stored = localStorage.getItem('voxa-settings')
    return stored ? JSON.parse(stored) : { preferredTranslationLanguage: 'es', autoTranslate: false }
  } catch {
    return { preferredTranslationLanguage: 'es', autoTranslate: false }
  }
}

const Translation = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const storedSettings = useSettingsSafe()

  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [detectedLanguage, setDetectedLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState(storedSettings.preferredTranslationLanguage || 'es')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(storedSettings.autoTranslate || false)
  const [languages, setLanguages] = useState([])
  const [serverStatus, setServerStatus] = useState({ status: 'checking', hasApiKey: false })
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  useEffect(() => {
    const loadLanguages = async () => {
      const langs = await translationService.getSupportedLanguages()
      setLanguages(langs)
    }

    const checkServer = async () => {
      const status = await translationService.checkServerHealth()
      setServerStatus(status)
    }

    loadLanguages()
    checkServer()
  }, [])

  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      const newSettings = event.detail
      if (newSettings.preferredTranslationLanguage) {
        setTargetLanguage(newSettings.preferredTranslationLanguage)
      }
      if (newSettings.autoTranslate !== undefined) {
        setAutoTranslate(newSettings.autoTranslate)
      }
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate)
  }, [])

  useEffect(() => {
    if (!autoTranslate) return

    const timer = setTimeout(() => {
      if (sourceText.trim().length > 0) {
        handleTranslate()
      } else {
        setTranslatedText('')
        setDetectedLanguage('')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [sourceText, targetLanguage, autoTranslate])

  useEffect(() => {
    const handleVoiceAction = (event) => {
      const { action, data } = event.detail
      
      switch (action) {
        case 'translate':
          handleTranslate()
          break
        case 'setLanguage':
          setTargetLanguage(data.language)
          break
        case 'dictate':
          setSourceText(prev => prev + ' ' + data.text)
          break
        default:
          break
      }
    }

    window.addEventListener('voicePageAction', handleVoiceAction)
    return () => window.removeEventListener('voicePageAction', handleVoiceAction)
  }, [])

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setLoading(true)
    setError('')

    try {
      const result = await translationService.translateText(sourceText, targetLanguage)

      if (result.success) {
        setTranslatedText(result.translatedText)
        setDetectedLanguage(result.detectedLanguage)
        goalsService.updateChallengeProgress('translations', 1)
      } else {
        if (result.error.includes('Rate limit') || result.error.includes('Daily limit')) {
          setError('⏱️ Daily limit reached (50,000 chars). Try again tomorrow!')
        } else {
          setError(result.error || 'Translation failed')
        }
        setTranslatedText('')
      }
    } catch (err) {
      setError('Translation failed. Please try again.')
      setTranslatedText('')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleSpeak = (text, langCode) => {
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = langCode === 'zh' ? 'zh-CN' : langCode
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  const handleSwapLanguages = () => {
    if (!translatedText) return
    setSourceText(translatedText)
    setTranslatedText(sourceText)
    setDetectedLanguage(translationService.getLanguageName(targetLanguage))
  }

  const sampleTexts = [
    { text: "Hello, how are you today?", emoji: "👋" },
    { text: "Thank you very much for your help.", emoji: "🙏" },
    { text: "Good morning! Welcome to our school.", emoji: "🌅" },
    { text: "Technology is changing the world.", emoji: "🚀" },
    { text: "I love learning new languages.", emoji: "📚" },
    { text: "The weather is beautiful today.", emoji: "☀️" }
  ]

  const selectedLanguageData = languages.find(l => l.code === targetLanguage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      
      {/* Hero Header */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-green-600 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl hover:bg-white/30 transition-all"
                  >
                    <ArrowLeft className="h-6 w-6 text-white" />
                  </motion.button>
                  <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                    <Languages className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    AI TRANSLATION
                  </h1>
                </div>
                <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                  Break language barriers instantly! 🌍✨
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">{languages.length}</div>
                  <div className="text-sm text-white/80 fun-font">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">50K</div>
                  <div className="text-sm text-white/80 fun-font">Free Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">
                    {sourceText.length}
                  </div>
                  <div className="text-sm text-white/80 fun-font">Characters</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {serverStatus.status === 'ok' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          >
            <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="font-bold text-green-700 dark:text-green-300 fun-font text-lg">
                  ✨ Translation service ready • {serverStatus.freeLimit || '50,000 chars/day'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          >
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="font-bold text-red-700 dark:text-red-300 fun-font text-base">{error}</p>
                </div>
                <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 mb-6"
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Language Selector - IMPROVED */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 fun-font mb-2">
                Translate to:
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-between space-x-3 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all">
                      <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xl font-black text-gray-800 dark:text-white game-font">
                      {selectedLanguageData?.name || 'Select Language'}
                    </span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Premium Dropdown */}
                <AnimatePresence>
                  {showLanguageDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowLanguageDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 p-3 z-50 max-h-80 overflow-y-auto"
                      >
                        <div className="grid grid-cols-1 gap-2">
                          {languages.map((lang) => (
                            <motion.button
                              key={lang.code}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setTargetLanguage(lang.code)
                                setShowLanguageDropdown(false)
                              }}
                              className={`p-4 text-left rounded-xl transition-all ${
                                targetLanguage === lang.code
                                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                                  : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                            >
                              <div className="font-bold fun-font text-lg">{lang.name}</div>
                              <div className={`text-sm ${targetLanguage === lang.code ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                {lang.code.toUpperCase()}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Auto-Translate Toggle */}
            <div className="flex items-center space-x-4 lg:border-l-2 lg:border-gray-200 dark:border-gray-700 lg:pl-6">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-base font-bold text-gray-800 dark:text-white fun-font">
                    Auto-Translate
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all shadow-inner"></div>
                </div>
              </label>
            </div>

            {/* Detected Language */}
            {detectedLanguage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 lg:border-l-2 lg:border-t-0"
              >
                <div className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 fun-font font-bold">Detected:</div>
                    <div className="text-base font-black text-purple-700 dark:text-purple-300 game-font">
                      {detectedLanguage}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Translation Areas - IMPROVED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Source Text - LARGER */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                Source Text
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSpeak(sourceText, 'en')}
                  disabled={!sourceText.trim()}
                  className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-30 transition-all"
                >
                  <Volume2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(sourceText)}
                  disabled={!sourceText.trim()}
                  className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-30 transition-all"
                >
                  {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type, paste, or speak your text here... 🎤"
                className="w-full h-[500px] p-6 pr-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl text-gray-800 dark:text-white fun-font text-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
              />
              <div className="absolute bottom-6 right-6">
                <VoiceButton
                  mode="typing"
                  onTranscript={(transcript) => setSourceText(transcript)}
                  size="lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font flex items-center">
                <Mic className="h-4 w-4 mr-2" />
                {sourceText.length} / 5,000 characters
              </span>
              {sourceText.trim().length > 0 && !autoTranslate && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTranslate}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-black fun-font text-lg shadow-lg hover:shadow-2xl disabled:opacity-50 transition-all flex items-center space-x-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      <Languages className="h-6 w-6" />
                      <span>Translate</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Swap Button - CENTER */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapLanguages}
              disabled={!translatedText}
              className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-2xl hover:shadow-3xl disabled:opacity-30 transition-all"
            >
              <ArrowLeftRight className="h-8 w-8" />
            </motion.button>
          </div>

          {/* Translated Text - LARGER */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font flex items-center">
                <Languages className="h-6 w-6 mr-3 text-green-600" />
                {selectedLanguageData?.name || 'Translation'}
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSpeak(translatedText, targetLanguage)}
                  disabled={!translatedText.trim()}
                  className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-30 transition-all"
                >
                  <Volume2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText.trim()}
                  className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-30 transition-all"
                >
                  <Copy className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <div
              className="w-full h-[500px] p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl overflow-y-auto fun-font text-xl text-gray-800 dark:text-white"
              style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-16 w-16 animate-spin text-green-600 dark:text-green-400 mb-4" />
                  <span className="text-2xl font-bold text-gray-700 dark:text-gray-300 game-font">Translating...</span>
                  <span className="text-base text-gray-500 dark:text-gray-400 fun-font mt-2">Please wait</span>
                </div>
              ) : translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Languages className="h-20 w-20 mb-4 opacity-30" />
                  <p className="text-2xl font-bold game-font">Translation will appear here</p>
                  <p className="text-base fun-font mt-2">Enter text to get started</p>
                </div>
              )}
            </div>

            {translatedText && (
              <div className="mt-4 text-base font-bold text-gray-600 dark:text-gray-400 fun-font">
                {translatedText.length} characters • MyMemory Free
              </div>
            )}
          </motion.div>
        </div>

        {/* Sample Texts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800"
        >
          <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
            <Sparkles className="h-7 w-7 mr-3 text-yellow-500" />
            Try Sample Texts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleTexts.map((sample, index) => (
              <motion.button
                key={index}
                onClick={() => setSourceText(sample.text)}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="p-6 text-left bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl hover:shadow-2xl transition-all border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{sample.emoji}</div>
                <div className="text-base font-bold text-gray-800 dark:text-white fun-font leading-relaxed">
                  {sample.text}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Translation
