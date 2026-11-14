import { useEffect, useState } from 'react'
import type { Poza } from '../lib/rang'

const ALT: Record<Poza, string> = {
  jede: 'Miš jede i zadovoljan je',
  hoda: 'Miš šeta',
  slavi: 'Miš slavi',
  cilj: 'Ljuti miš',
}

// Živi miš: Masko klipovi u public/maskota/masko. Poza iz app-a postaje kratka reakcija, pa miš opet miruje.
const KLIP: Record<Poza, string> = { hoda: 'miruje', jede: 'jede', slavi: 'slavi', cilj: 'ljut' }
const TRAJE = 2300 // dužina reakcija u ms
const bezPokreta = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
// shortcut: Safari pušta WebM bez providnosti, pa dobija animirani WebP koji se samo vrti u krug; ako zatreba kontrola, dodati HEVC iz Masko-a
const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const noc = () => { const h = new Date().getHours(); return h >= 23 || h < 6 }

// ziv: Masko klip (samo kod unosa hrane); bez njega obična slika po pozi, kao kod ranga.
// drzi: reakcija poze se vrti dok poza traje (miš jede dok pišeš), umesto da se posle 2,3 s vrati na mirovanje.
export default function Maskota({ poza, ziv = false, drzi = false }: { poza: Poza; ziv?: boolean; drzi?: boolean }) {
  const [samoSlika, setSamoSlika] = useState(bezPokreta)
  const reakcijaZa = (p: Poza) => (KLIP[p] === 'miruje' ? null : KLIP[p])
  const [reakcija, setReakcija] = useState(() => reakcijaZa(poza))
  // nova poza = nova reakcija (React: stanje se menja tokom renderovanja, bez efekta)
  const [prethodna, setPrethodna] = useState(poza)
  if (poza !== prethodna) { setPrethodna(poza); setReakcija(reakcijaZa(poza)) }

  const drzana = drzi && reakcija === KLIP[poza] // dodir (prejak) se ne drži
  useEffect(() => {
    if (!reakcija || drzana) return
    const t = setTimeout(() => setReakcija(null), TRAJE)
    return () => clearTimeout(t)
  }, [reakcija, drzana])

  // Slika je rezerva: bez pokreta (prefers-reduced-motion) i kad klip ne može da se učita
  // slike miša sa natpisom više nema (natpis je u oblačiću): za ljutu pozu rezerva je običan miš
  const slika = poza === 'cilj' ? 'hoda' : poza
  if (!ziv || samoSlika) return <img className={`maskota ${slika}`} src={`/maskota/${slika}.webp`} alt={ALT[poza]} />

  const ime = reakcija ?? (noc() ? 'spava' : 'miruje')
  const zajedno = { className: `maskota ziv ${poza}`, onClick: () => setReakcija('prejak'), onError: () => setSamoSlika(true) }
  if (safari) return <img {...zajedno} src={`/maskota/masko/${ime}.webp`} alt={ALT[poza]} />
  return (
    <video {...zajedno} key={ime} src={`/maskota/masko/${ime}.webm`} role="img" aria-label={ALT[poza]}
      autoPlay muted playsInline loop={!reakcija || drzana}
      // miš koji spava se na kraju petlje budi, pa stane na kadru sa zatvorenim očima
      onTimeUpdate={ime === 'spava' ? (e) => { if (e.currentTarget.currentTime > 1.2) e.currentTarget.pause() } : undefined} />
  )
}
