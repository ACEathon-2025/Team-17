import * as pdfjsLib from 'pdfjs-dist'

// Correct worker path for Vite
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default

class PDFService {
  async extractTextFromPDF(file, onProgress = null) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      let fullText = ''

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n\n'

        if (onProgress) {
          onProgress(pageNum / numPages)
        }
      }

      return fullText.trim()
    } catch (error) {
      console.error('PDF extraction failed:', error)
      throw new Error('Failed to extract text from PDF. The file may be corrupted or image-based.')
    }
  }

  async getPDFInfo(file) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const metadata = await pdf.getMetadata()
      
      return {
        numPages: pdf.numPages,
        title: metadata?.info?.Title || 'Untitled',
        author: metadata?.info?.Author || 'Unknown'
      }
    } catch (error) {
      return null
    }
  }
}

export const pdfService = new PDFService()
