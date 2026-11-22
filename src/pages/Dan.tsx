import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { danas, ispravan, izIso, lepDatum, pomeri } from '../lib/datum'
import { fmt, zbir, type Unos } from '../lib/ishrana'
import { kcalPoDanima, unosiZaDan } from '../lib/podaci'
import { plamen } from '../lib/plamen'
import { useProfil } from '../components/useProfil'
import { useRangGovor } from '../components/useRangGovor'
import DodajNamirnicu from '../components/DodajNamirnicu'
import TabelaDana from '../components/TabelaDana'
import Eksplozija from '../components/Eksplozija'
import CiljPostignut, { NATPIS_TRAJE } from '../components/CiljPostignut'
import { konfete } from '../components/konfete'
import './dan.css'

export default function Dan() {
  const param = useParams().datum
  const datum = param ?? danas()
  const { profil, rang, osveziRang } = useProfil()
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

  const jeDanas = datum === danas()
  const uneto = zbir(unosi ?? [])
  // Značka ranga je u gornjoj traci (Okvir): kad se unosi (ponovo) učitaju, npr. posle novog unosa, rang se preračuna iznova.
  useEffect(() => {
    if (jeDanas && unosi) osveziRang()
  }, [jeDanas, unosi, osveziRang])
  // Miš usput govori o rangu samo na današnjem danu
  const govor = useRangGovor(jeDanas ? rang : null, profil?.id)

  if (param && !ispravan(param)) return <Navigate to="/" replace />

  return (
    <>
      <Nedelja datum={datum} kcalDana={unosi && uneto.kcal} cilj={profil?.cilj_kcal ?? null} />
      {/* Datum se vidi u redu nedelje; naslov ostaje za čitač ekrana */}
      <h1 className="sr">{lepDatum(datum)}</h1>
      {!jeDanas && <div className="dan-naslov"><Link className="dugme tiho" to="/">Nazad na danas</Link></div>}
      {/* dan je "učitan" tek kad stignu i unosi i profil: bez profila nema ciljeva, pa bi profil koji stigne kasnije
          izgledao kao da su svi već pogođeni ciljevi upravo pređeni (slavlje pri učitavanju) */}
      <Traka uneto={uneto} cilj={profil} dan={unosi && profil ? datum : null} />
      {/* Ispod epruvete "šta sam jeo": računar = unos levo, tabela desno; telefon = unos pa tabela ispod (dan.css) */}
      <main className="dan dan-pocetna">
        <DodajNamirnicu key={datum} datum={datum} unosi={unosi} onDodato={ucitaj} govor={govor} />
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
// Slavlje ide samo za cilj koji je upravo pređen na istom, već učitanom danu; posle učitavanja ostaje samo stanje
// (zlatna epruveta, oštećena kartica). Redosled: 3D natpis "Goal achieved!" sa imenima ciljeva, pa ekran skroluje do
// polja tog cilja i zatamni se oko njega (fokus), pa konfete i efekat na polju: epruveta udari i zasija, kartice
// proteina i masti puknu kao napitak (i ostanu oštećene), jedna za drugom.
const CILJEVI = ['kcal', 'proteini', 'masti'] as const
const FOKUS_POSLE = NATPIS_TRAJE - 700 // ms: natpis odleće ka polju, ekran kreće da skroluje
const EFEKAT_POSLE = FOKUS_POSLE + 700 // ms: skrol je stigao; konfete i efekat na polju
const EKSPLOZIJA_TRAJE = 1600 // ms: kartica se nadme, pukne i pređe u oštećeno (isto trajanje je u dan.css)
const bezPokreta = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Epruveta prima do 115% cilja; crta cilja je na 1/1,15 dužine. Mehurići: položaj, brzina, kašnjenje i veličina.
const PREKO = 1.15
const MEHURICI = Array.from({ length: 14 }, (_, i) => ({
  '--x': `${((i * 37) % 92) + 3}%`, '--d': `${1.8 + ((i * 7) % 5) * 0.35}s`, '--k': `${i * 0.43}s`, '--s': `${4 + ((i * 5) % 7)}px`,
}) as React.CSSProperties)

// Kartica dnevnog napretka: preispiše se posle svakog unosa (ključ na vrednosti pokreće animaciju table).
// dan: datum čiji su unosi i profil učitani (null dok se učitavaju), da učitavanje ne izgleda kao prelazak cilja
function Traka({ uneto, cilj, dan }: { uneto: ReturnType<typeof zbir>; cilj: Cilj | null; dan: string | null }) {
  const c = cilj?.cilj_kcal ?? null
  const pogodjeni = {
    kcal: pogodio(uneto.kcal, c),
    proteini: dostigao(uneto.proteini, cilj?.cilj_proteini),
    masti: dostigao(uneto.masti, cilj?.cilj_masti),
  }
  const potpis = CILJEVI.filter((k) => pogodjeni[k]).join(',')
  const [udar, setUdar] = useState<{ pukli: string[]; kasni: number }>({ pukli: [], kasni: 0 })
  const [natpis, setNatpis] = useState<{ kljuc: number; ciljevi: string[] } | null>(null)
  const [fokus, setFokus] = useState<string[]>([]) // polja na koja je ekran upravo skrolovao
  const traka = useRef<HTMLElement>(null)
  const prosli = useRef<{ dan: string; potpis: string } | null>(null)
  // useLayoutEffect: novo stanje (pukla) mora pre iscrtavanja, inače kartica na trenutak već izgleda oštećeno
  useLayoutEffect(() => {
    if (!dan) return
    const bio = prosli.current?.dan === dan ? prosli.current.potpis.split(',') : null
    prosli.current = { dan, potpis }
    const novi = bio ? potpis.split(',').filter((k) => k && !bio.includes(k)) : []
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prelazak cilja vidimo tek kad stigne novi zbir
    setUdar({ pukli: novi.filter((k) => k !== 'kcal'), kasni: EFEKAT_POSLE })
    if (!novi.length) return
    setNatpis({ kljuc: Date.now(), ciljevi: novi })
    const tajmeri = [
      setTimeout(() => setFokus(novi), FOKUS_POSLE),
      setTimeout(() => void konfete(), EFEKAT_POSLE),
      setTimeout(() => setFokus([]), EFEKAT_POSLE + novi.length * (EKSPLOZIJA_TRAJE + 300) + 600),
    ]
    return () => { tajmeri.forEach(clearTimeout); setFokus([]) }
  }, [dan, potpis])
  // Skrol do prvog polja u fokusu (epruveta ili kartica makroa)
  useEffect(() => {
    if (!fokus.length) return
    traka.current?.querySelector(`[data-polje="${fokus[0]}"]`)?.scrollIntoView({ block: 'center', behavior: bezPokreta() ? 'auto' : 'smooth' })
  }, [fokus])
  const kasni = (k: string) => (udar.pukli.includes(k) ? udar.kasni + udar.pukli.indexOf(k) * (EKSPLOZIJA_TRAJE + 300) : null)
  const uFokusu = (k: string) => (fokus.includes(k) ? ' fokus' : '')

  const odnos = c ? uneto.kcal / c : 0
  const p = Math.min(odnos, PREKO)
  const razlika = c ? c - uneto.kcal : 0

  const makrosi = [
    { naziv: 'Proteini', k: 'proteini', u: uneto.proteini, c: cilj?.cilj_proteini },
    { naziv: 'Ugljeni hidrati', k: 'uh', u: uneto.uh, c: cilj?.cilj_uh },
    { naziv: 'Masti', k: 'masti', u: uneto.masti, c: cilj?.cilj_masti },
  ]

  return (
    <section ref={traka} className="traka" aria-live="polite" aria-labelledby="napredak-naslov">
      {natpis && <CiljPostignut key={natpis.kljuc} ciljevi={natpis.ciljevi} onKraj={() => setNatpis(null)} />}
      {fokus.length > 0 && <div className="fokus-zastor" aria-hidden />}
      <div className="napredak">
        <h2 id="napredak-naslov" className="traka-oznaka">Dnevni napredak</h2>
        <p className="traka-kcal num">
          <span className="traka-broj" data-makro="kcal"><span key={uneto.kcal} className="preklop">{fmt(uneto.kcal)}</span></span>
          <span className="traka-sitno">{c ? `/ ${fmt(c)} kcal` : 'kcal uneto'}</span>
        </p>
        {/* Epruveta preko cele širine: neon tečnost raste do isprekidane crte cilja (cev prima do 115% cilja), mehurići stalno idu */}
        <div className={`cev${pogodjeni.kcal ? ' ispunjen' : ''}${uFokusu('kcal')}`} data-polje="kcal" aria-hidden>
          <div className="cev-staklo">
            <div className="cev-tecnost" style={{ width: `${(p / PREKO) * 100}%` }}>
              {MEHURICI.map((m, i) => <i key={i} style={m} />)}
            </div>
          </div>
          {c && <span className="cev-cilj" />}
        </div>
        {c && <p className="traka-ostatak num">{razlika < 0 ? `Preko cilja ${fmt(-razlika)} kcal` : `Ostalo ${fmt(razlika)} kcal`}</p>}
        <dl className="traka-makrosi">
          {makrosi.map((m) => {
            const puca = (m.k === 'proteini' || m.k === 'masti') && pogodjeni[m.k]
            const k = puca ? kasni(m.k) : null
            return (
            <div key={m.naziv} data-polje={m.k} className={`${puca ? `ostecena${k != null ? ' pukla' : ''}` : ''}${uFokusu(m.k)}` || undefined}
              style={k != null ? ({ '--kasni': `${k}ms` } as React.CSSProperties) : undefined}>
              <dt>{m.naziv}</dt>
              <dd className="num" data-makro={m.k}>
                <span key={m.u} className="preklop">{fmt(m.u)}</span>
                <small>{m.c ? ` / ${fmt(m.c)} g` : ' g'}</small>
                {!!m.c && <span className="makro-traka" style={{ '--p': `${Math.min(m.u / m.c, 1) * 100}%` } as React.CSSProperties} aria-hidden />}
              </dd>
              {puca && <Eksplozija naziv={m.naziv} pukla={k != null} />}
            </div>
            )
          })}
        </dl>
      </div>
      {!c && (
        <Link className="dugme traka-profil" to="/profil">
          Popuni profil za cilj
          <span className="plocica" aria-hidden><ChevronRight size={22} /></span>
        </Link>
      )}
    </section>
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

// Nedelja izabranog dana: luk oko broja = kcal prema cilju; zelen = cilj pogođen, crven = prošao dan bez cilja, bez luka = budući ili prazan dan.
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
          const deo = kcal && cilj ? Math.min(kcal / cilj, 1) : 0
          const opis = stanje === 'pogodjen' ? ', cilj pogođen' : stanje === 'promasen' ? ', cilj nije pogođen' : ''
          const sadrzaj = (
            <>
              <span className="nedelja-ime">{ime[0]}</span>
              <span className="nedelja-krug">
                <svg viewBox="0 0 36 36" aria-hidden><circle className="staza" cx="18" cy="18" r="16.75" /><circle cx="18" cy="18" r="16.75" pathLength="100" strokeDasharray={`${deo * 100} 100`} /></svg>
                <span className="num">{izIso(d).getDate()}</span>
              </span>
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
