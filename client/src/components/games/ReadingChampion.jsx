import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Clock, Zap, Brain, Star, CheckCircle, XCircle, Award } from 'lucide-react'

const ReadingChampion = ({ onComplete, onBack, gameInfo }) => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [currentStage, setCurrentStage] = useState('intro') // 'intro', 'reading', 'questions', 'vocab', 'complete'
  const [currentLevel, setCurrentLevel] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  // Reading passages with questions and vocabulary
  const levels = [
    {
      passage: "The sun was shining brightly in the clear blue sky. Birds were singing their morning songs in the tall green trees. A small rabbit hopped across the soft grass, looking for fresh carrots to eat. It was a beautiful spring day, and all the animals were happy and playful.",
      questions: [
        {
          q: "What was the weather like?",
          options: ["Rainy and cold", "Sunny and bright", "Cloudy and dark", "Snowy and windy"],
          correct: 1
        },
        {
          q: "What was the rabbit looking for?",
          options: ["Water to drink", "A place to sleep", "Fresh carrots", "Other rabbits"],
          correct: 2
        },
        {
          q: "What season was it?",
          options: ["Winter", "Summer", "Spring", "Fall"],
          correct: 2
        }
      ],
      vocabulary: [
        { word: "BRIGHT", meaning: "Giving off much light", options: ["Dark", "Giving off much light", "Very cold", "Very fast"] },
        { word: "HOPPED", meaning: "Jumped on one leg", options: ["Jumped on one leg", "Flew in air", "Swam in water", "Walked slowly"] }
      ]
    },
    {
      passage: "Emma loved to visit the library every Saturday. She would spend hours exploring different books about animals, space, and adventures. Her favorite spot was the cozy reading corner with big soft pillows. The librarian, Mrs. Johnson, always helped her find the most interesting stories. Reading made Emma feel like she could travel to any place in the world.",
      questions: [
        {
          q: "When did Emma visit the library?",
          options: ["Every Monday", "Every Saturday", "Every day", "Only in summer"],
          correct: 1
        },
        {
          q: "What was Emma's favorite spot?",
          options: ["The front desk", "The computer area", "The reading corner", "The parking lot"],
          correct: 2
        },
        {
          q: "How did reading make Emma feel?",
          options: ["Bored and tired", "Scared and nervous", "Like she could travel", "Hungry for food"],
          correct: 2
        }
      ],
      vocabulary: [
        { word: "COZY", meaning: "Warm and comfortable", options: ["Very scary", "Warm and comfortable", "Very noisy", "Very dirty"] },
        { word: "EXPLORING", meaning: "Looking around to discover", options: ["Sleeping deeply", "Looking around to discover", "Eating quickly", "Running away"] }
      ]
    },
    {
      passage: "The ancient castle stood on top of the hill for over 500 years. Its tall stone walls had witnessed many battles and celebrations. Today, tourists come from around the world to walk through its grand halls and learn about its fascinating history. The castle's museum displays armor, weapons, and treasures from medieval times. Visitors especially love the view from the highest tower, where they can see the entire valley below.",
      questions: [
        {
          q: "How old is the castle?",
          options: ["100 years", "Over 500 years", "50 years", "1000 years"],
          correct: 1
        },
        {
          q: "What do people do at the castle today?",
          options: ["Live there", "Fight battles", "Visit and learn", "Build new walls"],
          correct: 2
        },
        {
          q: "What can visitors see from the highest tower?",
          options: ["The ocean", "The entire valley", "The parking lot", "Other castles"],
          correct: 1
        }
      ],
      vocabulary: [
        { word: "ANCIENT", meaning: "Very old", options: ["Brand new", "Very old", "Very small", "Very fast"] },
        { word: "FASCINATING", meaning: "Extremely interesting", options: ["Very boring", "Very scary", "Extremely interesting", "Very cold"] }
      ]
    }
  ]

  const currentData = levels[currentLevel]

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && currentStage !== 'complete') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      endGame()
    }
  }, [timeLeft, currentStage])

  const startReading = () => {
    setCurrentStage('reading')
  }

  const finishReading = () => {
    setCurrentStage('questions')
    setSelectedAnswer(null)
    setFeedback(null)
  }

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const answerQuestion = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentData.questions[currentQuestion].correct
    
    if (isCorrect) {
      setScore(score + 50)
      setStreak(streak + 1)
      if (streak + 1 > bestStreak) setBestStreak(streak + 1)
      setFeedback('correct')
    } else {
      setStreak(0)
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (currentQuestion < currentData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setFeedback(null)
      } else {
        setCurrentStage('vocab')
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setFeedback(null)
      }
    }, 1500)
  }

  const [currentVocab, setCurrentVocab] = useState(0)

  const answerVocab = (answer) => {
    setSelectedAnswer(answer)
    const isCorrect = answer === currentData.vocabulary[currentVocab].meaning
    
    if (isCorrect) {
      setScore(score + 30)
      setStreak(streak + 1)
      if (streak + 1 > bestStreak) setBestStreak(streak + 1)
      setFeedback('correct')
    } else {
      setStreak(0)
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (currentVocab < currentData.vocabulary.length - 1) {
        setCurrentVocab(currentVocab + 1)
        setSelectedAnswer(null)
        setFeedback(null)
      } else {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1)
          setCurrentStage('intro')
          setCurrentQuestion(0)
          setCurrentVocab(0)
          setSelectedAnswer(null)
          setFeedback(null)
        } else {
          endGame()
        }
      }
    }, 1500)
  }

  const endGame = () => {
    setCurrentStage('complete')
    onComplete(score)
  }

  // Intro Stage
  if (currentStage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all font-bold game-font">
              <ArrowLeft className="h-5 w-5" />
              <span>BACK</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  <span className="text-2xl font-black text-white game-font">{score}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-300" />
                  <span className="text-2xl font-black text-white game-font">{timeLeft}s</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="text-8xl mb-6">🏆</div>
            <h1 className="text-5xl font-black game-font bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              READING CHAMPION
            </h1>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-6">
              <h2 className="text-3xl font-black game-font text-blue-700 dark:text-blue-200 mb-4">
                LEVEL {currentLevel + 1} of {levels.length}
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-4xl mb-2">📖</p>
                  <p className="text-sm font-bold fun-font text-gray-700 dark:text-gray-300">READ</p>
                </div>
                <div>
                  <p className="text-4xl mb-2">❓</p>
                  <p className="text-sm font-bold fun-font text-gray-700 dark:text-gray-300">ANSWER</p>
                </div>
                <div>
                  <p className="text-4xl mb-2">📚</p>
                  <p className="text-sm font-bold fun-font text-gray-700 dark:text-gray-300">LEARN</p>
                </div>
              </div>
            </div>

            {streak > 0 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 mb-6">
                <p className="text-white text-sm font-bold fun-font mb-1">🔥 STREAK</p>
                <p className="text-4xl font-black text-white game-font">{streak}</p>
              </div>
            )}

            <button
              onClick={startReading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 rounded-2xl font-black game-font text-2xl hover:scale-105 transition-all shadow-2xl"
            >
              START LEVEL {currentLevel + 1} 🚀
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Reading Stage
  if (currentStage === 'reading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all font-bold game-font">
              <ArrowLeft className="h-5 w-5" />
              <span>BACK</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  <span className="text-2xl font-black text-white game-font">{score}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-300" />
                  <span className="text-2xl font-black text-white game-font">{timeLeft}s</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black game-font bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                📖 READ CAREFULLY
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 fun-font font-semibold">
                Level {currentLevel + 1} - Then answer questions!
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8 border-4 border-blue-200 dark:border-blue-800">
              <p className="text-2xl leading-relaxed text-gray-800 dark:text-gray-200 fun-font font-semibold" style={{ lineHeight: '2.2', letterSpacing: '0.03em' }}>
                {currentData.passage}
              </p>
            </div>

            <button
              onClick={finishReading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 rounded-2xl font-black game-font text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center space-x-3"
            >
              <CheckCircle className="h-8 w-8" />
              <span>I'M READY! ✅</span>
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Questions Stage
  if (currentStage === 'questions') {
    const question = currentData.questions[currentQuestion]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all font-bold game-font">
              <ArrowLeft className="h-5 w-5" />
              <span>BACK</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  <span className="text-2xl font-black text-white game-font">{score}</span>
                </div>
              </div>
              {streak > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-6 py-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-white" />
                    <span className="text-2xl font-black text-white game-font">{streak}</span>
                  </div>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-300" />
                  <span className="text-2xl font-black text-white game-font">{timeLeft}s</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-300 game-font mb-2">
                QUESTION {currentQuestion + 1} OF {currentData.questions.length}
              </p>
              <h2 className="text-3xl font-black game-font text-gray-800 dark:text-white mb-6" style={{ lineHeight: '1.6', letterSpacing: '0.02em' }}>
                {question.q}
              </h2>
            </div>

            <div className="space-y-4">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === question.correct
                const showFeedback = isSelected && feedback

                return (
                  <motion.button
                    key={idx}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => !selectedAnswer && answerQuestion(idx)}
                    disabled={!!selectedAnswer}
                    className={`w-full p-6 rounded-2xl text-left text-xl font-bold fun-font transition-all ${
                      showFeedback && isCorrect
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white scale-105'
                        : showFeedback && !isCorrect
                        ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white scale-95'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
                    style={{ letterSpacing: '0.03em', lineHeight: '1.8' }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showFeedback && isCorrect && <CheckCircle className="h-8 w-8 flex-shrink-0" />}
                      {showFeedback && !isCorrect && isSelected && <XCircle className="h-8 w-8 flex-shrink-0" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Vocabulary Stage
  if (currentStage === 'vocab') {
    const vocab = currentData.vocabulary[currentVocab]

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-lg text-white rounded-xl hover:bg-white/20 transition-all font-bold game-font">
              <ArrowLeft className="h-5 w-5" />
              <span>BACK</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  <span className="text-2xl font-black text-white game-font">{score}</span>
                </div>
              </div>
              {streak > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-6 py-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-white" />
                    <span className="text-2xl font-black text-white game-font">{streak}</span>
                  </div>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-300" />
                  <span className="text-2xl font-black text-white game-font">{timeLeft}s</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            key={currentVocab}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-purple-600 dark:text-purple-300 game-font mb-2">
                VOCABULARY {currentVocab + 1} OF {currentData.vocabulary.length}
              </p>
              <h2 className="text-6xl font-black game-font bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4" style={{ letterSpacing: '0.1em' }}>
                {vocab.word}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 fun-font font-semibold">
                What does this word mean?
              </p>
            </div>

            <div className="space-y-4">
              {vocab.options.map((option, idx) => {
                const isSelected = selectedAnswer === option
                const isCorrect = option === vocab.meaning
                const showFeedback = isSelected && feedback

                return (
                  <motion.button
                    key={idx}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => !selectedAnswer && answerVocab(option)}
                    disabled={!!selectedAnswer}
                    className={`w-full p-6 rounded-2xl text-left text-xl font-bold fun-font transition-all ${
                      showFeedback && isCorrect
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white scale-105'
                        : showFeedback && !isCorrect
                        ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white scale-95'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
                    style={{ letterSpacing: '0.03em', lineHeight: '1.8' }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showFeedback && isCorrect && <CheckCircle className="h-8 w-8 flex-shrink-0" />}
                      {showFeedback && !isCorrect && isSelected && <XCircle className="h-8 w-8 flex-shrink-0" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Complete Stage
  if (currentStage === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-10 max-w-2xl w-full shadow-2xl text-center"
        >
          <div className="text-9xl mb-6">🏆</div>
          <h2 className="text-5xl font-black game-font bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            READING CHAMPION!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6">
              <Trophy className="h-12 w-12 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-bold fun-font mb-1">TOTAL SCORE</p>
              <p className="text-5xl font-black text-white game-font">{score}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6">
              <Zap className="h-12 w-12 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-bold fun-font mb-1">BEST STREAK</p>
              <p className="text-5xl font-black text-white game-font">{bestStreak}</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6">
              <Star className="h-12 w-12 text-white mx-auto mb-2" />
              <p className="text-white text-sm font-bold fun-font mb-1">LEVELS DONE</p>
              <p className="text-5xl font-black text-white game-font">{levels.length}</p>
            </div>
          </div>

          {score >= 500 && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 mb-6">
              <Award className="h-16 w-16 text-purple-600 mx-auto mb-3" />
              <p className="text-2xl font-black text-purple-700 dark:text-purple-200 game-font">
                🎉 MASTER READER 🎉
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-2xl font-black game-font text-2xl hover:scale-105 transition-transform shadow-2xl"
            >
              PLAY AGAIN 🔄
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 rounded-2xl font-black game-font text-2xl hover:scale-105 transition-transform shadow-2xl"
            >
              BACK TO GAMES 🎮
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}

export default ReadingChampion
