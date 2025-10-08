// server/server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import userRoutes from './routes/userRoutes.js'
import readingRoutes from './routes/readingRoutes.js'
import translationRoutes from './routes/translationRoutes.js'
import dictionaryRoutes from './routes/dictionaryRoutes.js';
import summarizationRoutes from './routes/summarizationRoutes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB

connectDB()

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


// FIXED: More lenient rate limiting to prevent 429 errors
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/health'
  }
})

// More lenient rate limit for frequent operations
const frequentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false
})

// SPECIAL: Very lenient rate limit for translation (auto-translate feature)
const translationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute (1 per second for auto-translate)
  message: 'Translation rate limit exceeded. Please wait a moment.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Don't rate limit health checks
    return req.path === '/api/translation/health' || req.path === '/api/translation/languages'
  }
})


app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))



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
// Translation gets its own rate limiter for auto-translate functionality
app.use('/api/translation', translationLimiter, translationRoutes)

app.use('/api/summarization', summarizationRoutes);

app.use('/api/dictionary', dictionaryRoutes);

app.use('/api/', generalLimiter)


// Health check endpoint (no rate limit)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'VOXA API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// Graceful error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    })
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    })
  }

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.originalUrl
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 VOXA Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔒 CORS enabled for: ${process.env.NODE_ENV === 'production' ? 'production domains' : 'localhost:5173, localhost:5174, localhost:3000'}`)
  console.log(`⚡ Rate limiting: 1000 requests per 15 minutes`)
  console.log(`🌐 Translation API: http://localhost:${PORT}/api/translation`)
})

export default app
