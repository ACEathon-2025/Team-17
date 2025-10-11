import { verifySupabaseUser } from '../config/supabase.js'

/**
 * Required authentication middleware
 * Blocks request if user is not authenticated
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Please sign in.' 
      })
    }

    const token = authHeader.replace('Bearer ', '').trim()
    
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authentication token.' 
      })
    }

    const user = await verifySupabaseUser(token)
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Session expired. Please sign in again.' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message)
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed. Please sign in again.' 
    })
  }
}

/**
 * Optional authentication middleware
 * Continues even if user is not authenticated
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    // No auth header - continue without user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null
      return next()
    }

    const token = authHeader.replace('Bearer ', '').trim()
    
    // Invalid token format - continue without user
    if (!token || token === 'null' || token === 'undefined') {
      req.user = null
      return next()
    }

    // Try to verify user
    const user = await verifySupabaseUser(token)
    req.user = user || null
    
    next()
  } catch (error) {
    // Auth failed but that's OK for optional auth
    console.log('⚠️  Optional auth failed:', error.message)
    req.user = null
    next()
  }
}

export default { authenticateUser, optionalAuth }
