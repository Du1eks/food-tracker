// Zajedničko za žive miševe (ZiviMis u panelu, MisKuvar u Laboratoriji): mozak iz mis-figura, provera da li video miš sme, sat.
// Klipovi su u public/klipovi (kopija iz node_modules/mis-figura/dist/klipovi; pri novoj verziji paketa kopirati ponovo).
import { useEffect, useState } from 'react'
import { napraviMozak, type Mozak } from 'mis-figura'

// Mozak se pravi u efektu (ne u useMemo), da ga React StrictMode ne uništi pa nastavi da koristi mrtav
export function useMozak(pocetno?: Parameters<Mozak['postavi']>[0]) {
  const [mozak, setMozak] = useState<Mozak | null>(null)
  useEffect(() => {
    const m = napraviMozak()
    if (pocetno) m.postavi(pocetno)
    setMozak(m)
    return () => m.unisti()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- početno stanje važi samo pri pravljenju
  return mozak
}

// Bez pokreta (podešavanje sistema): miš stoji na prvom kadru radnje
export const bezPokreta = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Trenutno vreme koje se osvežava svakog minuta (za noć i za "dugo nisi jeo")
export function useSad() {
  const [sad, setSad] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setSad(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  return sad
}
