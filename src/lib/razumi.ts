// Poziv Edge Function razumi-obrok (docs/api.md): tekst "šta sam jeo" → namirnice za pregled.
// AI ključ je na serveru; odavde ide samo tekst i token ulogovanog korisnika.
import { supabase } from './supabase'
import type { Jedinica, Makrosi, Obrok } from './ishrana'

// Vrednosti su po jedinici (na 100 g ili po komadu), kao kod proizvoda
export type Stavka = Makrosi & {
  ime: string
  kolicina: number
  jedinica: Jedinica
  obrok: Obrok | null
  izvor: 'baza' | 'procena'
  proizvod_id: string | null
}

const PORUKE: Record<string, string> = {
  prijava: 'Prijava je istekla. Prijavi se ponovo.',
  tekst: 'Napiši šta si jeo, najviše 500 znakova.',
  limit: 'Za danas sam pročitao dovoljno poruka. Dodaj ručno preko +.',
  ai_limit: 'Previše nas piše odjednom. Probaj za minut ili dodaj ručno preko +.',
}
const OPSTA = 'Ne mogu sad da pročitam. Proveri internet ili dodaj ručno preko +.'

export async function razumiObrok(tekst: string): Promise<Stavka[]> {
  const { data, error } = await supabase.functions.invoke('razumi-obrok', { body: { tekst } })
  if (error) {
    // Kod greške je u telu odgovora funkcije; bez odgovora (nema mreže) ostaje opšta poruka
    let kod = ''
    try { kod = (await (error as { context?: Response }).context?.json())?.greska ?? '' } catch { /* telo nije JSON */ }
    throw new Error(PORUKE[kod] ?? OPSTA)
  }
  return Array.isArray(data?.stavke) ? data.stavke : []
}
