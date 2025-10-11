import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Trophy, Clock, Star, Zap, Brain, Target, Sparkles, ArrowLeft, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import WordScramble from '../components/games/WordScramble'
import MemoryCards from '../components/games/MemoryCards'
import ReadingChampion from '../components/games/ReadingChampion'

const Games = () => {
  const navigate = useNavigate()
  const [selectedGame, setSelectedGame] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('voxa-game-stats') || '{}')
    setTotalScore(stats.totalScore || 0)
    setGamesPlayed(stats.gamesPlayed || 0)
  }, [])

  // Save game completion
  const handleGameComplete = (score) => {
    const stats = JSON.parse(localStorage.getItem('voxa-game-stats') || '{}')
    const newStats = {
      totalScore: (stats.totalScore || 0) + score,
      gamesPlayed: (stats.gamesPlayed || 0) + 1,
      lastPlayed: new Date().toISOString()
    }
    localStorage.setItem('voxa-game-stats', JSON.stringify(newStats))
    setTotalScore(newStats.totalScore)
    setGamesPlayed(newStats.gamesPlayed)
    
    // Show celebration
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const games = [
    {
      id: 'word-scramble',
      name: 'Word Scramble',
      icon: Zap,
      color: 'from-yellow-400 via-orange-500 to-red-500',
      description: 'Unscramble letters to form words!',
      difficulty: 'Easy',
      time: '2 min',
      points: '10-50',
      emoji: '🔤',
      component: WordScramble
    },
    {
      id: 'memory-cards',
      name: 'Memory Cards',
      icon: Brain,
      color: 'from-purple-400 via-pink-500 to-rose-500',
      description: 'Find matching word pairs!',
      difficulty: 'Medium',
      time: '4 min',
      points: '30-100',
      emoji: '🃏',
      component: MemoryCards
    },
    {
      id: 'reading-champion',
      name: 'Reading Champion',
      icon: Trophy,
      color: 'from-blue-400 via-purple-500 to-pink-500',
      description: 'Ultimate reading challenge!',
      difficulty: 'Hard',
      time: '5 min',
      points: '50-600',
      emoji: '🏆',
      component: ReadingChampion
    }
  ]

  // Render selected game
  if (selectedGame) {
    const GameComponent = selectedGame.component
    return (
      <GameComponent
        onComplete={handleGameComplete}
        onBack={() => setSelectedGame(null)}
        gameInfo={selectedGame}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                top: '50%', 
                left: '50%', 
                opacity: 1,
                scale: 1
              }}
              animate={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.02
              }}
              className="absolute w-4 h-4 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5]
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1 }}
            className="inline-flex p-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl mb-6 shadow-2xl"
          >
            <Gamepad2 className="h-12 w-12 text-white animate-bounce" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-white mb-4 game-font"
            style={{
              textShadow: '4px 4px 0px rgba(0,0,0,0.3), 8px 8px 0px rgba(0,0,0,0.1)',
              letterSpacing: '0.1em'
            }}
          >
            🎮 READING GAMES 🎮
          </motion.h1>
          
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-purple-200 fun-font font-semibold"
            style={{ letterSpacing: '0.08em' }}
          >
            Learn while having FUN! 🚀✨
          </motion.p>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {/* Total Score */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-bold fun-font mb-1">TOTAL SCORE</p>
                <p className="text-4xl font-black text-white game-font">{totalScore}</p>
              </div>
              <Trophy className="h-12 w-12 text-white/30" />
            </div>
          </div>

          {/* Games Played */}
          <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-bold fun-font mb-1">GAMES PLAYED</p>
                <p className="text-4xl font-black text-white game-font">{gamesPlayed}</p>
              </div>
              <Gamepad2 className="h-12 w-12 text-white/30" />
            </div>
          </div>

          {/* Level */}
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-bold fun-font mb-1">YOUR LEVEL</p>
                <p className="text-4xl font-black text-white game-font">{Math.floor(totalScore / 100) + 1}</p>
              </div>
              <Star className="h-12 w-12 text-white/30" />
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, idx) => {
            const Icon = game.icon
            return (
              <motion.div
                key={game.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.4 + idx * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGame(game)}
                className="cursor-pointer group"
              >
                <div className={`bg-gradient-to-br ${game.color} rounded-3xl p-1 shadow-2xl`}>
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 h-full">
                    {/* Game Emoji */}
                    <div className="text-6xl mb-4 text-center transform group-hover:scale-125 transition-transform">
                      {game.emoji}
                    </div>

                    {/* Game Name */}
                    <h3 className="text-2xl font-black text-center mb-3 game-font bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {game.name}
                    </h3>

                    {/* Description */}
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-4 fun-font text-lg font-semibold">
                      {game.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-2 text-center">
                        <p className="text-xs font-bold text-purple-600 dark:text-purple-300 game-font">
                          {game.difficulty}
                        </p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-2 text-center">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-300 game-font">
                          ⏱️ {game.time}
                        </p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-2 text-center">
                        <p className="text-xs font-bold text-green-600 dark:text-green-300 game-font">
                          🏆 {game.points}
                        </p>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button className={`w-full bg-gradient-to-r ${game.color} text-white font-black py-3 rounded-xl game-font text-lg shadow-lg transform group-hover:translate-y-[-2px] transition-all`}>
                      PLAY NOW! 🎮
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-2xl hover:bg-white/20 transition-all font-bold game-font border-2 border-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>BACK TO DASHBOARD</span>
          </button>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-800"
        >
          <h3 className="text-2xl font-black text-center mb-6 game-font bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            💡 GAME TIPS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🔤</div>
              <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 game-font mb-2">
                Word Scramble
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 fun-font">
                Perfect for beginners! Quick 2-minute rounds to warm up your reading skills.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🃏</div>
              <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 game-font mb-2">
                Memory Cards
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 fun-font">
                Train your brain! Great for improving memory and word recognition.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 game-font mb-2">
                Reading Champion
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 fun-font">
                Ultimate challenge! Read passages, answer questions, and build vocabulary.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 10px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Games
