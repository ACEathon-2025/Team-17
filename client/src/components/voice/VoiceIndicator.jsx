import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2 } from 'lucide-react'

const VoiceIndicator = ({ isListening, transcript, isSpeaking }) => {
  return (
    <AnimatePresence>
      {(isListening || isSpeaking) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full mx-4"
        >
          <div className="bg-[var(--bg-primary)] border-2 border-primary-500 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`
                p-3 rounded-full flex-shrink-0
                ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}
              `}>
                {isListening ? (
                  <Mic className="h-6 w-6 text-white" />
                ) : (
                  <Volume2 className="h-6 w-6 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] dyslexia-text">
                    {isListening ? '🎤 Listening...' : '🔊 Speaking...'}
                  </h4>
                  {isListening && (
                    <div className="flex items-center space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          className="w-1 h-4 bg-red-500 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Transcript */}
                {transcript && (
                  <p className="text-[var(--text-primary)] dyslexia-text">
                    {transcript}
                  </p>
                )}

                {/* Hint */}
                {isListening && !transcript && (
                  <p className="text-sm text-[var(--text-secondary)] dyslexia-text italic">
                    Try saying: "Read this aloud" or "Summarize"
                  </p>
                )}
              </div>
            </div>

            {/* Wave animation */}
            {isListening && (
              <div className="mt-4 flex items-center justify-center space-x-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: ['8px', '24px', '8px'],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: 'easeInOut'
                    }}
                    className="w-1 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceIndicator
