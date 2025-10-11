import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Clock, Brain } from 'lucide-react'

const MemoryCards = ({ onComplete, onBack, gameInfo }) => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutes
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [moves, setMoves] = useState(0)

  // Card pairs
  const cardWords = [
    'BOOK', 'READ', 'WRITE', 'LEARN', 'THINK', 'STUDY', 'TEACH', 'KNOW'
  ]

  // Initialize cards
  useEffect(() => {
    const doubled = [...cardWords, ...cardWords]
    const shuffled = doubled.sort(() => Math.random() - 0.5).map((word, idx) => ({
      id: idx,
      word,
      flipped: false,
      matched: false
    }))
    setCards(shuffled)
  }, [])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !gameOver && matchedCards.length < cardWords.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 || matchedCards.length === cardWords.length) {
      endGame()
    }
  }, [timeLeft, gameOver, matchedCards])

  const flipCard = (card) => {
    if (flippedCards.length === 2 || card.matched || flippedCards.includes(card.id)) return

    const newFlipped = [...flippedCards, card.id]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard.word === secondCard.word) {
        setMatchedCards([...matchedCards, firstCard.word])
        setScore(score + 30)
        setFlippedCards([])
      } else {
        setTimeout(() => setFlippedCards([]), 1000)
      }
    }
  }

  const endGame = () => {
    setGameOver(true)
    onComplete(score)
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center"
        >
          <div className="text-8xl mb-6">🃏</div>
          <h2 className="text-4xl font-black game-font bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            GREAT MEMORY!
          </h2>
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-6 mb-6">
            <p className="text-white text-sm font-bold fun-font mb-2">YOUR SCORE</p>
            <p className="text-6xl font-black text-white game-font">{score}</p>
            <p className="text-white text-sm font-bold fun-font mt-2">Moves: {moves}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-black game-font text-xl hover:scale-105 transition-transform"
            >
              PLAY AGAIN 🔄
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black game-font text-xl hover:scale-105 transition-transform"
            >
              BACK TO GAMES 🎮
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
                <Brain className="h-6 w-6 text-pink-300" />
                <span className="text-2xl font-black text-white game-font">{moves}</span>
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

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white game-font mb-2" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
            🃏 MEMORY CARDS 🃏
          </h1>
          <p className="text-xl text-purple-200 fun-font font-semibold">
            Find matching pairs!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {cards.map((card) => {
            const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.word)
            
            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => flipCard(card)}
                className="aspect-square cursor-pointer"
              >
                <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Card Back */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center backface-hidden shadow-2xl border-4 border-white/20">
                    <span className="text-6xl">❓</span>
                  </div>
                  
                  {/* Card Front */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-white to-purple-100 dark:from-gray-800 dark:to-purple-900 rounded-2xl flex items-center justify-center rotate-y-180 backface-hidden shadow-2xl border-4 border-purple-400">
                    <span className="text-3xl font-black game-font text-purple-700 dark:text-purple-200" style={{ letterSpacing: '0.1em' }}>
                      {card.word}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold fun-font">
              Pairs Found: {matchedCards.length} / {cardWords.length}
            </span>
            <span className="text-white font-bold fun-font">
              {Math.round((matchedCards.length / cardWords.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full"
              animate={{ width: `${(matchedCards.length / cardWords.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default MemoryCards
