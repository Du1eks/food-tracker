import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { danas, ispravan, izIso, lepDatum, pomeri } from '../lib/datum'
import { fmt, zbir, type Unos } from '../lib/ishrana'
import { kcalPoDanima, unosiZaDan } from '../lib/podaci'
import { plamen } from '../lib/plamen'
import { useProfil } from '../components/useProfil'
import DodajNamirnicu from '../components/DodajNamirnicu'
import TabelaDana from '../components/TabelaDana'
import RangPolje from '../components/RangPolje'
import NedeljaMakroa from '../components/NedeljaMakroa'
import Sir from '../components/Sir'
import { PecatAlat, PecatDefs, PecatOtisak } from '../components/Pecat'
import './dan.css'

export default function Dan() {
  const param = useParams().datum
  const datum = param ?? danas()
  const { profil } = useProfil()
  // Pamtimo za koji su datum unosi, da se pri promeni dana ne prikažu stari.
  const [ucitano, setUcitano] = useState<{ datum: string; unosi: Unos[] } | null>(null)
  const [greska, setGreska] = useState('')
  const [govor, setGovor] = useState<string | null>(null) // šta miš usput kaže o rangu (bira RangPolje, izgovara miš)
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
      <Nedelja datum={datum} kcalDana={unosi && uneto.kcal} cilj={profil?.cilj_kcal ?? null} />
      {/* Datum se vidi u redu nedelje; naslov ostaje za čitač ekrana */}
      <h1 className="sr">{lepDatum(datum)}</h1>
      {!jeDanas && <div className="dan-naslov"><Link className="dugme tiho" to="/">Nazad na danas</Link></div>}
      <Traka uneto={uneto} cilj={profil} dan={unosi && datum} />
      {/* Ispod luka: računar = unos levo, grafik makroa i rang desno, tabela preko cele širine; telefon = rang, unos, tabela (dan.css) */}
      <main className="dan">
        {jeDanas && <RangPolje kljuc={uneto.kcal} onGovor={setGovor} />}
        <DodajNamirnicu key={datum} datum={datum} unosi={unosi} onDodato={ucitaj} govor={govor} />
        <NedeljaMakroa kljuc={uneto.kcal} />
        <section className="dan-tabela" aria-label="Unosi za dan">
          {greska ? <p className="greska" role="alert">{greska}</p> : <TabelaDana unosi={unosi} onPromena={ucitaj} />}
        </section>
      </main>
    </>
  )
}

type Cilj = { cilj_kcal: number | null; cilj_proteini: number | null; cilj_uh: number | null; cilj_masti: number | null }

// "Pogođen cilj kalorija" je isto pravilo kao plamen na rang listi (lib/plamen.ts).
const pogodio = (kcal: number, cilj: number | null) => plamen({ ima_cilj: !!cilj, procenat: cilj ? kcal / cilj : 0, pogodio_proteine: false }).kalorije
// Proteini i masti: isto poređenje kao stanjeMisa (lib/rang.ts): cilj postoji i uneto ga je dostiglo
const dostigao = (uneto: number, cilj: number | null | undefined) => !!cilj && uneto >= cilj
// Pečat udara samo za cilj koji je upravo pređen na istom, već učitanom danu; posle učitavanja pečat samo stoji
const PECATI = ['kcal', 'proteini', 'masti'] as const

// Luk je polukrug poluprečnika 85 oko (100, 100) u viewBox-u 200×108; pathLength=100 pa je dužina ispune = procenat.
const LUK = 'M15 100 A85 85 0 0 1 185 100'

