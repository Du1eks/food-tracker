import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Users } from 'lucide-react'
import { danas } from '../lib/datum'
import { zbirZaDan } from '../lib/podaci'
import { rang, type Zbir } from '../lib/rang'
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

  return (
    <div className="rang-omot">
      {r && <Maskota poza={r.poza} />}
      {redovi === 'greska' ? (
        <p className="rang rang-prazno">Rang trenutno nije dostupan.</p>
      ) : (
        <Link to="/prijatelji" className="rang">
          {sam ? (
            <span className="plocica svetla rang-mesto" aria-hidden><Users size={26} strokeWidth={2.5} /></span>
          ) : (
            <span className="rang-mesto num" aria-hidden>{r.mesto}.</span>
          )}
          <span className="rang-tekst">
            {sam ? (
              <>
                <b>Dodaj prijatelje</b>
                <small>Takmiči se ko bliže stiže do dnevnog cilja</small>
              </>
            ) : (
              <>
                <b>Rang za danas</b>
                <small className="num">
                  {profil?.cilj_kcal ? `Od ${r.ukupno} · ${procenat}% dnevnog cilja kcal` : 'Postavi dnevni cilj u profilu da uđeš u rang'}
                </small>
              </>
            )}
          </span>
          <span className="plocica svetla" aria-hidden><ChevronRight size={22} /></span>
        </Link>
      )}
    </div>
  )
}
