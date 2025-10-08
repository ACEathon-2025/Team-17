import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Square, Upload, Volume2, Settings, Download, Copy, RotateCcw, Sliders, CheckCircle, AlertCircle, Loader, Heart, X, Zap, FileText, Brain } from 'lucide-react'
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
  const textareaRef = useRef(null)
  const displayRef = useRef(null)

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
    const intervals = [100, 500, 1000, 2000].map(delay => 
      setTimeout(loadVoices, delay)
    )
    
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
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      })
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
        rate,
        pitch,
        volume,
        voice: selectedVoice,
        onStart: () => {
          setIsPlaying(true)
          setIsPaused(false)
          setLoading(false)
          setReadMode(false)
          setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: text.split(' ').length, progress: 0 })
        },
        onProgress: (progress) => {
          setCurrentProgress(progress)
        },
        onEnd: () => {
          setIsPlaying(false)
          setIsPaused(false)
          setCurrentProgress({ currentWord: '', currentIndex: 0, totalWords: 0, progress: 0 })
          setSuccess('Text read successfully!')
          setTimeout(() => setSuccess(''), 3000)
          
          const duration = Date.now() - startTime
          const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
          
          // Update goals
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
    if (isPlaying && !isPaused) {
      ttsService.pause()
    } else if (isPaused) {
      ttsService.resume()
    }
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
      reader.onerror = () => {
        setError('Error reading file. Please try again.')
      }
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
        rate,
        pitch,
        volume,
        voice: selectedVoice
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
      content: "VOXA is designed to make reading more accessible and enjoyable for everyone. Our text-to-speech feature uses advanced AI to provide natural-sounding voices that can help you consume content in a whole new way."
    },
    {
      title: "Reading Benefits",
      content: "Regular reading improves vocabulary, enhances focus, reduces stress, and stimulates mental activity. With VOXA's accessibility features, everyone can enjoy these benefits regardless of reading challenges."
    },
    {
      title: "Technology and Learning",
      content: "Modern technology has revolutionized the way we learn and process information. Tools like text-to-speech, real-time translation, and focus modes are breaking down barriers to education and making knowledge more accessible than ever before."
    }
  ]

  const highlightCurrentWord = (text, currentIndex) => {
    if (currentIndex === 0 || !isPlaying) return text
    
    const words = text.split(' ')
    return words.map((word, index) => {
      if (index === currentIndex - 1) {
        return `<span class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${word}</span>`
      }
      return word
    }).join(' ')
  }

  const renderClickableText = () => {
    if (!text) return null
    
    return text.split(/(\s+)/).map((part, idx) => {
      if (part.trim()) {
        return (
          <span
            key={idx}
            onClick={handleWordClick}
            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 px-0.5 rounded transition-colors inline-block"
            style={{ userSelect: 'text' }}
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
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4">
            <Volume2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Text to Speech
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Convert any text into natural-sounding speech with customizable voice settings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm dyslexia-text">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm dyslexia-text">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                  Enter Text
                  <span className="text-xs ml-2 text-[var(--text-secondary)]">(Click any word for definition)</span>
                </h2>
                <div className="flex items-center space-x-2">
                  {!readMode && text && (
                    <button
                      onClick={() => setReadMode(true)}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="Switch to read mode"
                    >
                      📖 Read Mode
                    </button>
                  )}
                  {readMode && (
                    <button
                      onClick={() => setReadMode(false)}
                      className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                      title="Switch to edit mode"
                    >
                      ✏️ Edit Mode
                    </button>
                  )}
                  <button
                    onClick={handleAnalyzeSentiment}
                    disabled={!text.trim()}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Analyze sentiment"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (text.trim()) {
                        localStorage.setItem('quiz-text', text)
                        navigate('/quiz')
                      }
                    }}
                    disabled={!text.trim()}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Take comprehension quiz"
                  >
                    <Brain className="h-4 w-4" />
                  </button>

                  <SaveToCollection
                    text={text}
                    title={text.substring(0, 50) + '...'}
                    source="text-to-speech"
                  />


                  <button
                    onClick={() => {
                      if (text.trim()) {
                        localStorage.setItem('summarize-text', text)
                        navigate('/summarize')
                      }
                    }}
                    disabled={!text.trim()}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Summarize this text"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    title="Upload file"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCopyText}
                    disabled={!text}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy text"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!text}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear text"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <BionicToggle
                  enabled={bionicEnabled}
                  onToggle={toggleBionic}
                  intensity={intensity}
                  onIntensityChange={setIntensity}
                />
              </div>
              
              {!readMode && !isPlaying && (
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here, or upload a text file..."
                  className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  style={{
                    lineHeight: '1.8',
                    letterSpacing: '0.05em'
                  }}
                  maxLength={5000}
                />
              )}

              {readMode && !isPlaying && (
                <div
                  ref={displayRef}
                  className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text overflow-y-auto"
                  style={{
                    lineHeight: '1.8',
                    letterSpacing: '0.05em',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                >
                  {text ? (
                    bionicEnabled ? (
                      <div style={{ fontWeight: 'normal' }}>
                        <BionicText text={text} intensity={intensity} />
                      </div>
                    ) : (
                      renderClickableText()
                    )
                  ) : (
                    <span className="text-gray-400">No text entered yet. Switch to Edit Mode to add text.</span>
                  )}
                </div>
              )}

              {isPlaying && (
                <div
                  className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text overflow-y-auto"
                  style={{
                    lineHeight: '1.8',
                    letterSpacing: '0.05em',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightCurrentWord(text, currentProgress.currentIndex)
                  }}
                />
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[var(--text-secondary)] dyslexia-text">
                  {isPlaying ? '▶️ Playing...' : readMode ? '📖 Read mode - Click words for definitions' : '✏️ Edit mode - Type or paste text'}
                  {bionicEnabled && ' ⚡ Bionic mode active'}
                </p>
                <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {text.length}/5000 characters
                </span>
              </div>

              <div className="text-sm text-[var(--text-secondary)] dyslexia-text text-right mt-1">
                Estimated time: {Math.ceil(text.split(' ').length / (rate * 150))} min
              </div>

              {isPlaying && currentProgress.totalWords > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--text-primary)] dyslexia-text">
                      Reading Progress
                    </span>
                    <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                      {currentProgress.currentIndex}/{currentProgress.totalWords} words
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentProgress.progress}%` }}
                    />
                  </div>
                  {currentProgress.currentWord && (
                    <div className="mt-2 text-center">
                      <span className="text-lg font-semibold text-primary-600 bg-primary-100 dark:bg-primary-800 px-3 py-1 rounded-full">
                        {currentProgress.currentWord}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {showSentiment && sentimentAnalysis && (
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                    Sentiment Analysis
                  </h3>
                  <button
                    onClick={() => setShowSentiment(false)}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SentimentDisplay analysis={sentimentAnalysis} />
              </div>
            )}

            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Try Sample Texts
              </h3>
              <div className="space-y-3">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setText(sample.content)
                      setReadMode(false)
                    }}
                    disabled={isPlaying}
                    className="w-full text-left p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {sample.title}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] dyslexia-text line-clamp-2">
                      {sample.content.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Playback Controls
              </h3>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={handleSpeak}
                  disabled={!text.trim() || (isPlaying && !isPaused) || loading}
                  className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <Loader className="h-6 w-6 animate-spin" /> : <Play className="h-6 w-6" />}
                </button>
                
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className="flex items-center justify-center w-12 h-12 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Pause className="h-6 w-6" />
                </button>
                
                <button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="flex items-center justify-center w-12 h-12 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full hover:bg-red-100 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Square className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center mb-4">
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {loading ? 'Loading...' : isPlaying ? (isPaused ? 'Paused' : 'Playing') : 'Stopped'}
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                  Voice Settings
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Sliders className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                    Voice ({voices.length} available)
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                  {selectedVoice && (
                    <button
                      onClick={handleTestVoice}
                      disabled={loading || isPlaying}
                      className="mt-2 w-full px-3 py-1 text-xs bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      Test Voice
                    </button>
                  )}
                </div>

                {showSettings && (
                  <div className="space-y-4 border-t border-[var(--border-color)] pt-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                        Speed: {rate.toFixed(1)}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                        <span>Slow</span>
                        <span>Fast</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                        Pitch: {pitch.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] dyslexia-text mb-2">
                        Volume: {Math.round(volume * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                        <span>Quiet</span>
                        <span>Loud</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedWord && (
        <WordTooltip
          word={selectedWord}
          position={tooltipPosition}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  )
}

export default TextToSpeech
