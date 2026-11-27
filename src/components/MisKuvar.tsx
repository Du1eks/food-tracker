// Miš u Laboratoriji: video miš iz mis-figura u laboratorijskom načinu (drži bocu sa napitkom, mućka, kuva, slavi gotovo jelo).
// Preko boce je nevidljiv element sa data-cilj, da namirnice iz letNamirnica sleću u bocu.
// Bez pokreta (prefers-reduced-motion) miš stoji na prvom kadru.
import { useEffect, useRef } from 'react'
import { MisFigura } from 'mis-figura/react'
import { bezPokreta, useMozak } from './useMis'

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

  return (
    <div id={id} className="mis-kuvar ziv" role="img" aria-label="Miš u laboratoriji">
      {mozak && <MisFigura mozak={mozak} miran={bezPokreta()} />}
      {/* boca je u desnoj šaci miša (klip "mucka"); ovde sleću namirnice */}
      <span className="mis-kuvar-cilj" data-cilj aria-hidden />
    </div>
  )
}
