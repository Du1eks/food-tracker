import { Link } from 'react-router'
import { rang, type Zbir } from '../lib/rang'
import Pehar from './Pehar'

// Rang za danas u gornjoj traci: mali pehar u boji mesta (1. zlato, 2. srebro, 3. bronza, dalje "drvo") i mesto.
// Samac (nema drugara) i dok se rang učita nemaju značku: nema šta da se poredi, a ikona Prijatelji je tu.
export default function RangZnacka({ redovi, profilId }: { redovi: Zbir[] | 'greska' | null; profilId: string | undefined }) {
  const r = Array.isArray(redovi) && profilId ? rang(redovi, profilId) : null
  if (!r || r.ukupno === 1) return null
  const ja = (redovi as Zbir[]).find((x) => x.id === profilId)
  const vrsta = ['zlato', 'srebro', 'bronza'][r.mesto - 1] ?? 'drvo'
  const opis = `Rang za danas: ${r.mesto}. mesto od ${r.ukupno}${ja?.ima_cilj ? `, ${Math.round(ja.procenat * 100)}% dnevnog cilja` : ', postavi dnevni cilj u profilu'}`
  return (
    // klasa pehar-<vrsta> daje --varnica, pa su pehar i broj iste boje
    <Link to="/prijatelji" className={`plocica svetla rang-znacka pehar-${vrsta}`} aria-label={opis} title="Rang za danas">
      <Pehar vrsta={vrsta} />
      <span className="rang-znacka-mesto num" aria-hidden>{r.mesto}.</span>
    </Link>
  )
}
