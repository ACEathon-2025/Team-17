import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const AnalysisVisualizer = ({ imageUrl, detailedMetrics }) => {
  const imgRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!imageUrl) return

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const cleanBaseUrl = baseUrl.replace('/api', '')
    const fullImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${cleanBaseUrl}${imageUrl}`
    
    console.log('🖼️ Loading image from:', fullImageUrl)

    // Preload image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = fullImageUrl

    img.onload = () => {
      console.log('✅ Image loaded successfully')
      setIsLoading(false)
      setImageError(false)
    }

    img.onerror = () => {
      console.error('❌ Failed to load image:', fullImageUrl)
      setIsLoading(false)
      setImageError(true)
    }
  }, [imageUrl])

  if (imageError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-8 text-center">
        <p className="text-red-700 dark:text-red-300 font-bold">
          Failed to load image
        </p>
      </div>
    )
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const cleanBaseUrl = baseUrl.replace('/api', '')
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${cleanBaseUrl}${imageUrl}`

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border-2 border-purple-200 dark:border-purple-800">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <div className="text-white font-bold">Loading image...</div>
          </div>
        </div>
      )}
      
      <div className="relative">
        <img
          ref={imgRef}
          src={fullImageUrl}
          alt="Handwriting Analysis"
          className="w-full h-auto rounded-2xl"
          onLoad={() => setIsLoading(false)}
          onError={() => setImageError(true)}
        />
        
        {/* AI Analysis Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>✓ AI Analyzed</span>
        </motion.div>

        {/* Risk Level Badge */}
        {!isLoading && detailedMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`absolute bottom-4 left-4 px-4 py-2 backdrop-blur-sm text-white rounded-xl text-sm font-bold shadow-lg ${
              detailedMetrics.overallRisk >= 65 ? 'bg-red-500/90' :
              detailedMetrics.overallRisk >= 35 ? 'bg-yellow-500/90' :
              'bg-green-500/90'
            }`}
          >
            {detailedMetrics.overallRisk || detailedMetrics.letterReversals}% Risk Level
          </motion.div>
        )}
      </div>

      {/* Analysis Summary Bar */}
      {!isLoading && detailedMetrics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-t-2 border-purple-200 dark:border-purple-800"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Letter Issues</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                {detailedMetrics.letterReversals}%
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Spacing</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                {detailedMetrics.spacingIssues}%
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Formation</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                {detailedMetrics.formationIssues}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AnalysisVisualizer
