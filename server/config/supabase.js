import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.log('Make sure these are in your .env file:')
  console.log('  - SUPABASE_URL')
  console.log('  - SUPABASE_SERVICE_ROLE_KEY')
  throw new Error('Supabase credentials missing in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Verify Supabase user from JWT token
 * Returns user object or null
 */
export const verifySupabaseUser = async (token) => {
  try {
    if (!token || token === 'null' || token === 'undefined') {
      return null
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      // Don't log every error to avoid spam
      if (error.code !== 'bad_jwt') {
        console.error('Supabase auth error:', error.message)
      }
      return null
    }

    if (!user) {
      return null
    }

    // Return standardized user object
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0],
      avatar: user.user_metadata?.avatar_url || null
    }
  } catch (error) {
    console.error('❌ Error verifying user:', error.message)
    return null
  }
}
