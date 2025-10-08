import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Upload, Copy, RotateCcw, CheckCircle, AlertCircle, Loader, 
  Zap, TrendingDown, Clock, ArrowRight, Volume2, Focus, Share2, Download, Brain, Bookmark
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
  const textareaRef = useRef(null)

  // Receive text from other pages
  useEffect(() => {
    const incomingText = localStorage.getItem('summarize-text')
    if (incomingText) {
      setText(incomingText)
      localStorage.removeItem('summarize-text')
      setSuccess('Text loaded! Ready to summarize.')
      setTimeout(() => setSuccess(''), 3000)
    }
  }, [])

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
        
        // ✅ UPDATE GOALS AND CHALLENGES
        const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
        const duration = Date.now() - startTime
        goalsService.updateDailyProgress(wordsRead, duration)
        goalsService.updateChallengeProgress('summaries', 1)

        // Save reading progress (optional - fail silently)
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
      title: "Technology & AI",
      content: "Artificial intelligence has revolutionized many aspects of modern life. From healthcare to transportation, AI systems are helping solve complex problems. Machine learning algorithms can now diagnose diseases, predict traffic patterns, and even create art. However, these advances also raise important ethical questions. How do we ensure AI systems are fair and unbiased? What happens when AI makes mistakes? As AI becomes more powerful, society must carefully consider both its benefits and risks. The future of AI will depend on how well we address these challenges while harnessing its potential for good. Education about AI is crucial for the next generation."
    },
    {
      title: "Climate Change",
      content: "Climate change represents one of the most significant challenges facing humanity today. Rising global temperatures, melting ice caps, and extreme weather events are becoming increasingly common. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary drivers of these changes. The consequences affect every aspect of life, from agriculture and water resources to human health and biodiversity. While the challenges are daunting, solutions exist. Renewable energy, sustainable practices, and conservation efforts can help mitigate the impacts. Individual actions matter, but large-scale policy changes and international cooperation are essential for meaningful progress."
    },
    {
      title: "Space Exploration",
      content: "Space exploration continues to capture human imagination and drive scientific advancement. Recent missions to Mars, the deployment of the James Webb Space Telescope, and the growth of private space companies mark a new era of discovery. These endeavors not only expand our understanding of the universe but also drive technological innovation. Challenges include the enormous costs, the dangers of space travel, and questions about how to responsibly explore other worlds. Despite these obstacles, the potential benefits are immense, from finding new resources to ensuring the long-term survival of humanity."
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
            <Zap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            AI-Powered Summarization
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Extract key points from long texts instantly using advanced AI
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm dyslexia-text">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm dyslexia-text">{success}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                  Enter Text to Summarize
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                    title="Upload file"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopyText(text)}
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

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your long text here... (minimum 50 words)"
                className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{
                  lineHeight: '1.8',
                  letterSpacing: '0.05em'
                }}
                maxLength={10000}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {text.split(/\s+/).filter(w => w.trim()).length} words • {text.length}/10000 characters
                </span>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Est. reading time: {Math.ceil(text.split(/\s+/).length / 200)} min
                </div>
              </div>
            </motion.div>

            {/* Summary Display with Bionic Reading */}
            <AnimatePresence>
              {showSummary && summaryResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
                >
                  {/* Bionic Toggle */}
                  <div className="mb-4">
                    <BionicToggle
                      enabled={bionicEnabled}
                      onToggle={toggleBionic}
                      intensity={intensity}
                      onIntensityChange={setIntensity}
                    />
                  </div>

                  {/* Summary Text with Bionic Support */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3">
                      Summary
                    </h3>
                    <div 
                      className="p-4 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] dyslexia-text"
                      style={{ 
                        lineHeight: '1.8', 
                        letterSpacing: '0.05em',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                      }}
                    >
                      {bionicEnabled ? (
                        <div style={{ fontWeight: 'normal' }}>
                          <BionicText text={summaryResult.summary} intensity={intensity} />
                        </div>
                      ) : (
                        summaryResult.summary
                      )}
                    </div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)] dyslexia-text">
                      {summaryResult.summary.split(' ').length} words
                      {bionicEnabled && ' • ⚡ Bionic mode active'}
                    </div>
                  </div>

                  <SummaryDisplay summary={summaryResult} onCopy={() => handleCopyText(summaryResult.summary)} />

                  {/* Quick Actions */}
                  <div className="mt-6 space-y-3">
                    <div className="text-sm font-medium text-[var(--text-secondary)] dyslexia-text mb-2">
                      📤 Send Summary To:
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleSendToTTS}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-md"
                      >
                        <Volume2 className="h-5 w-5" />
                        <span className="font-medium dyslexia-text text-sm">Listen</span>
                      </button>

                      <button
                        onClick={handleSendToFocus}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-md"
                      >
                        <Focus className="h-5 w-5" />
                        <span className="font-medium dyslexia-text text-sm">Focus</span>
                      </button>

                      <button
                        onClick={() => {
                          if (summaryResult) {
                            localStorage.setItem('quiz-text', summaryResult.summary)
                            navigate('/quiz')
                          }
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors"
                      >
                        <Brain className="h-4 w-4" />
                        <span className="font-medium dyslexia-text text-sm">Test Knowledge</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyText(summaryResult.summary)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors border border-[var(--border-color)]"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="font-medium dyslexia-text text-sm">Copy Summary</span>
                    </button>

                    <button
                      onClick={() => {
                        collectionsService.addItem(summaryResult.summary, 'articles', {
                          title: summaryResult.summary.substring(0, 50) + '...',
                          source: 'summarize',
                          originalText: text.substring(0, 200)
                        })
                        setSuccess('Saved to Articles collection!')
                        setTimeout(() => setSuccess(''), 2000)
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span className="font-medium dyslexia-text text-sm">Save Summary</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sample Texts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Try Sample Texts
              </h3>
              <div className="space-y-3">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setText(sample.content)}
                    disabled={summarizing}
                    className="w-full text-left p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
                  >
                    <div className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                      {sample.title}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] dyslexia-text line-clamp-2">
                      {sample.content.substring(0, 150)}...
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Summarize Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Generate Summary
              </h3>

              <button
                onClick={handleSummarize}
                disabled={!text.trim() || summarizing}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
              >
                {summarizing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span className="font-semibold dyslexia-text">Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold dyslexia-text">Summarize</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[var(--text-secondary)] mt-3 dyslexia-text">
                AI-powered by Hugging Face
              </p>
            </motion.div>

            {/* Summary Length */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Summary Length
              </h3>

              <div className="space-y-3">
                {['short', 'medium', 'long'].map((length) => (
                  <button
                    key={length}
                    onClick={() => setSummaryLength(length)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      summaryLength === length
                        ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 text-purple-700 dark:text-purple-300'
                        : 'bg-[var(--bg-secondary)] border-2 border-transparent text-[var(--text-primary)] hover:border-purple-300'
                    }`}
                  >
                    <div className="font-medium capitalize dyslexia-text">{length}</div>
                    <div className="text-xs opacity-70">
                      {length === 'short' && '~20-80 words'}
                      {length === 'medium' && '~30-130 words'}
                      {length === 'long' && '~50-200 words'}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)] dyslexia-text">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI extracts key points from your text</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Maintains important context and meaning</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reduces reading time by 70-80%</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>⚡ Bionic mode for faster reading</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>🎯 Counts toward daily goals & challenges!</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Sends to TTS or Focus Mode instantly</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summarize
