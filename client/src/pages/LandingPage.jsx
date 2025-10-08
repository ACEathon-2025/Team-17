// client/src/pages/LandingPage.jsx
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  BookOpen, Volume2, Languages, Focus, Award, Users, Heart, 
  ArrowRight, CheckCircle, Star, Play, Zap, Brain, FileText, 
  TrendingUp, Sparkles, Target, Clock, BarChart3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
  const { user } = useAuth()
  const heroRef = useRef(null)

  useEffect(() => {
    // Floating animation for hero elements
    gsap.to('.floating', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.2
    })

    // Hero text animations
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )

    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out' }
    )

    gsap.fromTo('.hero-buttons', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power2.out' }
    )

    // Feature cards animation
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 80, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 70%',
        }
      }
    )

    // Stats counter animation
    gsap.fromTo('.stat-number', 
      { innerText: 0 },
      {
        innerText: (i, target) => target.getAttribute('data-value'),
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      }
    )

    // Testimonials animation
    gsap.fromTo('.testimonial-card', 
      { opacity: 0, x: -50, rotateY: -15 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 70%',
        }
      }
    )
  }, [])

  const features = [
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Natural AI voices with speed control, real-time highlighting, and word-by-word dictionary lookup.',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      iconBg: 'from-blue-400 to-cyan-400',
      tag: 'AI-Powered'
    },
    {
      icon: Languages,
      title: 'Smart Translation',
      description: 'Instant translation to 50+ languages with click-to-define in both source and target languages.',
      gradient: 'from-green-500 via-emerald-600 to-teal-500',
      iconBg: 'from-green-400 to-emerald-400',
      tag: 'Free API'
    },
    {
      icon: Focus,
      title: 'Focus Mode',
      description: 'Distraction-free reading with customizable speed, pause-to-lookup, and visual progress tracking.',
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      iconBg: 'from-purple-400 to-pink-400',
      tag: 'Productivity'
    },
    {
      icon: FileText,
      title: 'AI Summarization',
      description: 'Reduce reading time by 70-80% with Hugging Face AI. Three length options, instant insights.',
      gradient: 'from-pink-500 via-rose-600 to-red-500',
      iconBg: 'from-pink-400 to-rose-400',
      tag: 'Time Saver'
    },
    {
      icon: Brain,
      title: 'Comprehension Quiz',
      description: 'AI-generated questions with instant feedback, score tracking, and randomized content every time.',
      gradient: 'from-indigo-500 via-indigo-600 to-purple-500',
      iconBg: 'from-indigo-400 to-purple-400',
      tag: 'Learning'
    },
    {
      icon: Zap,
      title: 'Speed Reading',
      description: '5 training levels (150-600 WPM) with comprehension checks, progress charts, and personalized tips.',
      gradient: 'from-orange-500 via-amber-600 to-yellow-500',
      iconBg: 'from-orange-400 to-amber-400',
      tag: 'Training'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'AI insights, weekly charts, reading streaks, and personalized recommendations based on your behavior.',
      gradient: 'from-cyan-500 via-blue-600 to-indigo-500',
      iconBg: 'from-cyan-400 to-blue-400',
      tag: 'Insights'
    }
  ]

  const benefits = [
    { icon: CheckCircle, text: 'OpenDyslexic & Lexend fonts', color: 'text-green-500' },
    { icon: CheckCircle, text: 'Click any word for instant definitions', color: 'text-blue-500' },
    { icon: CheckCircle, text: 'Real-time sentiment analysis', color: 'text-purple-500' },
    { icon: CheckCircle, text: 'Cross-feature integration', color: 'text-pink-500' },
    { icon: CheckCircle, text: 'Dark mode & high contrast themes', color: 'text-orange-500' },
    { icon: CheckCircle, text: 'Progress tracking & achievements', color: 'text-cyan-500' },
    { icon: CheckCircle, text: '100% free - No subscriptions', color: 'text-green-500' },
    { icon: CheckCircle, text: 'WCAG 2.1 AA compliant', color: 'text-indigo-500' }
  ]

  const stats = [
    { number: '50,000', label: 'Active Users', suffix: '+', icon: Users, color: 'text-blue-500' },
    { number: '1,000,000', label: 'Texts Read', suffix: '+', icon: BookOpen, color: 'text-green-500' },
    { number: '50', label: 'Languages', suffix: '+', icon: Languages, color: 'text-purple-500' },
    { number: '98', label: 'Satisfaction', suffix: '%', icon: Heart, color: 'text-pink-500' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      image: '👩‍🎓',
      content: 'VOXA transformed my reading experience! The AI summarization saves hours, and the speed reading trainer improved my WPM by 150%.',
      rating: 5,
      highlight: 'Speed Reading'
    },
    {
      name: 'Michael Chen',
      role: 'Teacher',
      image: '👨‍🏫',
      content: 'I recommend VOXA to all my students with reading difficulties. The comprehension quizzes and analytics help track real progress.',
      rating: 5,
      highlight: 'Quiz & Analytics'
    },
    {
      name: 'Emma Williams',
      role: 'Parent',
      image: '👩‍💼',
      content: 'My daughter loves the gamification! Reading streaks, achievements, and the focus mode keep her engaged for hours.',
      rating: 5,
      highlight: 'Focus Mode'
    }
  ]

  const aiFeatures = [
    { icon: Brain, title: 'Dictionary AI', desc: 'Click any word, get instant definitions in 130+ languages' },
    { icon: Heart, title: 'Sentiment Analysis', desc: 'Understand emotional tone with AI-powered detection' },
    { icon: Sparkles, title: 'Smart Summarization', desc: 'Hugging Face AI reduces reading time by 70-80%' },
    { icon: Target, title: 'Quiz Generation', desc: 'AI creates comprehension questions from any text' }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Enhanced */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="floating absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="floating absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800 mb-6"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                AI-Powered Reading Platform
              </span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full">
                NEW
              </span>
            </motion.div>

            <motion.h1 
              className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold dyslexia-text text-[var(--text-primary)] mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Reading Made
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simple & Powerful
              </span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-xl lg:text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto dyslexia-text leading-relaxed"
            >
              7 AI-powered features designed for dyslexia and reading difficulties. 
              <span className="font-semibold text-[var(--text-primary)]"> Text-to-speech, translation, focus mode, summarization, quizzes, speed training, and analytics.</span> All free forever.
            </motion.p>
            
            {/* Feature Pills */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {['AI Summarization', 'Speed Reading', 'Smart Quizzes', '50+ Languages'].map((pill, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-sm font-medium text-[var(--text-primary)] border border-gray-200 dark:border-gray-700"
                >
                  ✨ {pill}
                </span>
              ))}
            </motion.div>

            <motion.div 
              className="hero-buttons flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 dyslexia-text"
                >
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 dyslexia-text"
                  >
                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Start Free Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/text-to-speech"
                    className="group inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-[var(--text-primary)] font-semibold rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 dyslexia-text"
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Try Demo
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="stats-section py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl mb-4 border border-gray-200 dark:border-gray-700">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="stat-number text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 dyslexia-text" data-value={stat.number.replace(/,/g, '')}>
                    0{stat.suffix}
                  </div>
                  <div className="text-[var(--text-secondary)] font-medium dyslexia-text">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced Grid */}
      <section className="features-section py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4"
            >
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                7 Powerful Features
              </span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold dyslexia-text text-[var(--text-primary)] mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto dyslexia-text">
              A complete AI-powered ecosystem for accessible, engaging, and effective reading
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div 
                  key={index}
                  className="feature-card group relative"
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-gray-100 dark:border-gray-700 hover:border-transparent transition-all duration-300 h-full overflow-hidden">
                    {/* Gradient Border on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl -z-10`}></div>
                    <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-3xl -z-10"></div>
                    
                    {/* Tag */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                        {feature.tag}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 dyslexia-text">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] dyslexia-text leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold dyslexia-text mb-4">
              Powered by AI & Machine Learning
            </h2>
            <p className="text-xl text-purple-100 dyslexia-text">
              Advanced algorithms that adapt to your reading needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Icon className="h-10 w-10 text-white mb-4" />
                  <h3 className="text-lg font-bold mb-2 dyslexia-text">{feature.title}</h3>
                  <p className="text-purple-100 text-sm dyslexia-text">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Two Columns */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
              >
                <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Accessibility First
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold dyslexia-text text-[var(--text-primary)] mb-6">
                Built for Everyone
              </h2>
              <p className="text-xl text-[var(--text-secondary)] mb-8 dyslexia-text leading-relaxed">
                VOXA isn't just accessible – it's designed from the ground up with dyslexia-friendly features, 
                high contrast themes, and AI that adapts to your unique needs.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Icon className={`h-5 w-5 ${benefit.color} flex-shrink-0`} />
                      <span className="text-[var(--text-primary)] dyslexia-text text-sm">
                        {benefit.text}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-12 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800">
                {/* Floating Icons */}
                <div className="floating absolute top-10 left-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <div className="floating absolute top-20 right-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <div className="floating absolute bottom-10 left-1/4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>

                {/* Center Icon */}
                <div className="flex items-center justify-center">
                  <div className="p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full">
                    <Heart className="h-16 w-16 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-center mt-8 mb-4 text-[var(--text-primary)] dyslexia-text">
                  Designed with Love
                </h3>
                <p className="text-center text-[var(--text-secondary)] dyslexia-text leading-relaxed">
                  Every pixel, every feature, every interaction is crafted with input from users, 
                  educators, and accessibility experts.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="testimonials-section py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4"
            >
              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Loved by Thousands
              </span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold dyslexia-text text-[var(--text-primary)] mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto dyslexia-text">
              Join 50,000+ satisfied users who transformed their reading experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card group"
                whileHover={{ y: -10 }}
              >
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 h-full">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -right-4 text-6xl text-purple-200 dark:text-purple-900 font-serif">"</div>

                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-[var(--text-primary)] mb-6 dyslexia-text leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>

                  {/* Highlight Tag */}
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                      ⭐ {testimonial.highlight}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] dyslexia-text">
                        {testimonial.name}
                      </div>
                      <div className="text-[var(--text-secondary)] dyslexia-text text-sm">
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

      {/* CTA Section - Enhanced */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Start Your Journey Today
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 dyslexia-text">
              Ready to Transform Your Reading?
            </h2>
            <p className="text-xl lg:text-2xl text-purple-100 mb-10 dyslexia-text leading-relaxed max-w-3xl mx-auto">
              Join thousands using VOXA to read faster, comprehend better, and enjoy every word.
              <span className="font-semibold"> Completely free, forever.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-10 py-5 bg-white text-purple-600 font-bold rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl dyslexia-text text-lg"
                >
                  <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center px-10 py-5 bg-white text-purple-600 font-bold rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl dyslexia-text text-lg"
                  >
                    <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                    Start Free Today
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/text-to-speech"
                    className="group inline-flex items-center px-10 py-5 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300 dyslexia-text text-lg"
                  >
                    <Play className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Try Demo
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="dyslexia-text">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="dyslexia-text">Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="dyslexia-text">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
