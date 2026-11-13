import { useState } from 'react'
import { ArrowRight, Pencil, Plus, X } from 'lucide-react'
import { OBROCI, fmt, uBroj, zaKolicinu, zbir, type Makrosi, type Obrok, type Unos } from '../lib/ishrana'
import { dodajUnos } from '../lib/podaci'
import { razumiObrok, type Stavka } from '../lib/razumi'
import type { Poza } from '../lib/rang'
import { useProfil } from './useProfil'
import { useTuzan } from './useTuzan'
import Maskota from './Maskota'

const POLJA = [['kcal', 'kcal'], ['proteini', 'P'], ['uh', 'UH'], ['masti', 'M']] as const
type Vrednosti = Record<keyof Makrosi, string>

// Red u pregledu: brojevi su tekst dok se kucaju; grupa je obrok koji je AI pročitao ("?" = nije naveden).
// v su vrednosti po jedinici (na 100 g ili po komadu); menjaju se samo za procene, za proizvod iz baze važi baza.
type Red = Stavka & { id: number; kol: string; grupa: string; v: Vrednosti; otvoren: boolean }

const dobar = (s: string) => s.trim() !== '' && Number.isFinite(uBroj(s)) && uBroj(s) >= 0
const kolicina = (r: Red) => uBroj(r.kol)
const poJedinici = (r: Red): Makrosi =>
  r.izvor === 'baza' ? r : { kcal: uBroj(r.v.kcal), proteini: uBroj(r.v.proteini), uh: uBroj(r.v.uh), masti: uBroj(r.v.masti) }
const ispravna = (r: Red) =>
  dobar(r.kol) && kolicina(r) > 0 && (r.izvor === 'baza' || POLJA.every(([k]) => dobar(r.v[k])))
const tekstBroja = (n: number) => String(n).replace('.', ',')

