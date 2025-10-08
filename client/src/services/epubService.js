import JSZip from 'jszip'

class EPUBService {
  /**
   * Extract text from EPUB file
   * @param {File} file - EPUB file
   * @returns {Promise<string>} Extracted text
   */
  async extractTextFromEPUB(file) {
    try {
      const zip = await JSZip.loadAsync(file)
      let fullText = ''

      // EPUB files contain HTML/XHTML files
      const htmlFiles = Object.keys(zip.files).filter(
        name => name.endsWith('.html') || name.endsWith('.xhtml')
      )

      for (const filename of htmlFiles) {
        const content = await zip.files[filename].async('text')
        // Strip HTML tags
        const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
        fullText += text + '\n\n'
      }

      return fullText.trim()
    } catch (error) {
      console.error('EPUB extraction failed:', error)
      throw new Error('Failed to extract text from EPUB')
    }
  }

  /**
   * Get EPUB metadata
   */
  async getEPUBMetadata(file) {
    try {
      const zip = await JSZip.loadAsync(file)
      const opfFile = Object.keys(zip.files).find(name => name.endsWith('.opf'))
      
      if (opfFile) {
        const content = await zip.files[opfFile].async('text')
        const parser = new DOMParser()
        const xml = parser.parseFromString(content, 'text/xml')
        
        return {
          title: xml.querySelector('title')?.textContent || 'Untitled',
          author: xml.querySelector('creator')?.textContent || 'Unknown',
          language: xml.querySelector('language')?.textContent || 'en'
        }
      }
      
      return null
    } catch (error) {
      console.error('EPUB metadata extraction failed:', error)
      return null
    }
  }
}

export const epubService = new EPUBService()
