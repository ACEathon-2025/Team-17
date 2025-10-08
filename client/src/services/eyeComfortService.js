/**
 * Eye Comfort Service - 20-20-20 Rule Implementation
 * Every 20 minutes, look at something 20 feet away for 20 seconds
 */

const STORAGE_KEY = 'voxa-eye-comfort-settings'

class EyeComfortService {
  constructor() {
    this.timer = null
    this.breakTimer = null
    this.isActive = false
    this.isPaused = false
    this.timeRemaining = 0
    this.callbacks = {
      onBreakTime: null,
      onBreakComplete: null,
      onTick: null
    }
    this.settings = this.loadSettings()
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading eye comfort settings:', error)
    }

    return {
      enabled: true,
      interval: 20, // minutes
      breakDuration: 20, // seconds
      soundEnabled: true,
      autoStart: true
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings))
  }

  /**
   * Start the eye comfort timer
   */
  start(callbacks = {}) {
    if (this.isActive) return

    this.callbacks = { ...this.callbacks, ...callbacks }
    this.isActive = true
    this.isPaused = false
    this.timeRemaining = this.settings.interval * 60 // Convert to seconds

    this.startCountdown()
  }

  /**
   * Internal countdown logic
   */
  startCountdown() {
    this.timer = setInterval(() => {
      if (this.isPaused) return

      this.timeRemaining--

      // Notify tick callback
      if (this.callbacks.onTick) {
        this.callbacks.onTick(this.timeRemaining)
      }

      // Time for a break!
      if (this.timeRemaining <= 0) {
        this.triggerBreak()
      }
    }, 1000)
  }

  /**
   * Trigger eye break
   */
  triggerBreak() {
    this.clearTimer()

    if (this.callbacks.onBreakTime) {
      this.callbacks.onBreakTime()
    }

    // Play sound if enabled
    if (this.settings.soundEnabled) {
      this.playNotificationSound()
    }

    // Start break timer
    this.startBreakCountdown()
  }

  /**
   * Start break countdown (20 seconds)
   */
  startBreakCountdown() {
    let breakTimeRemaining = this.settings.breakDuration

    this.breakTimer = setInterval(() => {
      breakTimeRemaining--

      if (this.callbacks.onTick) {
        this.callbacks.onTick(breakTimeRemaining, true)
      }

      if (breakTimeRemaining <= 0) {
        this.completeBreak()
      }
    }, 1000)
  }

  /**
   * Complete the break and restart timer
   */
  completeBreak() {
    this.clearBreakTimer()

    if (this.callbacks.onBreakComplete) {
      this.callbacks.onBreakComplete()
    }

    // Restart the main timer
    if (this.isActive) {
      this.timeRemaining = this.settings.interval * 60
      this.startCountdown()
    }
  }

  /**
   * Pause the timer
   */
  pause() {
    this.isPaused = true
  }

  /**
   * Resume the timer
   */
  resume() {
    this.isPaused = false
  }

  /**
   * Stop the timer completely
   */
  stop() {
    this.isActive = false
    this.isPaused = false
    this.clearTimer()
    this.clearBreakTimer()
  }

  /**
   * Clear main timer
   */
  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  /**
   * Clear break timer
   */
  clearBreakTimer() {
    if (this.breakTimer) {
      clearInterval(this.breakTimer)
      this.breakTimer = null
    }
  }

  /**
   * Skip current break
   */
  skipBreak() {
    this.clearBreakTimer()
    this.completeBreak()
  }

  /**
   * Play notification sound
   */
  playNotificationSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error('Error playing notification sound:', error)
    }
  }

  /**
   * Get current settings
   */
  getSettings() {
    return { ...this.settings }
  }

  /**
   * Update specific setting
   */
  updateSetting(key, value) {
    this.settings[key] = value
    this.saveSettings(this.settings)
  }

  /**
   * Get formatted time remaining
   */
  getFormattedTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Get statistics
   */
  getStats() {
    const statsKey = 'voxa-eye-comfort-stats'
    try {
      const saved = localStorage.getItem(statsKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading eye comfort stats:', error)
    }

    return {
      totalBreaksTaken: 0,
      totalBreaksSkipped: 0,
      lastBreakDate: null
    }
  }

  /**
   * Record break taken
   */
  recordBreak(skipped = false) {
    const stats = this.getStats()
    
    if (skipped) {
      stats.totalBreaksSkipped++
    } else {
      stats.totalBreaksTaken++
    }
    
    stats.lastBreakDate = Date.now()
    localStorage.setItem('voxa-eye-comfort-stats', JSON.stringify(stats))
  }
}

// Export singleton instance
export const eyeComfortService = new EyeComfortService()
