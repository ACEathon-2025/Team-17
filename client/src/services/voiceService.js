import SpeechRecognition from 'react-speech-recognition'

class VoiceService {
  constructor() {
    this.commands = []
    this.isListening = false
  }

  /**
   * Check if browser supports voice recognition
   */
  isSupported() {
    return SpeechRecognition.browserSupportsSpeechRecognition()
  }

  /**
   * Start listening for voice input
   */
  startListening(continuous = true) {
    if (!this.isSupported()) {
      throw new Error('Voice recognition is not supported in your browser. Please use Chrome or Edge.')
    }

    SpeechRecognition.startListening({
      continuous,
      language: 'en-US'
    })
    this.isListening = true
  }

  /**
   * Stop listening
   */
  stopListening() {
    SpeechRecognition.stopListening()
    this.isListening = false
  }

  /**
   * Abort listening immediately
   */
  abortListening() {
    SpeechRecognition.abortListening()
    this.isListening = false
  }

  /**
   * Get available languages
   */
  getLanguages() {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'ru-RU', name: 'Russian' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'zh-CN', name: 'Chinese (Mandarin)' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'ar-SA', name: 'Arabic' },
      { code: 'hi-IN', name: 'Hindi' }
    ]
  }

  /**
   * Voice Commands Configuration
   */
  getCommands() {
    return {
      // Navigation commands
      'open *': 'navigate',
      'go to *': 'navigate',
      'show *': 'navigate',
      
      // Reading commands
      'read this': 'read',
      'read aloud': 'read',
      'start reading': 'read',
      'stop reading': 'stopRead',
      'pause': 'pause',
      'resume': 'resume',
      
      // Translation commands
      'translate to *': 'translate',
      'translate this to *': 'translate',
      
      // Summarization
      'summarize': 'summarize',
      'summarize this': 'summarize',
      'make it shorter': 'summarize',
      
      // Quiz
      'quiz me': 'quiz',
      'test my knowledge': 'quiz',
      'start quiz': 'quiz',
      
      // Focus mode
      'focus mode': 'focus',
      'start focus': 'focus',
      'distraction free': 'focus',
      
      // Speed reading
      'speed reading': 'speedReading',
      'speed level *': 'speedLevel',
      
      // Collections
      'save this': 'save',
      'save to favorites': 'saveFavorites',
      'save to collection': 'save',
      'show collections': 'collections',
      'my collections': 'collections',
      
      // Goals
      'show goals': 'goals',
      'my goals': 'goals',
      'show progress': 'goals',
      'what is my streak': 'streak',
      
      // Settings
      'open settings': 'settings',
      'change theme': 'theme',
      'dark mode': 'darkMode',
      'light mode': 'lightMode',
      
      // Eye comfort
      'take a break': 'eyeBreak',
      'start break': 'eyeBreak',
      
      // Search
      'search for *': 'search',
      'find *': 'search',
      
      // Help
      'help': 'help',
      'what can I say': 'help',
      'show commands': 'help'
    }
  }

  /**
   * Parse voice command
   */
  parseCommand(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim()
    const commands = this.getCommands()

    for (const [pattern, action] of Object.entries(commands)) {
      const regex = new RegExp('^' + pattern.replace('*', '(.+)') + '$', 'i')
      const match = lowerTranscript.match(regex)
      
      if (match) {
        return {
          action,
          parameter: match[1]?.trim() || null,
          original: transcript
        }
      }
    }

    return null
  }

  /**
   * Text cleanup for voice typing
   */
  formatVoiceText(text) {
    return text
      .replace(/\bperiod\b/gi, '.')
      .replace(/\bcomma\b/gi, ',')
      .replace(/\bquestion mark\b/gi, '?')
      .replace(/\bexclamation mark\b/gi, '!')
      .replace(/\bnew line\b/gi, '\n')
      .replace(/\bnew paragraph\b/gi, '\n\n')
      .trim()
  }
}

export const voiceService = new VoiceService()
