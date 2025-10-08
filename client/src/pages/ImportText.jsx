import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Link as LinkIcon, Sparkles, AlertCircle, Mic } from 'lucide-react'
import FileUploader from '../components/import/FileUploader'
import URLImporter from '../components/import/URLImporter'
import ProcessingModal from '../components/import/ProcessingModal'
import ImportPreview from '../components/import/ImportPreview'
import { ocrService } from '../services/ocrService'
import { pdfService } from '../services/pdfService'
import { docxService } from '../services/docxService'
import { epubService } from '../services/epubService'
import { urlImportService } from '../services/urlImportService'
import { textCleaner } from '../utils/textCleaner'

const ImportText = () => {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'url'
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState('processing') // 'processing', 'success', 'error'
  const [processingMessage, setProcessingMessage] = useState('')
  const [currentFileName, setCurrentFileName] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState('')

  // Supported file formats
  const acceptedFormats = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/epub+zip': ['.epub'],
    'text/plain': ['.txt']
  }

  /**
   * Handle file upload
   */
  const handleFileSelect = async (files) => {
    if (files.length === 0) return

    const file = files[0]
    setCurrentFileName(file.name)
    setProcessing(true)
    setProgress(0)
    setProcessingStatus('processing')
    setError('')

    try {
      let text = ''
      const fileType = file.type

      // Determine file type and process accordingly
      if (fileType.startsWith('image/')) {
        setProcessingMessage('Extracting text from image using OCR...')
        text = await ocrService.extractFromImage(file, (prog) => {
          setProgress(prog)
        })
      } else if (fileType === 'application/pdf') {
        setProcessingMessage('Extracting text from PDF...')
        text = await pdfService.extractTextFromPDF(file, (prog) => {
          setProgress(prog)
        })
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setProcessingMessage('Extracting text from DOCX...')
        text = await docxService.extractTextFromDOCX(file)
        setProgress(1)
      } else if (fileType === 'application/epub+zip') {
        setProcessingMessage('Extracting text from EPUB...')
        text = await epubService.extractTextFromEPUB(file)
        setProgress(1)
      } else if (fileType === 'text/plain') {
        setProcessingMessage('Reading text file...')
        text = await file.text()
        setProgress(1)
      } else {
        throw new Error('Unsupported file type')
      }

      // Clean extracted text
      text = textCleaner.clean(text)

      if (!text || text.trim().length < 10) {
        throw new Error('No text found in file. The file may be empty or corrupted.')
      }

      // Success
      setProcessingStatus('success')
      setProcessingMessage('Text extracted successfully!')
      setExtractedText(text)

      // Show preview after a short delay
      setTimeout(() => {
        setProcessing(false)
        setShowPreview(true)
      }, 1000)

    } catch (error) {
      console.error('File processing error:', error)
      setProcessingStatus('error')
      setProcessingMessage(error.message || 'Failed to extract text from file')
      setError(error.message)

      // Auto-close error modal after 3 seconds
      setTimeout(() => {
        setProcessing(false)
      }, 3000)
    }
  }

  /**
   * Handle URL import
   */
  const handleURLImport = async (url) => {
    setProcessing(true)
    setProgress(0)
    setProcessingStatus('processing')
    setProcessingMessage('Fetching article from URL...')
    setCurrentFileName(url)
    setError('')

    try {
      const result = await urlImportService.extractFromURL(url)
      
      if (!result.content || result.content.trim().length < 10) {
        throw new Error('No content found at URL')
      }

      const text = textCleaner.clean(result.content)
      
      setProgress(1)
      setProcessingStatus('success')
      setProcessingMessage('Article imported successfully!')
      setExtractedText(text)

      setTimeout(() => {
        setProcessing(false)
        setShowPreview(true)
      }, 1000)

    } catch (error) {
      console.error('URL import error:', error)
      setProcessingStatus('error')
      setProcessingMessage(error.message || 'Failed to import from URL')
      setError(error.message)

      setTimeout(() => {
        setProcessing(false)
      }, 3000)
      
      throw error // Re-throw for URLImporter component
    }
  }

  /**
   * Handle confirm (use extracted text)
   */
  const handleConfirm = () => {
    // Store in localStorage for use in other features
    localStorage.setItem('imported-text', extractedText)
    localStorage.setItem('imported-text-source', currentFileName)
    
    setShowPreview(false)
    setExtractedText('')
    setCurrentFileName('')
    
    // Show success message
    alert('Text ready! You can now use it in any feature.')
  }

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setShowPreview(false)
    setExtractedText('')
    setCurrentFileName('')
  }

  const tabs = [
    { id: 'upload', name: 'Upload Files', icon: FileText },
    { id: 'url', name: 'Import from URL', icon: LinkIcon }
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
            Import Text from Anywhere
          </h1>
          <p className="text-[var(--text-secondary)] dyslexia-text">
            Upload documents, extract text from images with OCR, or import articles from URLs 🎤
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium dyslexia-text transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-primary-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Error Message */}
        {error && !processing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm dyslexia-text">{error}</p>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' ? (
            <div className="space-y-8">
              <FileUploader
                onFileSelect={handleFileSelect}
                acceptedFormats={acceptedFormats}
                maxSize={10}
              />

              {/* Supported Formats Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-4 flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  Supported Formats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] dyslexia-text mb-2">
                      📄 Documents:
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] dyslexia-text">
                      <li>• PDF (.pdf) - Text extraction</li>
                      <li>• Word (.docx) - Full support</li>
                      <li>• EPUB (.epub) - E-books</li>
                      <li>• Text (.txt) - Plain text</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] dyslexia-text mb-2">
                      🖼️ Images (OCR):
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] dyslexia-text">
                      <li>• PNG, JPG, JPEG</li>
                      <li>• GIF, BMP, TIFF</li>
                      <li>• Supports 100+ languages</li>
                      <li>• Best with clear, high-quality images</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3">
                  💡 Tips for Best Results:
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)] dyslexia-text">
                  <li>✅ Use high-resolution images for OCR (300 DPI or higher)</li>
                  <li>✅ Ensure text is clearly visible and not blurry</li>
                  <li>✅ Straighten images before uploading</li>
                  <li>✅ PDF and DOCX work best for accurate extraction</li>
                  <li>✅ Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <URLImporter onImport={handleURLImport} />

              {/* URL Import Info with Voice Mention */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3 flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  🌐 How URL Import Works:
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)] dyslexia-text">
                  <li>✅ Extracts main article content automatically</li>
                  <li>✅ Removes ads, sidebars, and navigation</li>
                  <li>✅ Works best with news sites, blogs, Medium, etc.</li>
                  <li><strong>🎤 Voice input available</strong> - Speak the URL instead of typing!</li>
                  <li>⚠️ Some sites may block automated access</li>
                  <li>💡 Try copying the article text if import fails</li>
                </ul>
              </div>

              {/* Example URLs */}
              <div className="bg-[var(--bg-primary)] rounded-xl p-6 border border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] dyslexia-text mb-3">
                  📚 Try These Example Articles:
                </h3>
                <div className="space-y-2">
                  {[
                    'https://en.wikipedia.org/wiki/Artificial_intelligence',
                    'https://www.bbc.com/news',
                    'https://medium.com/@example/sample-article'
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleURLImport(url)}
                      className="w-full text-left px-4 py-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm text-primary-600 dyslexia-text border border-transparent hover:border-primary-300"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Preview Modal */}
        {showPreview && extractedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <ImportPreview
                text={extractedText}
                fileName={currentFileName}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={processing}
        progress={progress}
        status={processingStatus}
        message={processingMessage}
        fileName={currentFileName}
      />
    </div>
  )
}

export default ImportText
