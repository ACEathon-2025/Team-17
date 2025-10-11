import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Upload, FileText, Zap, TrendingUp, Award, Clock, Target, 
  BookOpen, ArrowRight, CheckCircle, AlertCircle, X, ArrowLeft, 
  Sparkles, Trophy, Users, BarChart
} from 'lucide-react'
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

    const wordsRead = text.split(/\s+/).filter(w => w.trim()).length
    goalsService.updateDailyProgress(wordsRead, result.duration)

    if (result.percentage >= 70) {
      goalsService.updateChallengeProgress('quizzes', 1)
    }

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
      content: 'Climate change represents one of the most significant challenges facing humanity today. Rising global temperatures, melting ice caps, and extreme weather events are becoming increasingly common. Scientists agree that human activities, particularly the burning of fossil fuels, are the primary drivers of these changes. The consequences affect every aspect of life, from agriculture and water resources to human health and biodiversity. While the challenges are daunting, solutions exist. Renewable energy, sustainable practices, and conservation efforts can help mitigate the impacts. Individual actions matter, but large-scale policy changes and international cooperation are essential for meaningful progress.',
      emoji: '🌍'
    },
    {
      title: 'Artificial Intelligence',
      content: 'Artificial intelligence has revolutionized many aspects of modern life. From healthcare to transportation, AI systems are helping solve complex problems. Machine learning algorithms can now diagnose diseases, predict traffic patterns, and even create art. However, these advances also raise important ethical questions. How do we ensure AI systems are fair and unbiased? What happens when AI makes mistakes? As AI becomes more powerful, society must carefully consider both its benefits and risks. The future of AI will depend on how well we address these challenges while harnessing its potential for good.',
      emoji: '🤖'
    },
    {
      title: 'Ocean Conservation',
      content: 'Our oceans cover more than 70% of the Earth\'s surface and contain 97% of all water on the planet. They produce over half of the world\'s oxygen and absorb 50 times more carbon dioxide than our atmosphere. Oceans provide food, regulate climate, and support millions of species. However, human activities threaten marine ecosystems through pollution, overfishing, and climate change. Plastic waste accumulates in massive ocean gyres, coral reefs bleach from warming waters, and fish populations decline dramatically. Protecting our oceans requires immediate action through sustainable fishing, reducing plastic use, and creating marine protected areas.',
      emoji: '🌊'
    }
  ]

  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      
      {/* Hero Header */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
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
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    COMPREHENSION QUIZ
                  </h1>
                </div>
                <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                  Test your understanding with AI-generated questions! 🧠✨
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">{quizHistory.length}</div>
                  <div className="text-sm text-white/80 fun-font">Quizzes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">{averageScore}%</div>
                  <div className="text-sm text-white/80 fun-font">Average</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white game-font">
                    {quizHistory.filter(q => q.score >= 70).length}
                  </div>
                  <div className="text-sm text-white/80 fun-font">Passed</div>
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
          
          {/* LEFT SIDEBAR - Stats */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Generate Button */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 sticky top-8 mb-6">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
                Generate Quiz
              </h3>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateQuiz}
                disabled={!text.trim()}
                className="w-full flex items-center justify-center space-x-3 px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black fun-font text-lg shadow-2xl hover:shadow-3xl disabled:opacity-30 transition-all mb-4"
              >
                <Zap className="h-6 w-6" />
                <span>Generate Quiz</span>
              </motion.button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400 fun-font font-bold" style={{ lineHeight: '1.8' }}>
                AI-generated comprehension questions
              </p>
            </div>

            {/* Progress Stats */}
            {quizHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 mb-6">
                <h3 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Your Progress
                </h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">Average Score</span>
                    <span className="text-3xl font-black text-gray-800 dark:text-white game-font">{averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                      style={{ width: `${averageScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400 game-font">
                      {quizHistory.length}
                    </div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-400 fun-font mt-1">
                      Total
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <div className="text-3xl font-black text-green-600 dark:text-green-400 game-font">
                      {quizHistory.filter(q => q.score >= 70).length}
                    </div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-400 fun-font mt-1">
                      Passed
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-xl border-2 border-yellow-200 dark:border-yellow-800">
              <h4 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                <Target className="h-6 w-6 mr-2 text-yellow-600" />
                Pro Tips
              </h4>
              <ul className="space-y-3 text-base text-gray-700 dark:text-gray-300 fun-font font-bold">
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">📖</span>
                  <span style={{ lineHeight: '1.8' }}>Read carefully before starting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">🎯</span>
                  <span style={{ lineHeight: '1.8' }}>Pass with 70% or higher</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">⏱️</span>
                  <span style={{ lineHeight: '1.8' }}>Take your time - no rush!</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-2xl flex-shrink-0">🏆</span>
                  <span style={{ lineHeight: '1.8' }}>Counts toward goals & challenges</span>
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
            {/* Text Input */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                  Reading Material
                </h2>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                    title="Upload file"
                  >
                    <Upload className="h-5 w-5" />
                  </motion.div>
                </label>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your reading material here... (minimum 50 words)"
                className="w-full h-[400px] p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl text-gray-800 dark:text-white fun-font text-xl resize-none focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                style={{ lineHeight: '1.8', letterSpacing: '0.05em' }}
              />

              <div className="flex items-center justify-between mt-4 text-base">
                <span className="font-bold text-gray-600 dark:text-gray-400 fun-font">
                  {text.split(/\s+/).filter(w => w.trim()).length} words
                </span>
              </div>
            </div>

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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="text-left p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl hover:shadow-2xl transition-all border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
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

            {/* Quiz History */}
            {quizHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                  <Clock className="h-6 w-6 mr-3 text-blue-600" />
                  Recent Results
                </h3>
                <div className="space-y-4">
                  {quizHistory.slice(0, 5).map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 dark:text-white fun-font text-base mb-2" style={{ lineHeight: '1.8' }}>
                          {quiz.text}
                        </p>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400 fun-font">
                          {new Date(quiz.date).toLocaleDateString()} • {Math.round(quiz.duration / 1000)}s
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-4xl font-black game-font ${
                          quiz.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {quiz.score}%
                        </div>
                        <div className="text-sm font-bold text-gray-600 dark:text-gray-400 fun-font">
                          Grade {quiz.grade}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">5 AI Questions</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Generated from your text
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl flex-shrink-0">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">Multiple Topics</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Main ideas, details, inferences
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">Instant Feedback</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      With detailed explanations
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex-shrink-0">
                    <Trophy className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 dark:text-white fun-font text-base">Goals Progress</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                      Counts toward challenges!
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30">
              <h3 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/text-to-speech')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-blue-200 dark:border-blue-800"
                >
                  <span className="font-bold text-gray-800 dark:text-white fun-font">Listen & Quiz</span>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/summarize')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200 dark:border-purple-800"
                >
                  <span className="font-bold text-gray-800 dark:text-white fun-font">Summarize & Quiz</span>
                  <ArrowRight className="h-5 w-5 text-purple-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/goals')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <span className="font-bold fun-font">View Goals Progress</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
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
