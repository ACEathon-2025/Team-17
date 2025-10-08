import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Brain, Trophy, Clock, Zap } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ReadingQuiz = ({ questions, onComplete, onClose }) => {
  const { isDark } = useTheme()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(null)
  const [startTime] = useState(Date.now())

  const handleAnswerSelect = (optionIndex) => {
    if (showExplanation) return
    setSelectedAnswer(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setShowExplanation(true)

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowExplanation(false)
      } else {
        // Quiz complete
        const finalScore = calculateScore(newAnswers)
        setScore(finalScore)
        setQuizComplete(true)
        
        if (onComplete) {
          onComplete({
            ...finalScore,
            duration: Date.now() - startTime,
            answers: newAnswers
          })
        }
      }
    }, 2500)
  }

  const calculateScore = (userAnswers) => {
    let correct = 0
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    
    return {
      correct,
      total: questions.length,
      percentage,
      passed: percentage >= 70,
      grade: getGrade(percentage)
    }
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer

  if (quizComplete && score) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isDark ? 'bg-black/80' : 'bg-gray-900/80'
        } backdrop-blur-sm`}
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className={`max-w-lg w-full rounded-2xl p-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl`}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`inline-flex p-4 rounded-full mb-4 ${
                score.passed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : 'bg-gradient-to-br from-orange-500 to-amber-500'
              }`}
            >
              <Trophy className="h-12 w-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
              Quiz Complete!
            </h2>
            
            <div className="text-6xl font-bold my-6 dyslexia-text">
              <span className={score.passed ? 'text-green-600' : 'text-orange-600'}>
                {score.percentage}%
              </span>
            </div>

            <p className="text-xl text-[var(--text-secondary)] dyslexia-text mb-6">
              You scored {score.correct} out of {score.total} ({score.grade})
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {score.correct}
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Correct
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[var(--text-primary)] dyslexia-text">
                  {Math.round((Date.now() - startTime) / 1000)}s
                </div>
                <div className="text-sm text-[var(--text-secondary)] dyslexia-text">
                  Time
                </div>
              </div>
            </div>

            {score.passed ? (
              <p className="text-green-600 dark:text-green-400 font-medium dyslexia-text mb-6">
                🎉 Great job! You have a strong understanding of the material.
              </p>
            ) : (
              <p className="text-orange-600 dark:text-orange-400 font-medium dyslexia-text mb-6">
                💪 Keep practicing! Review the material and try again.
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors font-medium dyslexia-text"
            >
              Continue Reading
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isDark ? 'bg-black/80' : 'bg-gray-900/80'
      } backdrop-blur-sm`}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-2xl w-full rounded-2xl p-6 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] dyslexia-text">
                Reading Comprehension
              </h2>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-6">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrectAnswer = index === question.correctAnswer
                const showCorrect = showExplanation && isCorrectAnswer
                const showWrong = showExplanation && isSelected && !isCorrectAnswer

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                    whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all dyslexia-text ${
                      showCorrect
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                        : showWrong
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                        : isSelected
                        ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500'
                        : isDark
                        ? 'bg-gray-700 border-gray-600 hover:border-purple-500'
                        : 'bg-gray-50 border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrect && <CheckCircle className="h-5 w-5" />}
                      {showWrong && <XCircle className="h-5 w-5" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-lg mb-6 ${
                    isCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                      : 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-semibold dyslexia-text mb-1 ${
                        isCorrect ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'
                      }`}>
                        {isCorrect ? 'Correct!' : 'Not quite!'}
                      </p>
                      <p className={`text-sm dyslexia-text ${
                        isCorrect ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            {!showExplanation && (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium dyslexia-text flex items-center justify-center space-x-2"
              >
                <span>Submit Answer</span>
                <Zap className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default ReadingQuiz
