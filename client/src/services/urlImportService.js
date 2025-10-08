import axios from 'axios'

class URLImportService {
  async extractFromURL(url) {
    try {
      // Use CORS proxy for development
      // In production, use your backend endpoint
      const corsProxy = 'https://api.allorigins.win/raw?url='
      const proxyUrl = corsProxy + encodeURIComponent(url)
      
      const response = await axios.get(proxyUrl, {
        timeout: 15000 // 15 second timeout
      })
      
      const html = response.data
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      // Try to find article content
      const articleSelectors = [
        'article',
        '[role="main"]',
        '.post-content',
        '.article-content',
        '.entry-content',
        'main',
        '#mw-content-text' // Wikipedia specific
      ]

      let content = ''
      for (const selector of articleSelectors) {
        const element = doc.querySelector(selector)
        if (element) {
          content = element.textContent
          break
        }
      }

      // Fallback: Get all paragraphs
      if (!content || content.trim().length < 50) {
        const paragraphs = doc.querySelectorAll('p')
        content = Array.from(paragraphs)
          .map(p => p.textContent)
          .filter(text => text.trim().length > 20) // Filter out short paragraphs
          .join('\n\n')
      }

      const title = doc.querySelector('title')?.textContent || doc.querySelector('h1')?.textContent || 'Untitled'
      
      if (!content || content.trim().length < 50) {
        throw new Error('Could not extract meaningful content from URL')
      }

      return {
        title: this.cleanText(title),
        content: this.cleanText(content),
        url,
        extractedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('URL import failed:', error)
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Request timed out. The website took too long to respond.')
      }
      
      if (error.response?.status === 404) {
        throw new Error('Page not found (404)')
      }
      
      throw new Error('Failed to import text from URL. Try copying the text manually instead.')
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')           // Multiple spaces to single
      .replace(/\n\s*\n/g, '\n\n')    // Multiple newlines to double
      .replace(/\[.*?\]/g, '')        // Remove [edit] and similar
      .trim()
  }
}

export const urlImportService = new URLImportService()
