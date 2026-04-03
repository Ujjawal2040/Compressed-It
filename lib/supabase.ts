import { createClient } from '@supabase/supabase-js'

// We provide dummy fallbacks so the app doesn't crash on load without env vars,
// though actual authentication and database calls will fail until you provide real keys.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
