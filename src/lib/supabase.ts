import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Nedostaju VITE_SUPABASE_URL ili VITE_SUPABASE_PUBLISHABLE_KEY u .env (vidi .env.example)')
}

// Jedini Supabase klijent u app-u; sesija se čuva i osvežava automatski (refresh token).
export const supabase = createClient(url, key)
