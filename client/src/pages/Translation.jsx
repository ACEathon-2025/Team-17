import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, 
  Volume2, 
  Copy, 
  CheckCircle, 
  Loader2, 
  Info, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeftRight,
  Zap,
  Globe
} from 'lucide-react';
import { translationService } from '../services/translationService.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { goalsService } from '../services/goalsService'


// Safe settings hook with fallback
const useSettingsSafe = () => {
  try {
    const stored = localStorage.getItem('voxa-settings');
    return stored ? JSON.parse(stored) : { preferredTranslationLanguage: 'es', autoTranslate: false };
  } catch {
    return { preferredTranslationLanguage: 'es', autoTranslate: false };
  }
};

const Translation = () => {
  // Use ThemeContext for dark mode (synced with navbar)
  const { isDark } = useTheme();
  
  // Get settings safely
  const storedSettings = useSettingsSafe();

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(storedSettings.preferredTranslationLanguage || 'es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(storedSettings.autoTranslate || false);
  const [languages, setLanguages] = useState([]);
  const [serverStatus, setServerStatus] = useState({ status: 'checking', hasApiKey: false });

  useEffect(() => {
    const loadLanguages = async () => {
      const langs = await translationService.getSupportedLanguages();
      setLanguages(langs);
    };

    const checkServer = async () => {
      const status = await translationService.checkServerHealth();
      setServerStatus(status);
    };

    loadLanguages();
    checkServer();
  }, []);

  // Listen for settings updates
  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      const newSettings = event.detail;
      if (newSettings.preferredTranslationLanguage) {
        setTargetLanguage(newSettings.preferredTranslationLanguage);
      }
      if (newSettings.autoTranslate !== undefined) {
        setAutoTranslate(newSettings.autoTranslate);
      }
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  useEffect(() => {
    if (!autoTranslate) return;

    const timer = setTimeout(() => {
      if (sourceText.trim().length > 0) {
        handleTranslate();
      } else {
        setTranslatedText('');
        setDetectedLanguage('');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [sourceText, targetLanguage, autoTranslate]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await translationService.translateText(
        sourceText,
        targetLanguage
      );

      if (result.success) {
        setTranslatedText(result.translatedText);
        setDetectedLanguage(result.detectedLanguage);
      } else {
        if (result.error.includes('Rate limit') || result.error.includes('Daily limit')) {
          setError('⏱️ Daily limit reached (50,000 chars). Try again tomorrow!');
        } else {
          setError(result.error || 'Translation failed');
        }
        setTranslatedText('');
      }
    } catch (err) {
      setError('Translation failed. Please try again.');
      setTranslatedText('');
    } finally {
      setLoading(false);
    }
    if (translatedText) {
    // Update challenge progress
    goalsService.updateChallengeProgress('translations', 1)
  }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeak = (text, langCode) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'zh' ? 'zh-CN' : langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleSwapLanguages = () => {
    if (!translatedText) return;
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setDetectedLanguage(translationService.getLanguageName(targetLanguage));
  };

  const sampleTexts = [
    "Hello, how are you today?",
    "Thank you very much for your help.",
    "Good morning! Welcome to our school.",
    "Technology is changing the world.",
    "I love learning new languages.",
    "The weather is beautiful today.",
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'
    } py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center items-center mb-6">
            <div className={`inline-flex p-4 rounded-2xl shadow-lg ${
              isDark 
                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' 
                : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500'
            }`}>
              <Languages className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${
            isDark 
              ? 'from-blue-400 to-cyan-300' 
              : 'from-blue-600 to-cyan-600'
          } bg-clip-text text-transparent`}>
            Free AI Translation
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Powered by MyMemory • 50,000 characters free daily
          </p>
        </motion.div>

        {/* Server Status */}
        <AnimatePresence>
          {serverStatus.status === 'ok' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-4 mb-6 shadow-xl ${
                isDark 
                  ? 'bg-green-900/30 border border-green-700' 
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={`font-medium ${
                  isDark ? 'text-green-300' : 'text-green-700'
                }`}>
                  ✨ Translation service ready • {serverStatus.freeLimit || '50,000 chars/day'}
                </p>
              </div>
            </motion.div>
          )}

          {serverStatus.status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-2xl p-6 mb-6 shadow-xl ${
                isDark 
                  ? 'bg-red-900/30 border border-red-700' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className={`h-6 w-6 flex-shrink-0 mt-0.5 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-red-300' : 'text-red-900'
                  }`}>
                    Server Connection Error
                  </h3>
                  <p className={`leading-relaxed mb-3 ${
                    isDark ? 'text-red-200' : 'text-red-700'
                  }`}>
                    Cannot connect to the backend server. Please make sure the server is running.
                  </p>
                  <p className={`text-sm font-mono p-2 rounded ${
                    isDark ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-600'
                  }`}>
                    Run: npm run dev (in server folder)
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Translation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`backdrop-blur-lg rounded-2xl p-6 mb-6 border shadow-xl ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className={`text-lg font-semibold flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Globe className={`h-5 w-5 mr-2 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              Translation Settings
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Zap className="h-4 w-4 inline mr-1" />
                Auto-Translate
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer transition-all peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  isDark 
                    ? 'bg-gray-600 peer-checked:bg-blue-500 after:border-gray-500' 
                    : 'bg-gray-200 peer-checked:bg-blue-600 after:border-gray-300'
                } peer-focus:ring-4 peer-focus:ring-blue-300`}></div>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Target Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className={`w-full p-3 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {detectedLanguage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-blue-900/30 border-blue-700' 
                    : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                }`}
              >
                <Info className={`h-5 w-5 mr-3 flex-shrink-0 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Detected Language
                  </p>
                  <p className={`text-lg font-semibold ${
                    isDark ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {detectedLanguage}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Translation Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Source Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Source Text
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(sourceText, 'en')}
                  disabled={!sourceText.trim()}
                  className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Listen to text"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleCopy(sourceText)}
                  disabled={!sourceText.trim()}
                  className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Copy text"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Type or paste your text here..."
              className={`w-full h-72 p-4 border rounded-xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              style={{
                lineHeight: '1.8',
                fontSize: '1.05rem',
                fontFamily: 'OpenDyslexic, Arial, sans-serif'
              }}
            />

            <div className="flex items-center justify-between mt-4">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {sourceText.length} characters
              </span>
              {sourceText.trim().length > 0 && !autoTranslate && (
                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4" />
                      <span>Translate</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* Translated Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Translation ({translationService.getLanguageName(targetLanguage)})
              </h3>
              <div className="flex items-center space-x-2">
                {translatedText && (
                  <button
                    onClick={handleSwapLanguages}
                    className={`p-2 rounded-lg transition-all ${
                      isDark 
                        ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Swap languages"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleSpeak(translatedText, targetLanguage)}
                  disabled={!translatedText.trim()}
                  className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Listen to translation"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText.trim()}
                  className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Copy translation"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className={`w-full h-72 p-4 border rounded-xl overflow-y-auto transition-all ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-900 to-blue-900/30 border-gray-600 text-white' 
                  : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-300 text-gray-900'
              }`}
              style={{
                lineHeight: '1.8',
                fontSize: '1.05rem',
                fontFamily: 'OpenDyslexic, Arial, sans-serif'
              }}
            >
              {loading ? (
                <div className={`flex items-center justify-center h-full ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <Loader2 className={`h-8 w-8 animate-spin mr-3 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <span className="text-lg">Translating...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3" />
                    <p className="font-semibold mb-2">Translation Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <div className={`flex items-center justify-center h-full ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className="text-center">
                    <Languages className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Your translation will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {translatedText && (
              <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {translatedText.length} characters • MyMemory Free Translation
              </div>
            )}
          </motion.div>
        </div>

        {/* Sample Texts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Try Sample Texts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleTexts.map((sample, index) => (
              <motion.button
                key={index}
                onClick={() => setSourceText(sample)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 text-left rounded-xl transition-all border ${
                  isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600 hover:border-blue-500 text-gray-200' 
                    : 'bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 border-gray-200 hover:border-blue-300 text-gray-800'
                } hover:shadow-md`}
              >
                <div className="text-sm leading-relaxed">{sample}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-6 rounded-2xl p-6 border shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700' 
              : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            isDark ? 'text-blue-300' : 'text-blue-900'
          }`}>
            <Sparkles className="h-5 w-5 mr-2" />
            Free Translation Features
          </h3>
          <ul className={`space-y-3 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
            <li className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}></span>
              <span>Automatically detects the language of your input text</span>
            </li>
            <li className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}></span>
              <span>Completely free - 50,000 characters per day</span>
            </li>
            <li className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}></span>
              <span>Supports 30+ languages including major world languages</span>
            </li>
            <li className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}></span>
              <span>Optional auto-translate mode for instant results as you type</span>
            </li>
            <li className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}></span>
              <span>Dyslexia-friendly design with optimized fonts and colors</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Translation;
