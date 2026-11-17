import './pecat.css'

// Crtež pečata "cilj pogođen" (zamenljiv). PecatDefs ide jednom na stranu (mastilo, krug za tekst, senčenje alata),
// PecatOtisak za svaki pogođen cilj, PecatAlat samo dok udara. Boje su CSS promenljive u pecat.css;
// kada, gde i kako udara odlučuju Dan.tsx i dan.css.

// stop sa bojom iz CSS promenljive (atribut stop-color ne čita var(), stil čita)
const Stop = ({ o, boja, a }: { o: number; boja: string; a?: number }) => (
  <stop offset={o} style={{ stopColor: `var(${boja})`, stopOpacity: a ?? 1 }} />
)

export function PecatDefs() {
  return (
    <svg className="pecat-defs" aria-hidden>
      <defs>
        {/* Mastilo: iskrzana ivica, zrnasta gustina, jači i slabiji pritisak po površini, malo razliveno */}
        <filter id="pecat-mastilo" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="7" result="sum" />
          <feDisplacementMap in="SourceGraphic" in2="sum" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="iskrzano" />
          <feGaussianBlur in="iskrzano" stdDeviation="0.15" result="razliveno" />
          <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="2" seed="11" result="zrno" />
          <feColorMatrix in="zrno" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.55" result="gustina" />
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="pritisak" />
          <feColorMatrix in="pritisak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.25" result="jacina" />
          <feComposite in="razliveno" in2="gustina" operator="in" result="zrnasto" />
          <feComposite in="zrnasto" in2="jacina" operator="in" />
        </filter>
        <path id="pecat-krug" d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0" />
        {/* Alat: kugla drške osvetljena gore levo, valjci (vrat, blok, guma) svetliji levo od sredine, tamniji na ivicama */}
        <radialGradient id="pecat-kugla" cx="0.38" cy="0.32" r="0.75">
          <Stop o={0} boja="--pecat-drvo-svetlo" />
          <Stop o={0.45} boja="--pecat-drvo" />
          <Stop o={1} boja="--pecat-drvo-senka" />
        </radialGradient>
        <linearGradient id="pecat-valjak" x1="0" x2="1">
          <Stop o={0} boja="--pecat-drvo-senka" />
          <Stop o={0.3} boja="--pecat-drvo-svetlo" />
          <Stop o={0.55} boja="--pecat-drvo" />
          <Stop o={1} boja="--pecat-drvo-senka" />
        </linearGradient>
        <linearGradient id="pecat-valjak-tamni" x1="0" x2="1">
          <Stop o={0} boja="--pecat-drvo-senka" />
          <Stop o={0.32} boja="--pecat-drvo" />
          <Stop o={1} boja="--pecat-drvo-senka" />
        </linearGradient>
        <linearGradient id="pecat-guma" x1="0" x2="1">
          <Stop o={0} boja="--pecat-guma-tamna" />
          <Stop o={0.3} boja="--pecat-guma-svetla" />
          <Stop o={0.6} boja="--pecat-mastilo" />
          <Stop o={1} boja="--pecat-guma-tamna" />
        </linearGradient>
        <linearGradient id="pecat-odsjaj" x1="0" x2="1">
          <Stop o={0} boja="--bela" a={0} />
          <Stop o={0.5} boja="--bela" a={0.55} />
          <Stop o={1} boja="--bela" a={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PecatOtisak({ naziv }: { naziv: string }) {
  return (
    <svg className="pecat-otisak" viewBox="0 0 100 100" role="img" aria-label={`${naziv}: cilj pogođen`}>
      <g filter="url(#pecat-mastilo)" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="46.5" strokeWidth="4.2" />
        <circle cx="50" cy="50" r="42" strokeWidth="1.2" strokeDasharray="0.1 2.6" strokeLinecap="round" />
        <circle cx="50" cy="50" r="40.2" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="27.5" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="25.4" strokeWidth="0.7" />
        <text className="pecat-tekst" fill="currentColor" stroke="none" fontSize="10.5" fontWeight="900" letterSpacing="0.5">
          <textPath href="#pecat-krug" textLength="214" lengthAdjust="spacing">CILJ POGOĐEN ★ {naziv.toUpperCase()} ★</textPath>
        </text>
        <path d="M37 51.5 L46.5 61 L64.5 40" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path fill="currentColor" stroke="none" d="M50 28.5l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z M40 31.8l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1-1.9 1 .5-2-1.6-1.4 2.1-.2z M60 31.8l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1-1.9 1 .5-2-1.6-1.4 2.1-.2z" />
        <path d="M38 69.5 h24" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

// Alat u tri četvrtine, odozgo malo ukoso: drvena kugla, vrat i blok kao valjci, zelena guma na dnu, senka ispod
export function PecatAlat() {
  return (
    <svg className="pecat-alat" viewBox="0 0 120 176" aria-hidden>
      <ellipse className="pecat-alat-senka" cx="60" cy="168" rx="50" ry="6" />
      <g className="pecat-alat-obris">
        {/* guma */}
        <path d="M12 136 v14 a48 9 0 0 0 96 0 v-14 z" fill="url(#pecat-guma)" />
        <ellipse cx="60" cy="136" rx="48" ry="9" fill="url(#pecat-guma)" />
        {/* blok */}
        <path d="M16 104 v30 a44 8.5 0 0 0 88 0 v-30 z" fill="url(#pecat-valjak)" />
        <ellipse cx="60" cy="104" rx="44" ry="8.5" fill="url(#pecat-valjak-tamni)" />
        {/* vrat sa proširenjem dole */}
        <path d="M49 52 L71 52 L76 100 a16 4 0 0 1 -32 0 Z" fill="url(#pecat-valjak)" />
        <ellipse cx="60" cy="52" rx="11" ry="3" fill="url(#pecat-valjak-tamni)" />
        {/* kugla */}
        <circle cx="60" cy="28" r="22" fill="url(#pecat-kugla)" />
      </g>
      {/* drvena šara na bloku i odsjaji */}
      <g className="pecat-sara">
        <path d="M28 113 q14 4 26 0 t30 1" />
        <path d="M24 124 q18 5 34 0 t40 1" />
      </g>
      <rect x="28" y="108" width="10" height="26" rx="5" fill="url(#pecat-odsjaj)" />
      <rect x="53" y="58" width="5" height="38" rx="2.5" fill="url(#pecat-odsjaj)" />
      <ellipse className="pecat-odsjaj-kugla" cx="52" cy="19" rx="7" ry="4.5" transform="rotate(-30 52 19)" />
    </svg>
  )
}
