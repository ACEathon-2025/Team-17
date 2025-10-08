import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, SkipForward } from 'lucide-react'
import { useEyeComfort } from '../context/EyeComfortContext'

const EyeBreakOverlay = () => {
  const { isBreakTime, timeRemaining, skipBreak, getFormattedTime } = useEyeComfort()
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (isBreakTime) {
      const totalTime = 20 // 20 seconds
      const percentage = (timeRemaining / totalTime) * 100
      setProgress(percentage)
    }
  }, [timeRemaining, isBreakTime])

  if (!isBreakTime) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 max-w-md mx-4 text-white shadow-2xl"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full">
              <Eye className="h-12 w-12" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-4 dyslexia-text">
            Eye Break Time! 👁️
          </h2>

          {/* Instructions */}
          <p className="text-center text-lg mb-6 dyslexia-text leading-relaxed">
            Look at something <strong>20 feet away</strong> for <strong>20 seconds</strong> to rest your eyes.
          </p>

          {/* Countdown */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold dyslexia-text mb-2">
              {timeRemaining}
            </div>
            <div className="text-sm opacity-90 dyslexia-text">
              seconds remaining
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Skip Button */}
          <button
            onClick={skipBreak}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors dyslexia-text"
          >
            <SkipForward className="h-5 w-5" />
            <span>Skip Break</span>
          </button>

          {/* Tips */}
          <div className="mt-6 p-4 bg-white/10 rounded-xl">
            <p className="text-xs text-center opacity-90 dyslexia-text">
              💡 Tip: Blink frequently and stay hydrated to reduce eye strain
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EyeBreakOverlay
