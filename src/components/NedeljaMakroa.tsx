import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { danas, izIso, pomeri } from '../lib/datum'
import { fmt, type Makrosi } from '../lib/ishrana'
import { makroiPoDanima } from '../lib/podaci'
import './nedelja-makroa.css'

const DANI = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']
const DANI_PUNI = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja']
const kratkiDatum = new Intl.DateTimeFormat('sr-Latn', { day: 'numeric', month: 'short' })
const MAKROI = [
  { k: 'proteini', ime: 'Proteini', slovo: 'P' },
  { k: 'uh', ime: 'UH', slovo: 'UH' },
  { k: 'masti', ime: 'Masti', slovo: 'M' },
] as const
const grama = (m: Makrosi) => m.proteini + m.uh + m.masti

// "Tvoj napredak": naslagani stubići P/UH/M po danu za jednu nedelju (pon–ned)
export default function NedeljaMakroa() {
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
    <section className="panel kal-napredak" aria-labelledby="graf-naslov">
      <div className="panel-glava">
        <h2 id="graf-naslov">Tvoj napredak</h2>
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
