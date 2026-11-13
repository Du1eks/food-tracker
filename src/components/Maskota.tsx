import { lazy, Suspense, useState } from 'react'
import type { Poza } from '../lib/rang'
import type { MisProps } from './MisRive'

const ALT: Record<Poza, string> = {
  jede: 'Miš jede i zadovoljan je',
  hoda: 'Miš šeta',
  slavi: 'Miš slavi',
  cilj: 'Ljuti miš kaže: You are mouse',
}

// Ako se Rive deo ne skine (nema interneta), ostaje PNG
const MisRive = lazy(() => import('./MisRive').catch(() => ({ default: ({ rezerva }: MisProps) => rezerva })))
// shortcut: čita se jednom pri prvom prikazu, promena podešavanja važi tek posle osvežavanja
const bezPokreta = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Živi Rive miš; PNG po pozi (public/maskota, providni) je rezerva dok se učitava, kad Rive ne uspe i bez pokreta.
export default function Maskota({ poza, ...stanje }: { poza: Poza; cita?: boolean; tuzan?: boolean; greska?: string }) {
  const [samoSlika, setSamoSlika] = useState(bezPokreta)
  // ključ na pozi: PNG miš "poskoči" samo kad se stanje promeni
  const slika = <img key={poza} className={`maskota ${poza}`} src={`/maskota/${poza}.png`} alt={ALT[poza]} />
  if (samoSlika) return slika
  return (
    <Suspense fallback={slika}>
      <MisRive poza={poza} alt={ALT[poza]} rezerva={slika} onGreska={() => setSamoSlika(true)} {...stanje} />
    </Suspense>
  )
}
