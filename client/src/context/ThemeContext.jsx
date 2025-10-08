// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Load theme preferences from localStorage
    const savedTheme = localStorage.getItem('theme')
    const savedContrast = localStorage.getItem('highContrast')

    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    if (savedContrast === 'true') {
      setHighContrast(true)
      document.documentElement.classList.add('high-contrast')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleHighContrast = () => {
    const newContrast = !highContrast
    setHighContrast(newContrast)

    if (newContrast) {
      document.documentElement.classList.add('high-contrast')
      localStorage.setItem('highContrast', 'true')
    } else {
      document.documentElement.classList.remove('high-contrast')
      localStorage.setItem('highContrast', 'false')
    }
  }

  const value = {
    isDark,
    highContrast,
    toggleTheme,
    toggleHighContrast,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
