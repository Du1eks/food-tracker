import { useCallback, useEffect, useRef, useState } from 'react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { promenaMesta, rang, type Zbir } from '../lib/rang'

export type PorukaRanga = { mesto: number; ukupno: number }

// Rang na početnoj bez stalnog prikaza: učitava današnje zbirove ja + prijatelji (za miša, useRangGovor) i javlja
// poruku samo kad se moje mesto promeni (lib/rang promenaMesta). Računa se čim stignu unosi dana, a posle svakog
// ponovnog učitavanja unosa (novi unos, izmena, brisanje) iznova. Prvo računanje samo upamti mesto, bez poruke.
// aktivan: samo današnji dan; unosi: lista unosa dana (null dok se učitava, kao u Dan.tsx).
export function useRang(aktivan: boolean, unosi: unknown, profilId: string | undefined) {
  const [redovi, setRedovi] = useState<Zbir[] | null>(null)
  const [poruka, setPoruka] = useState<PorukaRanga | null>(null)
  const prethodno = useRef<number | null>(null)

  useEffect(() => {
    if (!aktivan || !unosi || !profilId) { prethodno.current = null; return }
    let vazi = true
    zbirZaDan(danas()).then((r) => {
      if (!vazi) return
      const ja = rang(r, profilId)
      const nova = promenaMesta(prethodno.current, ja)
      if (ja) prethodno.current = ja.mesto
      setRedovi(r)
      if (nova) setPoruka(nova)
    }, () => {}) // shortcut: rang je dodatak, kad upit padne nema poruke ni ćaskanja; pri sledećem unosu se pokuša opet
    return () => { vazi = false }
  }, [aktivan, unosi, profilId])

  const zatvori = useCallback(() => setPoruka(null), [])
  return { redovi: aktivan ? redovi : null, poruka: aktivan ? poruka : null, zatvori }
}
