import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Users } from 'lucide-react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { rang, staKaze, sufiksMesta, type Zbir } from '../lib/rang'
import { useProfil } from './useProfil'
import Maskota from './Maskota'
import '../pages/prijatelji.css'

// Polje ranga na glavnom ekranu; maskota stoji na njegovoj gornjoj ivici i povremeno nešto kaže.
// `kljuc` se menja posle svakog unosa (uneto kcal), pa se rang preračuna.
export default function RangPolje({ kljuc }: { kljuc: number }) {
  const { profil } = useProfil()
  const [redovi, setRedovi] = useState<Zbir[] | 'greska' | null>(null)
  const [govor, setGovor] = useState<string | null>(null)

  useEffect(() => {
    let aktivan = true
    zbirZaDan(danas())
      .then((r) => aktivan && setRedovi(r))
      .catch(() => aktivan && setRedovi('greska'))
    return () => { aktivan = false }
  }, [kljuc])

  const r = Array.isArray(redovi) && profil ? rang(redovi, profil.id) : null
  const ja = Array.isArray(redovi) ? redovi.find((x) => x.id === profil?.id) : undefined
  const recenice = r && ja ? staKaze(r, ja) : []
  const recKljuc = recenice.join('|')

  // Nasumično ćaskanje: prvi put posle 2,5 s, pa na 9–16 s, oblačić stoji 4,5 s; ćuti dok je tab sakriven
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
    return () => { clearTimeout(sledeci); clearTimeout(gasi) }
  }, [recKljuc])

  if (redovi === null) return <div className="rang-omot"><div className="rang" aria-hidden /></div>

  const sam = !r || r.ukupno === 1
  const procenat = Math.round(Number(ja?.procenat ?? 0) * 100)
  // Na polju je samo broj i kratak poziv; ceo opis ide čitaču ekrana
  const opis = sam
    ? 'Dodaj prijatelje i takmiči se ko bliže stiže do dnevnog cilja'
    : `Rang za danas: ${r.mesto}. mesto od ${r.ukupno}${profil?.cilj_kcal ? `, ${procenat}% dnevnog cilja` : ', postavi dnevni cilj u profilu'}. Pogledaj leaderboard`

  return (
    <div className={`rang-omot${govor ? ' govori' : ''}`}>
      {r && <Maskota poza={r.poza} />}
      {/* Ćaskanje je ukras: čitač ekrana dobija sve bitno iz opisa polja */}
      {govor && <p key={govor} className="rang-govor" aria-hidden>{govor}</p>}
      {redovi === 'greska' ? (
        <p className="rang rang-prazno">Rang trenutno nije dostupan.</p>
      ) : (
        <Link to="/prijatelji" className="rang" aria-label={opis}>
          {sam ? (
            <span className="plocica rang-mesto" aria-hidden><Users size={30} strokeWidth={2.5} /></span>
          ) : (
            <span key={r.mesto} className="rang-mesto num" aria-hidden>{r.mesto}<sup>{sufiksMesta(r.mesto)}</sup></span>
          )}
          <span className="rang-poziv" aria-hidden>{sam ? 'Dodaj prijatelje' : 'Pogledaj leaderboard'}</span>
          <span className="plocica rang-strelica" aria-hidden><ChevronRight size={22} strokeWidth={2.75} /></span>
        </Link>
      )}
    </div>
  )
}
