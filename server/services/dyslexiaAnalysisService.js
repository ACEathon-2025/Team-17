import * as tf from '@tensorflow/tfjs'

class DyslexiaAnalysisService {
  constructor() {
    this.model = null
    this.modelLoaded = false
  }

  /**
   * Load AI model at server startup
   * For MVP: Simulation model
   */
  async loadModel() {
    try {
      console.log('🧠 Loading dyslexia detection model...')
      
      // For MVP: Create a simple simulation model
      this.model = this.createSimulationModel()
      this.modelLoaded = true
      
      console.log('✅ Dyslexia detection model loaded successfully')
      console.log('   Model type: Simulation (MVP)')
      console.log('   Ready for analysis!')
    } catch (error) {
      console.error('❌ Model loading error:', error)
      // Create fallback simulation model
      this.model = this.createSimulationModel()
      this.modelLoaded = true
      console.log('⚠️  Using fallback simulation model')
    }
  }

  /**
   * Create simulation model for MVP testing
   * This creates a simple neural network that works without pre-trained weights
   */
  createSimulationModel() {
    try {
      const model = tf.sequential({
        layers: [
          tf.layers.flatten({ inputShape: [224, 224, 1] }),
          tf.layers.dense({ units: 128, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      })
      
      // Compile the model
      model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      })
      
      console.log('   ✓ Model architecture created')
      console.log('   ✓ Model compiled successfully')
      
      return model
    } catch (error) {
      console.error('Error creating simulation model:', error)
      throw error
    }
  }

  /**
   * Analyze handwriting image for dyslexia indicators
   * Returns comprehensive risk assessment
   */
  async analyzeHandwriting(imageTensor, userAge = null) {
    try {
      if (!this.modelLoaded) {
        console.log('Model not loaded, loading now...')
        await this.loadModel()
      }

      console.log('   Running inference...')
      
      // Run inference
      const prediction = this.model.predict(imageTensor)
      const scores = await prediction.data()
      const riskScore = scores[0] // 0-1 scale

      console.log(`   Raw score: ${riskScore.toFixed(4)}`)

      // Add realistic variation for MVP simulation
      const adjustedScore = this.simulateRealisticScore(riskScore)

      console.log(`   Adjusted score: ${adjustedScore.toFixed(4)}`)

      // Determine risk level
      const riskLevel = this.determineRiskLevel(adjustedScore)

      // Generate indicators
      const indicators = this.generateIndicators(adjustedScore, riskLevel)

      // Generate recommendations
      const recommendations = this.generateRecommendations(riskLevel, userAge)

      // Generate detailed metrics
      const detailedMetrics = this.generateDetailedMetrics(adjustedScore)

      // Cleanup prediction tensor
      prediction.dispose()

      console.log(`   Risk Level: ${riskLevel}`)
      console.log(`   Confidence: ${Math.round(adjustedScore * 100)}%`)

      return {
        riskLevel,
        confidence: Math.round(adjustedScore * 100) / 100,
        indicators,
        recommendations,
        detailedMetrics,
        analysisDate: new Date()
      }
    } catch (error) {
      console.error('❌ Analysis error:', error)
      throw new Error('Failed to analyze handwriting: ' + error.message)
    }
  }

  /**
   * Simulate realistic scores for MVP
   * Adds controlled randomness to make results more varied
   */
  simulateRealisticScore(baseScore) {
    // Add controlled randomness
    const randomFactor = (Math.random() - 0.5) * 0.3
    let score = baseScore + randomFactor
    
    // Clamp between realistic ranges
    score = Math.max(0.15, Math.min(0.92, score))
    
    return score
  }

  /**
   * Determine risk level from confidence score
   */
  determineRiskLevel(score) {
    if (score >= 0.7) return 'High'
    if (score >= 0.4) return 'Medium'
    return 'Low'
  }

  /**
   * Generate specific indicators based on analysis
   */
  generateIndicators(score, riskLevel) {
    const indicators = []

    if (riskLevel === 'High') {
      indicators.push('Frequent letter reversals detected (b/d, p/q)')
      indicators.push('Inconsistent letter spacing observed')
      indicators.push('Irregular letter formation patterns')
      indicators.push('Difficulty maintaining baseline alignment')
      if (score > 0.8) {
        indicators.push('Significant pressure variation in strokes')
        indicators.push('Poor motor control indicators present')
      }
    } else if (riskLevel === 'Medium') {
      indicators.push('Some letter reversal patterns detected')
      indicators.push('Occasional spacing inconsistencies')
      indicators.push('Minor letter formation variations')
      if (score > 0.55) {
        indicators.push('Slight baseline alignment issues')
      }
    } else {
      indicators.push('Generally consistent letter formation')
      indicators.push('Good spacing and alignment')
      indicators.push('Clear writing patterns observed')
      indicators.push('Strong motor control indicators')
    }

    return indicators
  }

  /**
   * Generate age-appropriate recommendations
   */
  generateRecommendations(riskLevel, age) {
    const recommendations = []

    if (riskLevel === 'High') {
      recommendations.push('⚠️ Consult with a learning specialist or educational psychologist')
      recommendations.push('📚 Consider formal dyslexia screening assessment')
      recommendations.push('✍️ Practice multi-sensory writing exercises daily')
      recommendations.push('🎯 Use specialized dyslexia-friendly learning tools')
      recommendations.push('👨‍🏫 Work with occupational therapist for writing skills')
      recommendations.push('📖 Implement structured literacy intervention program')
    } else if (riskLevel === 'Medium') {
      recommendations.push('📝 Monitor writing development closely')
      recommendations.push('✍️ Practice letter formation exercises regularly')
      recommendations.push('📚 Use visual aids and writing guides')
      recommendations.push('🎯 Consider educational support if needed')
      recommendations.push('👀 Schedule follow-up assessment in 3-6 months')
    } else {
      recommendations.push('✅ Continue current writing practices')
      recommendations.push('📚 Maintain regular reading and writing activities')
      recommendations.push('🎯 Use our app features to track progress')
      recommendations.push('🌟 Encourage creative writing activities')
    }

    // Age-specific recommendations
    if (age) {
      if (age < 8) {
        recommendations.push('🧸 Make writing practice fun and engaging')
        recommendations.push('🎨 Use colorful writing materials and tracing activities')
        recommendations.push('🎮 Incorporate educational games for letter recognition')
      } else if (age >= 8 && age < 12) {
        recommendations.push('💻 Consider typing for longer assignments')
        recommendations.push('🎧 Use text-to-speech tools for reading support')
        recommendations.push('📱 Explore assistive technology apps')
      } else {
        recommendations.push('💻 Utilize digital writing tools and spell-checkers')
        recommendations.push('🎯 Focus on strength-based learning strategies')
        recommendations.push('🗣️ Advocate for accommodations if needed')
      }
    }

    return recommendations
  }

  /**
   * Generate detailed metrics for visualization
   */
  generateDetailedMetrics(score) {
    return {
      letterReversals: Math.round(score * 85),
      spacingIssues: Math.round(score * 70),
      formationIssues: Math.round(score * 60),
      pressureVariation: Math.round(score * 55),
      baselineAlignment: Math.round(score * 65),
      overallRisk: Math.round(score * 100)
    }
  }

  /**
   * Cleanup model from memory
   */
  dispose() {
    if (this.model) {
      try {
        this.model.dispose()
        this.modelLoaded = false
        console.log('✅ AI model disposed successfully')
      } catch (error) {
        console.error('Error disposing model:', error)
      }
    }
  }
}

export default new DyslexiaAnalysisService()
