import './sir.css'

// Crtež sira u sredini luka (zamenljiv): ravne boje, debeo obris, rupe. Boje su CSS promenljive u sir.css;
// kada iskoči (slavi = pogođen cilj kalorija) odlučuje Dan.tsx, a pokret je u dan.css.
export default function Sir({ slavi }: { slavi: boolean }) {
  return (
    <svg className={`sir${slavi ? ' slavi' : ''}`} viewBox="0 0 64 50" width={66} height={52} {...(slavi ? { role: 'img', 'aria-label': 'Cilj kalorija pogođen' } : { 'aria-hidden': true })}>
      <g className="sir-obris">
        <path className="sir-vrh" d="M4 25 L44 9 L58 16 L18 31 Z" />
        <path className="sir-bok" d="M44 9 L58 16 V40 L44 46 Z" />
        <path className="sir-lice" d="M4 25 L44 9 V46 H4 Z" />
      </g>
      <g className="sir-rupe">
        <circle cx="15" cy="35" r="4" />
        <circle cx="30" cy="26" r="5" />
        <circle cx="34" cy="39" r="3" />
        <ellipse cx="38" cy="16.5" rx="3.6" ry="1.6" />
      </g>
    </svg>
  )
}
