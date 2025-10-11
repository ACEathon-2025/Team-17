import React from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, AlertCircle } from 'lucide-react'

const MetricsChart = ({ detailedMetrics }) => {
  const metrics = [
    { name: 'Letter Reversals', value: detailedMetrics.letterReversals, color: 'from-red-500 to-orange-500', icon: '🔄' },
    { name: 'Spacing Issues', value: detailedMetrics.spacingIssues, color: 'from-orange-500 to-yellow-500', icon: '📏' },
    { name: 'Formation Issues', value: detailedMetrics.formationIssues, color: 'from-yellow-500 to-green-500', icon: '✍️' },
    { name: 'Pressure Variation', value: detailedMetrics.pressureVariation, color: 'from-green-500 to-blue-500', icon: '💪' },
    { name: 'Baseline Alignment', value: detailedMetrics.baselineAlignment, color: 'from-blue-500 to-purple-500', icon: '📐' }
  ]

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className="font-bold text-gray-800 dark:text-white fun-font">
                {metric.name}
              </span>
            </div>
            <span className="text-lg font-black game-font text-gray-800 dark:text-white">
              {metric.value}%
            </span>
          </div>
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metric.value}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default MetricsChart
