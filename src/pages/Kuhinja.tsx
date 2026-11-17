// Kuhinja: korisnik pravi i čuva svoja jela (šablone obroka). Miš kuvar na stranici otvara panel za kuvanje,
// tekst ide kroz isti AI kao unos na početnoj, pregled je isti (PregledStavki), a čuva se u tabelu jelo, ne u dnevnik.
// Posle čuvanja namirnice uskoče mišu u kapu (letNamirnica), pa iskoči kartica jela (KarticaJela).
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Pencil, Trash2, X } from 'lucide-react'
import { fmt, poJedinici, zbir, type Jelo, type Makrosi, type StavkaJela } from '../lib/ishrana'
import { mojaJela, obrisiJelo, sacuvajJelo } from '../lib/podaci'
import { razumiObrok } from '../lib/razumi'
import PregledStavki, { ispravna, kolicina, makrosiReda, uRed, type RedPregleda } from '../components/PregledStavki'
import MisKuvar from '../components/MisKuvar'
import KarticaJela from '../components/KarticaJela'
import { letNamirnica } from '../components/letNamirnica'
import './dan.css'
import './namirnice.css'
import './kuhinja.css'

const MAX_STAVKI = 20 // isto kao CHECK u bazi i granica AI-ja (supabase/functions/_shared/obrok.ts)
const MAX_IME = 80

// 1 stavka, 2–4 stavke, 5–20 stavki (više od 20 jelo ne može da ima)
const brojStavki = (n: number) => `${n} ${n === 1 ? 'stavka' : n < 5 ? 'stavke' : 'stavki'}`

type Urednik = { id?: string; ime: string; redovi: RedPregleda[] }

// Sačuvana stavka nosi vrednosti za količinu; pregled radi sa vrednostima po jedinici
const izStavke = (s: StavkaJela, id: number) =>
  uRed({ ...s, ...poJedinici(s), obrok: null, izvor: s.proizvod_id ? 'baza' : 'procena' }, id)

const uStavku = (r: RedPregleda): StavkaJela =>
  ({ ime: r.ime, proizvod_id: r.proizvod_id, kolicina: kolicina(r), jedinica: r.jedinica, ...makrosiReda(r) })

