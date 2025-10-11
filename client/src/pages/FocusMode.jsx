import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Focus, Play, Pause, Square, Settings as SettingsIcon, X, ArrowLeft, 
  FileText, Volume2, Brain, Mic, Sparkles, Zap, Eye, Maximize2,
  Type, Target, BookOpen, ChevronRight, Clock, TrendingUp, Award
} from 'lucide-react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import WordTooltip from '../components/WordTooltip'
import { useBionic } from '../context/BionicContext'
import BionicText from '../components/BionicText'
import BionicToggle from '../components/BionicToggle'
import SaveToCollection from '../components/SaveToCollection'
import { goalsService } from '../services/goalsService'
import VoiceButton from '../components/voice/VoiceButton'

const FocusMode = () => {
  const { settings, saveReadingProgress } = useUser()
  const navigate = useNavigate()
  
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [words, setWords] = useState([])
  
  const [showSettings, setShowSettings] = useState(false)
  const [speed, setSpeed] = useState(settings?.focusModeSpeed || 200)
  const [pauseTime, setPauseTime] = useState(settings?.focusPauseTime || 500)
  const [wordByWord, setWordByWord] = useState(settings?.focusWordByWord || false)
  
  const [selectedWord, setSelectedWord] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [readMode, setReadMode] = useState(false)
  
  const { enabled: bionicEnabled, intensity, toggleBionic, setIntensity } = useBionic()
  
  const [sessionStats, setSessionStats] = useState({
    wordsRead: 0,
    timeElapsed: 0,
    wpm: 0
  })
  
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const statsIntervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    const incomingText = localStorage.getItem('focus-text')
    if (incomingText) {
      setText(incomingText)
      setReadMode(false)
      localStorage.removeItem('focus-text')
    }
  }, [])

  useEffect(() => {
    if (isPlaying && !isPaused && text.trim()) {
      statsIntervalRef.current = setInterval(() => {
        const wordsRead = currentIndex
        const timeElapsed = Date.now() - startTimeRef.current
        const wpm = Math.round((wordsRead / (timeElapsed / 60000)))
        
        setSessionStats({ wordsRead, timeElapsed, wpm: wpm || 0 })
        goalsService.updateDailyProgress(wordsRead, 60000)
      }, 1000)

      return () => {
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current)
      }
    }
  }, [isPlaying, isPaused, text, currentIndex])

  useEffect(() => {
    const handleVoiceAction = (event) => {
      const { action } = event.detail
      switch (action) {
        case 'startFocus': if (text.trim()) handleStart(); break
        case 'pauseFocus': handlePause(); break
        case 'stopFocus': handleStop(); break
        case 'dictate': setText(prev => prev + ' ' + event.detail.data.text); break
        default: break
      }
    }
    window.addEventListener('voicePageAction', handleVoiceAction)
    return () => window.removeEventListener('voicePageAction', handleVoiceAction)
  }, [text])

  const handleWordClick = (event) => {
    if (isPlaying && !isPaused) return
    event.preventDefault()
    event.stopPropagation()
    const clickedWord = event.target.textContent.trim()
    const cleanWord = clickedWord.replace(/[^\w\s'-]/gi, '').trim()
    if (cleanWord.length > 0 && cleanWord.length < 50) {
      setSelectedWord(cleanWord)
      setTooltipPosition({ x: event.clientX, y: event.clientY })
    }
  }

  const handleStart = () => {
    if (!text.trim()) return
    const textWords = text.split(' ').filter(w => w.trim())
    setWords(textWords)
    setCurrentIndex(0)
    setIsPlaying(true)
    setIsPaused(false)
    setReadMode(false)
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= textWords.length) {
          handleStop()
          return prev
        }
        return nextIndex
      })
    }, 60000 / speed)
  }

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleResume = () => {
    setIsPaused(false)
    setIsPlaying(true)
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= words.length) {
          handleStop()
          return prev
        }
        return nextIndex
      })
    }, 60000 / speed)
  }

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current)
    intervalRef.current = null
    statsIntervalRef.current = null
    setIsPlaying(false)
    setIsPaused(false)
    if (startTimeRef.current && currentIndex > 0) {
      try {
        const duration = Date.now() - startTimeRef.current
        saveReadingProgress(`focus-${Date.now()}`, {
          text: text.substring(0, 100),
          completed: currentIndex >= words.length - 1,
          duration,
          sessionType: 'focus-mode',
          progress: (currentIndex / words.length) * 100
        })
      } catch (error) {
        console.warn('Failed to save reading progress:', error)
      }
    }
    setCurrentIndex(0)
    setSessionStats({ wordsRead: 0, timeElapsed: 0, wpm: 0 })
  }

  const getDisplayTextClickable = () => {
    if (words.length === 0) return ''
    if (wordByWord) {
      const currentWord = words[currentIndex] || ''
      return (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={handleWordClick}
          className="inline-block cursor-pointer px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-purple-400/60 backdrop-blur-xl hover:scale-105 transition-transform shadow-2xl"
        >
          {bionicEnabled ? <BionicText text={currentWord} intensity={intensity} /> : currentWord}
        </motion.span>
      )
    } else {
      const wordsPerLine = 5
      const startIdx = Math.max(0, currentIndex - 2)
      const endIdx = Math.min(words.length, startIdx + wordsPerLine)
      return words.slice(startIdx, endIdx).map((word, idx) => {
        const wordIdx = startIdx + idx
        let className = wordIdx === currentIndex 
          ? 'focus-current-word' 
          : wordIdx < currentIndex 
          ? 'focus-completed-word' 
          : 'focus-upcoming-word'
        return (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${className} inline-block cursor-pointer hover:scale-105 transition-transform`}
            onClick={handleWordClick}
          >
            {bionicEnabled ? <BionicText text={word} intensity={intensity} /> : word}{' '}
          </motion.span>
        )
      })
    }
  }

  const getDisplayText = () => {
    if (words.length === 0) return ''
    if (wordByWord) {
      const currentWord = words[currentIndex] || ''
      return bionicEnabled ? <BionicText text={currentWord} intensity={intensity} /> : currentWord
    } else {
      const wordsPerLine = 5
      const startIdx = Math.max(0, currentIndex - 2)
      const endIdx = Math.min(words.length, startIdx + wordsPerLine)
      const displayWords = words.slice(startIdx, endIdx)
      const displayText = displayWords.map((word, idx) => {
        const wordIdx = startIdx + idx
        if (wordIdx === currentIndex) return `<span class="focus-playing-current">${word}</span>`
        else if (wordIdx < currentIndex) return `<span class="focus-playing-completed">${word}</span>`
        else return `<span class="focus-playing-upcoming">${word}</span>`
      }).join(' ')
      return displayText
    }
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

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const sampleTexts = [
    {
      title: "Focus Practice",
      content: "Reading in focus mode helps improve concentration and comprehension. By displaying words one at a time, your brain can process information more effectively without distractions. This technique is scientifically proven to enhance reading speed and retention.",
      emoji: "🎯",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Speed Reading",
      content: "Speed reading is not just about reading faster, it's about reading smarter. Focus on key words and let your peripheral vision catch the rest. Minimize subvocalization and trust your brain to process information quickly.",
      emoji: "⚡",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Brain Training",
      content: "This exercise will help train your brain to read more efficiently. Start at a comfortable pace and gradually increase the speed. Your brain will adapt and you'll notice improvements in both speed and comprehension.",
      emoji: "🧠",
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  // FULL SCREEN READING MODE
  if (isPlaying || isPaused) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 text-white overflow-hidden z-[100]">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        {/* Top Bar - FIXED & ALWAYS VISIBLE */}
        <motion.div 
          initial={{ y: -100 }} 
          animate={{ y: 0 }} 
          className="fixed top-0 left-0 right-0 z-[110] bg-black/50 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
        >
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            {/* Mobile Layout */}
            <div className="block sm:hidden space-y-3">
              <div className="flex items-center justify-between">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={handleStop} 
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-600/90 backdrop-blur-lg rounded-xl font-black fun-font text-sm flex items-center space-x-2 border-2 border-white/20 shadow-xl"
                >
                  <X className="h-4 w-4" />
                  <span>Exit</span>
                </motion.button>
                {bionicEnabled && (
                  <div className="px-3 py-2 bg-purple-500/40 backdrop-blur-lg rounded-xl border-2 border-purple-400/40 shadow-lg flex items-center space-x-1">
                    <Sparkles className="h-4 w-4 text-purple-300" />
                    <span className="text-xs font-bold">Bionic</span>
                  </div>
                )}
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="px-3 py-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg text-center">
                  <Clock className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-sm font-black game-font">{formatTime(sessionStats.timeElapsed)}</div>
                  <div className="text-xs text-white/60 fun-font">Time</div>
                </div>
                <div className="px-3 py-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg text-center">
                  <Zap className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                  <div className="text-sm font-black game-font">{sessionStats.wpm}</div>
                  <div className="text-xs text-white/60 fun-font">WPM</div>
                </div>
                <div className="px-3 py-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg text-center">
                  <BookOpen className="h-4 w-4 text-green-400 mx-auto mb-1" />
                  <div className="text-sm font-black game-font">{sessionStats.wordsRead}/{words.length}</div>
                  <div className="text-xs text-white/60 fun-font">Words</div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handleStop} 
                className="px-6 py-3 bg-red-500/80 hover:bg-red-600/90 backdrop-blur-lg rounded-2xl font-black fun-font text-base flex items-center space-x-2 border-2 border-white/20 shadow-xl"
              >
                <X className="h-5 w-5" />
                <span>Exit Focus</span>
              </motion.button>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-5 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 shadow-xl">
                  <Clock className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-xs text-white/60 fun-font font-bold">Time</div>
                    <div className="text-xl font-black game-font">{formatTime(sessionStats.timeElapsed)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 px-5 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 shadow-xl">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <div>
                    <div className="text-xs text-white/60 fun-font font-bold">Speed</div>
                    <div className="text-xl font-black game-font">{sessionStats.wpm} WPM</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 px-5 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-white/20 shadow-xl">
                  <BookOpen className="h-6 w-6 text-green-400" />
                  <div>
                    <div className="text-xs text-white/60 fun-font font-bold">Progress</div>
                    <div className="text-xl font-black game-font">{sessionStats.wordsRead}/{words.length}</div>
                  </div>
                </div>
                
                {bionicEnabled && (
                  <div className="flex items-center space-x-2 px-5 py-3 bg-purple-500/30 backdrop-blur-lg rounded-2xl border-2 border-purple-400/40 shadow-xl">
                    <Sparkles className="h-5 w-5 text-purple-300" />
                    <span className="text-sm font-bold fun-font">Bionic Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Reading Area */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-8 pt-32 sm:pt-36 pb-20 sm:pb-24">
          
          {/* Progress Ring */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 sm:mb-8 md:mb-12">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <svg className="transform -rotate-90 w-full h-full">
                <circle cx="50%" cy="50%" r="38%" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/10" />
                <motion.circle animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - progress / 100) }} transition={{ duration: 0.5 }} cx="50%" cy="50%" r="38%" stroke="url(#progressGrad)" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 38}`} strokeLinecap="round" className="drop-shadow-2xl" />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg sm:text-2xl md:text-3xl font-black game-font">{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Word Display */}
          <motion.div key={currentIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-7xl">
            <div className="bg-white/5 backdrop-blur-3xl rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-12 md:p-16 lg:p-24 border border-white/10 shadow-2xl min-h-[200px] sm:min-h-[300px] md:min-h-[400px] flex items-center justify-center">
              {isPaused ? (
                <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-center game-font leading-tight" style={{ lineHeight: '1.4', letterSpacing: '0.03em', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  {getDisplayTextClickable()}
                </div>
              ) : (
                <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-center game-font leading-tight" style={{ lineHeight: '1.4', letterSpacing: '0.03em', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  {typeof getDisplayText() === 'string' ? <div dangerouslySetInnerHTML={{ __html: getDisplayText() }} /> : getDisplayText()}
                </div>
              )}
            </div>
          </motion.div>

          {/* Pause Hint */}
          {isPaused && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 sm:mt-6 md:mt-8 text-center px-4">
              <p className="text-base sm:text-lg md:text-2xl text-yellow-300 fun-font font-bold flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Click any word for definition</span>
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </p>
            </motion.div>
          )}

          {/* FLOATING SPEED CONTROL */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed left-2 sm:left-4 md:left-6 bottom-32 sm:bottom-36 md:bottom-40 z-[105]"
          >
            <div className="bg-black/40 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border-2 border-white/20 shadow-2xl w-40 sm:w-48 md:w-56">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/60 fun-font font-bold">Speed</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white game-font leading-tight">{speed}</div>
                  <div className="text-xs text-white/60 fun-font font-bold -mt-1">WPM</div>
                </div>
              </div>
              
              <input
                type="range"
                min="100"
                max="400"
                step="25"
                value={speed}
                onChange={(e) => {
                  const newSpeed = parseInt(e.target.value)
                  setSpeed(newSpeed)
                  if (isPlaying && !isPaused && intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = setInterval(() => {
                      setCurrentIndex(prev => {
                        const nextIndex = prev + 1
                        if (nextIndex >= words.length) {
                          handleStop()
                          return prev
                        }
                        return nextIndex
                      })
                    }, 60000 / newSpeed)
                  }
                }}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer mb-3"
              />
              
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {[
                  { label: 'Slow', value: 150, emoji: '🐌' },
                  { label: 'Med', value: 250, emoji: '🚶' },
                  { label: 'Fast', value: 350, emoji: '🏃' }
                ].map((preset) => (
                  <motion.button
                    key={preset.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSpeed(preset.value)
                      if (isPlaying && !isPaused && intervalRef.current) {
                        clearInterval(intervalRef.current)
                        intervalRef.current = setInterval(() => {
                          setCurrentIndex(prev => {
                            const nextIndex = prev + 1
                            if (nextIndex >= words.length) {
                              handleStop()
                              return prev
                            }
                            return nextIndex
                          })
                        }, 60000 / preset.value)
                      }
                    }}
                    className={`px-1 py-2 rounded-lg text-xs font-black fun-font transition-all ${
                      speed === preset.value
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <div className="text-base mb-0.5">{preset.emoji}</div>
                    {preset.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Control Buttons */}
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-6 mt-6 sm:mt-8 md:mt-12">
            {!isPaused ? (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePause} className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full hover:shadow-2xl transition-all shadow-xl border-2 sm:border-4 border-white/20">
                <Pause className="h-7 w-7 sm:h-9 sm:w-9 md:h-12 md:w-12" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleResume} className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:shadow-2xl transition-all shadow-xl border-2 sm:border-4 border-white/20">
                <Play className="h-7 w-7 sm:h-9 sm:w-9 md:h-12 md:w-12" />
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleStop} className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-2xl transition-all shadow-xl border-2 sm:border-4 border-white/20">
              <Square className="h-7 w-7 sm:h-9 sm:w-9 md:h-12 md:w-12" />
            </motion.button>
          </motion.div>

          <div className="mt-4 sm:mt-6 md:mt-8 text-center">
            <span className="text-sm sm:text-base md:text-xl text-white/70 fun-font font-bold">
              {isPaused ? '⏸️ Paused' : '▶️ Reading...'}
              {bionicEnabled && ' • ⚡'}
            </span>
          </div>
        </div>

        {selectedWord && <WordTooltip word={selectedWord} position={tooltipPosition} onClose={() => setSelectedWord(null)} />}

        <style>{`
          .focus-current-word {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5));
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            border: 2px solid rgba(168, 85, 247, 0.7);
            animation: focusPulse 1.5s infinite;
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
          }
          .focus-completed-word { opacity: 0.4; padding: 0.25rem 0.5rem; }
          .focus-upcoming-word { opacity: 0.25; padding: 0.25rem 0.5rem; }
          .focus-playing-current {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5));
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            border: 2px solid rgba(168, 85, 247, 0.7);
            animation: focusPulse 1.5s infinite;
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
          }
          .focus-playing-completed { opacity: 0.3; }
          .focus-playing-upcoming { opacity: 0.2; }
          @keyframes focusPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
            50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(168, 85, 247, 0.9); }
          }
          
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #eab308, #f97316);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(234, 179, 8, 0.6);
          }
          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #eab308, #f97316);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(234, 179, 8, 0.6);
          }
        `}</style>
      </div>
    )
  }

  // SETUP SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pb-20">
      
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b-2 border-purple-200 dark:border-purple-800 shadow-lg sticky top-0 z-50">
        <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)} className="p-2 sm:p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl sm:rounded-2xl transition-all">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg">
                  <Focus className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>
                    Focus Mode
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 fun-font font-bold hidden sm:block">
                    Immersive reading 🎯
                  </p>
                </div>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSettings(!showSettings)} className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          </div>
        </div>
      </div>

            {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-b-2 border-purple-200 dark:border-purple-800 shadow-inner overflow-hidden">
            <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-purple-600" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 dark:text-white game-font">Settings</h2>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSettings(false)} className="p-2 sm:p-3 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-xl sm:rounded-2xl transition-all">
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* Speed */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <label className="block text-base sm:text-lg md:text-xl font-black text-gray-800 dark:text-white game-font">Speed</label>
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-blue-600 game-font">{speed}</span>
                      <span className="text-xs sm:text-sm text-gray-600 ml-1">WPM</span>
                    </div>
                  </div>
                  <input type="range" min="100" max="400" step="25" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full h-2 sm:h-3 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
                  <div className="flex justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 fun-font font-bold">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Pause Time */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <label className="block text-base sm:text-lg md:text-xl font-black text-gray-800 dark:text-white game-font">Pause</label>
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-green-600 game-font">{pauseTime}</span>
                      <span className="text-xs sm:text-sm text-gray-600 ml-1">ms</span>
                    </div>
                  </div>
                  <input type="range" min="200" max="2000" step="100" value={pauseTime} onChange={(e) => setPauseTime(parseInt(e.target.value))} className="w-full h-2 sm:h-3 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-500" />
                </div>

                {/* Word Mode */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl">
                      <Type className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <label className="text-base sm:text-lg md:text-xl font-black text-gray-800 dark:text-white game-font">Mode</label>
                  </div>
                  <label className="flex items-center space-x-3 sm:space-x-4 cursor-pointer p-4 sm:p-5 bg-purple-50 dark:bg-purple-900/30 rounded-xl sm:rounded-2xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all">
                    <input type="checkbox" checked={wordByWord} onChange={(e) => setWordByWord(e.target.checked)} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-600 bg-white border-2 border-purple-300 rounded-lg focus:ring-purple-500 cursor-pointer" />
                    <span className="text-sm sm:text-base md:text-lg fun-font font-bold text-gray-700 dark:text-gray-300">Word-by-Word</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        
        {/* Main Input */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8 sm:mb-10 md:mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl md:rounded-[2rem] p-4 sm:p-6 md:p-10 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
            
            {/* Toolbar */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white game-font mb-2" style={{ letterSpacing: '0.02em' }}>
                  {readMode ? '📖 Read' : '✏️ Edit'}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 fun-font font-bold">
                  {readMode ? 'Click words for definitions' : 'Type, paste, or speak 🎤'}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                {!readMode && text && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setReadMode(true)} className="col-span-2 sm:col-span-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl font-black fun-font text-xs sm:text-sm md:text-base shadow-lg flex items-center justify-center space-x-1 sm:space-x-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">Read</span>
                  </motion.button>
                )}
                {readMode && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setReadMode(false)} className="col-span-2 sm:col-span-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl font-black fun-font text-xs sm:text-sm md:text-base shadow-lg flex items-center justify-center space-x-1 sm:space-x-2">
                    <Type className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">Edit</span>
                  </motion.button>
                )}
                
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { if (text.trim()) { localStorage.setItem('summarize-text', text); navigate('/summarize') }}} disabled={!text.trim()} className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl sm:rounded-2xl hover:shadow-lg transition-all disabled:opacity-30" title="Summarize">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { if (text.trim()) { localStorage.setItem('tts-text', text); navigate('/text-to-speech') }}} disabled={!text.trim()} className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl hover:shadow-lg transition-all disabled:opacity-30" title="Listen">
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { if (text.trim()) { localStorage.setItem('quiz-text', text); navigate('/quiz') }}} disabled={!text.trim()} className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl sm:rounded-2xl hover:shadow-lg transition-all disabled:opacity-30" title="Quiz">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </motion.button>

                <div className="hidden sm:block">
                  <SaveToCollection text={text} title={text.substring(0, 50) + '...'} source="focus-mode" />
                </div>
              </div>
            </div>

            {/* Bionic Toggle */}
            <div className="mb-4 sm:mb-6">
              <BionicToggle enabled={bionicEnabled} onToggle={toggleBionic} intensity={intensity} onIntensityChange={setIntensity} />
            </div>
            
            {/* Text Input */}
            {!readMode ? (
              <div className="relative">
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste, type, or speak your text... 🎤✨" className="w-full h-64 sm:h-80 md:h-96 p-4 sm:p-6 md:p-8 pr-12 sm:pr-16 md:pr-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl sm:rounded-3xl text-gray-800 dark:text-white fun-font text-base sm:text-lg md:text-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all" style={{ lineHeight: '1.8', letterSpacing: '0.05em', wordSpacing: '0.1em' }} />
                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6">
                  <VoiceButton mode="typing" onTranscript={(transcript) => setText(transcript)} size="md" />
                </div>
              </div>
            ) : (
              <div className="w-full h-64 sm:h-80 md:h-96 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl sm:rounded-3xl text-gray-800 dark:text-white fun-font text-base sm:text-lg md:text-xl overflow-y-auto" style={{ lineHeight: '1.8', letterSpacing: '0.05em', wordSpacing: '0.1em', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {text ? renderClickableText() : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">📚</div>
                    <span className="text-lg sm:text-xl md:text-2xl text-gray-400 dark:text-gray-500 font-bold px-4">No text yet</span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 fun-font font-bold">
                  {readMode ? <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />}
                  <span className="hidden sm:inline">{readMode ? 'Read mode' : 'Edit mode'}</span>
                </div>
                {bionicEnabled && (
                  <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl border border-purple-300 dark:border-purple-700">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-600" />
                    <span className="text-xs sm:text-sm md:text-base font-bold text-purple-600 fun-font">Bionic</span>
                  </div>
                )}
                <div className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl border border-blue-300 dark:border-blue-700">
                  <span className="text-xs sm:text-sm md:text-base font-black text-blue-600 game-font">{text.split(' ').filter(w => w.trim()).length} words</span>
                </div>
              </div>
              
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStart} disabled={!text.trim()} className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-xl sm:rounded-2xl font-black fun-font text-base sm:text-lg md:text-2xl shadow-2xl hover:shadow-3xl disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mr-2 sm:mr-3" />
                <span>Start Reading</span>
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ml-2 sm:ml-3" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Sample Texts */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
            <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white game-font" style={{ letterSpacing: '0.02em' }}>Samples</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 fun-font font-bold hidden sm:block">Quick start ✨</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sampleTexts.map((sample, index) => (
              <motion.button key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => { setText(sample.content); setReadMode(false) }} className="group text-left p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${sample.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-4xl sm:text-5xl md:text-6xl">{sample.emoji}</span>
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <div className="font-black text-gray-800 dark:text-white game-font text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 leading-tight" style={{ letterSpacing: '0.02em' }}>{sample.title}</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 fun-font font-bold line-clamp-2 sm:line-clamp-3 leading-relaxed">{sample.content.substring(0, 100)}...</div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                    <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 fun-font font-black">Load →</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 sm:mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-2xl sm:rounded-3xl md:rounded-[2rem] p-6 sm:p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white game-font mb-3 sm:mb-4" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)', letterSpacing: '0.02em' }}>Why Focus? 🎯</h2>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 fun-font font-bold max-w-3xl mx-auto leading-relaxed px-4">Experience reading like never before</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { title: "Better Focus", desc: "Eliminate distractions", emoji: "🎯" },
                  { title: "Faster Reading", desc: "Train to read 2x faster", emoji: "⚡" },
                  { title: "More Retention", desc: "Remember 80% more", emoji: "🧠" },
                  { title: "Less Eye Strain", desc: "Optimized display", emoji: "👁️" }
                ].map((feature, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="bg-white/20 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-white/30 hover:border-white/50 transition-all text-center">
                    <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4">{feature.emoji}</div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white game-font mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-white/90 fun-font font-bold leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {selectedWord && <WordTooltip word={selectedWord} position={tooltipPosition} onClose={() => setSelectedWord(null)} />}
    </div>
  )
}

export default FocusMode

