import { useId } from 'react'
import './ime-u-plamenu.css'

// Ime koje gori: `iznutra` = slova gore (sad plavo), `spolja` = vatra liže oko table (sad narandžasto).
// Bez oba je samo ime. Boje su CSS promenljive u ime-u-plamenu.css, pa se efekat preboji bez prepravljanja.
// Vatra je ukras (aria-hidden); tekst za čitač ekrana daje roditelj.
// Roditelj treba da bude sloj (isolation: isolate), da spoljna vatra iza table ostane iznad pozadine reda.
export default function ImeUPlamenu({ ime, spolja, iznutra }: { ime: string | null; spolja: boolean; iznutra: boolean }) {
  // svaki primerak ima svoj filter praga; useId ima znakove koji ne idu u url(#...)
  const prag = `prag-${useId().replace(/[^\w-]/g, '')}`
  if (!spolja && !iznutra) return <span className="ime-plamen"><b>{ime}</b></span>
  return (
    <span className={['ime-plamen gori', spolja && 'spolja', iznutra && 'iznutra'].filter(Boolean).join(' ')}
      style={{ '--prag': `url(#${prag})` } as React.CSSProperties}>
      {/* Prag: mekan šum postaje oštar, zašiljen plamen */}
      <svg className="ime-plamen-prag" aria-hidden>
        <filter id={prag} colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="linear" slope="7" intercept="-2.6" /></feComponentTransfer></filter>
      </svg>
      {spolja && <span className="ime-plamen-vatra" aria-hidden />}
      {iznutra && <span className="ime-plamen-jezici" aria-hidden />}
      <b>{ime}</b>
    </span>
  )
}
