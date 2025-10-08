// client/src/components/WordTooltip.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Book, X, Loader2, BookOpen } from 'lucide-react';
import { dictionaryService } from '../services/dictionaryService';
import { useTheme } from '../context/ThemeContext';

const WordTooltip = ({ word, position, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    if (word) {
      fetchDefinition();
    }
  }, [word]);

  const fetchDefinition = async () => {
    setLoading(true);
    setError('');

    const result = await dictionaryService.getDefinition(word);

    if (result.success) {
      setData(result);
    } else {
      setError(result.error || 'Definition not found');
    }

    setLoading(false);
  };

  const handlePronounce = () => {
    if (data?.audioUrl) {
      dictionaryService.playPronunciation(data.audioUrl);
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`fixed z-50 w-[480px] max-w-[90vw] rounded-2xl shadow-2xl border-2 ${
          isDark 
            ? 'bg-gray-800 border-blue-600' 
            : 'bg-white border-blue-400'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -110%)',
          fontFamily: '"OpenDyslexic", "Lexend", Arial, sans-serif'
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b-2 ${
          isDark ? 'border-gray-700 bg-gray-750' : 'border-blue-100 bg-blue-50'
        }`}>
          <div className="flex items-center space-x-3">
            <BookOpen className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-2xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ 
                letterSpacing: '0.03em',
                wordSpacing: '0.15em',
                lineHeight: '1.6'
              }}>
              {word}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isDark 
                ? 'hover:bg-gray-600 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[500px] overflow-y-auto"
          style={{
            lineHeight: '1.8',
            letterSpacing: '0.03em',
            wordSpacing: '0.15em'
          }}>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className={`h-10 w-10 animate-spin ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
          )}

          {error && (
            <div className={`text-center py-12 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              <p className="font-bold text-lg mb-3">{error}</p>
              <p className="text-base">Try another word or check spelling</p>
            </div>
          )}

          {data && !loading && !error && (
            <div className="space-y-5">
              {/* Pronunciation */}
              {data.phonetic && (
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <span className={`text-xl font-mono font-semibold ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}
                    style={{ letterSpacing: '0.05em' }}>
                    {data.phonetic}
                  </span>
                  <button
                    onClick={handlePronounce}
                    className={`p-3 rounded-xl transition-all shadow-md hover:shadow-lg ${
                      isDark 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                    title="Pronounce"
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Origin */}
              {data.origin && (
                <div className={`text-base italic p-3 rounded-xl ${
                  isDark ? 'bg-gray-750 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
                  style={{ lineHeight: '1.8' }}>
                  <span className="font-semibold">Origin:</span> {data.origin}
                </div>
              )}

              {/* Meanings */}
              <div className="space-y-6">
                {data.meanings.map((meaning, idx) => (
                  <div key={idx} className={`p-4 rounded-xl ${
                    isDark ? 'bg-gray-750' : 'bg-gray-50'
                  }`}>
                    <div className={`font-bold text-base uppercase tracking-widest mb-4 pb-2 border-b-2 ${
                      isDark 
                        ? 'text-blue-400 border-blue-700' 
                        : 'text-blue-600 border-blue-200'
                    }`}
                      style={{ letterSpacing: '0.1em' }}>
                      {meaning.partOfSpeech}
                    </div>

                    {meaning.definitions.map((def, defIdx) => (
                      <div key={defIdx} className="mb-5 last:mb-0">
                        <div className="flex items-start space-x-3 mb-3">
                          <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                            isDark 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            {defIdx + 1}
                          </span>
                          <p className={`flex-1 text-base ${
                            isDark ? 'text-gray-200' : 'text-gray-800'
                          }`}
                            style={{ 
                              lineHeight: '1.9',
                              letterSpacing: '0.03em',
                              wordSpacing: '0.15em'
                            }}>
                            {def.definition}
                          </p>
                        </div>

                        {def.example && (
                          <p className={`text-base italic ml-10 pl-4 border-l-4 my-3 ${
                            isDark 
                              ? 'text-gray-400 border-gray-600' 
                              : 'text-gray-600 border-gray-300'
                          }`}
                            style={{ 
                              lineHeight: '1.8',
                              letterSpacing: '0.03em'
                            }}>
                            "{def.example}"
                          </p>
                        )}

                        {/* Synonyms */}
                        {def.synonyms.length > 0 && (
                          <div className={`text-base ml-10 mt-3 p-3 rounded-lg ${
                            isDark ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-800'
                          }`}
                            style={{ 
                              lineHeight: '1.8',
                              letterSpacing: '0.03em',
                              wordSpacing: '0.15em'
                            }}>
                            <span className="font-bold">Similar:</span>{' '}
                            {def.synonyms.join(', ')}
                          </div>
                        )}

                        {/* Antonyms */}
                        {def.antonyms.length > 0 && (
                          <div className={`text-base ml-10 mt-2 p-3 rounded-lg ${
                            isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'
                          }`}
                            style={{ 
                              lineHeight: '1.8',
                              letterSpacing: '0.03em',
                              wordSpacing: '0.15em'
                            }}>
                            <span className="font-bold">Opposite:</span>{' '}
                            {def.antonyms.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t-2 text-center text-sm ${
          isDark 
            ? 'border-gray-700 bg-gray-750 text-gray-400' 
            : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}
          style={{ letterSpacing: '0.03em' }}>
          Powered by Free Dictionary API
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WordTooltip;
