import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight, MessageSquareText, PencilLine } from 'lucide-react'
import { OBROCI, fmt, zbir, type Jelo, type Obrok, type Unos } from '../lib/ishrana'
import { danas } from '../lib/datum'
import { dodajUnos, mojaJela } from '../lib/podaci'
import { razumiObrok, type Stavka } from '../lib/razumi'
import { stanjeMisa, type Poza } from '../lib/rang'
import { useProfil } from './useProfil'
import { useSad } from './useMouseMascot'
import Maskota from './Maskota'
// Živi miš se učitava lenjo; ako se ne skine (nema interneta), ostaje slika
const ZiviMis = lazy(() => import('./ZiviMis').catch(() => ({ default: ({ rezerva }: { rezerva: React.ReactElement }) => rezerva })))
const bezPokreta = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
import { letMakrosa } from './letMakrosa'
import PregledStavki, { ispravna, izStavke, kolicina, makrosiReda, uRed, type RedPregleda } from './PregledStavki'
import BiracJela from './BiracJela'
import DodajUPregled from './DodajUPregled'

// Red u pregledu; grupa je obrok koji je AI pročitao ("?" = nije naveden)
type Red = RedPregleda & { grupa: string }

const SLAVI_POSLE_UPISA = 4000 // ms

// Tok: napiši mišu šta si jeo → on pročita (AI na serveru) → pregled → "Upiši" stavlja sve u tabelu.
// Ili klik na sačuvano jelo iz Laboratorije: njegove stavke idu u isti pregled, bez AI-ja.
// Panel počinje izborom (piši mišu / uzmi svoje jelo / ručno); polje za tekst se otvara tek na klik.
// U pregledu se može ručno dodati namirnica koju je miš preskočio (DodajUPregled).
export default function ReciMisu({ datum, unosi, onDodato, onRucno, govor }: {
  datum: string; unosi: Unos[] | null; onDodato: () => void; onRucno: () => void
  govor: string | null // usputna rečenica o rangu (RangPolje); samo kad miš nema šta važnije da kaže
}) {
  const { profil } = useProfil()
  const [tekst, setTekst] = useState('')
  const [redovi, setRedovi] = useState<Red[] | null>(null)
  const [obroci, setObroci] = useState<Record<string, Obrok | null>>({})
  const [cita, setCita] = useState(false)
  const [cuva, setCuva] = useState(false)
  const [greska, setGreska] = useState('')
  const [upisano, setUpisano] = useState(false)
  const [procena, setProcena] = useState(false)
  const [slaviUpis, setSlaviUpis] = useState(false)
  const [jela, setJela] = useState<Jelo[] | null>(null)
  const [izJela, setIzJela] = useState<string | null>(null) // ime jela čije su stavke u pregledu
  const [pise, setPise] = useState(false) // otvoreno polje za tekst (inače izbor)
  const sad = useSad()

  // bez interneta (ili baze) samo nema reda sa jelima; pisanje mišu radi i dalje
  useEffect(() => { mojaJela().then(setJela, () => setJela([])) }, [])

  function uzmiJelo(j: Jelo) {
    setRedovi(j.stavke.map((s, id) => ({ ...izStavke(s, id), grupa: '?' })))
    setObroci({ '?': null }); setIzJela(j.ime); setGreska(''); setUpisano(false)
  }

  // Klik na "Upiši": miš kratko slavi, pa se vraća na stanje koje traje
  useEffect(() => {
    if (!slaviUpis) return
    const t = setTimeout(() => setSlaviUpis(false), SLAVI_POSLE_UPISA)
    return () => clearTimeout(t)
  }, [slaviUpis])

  async function procitaj(e?: React.FormEvent) {
    e?.preventDefault()
    if (!tekst.trim() || cita) return
    setCita(true); setGreska(''); setUpisano(false); setIzJela(null)
    try {
      const stavke = await razumiObrok(tekst)
      if (stavke.length === 0) return setGreska('Nisam našao hranu u poruci. Napiši npr. „2 jaja i 100 g pirinča“.')
      setRedovi(stavke.map((s, id) => ({ ...uRed(s, id), grupa: s.obrok ?? '?' })))
      setObroci(Object.fromEntries(stavke.map((s) => [s.obrok ?? '?', s.obrok])))
    } catch (e) {
      setGreska(e instanceof Error ? e.message : 'Ne mogu sad da pročitam. Dodaj ručno preko +.')
    } finally {
      setCita(false)
    }
  }

  async function upisi(e: React.FormEvent) {
    e.preventDefault()
    if (!redovi || !spremno || cuva) return
    setCuva(true); setGreska('')
    try {
      // Procena ide samo u dnevnik (proizvod_id null); u zajedničku bazu je korisnik šalje sam iz tabele.
      const stavke = redovi.map((r) => ({
        datum, obrok: obroci[r.grupa]!, kolicina: kolicina(r), jedinica: r.jedinica, ime: r.ime,
        proizvod_id: r.proizvod_id,
        ...makrosiReda(r),
      }))
      await dodajUnos(stavke)
      setRedovi(null); setTekst(''); setIzJela(null); setPise(false); setUpisano(true); setSlaviUpis(true); setProcena(redovi.some((r) => r.izvor === 'procena'))
      // makrosi polete u traku; brojevi (i tabela) se preračunaju kad udare
      void letMakrosa(zbir(stavke), document.getElementById('unos')).finally(onDodato)
    } catch {
      setGreska('Nije upisano. Proveri internet pa probaj ponovo.')
    } finally {
      setCuva(false)
    }
  }

  const izmeni = (id: number, izmena: Partial<Red>) => setRedovi(redovi!.map((x) => (x.id === id ? { ...x, ...izmena } : x)))

  // ručno dodata namirnica ide na kraj svoje grupe obroka
  const dodajRed = (g: string) => (st: Stavka) =>
    setRedovi((rs) => [...(rs ?? []), { ...uRed(st, (rs ?? []).reduce((m, x) => Math.max(m, x.id + 1), 0)), grupa: g }])

  function izbaci(id: number) {
    const ostalo = redovi!.filter((r) => r.id !== id)
    setRedovi(ostalo.length ? ostalo : null)
  }

  const grupe = redovi ? [...new Set(redovi.map((r) => r.grupa))] : []
  const bezObroka = grupe.some((g) => !obroci[g])
  const spremno = !!redovi && !bezObroka && redovi.every(ispravna)

  // Šta miš kaže i kako stoji: iz stanja unosa i iz brojeva dana
  const uneto = zbir(unosi ?? [])
  const cilj = profil?.cilj_kcal ?? 0
  const pogodjen = cilj > 0 && uneto.kcal >= cilj
  const poslednji = unosi?.reduce<Date | null>((p, u) => (u.kreirano && (!p || new Date(u.kreirano) > p) ? new Date(u.kreirano) : p), null) ?? null
  const misStanje = stanjeMisa(uneto, profil ?? null, sad, poslednji)
  // "Nisi dugo jeo" samo za danas i tek kad su unosi učitani
  const gladan = misStanje.gladan && datum === danas() && unosi != null
  const unosiTekst = !!tekst.trim() || !!redovi
  const doProteina = (profil?.cilj_proteini ?? 0) - uneto.proteini
  const ostatak = !unosi?.length ? '' : pogodjen ? 'Cilj za danas je pogođen!'
    : cilj > 0 ? (doProteina > 0 ? `Još ${fmt(Math.round(doProteina))} g proteina do cilja.` : `Još ${fmt(cilj - uneto.kcal)} kcal do cilja.`)
    : ''
  const poruka = greska ? greska
    : cita ? 'Čitam…'
    : redovi && izJela ? (bezObroka ? `${izJela}! Koji je ovo obrok? Izaberi ispod.` : 'Proveri količine, pa upiši.')
    : redovi ? (bezObroka ? 'Nisi napisao obrok. Izaberi ga ispod.' : 'Evo šta sam razumeo. Proveri, pa upiši.')
    : upisano ? `Mljac, upisano! ${procena ? 'Procene možeš da ispraviš i sačuvaš u bazu iz tabele. ' : ''}${ostatak}`.trim()
    : gladan && !unosiTekst ? 'Nisi dugo jeo, mišu!'
    : govor && !unosiTekst ? govor
    : ostatak || (pise ? 'Šta si jeo? Napiši mi, ja upisujem.' : 'Reci mi šta si jeo ili uzmi svoje jelo.')
  // Slika (bez pokreta i dok se živi miš učitava): dok pišeš jede; greška ili gladan: ljut; upisano ili cilj: slavi
  const poza: Poza = unosiTekst ? 'jede' : greska || gladan ? 'cilj' : upisano || pogodjen ? 'slavi' : 'hoda'

  return (
    <section className="panel" id="unos" aria-labelledby="unos-naslov">
      <div className="panel-glava">
        <h2 id="unos-naslov">Dodaj hranu</h2>
      </div>
      <div className="panel-telo">
        <div className={`mis${cita ? ' cita' : ''}`}>
          {/* ključ na pozi: slika miša "poskoči" kad se stanje promeni; živi miš (bez prefers-reduced-motion) sam bira klip */}
          {bezPokreta() ? <Maskota key={poza} poza={poza} /> : (
            <Suspense fallback={<div className="maskota ziv" aria-hidden />}>
              <ZiviMis rezerva={<Maskota poza={poza} />} alt="Miš" unosi={unosiTekst} slavi={slaviUpis || misStanje.slavi}
                ljut={gladan} spava={misStanje.spava} greska={greska} brojUnosa={unosi?.length ?? null} />
            </Suspense>
          )}
          <p key={poruka} className={`mis-oblacic${greska ? ' lose' : ''}`} role={greska ? 'alert' : 'status'}>{poruka}</p>
        </div>

        {!redovi && !pise ? (
          <div className="unos-izbor">
            <button type="button" className="dugme glavno" onClick={() => setPise(true)}>
              <span className="unos-izbor-tekst"><MessageSquareText size={22} aria-hidden /> Reci mišu šta si jeo</span>
              <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
            </button>
            {jela && <BiracJela jela={jela} onIzaberi={uzmiJelo} />}
            <button type="button" className="dugme unos-rucno" onClick={onRucno}>
              <span className="unos-izbor-tekst"><PencilLine size={22} aria-hidden /> Unesi ručno</span>
              <span className="plocica" aria-hidden><ArrowRight size={20} strokeWidth={2.5} /></span>
            </button>
          </div>
        ) : !redovi ? (
          <form className="mis-forma" onSubmit={procitaj}>
            <label className="sr" htmlFor="sta-si-jeo">Šta si jeo</label>
            {/* otvara se na klik "Reci mišu", pa kursor odmah ide u polje (na telefonu i tastatura) */}
            <textarea id="sta-si-jeo" className="unos mis-tekst" rows={3} maxLength={500} enterKeyHint="send" autoFocus
              placeholder="npr. za doručak 3 jaja, 100 g piletine i tortilja"
              value={tekst} disabled={cita}
              onChange={(e) => { setTekst(e.target.value); setUpisano(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) procitaj(e) }} />
            <div className="pregled-dalje">
              <button type="button" className="dugme tiho" disabled={cita} onClick={() => { setPise(false); setGreska('') }}>Nazad</button>
              <button className="dugme glavno" type="submit" disabled={cita || !tekst.trim()}>
                {cita ? 'Čitam…' : 'Pročitaj'}
                <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
              </button>
            </div>
          </form>
        ) : (
          <form className="pregled" onSubmit={upisi}>
            {grupe.map((g) => (
              <fieldset key={g} className="pregled-grupa">
                <legend className={obroci[g] ? 'tiho-tekst' : 'pregled-pitanje'}>{obroci[g] ? 'Obrok' : 'Koji je ovo obrok?'}</legend>
                <div className="segment">
                  {OBROCI.map((o) => (
                    <label key={o.id}>
                      <input type="radio" name={`obrok-${g}`} checked={obroci[g] === o.id} onChange={() => setObroci({ ...obroci, [g]: o.id })} />
                      <span>{o.naziv}</span>
                    </label>
                  ))}
                </div>
                <PregledStavki redovi={redovi.filter((r) => r.grupa === g)} izmeni={izmeni} izbaci={izbaci} />
                <DodajUPregled onDodaj={dodajRed(g)} />
              </fieldset>
            ))}
            <div className="pregled-dalje">
              <button type="button" className="dugme tiho" onClick={() => { setRedovi(null); setGreska(''); setIzJela(null) }}>{izJela ? 'Nazad' : 'Ispravi tekst'}</button>
              <button className="dugme glavno" type="submit" disabled={!spremno || cuva}>
                {cuva ? 'Upisujem…' : `Upiši ${redovi.length}`}
                <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
