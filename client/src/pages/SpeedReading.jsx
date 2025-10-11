import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Play, Pause, CheckCircle, XCircle, Trophy, TrendingUp, Target, 
  Award, Clock, BarChart3, ArrowLeft, Sparkles, Users, Brain, Rocket
} from 'lucide-react'
import { speedReadingService } from '../services/speedReadingService'
import { useUser } from '../context/UserContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const SpeedReading = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { saveReadingProgress } = useUser()
  const [mode, setMode] = useState('home')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [history, setHistory] = useState([])
  
  const intervalRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('speed-reading-history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading history:', e)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTest = (level) => {
    const text = speedReadingService.getPracticeText(level)
    const textWords = text.split(' ')
    setWords(textWords)
    setCurrentWordIndex(0)
    setSelectedLevel(level)
    setMode('train')
    setStartTime(null)
    setIsReading(false)
    setIsPaused(false)
    setTestResults(null)
    setShowQuiz(false)
  }

  const handleStart = () => {
    if (!startTime) {
      setStartTime(Date.now())
    }
    setIsReading(true)
    setIsPaused(false)

    const wpm = speedReadingService.levels.find(l => l.id === selectedLevel)?.wpm || 200
    const msPerWord = 60000 / wpm

    intervalRef.current = setInterval(() => {
      setCurrentWordIndex(prev => {
        if (prev >= words.length - 1) {
          handleFinish()
          return prev
        }
        return prev + 1
      })
    }, msPerWord)
  }

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPaused(true)
    setIsReading(false)
  }

  const handleFinish = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    const duration = Date.now() - startTime
    const wpm = speedReadingService.calculateWPM(words.length, duration)
    
    setTestResults({
      wpm,
      duration,
      wordCount: words.length,
      level: selectedLevel
    })
    
    setIsReading(false)
    setShowQuiz(true)
  }

  const handleQuizComplete = async (answers, correct, total) => {
    const comprehension = Math.round((correct / total) * 100)

    const result = {
      ...testResults,
      comprehension,
      correct,
      total,
      date: new Date().toISOString()
    }

    const newHistory = [result, ...history.slice(0, 19)]
    setHistory(newHistory)
    localStorage.setItem('speed-reading-history', JSON.stringify(newHistory))

    try {
      await saveReadingProgress(`speed-reading-${Date.now()}`, {
        text: words.join(' ').substring(0, 100),
        completed: true,
        duration: result.duration,
        sessionType: 'speed-reading',
        progress: 100
      })
    } catch (error) {
      console.warn('Could not save progress:', error)
    }

    setTestResults(result)
    setMode('results')
    setShowQuiz(false)
  }

  const getProgressData = () => {
    return history.slice(0, 10).reverse().map((h, i) => ({
      session: i + 1,
      wpm: h.wpm,
      comprehension: h.comprehension
    }))
  }

  const averageWPM = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length)
    : 0

  const bestWPM = history.length > 0
    ? Math.max(...history.map(h => h.wpm))
    : 0

  // HOME SCREEN - REDESIGNED
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        
        {/* Hero Header */}
        <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
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
                      SPEED READING
                    </h1>
                  </div>
                  <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                    Train your brain to read faster! ⚡✨
                  </p>
                </div>
                
                {history.length > 0 && (
                  <div className="hidden lg:flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-white game-font">{bestWPM}</div>
                      <div className="text-sm text-white/80 fun-font">Best WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-white game-font">{averageWPM}</div>
                      <div className="text-sm text-white/80 fun-font">Avg WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-white game-font">{history.length}</div>
                      <div className="text-sm text-white/80 fun-font">Sessions</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          
          {/* Stats Cards - Mobile Visible */}
          {history.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8 lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-yellow-200 dark:border-yellow-800 text-center"
              >
                <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400 game-font">{bestWPM}</div>
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400 fun-font">Best</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-green-200 dark:border-green-800 text-center"
              >
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-green-600 dark:text-green-400 game-font">{averageWPM}</div>
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400 fun-font">Average</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-blue-200 dark:border-blue-800 text-center"
              >
                <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 game-font">{history.length}</div>
                <div className="text-xs font-bold text-gray-600 dark:text-gray-400 fun-font">Sessions</div>
              </motion.div>
            </div>
          )}

          {/* Choose Level Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800 mb-8"
          >
            <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
              <Rocket className="h-7 w-7 mr-3 text-orange-600" />
              Choose Your Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speedReadingService.levels.map((level, index) => (
                <motion.button
                  key={level.id}
                  onClick={() => startTest(level.id)}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="text-left p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl hover:shadow-2xl transition-all border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 group"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{level.icon}</div>
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-3">
                    {level.name}
                  </h3>
                  <div className="text-4xl font-black text-orange-600 dark:text-orange-400 game-font mb-3">
                    {level.wpm} WPM
                  </div>
                  <p className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                    {level.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Progress Chart */}
          {history.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800"
            >
              <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <BarChart3 className="h-7 w-7 mr-3 text-blue-600" />
                Your Progress
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="session" 
                    stroke={isDark ? '#9ca3af' : '#6b7280'}
                    label={{ value: 'Session', position: 'insideBottom', offset: -5, style: { fontWeight: 'bold', fontSize: 14 } }}
                  />
                  <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#f97316" strokeWidth={3} name="WPM" />
                  <Line type="monotone" dataKey="comprehension" stroke="#8b5cf6" strokeWidth={3} name="Comprehension %" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // TRAINING SCREEN - REDESIGNED
  if (mode === 'train') {
    const level = speedReadingService.levels.find(l => l.id === selectedLevel)
    const progress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black game-font mb-2" style={{ lineHeight: '1.8' }}>
                {level.name} Level • {level.wpm} WPM
              </h2>
              <p className="text-xl text-white/80 fun-font font-bold" style={{ lineHeight: '1.8' }}>
                Word {currentWordIndex + 1} of {words.length}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (intervalRef.current) clearInterval(intervalRef.current)
                setMode('home')
              }}
              className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-2xl hover:bg-white/20 transition-all font-bold fun-font border-2 border-white/20"
            >
              Exit
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-4 mb-8 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 h-4 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Word Display */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-20 mb-8 min-h-[400px] flex items-center justify-center border-2 border-white/20 shadow-2xl">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-7xl md:text-8xl font-black text-center game-font text-white"
              style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)', lineHeight: '1.2' }}
            >
              {words[currentWordIndex]}
            </motion.div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-6">
            {!isReading && !isPaused && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                <Play className="h-7 w-7" />
                <span>Start Reading</span>
              </motion.button>
            )}

            {isReading && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                <Pause className="h-7 w-7" />
                <span>Pause</span>
              </motion.button>
            )}

            {isPaused && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  <Play className="h-7 w-7" />
                  <span>Resume</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinish}
                  className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  <CheckCircle className="h-7 w-7" />
                  <span>Finish</span>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {showQuiz && (
          <SpeedReadingQuiz
            questions={speedReadingService.getComprehensionQuestions(selectedLevel)}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    )
  }

    // RESULTS SCREEN - REDESIGNED
  if (mode === 'results' && testResults) {
    const level = speedReadingService.getLevelForWPM(testResults.wpm)
    const nextLevel = speedReadingService.getNextLevel(testResults.wpm)
    const recommendation = speedReadingService.getRecommendation(testResults.wpm, testResults.comprehension)

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        
        {/* Hero Header */}
        <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                      SESSION COMPLETE!
                    </h1>
                  </div>
                  <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                    Great job! Here are your results 🎉
                  </p>
                </div>
                
                <div className="hidden lg:block text-9xl">
                  {level.icon}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-orange-200 dark:border-orange-800 text-center"
            >
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-5xl font-black text-orange-600 dark:text-orange-400 game-font mb-2">
                {testResults.wpm}
              </div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">
                Words/Min
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800 text-center"
            >
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-5xl font-black text-purple-600 dark:text-purple-400 game-font mb-2">
                {testResults.comprehension}%
              </div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">
                Comprehension
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-blue-200 dark:border-blue-800 text-center"
            >
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-5xl font-black text-blue-600 dark:text-blue-400 game-font mb-2">
                {Math.round(testResults.duration / 1000)}s
              </div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400 fun-font">
                Time
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-green-200 dark:border-green-800 text-center"
            >
              <div className="text-6xl mb-3">{level.icon}</div>
              <div className="text-base font-bold text-gray-800 dark:text-white fun-font">
                {level.name}
              </div>
            </motion.div>
          </div>

          {/* Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 shadow-2xl border-2 border-yellow-200 dark:border-yellow-800 mb-8"
          >
            <div className="flex items-start space-x-6">
              <div className="text-7xl flex-shrink-0">{recommendation.icon}</div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-4">
                  {recommendation.message}
                </h3>
                <p className="text-xl font-bold text-gray-700 dark:text-gray-300 fun-font leading-relaxed" style={{ lineHeight: '1.8' }}>
                  {recommendation.action}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('home')}
              className="px-8 py-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all"
            >
              Back to Home
            </motion.button>

            {nextLevel && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTest(nextLevel.id)}
                className="px-8 py-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl transition-all border-2 border-orange-500"
              >
                Try {nextLevel.name} ({nextLevel.wpm} WPM)
              </motion.button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ENHANCED QUIZ COMPONENT - REDESIGNED
const SpeedReadingQuiz = ({ questions, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    
    setShowFeedback(true)
    
    setTimeout(() => {
      const newAnswers = [...answers, selected]
      
      if (currentQ < questions.length - 1) {
        setAnswers(newAnswers)
        setCurrentQ(currentQ + 1)
        setSelected(null)
        setShowFeedback(false)
      } else {
        const correct = newAnswers.filter((a, i) => a === questions[i].correct).length
        onComplete(newAnswers, correct, questions.length)
      }
    }, 2000)
  }

  const question = questions[currentQ]
  const isCorrect = selected === question.correct

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font">
              Comprehension Check
            </h3>
            <span className="text-lg font-bold text-gray-600 dark:text-gray-400 fun-font px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
              {currentQ + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <p className="text-2xl font-bold text-gray-800 dark:text-white fun-font mb-8 leading-relaxed" style={{ lineHeight: '1.8' }}>
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrectOption = i === question.correct
            const showCorrect = showFeedback && isCorrectOption
            const showWrong = showFeedback && isSelected && !isCorrectOption

            return (
              <motion.button
                key={i}
                onClick={() => !showFeedback && setSelected(i)}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.02, x: 4 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all fun-font text-lg font-bold flex items-center justify-between ${
                  showCorrect
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 shadow-lg'
                    : showWrong
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300 shadow-lg'
                    : isSelected
                    ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-gray-800 dark:text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:border-orange-500 hover:shadow-lg'
                }`}
                style={{ lineHeight: '1.8' }}
              >
                <span>{opt}</span>
                {showCorrect && <CheckCircle className="h-6 w-6 flex-shrink-0" />}
                {showWrong && <XCircle className="h-6 w-6 flex-shrink-0" />}
              </motion.button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl mb-8 border-2 ${
              isCorrect
                ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                : 'bg-red-100 dark:bg-red-900/30 border-red-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              {isCorrect ? (
                <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="h-7 w-7 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <span className={`font-black fun-font text-xl ${
                isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                {isCorrect ? 'Correct! Well done! 🎉' : 'Not quite! Keep trying! 💪'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {!showFeedback && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full px-8 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

export default SpeedReading

