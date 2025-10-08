export const speedReadingService = {
  /**
   * Training levels
   */
  levels: [
    { 
      id: 1, 
      name: 'Beginner', 
      wpm: 150, 
      description: 'Comfortable pace for comprehension',
      icon: '🌱'
    },
    { 
      id: 2, 
      name: 'Intermediate', 
      wpm: 250, 
      description: 'Average reading speed',
      icon: '📖'
    },
    { 
      id: 3, 
      name: 'Advanced', 
      wpm: 350, 
      description: 'Fast reader pace',
      icon: '⚡'
    },
    { 
      id: 4, 
      name: 'Expert', 
      wpm: 450, 
      description: 'Speed reading territory',
      icon: '🚀'
    },
    { 
      id: 5, 
      name: 'Master', 
      wpm: 600, 
      description: 'Elite speed reader',
      icon: '🔥'
    }
  ],

  /**
   * Practice texts - Multiple per level for variety
   */
  practiceTexts: {
    1: [
      "Reading is a fundamental skill that opens doors to knowledge and imagination. When we read, our minds create pictures and understand ideas. Starting with simple texts helps build confidence. Take your time and focus on understanding every word. As you practice regularly, reading becomes easier and more enjoyable. Good readers don't rush. They comprehend what they read and remember the information. This foundation is essential for all learning.",
      
      "The ocean is home to millions of species. From tiny plankton to massive whales, marine life is incredibly diverse. Coral reefs provide shelter for colorful fish. Dolphins communicate using sounds and gestures. Sea turtles travel thousands of miles to lay eggs. The ocean covers most of Earth's surface and produces much of our oxygen. Protecting marine ecosystems is crucial for our planet's health and future generations.",
      
      "Learning a new skill requires patience and practice. Whether it's playing an instrument, speaking a language, or cooking, everyone starts as a beginner. Making mistakes is part of the process. Each attempt brings improvement. Setting small goals helps track progress. Celebrating small wins builds motivation. With consistent effort and a positive attitude, anyone can master new abilities. The key is to never give up.",
      
      "Technology has changed how we live and work. Computers help us solve complex problems quickly. The internet connects people across the globe instantly. Smartphones put information at our fingertips. Digital tools make learning accessible to everyone. However, technology should enhance human capabilities, not replace them. Finding balance between digital and real-world experiences is important for healthy living."
    ],
    
    2: [
      "Artificial intelligence represents one of the most significant technological advances of our time. Machine learning algorithms can now recognize patterns, make predictions, and even create art. From healthcare diagnostics to traffic optimization, AI applications continue to expand. However, these developments raise important ethical questions about privacy, bias, and human autonomy. As AI becomes more sophisticated, society must establish guidelines that ensure technology serves humanity's best interests while respecting fundamental rights.",
      
      "Climate change poses unprecedented challenges to global ecosystems. Rising temperatures cause ice caps to melt, sea levels to rise, and weather patterns to shift dramatically. Scientists observe increased frequency of extreme weather events worldwide. Agricultural systems face disruptions affecting food security. Renewable energy adoption, sustainable practices, and international cooperation are essential for mitigation. Individual actions combined with policy changes can make meaningful differences in reducing carbon footprints.",
      
      "The human brain contains approximately 86 billion neurons, each forming thousands of connections. This complexity enables consciousness, memory, and creativity. Neuroplasticity allows the brain to reorganize and adapt throughout life. Learning new skills strengthens neural pathways. Physical exercise increases blood flow to the brain, improving cognitive function. Mental health significantly impacts overall wellbeing. Understanding brain function helps optimize learning and maintain cognitive health as we age.",
      
      "Ancient civilizations developed remarkable innovations that still influence modern society. The Romans engineered aqueducts and roads spanning continents. Greeks contributed philosophy, democracy, and scientific methods. Egyptian pyramids demonstrate advanced mathematical knowledge. Chinese inventions include paper, printing, and gunpowder. These cultures laid foundations for contemporary technology, governance, and education. Studying history provides perspective on human achievement and helps avoid repeating past mistakes."
    ],
    
    3: [
      "Quantum computing leverages quantum mechanical phenomena to process information fundamentally differently than classical computers. While traditional bits exist as either zero or one, quantum bits (qubits) can exist in superposition states, simultaneously representing multiple values. This enables exponentially faster calculations for specific problem types. Quantum entanglement allows qubits to correlate instantly regardless of distance. Applications include cryptography, drug discovery, and optimization problems. However, maintaining quantum coherence requires extreme conditions, making practical implementation challenging.",
      
      "Neuroscience research reveals fascinating insights about consciousness and decision-making. Brain imaging studies show that unconscious processes often precede conscious awareness of choices. The prefrontal cortex manages executive functions like planning and impulse control. Emotional centers interact dynamically with rational thinking areas. Neuroplasticity demonstrates the brain's remarkable adaptability throughout life. Understanding these mechanisms has implications for education, mental health treatment, and artificial intelligence development.",
      
      "Sustainable architecture integrates environmental considerations throughout building design and construction. Passive solar heating reduces energy consumption. Green roofs provide insulation while managing stormwater. Recycled materials minimize waste and environmental impact. Smart building systems optimize resource usage based on occupancy and weather. Biophilic design incorporates natural elements, improving occupant wellbeing. As urban populations grow, sustainable construction becomes increasingly critical for reducing ecological footprints.",
      
      "Microbiome research uncovers the complex relationship between humans and trillions of microorganisms inhabiting our bodies. Gut bacteria influence digestion, immunity, and even mental health through the gut-brain axis. Diverse microbial communities correlate with better health outcomes. Antibiotics, diet, and lifestyle significantly impact microbiome composition. Probiotic interventions show promise for treating various conditions. This emerging field revolutionizes understanding of human health and disease prevention."
    ],
    
    4: [
      "Advanced machine learning architectures like transformers have revolutionized natural language processing capabilities. Self-attention mechanisms enable models to weigh contextual relationships between words dynamically, regardless of their positional distance in sequences. This paradigm shift from recurrent neural networks allows parallel processing, dramatically improving training efficiency. Transfer learning through pre-training on massive datasets enables fine-tuning for specific tasks with limited labeled data. However, these models' computational requirements and potential biases necessitate careful consideration in deployment.",
      
      "Quantum entanglement challenges classical intuitions about locality and information transfer. When particles become entangled, measuring one instantaneously affects the other's state, regardless of separation distance. Einstein famously called this 'spooky action at a distance.' Bell's theorem and subsequent experiments demonstrate that quantum mechanics cannot be explained by local hidden variables. These phenomena enable quantum cryptography protocols offering theoretically unbreakable security and form the basis for quantum teleportation experiments.",
      
      "Epigenetic modifications regulate gene expression without altering DNA sequences, profoundly impacting development and disease. Methylation patterns and histone modifications respond to environmental factors including diet, stress, and toxins. Remarkably, some epigenetic changes can be inherited across generations, suggesting mechanisms for transgenerational trauma and adaptation. Understanding epigenetics reveals how nature and nurture interact at molecular levels, opening therapeutic avenues for cancer, neurological disorders, and aging-related conditions.",
      
      "Contemporary economic theory grapples with digital transformation's impact on traditional market dynamics. Platform economies exhibit network effects where value increases exponentially with user base growth, creating winner-take-all scenarios. Cryptocurrency and blockchain technologies challenge conventional monetary systems and intermediary roles. Automation threatens employment across sectors while potentially increasing productivity. Universal basic income proposals address inequality and technological unemployment. These developments require reimagining economic frameworks and social contracts."
    ],
    
    5: [
      "Emergent properties in complex systems arise from interactions between components rather than from individual elements themselves. Consciousness emerging from neural networks, wetness from water molecules, and economic markets from individual transactions exemplify this phenomenon. Reductionist approaches fail to predict or explain such properties since higher-level behaviors cannot be deduced solely from lower-level rules. Understanding emergence requires examining systems holistically, accounting for feedback loops, non-linear dynamics, and phase transitions. This perspective fundamentally challenges traditional scientific methodologies.",
      
      "Relativistic physics demonstrates space and time's intrinsic interconnection within the fabric of spacetime. Einstein's general relativity describes gravity not as a force but as spacetime curvature caused by mass-energy. This framework successfully predicts phenomena including gravitational waves, black holes, and cosmological expansion. Quantum field theory reconciles relativity with quantum mechanics for three fundamental forces. However, integrating general relativity with quantum theory remains physics' greatest unsolved challenge, with quantum gravity theories like string theory and loop quantum gravity offering potential solutions.",
      
      "Metalinguistic analysis examines language's structural properties and meaning-making processes at abstract levels. Phonological patterns, morphological rules, syntactic structures, and semantic relationships operate according to systematic principles. Pragmatics investigates context-dependent interpretation and speech acts' illocutionary force. Sociolinguistic variation reflects identity, power dynamics, and cultural values. Computational linguistics applies algorithmic approaches to language processing. Understanding metalinguistic phenomena illuminates cognition's nature and facilitates cross-cultural communication.",
      
      "Advanced cryptographic protocols leverage mathematical complexity for securing digital communications. Public-key systems rely on computational asymmetry between encryption and decryption operations. Elliptic curve cryptography provides equivalent security with smaller key sizes compared to RSA. Zero-knowledge proofs enable authentication without revealing underlying information. Homomorphic encryption allows computations on encrypted data without decryption. Quantum computing threatens current cryptographic standards, driving development of post-quantum algorithms resistant to quantum attacks."
    ]
  },

  /**
   * Comprehension questions - Multiple sets per level
   */
  questionSets: {
    1: [
      [
        { question: "What is the main topic of this text?", options: ["Reading skills", "Mathematics", "Sports", "Cooking"], correct: 0 },
        { question: "According to the text, what helps build confidence?", options: ["Rushing through", "Simple texts", "Difficult books", "Speed reading"], correct: 1 }
      ],
      [
        { question: "What produces much of Earth's oxygen?", options: ["Forests", "The ocean", "Grass", "Mountains"], correct: 1 },
        { question: "How far do sea turtles travel?", options: ["Few miles", "Hundreds of miles", "Thousands of miles", "They don't travel"], correct: 2 }
      ],
      [
        { question: "What is part of the learning process?", options: ["Perfection", "Avoiding mistakes", "Making mistakes", "Quick mastery"], correct: 2 },
        { question: "What builds motivation?", options: ["Big goals", "Celebrating small wins", "Competition", "Pressure"], correct: 1 }
      ],
      [
        { question: "What has technology changed?", options: ["Nothing", "How we live and work", "Only work", "Only communication"], correct: 1 },
        { question: "What is important according to the text?", options: ["Using technology constantly", "Avoiding technology", "Finding balance", "Only digital experiences"], correct: 2 }
      ]
    ],
    2: [
      [
        { question: "What is a key concern about AI?", options: ["Speed", "Ethical questions", "Cost", "Size"], correct: 1 },
        { question: "AI applications are found in which areas?", options: ["Only gaming", "Healthcare and traffic", "Only research", "None"], correct: 1 }
      ],
      [
        { question: "What causes ice caps to melt?", options: ["Winter", "Rising temperatures", "Ocean currents", "Wind"], correct: 1 },
        { question: "What is essential for climate mitigation?", options: ["Ignoring the problem", "Individual actions only", "International cooperation", "Waiting"], correct: 2 }
      ],
      [
        { question: "How many neurons does the brain contain?", options: ["1 billion", "10 billion", "86 billion", "100 billion"], correct: 2 },
        { question: "What improves cognitive function?", options: ["Staying still", "Physical exercise", "Less sleep", "Stress"], correct: 1 }
      ],
      [
        { question: "What did Romans engineer?", options: ["Computers", "Aqueducts and roads", "Airplanes", "Phones"], correct: 1 },
        { question: "Why study history?", options: ["It's required", "For perspective", "It's easy", "No reason"], correct: 1 }
      ]
    ],
    3: [
      [
        { question: "What can qubits do that classical bits cannot?", options: ["Store data", "Exist in superposition", "Process quickly", "Connect to internet"], correct: 1 },
        { question: "What makes quantum computing challenging?", options: ["Cost only", "Size", "Maintaining quantum coherence", "Programming"], correct: 2 }
      ],
      [
        { question: "Which brain area manages executive functions?", options: ["Cerebellum", "Prefrontal cortex", "Hippocampus", "Amygdala"], correct: 1 },
        { question: "What demonstrates brain adaptability?", options: ["Fixed structure", "Neuroplasticity", "Size", "Weight"], correct: 1 }
      ],
      [
        { question: "What do green roofs provide?", options: ["Only decoration", "Insulation and stormwater management", "Just plants", "Color"], correct: 1 },
        { question: "Why is sustainable construction critical?", options: ["Looks good", "Growing urban populations", "Cheaper", "Easier"], correct: 1 }
      ],
      [
        { question: "How do gut bacteria affect health?", options: ["They don't", "Through digestion, immunity, and mental health", "Only digestion", "Only immunity"], correct: 1 },
        { question: "What impacts microbiome composition?", options: ["Nothing", "Only diet", "Antibiotics, diet, and lifestyle", "Only age"], correct: 2 }
      ]
    ],
    4: [
      [
        { question: "What mechanism do transformers use?", options: ["Rotation", "Self-attention", "Compression", "Encryption"], correct: 1 },
        { question: "What paradigm did transformers shift from?", options: ["Logic programming", "Recurrent neural networks", "Expert systems", "Decision trees"], correct: 1 }
      ],
      [
        { question: "What did Einstein call quantum entanglement?", options: ["Magic", "Spooky action at a distance", "Impossible", "Simple"], correct: 1 },
        { question: "What does entanglement enable?", options: ["Time travel", "Quantum cryptography", "Teleportation to past", "Nothing practical"], correct: 1 }
      ],
      [
        { question: "Do epigenetic changes alter DNA sequences?", options: ["Yes, always", "No", "Sometimes", "Unknown"], correct: 1 },
        { question: "Can epigenetic changes be inherited?", options: ["Never", "Yes, some can", "Always", "Only in plants"], correct: 1 }
      ],
      [
        { question: "What do platform economies exhibit?", options: ["Linear growth", "Network effects", "Decline", "No pattern"], correct: 1 },
        { question: "What threatens employment across sectors?", options: ["Nothing", "Automation", "Education", "Healthcare"], correct: 1 }
      ]
    ],
    5: [
      [
        { question: "Where do emergent properties arise from?", options: ["Individual elements", "Interactions between components", "External forces", "Randomness"], correct: 1 },
        { question: "What approaches fail for emergent properties?", options: ["Holistic", "Reductionist", "Systematic", "Integrated"], correct: 1 }
      ],
      [
        { question: "How does general relativity describe gravity?", options: ["As a force", "As spacetime curvature", "As attraction", "As magnetism"], correct: 1 },
        { question: "What is physics' greatest unsolved challenge?", options: ["Dark matter", "Integrating relativity with quantum theory", "Speed of light", "Big Bang"], correct: 1 }
      ],
      [
        { question: "What does pragmatics investigate?", options: ["Grammar only", "Context-dependent interpretation", "Pronunciation", "Writing"], correct: 1 },
        { question: "What reflects identity and power dynamics?", options: ["Grammar", "Sociolinguistic variation", "Spelling", "Punctuation"], correct: 1 }
      ],
      [
        { question: "What does elliptic curve cryptography provide?", options: ["Less security", "Equivalent security with smaller keys", "Faster speed only", "Visual encryption"], correct: 1 },
        { question: "What threatens current cryptographic standards?", options: ["Nothing", "Quantum computing", "AI", "Hackers"], correct: 1 }
      ]
    ]
  },

  /**
   * Get random practice text for level
   */
  getPracticeText(level) {
    const texts = this.practiceTexts[level]
    if (!texts || texts.length === 0) {
      return this.practiceTexts[1][0]
    }
    const randomIndex = Math.floor(Math.random() * texts.length)
    return texts[randomIndex]
  },

  /**
   * Get random question set for level
   */
  getComprehensionQuestions(level) {
    const questionSets = this.questionSets[level]
    if (!questionSets || questionSets.length === 0) {
      return this.questionSets[1][0]
    }
    const randomIndex = Math.floor(Math.random() * questionSets.length)
    return questionSets[randomIndex]
  },

  /**
   * Calculate WPM
   */
  calculateWPM(wordCount, durationMs) {
    const minutes = durationMs / 60000
    return Math.round(wordCount / minutes)
  },

  /**
   * Get level for WPM
   */
  getLevelForWPM(wpm) {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (wpm >= this.levels[i].wpm) {
        return this.levels[i]
      }
    }
    return this.levels[0]
  },

  /**
   * Get next level
   */
  getNextLevel(currentWPM) {
    const currentLevel = this.getLevelForWPM(currentWPM)
    const currentIndex = this.levels.findIndex(l => l.id === currentLevel.id)
    
    if (currentIndex < this.levels.length - 1) {
      return this.levels[currentIndex + 1]
    }
    return null
  },

  /**
   * Calculate improvement
   */
  calculateImprovement(oldWPM, newWPM) {
    if (oldWPM === 0) return 0
    return Math.round(((newWPM - oldWPM) / oldWPM) * 100)
  },

  /**
   * Get recommendation
   */
  getRecommendation(wpm, comprehension) {
    if (comprehension < 70) {
      return {
        type: 'slow-down',
        icon: '🎯',
        message: 'Focus on comprehension first. Speed will come with practice.',
        action: 'Try a slower pace to improve understanding'
      }
    } else if (wpm < 200) {
      return {
        type: 'increase-speed',
        icon: '⚡',
        message: 'Great comprehension! Ready to increase speed.',
        action: 'Try the next level to challenge yourself'
      }
    } else if (wpm < 350) {
      return {
        type: 'learn-techniques',
        icon: '🧠',
        message: 'Learn speed reading techniques to break through.',
        action: 'Practice chunking and reduce subvocalization'
      }
    } else {
      return {
        type: 'maintain',
        icon: '🔥',
        message: 'Excellent speed! Maintain this with regular practice.',
        action: 'Challenge yourself with difficult texts'
      }
    }
  }
}