// Kartica dnevnog napretka: preispiše se posle svakog unosa (ključ na vrednosti pokreće animaciju table).
// dan: datum čiji su unosi učitani (null dok se učitavaju), da učitavanje ne izgleda kao prelazak cilja
function Traka({ uneto, cilj, dan }: { uneto: ReturnType<typeof zbir>; cilj: Cilj | null; dan: string | null }) {
  const c = cilj?.cilj_kcal ?? null
  const pogodjeni = {
    kcal: pogodio(uneto.kcal, c),
    proteini: dostigao(uneto.proteini, cilj?.cilj_proteini),
    masti: dostigao(uneto.masti, cilj?.cilj_masti),
  }
  const potpis = PECATI.filter((k) => pogodjeni[k]).join(',')
  const [udari, setUdari] = useState<string[]>([])
  const prosli = useRef<{ dan: string; potpis: string } | null>(null)
  useEffect(() => {
    if (!dan) return
    const bio = prosli.current?.dan === dan ? prosli.current.potpis.split(',') : null
    setUdari(bio ? potpis.split(',').filter((k) => k && !bio.includes(k)) : []) // eslint-disable-line react-hooks/set-state-in-effect -- prelazak cilja vidimo tek kad stigne novi zbir
    prosli.current = { dan, potpis }
  }, [dan, potpis])

  const odnos = c ? uneto.kcal / c : 0
  const p = Math.min(odnos, 1)
  const ugao = Math.PI * (1 - p)
  const razlika = c ? c - uneto.kcal : 0

  const makrosi = [
    { naziv: 'Proteini', k: 'proteini', u: uneto.proteini, c: cilj?.cilj_proteini },
    { naziv: 'Ugljeni hidrati', k: 'uh', u: uneto.uh, c: cilj?.cilj_uh },
    { naziv: 'Masti', k: 'masti', u: uneto.masti, c: cilj?.cilj_masti },
  ]

  return (
    <section className="traka" aria-live="polite" aria-labelledby="napredak-naslov">
      <PecatDefs />
      <div className="napredak">
        <h2 id="napredak-naslov" className="traka-oznaka">Dnevni napredak</h2>
        <div className="luk">
          <svg viewBox="0 0 200 108" aria-hidden>
            {/* Tečnost: zelena cev (svetlija unutra, tamnija spolja), a preko nje mehurići i odsjaj teku samo kroz ispunjeni deo (maska) */}
            <defs>
              <radialGradient id="luk-tecnost" gradientUnits="userSpaceOnUse" cx="100" cy="100" r="92.5">
                <stop offset="0.84" style={{ stopColor: 'var(--luk-svetla)' }} />
                <stop offset="0.93" style={{ stopColor: 'var(--zelena)' }} />
                <stop offset="1" style={{ stopColor: 'var(--luk-tamna)' }} />
              </radialGradient>
              <mask id="luk-maska" maskUnits="userSpaceOnUse">
                <path className="luk-ispuna" d={LUK} pathLength={100} stroke="#fff" style={{ strokeDasharray: `${p * 100} 100` }} />
              </mask>
            </defs>
            <path className="luk-staza" d={LUK} pathLength={100} />
            {p > 0 && (
              <>
                <path className="luk-ispuna" d={LUK} pathLength={100} stroke="url(#luk-tecnost)" style={{ strokeDasharray: `${p * 100} 100` }} />
                <g mask="url(#luk-maska)">
                  <path className="luk-odsjaj" d={LUK} pathLength={100} />
                  <path className="luk-mehurici" d={LUK} pathLength={100} />
                </g>
              </>
            )}
          </svg>
          {c && (
            <span className="luk-procenat num" style={{ left: `${(100 + 85 * Math.cos(ugao)) / 2}%`, top: `${((100 - 85 * Math.sin(ugao)) / 108) * 100}%` }}>
              {Math.round(odnos * 100)}%
            </span>
          )}
          <div className="luk-sredina">
            <Sir key={String(pogodio(uneto.kcal, c))} slavi={pogodio(uneto.kcal, c)} />
            <p className="traka-broj num" data-makro="kcal"><span key={uneto.kcal} className="preklop">{fmt(uneto.kcal)}</span></p>
            <p className="traka-sitno num">{c ? `od ${fmt(c)} kcal` : 'kcal uneto'}</p>
          </div>
          {pogodjeni.kcal && <Pecat naziv="Kalorije" udara={udari.includes('kcal')} red={0} />}
        </div>
        {c && <p className="traka-ostatak num">{razlika < 0 ? `Preko cilja ${fmt(-razlika)} kcal` : `Ostalo ${fmt(razlika)} kcal`}</p>}
        <dl className="traka-makrosi">
          {makrosi.map((m) => (
            <div key={m.naziv}>
              <dt>{m.naziv}</dt>
              <dd className="num" data-makro={m.k}>
                <span key={m.u} className="preklop">{fmt(m.u)}</span>
                <small>{m.c ? ` / ${fmt(m.c)} g` : ' g'}</small>
                {!!m.c && <span className="makro-traka" style={{ '--p': `${Math.min(m.u / m.c, 1) * 100}%` } as React.CSSProperties} aria-hidden />}
              </dd>
              {(m.k === 'proteini' || m.k === 'masti') && pogodjeni[m.k] && <Pecat naziv={m.naziv} udara={udari.includes(m.k)} red={udari.indexOf(m.k)} />}
            </div>
          ))}
        </dl>
      </div>
      {c ? (
        // Samo na telefonu (dan.css): glava miša vodi do polja "Reci mišu šta si jeo" i odmah otvara tastaturu; na hover se isplazi
        <a className="traka-mis" href="#unos" aria-label="Reci mišu šta si jeo" onClick={(e) => {
          const polje = document.getElementById('sta-si-jeo')
          if (!polje) return
          e.preventDefault()
          polje.focus({ preventScroll: true })
          polje.scrollIntoView({ block: 'center' })
        }}>
          <img src="/maskota/glava.webp" alt="" width={60} height={60} />
          <img className="jezik" src="/maskota/glava-jezik.webp" alt="" width={60} height={60} />
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

// Pečat "cilj pogođen": crtež je u components/Pecat. udara: alat se spusti, udari i odskoči, a otisak ostane;
// bez toga (učitana strana) stoji samo otisak. red: pečati udaraju jedan za drugim. Pokret je u dan.css.
function Pecat({ naziv, udara, red }: { naziv: string; udara: boolean; red: number }) {
  return (
    <span className={`pecat${udara ? ' udara' : ''}`} style={{ '--red': red } as React.CSSProperties}>
      <PecatOtisak naziv={naziv} />
      {udara && <PecatAlat />}
    </span>
  )
}

const DANI = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']
const imeMeseca = new Intl.DateTimeFormat('sr-Latn', { month: 'long' })
// Mesec iznad dana; nedelja na prelazu meseci pokaže oba ("Oktobar – Novembar")
function mesec(od: string, doDana: string) {
  const [a, b] = [od, doDana].map((d) => imeMeseca.format(izIso(d)))
  const m = a === b ? a : `${a} – ${b}`
  return m.charAt(0).toUpperCase() + m.slice(1)
}
const putanja = (d: string) => (d === danas() ? '/' : `/dan/${d}`)

// Nedelja izabranog dana: kvačica = pogođen cilj kalorija, "!" = prošao dan sa unosom a bez cilja, krug = budući ili prazan dan.
// kcalDana je sveži zbir izabranog dana (null dok se učitava), da se kvačica pokaže odmah posle unosa.
function Nedelja({ datum, kcalDana, cilj }: { datum: string; kcalDana: number | null; cilj: number | null }) {
  const pon = pomeri(datum, -((izIso(datum).getDay() + 6) % 7))
  const [ucitano, setUcitano] = useState<{ pon: string; kcal: Map<string, number> } | null>(null)
  useEffect(() => {
    let vazi = true
    // shortcut: kad upit padne, dani ostaju prazni krugovi (grešku već javlja tabela dana)
    kcalPoDanima(pon, pomeri(pon, 6)).then((kcal) => vazi && setUcitano({ pon, kcal }), () => {})
    return () => { vazi = false }
  }, [pon, kcalDana])

  const dan0 = danas()
  const sledeca = pomeri(datum, 7)
  return (
    <nav className="nedelja" aria-label="Izbor dana">
      <Link className="plocica svetla" to={putanja(pomeri(datum, -7))} aria-label="Prethodna nedelja">
        <ChevronLeft size={22} aria-hidden />
      </Link>
      <div className="nedelja-sredina">
      <p className="nedelja-mesec">{mesec(pon, pomeri(pon, 6))}</p>
      <ol className="nedelja-dani">
        {DANI.map((ime, i) => {
          const d = pomeri(pon, i)
          const kcal = d === datum && kcalDana != null ? kcalDana : ucitano?.pon === pon ? ucitano.kcal.get(d) : undefined
          const stanje = kcal && pogodio(kcal, cilj) ? 'pogodjen' : kcal && cilj && d < dan0 ? 'promasen' : 'prazan'
          const opis = stanje === 'pogodjen' ? ', cilj pogođen' : stanje === 'promasen' ? ', cilj nije pogođen' : ''
          const sadrzaj = (
            <>
              <span className="nedelja-ime">{ime}</span>
              <span className="nedelja-broj num">{izIso(d).getDate()}.</span>
              <span className="nedelja-znak">{stanje === 'pogodjen' ? <Check size={20} strokeWidth={3} aria-hidden /> : stanje === 'promasen' ? '!' : null}</span>
            </>
          )
          return (
            <li key={d}>
              {d > dan0 ? (
                <span className="nedelja-dan buduci">{sadrzaj}</span>
              ) : (
                <Link className="nedelja-dan" to={putanja(d)} data-stanje={stanje} data-danas={d === dan0 || undefined}
                  aria-current={d === datum ? 'page' : undefined} aria-label={`${lepDatum(d)}${d === dan0 ? ', danas' : ''}${opis}`}>
                  {sadrzaj}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      </div>
      {pomeri(pon, 7) <= dan0 ? (
        <Link className="plocica svetla" to={putanja(sledeca < dan0 ? sledeca : dan0)} aria-label="Sledeća nedelja">
          <ChevronRight size={22} aria-hidden />
        </Link>
      ) : (
        <span className="nedelja-prazno" aria-hidden />
      )}
    </nav>
  )
}
