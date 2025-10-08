// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozvkeatjiinjgenqmnbm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dmtlYXRqaWluamdlbnFtbmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzE3MzksImV4cCI6MjA3NDY0NzczOX0.78brgIZnwbW-PtXUohtZbqpovmKb7ZAAqhCtBg0Q2fE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
