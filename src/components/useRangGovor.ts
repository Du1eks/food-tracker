import { useEffect, useState } from 'react'
import { rang, staKaze, type Zbir } from '../lib/rang'

// Šta miš usput kaže o rangu: nasumično ćaskanje iz mog mesta i procenta (lib/rang staKaze), a izgovara ga miš u oblačiću.
// Prvi put posle 2,5 s, pa na 9–16 s, oblačić stoji 4,5 s; ćuti dok je tab sakriven. Bez redova (null) miš ćuti.
export function useRangGovor(redovi: Zbir[] | 'greska' | null, profilId: string | undefined): string | null {
  const [govor, setGovor] = useState<string | null>(null)
  const r = Array.isArray(redovi) && profilId ? rang(redovi, profilId) : null
  const ja = Array.isArray(redovi) ? redovi.find((x) => x.id === profilId) : undefined
  // string ključ, pa se tajmeri ne restartuju kad stignu isti redovi iznova
  const recKljuc = (r && ja ? staKaze(r, ja) : []).join('|')

  useEffect(() => {
    if (!recKljuc) return
    const lista = recKljuc.split('|')
    let sledeci: number, gasi: number
    const reci = () => {
      if (!document.hidden) {
        setGovor(lista[Math.floor(Math.random() * lista.length)])
        gasi = window.setTimeout(() => setGovor(null), 4500)
      }
      sledeci = window.setTimeout(reci, 9000 + Math.random() * 7000)
    }
    sledeci = window.setTimeout(reci, 2500)
    return () => { clearTimeout(sledeci); clearTimeout(gasi); setGovor(null) }
  }, [recKljuc])

  return govor
}
