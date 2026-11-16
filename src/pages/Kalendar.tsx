import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { danas, izIso, pomeri, uIso } from '../lib/datum'
import { fmt, type Makrosi } from '../lib/ishrana'
import { kcalPoDanima, makroiPoDanima } from '../lib/podaci'
import { useProfil } from '../components/useProfil'
import './dan.css'
import './kalendar.css'

const DANI = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']
const DANI_PUNI = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja']
const mesecNaslov = new Intl.DateTimeFormat('sr-Latn', { month: 'long', year: 'numeric' })
const kratkiDatum = new Intl.DateTimeFormat('sr-Latn', { day: 'numeric', month: 'short' })
const MAKROI = [
  { k: 'proteini', ime: 'Proteini', slovo: 'P' },
  { k: 'uh', ime: 'UH', slovo: 'UH' },
  { k: 'masti', ime: 'Masti', slovo: 'M' },
] as const
const grama = (m: Makrosi) => m.proteini + m.uh + m.masti

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
        <NedeljaMakroa />
      </main>
    </>
  )
}

// "Tvoj napredak": naslagani stubići P/UH/M po danu za jednu nedelju (pon–ned)
function NedeljaMakroa() {
  const danasIso = danas()
  const ova = pomeri(danasIso, -((izIso(danasIso).getDay() + 6) % 7))
  const [pon, setPon] = useState(ova)
  const [ucitano, setUcitano] = useState<{ pon: string; m: Map<string, Makrosi> } | null>(null)
  const [greska, setGreska] = useState(false)
  const makroi = ucitano?.pon === pon ? ucitano.m : null

  useEffect(() => {
    makroiPoDanima(pon, pomeri(pon, 6))
      .then((m) => { setUcitano({ pon, m }); setGreska(false) })
      .catch(() => setGreska(true))
  }, [pon])

  const dani = Array.from({ length: 7 }, (_, i) => pomeri(pon, i))
  const maks = Math.max(1, ...dani.map((d) => { const m = makroi?.get(d); return m ? grama(m) : 0 }))
  const od = izIso(pon)
  const dok = izIso(dani[6])
  const opseg = od.getMonth() === dok.getMonth() ? `${od.getDate()}–${kratkiDatum.format(dok)}` : `${kratkiDatum.format(od)} – ${kratkiDatum.format(dok)}`

  return (
    <section className="panel kal-napredak" aria-labelledby="napredak-naslov">
      <div className="panel-glava">
        <h2 id="napredak-naslov">Tvoj napredak</h2>
        <div className="kal-nedelja">
          <button type="button" className="plocica svetla" onClick={() => setPon(pomeri(pon, -7))} aria-label="Prethodna nedelja">
            <ChevronLeft size={20} aria-hidden />
          </button>
          <span className="num" aria-live="polite">{opseg}</span>
          <button type="button" className="plocica svetla" onClick={() => setPon(pomeri(pon, 7))} disabled={pon >= ova} aria-label="Sledeća nedelja">
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>
      </div>
      {greska && <p className="greska" role="alert">Ne mogu da učitam grafik. Proveri internet pa osveži stranicu.</p>}
      <ul className="kal-graf-legenda" aria-hidden>
        {MAKROI.map((x) => <li key={x.k} data-makro={x.k}>{x.ime}</li>)}
      </ul>
      <ol className="kal-graf" aria-label="Makroi po danima, u gramima" aria-busy={!makroi}>
        {dani.map((d, i) => {
          const m = makroi?.get(d)
          const ima = m && grama(m) > 0
          return (
            <li key={d} className={d === danasIso ? 'danas' : undefined}>
              <span className="kal-graf-zbir num" aria-hidden>{ima ? fmt(Math.round(grama(m))) : ''}</span>
              <span className="kal-stubic" aria-hidden>
                {ima
                  ? MAKROI.filter((x) => m[x.k] > 0).map((x) => (
                      <i key={x.k} data-makro={x.k} style={{ '--d': m[x.k] / maks } as React.CSSProperties} />
                    ))
                  : <i className="prazan" />}
              </span>
              <span className="kal-graf-dan" aria-hidden>{DANI[i]}</span>
              <span className="sr">
                {DANI_PUNI[i]}: {ima ? MAKROI.map((x) => `${x.slovo} ${fmt(m[x.k])} g`).join(', ') : 'nema unosa'}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
