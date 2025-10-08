export const quizService = {
  /**
   * Generate comprehension quiz from text
   * @param {string} text - The text to create quiz from
   * @param {number} numQuestions - Number of questions (default 5)
   * @returns {Array} Array of quiz questions
   */
  generateQuiz(text, numQuestions = 5) {
    if (!text || text.trim().length < 100) {
      return []
    }

    const sentences = text.match(/[^.!?]+[.!?]+/g) || []
    
    if (sentences.length < 5) {
      return []
    }

    const questions = []
    const usedSentences = new Set()

    // Question templates
    const templates = [
      {
        type: 'main-idea',
        question: 'What is the main idea of this text?',
        generator: this.generateMainIdeaQuestion
      },
      {
        type: 'detail',
        question: 'According to the text, which statement is true?',
        generator: this.generateDetailQuestion
      },
      {
        type: 'inference',
        question: 'Based on the text, what can we infer?',
        generator: this.generateInferenceQuestion
      },
      {
        type: 'vocabulary',
        question: 'What does [WORD] mean in this context?',
        generator: this.generateVocabularyQuestion
      }
    ]

    // Generate questions
    while (questions.length < numQuestions && questions.length < templates.length) {
      const template = templates[questions.length % templates.length]
      const question = template.generator.call(this, text, sentences, usedSentences)
      
      if (question) {
        questions.push({
          id: questions.length + 1,
          type: template.type,
          ...question
        })
      }
    }

    return questions
  },

  /**
   * Generate main idea question
   */
  generateMainIdeaQuestion(text, sentences) {
    const firstSentence = sentences[0]?.trim()
    const words = text.split(/\s+/)
    
    // Extract key topics (words that appear frequently)
    const wordFreq = {}
    words.forEach(word => {
      const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
      if (cleaned.length > 4) {
        wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1
      }
    })

    const keyTopics = Object.entries(wordFreq)
      .filter(([word, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word)

    const mainTopic = keyTopics[0] || 'reading'

    return {
      question: 'What is the main topic discussed in this text?',
      options: [
        `The importance of ${mainTopic}`,
        `How to improve ${keyTopics[1] || 'skills'}`,
        `The history of ${keyTopics[2] || 'learning'}`,
        `Different types of ${mainTopic}`
      ],
      correctAnswer: 0,
      explanation: `The text primarily discusses ${mainTopic}, which appears multiple times throughout.`
    }
  },

  /**
   * Generate detail question from specific sentence
   */
  generateDetailQuestion(text, sentences, usedSentences) {
    // Find a sentence with specific details (numbers, names, etc.)
    const detailSentence = sentences.find((s, i) => 
      !usedSentences.has(i) && 
      (s.match(/\d+/) || s.length > 50)
    )

    if (!detailSentence) {
      return null
    }

    usedSentences.add(sentences.indexOf(detailSentence))

    // Extract a fact from the sentence
    const fact = detailSentence.trim().replace(/[.!?]+$/, '')

    return {
      question: 'According to the text, which statement is correct?',
      options: [
        fact,
        this.generateDistractor(fact, 'opposite'),
        this.generateDistractor(fact, 'similar'),
        this.generateDistractor(fact, 'unrelated')
      ],
      correctAnswer: 0,
      explanation: `This information is stated directly in the text.`
    }
  },

  /**
   * Generate inference question
   */
  generateInferenceQuestion(text) {
    const hasPositiveTone = text.match(/\b(good|great|excellent|benefit|improve|positive)\b/i)
    const hasChallenge = text.match(/\b(however|challenge|difficult|problem|issue)\b/i)

    let inference = ''
    let distractors = []

    if (hasPositiveTone && hasChallenge) {
      inference = 'The topic has both benefits and challenges'
      distractors = [
        'The topic is entirely positive',
        'The topic should be avoided',
        'There are no challenges mentioned'
      ]
    } else if (hasPositiveTone) {
      inference = 'The author views the topic favorably'
      distractors = [
        'The author is critical of the topic',
        'The topic is controversial',
        'The author is neutral'
      ]
    } else {
      inference = 'The text presents information objectively'
      distractors = [
        'The text is highly opinionated',
        'The author strongly disagrees',
        'The text is promotional'
      ]
    }

    return {
      question: 'What can we infer from this text?',
      options: [
        inference,
        ...distractors
      ],
      correctAnswer: 0,
      explanation: `Based on the language and tone used, we can make this inference.`
    }
  },

  /**
   * Generate vocabulary question
   */
  generateVocabularyQuestion(text) {
    // Find a complex word (7+ letters)
    const words = text.match(/\b[a-z]{7,}\b/gi) || []
    
    if (words.length === 0) {
      return null
    }

    const targetWord = words[Math.floor(Math.random() * Math.min(words.length, 10))]
    
    // Simple definitions (you can enhance this)
    const definitions = {
      'important': ['significant', 'trivial', 'optional', 'rare'],
      'develop': ['create or improve', 'destroy', 'ignore', 'copy'],
      'benefit': ['advantage', 'disadvantage', 'cost', 'requirement'],
      'challenge': ['difficult task', 'easy solution', 'simple idea', 'basic need'],
      'improve': ['make better', 'make worse', 'keep same', 'remove'],
      'essential': ['necessary', 'optional', 'forbidden', 'unknown']
    }

    const word = targetWord.toLowerCase()
    const options = definitions[word] || [
      'related to the topic',
      'unrelated concept',
      'opposite meaning',
      'technical term'
    ]

    return {
      question: `What does "${targetWord}" mean in this context?`,
      options: options,
      correctAnswer: 0,
      explanation: `In this context, "${targetWord}" refers to ${options[0]}.`
    }
  },

  /**
   * Generate distractor (wrong answer)
   */
  generateDistractor(fact, type) {
    const words = fact.split(' ')
    
    switch (type) {
      case 'opposite':
        return fact.replace(/\b(is|are|was|were)\b/i, (match) => 
          match.toLowerCase() === 'is' || match.toLowerCase() === 'was' ? 'is not' : 'are not'
        )
      
      case 'similar':
        // Change a key word
        if (words.length > 3) {
          const newWords = [...words]
          newWords[Math.floor(words.length / 2)] = 'different'
          return newWords.join(' ')
        }
        return fact + ' and more'
      
      case 'unrelated':
        return 'This topic is not discussed in the text'
      
      default:
        return 'None of the above'
    }
  },

  /**
   * Calculate quiz score
   */
  calculateScore(answers, questions) {
    let correct = 0
    
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    
    return {
      correct,
      total: questions.length,
      percentage,
      passed: percentage >= 70,
      grade: this.getGrade(percentage)
    }
  },

  /**
   * Get letter grade
   */
  getGrade(percentage) {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }
}
