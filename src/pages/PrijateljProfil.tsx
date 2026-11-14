import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ChevronLeft, UserMinus } from 'lucide-react'
import { danas } from '../lib/datum'
import { fmt } from '../lib/ishrana'
import { prijateljDeliUnose, ukloniPrijateljstvo, unosiPrijatelja, zbirZaDan, type PrijateljUnos } from '../lib/podaci'
import { mesto, type Zbir } from '../lib/rang'
import TabelaPrijatelja from '../components/TabelaPrijatelja'
import './dan.css'
import './prijatelji.css'

// Prijatelj vidi današnji zbir, a unose samo ako ih je uključio u Profilu; profil ostaje privatan (docs/dozvole.md)
export default function PrijateljProfil() {
  const { id } = useParams()
  const idi = useNavigate()
  const [zbirovi, setZbirovi] = useState<Zbir[] | null>(null)
  // null = učitavam, 'ne-deli' = prijatelj nije uključio deljenje
  const [unosi, setUnosi] = useState<PrijateljUnos[] | 'ne-deli' | null>(null)
  const [greska, setGreska] = useState('')

  useEffect(() => {
    const nema = () => setGreska('Ne mogu da učitam podatke. Proveri internet pa osveži stranicu.')
    zbirZaDan(danas()).then(setZbirovi).catch(nema)
    prijateljDeliUnose(id!)
      .then(async (deli) => setUnosi(deli ? await unosiPrijatelja(id!, danas()) : 'ne-deli'))
      .catch(nema)
  }, [id])

  async function ukloni(ime: string | null) {
    if (!confirm(`Ukloniti ${ime} iz prijatelja?`)) return
    try {
      await ukloniPrijateljstvo(id!)
      idi('/prijatelji', { replace: true })
    } catch {
      setGreska('Ne mogu da uklonim prijatelja. Proveri internet pa probaj ponovo.')
    }
  }

  const r = zbirovi?.find((x) => x.id === id)
  // Nije (više) prijatelj: nema šta da se prikaže
  if (zbirovi && !r) return <Navigate to="/prijatelji" replace />

  const pct = r ? Math.round(r.procenat * 100) : 0
  const makrosi = r ? [['Proteini', r.proteini], ['Ugljeni hidrati', r.uh], ['Masti', r.masti]] as const : []
  return (
    <>
      <div className="dan-red">
        <Link className="plocica svetla" to="/prijatelji" aria-label="Nazad na prijatelje"><ChevronLeft size={22} aria-hidden /></Link>
        <h1>{r?.nadimak ?? 'Prijatelj'}</h1>
        <span className="dan-oznaka">danas</span>
      </div>
      <main className="prijatelj">
        {greska && <p className="greska" role="alert">{greska}</p>}
        {zbirovi && r && (
          <section className="panel" aria-label={`Današnji unos: ${r.nadimak}`}>
            <h2 className="panel-glava">{mesto(zbirovi, r)}. mesto od {zbirovi.length}</h2>
            <div className="panel-telo">
              <p className="prijatelj-broj num"><span>{fmt(r.kcal)}</span><small>kcal uneto</small></p>
              {r.ima_cilj ? (
                <div>
                  <p className="tiho-tekst num">{pct}% dnevnog cilja kcal</p>
                  <span className="merac velik" aria-hidden><i style={{ width: `${pct}%` }} /></span>
                </div>
              ) : (
                <p className="tiho-tekst">Nisu uneti podaci o profilu, pa nema dnevni cilj ni procenat.</p>
              )}
              <dl className="prijatelj-makrosi">
                {makrosi.map(([naziv, v]) => (
                  <div key={naziv}><dt>{naziv}</dt><dd className="num">{fmt(v)} g</dd></div>
                ))}
              </dl>
              <button className="dugme tiho odjava" onClick={() => ukloni(r.nadimak)}>
                <UserMinus size={18} aria-hidden /> Ukloni iz prijatelja
              </button>
            </div>
          </section>
        )}
        {zbirovi && r && unosi && (
          <section className="panel" aria-label={`Šta je jeo: ${r.nadimak}`}>
            <h2 className="panel-glava">Šta je jeo danas</h2>
            <div className="panel-telo">
              {unosi === 'ne-deli' ? (
                <p className="tiho-tekst">{r.nadimak} ne deli šta je jeo. To može da uključi u svom profilu.</p>
              ) : unosi.length === 0 ? (
                <p className="tiho-tekst">Danas još ništa nije upisao.</p>
              ) : (
                <TabelaPrijatelja unosi={unosi} />
              )}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
