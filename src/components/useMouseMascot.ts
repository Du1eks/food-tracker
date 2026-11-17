// Javlja živom mišu (Masko canvas "Miš u aplikaciji", ZiviMis.tsx) šta se dešava u aplikaciji.
// Stanja koja traju su set (spava, slavi, ljut), a jedenje je okidač koji se ponavlja dok kucaš. Klik šalje ZiviMis.
// Uvek je upaljeno najviše jedno stanje, po prioritetu: jede > slavi > ljut > spava > miruje.
// Ulaz canvasa za ljutnju se zove action::over_limit (iz prvog dogovora), a pali se kad dugo nisi jeo i na grešku pri unosu.
import { useEffect, useRef, useState } from 'react'
import type { MaskoHandle } from '@masko/player/react'

export type StanjeMisa = {
  unosi: boolean // u polju je tekst ili pregled obroka: jede
  slavi: boolean // upravo upisano ili cilj ispunjen
  ljut: boolean // dugo nisi jeo (gladan)
  spava: boolean // noć
  greska: string // greška pri unosu: miš se kratko naljuti
  brojUnosa: number | null // null dok se unosi učitavaju; novi unos = miš grickne
}

const LJUT_NA_GRESKU = 2300 // ms, koliko traje klip ljut
const RAZMAK_JEDENJA = 1800 // ms, koliko traje klip jede

// Trenutno vreme koje se osvežava svakog minuta (za noć i za "dugo nisi jeo")
export function useSad() {
  const [sad, setSad] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setSad(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  return sad
}

export function useMouseMascot(mis: MaskoHandle | null, { unosi, slavi, ljut, spava, greska, brojUnosa }: StanjeMisa) {
  const [ljutNaGresku, setLjutNaGresku] = useState(false)
  useEffect(() => {
    if (!greska) return
    setLjutNaGresku(true) // eslint-disable-line react-hooks/set-state-in-effect -- greška dolazi spolja, a ljutnja traje koliko klip
    const t = setTimeout(() => setLjutNaGresku(false), LJUT_NA_GRESKU)
    return () => clearTimeout(t)
  }, [greska])

  useEffect(() => {
    if (!mis) return
    const s = !unosi && slavi
    const l = !unosi && !s && (ljut || ljutNaGresku)
    mis.set('action::celebrating', s)
    mis.set('action::over_limit', l)
    mis.set('action::sleeping', !unosi && !s && !l && spava)
  }, [mis, unosi, slavi, ljut, ljutNaGresku, spava])

  // Jedenje je jednokratan okidač, pa se ponavlja dok je u polju tekst ili pregled obroka
  useEffect(() => {
    if (!mis || !unosi) return
    mis.fire('action::eat', { instant: true })
    const t = window.setInterval(() => mis.fire('action::eat', { instant: true }), RAZMAK_JEDENJA)
    return () => window.clearInterval(t)
  }, [mis, unosi])

  // Novi unos ručno preko + (upis iz poruke mišu ide u slavlje): miš grickne, pa se vraća na stanje koje traje
  const prosliBroj = useRef<number | null>(null)
  useEffect(() => {
    if (brojUnosa == null) return
    if (mis && !slavi && prosliBroj.current != null && brojUnosa > prosliBroj.current) mis.fire('action::eat', { instant: true })
    prosliBroj.current = brojUnosa
  }, [mis, brojUnosa, slavi])
}
