// Poziv Edge Function razumi-obrok (docs/api.md): tekst "šta sam jeo" → namirnice za pregled.
// AI ključ je na serveru; odavde ide samo tekst i token ulogovanog korisnika.
import { supabase } from './supabase'
import type { Jedinica, Makrosi, Obrok } from './ishrana'
import { porukaZaGresku } from './razumiPoruke'

// Vrednosti su po jedinici (na 100 g ili po komadu), kao kod proizvoda
export type Stavka = Makrosi & {
  ime: string
  kolicina: number
  jedinica: Jedinica
  obrok: Obrok | null
  izvor: 'baza' | 'procena'
  proizvod_id: string | null
}

// rucno: poruka savetuje ručni unos i sačuvana jela (na početnoj); u Laboratoriji toga nema, pa tamo false
export async function razumiObrok(tekst: string, rucno = true): Promise<Stavka[]> {
  const { data, error } = await supabase.functions.invoke('razumi-obrok', { body: { tekst } })
  if (error) {
    // Kod greške je u telu odgovora funkcije (context je njen Response); bez context-a funkcija nije odgovorila (nema mreže)
    const odgovor = (error as { context?: Response }).context
    let kod = ''
    try { kod = (await odgovor?.json())?.greska ?? '' } catch { /* telo nije JSON */ }
    throw new Error(porukaZaGresku(kod, !!odgovor, rucno))
  }
  return Array.isArray(data?.stavke) ? data.stavke : []
}
