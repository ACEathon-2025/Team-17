/**
 * Utility functions to clean extracted text
 */

export const textCleaner = {
  /**
   * Remove excessive whitespace
   */
  removeExcessWhitespace(text) {
    return text
      .replace(/[ \t]+/g, ' ')        // Multiple spaces/tabs to single space
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Triple+ newlines to double
      .trim()
  },

  /**
   * Fix common OCR errors
   */
  fixOCRErrors(text) {
    return text
      .replace(/l\s+/g, 'I ')         // Lowercase L to uppercase I
      .replace(/\s+o\s+/g, ' 0 ')     // Lowercase o to zero
      .replace(/['']/g, "'")          // Smart quotes to regular
      .replace(/[""]/g, '"')          // Smart double quotes
      .replace(/…/g, '...')           // Ellipsis
  },

  /**
   * Remove page numbers and headers/footers
   */
  removePageArtifacts(text) {
    return text
      .replace(/^\d+\s*$/gm, '')      // Standalone numbers (page numbers)
      .replace(/^Page \d+$/gm, '')    // "Page X" headers
  },

  /**
   * Complete cleaning pipeline
   */
  clean(text) {
    return this.removePageArtifacts(
      this.fixOCRErrors(
        this.removeExcessWhitespace(text)
      )
    )
  }
}
