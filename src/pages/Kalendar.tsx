import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { danas, izIso, uIso } from '../lib/datum'
import { fmt } from '../lib/ishrana'
import { kcalPoDanima } from '../lib/podaci'
import { useProfil } from '../components/useProfil'
import './dan.css'
import './kalendar.css'

const DANI = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']
const mesecNaslov = new Intl.DateTimeFormat('sr-Latn', { month: 'long', year: 'numeric' })

export default function Kalendar() {
  const [params] = useSearchParams()
  const m = params.get('m')
  // ?m=2026-11 bira mesec; bez njega tekući
  const prvi = m && /^\d{4}-\d{2}$/.test(m) ? izIso(`${m}-01`) : izIso(danas().slice(0, 7) + '-01')
  const kljuc = uIso(prvi).slice(0, 7)
  const poslednji = new Date(prvi.getFullYear(), prvi.getMonth() + 1, 0)
  const { profil } = useProfil()
  const cilj = profil?.cilj_kcal ?? null

  const [ucitano, setUcitano] = useState<{ kljuc: string; kcal: Map<string, number> } | null>(null)
  const [greska, setGreska] = useState('')
  const kcal = ucitano?.kljuc === kljuc ? ucitano.kcal : null

  useEffect(() => {
    kcalPoDanima(`${kljuc}-01`, uIso(new Date(Number(kljuc.slice(0, 4)), Number(kljuc.slice(5)), 0)))
      .then((k) => { setUcitano({ kljuc, kcal: k }); setGreska('') })
      .catch(() => setGreska('Ne mogu da učitam kalendar. Proveri internet pa osveži stranicu.'))
  }, [kljuc])

  const pomak = (d: number) => uIso(new Date(prvi.getFullYear(), prvi.getMonth() + d, 1)).slice(0, 7)
  const praznih = (prvi.getDay() + 6) % 7 // nedelja je 0, a nedelja nam počinje od ponedeljka
  const dani = Array.from({ length: poslednji.getDate() }, (_, i) => uIso(new Date(prvi.getFullYear(), prvi.getMonth(), i + 1)))
  const danasIso = danas()
  const naslov = mesecNaslov.format(prvi)

  return (
    <>
      <nav className="dan-red kal-red" aria-label="Izbor meseca">
        <Link className="plocica svetla" to={`/kalendar?m=${pomak(-1)}`} aria-label="Prethodni mesec"><ChevronLeft size={22} aria-hidden /></Link>
        <h1>{naslov.charAt(0).toUpperCase() + naslov.slice(1)}</h1>
        {kljuc < danasIso.slice(0, 7) && (
          <Link className="plocica svetla" to={`/kalendar?m=${pomak(1)}`} aria-label="Sledeći mesec"><ChevronRight size={22} aria-hidden /></Link>
        )}
        {cilj && <p className="kal-legenda num">cilj {fmt(cilj)} kcal · traka pokazuje koliko je dana ispunjeno</p>}
      </nav>
      <main className="kal">
        {greska && <p className="greska" role="alert">{greska}</p>}
        <ol className="kal-mreza" aria-busy={!kcal}>
          {DANI.map((d) => <li key={d} className="kal-dan-ime" aria-hidden>{d}</li>)}
          {Array.from({ length: praznih }, (_, i) => <li key={`p${i}`} aria-hidden />)}
          {dani.map((d) => {
            const k = kcal?.get(d)
            const buduci = d > danasIso
            const sadrzaj = (
              <>
                <span className="kal-broj">{Number(d.slice(8))}</span>
                {k != null && <span className="kal-kcal num">{fmt(Math.round(k))}<small> kcal</small></span>}
                {k != null && cilj && <span className="kal-traka" style={{ '--p': `${Math.min(k / cilj, 1) * 100}%` } as React.CSSProperties} />}
              </>
            )
            return (
              <li key={d}>
                {buduci ? (
                  <span className="kal-polje buduci">{sadrzaj}</span>
                ) : (
                  <Link to={`/dan/${d}`} className={`kal-polje${d === danasIso ? ' danas' : ''}${k != null ? ' ima' : ''}`}
                    aria-label={`${Number(d.slice(8))}. ${naslov}${k != null ? `, ${fmt(Math.round(k))} kcal` : ', nema unosa'}`}>
                    {sadrzaj}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </main>
    </>
  )
}
