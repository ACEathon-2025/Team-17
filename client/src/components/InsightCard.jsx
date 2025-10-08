import React from 'react'
import { motion } from 'framer-motion'

const InsightCard = ({ insight, index }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500 border-blue-300 dark:border-blue-700',
    green: 'from-green-500 to-emerald-500 border-green-300 dark:border-green-700',
    purple: 'from-purple-500 to-pink-500 border-purple-300 dark:border-purple-700',
    orange: 'from-orange-500 to-amber-500 border-orange-300 dark:border-orange-700',
    red: 'from-red-500 to-rose-500 border-red-300 dark:border-red-700'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-xl p-4 border-2 bg-gradient-to-br ${colorClasses[insight.color] || colorClasses.blue}`}
    >
      <div className="relative z-10">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">{insight.icon}</span>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1 dyslexia-text">
              {insight.title}
            </h3>
            <p className="text-white/90 text-sm dyslexia-text" style={{ lineHeight: '1.6' }}>
              {insight.message}
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
    </motion.div>
  )
}

export default InsightCard
