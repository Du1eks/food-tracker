import { useState } from 'react'
import { ArrowRight, Check, MessageSquareText, Plus, Search, X } from 'lucide-react'
import { OBROCI, fmt, obrokPoSatu, uBroj, zaKolicinu, zbir, type Jedinica, type Obrok, type Proizvod, type Unos } from '../lib/ishrana'
import { dodajProizvod, dodajUnos, pretraziProizvode } from '../lib/podaci'
import { pretraziOFF } from '../lib/openFoodFacts'
import ReciMisu from './ReciMisu'

const ispravanBroj = (s: string) => s.trim() !== '' && Number.isFinite(uBroj(s)) && uBroj(s) >= 0

type Izvor = 'baza' | 'off'

const prazan = (ime = ''): Proizvod => ({ ime, brend: null, jedinica: '100g', kcal: 0, proteini: 0, uh: 0, masti: 0 })

// Podrazumevano se piše mišu (ReciMisu). "+" otvara ručni tok, koji radi i bez AI-ja:
// izaberi obrok → pretraži (ili "Unesi ručno") → dodaj jednu ili više namirnica (svaka se čuva odmah) → "Gotov doručak" zatvara obrok.
export default function DodajNamirnicu({ datum, unosi, onDodato }: { datum: string; unosi: Unos[] | null; onDodato: () => void }) {
  const [rucno, setRucno] = useState(false)
  const [upit, setUpit] = useState('')
  const [rezultati, setRezultati] = useState<{ izvor: Izvor; lista: Proizvod[] } | null>(null)
  const [trazi, setTrazi] = useState(false)
  const [izabran, setIzabran] = useState<Proizvod | null>(null)
  const [novi, setNovi] = useState<Proizvod | null>(null)
  const [kolicina, setKolicina] = useState('')
  const [obrok, setObrok] = useState<Obrok | null>(null)
  const [predlog] = useState(() => obrokPoSatu(new Date().getHours()))
  const [greska, setGreska] = useState('')
  const [radi, setRadi] = useState(false)

  async function pretrazi(izvor: Izvor) {
    if (!upit.trim()) return
    setTrazi(true); setGreska('')
    try {
      const lista = izvor === 'baza' ? await pretraziProizvode(upit.trim()) : await pretraziOFF(upit.trim())
      setRezultati({ izvor, lista })
    } catch (e) {
      setGreska(e instanceof Error && izvor === 'off' ? e.message : 'Pretraga nije uspela. Proveri internet.')
    } finally {
      setTrazi(false)
    }
  }

  function izaberi(p: Proizvod) {
    setIzabran(p)
    setKolicina(p.jedinica === '100g' ? '100' : '1')
    setRezultati(null); setNovi(null)
  }

  function ponisti() {
    setIzabran(null); setNovi(null); setRezultati(null); setUpit(''); setKolicina(''); setGreska('')
  }

  async function sacuvajNovi(p: Proizvod) {
    setRadi(true); setGreska('')
    try {
      izaberi(await dodajProizvod(p))
    } catch {
      setGreska('Proizvod nije sačuvan. Proveri vrednosti i internet.')
    } finally {
      setRadi(false)
    }
  }

  async function dodaj(e: React.FormEvent) {
    e.preventDefault()
    if (!izabran) return
    if (!obrok) return setGreska('Izaberi obrok.')
    const k = uBroj(kolicina)
    if (!(k > 0)) return setGreska('Upiši količinu veću od nule.')
    setRadi(true); setGreska('')
    try {
      await dodajUnos({
        datum, obrok, kolicina: k, jedinica: izabran.jedinica,
        ime: izabran.brend ? `${izabran.ime} (${izabran.brend})` : izabran.ime,
        proizvod_id: izabran.id ?? null,
        ...zaKolicinu(izabran, k),
      })
      ponisti()
      onDodato()
    } catch {
      setGreska('Unos nije sačuvan. Proveri internet pa pokušaj ponovo.')
    } finally {
      setRadi(false)
    }
  }

  const pregled = izabran && uBroj(kolicina) > 0 ? zaKolicinu(izabran, uBroj(kolicina)) : null
  const aktivan = OBROCI.find((o) => o.id === obrok)
  const uObroku = unosi?.filter((u) => u.obrok === obrok) ?? []

  if (!rucno)
    return <ReciMisu datum={datum} unosi={unosi} onDodato={onDodato} onRucno={() => setRucno(true)} />

  return (
    <section className="panel" id="unos" aria-labelledby="dodaj-naslov">
      <div className="panel-glava">
        <button type="button" className="plocica svetla plus" aria-label="Unesi namirnicu ručno" onClick={() => { ponisti(); setObrok(null) }}>
          <Plus size={22} strokeWidth={2.75} aria-hidden />
        </button>
        <h2 id="dodaj-naslov">{aktivan ? `${aktivan.naziv}: dodaj namirnicu` : 'Sledeće: izaberi obrok'}</h2>
        <button type="button" className="plocica svetla plus nazad-misu" aria-label="Nazad na pisanje mišu" onClick={() => { ponisti(); setObrok(null); setRucno(false) }}>
          <MessageSquareText size={20} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
      <div className="panel-telo">
        {!obrok && !izabran && !novi && (
          <div className="obroci" role="group" aria-label="Obrok">
            {OBROCI.map((o) => (
              <button key={o.id} type="button" className={`dugme${o.id === predlog ? ' predlog' : ''}`} onClick={() => setObrok(o.id)}>
                {o.naziv}
                <span className="plocica" aria-hidden><ArrowRight size={20} strokeWidth={2.5} /></span>
              </button>
            ))}
          </div>
        )}

        {aktivan && !izabran && !novi && (
          <div className="obrok-stanje">
            <p className="num">
              {uObroku.length ? <><b>{uObroku.length}</b> u obroku · <b>{fmt(zbir(uObroku).kcal)} kcal</b></> : 'Još ništa u ovom obroku.'}
            </p>
            <button type="button" className="dugme" onClick={() => { ponisti(); setObrok(null) }}>
              {aktivan.gotov}
              <span className="plocica" aria-hidden><Check size={20} strokeWidth={2.75} /></span>
            </button>
          </div>
        )}

        {obrok && !izabran && !novi && (
          <>
            <form className="pretraga" role="search" onSubmit={(e) => { e.preventDefault(); pretrazi('baza') }}>
              <label className="sr" htmlFor="pretraga">Pretraži namirnicu</label>
              <input id="pretraga" className="unos" type="search" placeholder="npr. jogurt, piletina…" autoComplete="off"
                value={upit} onChange={(e) => setUpit(e.target.value)} />
              <button className="plocica" type="submit" aria-label="Traži" disabled={trazi}><Search size={20} strokeWidth={2.5} aria-hidden /></button>
            </form>

            {trazi && <p className="tiho-tekst" role="status">Tražim…</p>}
            {rezultati && !trazi && (
              <div className="rezultati">
                <p className="tiho-tekst">{rezultati.izvor === 'baza' ? 'Naša baza' : 'Open Food Facts · proveri vrednosti'}</p>
                {rezultati.lista.length === 0 && <p className="prazno">Nema rezultata za „{upit}“.</p>}
                <ul>
                  {rezultati.lista.map((p, i) => (
                    <li key={p.id ?? i}>
                      <button type="button" onClick={() => (rezultati.izvor === 'baza' ? izaberi(p) : setNovi(p))}>
                        <span><b>{p.ime}</b>{p.brend && <small>{p.brend}</small>}</span>
                        <span className="num">{fmt(p.kcal)} kcal<small>{p.jedinica === '100g' ? 'na 100 g' : 'po komadu'}</small></span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="rezultati-dalje">
                  {rezultati.izvor === 'baza' && (
                    <button type="button" className="dugme" onClick={() => pretrazi('off')}>Traži na Open Food Facts</button>
                  )}
                  <button type="button" className="dugme tiho" onClick={() => setNovi(prazan(upit.trim()))}>
                    Unesi ručno
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {novi && <NoviProizvod pocetni={novi} radi={radi} onSacuvaj={sacuvajNovi} onOtkazi={ponisti} />}

        {izabran && (
          <form className="unos-forma" onSubmit={dodaj}>
            <div className="izabran">
              <span><b>{izabran.ime}</b><small className="num">{izabran.brend ? `${izabran.brend} · ` : ''}{fmt(izabran.kcal)} kcal {izabran.jedinica === '100g' ? 'na 100 g' : 'po komadu'}</small></span>
              <button type="button" className="plocica svetla" aria-label="Promeni namirnicu" onClick={ponisti}><X size={20} aria-hidden /></button>
            </div>
            <div className="dva">
              <label className="polje"><span>Količina ({izabran.jedinica === '100g' ? 'g' : 'kom'})</span>
                <input className="unos num" inputMode="decimal" required value={kolicina} onChange={(e) => setKolicina(e.target.value)} autoFocus />
              </label>
              <div className="polje"><span>Daje</span><p className="daje num">{pregled ? `${fmt(pregled.kcal)} kcal` : '—'}</p></div>
            </div>
            {pregled && <p className="tiho-tekst num">P {fmt(pregled.proteini)} g · UH {fmt(pregled.uh)} g · M {fmt(pregled.masti)} g</p>}
            <button className="dugme glavno" type="submit" disabled={radi}>
              {radi ? 'Dodajem…' : 'Dodaj'}
              <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
            </button>
          </form>
        )}

        {greska && <p className="greska" role="alert">{greska}</p>}
      </div>
    </section>
  )
}

function NoviProizvod({ pocetni, radi, onSacuvaj, onOtkazi }: {
  pocetni: Proizvod; radi: boolean; onSacuvaj: (p: Proizvod) => void; onOtkazi: () => void
}) {
  const [ime, setIme] = useState(pocetni.ime)
  const [brend, setBrend] = useState(pocetni.brend ?? '')
  const [jedinica, setJedinica] = useState<Jedinica>(pocetni.jedinica)
  const [v, setV] = useState({
    kcal: pocetni.kcal ? String(pocetni.kcal) : '',
    proteini: String(pocetni.proteini || ''), uh: String(pocetni.uh || ''), masti: String(pocetni.masti || ''),
  })
  const [greska, setGreska] = useState('')

  function sacuvaj(e: React.FormEvent) {
    e.preventDefault()
    if (!ime.trim()) return setGreska('Upiši ime proizvoda.')
    if (!ispravanBroj(v.kcal)) return setGreska('Upiši kalorije (broj, 0 ili više).')
    for (const k of ['proteini', 'uh', 'masti'] as const)
      if (v[k].trim() && !ispravanBroj(v[k])) return setGreska('Makrosi moraju biti brojevi, 0 ili više.')
    onSacuvaj({
      ime: ime.trim(), brend: brend.trim() || null, jedinica,
      kcal: uBroj(v.kcal), proteini: uBroj(v.proteini || '0'), uh: uBroj(v.uh || '0'), masti: uBroj(v.masti || '0'),
    })
  }

  const polje = (k: keyof typeof v, naziv: string) => (
    <label className="polje"><span>{naziv}</span>
      <input className="unos num" inputMode="decimal" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} required={k === 'kcal'} />
    </label>
  )

  return (
    <form className="unos-forma" onSubmit={sacuvaj}>
      <p className="tiho-tekst">Proveri vrednosti sa deklaracije. Proizvod ide u zajedničku bazu.</p>
      <label className="polje"><span>Ime</span><input className="unos" required value={ime} onChange={(e) => setIme(e.target.value)} /></label>
      <label className="polje"><span>Brend (nije obavezno)</span><input className="unos" value={brend} onChange={(e) => setBrend(e.target.value)} /></label>
      <fieldset className="polje">
        <legend className="sr">Vrednosti su</legend>
        <span aria-hidden>Vrednosti su</span>
        <div className="segment">
          <label><input type="radio" name="jedinica" checked={jedinica === '100g'} onChange={() => setJedinica('100g')} /><span>na 100 g</span></label>
          <label><input type="radio" name="jedinica" checked={jedinica === 'komad'} onChange={() => setJedinica('komad')} /><span>po komadu</span></label>
        </div>
      </fieldset>
      <div className="dva">{polje('kcal', 'Kalorije (kcal)')}{polje('proteini', 'Proteini (g)')}</div>
      <div className="dva">{polje('uh', 'Ugljeni hidrati (g)')}{polje('masti', 'Masti (g)')}</div>
      {greska && <p className="greska" role="alert">{greska}</p>}
      <div className="dva">
        <button type="button" className="dugme tiho" onClick={onOtkazi}>Otkaži</button>
        <button className="dugme glavno" type="submit" disabled={radi}>
          {radi ? 'Čuvam…' : 'Sačuvaj'}
          <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
        </button>
      </div>
    </form>
  )
}
