import type { Poza } from '../lib/rang'

const ALT: Record<Poza, string> = {
  jede: 'Miš jede i zadovoljan je',
  hoda: 'Miš šeta',
  slavi: 'Miš slavi',
  cilj: 'Ljuti miš kaže: You are mouse',
}

// Slike su u public/maskota (providni WebP), pa rade i u web i u Tauri verziji.
export default function Maskota({ poza }: { poza: Poza }) {
  return <img className={`maskota ${poza}`} src={`/maskota/${poza}.webp`} alt={ALT[poza]} />
}
