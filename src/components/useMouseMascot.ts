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
  ciljIspunjen: boolean // za konfete, samo kad se ispuni dok je stranica otvorena
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

export function useMouseMascot(mis: MaskoHandle | null, { unosi, slavi, ljut, spava, greska, ciljIspunjen, brojUnosa }: StanjeMisa) {
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

// Konfete samo kad se cilj ispuni dok je stranica otvorena (ne pri svakom učitavanju dana koji je već ispunjen)
  const prosloIspunjen = useRef<boolean | null>(null)
  useEffect(() => {
    if (brojUnosa == null) return
    if (prosloIspunjen.current === false && ciljIspunjen) void konfete()
    prosloIspunjen.current = ciljIspunjen
  }, [ciljIspunjen, brojUnosa])

  // Novi unos ručno preko + (upis iz poruke mišu ide u slavlje): miš grickne, pa se vraća na stanje koje traje
  const prosliBroj = useRef<number | null>(null)
  useEffect(() => {
    if (brojUnosa == null) return
    if (mis && !slavi && prosliBroj.current != null && brojUnosa > prosliBroj.current) mis.fire('action::eat', { instant: true })
    prosliBroj.current = brojUnosa
  }, [mis, brojUnosa, slavi])
}

// Realističan burst preko cele aplikacije: dva topa sa strana i prasak iz sredine. Bez pokreta (prefers-reduced-motion) ništa.
async function konfete() {
  const { default: confetti } = await import('canvas-confetti')
  const zajedno = { disableForReducedMotion: true, zIndex: 40, ticks: 260, gravity: 0.9, scalar: 1.05 }
  void confetti({ ...zajedno, particleCount: 140, spread: 100, startVelocity: 48, origin: { x: 0.5, y: 0.65 } })
  void confetti({ ...zajedno, particleCount: 90, angle: 60, spread: 60, startVelocity: 62, origin: { x: 0, y: 0.8 } })
  void confetti({ ...zajedno, particleCount: 90, angle: 120, spread: 60, startVelocity: 62, origin: { x: 1, y: 0.8 } })
}
