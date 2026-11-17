// Miš u Laboratoriji: postojeća slika miša (public/maskota/hoda.webp, 160×200), bez kostima, a pored njega neon boca.
// Sve je jedan SVG, pa se miš i boca skaliraju zajedno. Namirnice iz letNamirnica sleću u element sa data-cilj (boca).
// Boje su iz tokena (index.css); mehurići i sjaj su u kuhinja.css.
export default function MisKuvar({ id }: { id?: string }) {
  return (
    <svg id={id} className="mis-kuvar" viewBox="0 0 228 200" role="img" aria-label="Miš u laboratoriji">
      <image href="/maskota/hoda.webp" width="160" height="200" />
      <g className="mis-boca" data-cilj>
        <clipPath id={`boca-${id ?? 'poziv'}`}><path d="M174 92h20v30l26 46q4 10-7 10h-52q-11 0-7-10l26-46z" /></clipPath>
        <g clipPath={`url(#boca-${id ?? 'poziv'})`}>
          <rect x="140" y="138" width="90" height="44" fill="var(--zelena)" />
          <rect x="140" y="136" width="90" height="4" fill="#d8ffc4" opacity="0.8" />
          <circle className="boca-mehur" cx="176" cy="172" r="2.6" />
          <circle className="boca-mehur" cx="190" cy="168" r="2" style={{ animationDelay: '0.6s' }} />
          <circle className="boca-mehur" cx="200" cy="174" r="1.8" style={{ animationDelay: '1.1s' }} />
        </g>
        <path d="M174 92h20v30l26 46q4 10-7 10h-52q-11 0-7-10l26-46z" fill="none" stroke="rgb(200 255 220 / 0.6)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M170 90h28" stroke="rgb(200 255 220 / 0.7)" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}
