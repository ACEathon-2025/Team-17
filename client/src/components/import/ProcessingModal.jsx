import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader, CheckCircle, AlertCircle } from 'lucide-react'

const ProcessingModal = ({ isOpen, progress, status, message, fileName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-[var(--bg-primary)] rounded-2xl p-8 max-w-md w-full border border-[var(--border-color)] shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                {status === 'processing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full"
                  >
                    <Loader className="h-12 w-12 text-white" />
                  </motion.div>
                )}
                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-green-500 rounded-full"
                  >
                    <CheckCircle className="h-12 w-12 text-white" />
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-red-500 rounded-full"
                  >
                    <AlertCircle className="h-12 w-12 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center text-[var(--text-primary)] dyslexia-text mb-2">
                {status === 'processing' && 'Processing File...'}
                {status === 'success' && 'Success!'}
                {status === 'error' && 'Error'}
              </h3>

              {/* File Name */}
              {fileName && (
                <p className="text-sm text-center text-[var(--text-secondary)] dyslexia-text mb-4">
                  {fileName}
                </p>
              )}

              {/* Progress Bar */}
              {status === 'processing' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--text-secondary)] dyslexia-text">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-primary-600 dyslexia-text">
                      {Math.round(progress * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Message */}
              <p className="text-center text-[var(--text-secondary)] dyslexia-text">
                {message}
              </p>

              {/* Animated dots for processing */}
              {status === 'processing' && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProcessingModal
