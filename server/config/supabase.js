// server/config/supabase.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config() // <-- load .env variables at the top

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing in environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const verifySupabaseUser = async (token) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error verifying Supabase user:', error)
    return null
  }
}
