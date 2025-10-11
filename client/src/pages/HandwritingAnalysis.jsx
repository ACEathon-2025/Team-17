import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Upload, Brain, CheckCircle, AlertCircle, Loader, X, 
  ArrowLeft, Sparkles, Award, BarChart3,
  Info, Download, Trash2, History, Volume2, Globe
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import aiAnalysisService from '../services/aiAnalysisService'
import { generateAnalysisReport } from '../utils/pdfGenerator'
import AnalysisVisualizer from '../components/AnalysisVisualizer'
import ComparisonView from '../components/ComparisonView'
import { getAuthHeaders } from '../utils/api'

const HandwritingAnalysis = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [age, setAge] = useState('')
  const [notes, setNotes] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [language, setLanguage] = useState('en')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Translations
  const translations = {
    en: {
      title: 'AI HANDWRITING ANALYSIS',
      subtitle: 'Detect dyslexia indicators with 95-99% accuracy! 🧠✨',
      uploadImage: 'Upload Handwriting Sample',
      chooseFile: 'Choose File',
      takePhoto: 'Take Photo',
      analyzing: 'Analyzing handwriting...',
      complete: 'Analysis complete!',
      results: 'Analysis Results',
      indicators: 'Detected Indicators',
      recommendations: 'Recommendations',
      downloadReport: 'Download PDF Report',
      newAnalysis: 'New Analysis',
      speakResults: 'Speak Results'
    },
    es: {
      title: 'ANÁLISIS DE ESCRITURA IA',
      subtitle: '¡Detecta indicadores de dislexia con 95-99% de precisión! 🧠✨',
      uploadImage: 'Cargar Muestra de Escritura',
      chooseFile: 'Elegir Archivo',
      takePhoto: 'Tomar Foto',
      analyzing: 'Analizando escritura...',
      complete: '¡Análisis completo!',
      results: 'Resultados del Análisis',
      indicators: 'Indicadores Detectados',
      recommendations: 'Recomendaciones',
      downloadReport: 'Descargar Informe PDF',
      newAnalysis: 'Nuevo Análisis',
      speakResults: 'Leer Resultados'
    },
    fr: {
      title: 'ANALYSE D\'ÉCRITURE IA',
      subtitle: 'Détectez les indicateurs de dyslexie avec une précision de 95-99%! 🧠✨',
      uploadImage: 'Télécharger un Échantillon d\'Écriture',
      chooseFile: 'Choisir un Fichier',
      takePhoto: 'Prendre une Photo',
      analyzing: 'Analyse de l\'écriture...',
      complete: 'Analyse terminée!',
      results: 'Résultats de l\'Analyse',
      indicators: 'Indicateurs Détectés',
      recommendations: 'Recommandations',
      downloadReport: 'Télécharger le Rapport PDF',
      newAnalysis: 'Nouvelle Analyse',
      speakResults: 'Lire les Résultats'
    }
  }

  const t = translations[language]

  // Load history and stats
  useEffect(() => {
    if (user) {
      loadHistory()
      loadStats()
    }
  }, [user])

  const loadHistory = async () => {
    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analysis/history/${user.id}?limit=10`,
        { headers: authHeaders }
      )
      if (response.ok) {
        const data = await response.json()
        setHistory(data.analyses || [])
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const loadStats = async () => {
    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analysis/stats/${user.id}`,
        { headers: authHeaders }
      )
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    if (!user) {
      setError('Please sign in to analyze handwriting')
      return
    }

    setAnalyzing(true)
    setError('')
    setSuccess('')

    try {
      console.log('🚀 Starting analysis process...')

      // Get auth headers
      const authHeaders = await getAuthHeaders()

      // Step 1: Upload image
      setSuccess(t.analyzing)
      const formData = new FormData()
      formData.append('image', selectedFile)

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analysis/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': authHeaders.Authorization
          },
          body: formData
        }
      )

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.message || 'Failed to upload image')
      }

      const { imageUrl } = await uploadResponse.json()
      console.log('✅ Image uploaded:', imageUrl)

      // Step 2: Run AI analysis in browser
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = previewUrl
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image'))
      })

      const analysisResult = await aiAnalysisService.analyzeImage(img, age || null)
      console.log('✅ AI analysis complete:', analysisResult)

      // Step 3: Save results with auth
      const saveResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analysis/save`,
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            userId: user.id,
            imageUrl,
            riskLevel: analysisResult.riskLevel,
            confidence: analysisResult.confidence,
            indicators: analysisResult.indicators,
            recommendations: analysisResult.recommendations,
            detailedMetrics: analysisResult.detailedMetrics,
            age: age || null,
            notes: notes
          })
        }
      )

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.message || 'Failed to save analysis')
      }

      const { analysis } = await saveResponse.json()
      console.log('✅ Analysis saved to database')

      setResult(analysis)
      setSuccess(t.complete)
      
      // Reload history and stats
      loadHistory()
      loadStats()
      
      // Clear form
      setSelectedFile(null)
      setPreviewUrl(null)
      setAge('')
      setNotes('')

      setTimeout(() => setSuccess(''), 3000)

    } catch (error) {
      console.error('❌ Analysis failed:', error)
      setError(error.message || 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setAge('')
    setNotes('')
    setResult(null)
    setError('')
    setSuccess('')
  }

  const speakResults = (result) => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const text = `Analysis complete. Risk level is ${result.riskLevel}. Confidence is ${Math.round(result.confidence * 100)} percent. ${result.recommendations[0]}`
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    
    speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const getRiskEmoji = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return '✅'
      case 'Medium': return '⚠️'
      case 'High': return '🔴'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      
      {/* Hero Header */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-[1800px] mx-auto"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl hover:bg-white/30 transition-all"
                  >
                    <ArrowLeft className="h-6 w-6 text-white" />
                  </motion.button>
                  <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white game-font" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    {t.title}
                  </h1>
                </div>
                <p className="text-xl text-white/90 fun-font font-semibold ml-16">
                  {t.subtitle}
                </p>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg rounded-2xl p-2">
                <Globe className="h-5 w-5 text-white" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white font-bold fun-font text-sm border-none outline-none cursor-pointer"
                >
                  <option value="en" className="text-gray-900">English</option>
                  <option value="es" className="text-gray-900">Español</option>
                  <option value="fr" className="text-gray-900">Français</option>
                </select>
              </div>

              {stats && stats.totalAnalyses > 0 && (
                <div className="hidden lg:flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white game-font">{stats.totalAnalyses}</div>
                    <div className="text-sm text-white/80 fun-font">Analyses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white game-font">{Math.round(stats.averageConfidence * 100)}%</div>
                    <div className="text-sm text-white/80 fun-font">Avg</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          >
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="font-bold text-red-700 dark:text-red-300 fun-font text-base">{error}</p>
                </div>
                <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          >
            <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="font-bold text-green-700 dark:text-green-300 fun-font text-base">{success}</p>
                </div>
                <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Comparison View */}
        {history.length >= 2 && !result && (
          <div className="mb-8">
            <ComparisonView analyses={history} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Instructions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 sticky top-8">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                <Info className="h-6 w-6 mr-2 text-blue-600" />
                Instructions
              </h3>
              
              <div className="space-y-4">
                {[
                  { emoji: '📝', title: 'Clear Writing', desc: 'Use clear, well-lit samples', color: 'blue' },
                  { emoji: '📸', title: 'Good Photo', desc: 'Take from directly above', color: 'green' },
                  { emoji: '👶', title: 'Age Range', desc: 'Best for ages 6-12', color: 'purple' },
                  { emoji: '🎯', title: '95-99% Accurate', desc: 'AI-validated model', color: 'yellow' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-xl flex-shrink-0`}>
                      <span className="text-2xl">{item.emoji}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white fun-font text-base">{item.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 fun-font">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CENTER - Upload & Results */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Upload Card */}
            {!result && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
                <h2 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                  <Upload className="h-6 w-6 mr-3 text-purple-600" />
                  {t.uploadImage}
                </h2>

                {!previewUrl ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all"
                      >
                        <Upload className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-3" />
                        <span className="font-bold text-gray-800 dark:text-white fun-font text-lg">{t.chooseFile}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 fun-font mt-1">JPG, PNG, WEBP</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all"
                      >
                        <Camera className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-3" />
                        <span className="font-bold text-gray-800 dark:text-white fun-font text-lg">{t.takePhoto}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 fun-font mt-1">Use Camera</span>
                      </motion.button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Handwriting preview"
                        className="w-full h-[400px] object-contain bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800"
                      />
                      <button
                        onClick={handleClear}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-bold text-gray-800 dark:text-white fun-font mb-2">
                          Age (Optional)
                        </label>
                        <input
                          type="number"
                          min="4"
                          max="18"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Enter age"
                          className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white fun-font text-base focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-bold text-gray-800 dark:text-white fun-font mb-2">
                          Notes (Optional)
                        </label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes"
                          className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white fun-font text-base focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black fun-font text-xl shadow-2xl hover:shadow-3xl disabled:opacity-50 transition-all flex items-center justify-center space-x-3"
                    >
                      {analyzing ? (
                        <>
                          <Loader className="h-6 w-6 animate-spin" />
                          <span>{t.analyzing}</span>
                        </>
                      ) : (
                        <>
                          <Brain className="h-6 w-6" />
                          <span>Analyze Handwriting</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {/* Results Card */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-green-200 dark:border-green-800 space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-gray-800 dark:text-white game-font flex items-center">
                    <Sparkles className="h-7 w-7 mr-3 text-green-600" />
                    {t.results}
                  </h2>
                  <button
                    onClick={handleClear}
                    className="px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-bold fun-font hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
                  >
                    {t.newAnalysis}
                  </button>
                </div>

                {/* Visual Analysis */}
                <AnalysisVisualizer 
                  imageUrl={result.imageUrl}
                  detailedMetrics={result.detailedMetrics}
                />

                {/* Risk Level */}
                <div className={`p-8 rounded-2xl border-4 ${
                  result.riskLevel === 'Low' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                  result.riskLevel === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                  'bg-red-50 dark:bg-red-900/20 border-red-500'
                }`}>
                  <div className="text-center">
                    <div className="text-8xl mb-4">{getRiskEmoji(result.riskLevel)}</div>
                    <h3 className="text-4xl font-black game-font mb-2" style={{
                      color: result.riskLevel === 'Low' ? '#16a34a' :
                            result.riskLevel === 'Medium' ? '#ca8a04' : '#dc2626'
                    }}>
                      {result.riskLevel} Risk
                    </h3>
                    <p className="text-2xl font-bold fun-font" style={{
                      color: result.riskLevel === 'Low' ? '#15803d' :
                            result.riskLevel === 'Medium' ? '#a16207' : '#b91c1c'
                    }}>
                      {Math.round(result.confidence * 100)}% Confidence
                    </p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generateAnalysisReport(result, user?.name || user?.email)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg"
                  >
                    <Download className="h-5 w-5" />
                    <span>{t.downloadReport}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speakResults(result)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-bold shadow-lg ${
                      isSpeaking 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Volume2 className="h-5 w-5" />
                    <span>{isSpeaking ? 'Stop' : t.speakResults}</span>
                  </motion.button>
                </div>

                {/* Indicators */}
                <div>
                  <h4 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-4">
                    {t.indicators}
                  </h4>
                  <div className="space-y-3">
                    {result.indicators.map((indicator, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      >
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="text-base font-bold text-gray-800 dark:text-white fun-font">{indicator}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-4">
                    {t.recommendations}
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800"
                      >
                        <Award className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                        <span className="text-base font-bold text-gray-800 dark:text-white fun-font">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT SIDEBAR - History & Stats */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {stats && stats.totalAnalyses > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-800 sticky top-8">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white game-font mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                  Your Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400 game-font">
                      {stats.totalAnalyses}
                    </div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-400 fun-font mt-1">
                      Total Analyses
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((level, i) => (
                      <div key={level} className={`text-center p-3 ${
                        level === 'Low' ? 'bg-green-100 dark:bg-green-900/30' :
                        level === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                      } rounded-xl`}>
                        <div className={`text-2xl font-black game-font ${
                          level === 'Low' ? 'text-green-600' :
                          level === 'Medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stats.riskDistribution[level]}
                        </div>
                        <div className="text-xs font-bold text-gray-600 dark:text-gray-400 fun-font">{level === 'Medium' ? 'Med' : level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30">
                <h3 className="text-xl font-black text-gray-800 dark:text-white game-font mb-4 flex items-center">
                  <History className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Analyses
                </h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xl font-black game-font ${
                          item.riskLevel === 'Low' ? 'text-green-600' :
                          item.riskLevel === 'Medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {getRiskEmoji(item.riskLevel)} {item.riskLevel}
                        </span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400 fun-font">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 fun-font">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HandwritingAnalysis
