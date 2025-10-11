import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, BookOpen, Volume2, Languages, Focus, FileText, Brain,
  Zap, Settings, LogOut, Menu, X, ChevronDown, Users, User,
  Trophy, Gamepad2, Moon, Sun, Sparkles, Target, Eye
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { communityService } from '../services/communityService'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Load user profile
  useEffect(() => {
    if (user) {
      const profile = communityService.getCurrentUser(user.email)
      setUserProfile(profile)
    }
  }, [user])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  const features = [
    {
      name: 'AI Handwriting Analysis',
      description: '🎯 Detect dyslexia 95-99% accurate',
      href: '/handwriting-analysis',
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-500',
      featured: true // NEW - Mark as MVP feature
    },
    {
      name: 'Text to Speech',
      description: 'Convert text to natural speech',
      href: '/text-to-speech',
      icon: Volume2,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Translation',
      description: 'Translate to any language',
      href: '/translation',
      icon: Languages,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Focus Mode',
      description: 'Distraction-free reading',
      href: '/focus-mode',
      icon: Focus,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Summarize',
      description: 'AI-powered summaries',
      href: '/summarize',
      icon: FileText,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Quiz',
      description: 'Test comprehension',
      href: '/quiz',
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Speed Reading',
      description: 'Improve reading speed',
      href: '/speed-reading',
      icon: Zap,
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      name: 'Games',
      description: 'Fun reading games',
      href: '/games',
      icon: Gamepad2,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Goals',
      description: 'Track progress',
      href: '/goals',
      icon: Target,
      gradient: 'from-teal-500 to-green-500'
    },
    {
      name: 'Eye Comfort',
      description: 'Protect your eyes',
      href: '/settings',
      icon: Eye,
      gradient: 'from-blue-400 to-indigo-500'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
              </motion.div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent game-font">
                  VOXA
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 fun-font -mt-1">
                  Reading Assistant
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`px-5 py-2.5 rounded-xl font-bold fun-font transition-all ${
                  isActive('/dashboard')
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
              </Link>

              {/* Features Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFeaturesMenu(!showFeaturesMenu)}
                  onMouseEnter={() => setShowFeaturesMenu(true)}
                  className={`px-5 py-2.5 rounded-xl font-bold fun-font transition-all flex items-center space-x-2 ${
                    showFeaturesMenu
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Features</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFeaturesMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Features Mega Menu */}
                <AnimatePresence>
                  {showFeaturesMenu && (
                    <>
                      <div 
                        className="absolute left-1/2 transform -translate-x-1/2 w-full h-4 top-full z-[90]"
                        onMouseEnter={() => setShowFeaturesMenu(true)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setShowFeaturesMenu(true)}
                        onMouseLeave={() => setShowFeaturesMenu(false)}
                        className="fixed left-1/2 transform -translate-x-1/2 w-[90vw] max-w-5xl z-[100]"
                        style={{ top: '5.5rem' }}
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 p-8">
                          <div className="mb-6">
                            <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-2">
                              ✨ All Features
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 fun-font">
                              Choose from our powerful reading tools
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            {features.map((feature) => {
                              const Icon = feature.icon
                              return (
                                <Link
                                  key={feature.href}
                                  to={feature.href}
                                  onClick={() => setShowFeaturesMenu(false)}
                                  className={`group p-5 rounded-2xl transition-all border-2 ${
                                    feature.featured
                                      ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-300 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                                      : 'hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                                  }`}
                                >
                                  {feature.featured && (
                                    <div className="mb-2 inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-black rounded-full">
                                      🎯 MVP FEATURE
                                    </div>
                                  )}
                                  <div className={`inline-flex p-3 bg-gradient-to-r ${feature.gradient} rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-6 w-6 text-white" />
                                  </div>
                                  <h4 className="font-bold text-gray-800 dark:text-white fun-font text-lg mb-1">
                                    {feature.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 fun-font">
                                    {feature.description}
                                  </p>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Community */}
              <Link
                to="/community"
                className={`px-5 py-2.5 rounded-xl font-bold fun-font transition-all ${
                  isActive('/community')
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Community</span>
                </div>
              </Link>

              {/* Leaderboard */}
              <Link
                to="/leaderboard"
                className={`px-5 py-2.5 rounded-xl font-bold fun-font transition-all ${
                  isActive('/leaderboard')
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </div>
              </Link>
            </div>

            {/* Right Side - Theme Toggle & User Menu */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-purple-600" />
                )}
              </motion.button>

              {/* User Menu - Desktop */}
              {user && (
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                  >
                    {userProfile && (
                      <span className="text-2xl">{userProfile.avatar}</span>
                    )}
                    <div className="text-left">
                      <div className="text-sm font-bold text-white game-font leading-tight">
                        {userProfile?.name || user.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-white/80 fun-font flex items-center space-x-1">
                        <Trophy className="h-3 w-3" />
                        <span>{userProfile?.reputation || 0}</span>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/30 overflow-hidden z-50"
                        >
                          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500">
                            <div className="flex items-center space-x-4">
                              <span className="text-5xl">{userProfile?.avatar}</span>
                              <div className="flex-1">
                                <div className="text-xl font-black text-white game-font">
                                  {userProfile?.name}
                                </div>
                                <div className="text-sm text-white/80 fun-font">
                                  {user.email}
                                </div>
                                <div className="mt-2 flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Trophy className="h-4 w-4 text-yellow-300" />
                                    <span className="text-sm font-bold text-white">
                                      {userProfile?.reputation}
                                    </span>
                                  </div>
                                  <div className="text-sm text-white/80">
                                    Level {Math.floor((userProfile?.reputation || 0) / 100) + 1}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-3">
                            <Link
                              to="/profile"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-2xl transition-all font-bold fun-font"
                            >
                              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <div className="flex-1">
                                <div>My Profile</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Customize avatar & settings
                                </div>
                              </div>
                            </Link>

                            <Link
                              to="/goals"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all font-bold fun-font"
                            >
                              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <div className="flex-1">
                                <div>My Goals</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Track reading progress
                                </div>
                              </div>
                            </Link>

                            <Link
                              to="/settings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all font-bold fun-font"
                            >
                              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              <div className="flex-1">
                                <div>Settings</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Preferences & accessibility
                                </div>
                              </div>
                            </Link>

                            <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

                            <button
                              onClick={() => {
                                handleLogout()
                                setShowUserMenu(false)
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all font-bold fun-font"
                            >
                              <LogOut className="h-5 w-5" />
                              <div className="flex-1 text-left">
                                <div>Logout</div>
                                <div className="text-xs text-red-500 dark:text-red-400">
                                  See you soon!
                                </div>
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
                {user && userProfile && (
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{userProfile.avatar}</span>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-white game-font">
                          {userProfile.name}
                        </div>
                        <div className="flex items-center space-x-2 text-white/80 text-sm">
                          <Trophy className="h-4 w-4" />
                          <span>{userProfile.reputation} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all font-bold fun-font"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/community"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all font-bold fun-font"
                >
                  <Users className="h-5 w-5" />
                  <span>Community</span>
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all font-bold fun-font"
                >
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Leaderboard</span>
                </Link>

                <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-4 py-2 uppercase tracking-wider">
                  Features
                </div>

                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Link
                      key={feature.href}
                      to={feature.href}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all font-bold fun-font"
                    >
                      <div className={`p-2 bg-gradient-to-r ${feature.gradient} rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span>{feature.name}</span>
                          {feature.featured && (
                            <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-black">
                              MVP
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}

                {user && (
                  <>
                    <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
                    
                    <Link
                      to="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all font-bold fun-font"
                    >
                      <User className="h-5 w-5" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all font-bold fun-font"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold fun-font"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-20" />
    </>
  )
}

export default Navbar
