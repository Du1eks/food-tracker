// Miš u Laboratoriji: video miš iz mis-figura u laboratorijskom načinu (drži bocu sa napitkom, mućka, kuva, slavi gotovo jelo).
// Preko boce je nevidljiv element sa data-cilj, da namirnice iz letNamirnica sleću u bocu.
// Bez pokreta i u Safariju (useMis.zivMis): stara slika miša sa SVG neon bocom; boje i mehurići su u kuhinja.css.
import { useEffect, useRef } from 'react'
import { MisFigura } from 'mis-figura/react'
import { useMozak, zivMis } from './useMis'

const SIRINA = 120 // px; MisFigura je fiksne širine, visina iz nje (oko 135)

export default function MisKuvar({ id, kuva = false, greska = '', sastojaka = 0, gotovo = false }: {
  id?: string
  kuva?: boolean // čita poruku, kuva ili je tekst u polju
  greska?: string
  sastojaka?: number // broj stavki u jelu; kad poraste, sastojak je uleteo
  gotovo?: boolean // jelo je upravo sačuvano
}) {
  const mozak = useMozak({ lab: true })
  useEffect(() => { mozak?.postavi({ kuva }) }, [mozak, kuva])
  useEffect(() => { if (greska) mozak?.javi('greska') }, [mozak, greska])
  useEffect(() => { if (gotovo) mozak?.javi('gotovo') }, [mozak, gotovo])
  const prosli = useRef(sastojaka)
  useEffect(() => {
    if (mozak && sastojaka > prosli.current) mozak.javi('sastojak')
    prosli.current = sastojaka
  }, [mozak, sastojaka])

  if (!zivMis()) return <MisKuvarSlika id={id} />
  return (
    <div id={id} className="mis-kuvar ziv" role="img" aria-label="Miš u laboratoriji">
      {mozak && <MisFigura mozak={mozak} sirina={SIRINA} />}
      {/* boca je u desnoj šaci miša (klip "mucka"); ovde sleću namirnice */}
      <span className="mis-kuvar-cilj" data-cilj aria-hidden />
    </div>
  )
}

function MisKuvarSlika({ id }: { id?: string }) {
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
