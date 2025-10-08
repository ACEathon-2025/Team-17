import React, { createContext, useContext, useState, useEffect } from 'react'
import { eyeComfortService } from '../services/eyeComfortService'

const EyeComfortContext = createContext()

export const useEyeComfort = () => {
  const context = useContext(EyeComfortContext)
  if (!context) {
    throw new Error('useEyeComfort must be used within EyeComfortProvider')
  }
  return context
}

export const EyeComfortProvider = ({ children }) => {
  const [settings, setSettings] = useState(eyeComfortService.getSettings())
  const [isBreakTime, setIsBreakTime] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Auto-start if enabled
    if (settings.enabled && settings.autoStart) {
      startTimer()
    }

    return () => {
      eyeComfortService.stop()
    }
  }, [])

  const startTimer = () => {
    eyeComfortService.start({
      onBreakTime: () => {
        setIsBreakTime(true)
      },
      onBreakComplete: () => {
        setIsBreakTime(false)
        eyeComfortService.recordBreak(false)
      },
      onTick: (time, isBreak) => {
        setTimeRemaining(time)
      }
    })
    setIsActive(true)
  }

  const stopTimer = () => {
    eyeComfortService.stop()
    setIsActive(false)
    setIsBreakTime(false)
  }

  const skipBreak = () => {
    eyeComfortService.skipBreak()
    eyeComfortService.recordBreak(true)
    setIsBreakTime(false)
  }

  const updateSettings = (newSettings) => {
    eyeComfortService.saveSettings(newSettings)
    setSettings(eyeComfortService.getSettings())
  }

  const value = {
    settings,
    isBreakTime,
    timeRemaining,
    isActive,
    startTimer,
    stopTimer,
    skipBreak,
    updateSettings,
    getFormattedTime: eyeComfortService.getFormattedTime.bind(eyeComfortService),
    getStats: eyeComfortService.getStats.bind(eyeComfortService)
  }

  return (
    <EyeComfortContext.Provider value={value}>
      {children}
    </EyeComfortContext.Provider>
  )
}
