// Miš kuvar u Kuhinji: postojeća slika miša (public/maskota/hoda.webp, 160×200) i kuvarska kapa nacrtana preko nje.
// Sve je jedan SVG (viewBox ima mesta iznad glave za kapu), pa se kapa i miš skaliraju zajedno.
// Kapa je zamenljiva (kasnije npr. kotao ili boca): namirnice iz letNamirnica sleću u element sa data-cilj.
// Kapa: prvo crni obris (deblja linija), pa bela ispuna preko, da se oblici spoje bez linija unutra.
const KAPA = (
  <>
    <circle cx="76" cy="-6" r="16" />
    <circle cx="97" cy="-17" r="20" />
    <circle cx="118" cy="-6" r="16" />
    <rect x="70" y="-8" width="54" height="22" />
    <rect x="72" y="10" width="50" height="19" rx="3" />
  </>
)

export default function MisKuvar({ id }: { id?: string }) {
  return (
    <svg id={id} className="mis-kuvar" viewBox="0 -42 160 242" role="img" aria-label="Miš kuvar">
      <image href="/maskota/hoda.webp" width="160" height="200" />
      <g transform="translate(3 6) rotate(-9 97 10)" data-cilj>
        <g fill="var(--tekst)" stroke="var(--tekst)" strokeWidth="6" strokeLinejoin="round">{KAPA}</g>
        <g fill="var(--bela)">{KAPA}</g>
        {/* nabori na traci kape */}
        <path d="M85 13v13M97 13v13M109 13v13" stroke="var(--spolja)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}
