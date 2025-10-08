import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

const BionicToggle = ({ enabled, onToggle, intensity, onIntensityChange }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
      <div className="flex items-center space-x-2 flex-1">
        <Zap className={`h-5 w-5 ${enabled ? 'text-orange-500' : 'text-gray-400'}`} />
        <div className="flex-1">
          <div className="font-semibold text-[var(--text-primary)] dyslexia-text text-sm">
            Bionic Reading
          </div>
          <div className="text-xs text-[var(--text-secondary)] dyslexia-text">
            Read 20-30% faster
          </div>
        </div>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
          animate={{ x: enabled ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      {/* Intensity Slider (only show when enabled) */}
      {enabled && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className="flex items-center space-x-2"
        >
          <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
            Bold
          </span>
          <input
            type="range"
            min="30"
            max="70"
            value={intensity * 100}
            onChange={(e) => onIntensityChange(e.target.value / 100)}
            className="w-20 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </motion.div>
      )}
    </div>
  )
}

export default BionicToggle
