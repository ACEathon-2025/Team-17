import React, { createContext, useContext, useState, useEffect } from 'react'

const BionicContext = createContext()

export const useBionic = () => {
  const context = useContext(BionicContext)
  if (!context) {
    throw new Error('useBionic must be used within BionicProvider')
  }
  return context
}

export const BionicProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false)
  const [intensity, setIntensity] = useState(0.5)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bionic-reading-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setEnabled(settings.enabled || false)
        setIntensity(settings.intensity || 0.5)
      } catch (e) {
        console.error('Error loading bionic settings:', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bionic-reading-settings', JSON.stringify({
      enabled,
      intensity
    }))
  }, [enabled, intensity])

  const toggleBionic = () => {
    setEnabled(prev => !prev)
  }

  const setIntensityLevel = (level) => {
    setIntensity(Math.max(0.3, Math.min(0.7, level)))
  }

  const value = {
    enabled,
    intensity,
    toggleBionic,
    setIntensity: setIntensityLevel
  }

  return (
    <BionicContext.Provider value={value}>
      {children}
    </BionicContext.Provider>
  )
}
