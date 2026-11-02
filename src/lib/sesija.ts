import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

// undefined = još proveravamo, null = nije ulogovan
export function useSesija(): Session | null | undefined {
  const [sesija, setSesija] = useState<Session | null | undefined>(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesija(data.session))
    const { data } = supabase.auth.onAuthStateChange((_d, s) => setSesija(s))
    return () => data.subscription.unsubscribe()
  }, [])
  return sesija
}
