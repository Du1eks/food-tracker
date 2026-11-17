import { useId } from 'react'

// Pehar mesta u stilu laboratorije: providna staklena čaša sa drškama na nozi, napunjena napitkom u boji mesta
// (zlato, srebro, bronza; drvo = mutan napitak za poslednje mesto ili kad nema drugara). Boja dolazi iz --varnica
// (prijatelji.css, .pehar-zlato...), pa se pehar i varnice pri udaru uvek slažu. Površina se talasa, mehurići idu gore.
const MEHURICI = [
  { x: 22, r: 1.6, d: '2.2s', k: '0s' }, { x: 31, r: 1.1, d: '1.7s', k: '0.6s' }, { x: 40, r: 1.9, d: '2.6s', k: '1.1s' },
  { x: 27, r: 1.2, d: '1.9s', k: '1.5s' }, { x: 36, r: 1.4, d: '2.3s', k: '0.3s' },
]
// Čaša: ravan obod, oblo dno; isti oblik je i maska za tečnost
const CASA = 'M11 9 H53 V22 C53 39 44 49 32 49 C20 49 11 39 11 22 Z'

export default function Pehar({ vrsta }: { vrsta: string }) {
  const id = useId()
  return (
    <svg className={`pehar pehar-svg pehar-${vrsta}`} viewBox="0 0 64 84" aria-hidden>
      <defs>
        <clipPath id={`${id}c`}><path d={CASA} /></clipPath>
        <linearGradient id={`${id}t`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* postolje i noga: staklo sa tankim slojem napitka u postolju */}
      <path className="pehar-staklo" d="M13 76 Q13 72 18 72 H46 Q51 72 51 76 V79 Q51 81 48 81 H16 Q13 81 13 79 Z" />
      <rect className="pehar-tecnost" x="16" y="75" width="32" height="4" rx="2" />
      <path className="pehar-staklo" d="M28 49 Q28 56 26 62 Q24 68 25 72 H39 Q40 68 38 62 Q36 56 36 49 Z" />
      <ellipse className="pehar-staklo" cx="32" cy="60" rx="5" ry="2.4" />
      {/* drške */}
      <path className="pehar-drska" d="M11 13 C1 13 1 31 14 35" />
      <path className="pehar-drska" d="M53 13 C63 13 63 31 50 35" />
      {/* napitak u čaši: talasasta površina koja klizi, mehurići, senčenje za oblinu */}
      <g clipPath={`url(#${id}c)`}>
        <path className="pehar-tecnost pehar-talas" d="M-10 19 Q-4 16 2 19 T14 19 T26 19 T38 19 T50 19 T62 19 T74 19 V52 H-10 Z" />
        {MEHURICI.map((m, i) => (
          <circle key={i} className="pehar-mehur" cx={m.x} cy="46" r={m.r} style={{ '--d': m.d, '--k': m.k } as React.CSSProperties} />
        ))}
        <rect x="11" y="9" width="42" height="40" fill={`url(#${id}t)`} />
      </g>
      <path className="pehar-staklo pehar-casa" d={CASA} />
      {/* odsjaj stakla i obod */}
      <path className="pehar-odsjaj" d="M16 13 V24 C16 32 19 38 23 42" />
      <ellipse className="pehar-obod" cx="32" cy="9" rx="21" ry="2.2" />
    </svg>
  )
}
