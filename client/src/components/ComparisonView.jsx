import React from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

const ComparisonView = ({ analyses }) => {
  if (analyses.length < 2) return null

  const latest = analyses[0]
  const oldest = analyses[analyses.length - 1]
  const improvement = oldest.confidence - latest.confidence
  const improvementPercent = Math.round(improvement * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl p-8 border-2 border-green-200 dark:border-green-800"
    >
      <h3 className="text-3xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
        📊 Progress Comparison
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
            First Analysis
          </div>
          <div className="text-5xl font-black text-red-600 mb-2">
            {Math.round(oldest.confidence * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(oldest.createdAt).toLocaleDateString()}
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full inline-block text-sm font-bold ${
            oldest.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
            oldest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {oldest.riskLevel} Risk
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
            Latest Analysis
          </div>
          <div className="text-5xl font-black text-green-600 mb-2">
            {Math.round(latest.confidence * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(latest.createdAt).toLocaleDateString()}
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full inline-block text-sm font-bold ${
            latest.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
            latest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {latest.riskLevel} Risk
          </div>
        </div>
      </div>

      {improvement !== 0 && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`p-6 rounded-2xl ${
            improvement > 0 
              ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
              : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            {improvement > 0 ? (
              <>
                <TrendingDown className="h-8 w-8 text-green-600" />
                <div className="text-3xl font-black text-green-700 dark:text-green-400">
                  🎉 {Math.abs(improvementPercent)}% Improvement!
                </div>
              </>
            ) : (
              <>
                <TrendingUp className="h-8 w-8 text-red-600" />
                <div className="text-3xl font-black text-red-700 dark:text-red-400">
                  {Math.abs(improvementPercent)}% Increase in Risk
                </div>
              </>
            )}
          </div>
          <p className="text-center mt-3 text-gray-700 dark:text-gray-300 fun-font text-lg">
            {improvement > 0 
              ? 'Great progress! Keep up the practice!' 
              : 'Consider increasing practice time and consulting a specialist.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ComparisonView
