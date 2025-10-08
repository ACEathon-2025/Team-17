// server/middlewares/auth.js
import { verifySupabaseUser } from '../config/supabase.js'

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    const user = await verifySupabaseUser(token)
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ message: 'Invalid token.' })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (token) {
      const user = await verifySupabaseUser(token)
      if (user) {
        req.user = user
      }
    }
    
    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}