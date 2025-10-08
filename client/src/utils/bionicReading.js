export const bionicReading = {
  convert(text, intensity = 0.5) {
    if (!text) return ''
    
    const words = text.split(/(\s+)/)
    
    return words.map(word => {
      if (/^\s+$/.test(word)) return word
      return this.processWord(word, intensity)
    }).join('')
  },

  processWord(word, intensity) {
    if (word.length <= 1) return word
    
    const punctuationMatch = word.match(/([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/)
    
    if (!punctuationMatch) return word
    
    const mainWord = punctuationMatch[1]
    const punctuation = punctuationMatch[2] || ''
    
    const boldLength = Math.ceil(mainWord.length * intensity)
    const boldPart = mainWord.slice(0, boldLength)
    const normalPart = mainWord.slice(boldLength)
    
    return `<strong>${boldPart}</strong>${normalPart}${punctuation}`
  },

  convertForReact(text, intensity = 0.5) {
    if (!text) return []
    
    const words = text.split(/(\s+)/)
    
    return words.map((word, index) => {
      if (/^\s+$/.test(word)) {
        return { type: 'space', content: word, key: index }
      }
      
      return this.processWordForReact(word, intensity, index)
    })
  },

  processWordForReact(word, intensity, index) {
    if (word.length <= 1) {
      return { type: 'word', bold: word, normal: '', punctuation: '', key: index }
    }
    
    const punctuationMatch = word.match(/([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/)
    
    if (!punctuationMatch) {
      return { type: 'word', bold: word, normal: '', punctuation: '', key: index }
    }
    
    const mainWord = punctuationMatch[1]
    const punctuation = punctuationMatch[2] || ''
    
    const boldLength = Math.ceil(mainWord.length * intensity)
    const boldPart = mainWord.slice(0, boldLength)
    const normalPart = mainWord.slice(boldLength)
    
    return {
      type: 'word',
      bold: boldPart,
      normal: normalPart,
      punctuation: punctuation,
      key: index
    }
  }
}
