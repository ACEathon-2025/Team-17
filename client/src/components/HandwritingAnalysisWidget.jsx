import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { analysisService } from '../services/analysisService'

const HandwritingAnalysisWidget = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStats()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadStats = async () => {
    try {
      const response = await analysisService.getStats(user.id)
      if (response.success) {
        setStats(response.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden cursor-pointer group"
      onClick={() => navigate('/handwriting-analysis')}
    >
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white game-font mb-1">
                AI Handwriting Analysis
              </h3>
              <p className="text-white/90 fun-font font-semibold text-lg">
                🎯 95-99% Accurate Detection
              </p>
            </div>
          </div>
          
          <motion.div
            className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl group-hover:bg-white/30 transition-all"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowRight className="h-6 w-6 text-white" />
          </motion.div>
        </div>

        {stats && stats.totalAnalyses > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl text-center">
              <div className="text-3xl font-black text-white game-font">
                {stats.totalAnalyses}
              </div>
              <div className="text-sm text-white/80 fun-font font-bold">
                Analyses
              </div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl text-center">
              <div className="text-3xl font-black text-white game-font">
                {Math.round(stats.averageConfidence * 100)}%
              </div>
              <div className="text-sm text-white/80 fun-font font-bold">
                Confidence
              </div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl text-center">
              <div className="text-3xl font-black text-white game-font">
                {stats.latestAnalysis?.riskLevel === 'Low' ? '✅' :
                 stats.latestAnalysis?.riskLevel === 'Medium' ? '⚠️' : '🔴'}
              </div>
              <div className="text-sm text-white/80 fun-font font-bold">
                Latest
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-xl font-black text-white game-font">
                Try It Now!
              </span>
            </div>
            <ul className="space-y-2 text-white/90 fun-font font-bold text-base">
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Upload handwriting sample</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Get instant AI analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Receive recommendations</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default HandwritingAnalysisWidget
