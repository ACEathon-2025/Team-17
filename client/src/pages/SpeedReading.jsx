import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Play, Pause, CheckCircle, XCircle, Trophy, TrendingUp, Target, Award, Clock, BarChart3 } from 'lucide-react'
import { speedReadingService } from '../services/speedReadingService'
import { useUser } from '../context/UserContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const SpeedReading = () => {
  const { isDark } = useTheme()
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

  // HOME SCREEN
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl mb-4"
            >
              <Zap className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
              Speed Reading Trainer
            </h1>
            <p className="text-[var(--text-secondary)] dyslexia-text">
              Improve your reading speed while maintaining comprehension
            </p>
          </div>

          {history.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <Trophy className="h-6 w-6 text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {bestWPM}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Best WPM</div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {averageWPM}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Average WPM</div>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {history.length}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Sessions</div>
              </div>
            </div>
          )}

          <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)] mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-6">
              Choose Your Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {speedReadingService.levels.map((level) => (
                <motion.button
                  key={level.id}
                  onClick={() => startTest(level.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-6 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all border-2 border-transparent hover:border-orange-500"
                >
                  <div className="text-4xl mb-3">{level.icon}</div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                    {level.name}
                  </h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {level.wpm} WPM
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                    {level.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {history.length > 2 && (
            <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-6">
                Your Progress
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="session" 
                    stroke={isDark ? '#9ca3af' : '#6b7280'}
                    label={{ value: 'Session', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#f97316" strokeWidth={2} name="WPM" />
                  <Line type="monotone" dataKey="comprehension" stroke="#8b5cf6" strokeWidth={2} name="Comprehension %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    )
  }

  // TRAINING SCREEN
  if (mode === 'train') {
    const level = speedReadingService.levels.find(l => l.id === selectedLevel)
    const progress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0

    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold dyslexia-text mb-1">
                {level.name} Level • {level.wpm} WPM
              </h2>
              <p className="text-gray-400 dyslexia-text">
                Word {currentWordIndex + 1} of {words.length}
              </p>
            </div>
            <button
              onClick={() => {
                if (intervalRef.current) clearInterval(intervalRef.current)
                setMode('home')
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Exit
            </button>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="bg-gray-800 rounded-2xl p-16 mb-8 min-h-[300px] flex items-center justify-center">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl font-bold text-center dyslexia-text"
            >
              {words[currentWordIndex]}
            </motion.div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            {!isReading && !isPaused && (
              <button
                onClick={handleStart}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-bold text-lg"
              >
                <Play className="h-6 w-6" />
                <span>Start Reading</span>
              </button>
            )}

            {isReading && (
              <button
                onClick={handlePause}
                className="flex items-center space-x-2 px-8 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all font-bold text-lg"
              >
                <Pause className="h-6 w-6" />
                <span>Pause</span>
              </button>
            )}

            {isPaused && (
              <>
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-lg"
                >
                  <Play className="h-6 w-6" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={handleFinish}
                  className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg"
                >
                  <CheckCircle className="h-6 w-6" />
                  <span>Finish</span>
                </button>
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

  // RESULTS SCREEN
  if (mode === 'results' && testResults) {
    const level = speedReadingService.getLevelForWPM(testResults.wpm)
    const nextLevel = speedReadingService.getNextLevel(testResults.wpm)
    const recommendation = speedReadingService.getRecommendation(testResults.wpm, testResults.comprehension)

    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-color)]">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-4"
              >
                <Trophy className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                Session Complete!
              </h2>
              <p className="text-[var(--text-secondary)] dyslexia-text">
                Here's how you did
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dyslexia-text">
                  {testResults.wpm}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Words/Min</div>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dyslexia-text">
                  {testResults.comprehension}%
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Comprehension</div>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dyslexia-text">
                  {Math.round(testResults.duration / 1000)}s
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">Time</div>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="text-3xl dyslexia-text">{level.icon}</div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">{level.name}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 mb-8 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{recommendation.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                    {recommendation.message}
                  </h3>
                  <p className="text-[var(--text-secondary)] dyslexia-text">
                    {recommendation.action}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setMode('home')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all font-medium dyslexia-text"
              >
                Back to Home
              </button>
              {nextLevel && (
                <button
                  onClick={() => startTest(nextLevel.id)}
                  className="flex-1 px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all font-medium dyslexia-text border-2 border-orange-500"
                >
                  Try {nextLevel.name} ({nextLevel.wpm} WPM)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ENHANCED QUIZ COMPONENT WITH INSTANT FEEDBACK
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
        // Calculate score
        const correct = newAnswers.filter((a, i) => a === questions[i].correct).length
        onComplete(newAnswers, correct, questions.length)
      }
    }, 2000)
  }

  const question = questions[currentQ]
  const isCorrect = selected === question.correct

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text">
              Comprehension Check
            </h3>
            <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
              {currentQ + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-lg text-[var(--text-primary)] dyslexia-text mb-6">
          {question.question}
        </p>

        <div className="space-y-3 mb-6">
          {question.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrectOption = i === question.correct
            const showCorrect = showFeedback && isCorrectOption
            const showWrong = showFeedback && isSelected && !isCorrectOption

            return (
              <button
                key={i}
                onClick={() => !showFeedback && setSelected(i)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all dyslexia-text flex items-center justify-between ${
                  showCorrect
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                    : showWrong
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                    : isSelected
                    ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                }`}
              >
                <span>{opt}</span>
                {showCorrect && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
                {showWrong && <XCircle className="h-5 w-5 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 ${
              isCorrect
                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span className={`font-semibold dyslexia-text ${
                isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </span>
            </div>
          </motion.div>
        )}

        {!showFeedback && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium dyslexia-text"
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}

export default SpeedReading
