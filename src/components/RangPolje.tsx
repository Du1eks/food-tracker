import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Users } from 'lucide-react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { rang, sufiksMesta, type Zbir } from '../lib/rang'
import { useProfil } from './useProfil'
import Maskota from './Maskota'
import '../pages/prijatelji.css'

// Polje ranga na glavnom ekranu; maskota stoji na njegovoj gornjoj ivici.
// `kljuc` se menja posle svakog unosa (uneto kcal), pa se rang preračuna.
export default function RangPolje({ kljuc }: { kljuc: number }) {
  const { profil } = useProfil()
  const [redovi, setRedovi] = useState<Zbir[] | 'greska' | null>(null)

  useEffect(() => {
    let aktivan = true
    zbirZaDan(danas())
      .then((r) => aktivan && setRedovi(r))
      .catch(() => aktivan && setRedovi('greska'))
    return () => { aktivan = false }
  }, [kljuc])

  if (redovi === null) return <div className="rang-omot"><div className="rang" aria-hidden /></div>

  const r = Array.isArray(redovi) && profil ? rang(redovi, profil.id) : null
  const sam = !r || r.ukupno === 1
  const procenat = Math.round(Number(Array.isArray(redovi) ? redovi.find((x) => x.id === profil?.id)?.procenat ?? 0 : 0) * 100)
  // Na polju je samo broj i kratak poziv; ceo opis ide čitaču ekrana
  const opis = sam
    ? 'Dodaj prijatelje i takmiči se ko bliže stiže do dnevnog cilja'
    : `Rang za danas: ${r.mesto}. mesto od ${r.ukupno}${profil?.cilj_kcal ? `, ${procenat}% dnevnog cilja` : ', postavi dnevni cilj u profilu'}. Pogledaj leaderboard`

  return (
    <div className="rang-omot">
      {r && <Maskota poza={r.poza} />}
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