export default function Kuhinja() {
  const [jela, setJela] = useState<Jelo[] | null>(null)
  const [greskaListe, setGreskaListe] = useState('')
  const [urednik, setUrednik] = useState<Urednik | null>(null)
  const [tekst, setTekst] = useState('')
  const [cita, setCita] = useState(false)
  const [cuva, setCuva] = useState(false)
  const [greska, setGreska] = useState('')
  const [sacuvano, setSacuvano] = useState('')
  const [kartica, setKartica] = useState<{ ime: string; m: Makrosi } | null>(null)
  const zatvoriKarticu = useCallback(() => setKartica(null), [])

  const ucitaj = useCallback(async () => {
    try {
      setJela(await mojaJela())
      setGreskaListe('')
    } catch {
      setGreskaListe('Ne mogu da učitam tvoja jela. Proveri internet pa osveži stranicu.')
    }
  }, [])

  useEffect(() => { ucitaj() }, [ucitaj])

  const otvori = useCallback((u: Urednik) => {
    setUrednik(u); setTekst(''); setGreska(''); setSacuvano('')
    // posle crtanja panela: kursor u polje (na telefonu se otvori tastatura)
    requestAnimationFrame(() => document.getElementById('sta-kuvamo')?.focus())
  }, [])

  async function procitaj(e?: React.FormEvent) {
    e?.preventDefault()
    if (!urednik || !tekst.trim() || cita) return
    setCita(true); setGreska('')
    try {
      const stavke = await razumiObrok(tekst)
      if (stavke.length === 0) return setGreska('Nisam našao hranu u poruci. Napiši npr. „2 jaja i 100 g pirinča“.')
      const redovi = urednik.redovi
      if (redovi.length + stavke.length > MAX_STAVKI) return setGreska(`Jelo može imati najviše ${MAX_STAVKI} stavki.`)
      const sledeci = redovi.reduce((m, r) => Math.max(m, r.id + 1), 0)
      setUrednik({ ...urednik, redovi: [...redovi, ...stavke.map((s, i) => uRed(s, sledeci + i))] })
      setTekst('')
    } catch (e) {
      // poruke iz razumi.ts upućuju na ručni unos preko +, kog u Kuhinji nema
      setGreska(e instanceof Error ? e.message.replace(' Dodaj ručno preko +.', '').replace(' ili dodaj ručno preko +', '') : 'Ne mogu sad da pročitam.')
    } finally {
      setCita(false)
    }
  }

  async function sacuvaj(e: React.FormEvent) {
    e.preventDefault()
    if (!urednik || !spremno || cuva) return
    setCuva(true); setGreska('')
    try {
      const ime = urednik.ime.trim()
      const stavke = urednik.redovi.map(uStavku)
      // namirnice lete dok se jelo čuva; kartica tek kad je oboje gotovo
      const let_ = letNamirnica(stavke.map((s, i) => ({ ime: s.ime, el: document.querySelectorAll('.pregled-lista li')[i] })), document.getElementById('mis-kuvar'))
      await sacuvajJelo({ id: urednik.id, ime, stavke })
      await let_
      setUrednik(null); setSacuvano(`Jelo „${ime}“ je sačuvano.`); setKartica({ ime, m: zbir(stavke) })
      ucitaj()
    } catch {
      setGreska('Jelo nije sačuvano. Proveri internet pa probaj ponovo.')
    } finally {
      setCuva(false)
    }
  }

  async function obrisi(j: Jelo) {
    if (!confirm(`Obrisati jelo „${j.ime}“? Ovo ne može da se vrati.`)) return
    try {
      await obrisiJelo(j.id)
      if (urednik?.id === j.id) setUrednik(null)
      setSacuvano('')
      ucitaj()
    } catch {
      setGreskaListe('Brisanje nije uspelo. Proveri internet pa probaj ponovo.')
    }
  }

  const izmeni = (id: number, izmena: Partial<RedPregleda>) =>
    setUrednik((u) => u && { ...u, redovi: u.redovi.map((x) => (x.id === id ? { ...x, ...izmena } : x)) })
  const izbaci = (id: number) => setUrednik((u) => u && { ...u, redovi: u.redovi.filter((r) => r.id !== id) })

  const redovi = urednik?.redovi ?? []
  const ukupno = redovi.every(ispravna) ? zbir(redovi.map(makrosiReda)) : null
  const spremno = !!urednik?.ime.trim() && redovi.length > 0 && !!ukupno

  const poruka = greska ? greska
    : cita ? 'Čitam…'
    : cuva ? 'Kuvam… Mljac!'
    : redovi.length ? (urednik!.ime.trim() ? 'Još nešto ide unutra? Ako ne, kuvamo!' : 'Evo šta ide u jelo. Daj mu ime, pa kuvamo.')
    : urednik?.id ? 'Prazno jelo ne može. Reci mi šta ide unutra.'
    : 'Šta kuvamo? Reci mi šta ide u jelo.'

  return (
    <>
      <div className="dan-red namirnice-naslov"><h1>Kuhinja</h1></div>
      <main className="namirnice kuhinja">
        {!urednik && (
          <button type="button" className="kuhinja-poziv" onClick={() => otvori({ ime: '', redovi: [] })}>
            <MisKuvar />
            <span className="mis-oblacic">Šta kuvamo? Klikni me, pa mi reci šta ide u jelo.</span>
            <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
          </button>
        )}

        {urednik && (
          <section className="panel" aria-labelledby="kuvanje-naslov">
            <div className="panel-glava">
              <h2 id="kuvanje-naslov">{urednik.id ? 'Menjam jelo' : 'Novo jelo'}</h2>
              <button type="button" className="plocica svetla plus zatvori" aria-label="Zatvori bez čuvanja" onClick={() => setUrednik(null)}>
                <X size={22} strokeWidth={2.5} aria-hidden />
              </button>
            </div>
            <div className="panel-telo">
              <div className={`mis${cita ? ' cita' : ''}`}>
                <MisKuvar id="mis-kuvar" />
                <p key={poruka} className={`mis-oblacic${greska ? ' lose' : ''}`} role={greska ? 'alert' : 'status'}>{poruka}</p>
              </div>

              <form className="mis-forma" onSubmit={procitaj}>
                <label className="sr" htmlFor="sta-kuvamo">Šta ide u jelo</label>
                <textarea id="sta-kuvamo" className="unos mis-tekst" rows={3} maxLength={500} enterKeyHint="send"
                  placeholder={redovi.length ? 'npr. i kašika maslinovog ulja' : 'npr. 200 g piletine, 150 g pirinča i salata'}
                  value={tekst} disabled={cita}
                  onChange={(e) => setTekst(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) procitaj(e) }} />
                <button className={`dugme${redovi.length ? '' : ' glavno'}`} type="submit" disabled={cita || !tekst.trim()}>
                  {cita ? 'Čitam…' : redovi.length ? 'Dodaj u jelo' : 'Pročitaj'}
                  <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
                </button>
              </form>

              {redovi.length > 0 && (
                <form className="pregled" onSubmit={sacuvaj}>
                  <PregledStavki redovi={redovi} izmeni={izmeni} izbaci={izbaci} />
                  <p className="kuhinja-ukupno num" aria-live="polite">
                    {ukupno ? <>Ukupno <b>{fmt(ukupno.kcal)} kcal</b> · P {fmt(ukupno.proteini)} · UH {fmt(ukupno.uh)} · M {fmt(ukupno.masti)}</> : 'Proveri brojeve.'}
                  </p>
                  <label className="polje">
                    <span>Ime jela</span>
                    <input className="unos" value={urednik.ime} maxLength={MAX_IME} placeholder="npr. Piletina sa pirinčem"
                      onChange={(e) => setUrednik({ ...urednik, ime: e.target.value })} />
                  </label>
                  <button className="dugme glavno" type="submit" disabled={!spremno || cuva}>
                    {cuva ? 'Kuvam…' : urednik.id ? 'Sačuvaj izmene' : 'Napravi obrok'}
                    <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {sacuvano && <p className="poruka" role="status">{sacuvano}</p>}
        {greskaListe && <p className="greska" role="alert">{greskaListe}</p>}

        <section className="dan-tabela" aria-labelledby="moja-jela">
          <h2 id="moja-jela" className="kuhinja-naslov">Moja jela</h2>
          {jela === null ? (
            greskaListe ? null : <p className="tiho-tekst" role="status">Učitavam…</p>
          ) : jela.length === 0 ? (
            <p className="tiho-tekst">Još nemaš sačuvanih jela. Klikni miša kuvara i reci mu šta ide u jelo.</p>
          ) : (
            <ul className="nam-lista">
              {jela.map((j) => {
                const z = zbir(j.stavke)
                return (
                  <li key={j.id} className={`nam-red${urednik?.id === j.id ? ' menja' : ''}`}>
                    <div className="nam-glavno">
                      <span className="nam-ime">
                        <b>{j.ime}</b>
                        <small>{j.stavke.map((s) => s.ime).join(', ')}</small>
                      </span>
                      <span className="nam-kcal num"><b>{fmt(z.kcal)} kcal</b><small>{brojStavki(j.stavke.length)}</small></span>
                      <span className="nam-akcije">
                        <button className="ikona" aria-label={`Izmeni ${j.ime}`}
                          onClick={() => otvori({ id: j.id, ime: j.ime, redovi: j.stavke.map(izStavke) })}>
                          <Pencil size={18} aria-hidden />
                        </button>
                        <button className="ikona" aria-label={`Obriši ${j.ime}`} onClick={() => obrisi(j)}><Trash2 size={18} aria-hidden /></button>
                      </span>
                    </div>
                    <p className="nam-mak num">P {fmt(z.proteini)} g · UH {fmt(z.uh)} g · M {fmt(z.masti)} g</p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <Link to="/namirnice" className="kuhinja-baza">Baza namirnica</Link>
      </main>
      {kartica && <KarticaJela ime={kartica.ime} m={kartica.m} onZatvori={zatvoriKarticu} />}
    </>
  )
}
