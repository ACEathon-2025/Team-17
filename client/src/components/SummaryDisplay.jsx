import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingDown, Clock, Zap, Copy, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SummaryDisplay = ({ summary, onCopy }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = React.useState(false);

  if (!summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summary);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 border-2 ${
        isDark 
          ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-700' 
          : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
      }`}
      style={{
        fontFamily: '"OpenDyslexic", "Lexend", Arial, sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold" style={{ letterSpacing: '0.03em' }}>
              AI Summary
            </h3>
            <p className="text-sm opacity-70" style={{ letterSpacing: '0.03em' }}>
              Key points extracted by AI
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Text */}
      <div className={`p-4 rounded-xl mb-4 ${
        isDark ? 'bg-gray-900/50' : 'bg-white/70'
      }`}>
        <p className="text-base leading-relaxed" style={{
          letterSpacing: '0.03em',
          lineHeight: '1.9',
          wordSpacing: '0.1em'
        }}>
          {summary.summary}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-xl text-center ${
          isDark ? 'bg-gray-900/50' : 'bg-white/50'
        }`}>
          <FileText className="h-5 w-5 mx-auto mb-1 opacity-70" />
          <div className="text-xs opacity-70 mb-1">Original</div>
          <div className="text-lg font-bold">{summary.originalWordCount}</div>
          <div className="text-xs opacity-70">words</div>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          isDark ? 'bg-gray-900/50' : 'bg-white/50'
        }`}>
          <TrendingDown className="h-5 w-5 mx-auto mb-1 opacity-70" />
          <div className="text-xs opacity-70 mb-1">Summary</div>
          <div className="text-lg font-bold">{summary.summaryWordCount}</div>
          <div className="text-xs opacity-70">words</div>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          isDark ? 'bg-gray-900/50' : 'bg-white/50'
        }`}>
          <Zap className="h-5 w-5 mx-auto mb-1 opacity-70" />
          <div className="text-xs opacity-70 mb-1">Compression</div>
          <div className="text-lg font-bold">{summary.compressionRatio}%</div>
          <div className="text-xs opacity-70">of original</div>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          isDark ? 'bg-gray-900/50' : 'bg-white/50'
        }`}>
          <Clock className="h-5 w-5 mx-auto mb-1 opacity-70" />
          <div className="text-xs opacity-70 mb-1">Time Saved</div>
          <div className="text-lg font-bold">
            ~{Math.ceil((summary.originalWordCount - summary.summaryWordCount) / 200)}
          </div>
          <div className="text-xs opacity-70">minutes</div>
        </div>
      </div>

      {/* Model Info */}
      <div className={`mt-4 p-3 rounded-xl text-xs text-center ${
        isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
      }`} style={{ letterSpacing: '0.03em' }}>
        Powered by {summary.model} via Hugging Face
      </div>
    </motion.div>
  );
};

export default SummaryDisplay;
