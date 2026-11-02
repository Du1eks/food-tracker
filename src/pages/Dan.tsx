import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { danas, ispravan, lepDatum, pomeri } from '../lib/datum'
import { fmt, zbir, type Unos } from '../lib/ishrana'
import { unosiZaDan } from '../lib/podaci'
import { useProfil } from '../components/useProfil'
import DodajNamirnicu from '../components/DodajNamirnicu'
import TabelaDana from '../components/TabelaDana'
import './dan.css'

export default function Dan() {
  const param = useParams().datum
  const datum = param ?? danas()
  const { profil } = useProfil()
  // Pamtimo za koji su datum unosi, da se pri promeni dana ne prikažu stari.
  const [ucitano, setUcitano] = useState<{ datum: string; unosi: Unos[] } | null>(null)
  const [greska, setGreska] = useState('')
  const unosi = ucitano?.datum === datum ? ucitano.unosi : null

  const ucitaj = useCallback(async () => {
    try {
      setUcitano({ datum, unosi: await unosiZaDan(datum) })
      setGreska('')
    } catch {
      setGreska('Ne mogu da učitam unose. Proveri internet pa osveži stranicu.')
    }
  }, [datum])

  useEffect(() => {
    ucitaj()
  }, [ucitaj])

  if (param && !ispravan(param)) return <Navigate to="/" replace />

  const jeDanas = datum === danas()
  const uneto = zbir(unosi ?? [])
  return (
    <>
      <Traka uneto={uneto} cilj={profil} />
      <nav className="dan-red" aria-label="Izbor dana">
        <Link className="plocica svetla" to={`/dan/${pomeri(datum, -1)}`} aria-label="Prethodni dan">
          <ChevronLeft size={22} aria-hidden />
        </Link>
        <h1>{lepDatum(datum)}</h1>
        {jeDanas ? (
          <span className="dan-oznaka">danas</span>
        ) : (
          <>
            <Link className="plocica svetla" to={`/dan/${pomeri(datum, 1)}`} aria-label="Sledeći dan">
              <ChevronRight size={22} aria-hidden />
            </Link>
            <Link className="dugme tiho" to="/">Nazad na danas</Link>
          </>
        )}
      </nav>
      <main className="dan">
        <DodajNamirnicu datum={datum} onDodato={ucitaj} />
        <section className="dan-tabela" aria-label="Unosi za dan">
          {greska ? <p className="greska" role="alert">{greska}</p> : <TabelaDana unosi={unosi} onPromena={ucitaj} />}
        </section>
      </main>
    </>
  )
}

type Cilj = { cilj_kcal: number | null; cilj_proteini: number | null; cilj_uh: number | null; cilj_masti: number | null }

// Traka ostatka: preispiše se posle svakog unosa (ključ na vrednosti pokreće animaciju table).
function Traka({ uneto, cilj }: { uneto: ReturnType<typeof zbir>; cilj: Cilj | null }) {
  const imaCilj = !!cilj?.cilj_kcal
  const ostalo = (c: number | null | undefined, u: number) => (c ? c - u : null)
  const kcal = imaCilj ? ostalo(cilj!.cilj_kcal, uneto.kcal)! : uneto.kcal
  const preko = imaCilj && kcal < 0

  const makrosi = [
    { naziv: 'Proteini', v: imaCilj ? ostalo(cilj!.cilj_proteini, uneto.proteini) : uneto.proteini },
    { naziv: 'Ugljeni hidrati', v: imaCilj ? ostalo(cilj!.cilj_uh, uneto.uh) : uneto.uh },
    { naziv: 'Masti', v: imaCilj ? ostalo(cilj!.cilj_masti, uneto.masti) : uneto.masti },
  ]

  return (
    <section className="traka" aria-live="polite">
      <div className="traka-glavno">
        <p className="traka-oznaka">{!imaCilj ? 'Uneto' :preko ? 'Preko cilja' : 'Ostalo do cilja'}</p>
        <p className="traka-broj num">
          <span key={kcal} className="preklop">{fmt(Math.abs(kcal))}</span>
          <small>kcal</small>
        </p>
        {imaCilj && <p className="traka-sitno num">uneto {fmt(uneto.kcal)} od {fmt(cilj!.cilj_kcal!)} kcal</p>}
      </div>
      <dl className="traka-makrosi">
        {makrosi.map((m) => (
          <div key={m.naziv}>
            <dt>{m.naziv}</dt>
            <dd className="num"><span key={m.v ?? 'x'} className="preklop">{m.v == null ? '—' : `${fmt(Math.max(m.v, 0))} g`}</span></dd>
          </div>
        ))}
      </dl>
      {imaCilj ? (
        <a className="plocica traka-strelica" href="#pretraga" aria-label="Dodaj namirnicu">
          <ArrowDown size={34} strokeWidth={2.75} aria-hidden />
        </a>
      ) : (
        <Link className="dugme traka-profil" to="/profil">
          Popuni profil za cilj
          <span className="plocica" aria-hidden><ChevronRight size={22} /></span>
        </Link>
      )}
    </section>
  )
}
