import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  supabaseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  profile: {
    firstName: {
      type: String,
      default: 'User'
    },
    lastName: String,
    avatar: {
      type: String,
      default: '👤'
    },
    bio: String
  },
  settings: {
    fontSize: {
      type: String,
      default: 'medium',
      enum: ['small', 'medium', 'large', 'xl', 'xxl']
    },
    lineHeight: {
      type: String,
      default: 'normal',
      enum: ['tight', 'normal', 'relaxed', 'loose']
    },
    letterSpacing: {
      type: String,
      default: 'normal',
      enum: ['tight', 'normal', 'wide', 'wider']
    },
    fontFamily: {
      type: String,
      default: 'lexend'
    },
    wordSpacing: {
      type: String,
      default: 'normal'
    },
    readingSpeed: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    voice: {
      type: String,
      default: 'default'
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    highlightReading: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    dyslexiaFriendly: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    },
    focusModeSpeed: {
      type: Number,
      default: 200
    },
    focusWordByWord: {
      type: Boolean,
      default: false
    },
    focusPauseTime: {
      type: Number,
      default: 500
    },
    preferredTranslationLanguage: {
      type: String,
      default: 'es'
    },
    autoTranslate: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalTextsRead: {
      type: Number,
      default: 0
    },
    totalReadingTime: {
      type: Number,
      default: 0
    },
    readingStreak: {
      type: Number,
      default: 0
    },
    lastReadingDate: Date,
    averageSessionTime: {
      type: Number,
      default: 0
    }
  },
  readingSessions: [{
    textId: String,
    title: String,
    content: String,
    progress: Number,
    completed: Boolean,
    duration: Number,
    sessionType: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  achievements: [{
    id: String,
    title: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
})

// Index for faster queries
userSchema.index({ supabaseId: 1 })
userSchema.index({ email: 1 })

// Pre-save middleware to update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('User', userSchema)
