import { createWorker } from 'tesseract.js'

class OCRService {
  constructor() {
    this.worker = null
    this.progressCallback = null
  }

  /**
   * Initialize Tesseract worker
   */
  async initialize(language = 'eng') {
    try {
      // Create worker with logger
      this.worker = await createWorker(language, 1, {
        logger: (m) => {
          // Handle progress updates
          if (m.status === 'recognizing text' && this.progressCallback) {
            this.progressCallback(m.progress)
          }
          console.log(`OCR: ${m.status} ${Math.round((m.progress || 0) * 100)}%`)
        }
      })
      return true
    } catch (error) {
      console.error('OCR initialization failed:', error)
      return false
    }
  }

  /**
   * Extract text from image
   * @param {File|Blob|string} image - Image file or URL
   * @param {Function} onProgress - Progress callback (0-1)
   * @returns {Promise<string>} Extracted text
   */
  async extractFromImage(image, onProgress = null) {
    try {
      // Set progress callback
      this.progressCallback = onProgress

      // Initialize worker if not already done
      if (!this.worker) {
        await this.initialize()
      }

      // Recognize text - don't pass logger here
      const { data } = await this.worker.recognize(image)

      // Clear progress callback
      this.progressCallback = null

      return data.text || ''
    } catch (error) {
      console.error('OCR extraction failed:', error)
      this.progressCallback = null
      throw new Error('Failed to extract text from image. Make sure the image contains readable text.')
    }
  }

  /**
   * Extract text from multiple images (batch)
   */
  async extractFromMultipleImages(images, onProgress = null) {
    const results = []
    
    for (let i = 0; i < images.length; i++) {
      const text = await this.extractFromImage(images[i], (progress) => {
        if (onProgress) {
          const totalProgress = (i + progress) / images.length
          onProgress(totalProgress)
        }
      })
      results.push(text)
    }

    return results.join('\n\n---\n\n')
  }

  /**
   * Change OCR language
   */
  async setLanguage(language) {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
    await this.initialize(language)
  }

  /**
   * Cleanup worker
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}

// Create singleton instance
export const ocrService = new OCRService()
