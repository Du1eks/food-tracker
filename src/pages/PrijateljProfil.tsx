import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ChevronLeft, UserMinus } from 'lucide-react'
import { danas } from '../lib/datum'
import { fmt } from '../lib/ishrana'
import { ukloniPrijateljstvo, zbirZaDan } from '../lib/podaci'
import { mesto, type Zbir } from '../lib/rang'
import './dan.css'
import './prijatelji.css'

// Prijatelj vidi samo današnji zbir; obroci i profil ostaju privatni (docs/dozvole.md)
export default function PrijateljProfil() {
  const { id } = useParams()
  const idi = useNavigate()
  const [zbirovi, setZbirovi] = useState<Zbir[] | null>(null)
  const [greska, setGreska] = useState('')

  useEffect(() => {
    zbirZaDan(danas()).then(setZbirovi).catch(() => setGreska('Ne mogu da učitam podatke. Proveri internet pa osveži stranicu.'))
  }, [])

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
              <div>
                <p className="tiho-tekst num">{pct}% dnevnog cilja kcal</p>
                <span className="merac velik" aria-hidden><i style={{ width: `${pct}%` }} /></span>
              </div>
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
      </main>
    </>
  )
}
