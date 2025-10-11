import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, Square, Upload, Volume2, Settings, Copy, RotateCcw, 
  CheckCircle, AlertCircle, Loader, Heart, X, FileText, Brain, Mic,
  Sparkles, Zap, BookOpen, ArrowLeft, Sliders, Eye, Trophy, Users, ChevronDown
} from 'lucide-react'
import { ttsService } from '../utils/textToSpeech.js'
import { useUser } from '../context/UserContext.jsx'
import WordTooltip from '../components/WordTooltip'
import { sentimentService } from '../services/sentimentService'
import SentimentDisplay from '../components/SentimentDisplay'
import { useBionic } from '../context/BionicContext'
import BionicText from '../components/BionicText'
import BionicToggle from '../components/BionicToggle'
import SaveToCollection from '../components/SaveToCollection'
import { goalsService } from '../services/goalsService'
import VoiceButton from '../components/voice/VoiceButton'

const TextToSpeech = () => {
  const { saveReadingProgress } = useUser()
  const navigate = useNavigate()
  
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [volume, setVolume] = useState(1.0)
  const [showSettings, setShowSettings] = useState(false)
  
  const [currentProgress, setCurrentProgress] = useState({
    currentWord: '',
    currentIndex: 0,
    totalWords: 0,
    progress: 0
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [readMode, setReadMode] = useState(false)
  
  const [selectedWord, setSelectedWord] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null)
  const [showSentiment, setShowSentiment] = useState(false)
  
  const { enabled: bionicEnabled, intensity, toggleBionic, setIntensity } = useBionic()
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = ttsService.getVoices()
      setVoices(availableVoices)
      if (availableVoices.length > 0 && !selectedVoice) {
        const englishVoice = availableVoices.find(voice => 
          voice.lang.includes('en') && voice.name.includes('Google')
        ) || availableVoices.find(voice => voice.lang.includes('en'))
        setSelectedVoice(englishVoice?.name || availableVoices[0].name)
      }
    }
    loadVoices()
    const intervals = [100, 500, 1000, 2000].map(delay => setTimeout(loadVoices, delay))
    return () => intervals.forEach(clearTimeout)
  }, [selectedVoice])

  useEffect(() => {
    const incomingText = localStorage.getItem('tts-text')
    if (incomingText) {
      setText(incomingText)
      setReadMode(false)
      localStorage.removeItem('tts-text')
      setSuccess('Text loaded! Ready to listen.')
      setTimeout(() => setSuccess(''), 3000)
    }
  }, [])

  useEffect(() => {
    const handleVoiceAction = (event) => {
      const { action } = event.detail
      switch (action) {
        case 'play': handleSpeak(); break
        case 'pause': handleStop(); break
        case 'clear': handleClear(); break
        case 'dictate': setText(prev => prev + ' ' + event.detail.data.text); break
        default: break
      }
    }
    window.addEventListener('voicePageAction', handleVoiceAction)
    return () => window.removeEventListener('voicePageAction', handleVoiceAction)
  }, [])

  const handleAnalyzeSentiment = () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }
    const analysis = sentimentService.getSummary(text)
    setSentimentAnalysis(analysis)
    setShowSentiment(true)
    setSuccess('Sentiment analysis complete!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleWordClick = (event) => {
    if (isPlaying) return
    event.preventDefault()
    event.stopPropagation()
    const clickedWord = event.target.textContent.trim()
    const cleanWord = clickedWord.replace(/[^\w\s'-]/gi, '').trim()
    if (cleanWord.length > 0 && cleanWord.length < 50 && !cleanWord.includes(' ')) {
      setSelectedWord(cleanWord)
      setTooltipPosition({ x: event.clientX, y: event.clientY })
    }
  }

  const handleSpeak = async () => {
    if (!text.trim()) {
      setError('Please enter some text to speak')
      return
    }
    setError('')
    setLoading(true)
    
    try {
      const startTime = Date.now()
      await ttsService.speak(text, {
        rate, pitch, volume, voice: selectedVoice,
        onStart: () => {
          setIsPlaying(true)
          setIsPaused(false)
          setLoading(false)
          setReadMode(false)
          setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: text.split(' ').length, progress: 0 })
        },
        onProgress: (progress) => setCurrentProgress(progress),
        onEnd: () => {
          setIsPlaying(false)
          setIsPaused(false)
          setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: 0, progress: 0 })
          setSuccess('Text read successfully!')
          setTimeout(() => setSuccess(''), 3000)
          const duration = Date.now() - startTime
          const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
          goalsService.updateDailyProgress(wordsRead, duration)
          saveReadingProgress(`tts-${Date.now()}`, {
            text: text.substring(0, 100),
            completed: true,
            duration,
            sessionType: 'text-to-speech'
          })
        },
        onPause: () => setIsPaused(true),
        onResume: () => setIsPaused(false),
        onError: (error) => {
          setError(`Speech error: ${error}`)
          setIsPlaying(false)
          setIsPaused(false)
          setLoading(false)
          setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: 0, progress: 0 })
        }
      })
    } catch (error) {
      setError(`Failed to start speech: ${error.message}`)
      setIsPlaying(false)
      setLoading(false)
    }
  }

  const handlePause = () => {
    if (isPlaying && !isPaused) ttsService.pause()
    else if (isPaused) ttsService.resume()
  }

  const handleStop = () => {
    ttsService.stop()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: 0, progress: 0 })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        if (content.length > 10000) {
          setError('File is too large. Please use files under 10,000 characters.')
          return
        }
        setText(content)
        setError('')
        setSuccess('File uploaded successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
      reader.onerror = () => setError('Error reading file. Please try again.')
      reader.readAsText(file)
    } else {
      setError('Please upload a valid text file (.txt)')
    }
  }

  const handleCopyText = async () => {
    if (!text) {
      setError('No text to copy')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setSuccess('Text copied to clipboard!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to copy text')
    }
  }

  const handleClear = () => {
    setText('')
    handleStop()
    setError('')
    setSuccess('')
    setReadMode(false)
    setShowSentiment(false)
    setSentimentAnalysis(null)
    setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: 0, progress: 0 })
  }

  const handleTestVoice = async () => {
    if (!selectedVoice) return
    setLoading(true)
    try {
      await ttsService.speak('This is a test of the selected voice.', {
        rate, pitch, volume, voice: selectedVoice
      })
    } catch (error) {
      setError('Voice test failed. Please try a different voice.')
    } finally {
      setLoading(false)
    }
  }

  const sampleTexts = [
    {
      title: "Welcome to VOXA",
      content: "VOXA is designed to make reading more accessible and enjoyable for everyone. Our text-to-speech feature uses advanced AI to provide natural-sounding voices that can help you consume content in a whole new way.",
      emoji: "🎉",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Reading Benefits",
      content: "Regular reading improves vocabulary, enhances focus, reduces stress, and stimulates mental activity. With VOXA's accessibility features, everyone can enjoy these benefits regardless of reading challenges.",
      emoji: "📚",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Technology and Learning",
      content: "Modern technology has revolutionized the way we learn and process information. Tools like text-to-speech, real-time translation, and focus modes are breaking down barriers to education and making knowledge more accessible than ever before.",
      emoji: "🚀",
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  const highlightCurrentWord = (text, currentIndex) => {
    if (currentIndex === 0 || !isPlaying) return text
    const words = text.split(' ')
    return words.map((word, index) => {
      if (index === currentIndex - 1) {
        return `<span class="tts-current-word">${word}</span>`
      }
      return word
    }).join(' ')
  }

  const renderClickableText = () => {
    if (!text) return null
    if (bionicEnabled) return <BionicText text={text} intensity={intensity} />
    return text.split(/(\s+)/).map((part, idx) => {
      if (part.trim()) {
        return (
          <span
            key={idx}
            onClick={handleWordClick}
            className="cursor-pointer hover:bg-purple-500/20 px-0.5 sm:px-1 py-0.5 rounded transition-all inline-block hover:scale-105"
            title="Click for definition"
          >
            {part}
          </span>
        )
      }
      return <span key={idx}>{part}</span>
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      
      {/* Hero Header - Same style as Community */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
        >
          {/* Animated background orbs */}
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
                    <Volume2 className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    TEXT TO SPEECH
                  </h1>
                </div>
                <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                  Natural AI voices bring your text to life! 🎤✨
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">{voices.length}</div>
                  <div className="text-sm text-white/80 fun-font">Voices</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">{text.split(' ').length}</div>
                  <div className="text-sm text-white/80 fun-font">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">
                    {Math.round(currentProgress.progress)}%
                  </div>
                  <div className="text-sm text-white/80 fun-font">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts - Same style as Community */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }} 
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-[60] bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm sm:text-base fun-font font-bold flex-1">{error}</p>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }} 
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-[60] bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-300 text-sm sm:text-base fun-font font-bold flex-1">{success}</p>
              <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Three Column Layout - Same as Community */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Quick Actions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 sticky top-8">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-blue-200 dark:border-blue-800 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">Upload File</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Load .txt file</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyText}
                  disabled={!text}
                  className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200 dark:border-purple-800 text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <Copy className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">Copy Text</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">To clipboard</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyzeSentiment}
                  disabled={!text.trim()}
                  className="w-full p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-pink-200 dark:border-pink-800 text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">Sentiment</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Analyze emotion</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { if (text.trim()) { localStorage.setItem('quiz-text', text); navigate('/quiz') }}}
                  disabled={!text.trim()}
                  className="w-full p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-indigo-200 dark:border-indigo-800 text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">Take Quiz</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Test knowledge</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { if (text.trim()) { localStorage.setItem('summarize-text', text); navigate('/summarize') }}}
                  disabled={!text.trim()}
                  className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-yellow-200 dark:border-yellow-800 text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">Summarize</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Get summary</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  disabled={!text}
                  className="w-full p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-red-200 dark:border-red-800 text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font">Clear All</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Reset text</div>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Voice Input Info */}
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="h-5 w-5 text-green-600" />
                  <h4 className="font-bold text-green-900 dark:text-green-100 fun-font">Voice Input</h4>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 fun-font leading-relaxed">
                  Click the microphone to speak your text! 🎤
                </p>
              </div>
            </div>
          </motion.div>

          {/* CENTER - Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            {/* Text Input Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font flex items-center">
                  {readMode ? '📖 Read Mode' : '✏️ Edit Mode'}
                </h2>
                
                <div className="flex items-center space-x-2">
                  {!readMode && text && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setReadMode(true)} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold fun-font shadow-lg">
                      <BookOpen className="h-4 w-4 inline mr-1" />
                      Read
                    </motion.button>
                  )}
                  {readMode && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setReadMode(false)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold fun-font shadow-lg">
                      <Sparkles className="h-4 w-4 inline mr-1" />
                      Edit
                    </motion.button>
                  )}
                  <SaveToCollection text={text} title={text.substring(0, 50) + '...'} source="text-to-speech" />
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 fun-font text-base mb-4">
                {readMode ? 'Click words for definitions' : 'Type, paste, or speak your text 🎤'}
              </p>

              {/* Bionic Toggle */}
              <div className="mb-4">
                <BionicToggle enabled={bionicEnabled} onToggle={toggleBionic} intensity={intensity} onIntensityChange={setIntensity} />
              </div>

              {/* Text Area */}
              {!readMode && !isPlaying ? (
                <div className="relative">
                  <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste, type, or speak your text... 🎤✨" className="w-full h-80 p-6 pr-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl text-gray-800 dark:text-white fun-font text-lg resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all" style={{ lineHeight: '1.8', letterSpacing: '0.05em' }} maxLength={5000} />
                  <div className="absolute bottom-4 right-4">
                    <VoiceButton mode="typing" onTranscript={(transcript) => setText(prev => prev + (prev ? ' ' : '') + transcript)} size="md" />
                  </div>
                </div>
              ) : readMode && !isPlaying ? (
                <div className="w-full h-80 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl text-gray-800 dark:text-white fun-font text-lg overflow-y-auto" style={{ lineHeight: '1.8', letterSpacing: '0.05em', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {text ? renderClickableText() : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-7xl mb-4">📚</div>
                      <span className="text-xl text-gray-400 font-bold">No text yet</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-80 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl text-gray-800 dark:text-white fun-font text-lg overflow-y-auto" style={{ lineHeight: '1.8', letterSpacing: '0.05em', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: highlightCurrentWord(text, currentProgress.currentIndex) }} />
              )}

              <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />

              {/* Bottom Info */}
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-400 fun-font font-bold">
                    {isPlaying ? '▶️ Playing' : readMode ? '📖 Read' : '✏️ Edit'}
                    {bionicEnabled && ' ⚡'}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 fun-font font-bold">
                  {text.length}/5000 • ~{Math.ceil(text.split(' ').length / (rate * 150))} min
                </span>
              </div>

              {/* Progress Bar - When Playing */}
              {isPlaying && currentProgress.totalWords > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-gray-800 dark:text-white fun-font">Reading Progress</span>
                    <span className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">{currentProgress.currentIndex}/{currentProgress.totalWords}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div animate={{ width: `${currentProgress.progress}%` }} transition={{ duration: 0.3 }} className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 h-full rounded-full shadow-lg" />
                  </div>
                  {currentProgress.currentWord && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 text-center">
                      <span className="text-3xl font-black text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 rounded-2xl game-font shadow-2xl inline-block">
                        {currentProgress.currentWord}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sentiment Analysis */}
            <AnimatePresence>
              {showSentiment && sentimentAnalysis && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-pink-200 dark:border-pink-800 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font">Sentiment Analysis</h3>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowSentiment(false)} className="p-2 text-gray-600 hover:text-gray-800">
                      <X className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <SentimentDisplay analysis={sentimentAnalysis} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sample Texts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                Sample Texts
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {sampleTexts.map((sample, index) => (
                  <motion.button key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => { setText(sample.content); setReadMode(false) }} disabled={isPlaying} className="text-left p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl hover:shadow-2xl transition-all border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 disabled:opacity-50 relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${sample.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="relative z-10">
                      <div className="text-5xl mb-3">{sample.emoji}</div>
                      <div className="font-black text-gray-800 dark:text-white game-font text-xl mb-2">{sample.title}</div>
                      <div className="text-base text-gray-600 dark:text-gray-400 fun-font line-clamp-2 leading-relaxed">{sample.content.substring(0, 100)}...</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR - Controls */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Playback Controls */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-800 sticky top-8">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Volume2 className="h-6 w-6 mr-2 text-blue-600" />
                Controls
              </h3>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSpeak} disabled={!text.trim() || (isPlaying && !isPaused) || loading} className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl disabled:opacity-30 transition-all border-4 border-white/20">
                  {loading ? <Loader className="h-9 w-9 animate-spin" /> : <Play className="h-9 w-9" />}
                </motion.button>
                
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePause} disabled={!isPlaying} className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-2xl hover:shadow-3xl disabled:opacity-30 transition-all border-4 border-white/20">
                  <Pause className="h-9 w-9" />
                </motion.button>
                
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleStop} disabled={!isPlaying && !isPaused} className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl disabled:opacity-30 transition-all border-4 border-white/20">
                  <Square className="h-9 w-9" />
                </motion.button>
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 px-5 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                  <div className={`w-3 h-3 rounded-full ${loading ? 'bg-blue-500 animate-pulse' : isPlaying ? 'bg-green-500 animate-pulse' : isPaused ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  <span className="text-lg font-black text-gray-800 dark:text-white game-font">
                    {loading ? 'Loading' : isPlaying ? (isPaused ? 'Paused' : 'Playing') : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-bold text-gray-800 dark:text-white fun-font mb-3">
                    Voice ({voices.length} available)
                  </label>
                  <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white fun-font text-base focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                  {selectedVoice && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleTestVoice} disabled={loading || isPlaying} className="mt-3 w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-2xl font-bold fun-font hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all disabled:opacity-50">
                      🎤 Test Voice
                    </motion.button>
                  )}
                </div>

                {/* Advanced Settings Toggle */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSettings(!showSettings)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold fun-font flex items-center justify-between">
                  <span className="flex items-center">
                    <Sliders className="h-5 w-5 mr-2" />
                    Advanced Settings
                  </span>
                  <motion.div animate={{ rotate: showSettings ? 180 : 0 }}>
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <div>
                        <label className="block text-base font-bold text-gray-800 dark:text-white fun-font mb-3">
                          Speed: <span className="text-blue-600">{rate.toFixed(1)}x</span>
                        </label>
                        <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-3 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-800 dark:text-white fun-font mb-3">
                          Pitch: <span className="text-green-600">{pitch.toFixed(1)}</span>
                        </label>
                        <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full h-3 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-500" />
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-800 dark:text-white fun-font mb-3">
                          Volume: <span className="text-purple-600">{Math.round(volume * 100)}%</span>
                        </label>
                        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-3 bg-purple-200 rounded-full appearance-none cursor-pointer accent-purple-500" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-xl border-2 border-yellow-200 dark:border-yellow-800">
              <h4 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-yellow-600" />
                Pro Tips
              </h4>
              <ul className="space-y-3 text-base text-gray-700 dark:text-gray-300 fun-font font-bold">
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <span style={{ lineHeight: '1.8' }}>Use Read Mode to click words for definitions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">⚡</span>
                  <span style={{ lineHeight: '1.8' }}>Enable Bionic Reading for enhanced focus</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">🎯</span>
                  <span style={{ lineHeight: '1.8' }}>Adjust speed to match your pace</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {selectedWord && <WordTooltip word={selectedWord} position={tooltipPosition} onClose={() => setSelectedWord(null)} />}

      <style>{`
        .tts-current-word {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.3));
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          border: 2px solid rgba(59, 130, 246, 0.5);
          animation: ttsPulse 1.5s infinite;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          font-weight: 700;
        }
        @keyframes ttsPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
      `}</style>
    </div>
  )
}

export default TextToSpeech

