// server/models/User.model.js
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
    lowercase: true
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
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
    language: {
      type: String,
      default: 'en'
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
    lastReadingDate: Date
  },
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
})

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('User', userSchema)