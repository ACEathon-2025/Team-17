import mongoose from 'mongoose'

const analysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  indicators: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  detailedMetrics: {
    letterReversals: Number,
    spacingIssues: Number,
    formationIssues: Number,
    pressureVariation: Number
  },
  age: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for fast queries
analysisSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('Analysis', analysisSchema)
