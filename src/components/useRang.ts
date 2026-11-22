import { useCallback, useEffect, useRef, useState } from 'react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { promenaMesta, rang, type Zbir } from '../lib/rang'

// Rang na početnoj bez stalnog prikaza (strelica na ivici, RangStrelica): učitava današnje zbirove ja + prijatelji i daje moje mesto,
// a `novo` postaje true samo kad se mesto promeni (lib/rang promenaMesta) i ostaje dok ga ne potvrdim (potvrdi).
// Računa se čim stignu unosi dana, a posle svakog ponovnog učitavanja unosa (novi unos, izmena, brisanje) iznova.
// Prvo računanje samo upamti mesto, bez signala. Redovi idu i mišu za ćaskanje o rangu (useRangGovor).
// aktivan: samo današnji dan; unosi: lista unosa dana (null dok se učitava, kao u Dan.tsx).
export function useRang(aktivan: boolean, unosi: unknown, profilId: string | undefined) {
  const [redovi, setRedovi] = useState<Zbir[] | null>(null)
  const [novo, setNovo] = useState(false)
  const prethodno = useRef<number | null>(null)

  // Dan nije više današnji (Dan.tsx se ne remountuje između / i /dan/:datum): obriši i signal i redove, da se stari signal
  // ne vrati kad se vratim na danas. Promena stanja tokom renderovanja, ne u efektu (React preporuka za ovaj slučaj).
  const [bioAktivan, setBioAktivan] = useState(aktivan)
  if (bioAktivan !== aktivan) {
    setBioAktivan(aktivan)
    if (!aktivan) { setNovo(false); setRedovi(null) }
  }

  useEffect(() => {
    if (!aktivan || !unosi || !profilId) { prethodno.current = null; return }
    let vazi = true
    zbirZaDan(danas()).then((r) => {
      if (!vazi) return
      const ja = rang(r, profilId)
      const promena = promenaMesta(prethodno.current, ja)
      if (ja) prethodno.current = ja.mesto
      setRedovi(r)
      if (promena) setNovo(true)
    }, () => {}) // shortcut: rang je dodatak, kad upit padne nema strelice ni ćaskanja; pri sledećem unosu se pokuša opet
    return () => { vazi = false }
  }, [aktivan, unosi, profilId])

  const potvrdi = useCallback(() => setNovo(false), [])
  const mesto = redovi && profilId ? rang(redovi, profilId) : null
  return { redovi, mesto, novo, potvrdi }
}
