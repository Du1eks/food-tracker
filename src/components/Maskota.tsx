import { useEffect, useState } from 'react'
import type { Poza } from '../lib/rang'

const ALT: Record<Poza, string> = {
  jede: 'Miš jede i zadovoljan je',
  hoda: 'Miš šeta',
  slavi: 'Miš slavi',
  cilj: 'Ljuti miš kaže: You are mouse',
}

// Živi miš: Masko klipovi u public/maskota/masko. Poza iz app-a postaje kratka reakcija, pa miš opet miruje.
const KLIP: Record<Poza, string> = { hoda: 'miruje', jede: 'jede', slavi: 'slavi', cilj: 'ljut' }
const TRAJE = 2300 // dužina reakcija u ms
const bezPokreta = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
// shortcut: Safari pušta WebM bez providnosti, pa dobija animirani WebP koji se samo vrti u krug; ako zatreba kontrola, dodati HEVC iz Masko-a
const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const noc = () => { const h = new Date().getHours(); return h >= 23 || h < 6 }

// ziv: Masko klip (samo kod unosa hrane); bez njega obična slika po pozi, kao kod ranga
export default function Maskota({ poza, ziv = false }: { poza: Poza; ziv?: boolean }) {
  const [samoSlika, setSamoSlika] = useState(bezPokreta)
  const reakcijaZa = (p: Poza) => (KLIP[p] === 'miruje' ? null : KLIP[p])
  const [reakcija, setReakcija] = useState(() => reakcijaZa(poza))
  // nova poza = nova reakcija (React: stanje se menja tokom renderovanja, bez efekta)
  const [prethodna, setPrethodna] = useState(poza)
  if (poza !== prethodna) { setPrethodna(poza); setReakcija(reakcijaZa(poza)) }

  useEffect(() => {
    if (!reakcija) return
    const t = setTimeout(() => setReakcija(null), TRAJE)
    return () => clearTimeout(t)
  }, [reakcija])

  // Slika je rezerva: bez pokreta (prefers-reduced-motion) i kad klip ne može da se učita
  if (!ziv || samoSlika) return <img className={`maskota ${poza}`} src={`/maskota/${poza}.webp`} alt={ALT[poza]} />

  const ime = reakcija ?? (noc() ? 'spava' : 'miruje')
  const zajedno = { className: `maskota ziv ${poza}`, onClick: () => setReakcija('prejak'), onError: () => setSamoSlika(true) }
  if (safari) return <img {...zajedno} src={`/maskota/masko/${ime}.webp`} alt={ALT[poza]} />
  return (
    <video {...zajedno} key={ime} src={`/maskota/masko/${ime}.webm`} role="img" aria-label={ALT[poza]}
      autoPlay muted playsInline loop={!reakcija}
      // miš koji spava se na kraju petlje budi, pa stane na kadru sa zatvorenim očima
      onTimeUpdate={ime === 'spava' ? (e) => { if (e.currentTarget.currentTime > 1.2) e.currentTarget.pause() } : undefined} />
  )
}
