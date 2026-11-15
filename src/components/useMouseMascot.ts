// Iz stanja aplikacije javlja živom mišu šta se dešava (Masko canvas "Miš u aplikaciji"):
// set drži stanje (spava, slavi, ljut), fire šalje jedan događaj (jede). Klik šalje ZiviMis.
// Ulaz canvasa za ljutnju se zove action::over_limit (iz prvog dogovora), a pali se na grešku i na poslednje mesto na rang listi.
import { useEffect, useRef, useState } from 'react'
import type { MaskoHandle } from '@masko/player/react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { rang, stanjeMisa, type CiljMisa } from '../lib/rang'

export type StanjeAplikacije = {
  uneto: { kcal: number; proteini: number }
  cilj: CiljMisa | null
  brojUnosa: number | null // null dok se unosi učitavaju
  greska: string // greška pri unosu: miš se kratko naljuti
  profilId: string | null // za rang: poslednji na rang listi = ljut
}

const LJUT_NA_GRESKU = 2300 // ms, koliko traje klip ljut

export function useMouseMascot(mis: MaskoHandle | null, { uneto, cilj, brojUnosa, greska, profilId }: StanjeAplikacije) {
  const [sat, setSat] = useState(() => new Date().getHours())
  useEffect(() => {
    const t = setInterval(() => setSat(new Date().getHours()), 60_000)
    return () => clearInterval(t)
  }, [])

  const [ljutNaGresku, setLjutNaGresku] = useState(false)
  useEffect(() => {
    if (!greska) return
    setLjutNaGresku(true) // eslint-disable-line react-hooks/set-state-in-effect -- greška dolazi spolja, a ljutnja traje koliko klip
    const t = setTimeout(() => setLjutNaGresku(false), LJUT_NA_GRESKU)
    return () => clearTimeout(t)
  }, [greska])

  // Poslednji na današnjoj rang listi (ili bez unosa uz prijatelje): isto pravilo kao poza "cilj" kod ranga. Proverava se posle svakog unosa.
  const [poslednji, setPoslednji] = useState(false)
  useEffect(() => {
    if (!profilId) return
    let aktivan = true
    zbirZaDan(danas())
      .then((redovi) => aktivan && setPoslednji(rang(redovi, profilId)?.poza === 'cilj'))
      .catch(() => {}) // bez ranga miš samo nije ljut
    return () => { aktivan = false }
  }, [profilId, brojUnosa])

  const { spava, slavi } = stanjeMisa(uneto, cilj, sat)
  useEffect(() => {
    if (!mis) return
    mis.set('action::sleeping', spava)
    mis.set('action::celebrating', slavi)
    mis.set('action::over_limit', poslednji || ljutNaGresku)
  }, [mis, spava, slavi, poslednji, ljutNaGresku])

  // Konfete samo kad se cilj ispuni dok je stranica otvorena (ne pri svakom učitavanju dana koji je već ispunjen)
  const prosloSlavi = useRef<boolean | null>(null)
  useEffect(() => {
    if (brojUnosa == null) return
    if (prosloSlavi.current === false && slavi) void konfete()
    prosloSlavi.current = slavi
  }, [slavi, brojUnosa])

  // Novi unos (iz poruke mišu ili ručno preko +): miš jede, pa se vraća na stanje koje traje
  const prosliBroj = useRef<number | null>(null)
  useEffect(() => {
    if (brojUnosa == null) return
    if (mis && prosliBroj.current != null && brojUnosa > prosliBroj.current) mis.fire('action::eat', { instant: true })
    prosliBroj.current = brojUnosa
  }, [mis, brojUnosa])
}

// Realističan burst preko cele aplikacije: dva topa sa strana i prasak iz sredine. Bez pokreta (prefers-reduced-motion) ništa.
async function konfete() {
  const { default: confetti } = await import('canvas-confetti')
  const zajedno = { disableForReducedMotion: true, zIndex: 40, ticks: 260, gravity: 0.9, scalar: 1.05 }
  void confetti({ ...zajedno, particleCount: 140, spread: 100, startVelocity: 48, origin: { x: 0.5, y: 0.65 } })
  void confetti({ ...zajedno, particleCount: 90, angle: 60, spread: 60, startVelocity: 62, origin: { x: 0, y: 0.8 } })
  void confetti({ ...zajedno, particleCount: 90, angle: 120, spread: 60, startVelocity: 62, origin: { x: 1, y: 0.8 } })
}
