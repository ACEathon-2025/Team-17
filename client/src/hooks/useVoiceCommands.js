// client/src/hooks/useVoiceCommands.js
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export const useVoiceCommands = (enabled = false) => {
  const navigate = useNavigate()
  const location = useLocation()
  const processingRef = useRef(false)
  const lastCommandRef = useRef('')
  const [dictationMode, setDictationMode] = useState(false)
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    interimTranscript,
    finalTranscript
  } = useSpeechRecognition()

  // Scroll functions
  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
    console.log('⬇️ Scrolling down')
  }

  const scrollUp = () => {
    window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' })
    console.log('⬆️ Scrolling up')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log('⬆️ Scrolling to top')
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    console.log('⬇️ Scrolling to bottom')
  }

  // Trigger action on current page
  const triggerPageAction = (action, data) => {
    const event = new CustomEvent('voicePageAction', { 
      detail: { action, data, path: location.pathname } 
    })
    window.dispatchEvent(event)
    console.log(`🎯 Triggering action: ${action}`, data)
  }

  // Process commands
  useEffect(() => {
    if (!transcript || !listening || processingRef.current) return

    const lowerTranscript = transcript.toLowerCase().trim()
    
    // Prevent processing same command twice
    if (lowerTranscript === lastCommandRef.current) return
    if (lowerTranscript.length < 3) return

    console.log('📝 Transcript:', lowerTranscript)
    
    processingRef.current = true
    lastCommandRef.current = lowerTranscript

    // ============================================
    // DICTATION MODE - Write text by voice
    // ============================================
    if (lowerTranscript.includes('start dictation') || lowerTranscript.includes('dictation mode')) {
      console.log('✍️ Dictation mode activated')
      setDictationMode(true)
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('stop dictation') || lowerTranscript.includes('end dictation')) {
      console.log('✍️ Dictation mode deactivated')
      setDictationMode(false)
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    // If in dictation mode, send all speech as text input
    if (dictationMode) {
      triggerPageAction('dictate', { text: transcript })
      // Don't reset transcript in dictation mode
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    // ============================================
    // SCROLL COMMANDS
    // ============================================
    if (lowerTranscript.includes('scroll down') || lowerTranscript.includes('page down')) {
      scrollDown()
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('scroll up') || lowerTranscript.includes('page up')) {
      scrollUp()
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('scroll to top') || lowerTranscript.includes('go to top')) {
      scrollToTop()
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('scroll to bottom') || lowerTranscript.includes('go to bottom')) {
      scrollToBottom()
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    // ============================================
    // PAGE-SPECIFIC ACTIONS
    // ============================================
    
    // Summarize page actions
    if (location.pathname === '/summarize') {
      if (lowerTranscript.includes('summarise this') || lowerTranscript.includes('generate summary')) {
        triggerPageAction('summarize')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('clear text')) {
        triggerPageAction('clear')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
    }

    // Text-to-Speech page actions
    if (location.pathname === '/text-to-speech') {
      if (lowerTranscript.includes('play') || lowerTranscript.includes('start reading')) {
        triggerPageAction('play')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('pause') || lowerTranscript.includes('stop reading')) {
        triggerPageAction('pause')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('clear text')) {
        triggerPageAction('clear')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
    }

    // Translation page actions
    if (location.pathname === '/translation') {
      if (lowerTranscript.includes('translate this') || lowerTranscript.includes('translate now')) {
        triggerPageAction('translate')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('translate to spanish')) {
        triggerPageAction('setLanguage', { language: 'es' })
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('translate to french')) {
        triggerPageAction('setLanguage', { language: 'fr' })
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('translate to german')) {
        triggerPageAction('setLanguage', { language: 'de' })
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
    }

    // Focus Mode actions
    if (location.pathname === '/focus-mode') {
      if (lowerTranscript.includes('start reading') || lowerTranscript.includes('begin focus')) {
        triggerPageAction('startFocus')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('pause reading')) {
        triggerPageAction('pauseFocus')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('stop reading')) {
        triggerPageAction('stopFocus')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
    }

    // Quiz page actions
    if (location.pathname === '/quiz') {
      if (lowerTranscript.includes('generate quiz') || lowerTranscript.includes('start quiz')) {
        triggerPageAction('generateQuiz')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
      if (lowerTranscript.includes('next question')) {
        triggerPageAction('nextQuestion')
        resetTranscript()
        processingRef.current = false
        setTimeout(() => lastCommandRef.current = '', 500)
        return
      }
    }

    // ============================================
    // NAVIGATION COMMANDS (Don't stop listening)
    // ============================================
    if (lowerTranscript.includes('dashboard') || lowerTranscript.includes('go to dash')) {
      console.log('✅ Navigating to dashboard')
      navigate('/dashboard')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('text to speech') || lowerTranscript.includes('tts')) {
      console.log('✅ Navigating to text-to-speech')
      navigate('/text-to-speech')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('translation') || lowerTranscript.includes('translate page')) {
      console.log('✅ Navigating to translation')
      navigate('/translation')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('focus mode') || lowerTranscript.includes('focus page')) {
      console.log('✅ Navigating to focus-mode')
      navigate('/focus-mode')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('summarize page') || lowerTranscript.includes('go to summarise')) {
      console.log('✅ Navigating to summarize')
      navigate('/summarize')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('quiz page') || lowerTranscript.includes('go to quiz')) {
      console.log('✅ Navigating to quiz')
      navigate('/quiz')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('speed reading')) {
      console.log('✅ Navigating to speed-reading')
      navigate('/speed-reading')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('collection') || lowerTranscript.includes('bookmark')) {
      console.log('✅ Navigating to collections')
      navigate('/collections')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('goals')) {
      console.log('✅ Navigating to goals')
      navigate('/goals')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('import page')) {
      console.log('✅ Navigating to import')
      navigate('/import')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('voice command')) {
      console.log('✅ Navigating to voice-commands')
      navigate('/voice-commands')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('settings')) {
      console.log('✅ Navigating to settings')
      navigate('/settings')
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    // ============================================
    // THEME COMMANDS
    // ============================================
    if (lowerTranscript.includes('dark mode')) {
      console.log('🎨 Switching to dark mode')
      const event = new CustomEvent('voiceThemeToggle', { detail: { theme: 'dark' } })
      window.dispatchEvent(event)
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    if (lowerTranscript.includes('light mode')) {
      console.log('🎨 Switching to light mode')
      const event = new CustomEvent('voiceThemeToggle', { detail: { theme: 'light' } })
      window.dispatchEvent(event)
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    // ============================================
    // CONTROL COMMANDS
    // ============================================
    if (lowerTranscript.includes('stop listening') || lowerTranscript.includes('stop voice')) {
      console.log('🛑 Stopping voice commands')
      SpeechRecognition.stopListening()
      resetTranscript()
      processingRef.current = false
      setTimeout(() => lastCommandRef.current = '', 500)
      return
    }

    // Reset processing after delay
    setTimeout(() => {
      processingRef.current = false
      lastCommandRef.current = ''
    }, 1000)

  }, [transcript, listening, navigate, location, dictationMode])

  // Start listening function
  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      console.error('❌ Speech recognition not supported')
      return
    }

    console.log('🎤 Starting persistent voice commands...')
    resetTranscript()
    processingRef.current = false
    lastCommandRef.current = ''
    
    SpeechRecognition.startListening({
      continuous: true, // Keep listening
      language: 'en-US'
    })
  }

  // Stop listening function
  const stopListening = () => {
    console.log('🛑 Stopping voice commands...')
    SpeechRecognition.stopListening()
    resetTranscript()
    setDictationMode(false)
    processingRef.current = false
    lastCommandRef.current = ''
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening()
      }
    }
  }, [listening])

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    dictationMode
  }
}
