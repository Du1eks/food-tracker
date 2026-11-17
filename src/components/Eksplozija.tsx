import './eksplozija.css'

// Cilj makroa pogođen: kartica "eksplodira" kao napitak koji je prekipeo, pa ostane oštećena (mrlje druge boje, napukline).
// Klase i --kasni stavlja kartica (Dan.tsx): .ostecena = stanje, .pukla = upravo eksplodira. Ovde su samo slojevi preko kartice.
// Boje su CSS promenljive u eksplozija.css.

// Krhotine stakla i kapi: pravac, daljina, okret i veličina, raspoređeni ukrug (deterministički, isti svaki put)
const KOMADI = Array.from({ length: 18 }, (_, i) => {
  const ugao = (i / 18) * Math.PI * 2 + (i % 3) * 0.35
  const daleko = 60 + ((i * 37) % 70)
  return {
    '--dx': `${Math.round(Math.cos(ugao) * daleko)}px`, '--dy': `${Math.round(Math.sin(ugao) * daleko * 0.75 - 18)}px`,
    '--r': `${(i * 67) % 360}deg`, '--s': `${5 + ((i * 7) % 8)}px`,
  } as React.CSSProperties
})

export default function Eksplozija({ naziv, pukla }: { naziv: string; pukla: boolean }) {
  return (
    <span className="eksplozija">
      <span className="sr">{naziv}: cilj pogođen</span>
      <svg className="eksplozija-pukotine" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
        <path pathLength={1} d="M6 3 L18 15 L14 27 L26 40 M18 15 L33 18 M74 0 L67 13 L80 25 L75 39 L88 58 M67 13 L55 17" />
      </svg>
      {pukla && (
        <span className="eksplozija-komadi" aria-hidden>
          {KOMADI.map((s, i) => <i key={i} className={i % 3 ? 'kap' : 'staklo'} style={s} />)}
        </span>
      )}
    </span>
  )
}
