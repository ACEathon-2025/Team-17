import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Upload, Copy, RotateCcw, CheckCircle, AlertCircle, Loader, 
  Zap, TrendingDown, Clock, ArrowRight, Volume2, Focus, Brain, Bookmark, 
  Mic, ArrowLeft, Sparkles, BookOpen, Target, Trophy, X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { summarizationService } from '../services/summarizationService'
import { useUser } from '../context/UserContext'
import SummaryDisplay from '../components/SummaryDisplay'
import { useBionic } from '../context/BionicContext'
import BionicText from '../components/BionicText'
import BionicToggle from '../components/BionicToggle'
import { collectionsService } from '../services/collectionsService'
import { goalsService } from '../services/goalsService'
import VoiceButton from '../components/voice/VoiceButton'

const Summarize = () => {
  const navigate = useNavigate()
  const { saveReadingProgress } = useUser()
  const { enabled: bionicEnabled, intensity, toggleBionic, setIntensity } = useBionic()
  
  const [text, setText] = useState('')
  const [summaryResult, setSummaryResult] = useState(null)
  const [summarizing, setSummarizing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [summaryLength, setSummaryLength] = useState('medium')
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    const incomingText = localStorage.getItem('summarize-text')
    if (incomingText) {
      setText(incomingText)
      localStorage.removeItem('summarize-text')
      setSuccess('Text loaded! Ready to summarize.')
      setTimeout(() => setSuccess(''), 3000)
    }
  }, [])

  useEffect(() => {
    const handleVoiceAction = (event) => {
      const { action, data } = event.detail
      
      switch (action) {
        case 'summarize':
          if (text.trim()) {
            handleSummarize()
          }
          break
        case 'clear':
          handleClear()
          break
        case 'dictate':
          setText(prev => prev + ' ' + data.text)
          break
        default:
          break
      }
    }

    window.addEventListener('voicePageAction', handleVoiceAction)
    return () => window.removeEventListener('voicePageAction', handleVoiceAction)
  }, [text])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target.result
          if (content.length > 20000) {
            setError('File is too large. Please use files under 20,000 characters.')
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
  }

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    const wordCount = text.split(/\s+/).length
    
    if (wordCount < 50) {
      setError('Text is too short. Please provide at least 50 words for summarization.')
      return
    }

    setError('')
    setSummarizing(true)
    setShowSummary(false)

    const lengthParams = {
      short: { maxLength: 80, minLength: 20 },
      medium: { maxLength: 130, minLength: 30 },
      long: { maxLength: 200, minLength: 50 }
    }

    try {
      const startTime = Date.now()
      const result = await summarizationService.summarizeText(
        text, 
        lengthParams[summaryLength]
      )

      if (result.success) {
        setSummaryResult(result)
        setShowSummary(true)
        setSuccess('Summary generated successfully!')
        setTimeout(() => setSuccess(''), 3000)
        
        const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
        const duration = Date.now() - startTime
        goalsService.updateDailyProgress(wordsRead, duration)
        goalsService.updateChallengeProgress('summaries', 1)

        try {
          await saveReadingProgress(`summary-${Date.now()}`, {
            text: text.substring(0, 100),
            summary: result.summary.substring(0, 100),
            completed: true,
            duration,
            sessionType: 'summarization'
          })
        } catch (progressError) {
          console.warn('Failed to save reading progress (non-critical):', progressError)
        }
      } else if (result.loading) {
        setError(`${result.error} Retrying automatically...`)
        setTimeout(() => {
          setError('')
          handleSummarize()
        }, (result.estimatedTime || 20) * 1000)
      } else {
        setError(result.error || 'Failed to generate summary')
      }
    } catch (error) {
      setError('Failed to generate summary. Please try again.')
      console.error('Summarization error:', error)
    } finally {
      setSummarizing(false)
    }
  }

  const handleCopyText = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setSuccess('Copied to clipboard!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('Failed to copy text')
    }
  }

  const handleClear = () => {
    setText('')
    setSummaryResult(null)
    setShowSummary(false)
    setError('')
    setSuccess('')
  }

  const handleSendToTTS = () => {
    if (summaryResult) {
      localStorage.setItem('tts-text', summaryResult.summary)
      navigate('/text-to-speech')
    }
  }

  const handleSendToFocus = () => {
    if (summaryResult) {
      localStorage.setItem('focus-text', summaryResult.summary)
      navigate('/focus-mode')
    }
  }

  const sampleTexts = [
    {
      title: "Artificial Intelligence",
      content: "Artificial intelligence has revolutionized many aspects of modern life. From healthcare to transportation, AI systems are helping solve complex problems. Machine learning algorithms can now diagnose diseases, predict traffic patterns, and even create art. However, these advances also raise important ethical questions. How do we ensure AI systems are fair and unbiased? What happens when AI makes mistakes? As AI becomes more powerful, society must carefully consider both its benefits and risks. The future of AI will depend on how well we address these challenges while harnessing its potential for good. Education about AI is crucial for the next generation.",
      emoji: "🤖",
    },
    {
      title: "Climate Change Impact",
      content: "Climate change represents one of the most significant challenges facing humanity today. Rising global temperatures, melting ice caps, and extreme weather events are becoming increasingly common. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary drivers of these changes. The consequences affect every aspect of life, from agriculture and water resources to human health and biodiversity. While the challenges are daunting, solutions exist. Renewable energy, sustainable practices, and conservation efforts can help mitigate the impacts. Individual actions matter, but large-scale policy changes and international cooperation are essential for meaningful progress.",
      emoji: "🌍",
    },
    {
      title: "Space Exploration",
      content: "Space exploration continues to capture human imagination and drive scientific advancement. Recent missions to Mars, the deployment of the James Webb Space Telescope, and the growth of private space companies mark a new era of discovery. These endeavors not only expand our understanding of the universe but also drive technological innovation. Challenges include the enormous costs, the dangers of space travel, and questions about how to responsibly explore other worlds. Despite these obstacles, the potential benefits are immense, from finding new resources to ensuring the long-term survival of humanity.",
      emoji: "🚀",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      
      {/* Hero Header */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
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
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    AI SUMMARIZER
                  </h1>
                </div>
                <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                  Extract key points from long texts instantly! ⚡✨
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">{text.split(/\s+/).filter(w => w.trim()).length}</div>
                  <div className="text-sm text-white/80 fun-font">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">
                    {summaryResult ? Math.round((1 - (summaryResult.summary.split(' ').length / text.split(' ').length)) * 100) : 0}%
                  </div>
                  <div className="text-sm text-white/80 fun-font">Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">
                    {Math.ceil(text.split(/\s+/).length / 200)}
                  </div>
                  <div className="text-sm text-white/80 fun-font">Min Read</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
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
                  <p className="font-bold text-red-700 dark:text-red-300 fun-font text-base" style={{ lineHeight: '1.8' }}>{error}</p>
                </div>
                <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          >
            <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="font-bold text-green-700 dark:text-green-300 fun-font text-base" style={{ lineHeight: '1.8' }}>{success}</p>
                </div>
                <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Settings */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Summarize Button */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 sticky top-8 mb-6">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
                Generate
              </h3>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSummarize}
                disabled={!text.trim() || summarizing}
                className="w-full flex items-center justify-center space-x-3 px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black fun-font text-lg shadow-2xl hover:shadow-3xl disabled:opacity-30 transition-all mb-4"
              >
                {summarizing ? (
                  <>
                    <Loader className="h-6 w-6 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6" />
                    <span>Summarize Now</span>
                  </>
                )}
              </motion.button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400 fun-font font-bold" style={{ lineHeight: '1.8' }}>
                AI-powered by Hugging Face
              </p>
            </div>

            {/* Summary Length */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 mb-6">
              <h3 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-blue-600" />
                Summary Length
              </h3>

              <div className="space-y-3">
                {[
                  { value: 'short', label: 'Short', desc: '~20-80 words', emoji: '📝' },
                  { value: 'medium', label: 'Medium', desc: '~30-130 words', emoji: '📄' },
                  { value: 'long', label: 'Long', desc: '~50-200 words', emoji: '📚' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSummaryLength(option.value)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      summaryLength === option.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-2 border-purple-400'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <div>
                        <div className="font-black fun-font text-base">{option.label}</div>
                        <div className={`text-sm fun-font ${summaryLength === option.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {option.desc}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-xl border-2 border-yellow-200 dark:border-yellow-800">
              <h4 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                <Target className="h-6 w-6 mr-2 text-yellow-600" />
                Pro Tips
              </h4>
              <ul className="space-y-3 text-base text-gray-700 dark:text-gray-300 fun-font font-bold">
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <span style={{ lineHeight: '1.8' }}>Minimum 50 words for best results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">⚡</span>
                  <span style={{ lineHeight: '1.8' }}>Enable Bionic Reading for faster comprehension</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">🎤</span>
                  <span style={{ lineHeight: '1.8' }}>Use voice input to dictate text</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">🎯</span>
                  <span style={{ lineHeight: '1.8' }}>Counts toward daily goals!</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CENTER - Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Input Text Area */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                  Original Text
                </h2>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                    title="Upload"
                  >
                    <Upload className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCopyText(text)}
                    disabled={!text}
                    className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-30 transition-all"
                    title="Copy"
                  >
                    <Copy className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClear}
                    disabled={!text}
                    className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-30 transition-all"
                    title="Clear"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type, paste, or speak your text here... (minimum 50 words) 🎤"
                  className="w-full h-[400px] p-6 pr-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl text-gray-800 dark:text-white fun-font text-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                  style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
                  maxLength={10000}
                />
                <div className="absolute bottom-6 right-6">
                  <VoiceButton
                    mode="typing"
                    onTranscript={(transcript) => setText(prev => prev + (prev ? ' ' : '') + transcript)}
                    size="lg"
                  />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center justify-between mt-4 text-base">
                <span className="font-bold text-gray-600 dark:text-gray-400 fun-font flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  {text.split(/\s+/).filter(w => w.trim()).length} words • {text.length}/10,000 chars
                </span>
                <span className="font-bold text-gray-600 dark:text-gray-400 fun-font flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  ~{Math.ceil(text.split(/\s+/).length / 200)} min read
                </span>
              </div>
            </div>

            {/* Summary Textarea - SEPARATE */}
            <AnimatePresence>
              {showSummary && summaryResult && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font flex items-center">
                      <Sparkles className="h-6 w-6 mr-3 text-green-600" />
                      Summary
                    </h2>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopyText(summaryResult.summary)}
                        className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                        title="Copy Summary"
                      >
                        <Copy className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <BionicToggle enabled={bionicEnabled} onToggle={toggleBionic} intensity={intensity} onIntensityChange={setIntensity} />
                  </div>

                  {/* Summary Textarea */}
                  <textarea
                    value={summaryResult.summary}
                    readOnly
                    className="w-full h-[300px] p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl text-gray-800 dark:text-white fun-font text-xl resize-none focus:outline-none"
                    style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
                  />

                  <div className="mt-4 text-base font-bold text-gray-600 dark:text-gray-400 fun-font">
                    {summaryResult.summary.split(' ').length} words
                    {bionicEnabled && ' • ⚡ Bionic mode active'}
                  </div>

                  <SummaryDisplay summary={summaryResult} onCopy={() => handleCopyText(summaryResult.summary)} />

                  {/* Quick Actions */}
                  <div className="mt-8 space-y-4">
                    <h4 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                      <ArrowRight className="h-5 w-5 mr-2 text-purple-600" />
                      Quick Actions
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendToTTS}
                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold fun-font shadow-lg hover:shadow-2xl transition-all"
                      >
                        <Volume2 className="h-5 w-5" />
                        <span>Listen</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendToFocus}
                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold fun-font shadow-lg hover:shadow-2xl transition-all"
                      >
                        <Focus className="h-5 w-5" />
                        <span>Focus</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (summaryResult) {
                            localStorage.setItem('quiz-text', summaryResult.summary)
                            navigate('/quiz')
                          }
                        }}
                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold fun-font shadow-lg hover:shadow-2xl transition-all"
                      >
                        <Brain className="h-5 w-5" />
                        <span>Quiz</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          collectionsService.addItem(summaryResult.summary, 'articles', {
                            title: summaryResult.summary.substring(0, 50) + '...',
                            source: 'summarize',
                            originalText: text.substring(0, 200)
                          })
                          setSuccess('Saved to Articles collection!')
                          setTimeout(() => setSuccess(''), 2000)
                        }}
                        className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold fun-font shadow-lg hover:shadow-2xl transition-all"
                      >
                        <Bookmark className="h-5 w-5" />
                        <span>Save</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sample Texts */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-purple-600" />
                Try Sample Texts
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {sampleTexts.map((sample, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setText(sample.content)}
                    disabled={summarizing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="text-left p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl hover:shadow-2xl transition-all border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-4xl">{sample.emoji}</span>
                      <div className="font-black text-gray-800 dark:text-white game-font text-xl">{sample.title}</div>
                    </div>
                    <div className="text-base text-gray-600 dark:text-gray-400 fun-font font-bold line-clamp-2 leading-relaxed">
                      {sample.content.substring(0, 150)}...
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR - Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* How It Works */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-800 sticky top-8">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-600" />
                How It Works
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">AI Extraction</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Extracts key points automatically
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl flex-shrink-0">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">Context Maintained</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Preserves important meaning
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                    <TrendingDown className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">70-80% Reduction</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Dramatically reduces reading time
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">Bionic Reading</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Enhanced focus for faster reading
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex-shrink-0">
                    <Mic className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">Voice Input</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Speak instead of typing
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Stats Card */}
            {summaryResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-xl border-2 border-green-200 dark:border-green-800"
              >
                <h4 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-green-600" />
                  Summary Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">Original:</span>
                    <span className="text-xl font-black text-gray-800 dark:text-white game-font">{text.split(' ').length} words</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">Summary:</span>
                    <span className="text-xl font-black text-green-600 game-font">{summaryResult.summary.split(' ').length} words</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">Reduction:</span>
                    <span className="text-xl font-black text-purple-600 game-font">
                      {Math.round((1 - (summaryResult.summary.split(' ').length / text.split(' ').length)) * 100)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Summarize
