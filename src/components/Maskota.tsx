import type { Poza } from '../lib/rang'

const ALT: Record<Poza, string> = {
  jede: 'Miš jede i zadovoljan je',
  hoda: 'Miš šeta',
  slavi: 'Miš slavi',
  cilj: 'Ljuti miš',
}

// Obična slika miša po pozi (rang, i rezerva za živog miša iz ZiviMis.tsx). Slike su u public/maskota (providni WebP).
export default function Maskota({ poza }: { poza: Poza }) {
  // slike miša sa natpisom više nema (natpis je u oblačiću): za ljutu pozu stoji običan miš
  const slika = poza === 'cilj' ? 'hoda' : poza
  return <img className={`maskota ${slika}`} src={`/maskota/${slika}.webp`} alt={ALT[poza]} />
}
