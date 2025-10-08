import mongoose from 'mongoose'

const readingSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  textId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Reading Session'
  },
  content: {
    type: String,
    default: ''
  },
  sessionType: {
    type: String,
    enum: ['text-to-speech', 'translation', 'focus-mode', 'summarization', 'regular'],
    default: 'regular'
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  duration: {
    type: Number,
    default: 0 // in milliseconds
  },
  wordsRead: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Index for faster queries
readingSessionSchema.index({ userId: 1, createdAt: -1 })

readingSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  
  // Calculate wordsRead if not set
  if (!this.wordsRead && this.content) {
    this.wordsRead = this.content.split(/\s+/).filter(w => w.trim()).length
  }
  
  next()
})

export default mongoose.model('ReadingSession', readingSessionSchema)
