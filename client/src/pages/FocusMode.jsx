import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Focus, Play, Pause, Square, Settings as SettingsIcon, X, ArrowLeft, FileText, Volume2, Brain } from 'lucide-react'
import { useUser } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import WordTooltip from '../components/WordTooltip'
import { useBionic } from '../context/BionicContext'
import BionicText from '../components/BionicText'
import BionicToggle from '../components/BionicToggle'
import SaveToCollection from '../components/SaveToCollection'
import { goalsService } from '../services/goalsService'


const FocusMode = () => {
  const { settings, saveReadingProgress } = useUser()
  const navigate = useNavigate()
  
  // Text and playback state
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [words, setWords] = useState([])
  
  // Settings
  const [showSettings, setShowSettings] = useState(false)
  const [speed, setSpeed] = useState(settings?.focusModeSpeed || 200)
  const [pauseTime, setPauseTime] = useState(settings?.focusPauseTime || 500)
  const [wordByWord, setWordByWord] = useState(settings?.focusWordByWord || false)
  
  // Dictionary feature
  const [selectedWord, setSelectedWord] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [readMode, setReadMode] = useState(false)
  
  // Bionic reading
  const { enabled: bionicEnabled, intensity, toggleBionic, setIntensity } = useBionic()
  
  // Refs
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Receive text from other pages
  useEffect(() => {
    const incomingText = localStorage.getItem('focus-text')
    if (incomingText) {
      setText(incomingText)
      setReadMode(false)
      localStorage.removeItem('focus-text')
    }
  }, [])

  // Track reading progress for goals
    useEffect(() => {
      if (!isPaused && text.trim()) {
        const interval = setInterval(() => {
          const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
          goalsService.updateDailyProgress(wordsRead, 60000) // Update every minute
        }, 60000) // Every minute

        return () => clearInterval(interval)
      }
    }, [isPaused, text])


  // Word click handler for dictionary - WORKS WHEN PAUSED!
  const handleWordClick = (event) => {
    if (isPlaying && !isPaused) return
    
    event.preventDefault()
    event.stopPropagation()
    
    const clickedWord = event.target.textContent.trim()
    const cleanWord = clickedWord.replace(/[^\w\s'-]/gi, '').trim()
    
    if (cleanWord.length > 0 && cleanWord.length < 50) {
      setSelectedWord(cleanWord)
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      })
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
    setIsPaused(false)

    // Save reading progress
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
  }

  // Render clickable words when paused (with Bionic support)
  const getDisplayTextClickable = () => {
    if (words.length === 0) return ''

    if (wordByWord) {
      const currentWord = words[currentIndex] || ''
      return (
        <span
          onClick={handleWordClick}
          className="cursor-pointer hover:bg-purple-700/50 px-2 py-1 rounded transition-colors"
          style={{ 
            background: 'rgba(168, 85, 247, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          {bionicEnabled ? (
            <BionicText text={currentWord} intensity={intensity} />
          ) : (
            currentWord
          )}
        </span>
      )
    } else {
      const wordsPerLine = 5
      const startIdx = Math.max(0, currentIndex - 2)
      const endIdx = Math.min(words.length, startIdx + wordsPerLine)
      
      return words.slice(startIdx, endIdx).map((word, idx) => {
        const wordIdx = startIdx + idx
        let className = ''
        let style = {}
        
        if (wordIdx === currentIndex) {
          className = 'current-word cursor-pointer hover:bg-purple-700/50 transition-colors'
          style = {
            background: 'rgba(168, 85, 247, 0.4)',
            padding: '8px 16px',
            borderRadius: '8px'
          }
        } else if (wordIdx < currentIndex) {
          className = 'completed-word cursor-pointer hover:bg-purple-700/30 transition-colors'
          style = { opacity: 0.6 }
        } else {
          className = 'upcoming-word cursor-pointer hover:bg-purple-700/20 transition-colors'
          style = { opacity: 0.4 }
        }

        return (
          <span
            key={idx}
            className={className}
            style={style}
            onClick={handleWordClick}
          >
            {bionicEnabled ? (
              <BionicText text={word} intensity={intensity} />
            ) : (
              word
            )}{' '}
          </span>
        )
      })
    }
  }

  // Render text when playing (with Bionic support)
  const getDisplayText = () => {
    if (words.length === 0) return ''

    if (wordByWord) {
      const currentWord = words[currentIndex] || ''
      return bionicEnabled ? (
        <BionicText text={currentWord} intensity={intensity} />
      ) : (
        currentWord
      )
    } else {
      const wordsPerLine = 5
      const startIdx = Math.max(0, currentIndex - 2)
      const endIdx = Math.min(words.length, startIdx + wordsPerLine)
      
      const displayWords = words.slice(startIdx, endIdx)
      const displayText = displayWords.map((word, idx) => {
        const wordIdx = startIdx + idx
        if (wordIdx === currentIndex) {
          return `<span class="current-word">${word}</span>`
        } else if (wordIdx < currentIndex) {
          return `<span class="completed-word">${word}</span>`
        } else {
          return `<span class="upcoming-word">${word}</span>`
        }
      }).join(' ')

      return displayText
    }
  }

  const renderClickableText = () => {
    if (!text) return null
    
    if (bionicEnabled) {
      return <BionicText text={text} intensity={intensity} />
    }
    
    return text.split(/(\s+)/).map((part, idx) => {
      if (part.trim()) {
        return (
          <span
            key={idx}
            onClick={handleWordClick}
            className="cursor-pointer hover:bg-purple-900/30 px-0.5 rounded transition-colors inline-block"
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

  const sampleTexts = [
    {
      title: "Focus Exercise",
      content: "Reading in focus mode helps improve concentration and comprehension. By displaying words one at a time, your brain can process information more effectively without distractions."
    },
    {
      title: "Quick Practice",
      content: "This is a short practice text for testing focus mode. Try different speeds to find what works best for you."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Focus className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold dyslexia-text">Focus Mode</h1>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 border-b border-gray-700 px-4 py-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold dyslexia-text">Focus Mode Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dyslexia-text">
                    Reading Speed: {speed} WPM
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    step="25"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dyslexia-text">
                    Pause Between Lines: {pauseTime}ms
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={pauseTime}
                    onChange={(e) => setPauseTime(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wordByWord}
                      onChange={(e) => setWordByWord(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="dyslexia-text">Word-by-Word Mode</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Input Section */}
        {!isPlaying && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dyslexia-text">
                  Enter Text
                  <span className="text-xs ml-2 text-gray-400">(Click any word for definition)</span>
                </h2>
                <div className="flex items-center space-x-2">
                  {!readMode && text && (
                    <button
                      onClick={() => setReadMode(true)}
                      className="px-3 py-1 text-xs bg-purple-900 text-purple-300 rounded-lg hover:bg-purple-800 transition-colors"
                      title="Switch to read mode"
                    >
                      📖 Read Mode
                    </button>
                  )}
                  {readMode && (
                    <button
                      onClick={() => setReadMode(false)}
                      className="px-3 py-1 text-xs bg-pink-900 text-pink-300 rounded-lg hover:bg-pink-800 transition-colors"
                      title="Switch to edit mode"
                    >
                      ✏️ Edit Mode
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (text.trim()) {
                        localStorage.setItem('summarize-text', text)
                        navigate('/summarize')
                      }
                    }}
                    disabled={!text.trim()}
                    className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Summarize this text"
                  >
                    <FileText className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (text.trim()) {
                        localStorage.setItem('tts-text', text)
                        navigate('/text-to-speech')
                      }
                    }}
                    disabled={!text.trim()}
                    className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Listen to this text"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (text.trim()) {
                        localStorage.setItem('quiz-text', text)
                        navigate('/quiz')
                      }
                    }}
                    disabled={!text.trim()}
                    className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Take quiz on this text"
                  >
                    <Brain className="h-4 w-4" />
                  </button>


                  <SaveToCollection
                    text={text}
                    title={text.substring(0, 50) + '...'}
                    source="focus-mode"
                    className="ml-2"
                  />


                </div>
              </div>

              {/* Bionic Toggle */}
              <div className="mb-4">
                <BionicToggle
                  enabled={bionicEnabled}
                  onToggle={toggleBionic}
                  intensity={intensity}
                  onIntensityChange={setIntensity}
                />
              </div>
              
              {/* Edit Mode - Textarea */}
              {!readMode && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here to begin reading in focus mode..."
                  className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg text-white dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{
                    lineHeight: '1.8',
                    letterSpacing: '0.05em'
                  }}
                />
              )}

              {/* Read Mode - Clickable Text with Bionic */}
              {readMode && (
                <div
                  className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg text-white dyslexia-text overflow-y-auto"
                  style={{
                    lineHeight: '1.8',
                    letterSpacing: '0.05em',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                >
                  {text ? renderClickableText() : (
                    <span className="text-gray-500">No text entered yet. Switch to Edit Mode to add text.</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400 dyslexia-text">
                  {readMode ? '📖 Read mode - Click words for definitions' : '✏️ Edit mode - Type or paste text'}
                  {bionicEnabled && ' ⚡ Bionic mode active'}
                   • {text.split(' ').filter(w => w.trim()).length} words
                </span>
                <button
                  onClick={handleStart}
                  disabled={!text.trim()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dyslexia-text"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Focus Reading
                </button>
              </div>
            </div>

            {/* Sample Texts */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 dyslexia-text">Sample Texts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setText(sample.content)
                      setReadMode(false)
                    }}
                    className="text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700"
                  >
                    <div className="font-medium text-white dyslexia-text mb-2">
                      {sample.title}
                    </div>
                    <div className="text-sm text-gray-400 dyslexia-text line-clamp-2">
                      {sample.content.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Reading Display */}
        {(isPlaying || isPaused) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="w-full max-w-4xl">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 dyslexia-text">
                    Progress: {currentIndex + 1} / {words.length}
                  </span>
                  <span className="text-sm text-gray-400 dyslexia-text">
                    {Math.round(progress)}% {bionicEnabled && '⚡'}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Word Display */}
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 min-h-[300px] flex items-center justify-center">
                {/* PAUSED - Clickable words with Bionic */}
                {isPaused && (
                  <div
                    className="text-4xl md:text-6xl font-bold text-center dyslexia-text"
                    style={{
                      lineHeight: '1.6',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {getDisplayTextClickable()}
                  </div>
                )}

                {/* PLAYING - Animated words with Bionic */}
                {isPlaying && !isPaused && (
                  <div
                    className="text-4xl md:text-6xl font-bold text-center dyslexia-text"
                    style={{
                      lineHeight: '1.6',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {typeof getDisplayText() === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: getDisplayText() }} />
                    ) : (
                      getDisplayText()
                    )}
                  </div>
                )}
              </div>

              {/* Pause hint when paused */}
              {isPaused && (
                <div className="text-center mt-4">
                  <p className="text-sm text-yellow-400 dyslexia-text">
                    ✨ Click any word to see its definition
                    {bionicEnabled && ' • ⚡ Bionic mode active'}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mt-8">
                {!isPaused ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center justify-center w-14 h-14 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
                    title="Pause to look up words"
                  >
                    <Pause className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    title="Resume reading"
                  >
                    <Play className="h-6 w-6" />
                  </button>
                )}

                <button
                  onClick={handleStop}
                  className="flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Stop reading"
                >
                  <Square className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-400 dyslexia-text">
                  {isPaused ? '⏸️ Paused - Click words for definitions' : '▶️ Reading...'}
                  {bionicEnabled && ' ⚡'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Word Tooltip */}
      {selectedWord && (
        <WordTooltip
          word={selectedWord}
          position={tooltipPosition}
          onClose={() => setSelectedWord(null)}
        />
      )}

      <style>{`
        .current-word {
          background: rgba(168, 85, 247, 0.3);
          padding: 8px 16px;
          border-radius: 8px;
          animation: pulse 1s infinite;
        }

        .completed-word {
          opacity: 0.5;
        }

        .upcoming-word {
          opacity: 0.3;
        }

        @keyframes pulse {
          0%, 100% { background: rgba(168, 85, 247, 0.3); }
          50% { background: rgba(168, 85, 247, 0.5); }
        }
      `}</style>
    </div>
  )
}

export default FocusMode