// Tok: napiši mišu šta si jeo → on pročita (AI na serveru) → pregled → "Upiši" stavlja sve u tabelu.
export default function ReciMisu({ datum, unosi, onDodato, onRucno }: {
  datum: string; unosi: Unos[] | null; onDodato: () => void; onRucno: () => void
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
  const tuzan = useTuzan(unosi?.length)

  async function procitaj(e?: React.FormEvent) {
    e?.preventDefault()
    if (!tekst.trim() || cita) return
    setCita(true); setGreska(''); setUpisano(false)
    try {
      const stavke = await razumiObrok(tekst)
      if (stavke.length === 0) return setGreska('Nisam našao hranu u poruci. Napiši npr. „2 jaja i 100 g pirinča“.')
      setRedovi(stavke.map((s, id) => ({
        ...s, id, kol: tekstBroja(s.kolicina), grupa: s.obrok ?? '?', otvoren: false,
        v: { kcal: tekstBroja(s.kcal), proteini: tekstBroja(s.proteini), uh: tekstBroja(s.uh), masti: tekstBroja(s.masti) },
      })))
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
      await dodajUnos(redovi.map((r) => ({
        datum, obrok: obroci[r.grupa]!, kolicina: kolicina(r), jedinica: r.jedinica, ime: r.ime,
        proizvod_id: r.proizvod_id,
        ...zaKolicinu({ ...poJedinici(r), jedinica: r.jedinica }, kolicina(r)),
      })))
      setRedovi(null); setTekst(''); setUpisano(true); setProcena(redovi.some((r) => r.izvor === 'procena'))
      onDodato()
    } catch {
      setGreska('Nije upisano. Proveri internet pa probaj ponovo.')
    } finally {
      setCuva(false)
    }
  }

  const izmeni = (id: number, izmena: Partial<Red>) => setRedovi(redovi!.map((x) => (x.id === id ? { ...x, ...izmena } : x)))

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
  const doProteina = (profil?.cilj_proteini ?? 0) - uneto.proteini
  const ostatak = !unosi?.length ? '' : pogodjen ? 'Cilj za danas je pogođen!'
    : cilj > 0 ? (doProteina > 0 ? `Još ${fmt(Math.round(doProteina))} g proteina do cilja.` : `Još ${fmt(cilj - uneto.kcal)} kcal do cilja.`)
    : ''
  const poruka = greska ? greska
    : cita ? 'Čitam…'
    : redovi ? (bezObroka ? 'Nisi napisao obrok. Izaberi ga ispod.' : 'Evo šta sam razumeo. Proveri, pa upiši.')
    : upisano ? `Mljac, upisano! ${procena ? 'Procene možeš da ispraviš i sačuvaš u bazu iz tabele. ' : ''}${ostatak}`.trim()
    : ostatak || 'Šta si jeo? Napiši mi, ja upisujem.'
  const poza: Poza = pogodjen && !redovi && !cita ? 'slavi' : upisano ? 'jede' : 'hoda'

  return (
    <section className="panel" id="unos" aria-labelledby="unos-naslov">
      <div className="panel-glava">
        <button type="button" className="plocica svetla plus" aria-label="Unesi namirnicu ručno" onClick={onRucno}>
          <Plus size={22} strokeWidth={2.75} aria-hidden />
        </button>
        <h2 id="unos-naslov">Reci mišu šta si jeo</h2>
      </div>
      <div className="panel-telo">
        <div className={`mis${cita ? ' cita' : ''}`}>
          <Maskota poza={poza} cita={cita} tuzan={tuzan} greska={greska} />
          <p key={poruka} className={`mis-oblacic${greska ? ' lose' : ''}`} role={greska ? 'alert' : 'status'}>{poruka}</p>
        </div>

        {!redovi ? (
          <form className="mis-forma" onSubmit={procitaj}>
            <label className="sr" htmlFor="sta-si-jeo">Šta si jeo</label>
            <textarea id="sta-si-jeo" className="unos mis-tekst" rows={3} maxLength={500} enterKeyHint="send"
              placeholder="npr. za doručak 3 jaja, 100 g piletine i tortilja"
              value={tekst} disabled={cita}
              onChange={(e) => { setTekst(e.target.value); setUpisano(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) procitaj(e) }} />
            <button className="dugme glavno" type="submit" disabled={cita || !tekst.trim()}>
              {cita ? 'Čitam…' : 'Pročitaj'}
              <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
            </button>
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
                <ul className="pregled-lista">
                  {redovi.filter((r) => r.grupa === g).map((r, i) => {
                    const m = ispravna(r) ? zaKolicinu({ ...poJedinici(r), jedinica: r.jedinica }, kolicina(r)) : null
                    const mera = r.jedinica === '100g' ? 'g' : 'kom'
                    const procena = r.izvor === 'procena'
                    return (
                      <li key={r.id} style={{ '--i': i } as React.CSSProperties}>
                        <span className="pregled-ime">
                          <b>{r.ime}</b>
                          <small className="num">
                            <span className={`izvor ${r.izvor}`}>{procena ? 'procena' : 'iz baze'}</span>
                            {m ? `${fmt(m.kcal)} kcal · P ${fmt(m.proteini)} · UH ${fmt(m.uh)} · M ${fmt(m.masti)}` : 'proveri brojeve'}
                          </small>
                        </span>
                        <label className="pregled-kol">
                          <span className="sr">Količina za {r.ime} ({mera})</span>
                          <input className="unos mali num" inputMode="decimal" value={r.kol} aria-invalid={!(dobar(r.kol) && kolicina(r) > 0)}
                            onChange={(e) => izmeni(r.id, { kol: e.target.value })} />
                          <span aria-hidden>{mera}</span>
                        </label>
                        <span className="pregled-akcije">
                          {procena && (
                            <button type="button" className={`ikona${r.otvoren ? ' aktivna' : ''}`} aria-expanded={r.otvoren}
                              aria-label={`Izmeni vrednosti za ${r.ime}`} onClick={() => izmeni(r.id, { otvoren: !r.otvoren })}>
                              <Pencil size={18} aria-hidden />
                            </button>
                          )}
                          <button type="button" className="ikona" aria-label={`Izbaci ${r.ime}`} onClick={() => izbaci(r.id)}>
                            <X size={20} aria-hidden />
                          </button>
                        </span>
                        {procena && r.otvoren && (
                          <fieldset className="pregled-vrednosti">
                            <legend className="tiho-tekst">{r.jedinica === '100g' ? 'Vrednosti na 100 g' : 'Vrednosti za 1 komad'}</legend>
                            {POLJA.map(([k, naziv]) => (
                              <label key={k} className="polje">
                                <span>{naziv}</span>
                                <input className="unos mali num" inputMode="decimal" value={r.v[k]} aria-invalid={!dobar(r.v[k])}
                                  onChange={(e) => izmeni(r.id, { v: { ...r.v, [k]: e.target.value } })} />
                              </label>
                            ))}
                          </fieldset>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </fieldset>
            ))}
            <div className="pregled-dalje">
              <button type="button" className="dugme tiho" onClick={() => { setRedovi(null); setGreska('') }}>Ispravi tekst</button>
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
