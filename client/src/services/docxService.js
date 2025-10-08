import mammoth from 'mammoth'

class DOCXService {
  /**
   * Extract text from DOCX file
   * @param {File} file - DOCX file
   * @returns {Promise<string>} Extracted text
   */
  async extractTextFromDOCX(file) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      
      if (result.messages.length > 0) {
        console.warn('DOCX extraction warnings:', result.messages)
      }

      return result.value
    } catch (error) {
      console.error('DOCX extraction failed:', error)
      throw new Error('Failed to extract text from DOCX')
    }
  }

  /**
   * Convert DOCX to HTML (preserves formatting)
   */
  async convertToHTML(file) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      
      return result.value
    } catch (error) {
      console.error('DOCX to HTML conversion failed:', error)
      throw new Error('Failed to convert DOCX to HTML')
    }
  }
}

export const docxService = new DOCXService()
