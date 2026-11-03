import { useCallback, useEffect, useState } from 'react'
import { Check, Pencil, Search, Trash2, X } from 'lucide-react'
import { fmt } from '../lib/ishrana'
import { izmeniProizvod, obrisiProizvod, spisakProizvoda, type ProizvodRed } from '../lib/podaci'
import { useProfil } from '../components/useProfil'
import './dan.css'
import './namirnice.css'

const PO_STRANI = 50
const uBroj = (s: string) => Number(s.replace(',', '.'))

export default function Namirnice() {
  const { profil } = useProfil()
  const [tekst, setTekst] = useState('')
  const [upit, setUpit] = useState('')
  const [koliko, setKoliko] = useState(PO_STRANI)
  const [podaci, setPodaci] = useState<{ redovi: ProizvodRed[]; ukupno: number } | null>(null)
  const [greska, setGreska] = useState('')

  const ucitaj = useCallback(async () => {
    try {
      setPodaci(await spisakProizvoda(upit, koliko))
      setGreska('')
    } catch {
      setGreska('Ne mogu da učitam namirnice. Proveri internet pa osveži stranicu.')
    }
  }, [upit, koliko])

  useEffect(() => {
    ucitaj()
  }, [ucitaj])

  function trazi(e: React.FormEvent) {
    e.preventDefault()
    setKoliko(PO_STRANI)
    setUpit(tekst)
  }

  return (
    <>
      <div className="dan-red namirnice-naslov"><h1>Namirnice</h1></div>
      <main className="namirnice">
        <p className="tiho-tekst">Zajednička baza: dodaje je svako, a obrisati proizvod može samo ko ga je uneo.</p>
        <form className="pretraga" onSubmit={trazi}>
          <input className="unos" aria-label="Pretraga namirnica" placeholder="Pretraži po imenu" value={tekst} onChange={(e) => setTekst(e.target.value)} />
          <button className="plocica" type="submit" aria-label="Traži"><Search size={22} strokeWidth={2.5} /></button>
        </form>
        {greska && <p className="greska" role="alert">{greska}</p>}
        {podaci === null ? (
          greska ? null : <p className="tiho-tekst" role="status">Učitavam…</p>
        ) : podaci.redovi.length === 0 ? (
          <p className="prazno-dan tiho-tekst">{upit.trim() ? 'Nema namirnica za taj upit.' : 'Baza je još prazna. Namirnica se dodaje pri unosu obroka.'}</p>
        ) : (
          <section className="dan-tabela" aria-label="Spisak namirnica">
            <p className="tiho-tekst num" role="status">
              {upit.trim() ? `Nađeno: ${podaci.ukupno}` : `Ukupno namirnica: ${podaci.ukupno}`}
            </p>
            <ul className="nam-lista">
              {podaci.redovi.map((p) => (
                <Red key={p.id} p={p} moj={!!profil && p.ko_je_uneo === profil.id} onPromena={ucitaj} />
              ))}
            </ul>
            {podaci.redovi.length < podaci.ukupno && (
              <button className="dugme" onClick={() => setKoliko(koliko + PO_STRANI)}>Prikaži još</button>
            )}
          </section>
        )}
      </main>
    </>
  )
}

function Red({ p, moj, onPromena }: { p: ProizvodRed; moj: boolean; onPromena: () => void }) {
  const [menja, setMenja] = useState(false)
  const [f, setF] = useState({ ime: p.ime, kcal: '', proteini: '', uh: '', masti: '' })
  const [greska, setGreska] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  function otvori() {
    setF({ ime: p.ime, kcal: String(p.kcal), proteini: String(p.proteini), uh: String(p.uh), masti: String(p.masti) })
    setGreska(''); setMenja(true)
  }

  async function radi(posao: () => Promise<void>, poruka: string) {
    try {
      await posao()
      setMenja(false)
      onPromena()
    } catch {
      setGreska(poruka)
    }
  }

  function sacuvaj(e: React.FormEvent) {
    e.preventDefault()
    // Ista ograničenja kao CHECK u bazi: ime nije prazno, vrednosti su brojevi 0 ili više
    const v = { kcal: uBroj(f.kcal), proteini: uBroj(f.proteini), uh: uBroj(f.uh), masti: uBroj(f.masti) }
    if (!f.ime.trim()) return setGreska('Ime ne sme biti prazno.')
    if (!Object.values(v).every((n) => n >= 0 && Number.isFinite(n)) || !f.kcal.trim()) return setGreska('Vrednosti moraju biti brojevi, 0 ili više.')
    radi(() => izmeniProizvod(p.id, { ime: f.ime.trim(), ...v }), 'Izmena nije sačuvana. Proveri internet pa pokušaj ponovo.')
  }

  function obrisi() {
    if (!confirm(`Obrisati "${p.ime}" iz zajedničke baze? Stari unosi obroka ostaju.`)) return
    radi(() => obrisiProizvod(p.id), 'Brisanje nije uspelo. Proveri internet pa pokušaj ponovo.')
  }

  const polje = (k: Exclude<keyof typeof f, 'ime'>, naziv: string) => (
    <label className="polje"><span>{naziv}</span>
      <input className="unos num" inputMode="decimal" value={f[k]} onChange={set(k)} />
    </label>
  )

  return (
    <li className="nam-red">
      <div className="nam-glavno">
        <span className="nam-ime">
          <b>{p.ime}</b>
          <small>{[p.brend, moj && 'tvoj unos'].filter(Boolean).join(' · ') || ' '}</small>
        </span>
        <span className="nam-kcal num"><b>{fmt(p.kcal)} kcal</b><small>{p.jedinica === '100g' ? 'na 100 g' : 'po komadu'}</small></span>
        <span className="nam-akcije">
          <button className="ikona" aria-label={`Izmeni ${p.ime}`} onClick={otvori}><Pencil size={18} aria-hidden /></button>
          {moj && <button className="ikona" aria-label={`Obriši ${p.ime}`} onClick={obrisi}><Trash2 size={18} aria-hidden /></button>}
        </span>
      </div>
      <p className="nam-mak num">P {fmt(p.proteini)} g · UH {fmt(p.uh)} g · M {fmt(p.masti)} g</p>
      {menja && (
        <form className="nam-forma" onSubmit={sacuvaj}>
          <label className="polje"><span>Ime</span><input className="unos" value={f.ime} onChange={set('ime')} /></label>
          <div className="nam-cetiri">
            {polje('kcal', 'kcal')}{polje('proteini', 'Proteini (g)')}{polje('uh', 'UH (g)')}{polje('masti', 'Masti (g)')}
          </div>
          {greska && <p className="greska" role="alert">{greska}</p>}
          <div className="nam-dugmad">
            <button className="dugme glavno" type="submit"><span>Sačuvaj</span><span className="plocica" aria-hidden><Check size={22} strokeWidth={2.5} /></span></button>
            <button className="dugme tiho" type="button" onClick={() => setMenja(false)}><X size={18} aria-hidden /> Otkaži</button>
          </div>
        </form>
      )}
      {!menja && greska && <p className="greska" role="alert">{greska}</p>}
    </li>
  )
}
