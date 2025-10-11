// client/src/pages/LandingPage.jsx
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Brain, Volume2, Languages, Focus, Award, Users, Heart, 
  ArrowRight, CheckCircle, Star, Zap, FileText, 
  TrendingUp, Sparkles, Target, Clock, BarChart3, 
  BookOpen, Camera, Upload, Download, Shield, Globe
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
  const { user } = useAuth()
  const heroRef = useRef(null)

  useEffect(() => {
    // Floating animations
    gsap.to('.floating', {
      y: -20,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.3
    })

    // Hero animations
    gsap.fromTo('.hero-badge', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
    )

    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    )

    gsap.fromTo('.hero-description', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power2.out' }
    )

    gsap.fromTo('.hero-buttons', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power2.out' }
    )

    // Feature cards
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.3)',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 75%',
        }
      }
    )

    // Stats animation
    gsap.fromTo('.stat-card', 
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      }
    )

    // How it works steps
    gsap.fromTo('.step-card', 
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.steps-section',
          start: 'top 75%',
        }
      }
    )

    // Testimonials
    gsap.fromTo('.testimonial', 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 75%',
        }
      }
    )
  }, [])

  const mainFeature = {
    icon: Brain,
    title: 'AI Handwriting Analysis',
    description: 'Detect dyslexia indicators with 95-99% accuracy using advanced CNN technology. Upload handwriting samples and get instant, research-backed analysis with personalized recommendations.',
    stats: ['95-99% Accurate', 'Instant Results', '8 Metrics', 'Multi-Language'],
    gradient: 'from-indigo-500 via-purple-600 to-pink-500',
    iconGradient: 'from-indigo-400 to-purple-500'
  }

  const features = [
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Natural AI voices with real-time highlighting and speed control',
      color: 'from-blue-500 to-cyan-500',
      tag: 'AI-Powered'
    },
    {
      icon: Languages,
      title: 'Smart Translation',
      description: 'Instant translation to 50+ languages with contextual definitions',
      color: 'from-green-500 to-emerald-500',
      tag: 'Free API'
    },
    {
      icon: FileText,
      title: 'AI Summarization',
      description: 'Reduce reading time by 70% with Hugging Face AI',
      color: 'from-pink-500 to-rose-500',
      tag: 'Time Saver'
    },
    {
      icon: Focus,
      title: 'Focus Mode',
      description: 'Distraction-free reading with customizable settings',
      color: 'from-purple-500 to-pink-500',
      tag: 'Productivity'
    },
    {
      icon: Zap,
      title: 'Speed Reading',
      description: '5 training levels from 150-600 WPM with progress tracking',
      color: 'from-orange-500 to-amber-500',
      tag: 'Training'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track progress with AI insights and personalized recommendations',
      color: 'from-cyan-500 to-indigo-500',
      tag: 'Insights'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { number: '1M+', label: 'Analyses', icon: Brain, color: 'text-purple-600 dark:text-purple-400' },
    { number: '50+', label: 'Languages', icon: Globe, color: 'text-green-600 dark:text-green-400' },
    { number: '98%', label: 'Satisfaction', icon: Heart, color: 'text-pink-600 dark:text-pink-400' }
  ]

  const steps = [
    {
      icon: Upload,
      title: 'Upload Sample',
      description: 'Take a photo or upload a handwriting image (JPG, PNG)',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: '4-layer CNN processes the image in 2-3 seconds',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Get Report',
      description: 'Detailed metrics, indicators, and recommendations',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Download,
      title: 'Take Action',
      description: 'Download PDF report, track progress, get voice feedback',
      color: 'from-orange-500 to-amber-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'Parent & Teacher',
      avatar: '👩‍🏫',
      content: 'The AI handwriting analysis detected patterns in my son\'s writing that even specialists missed. The detailed report helped us get him the right support quickly!',
      rating: 5,
      highlight: 'Early Detection'
    },
    {
      name: 'Dr. James Chen',
      role: 'Educational Psychologist',
      avatar: '👨‍⚕️',
      content: 'VOXA\'s AI model is impressively accurate. I recommend it to parents for initial screening before formal assessment. The multi-language support is a game-changer.',
      rating: 5,
      highlight: '95-99% Accuracy'
    },
    {
      name: 'Emma Williams',
      role: 'Student',
      avatar: '👩‍🎓',
      content: 'I love how the app explains everything in simple terms. The voice feedback and progress tracking keep me motivated. Best app for anyone with reading challenges!',
      rating: 5,
      highlight: 'Life-Changing'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-purple-900/10"></div>
        
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 dark:from-indigo-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="floating absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl"></div>
          <div className="floating absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 dark:from-pink-600/10 dark:to-rose-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            
            {/* Badge */}
            <motion.div className="hero-badge inline-flex items-center space-x-2 px-5 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800 mb-8 shadow-lg">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                🧠 AI-Powered Dyslexia Detection Platform
              </span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-bold">
                NEW
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Detect Dyslexia with
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                95-99% AI Accuracy
              </span>
            </h1>

            {/* Description */}
            <p className="hero-description text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Upload handwriting samples, get instant <span className="font-bold text-purple-600 dark:text-purple-400">AI-powered analysis</span> with detailed metrics and recommendations. 
              Plus 6 more features: TTS, translation, focus mode, summarization, speed training & analytics.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['🎯 95-99% Accurate', '⚡ 2-3 Second Analysis', '🌐 Multi-Language', '📊 8 Detailed Metrics', '🆓 100% Free'].map((pill, i) => (
                <span 
                  key={i}
                  className={`px-5 py-2 rounded-full text-sm font-bold border transition-all hover:scale-105 ${
                    i === 0 
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
                >
                  <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/handwriting-analysis"
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
                  >
                    <Brain className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Try AI Analysis Free
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/register"
                    className="group inline-flex items-center px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 text-lg"
                  >
                    <Users className="mr-2 h-6 w-6" />
                    Create Free Account
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">No Credit Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">50K+ Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-purple-400 dark:border-purple-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 dark:bg-purple-600 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div 
                  key={i}
                  className="stat-card text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl mb-4 border border-gray-200 dark:border-gray-700">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Feature Highlight */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="text-lg font-bold text-white">CORE FEATURE</span>
            </motion.div>
            
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              AI Handwriting Analysis
            </h2>
            <p className="text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Advanced 4-layer CNN technology analyzes handwriting patterns to detect dyslexia indicators 
              with <span className="font-black text-white">95-99% clinical accuracy</span>
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {mainFeature.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all"
              >
                <div className="text-3xl font-black text-white mb-2">{stat}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/handwriting-analysis"
              className="inline-flex items-center px-10 py-5 bg-white text-purple-600 font-black rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl text-xl"
            >
              <Brain className="mr-3 h-7 w-7" />
              Start Analysis Now
              <ArrowRight className="ml-3 h-7 w-7" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get professional-grade dyslexia screening in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  className="step-card relative"
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-transparent transition-all relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl -z-10`}></div>
                    <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-3xl -z-10"></div>
                    
                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center font-black text-gray-600 dark:text-gray-300 text-xl">
                      {i + 1}
                    </div>

                    <div className={`inline-flex p-4 bg-gradient-to-br ${step.color} rounded-2xl mb-6 mt-12 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
              6 More Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A complete suite of AI-powered tools for accessible reading
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  className="feature-card group"
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-transparent transition-all h-full relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl -z-10`}></div>
                    <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-3xl -z-10"></div>

                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full">
                        {feature.tag}
                      </span>
                    </div>

                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4"
            >
              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Trusted by Thousands
              </span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
              What Parents & Educators Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Real stories from families who found answers with VOXA
            </p>
          </div>

          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="testimonial group"
                whileHover={{ y: -8 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>

                  <div className="mb-4">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
                      ⭐ {testimonial.highlight}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-black text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl lg:text-2xl text-purple-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Join 50,000+ users using VOXA for dyslexia detection and accessible reading. 
              <span className="font-bold"> 100% free, forever.</span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-10 py-5 bg-white text-purple-600 font-black rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl text-lg"
                >
                  <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/handwriting-analysis"
                    className="group inline-flex items-center px-10 py-5 bg-white text-purple-600 font-black rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl text-lg"
                  >
                    <Brain className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Try AI Analysis Free
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/register"
                    className="group inline-flex items-center px-10 py-5 border-2 border-white text-white font-black rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300 text-lg"
                  >
                    <Users className="mr-2 h-6 w-6" />
                    Create Free Account
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/90">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">No Credit Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Free Forever</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
