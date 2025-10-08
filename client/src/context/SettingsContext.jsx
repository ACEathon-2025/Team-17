// src/context/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SettingsContext = createContext(null)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  
  // Return safe defaults if context is not available
  if (!context) {
    return {
      settings: {
        fontSize: 'medium',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        fontFamily: 'lexend',
        backgroundColor: 'default',
        textColor: 'default',
        highlightColor: 'blue',
        backgroundOverlay: false,
        dyslexiaFont: true,
        wordSpacing: 'normal',
        paragraphSpacing: 'normal',
        readingSpeed: 1.0,
        autoPlay: false,
        highlightReading: true,
        showProgress: true,
        preferredTranslationLanguage: 'es',
        autoTranslate: false,
        language: 'en'
      },
      saveSettings: () => console.warn('SettingsProvider not found'),
      resetSettings: () => console.warn('SettingsProvider not found'),
      applySettings: () => console.warn('SettingsProvider not found')
    }
  }
  
  return context
}

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    // Typography
    fontSize: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    fontFamily: 'lexend',

    // Visual
    backgroundColor: 'default',
    textColor: 'default',
    highlightColor: 'blue',
    backgroundOverlay: false,

    // Dyslexia-friendly
    dyslexiaFont: true,
    wordSpacing: 'normal',
    paragraphSpacing: 'normal',

    // Reading
    readingSpeed: 1.0,
    autoPlay: false,
    highlightReading: true,
    showProgress: true,

    // Translation
    preferredTranslationLanguage: 'es',
    autoTranslate: false,

    // Language
    language: 'en'
  })

  useEffect(() => {
    loadSettings()
  }, [user])

  useEffect(() => {
    applySettings()
  }, [settings])

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('voxa-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }

  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('voxa-settings', JSON.stringify(updatedSettings))
    
    // Emit custom event so other components can react
    window.dispatchEvent(new CustomEvent('settingsUpdated', { 
      detail: updatedSettings 
    }))
    
    return updatedSettings
  }

  const applySettings = () => {
    const root = document.documentElement

    // Font family
    const fontFamilyMap = {
      lexend: '"Lexend", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      opendyslexic: '"OpenDyslexic", "Comic Sans MS", cursive',
      arial: 'Arial, sans-serif',
      verdana: 'Verdana, sans-serif'
    }
    root.style.setProperty('--font-family', fontFamilyMap[settings.fontFamily] || fontFamilyMap.lexend)

    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px',
      xxl: '24px'
    }
    root.style.setProperty('--font-size', fontSizeMap[settings.fontSize] || '16px')

    // Line height
    const lineHeightMap = {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    }
    root.style.setProperty('--line-height', lineHeightMap[settings.lineHeight] || '1.5')

    // Letter spacing
    const letterSpacingMap = {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }
    root.style.setProperty('--letter-spacing', letterSpacingMap[settings.letterSpacing] || '0')

    // Word spacing
    const wordSpacingMap = {
      tight: '0',
      normal: '0.1em',
      wide: '0.2em',
      wider: '0.3em'
    }
    root.style.setProperty('--word-spacing', wordSpacingMap[settings.wordSpacing] || '0.1em')

    // Background overlay
    if (settings.backgroundOverlay) {
      root.classList.add('background-overlay')
    } else {
      root.classList.remove('background-overlay')
    }

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-friendly')
    } else {
      root.classList.remove('dyslexia-friendly')
    }
  }

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      fontFamily: 'lexend',
      backgroundColor: 'default',
      textColor: 'default',
      highlightColor: 'blue',
      backgroundOverlay: false,
      dyslexiaFont: true,
      wordSpacing: 'normal',
      paragraphSpacing: 'normal',
      readingSpeed: 1.0,
      autoPlay: false,
      highlightReading: true,
      showProgress: true,
      preferredTranslationLanguage: 'es',
      autoTranslate: false,
      language: 'en'
    }

    setSettings(defaultSettings)
    localStorage.setItem('voxa-settings', JSON.stringify(defaultSettings))
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('settingsUpdated', { 
      detail: defaultSettings 
    }))
    
    return defaultSettings
  }

  const value = {
    settings,
    saveSettings,
    resetSettings,
    applySettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
