// server/server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { connectDB } from './config/database.js'
import userRoutes from './routes/userRoutes.js'
import readingRoutes from './routes/readingRoutes.js'
import translationRoutes from './routes/translationRoutes.js'
import dictionaryRoutes from './routes/dictionaryRoutes.js'
import summarizationRoutes from './routes/summarizationRoutes.js'
import analysisRoutes from './routes/analysisRoutes.js'
import importRoutes from './routes/import.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'handwriting')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('✅ Created uploads/handwriting directory')
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/health'
  }
})

const frequentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false
})

const translationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: 'Translation rate limit exceeded. Please wait a moment.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/translation/health' || req.path === '/api/translation/languages'
  }
})

const analysisLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: 'Too many analysis requests. Please wait a moment.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: (req) => {
    return process.env.NODE_ENV === 'development'
  }
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ✅ CRITICAL: Serve static uploads BEFORE API routes
// This must come before any route handlers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
console.log('📁 Serving static files from:', path.join(__dirname, 'uploads'))

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
  })
}

// Routes with appropriate rate limiting
app.use('/api/users', frequentLimiter, userRoutes)
app.use('/api/reading', frequentLimiter, readingRoutes)
app.use('/api/translation', translationLimiter, translationRoutes)
app.use('/api/summarization', summarizationRoutes)
app.use('/api/dictionary', dictionaryRoutes)
app.use('/api/analysis', analysisLimiter, analysisRoutes)
app.use('/api/import', importRoutes)
app.use('/api/', generalLimiter)

// Health check endpoint (no rate limit)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'VOXA API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    features: {
      aiAnalysis: 'Active (Client-Side)',
      translation: 'Active',
      summarization: 'Active',
      tts: 'Active',
      fileUpload: 'Active'
    }
  })
})

// Graceful error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    })
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    })
  }

  // Handle multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      })
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    })
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  })
})

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down gracefully...')
  server.close(() => {
    console.log('✅ HTTP server closed')
    console.log('👋 Goodbye!')
    process.exit(0)
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70))
  console.log('🚀 VOXA Server Successfully Started!')
  console.log('='.repeat(70))
  console.log(`📍 Port: ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔒 CORS: ${process.env.NODE_ENV === 'production' ? 'production domains' : 'localhost:5173, 5174, 3000'}`)
  console.log(`⚡ Rate Limiting: 1000 req/15min (general)`)
  console.log(`🧠 AI Analysis: 50 req/min (client-side processing)`)
  console.log(`📁 Uploads Directory: ${uploadsDir}`)
  console.log('='.repeat(70))
  console.log('📡 API Endpoints:')
  console.log(`   ✓ Health Check: http://localhost:${PORT}/api/health`)
  console.log(`   ✓ Translation: http://localhost:${PORT}/api/translation`)
  console.log(`   ✓ AI Upload: http://localhost:${PORT}/api/analysis/upload`)
  console.log(`   ✓ AI Save: http://localhost:${PORT}/api/analysis/save`)
  console.log(`   ✓ Summarization: http://localhost:${PORT}/api/summarization`)
  console.log(`   ✓ Static Files: http://localhost:${PORT}/uploads/`)
  console.log('='.repeat(70))
  console.log('🧠 AI Processing: Client-Side (TensorFlow.js in Browser)')
  console.log('✅ Server Ready for Requests!')
  console.log('='.repeat(70) + '\n')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err)
  gracefulShutdown()
})

export default app
