import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Menu, X, Sun, Moon, Settings, LogOut, User, 
  Volume2, Languages, Focus, FileText, Brain, Zap, Bookmark, 
  Eye, Target, ChevronDown, Sparkles, LayoutDashboard, Upload, Mic
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useEyeComfort } from '../context/EyeComfortContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { isActive, timeRemaining, getFormattedTime } = useEyeComfort()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFeaturesDropdown(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const features = [
    {
      name: 'Text to Speech',
      href: '/text-to-speech',
      icon: Volume2,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Translation',
      href: '/translation',
      icon: Languages,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Focus Mode',
      href: '/focus-mode',
      icon: Focus,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'AI Summarize',
      href: '/summarize',
      icon: FileText,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Quiz',
      href: '/quiz',
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Speed Reading',
      href: '/speed-reading',
      icon: Zap,
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      name: 'Collections',
      href: '/collections',
      icon: Bookmark,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      name: 'Goals',
      href: '/goals',
      icon: Target,
      gradient: 'from-green-500 to-teal-500',
    },
    {
      name: 'Import',
      href: '/import',
      icon: Upload,
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      name: 'Voice',
      href: '/voice-commands',
      icon: Mic,
      gradient: 'from-purple-500 to-pink-500',
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <nav className="bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-color)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-br from-primary-500 via-secondary-500 to-purple-600 rounded-xl shadow-lg"
            >
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dyslexia-text">
                VOXA
              </span>
              <span className="text-[9px] text-[var(--text-secondary)] -mt-1 tracking-wider hidden sm:block">
                AI Reading Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-2">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium dyslexia-text transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {/* Features Dropdown - CENTERED & FULLY VISIBLE */}
              <div 
                className="relative" 
                ref={dropdownRef}
                onMouseEnter={() => setShowFeaturesDropdown(true)}
                onMouseLeave={() => setShowFeaturesDropdown(false)}
              >
                <button
                  onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                  className="px-4 py-2 rounded-xl text-sm font-medium dyslexia-text transition-all duration-200 flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] group"
                >
                  <Sparkles className="h-4 w-4 group-hover:text-primary-500 transition-colors" />
                  <span>Features</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showFeaturesDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Horizontal Features Dropdown - IMPROVED CENTERING */}
                <AnimatePresence>
                  {showFeaturesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="fixed left-1/2 -translate-x-1/2 mt-2 w-[85vw] max-w-4xl bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-[100]"
                      style={{
                        top: '4rem'
                      }}
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-5 w-5 text-white" />
                          <h3 className="text-white font-bold text-lg dyslexia-text">
                            Explore Features
                          </h3>
                        </div>
                        <span className="text-white/80 text-xs dyslexia-text">
                          10 AI-powered tools
                        </span>
                      </div>

                      {/* Horizontal Features Grid - 5 columns */}
                      <div className="grid grid-cols-5 gap-3 p-5">
                        {features.map((feature) => {
                          const Icon = feature.icon
                          const isActive = location.pathname === feature.href

                          return (
                            <Link
                              key={feature.href}
                              to={feature.href}
                              onClick={() => setShowFeaturesDropdown(false)}
                              className={`group p-4 rounded-xl transition-all duration-200 flex flex-col items-center text-center space-y-2 ${
                                isActive
                                  ? 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-500 shadow-lg'
                                  : 'hover:bg-[var(--bg-secondary)] border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-700'
                              }`}
                            >
                              <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl group-hover:scale-110 transition-transform shadow-md`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="text-xs font-semibold text-[var(--text-primary)] dyslexia-text leading-tight">
                                {feature.name}
                              </span>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Quick Stats Footer */}
                      <div className="bg-[var(--bg-secondary)] px-6 py-3 border-t border-[var(--border-color)] flex items-center justify-between">
                        <span className="text-xs text-[var(--text-secondary)] dyslexia-text">
                          💡 Click any feature to get started
                        </span>
                        <button
                          onClick={() => setShowFeaturesDropdown(false)}
                          className="text-xs text-primary-600 hover:text-primary-700 dyslexia-text font-medium"
                        >
                          Close ✕
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings Link */}
              <Link
                to="/settings"
                className={`px-4 py-2 rounded-xl text-sm font-medium dyslexia-text transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === '/settings'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Settings</span>
              </Link>
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Eye Comfort Timer Indicator */}
            {user && isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-700 dark:text-blue-300 dyslexia-text font-semibold">
                  {getFormattedTime(timeRemaining)}
                </span>
              </motion.div>
            )}

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gradient-to-br hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600" />
                )}
              </motion.div>
            </motion.button>

            {/* User menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg"
                >
                  <User className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm dyslexia-text truncate">
                              {user.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-white/70 text-xs dyslexia-text truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors dyslexia-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-3 text-primary-600" />
                          Dashboard
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors dyslexia-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-blue-600" />
                          Settings
                        </Link>
                        <Link
                          to="/goals"
                          className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors dyslexia-text"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Target className="h-4 w-4 mr-3 text-green-600" />
                          My Goals
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-[var(--border-color)] p-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors dyslexia-text"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:text-primary-600 transition-colors dyslexia-text"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg dyslexia-text"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-[var(--border-color)]"
            >
              <div className="flex flex-col space-y-2">
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium dyslexia-text transition-all ${
                    location.pathname === '/dashboard'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                {/* Features */}
                <div className="px-2 py-2 text-xs font-semibold text-[var(--text-secondary)] dyslexia-text uppercase">
                  Features
                </div>

                {/* Mobile Features Grid - 2 columns */}
                <div className="grid grid-cols-2 gap-2 px-2">
                  {features.map((feature) => {
                    const Icon = feature.icon
                    const isActive = location.pathname === feature.href

                    return (
                      <Link
                        key={feature.href}
                        to={feature.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-500'
                            : 'bg-[var(--bg-secondary)] hover:border-2 hover:border-primary-300'
                        }`}
                      >
                        <div className={`p-2.5 bg-gradient-to-br ${feature.gradient} rounded-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-[var(--text-primary)] dyslexia-text text-center">
                          {feature.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                {/* Settings */}
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium dyslexia-text transition-all hover:bg-[var(--bg-secondary)] mt-2"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Settings</span>
                </Link>

                {/* Mobile Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium dyslexia-text transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
