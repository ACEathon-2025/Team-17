import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X } from 'lucide-react'

const FloatingVoiceButton = ({ listening, onStop, transcript }) => {
  if (!listening) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-[999]"
      >
        {/* Transcript Display */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-xs border-2 border-red-500"
          >
            <div className="flex items-start space-x-2">
              <Mic className="h-4 w-4 text-red-500 flex-shrink-0 mt-1 animate-pulse" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Listening...
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  "{transcript}"
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Floating Button */}
        <motion.button
          onClick={onStop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center group"
          title="Stop voice commands (or say 'stop listening')"
        >
          {/* Pulsing Ring */}
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          
          {/* Icon Container */}
          <div className="relative z-10 flex items-center justify-center">
            <Mic className="h-7 w-7 text-white group-hover:hidden" />
            <X className="h-7 w-7 text-white hidden group-hover:block" />
          </div>

          {/* Status Indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </motion.button>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap"
        >
          Voice commands active
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingVoiceButton
