import './pecat.css'

// Crtež pečata "cilj pogođen" (zamenljiv). PecatDefs ide jednom na stranu (mastilo i krug za tekst),
// PecatOtisak za svaki pogođen cilj, PecatAlat samo dok udara. Boje su CSS promenljive u pecat.css;
// kada, gde i kako udara odlučuju Dan.tsx i dan.css.

export function PecatDefs() {
  return (
    <svg className="pecat-defs" aria-hidden>
      <defs>
        {/* iskrzana ivica (pomeranje šumom) i tačkice gde mastilo nije prihvatilo */}
        <filter id="pecat-mastilo" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="sum" />
          <feDisplacementMap in="SourceGraphic" in2="sum" scale="2.6" result="iskrzano" />
          <feTurbulence type="fractalNoise" baseFrequency="0.22" seed="3" result="mrlje" />
          <feColorMatrix in="mrlje" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.4" result="rupe" />
          <feComposite in="iskrzano" in2="rupe" operator="in" />
        </filter>
        <path id="pecat-krug" d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0" />
      </defs>
    </svg>
  )
}

export function PecatOtisak({ naziv }: { naziv: string }) {
  return (
    <svg className="pecat-otisak" viewBox="0 0 100 100" role="img" aria-label={`${naziv}: cilj pogođen`}>
      <g filter="url(#pecat-mastilo)" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="46" strokeWidth="4.5" />
        <circle cx="50" cy="50" r="40.5" strokeWidth="1.6" />
        <circle cx="50" cy="50" r="26" strokeWidth="1.6" />
        <text fill="currentColor" stroke="none" fontSize="10.5" fontWeight="900" letterSpacing="0.4">
          <textPath href="#pecat-krug" textLength="214" lengthAdjust="spacing">CILJ POGOĐEN · {naziv.toUpperCase()} ·</textPath>
        </text>
        <path d="M38 52 L47 61 L64 41" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path fill="currentColor" stroke="none" d="M50 28.5l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z M39 31.5l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1-1.9 1 .5-2-1.6-1.4 2.1-.2z M61 31.5l.9 1.9 2.1.2-1.6 1.4.5 2-1.9-1-1.9 1 .5-2-1.6-1.4 2.1-.2z" />
      </g>
    </svg>
  )
}

// Drvena drška, drveni blok i guma u boji mastila
export function PecatAlat() {
  return (
    <svg className="pecat-alat" viewBox="0 0 60 92" aria-hidden>
      <g className="pecat-alat-obris">
        <circle className="pecat-drvo" cx="30" cy="13" r="10" />
        <path className="pecat-drvo-tamno" d="M25 22 h10 l2 24 h-14 z" />
        <rect className="pecat-drvo" x="9" y="46" width="42" height="18" rx="3" />
        <rect className="pecat-guma" x="6" y="64" width="48" height="12" rx="2" />
      </g>
      <path className="pecat-odsjaj" d="M14 51 h20" />
    </svg>
  )
}
