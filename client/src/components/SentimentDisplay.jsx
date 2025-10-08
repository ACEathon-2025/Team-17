import React from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, Smile, Meh, Frown, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SentimentDisplay = ({ analysis, compact = false }) => {
  const { isDark } = useTheme();

  if (!analysis) return null;

  const getColorClasses = (color) => {
    const colorMap = {
      green: isDark ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-green-50 border-green-300 text-green-800',
      lightgreen: isDark ? 'bg-green-800/30 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-700',
      gray: isDark ? 'bg-gray-800/30 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700',
      orange: isDark ? 'bg-orange-900/30 border-orange-700 text-orange-300' : 'bg-orange-50 border-orange-300 text-orange-800',
      red: isDark ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-300 text-red-800'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getSentimentIcon = () => {
    if (analysis.score > 2) return <Smile className="h-5 w-5" />;
    if (analysis.score < -2) return <Frown className="h-5 w-5" />;
    return <Meh className="h-5 w-5" />;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border-2 ${getColorClasses(analysis.color)}`}
      >
        <span className="text-xl">{analysis.emoji}</span>
        <span className="font-semibold text-sm">{analysis.label}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 border-2 ${getColorClasses(analysis.color)}`}
      style={{
        fontFamily: '"OpenDyslexic", "Lexend", Arial, sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{analysis.emoji}</span>
          <div>
            <h3 className="text-xl font-bold" style={{ letterSpacing: '0.03em' }}>
              {analysis.label}
            </h3>
            <p className="text-sm opacity-80" style={{ letterSpacing: '0.03em' }}>
              Emotional Tone Analysis
            </p>
          </div>
        </div>
        {getSentimentIcon()}
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}`}>
          <div className="text-xs opacity-70 mb-1" style={{ letterSpacing: '0.03em' }}>
            Sentiment Score
          </div>
          <div className="text-2xl font-bold flex items-center">
            {analysis.score > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
            {analysis.score < 0 && <TrendingDown className="h-4 w-4 mr-1" />}
            {analysis.score}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}`}>
          <div className="text-xs opacity-70 mb-1" style={{ letterSpacing: '0.03em' }}>
            Comparative
          </div>
          <div className="text-2xl font-bold">
            {analysis.comparative.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Details */}
      {analysis.details && (
        <p className="text-sm mb-4 opacity-90" style={{ 
          letterSpacing: '0.03em',
          lineHeight: '1.8'
        }}>
          {analysis.details}
        </p>
      )}

      {/* Word Lists */}
      {(analysis.positive?.length > 0 || analysis.negative?.length > 0) && (
        <div className="space-y-3">
          {analysis.positive?.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 opacity-70" style={{ letterSpacing: '0.05em' }}>
                POSITIVE WORDS
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.positive.map((word, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                    }`}
                    style={{ letterSpacing: '0.03em' }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.negative?.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2 opacity-70" style={{ letterSpacing: '0.05em' }}>
                NEGATIVE WORDS
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.negative.map((word, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                    }`}
                    style={{ letterSpacing: '0.03em' }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendation */}
      {analysis.recommendation && (
        <div className={`mt-4 p-3 rounded-xl border ${
          isDark ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-800'
        }`}>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm" style={{ 
              letterSpacing: '0.03em',
              lineHeight: '1.8'
            }}>
              {analysis.recommendation}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SentimentDisplay;
