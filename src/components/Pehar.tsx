import { useId } from 'react'

// Pehar mesta u stilu laboratorije: debelo providno staklo u obliku pehara (tulipan čaša, drške, noga sa prstenom,
// postolje u dva sloja sa urezanim brojem mesta), napunjen svetlećim napitkom u boji mesta (zlato, srebro, bronza;
// "drvo" = mutan napitak za poslednje mesto ili kad nema drugara). Na staklu su podeoci kao na menzuri, iz napitka
// se diže para, površina se talasa, mehurići idu gore, a preko stakla povremeno pređe odsjaj.
// Boja dolazi iz --varnica (prijatelji.css, .pehar-zlato...), pa se pehar i varnice pri udaru uvek slažu.
const MEHURICI = [
  { x: 21, r: 1.7, d: '2.4s', k: '0s' }, { x: 29, r: 1.1, d: '1.8s', k: '0.7s' }, { x: 38, r: 2, d: '2.8s', k: '1.2s' },
  { x: 25, r: 0.9, d: '1.6s', k: '1.6s' }, { x: 34, r: 1.4, d: '2.2s', k: '0.3s' }, { x: 43, r: 1, d: '1.9s', k: '0.9s' },
]
// Čaša: širi obod, tulipan prema dnu; isti oblik (malo uži) je maska za napitak
const CASA = 'M8 8 H56 C56 14 55 20 53 26 C50 37 42 46 32 46 C22 46 14 37 11 26 C9 20 8 14 8 8 Z'
const UNUTRA = 'M11 10 H53 C53 15 52 20 50.5 25 C47.8 35 40.5 43.2 32 43.2 C23.5 43.2 16.2 35 13.5 25 C12 20 11 15 11 10 Z'
// Stop sa bojom iz CSS promenljive (atribut stop-color ne čita var(), stil čita)
const Boja = ({ o, mesaj, a = 1 }: { o: number; mesaj: string; a?: number }) => (
  <stop offset={o} style={{ stopColor: `color-mix(in srgb, var(--varnica) ${mesaj})`, stopOpacity: a }} />
)

export default function Pehar({ vrsta, mesto }: { vrsta: string; mesto?: number }) {
  const id = useId()
  return (
    <svg className={`pehar pehar-svg pehar-${vrsta}`} viewBox="0 0 64 84" aria-hidden>
      <defs>
        <clipPath id={`${id}c`}><path d={UNUTRA} /></clipPath>
        {/* napitak: svetliji pri vrhu, dublji pri dnu */}
        <linearGradient id={`${id}n`} x1="0" y1="0" x2="0" y2="1">
          <Boja o={0} mesaj="55%, white" />
          <Boja o={0.35} mesaj="100%, white" />
          <Boja o={1} mesaj="60%, black" />
        </linearGradient>
        {/* oblina čaše: tamnije uz ivice, svetla traka levo od sredine */}
        <linearGradient id={`${id}o`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.85" stopColor="#000" stopOpacity="0.2" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <Boja o={1} mesaj="40%, white" a={0.7} />
        </linearGradient>
      </defs>

      {/* para iz napitka */}
      <g className="pehar-para">
        <path d="M24 6 C21 2 27 -1 24 -5" />
        <path d="M38 6 C41 1 35 -2 38 -7" />
      </g>

      {/* postolje u dva sloja, broj mesta urezan */}
      <path className="pehar-staklo" d="M12 77 Q12 73.5 16 73.5 H48 Q52 73.5 52 77 V80 Q52 82.5 49 82.5 H15 Q12 82.5 12 80 Z" />
      <path className="pehar-staklo" d="M18 73.5 Q18 70 22 70 H42 Q46 70 46 73.5 Z" />
      <rect className="pehar-tecnost-sloj" x="15" y="76" width="34" height="4" rx="2" fill={`url(#${id}p)`} />
      {mesto != null && <text className="pehar-broj" x="32" y="80.6" textAnchor="middle">{mesto}</text>}
      {/* noga sa prstenom */}
      <path className="pehar-staklo" d="M28.5 46 Q29 53 27.5 58 Q26 64 26.5 70 H37.5 Q38 64 36.5 58 Q35 53 35.5 46 Z" />
      <ellipse className="pehar-prsten" cx="32" cy="57" rx="6.5" ry="2.6" />
      <ellipse className="pehar-staklo" cx="32" cy="47.2" rx="5" ry="1.6" />
      {/* drške */}
      <path className="pehar-drska" d="M9 12 C-1 11 -1 30 13 33" />
      <path className="pehar-drska" d="M55 12 C65 11 65 30 51 33" />

      {/* napitak: talasasta površina, mehurići, oblina */}
      <g clipPath={`url(#${id}c)`}>
        <path className="pehar-talas" fill={`url(#${id}n)`} d="M-12 17 Q-6 14 0 17 T12 17 T24 17 T36 17 T48 17 T60 17 T72 17 T84 17 V48 H-12 Z" />
        <path className="pehar-talas pehar-menisk" d="M-12 17 Q-6 14 0 17 T12 17 T24 17 T36 17 T48 17 T60 17 T72 17 T84 17" />
        {MEHURICI.map((m, i) => (
          <circle key={i} className="pehar-mehur" cx={m.x} cy="42" r={m.r} style={{ '--d': m.d, '--k': m.k } as React.CSSProperties} />
        ))}
        <rect x="8" y="8" width="48" height="40" fill={`url(#${id}o)`} />
        {/* odsjaj koji povremeno pređe preko stakla */}
        <rect className="pehar-sjaj" x="-14" y="6" width="7" height="44" transform="skewX(-18)" />
      </g>

      {/* staklo čaše: debelo (spoljna i unutrašnja kontura), podeoci menzure, odsjaji, obod */}
      <path className="pehar-staklo pehar-casa" d={CASA} />
      <path className="pehar-unutra" d={UNUTRA} />
      <g className="pehar-podeoci">
        <path d="M48 16 h4 M49 22 h3 M47.5 28 h4 M46 34 h3" />
      </g>
      <path className="pehar-odsjaj" d="M14 13 C14 21 16 30 21 37" />
      <path className="pehar-odsjaj tanak" d="M18.5 12 C18.5 17 19.2 22 20.5 26" />
      <ellipse className="pehar-obod" cx="32" cy="8" rx="24" ry="2.4" />
    </svg>
  )
}
