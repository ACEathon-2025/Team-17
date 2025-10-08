import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Upload, FileText, Zap, TrendingUp, Award, Clock, Target, BookOpen, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/quizService'
import { useUser } from '../context/UserContext'
import ReadingQuiz from '../components/ReadingQuiz'
import { goalsService } from '../services/goalsService'

const Quiz = () => {
  const navigate = useNavigate()
  const { saveReadingProgress, addAchievement } = useUser()
  const [text, setText] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizHistory, setQuizHistory] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load quiz history from localStorage
  useEffect(() => {
    const incomingText = localStorage.getItem('quiz-text')
    if (incomingText) {
      setText(incomingText)
      localStorage.removeItem('quiz-text')
      setSuccess('Text loaded! Ready to generate quiz.')
      setTimeout(() => setSuccess(''), 3000)
    }

    const savedHistory = localStorage.getItem('quiz-history')
    if (savedHistory) {
      try {
        setQuizHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Error loading quiz history:', e)
      }
    }
  }, [])

  const handleGenerateQuiz = () => {
    if (!text.trim()) {
      setError('Please enter some text to generate a quiz')
      return
    }

    const wordCount = text.split(/\s+/).filter(w => w.trim()).length

    if (wordCount < 50) {
      setError('Text is too short. Please provide at least 50 words.')
      return
    }

    const questions = quizService.generateQuiz(text, 5)

    if (questions.length === 0) {
      setError('Could not generate quiz. Please provide more detailed text.')
      return
    }

    setQuiz(questions)
    setShowQuiz(true)
    setError('')
  }

  const handleQuizComplete = async (result) => {
    // Save to history
    const quizResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      text: text.substring(0, 100) + '...',
      score: result.percentage,
      grade: result.grade,
      correct: result.correct,
      total: result.total,
      duration: result.duration
    }

    const newHistory = [quizResult, ...quizHistory.slice(0, 9)]
    setQuizHistory(newHistory)
    localStorage.setItem('quiz-history', JSON.stringify(newHistory))

    // Update goals - count words read in the quiz text
    const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
    goalsService.updateDailyProgress(wordsRead, result.duration)

    // Update challenge progress if passed (70% or higher)
    if (result.percentage >= 70) {
      goalsService.updateChallengeProgress('quizzes', 1)
    }

    // Save to reading progress
    try {
      await saveReadingProgress(`quiz-${Date.now()}`, {
        text: text.substring(0, 100),
        completed: true,
        duration: result.duration,
        sessionType: 'quiz',
        progress: result.percentage
      })
    } catch (error) {
      console.warn('Could not save quiz progress:', error)
    }

    // Award achievements
    if (result.percentage === 100) {
      addAchievement({
        id: 'perfect_quiz',
        title: 'Perfect Score!',
        description: 'Got 100% on a comprehension quiz',
        icon: '💯'
      })
    } else if (result.percentage >= 90) {
      addAchievement({
        id: 'ace_quiz',
        title: 'Quiz Ace',
        description: 'Scored 90% or higher on a quiz',
        icon: '🎯'
      })
    }

    setSuccess(`Great job! You scored ${result.percentage}%`)
    setTimeout(() => {
      setShowQuiz(false)
      setSuccess('')
    }, 3000)
  }

  const handleCloseQuiz = () => {
    setShowQuiz(false)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        if (content.length > 10000) {
          setError('File is too large. Please use files under 10,000 characters.')
          return
        }
        setText(content)
        setSuccess('File uploaded successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
      reader.readAsText(file)
    } else {
      setError('Please upload a text file (.txt)')
    }
  }

  const sampleTexts = [
    {
      title: 'Climate Change',
      content: 'Climate change represents one of the most significant challenges facing humanity today. Rising global temperatures, melting ice caps, and extreme weather events are becoming increasingly common. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary drivers of these changes. The consequences affect every aspect of life, from agriculture and water resources to human health and biodiversity. While the challenges are daunting, solutions exist. Renewable energy, sustainable practices, and conservation efforts can help mitigate the impacts. Individual actions matter, but large-scale policy changes and international cooperation are essential for meaningful progress.'
    },
    {
      title: 'Artificial Intelligence',
      content: 'Artificial intelligence has revolutionized many aspects of modern life. From healthcare to transportation, AI systems are helping solve complex problems. Machine learning algorithms can now diagnose diseases, predict traffic patterns, and even create art. However, these advances also raise important ethical questions. How do we ensure AI systems are fair and unbiased? What happens when AI makes mistakes? As AI becomes more powerful, society must carefully consider both its benefits and risks. The future of AI will depend on how well we address these challenges while harnessing its potential for good.'
    },
    {
      title: 'Ocean Conservation',
      content: 'Our oceans cover more than 70% of the Earth\'s surface and contain 97% of all water on the planet. They produce over half of the world\'s oxygen and absorb 50 times more carbon dioxide than our atmosphere. Oceans provide food, regulate climate, and support millions of species. However, human activities threaten marine ecosystems through pollution, overfishing, and climate change. Plastic waste accumulates in massive ocean gyres, coral reefs bleach from warming waters, and fish populations decline dramatically. Protecting our oceans requires immediate action through sustainable fishing, reducing plastic use, and creating marine protected areas.'
    }
  ]

  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length)
    : 0

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4"
          >
            <Brain className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Reading Comprehension Quiz
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Test your understanding with AI-generated questions
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
          >
            <span className="text-red-600 dark:text-red-400 text-sm dyslexia-text">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
          >
            <span className="text-green-600 dark:text-green-400 text-sm dyslexia-text">{success}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text">
                  Enter Reading Material
                </h2>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)] transition-colors">
                    <Upload className="h-4 w-4" />
                  </div>
                </label>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your reading material here... (minimum 50 words)"
                className="w-full h-64 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] dyslexia-text resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  {text.split(/\s+/).filter(w => w.trim()).length} words
                </span>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={!text.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium dyslexia-text flex items-center space-x-2"
                >
                  <Zap className="h-5 w-5" />
                  <span>Generate Quiz</span>
                </button>
              </div>
            </motion.div>

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
                    className="w-full text-left p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
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

            {/* Quiz History */}
            {quizHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Quiz Results
                </h3>
                <div className="space-y-3">
                  {quizHistory.slice(0, 5).map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[var(--text-primary)] dyslexia-text mb-1">
                          {quiz.text}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                          {new Date(quiz.date).toLocaleDateString()} • {Math.round(quiz.duration / 1000)}s
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold dyslexia-text ${
                          quiz.score >= 70 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {quiz.score}%
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                          Grade {quiz.grade}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            {quizHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--text-secondary)] dyslexia-text">Average Score</span>
                      <span className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">{averageScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${averageScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                        {quizHistory.length}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] dyslexia-text">
                        Quizzes Taken
                      </div>
                    </div>
                    <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                      <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                        {quizHistory.filter(q => q.score >= 70).length}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] dyslexia-text">
                        Passed
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)] dyslexia-text">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI generates 5 comprehension questions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tests main ideas, details, and inferences</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Instant feedback with explanations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pass with 70% or higher</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>🎯 Counts toward daily goals & challenges!</span>
                </li>
              </ul>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] shadow-lg"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/text-to-speech')}
                  className="w-full flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <span className="font-medium text-[var(--text-primary)] dyslexia-text">Listen & Quiz</span>
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => navigate('/summarize')}
                  className="w-full flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <span className="font-medium text-[var(--text-primary)] dyslexia-text">Summarize & Quiz</span>
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => navigate('/goals')}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
                >
                  <span className="font-medium dyslexia-text">View Goals Progress</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && quiz && (
          <ReadingQuiz
            questions={quiz}
            onComplete={handleQuizComplete}
            onClose={handleCloseQuiz}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Quiz
