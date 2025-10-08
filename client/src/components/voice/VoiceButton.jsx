import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const VoiceButton = ({ onTranscript, mode = 'typing', size = 'md' }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const [error, setError] = useState('')

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Voice recognition not supported in your browser')
      return
    }

    if (listening) {
      SpeechRecognition.stopListening()
      if (transcript && onTranscript) {
        onTranscript(transcript)
      }
      resetTranscript()
    } else {
      setError('')
      SpeechRecognition.startListening({ continuous: mode === 'typing' })
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-xs text-red-600">
        Voice not supported
      </div>
    )
  }

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`
          ${sizeClasses[size]}
          rounded-full transition-all
          ${listening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary-600 hover:bg-primary-700'
          }
        `}
        title={listening ? 'Stop listening' : 'Start voice input'}
      >
        {listening ? (
          <MicOff className={`${iconSizes[size]} text-white`} />
        ) : (
          <Mic className={`${iconSizes[size]} text-white`} />
        )}
      </motion.button>

      {/* Listening indicator */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <div className="absolute top-full mt-2 text-xs text-red-600 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  )
}

export default VoiceButton
