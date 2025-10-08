// client/src/utils/textToSpeech.js
class TextToSpeechService {
  constructor() {
    this.synth = null
    this.utterance = null
    this.isPlaying = false
    this.isPaused = false
    this.currentText = ''
    this.currentPosition = 0
    this.onProgress = null
    this.voices = []
    this.currentIndex = 0
    this.words = []
    this.intervalId = null
    
    this.init()
  }

  init() {
    // Check for speech synthesis support
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis not supported in this browser')
      return
    }

    this.synth = window.speechSynthesis
    
    // Load voices with retry mechanism
    this.loadVoices()
    
    // Handle voice loading across different browsers
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.loadVoices()
      }
    }

    // Handle browser tab switching to prevent audio interruption
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isPlaying) {
        this.pause()
      }
    })
  }

  loadVoices() {
    try {
      this.voices = this.synth.getVoices()
      
      // If voices are still not loaded, try again after a short delay
      if (this.voices.length === 0) {
        setTimeout(() => {
          this.voices = this.synth.getVoices()
        }, 100)
      }
    } catch (error) {
      console.error('Error loading voices:', error)
      this.voices = []
    }
  }

  getVoices() {
    return this.voices
  }

  getPreferredVoices() {
    const preferredVoices = this.voices.filter(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.default)
    )
    return preferredVoices.length > 0 ? preferredVoices : this.voices
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not available'))
        return
      }

      if (!text || text.trim() === '') {
        reject(new Error('No text provided'))
        return
      }

      try {
        // Stop any current speech
        this.stop()
        
        this.currentText = text.trim()
        this.words = this.currentText.split(' ')
        this.currentIndex = 0

        // Create new utterance
        this.utterance = new SpeechSynthesisUtterance(this.currentText)
        
        // Set voice options with validation
        this.utterance.rate = Math.max(0.5, Math.min(2.0, options.rate || 1.0))
        this.utterance.pitch = Math.max(0, Math.min(2, options.pitch || 1.0))
        this.utterance.volume = Math.max(0, Math.min(1, options.volume || 1.0))
        
        // Set voice with fallback
        if (options.voice) {
          const selectedVoice = this.voices.find(voice => voice.name === options.voice)
          if (selectedVoice) {
            this.utterance.voice = selectedVoice
          } else {
            // Fallback to first available English voice
            const englishVoice = this.voices.find(voice => voice.lang.includes('en'))
            if (englishVoice) {
              this.utterance.voice = englishVoice
            }
          }
        }

        // Set event handlers
        this.utterance.onstart = () => {
          this.isPlaying = true
          this.isPaused = false
          if (options.onStart) {
            try {
              options.onStart()
            } catch (error) {
              console.error('Error in onStart callback:', error)
            }
          }
        }

        this.utterance.onend = () => {
          this.isPlaying = false
          this.isPaused = false
          this.currentPosition = 0
          this.currentIndex = 0
          if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
          }
          if (options.onEnd) {
            try {
              options.onEnd()
            } catch (error) {
              console.error('Error in onEnd callback:', error)
            }
          }
          resolve()
        }

        this.utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error)
          this.isPlaying = false
          this.isPaused = false
          this.currentPosition = 0
          if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
          }
          if (options.onError) {
            try {
              options.onError(event.error)
            } catch (error) {
              console.error('Error in onError callback:', error)
            }
          }
          reject(new Error(event.error))
        }

        this.utterance.onpause = () => {
          this.isPaused = true
          if (options.onPause) {
            try {
              options.onPause()
            } catch (error) {
              console.error('Error in onPause callback:', error)
            }
          }
        }

        this.utterance.onresume = () => {
          this.isPaused = false
          if (options.onResume) {
            try {
              options.onResume()
            } catch (error) {
              console.error('Error in onResume callback:', error)
            }
          }
        }

        // Progress tracking
        if (options.onProgress) {
          this.startProgressTracking(options.onProgress)
        }

        // Start speaking
        this.synth.speak(this.utterance)

      } catch (error) {
        console.error('Error starting speech synthesis:', error)
        reject(error)
      }
    })
  }

  startProgressTracking(onProgress) {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }

    const totalWords = this.words.length
    const estimatedDuration = (totalWords / 2) * 1000 // Rough estimate: 2 words per second
    const updateInterval = Math.max(100, estimatedDuration / totalWords) // Update at least every 100ms

    this.intervalId = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        this.currentIndex = Math.min(this.currentIndex + 1, totalWords)
        const progress = (this.currentIndex / totalWords) * 100
        
        try {
          onProgress({
            currentWord: this.words[this.currentIndex - 1] || '',
            currentIndex: this.currentIndex,
            totalWords: totalWords,
            progress: progress
          })
        } catch (error) {
          console.error('Error in onProgress callback:', error)
        }

        if (this.currentIndex >= totalWords) {
          clearInterval(this.intervalId)
          this.intervalId = null
        }
      }
    }, updateInterval)
  }

  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      try {
        this.synth.pause()
      } catch (error) {
        console.error('Error pausing speech:', error)
      }
    }
  }

  resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      try {
        this.synth.resume()
      } catch (error) {
        console.error('Error resuming speech:', error)
        // If resume fails, try to restart from current position
        this.restartFromPosition()
      }
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel()
      } catch (error) {
        console.error('Error stopping speech:', error)
      }
    }
    
    this.isPlaying = false
    this.isPaused = false
    this.currentPosition = 0
    this.currentIndex = 0
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  restartFromPosition() {
    if (!this.currentText || this.currentIndex >= this.words.length) return

    const remainingText = this.words.slice(this.currentIndex).join(' ')
    if (remainingText) {
      this.speak(remainingText, {
        rate: this.utterance?.rate || 1.0,
        pitch: this.utterance?.pitch || 1.0,
        volume: this.utterance?.volume || 1.0,
        voice: this.utterance?.voice?.name
      })
    }
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentText: this.currentText,
      currentPosition: this.currentPosition,
      currentIndex: this.currentIndex,
      totalWords: this.words.length,
      isSupported: !!this.synth,
      voicesLoaded: this.voices.length > 0
    }
  }

  // Method to test if speech synthesis is working
  async test() {
    try {
      await this.speak('Speech synthesis is working correctly.', {
        rate: 1.0,
        pitch: 1.0,
        volume: 0.5
      })
      return true
    } catch (error) {
      console.error('Speech synthesis test failed:', error)
      return false
    }
  }
}

// Create and export singleton instance
export const ttsService = new TextToSpeechService()

// Export class for testing purposes
export { TextToSpeechService }