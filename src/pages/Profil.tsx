import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Calculator, LogOut, UserRound } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { dnevniCilj, fmt, godineOd, type Makrosi, type Telo } from '../lib/ishrana'
import { NADIMAK_PORUKA, nadimakIspravan, sacuvajProfil, type Profil as ProfilTip } from '../lib/podaci'
import { useProfil } from '../components/useProfil'
import './dan.css'
import './profil.css'

const uBroj = (s: string) => Number(s.replace(',', '.'))
const s = (n: number | null | undefined) => (n == null ? '' : String(n))

// Ista ograničenja kao CHECK u bazi (supabase/migrations), da korisnik dobije poruku pre slanja.
const GRANICE: Record<string, [number, number, string]> = {
  visina_cm: [100, 250, 'Visina mora biti između 100 i 250 cm.'],
  tezina_kg: [30, 300, 'Težina mora biti između 30 i 300 kg.'],
  treninga_nedeljno: [0, 14, 'Treninga nedeljno: od 0 do 14.'],
  koraka_dnevno: [0, 100000, 'Koraci dnevno moraju biti 0 ili više.'],
  ciljna_tezina_kg: [30, 300, 'Ciljna težina mora biti između 30 i 300 kg.'],
}

export default function Profil() {
  const { profil, osveziProfil } = useProfil()
  if (!profil) return <p className="tiho-tekst" role="status" style={{ padding: 32 }}>Učitavam profil…</p>
  return <Forma profil={profil} osveziProfil={osveziProfil} />
}

function Forma({ profil, osveziProfil }: { profil: ProfilTip; osveziProfil: () => Promise<void> }) {
  const idi = useNavigate()
  const [f, setF] = useState({
    nadimak: profil.nadimak ?? '', ime: profil.ime ?? '', pol: profil.pol ?? '', datum_rodjenja: profil.datum_rodjenja ?? '',
    visina_cm: s(profil.visina_cm), tezina_kg: s(profil.tezina_kg), treninga_nedeljno: s(profil.treninga_nedeljno),
    koraka_dnevno: s(profil.koraka_dnevno), cilj: profil.cilj ?? '', ciljna_tezina_kg: s(profil.ciljna_tezina_kg),
    cilj_kcal: s(profil.cilj_kcal), cilj_proteini: s(profil.cilj_proteini), cilj_uh: s(profil.cilj_uh), cilj_masti: s(profil.cilj_masti),
  })
  const [greska, setGreska] = useState('')
  const [radi, setRadi] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const telo: Telo | null =
    f.pol && f.datum_rodjenja && f.visina_cm && f.tezina_kg && f.treninga_nedeljno && f.koraka_dnevno && f.cilj
      ? {
          pol: f.pol as Telo['pol'], godine: godineOd(f.datum_rodjenja), visina_cm: uBroj(f.visina_cm), tezina_kg: uBroj(f.tezina_kg),
          treninga_nedeljno: uBroj(f.treninga_nedeljno), koraka_dnevno: uBroj(f.koraka_dnevno), cilj: f.cilj as Telo['cilj'],
        }
      : null
  const formula: Makrosi | null = telo && Object.values(telo).every((v) => typeof v === 'string' || Number.isFinite(v)) ? dnevniCilj(telo) : null

  function uzmiFormulu() {
    if (formula) setF({ ...f, cilj_kcal: s(formula.kcal), cilj_proteini: s(formula.proteini), cilj_uh: s(formula.uh), cilj_masti: s(formula.masti) })
  }

  async function sacuvaj(e: React.FormEvent) {
    e.preventDefault()
    if (f.nadimak.trim() && !nadimakIspravan(f.nadimak)) return setGreska(NADIMAK_PORUKA)
    for (const [k, [min, max, poruka]] of Object.entries(GRANICE)) {
      const v = f[k as keyof typeof f]
      if (v && !(uBroj(v) >= min && uBroj(v) <= max)) return setGreska(poruka)
    }
    const broj = (v: string) => (v.trim() ? uBroj(v) : null)
    // Prazno polje cilja znači: uzmi vrednost iz formule
    const cilj = (v: string, k: keyof Makrosi) => broj(v) ?? formula?.[k] ?? null
    const ciljevi = { cilj_kcal: cilj(f.cilj_kcal, 'kcal'), cilj_proteini: cilj(f.cilj_proteini, 'proteini'), cilj_uh: cilj(f.cilj_uh, 'uh'), cilj_masti: cilj(f.cilj_masti, 'masti') }
    if (Object.values(ciljevi).some((v) => v != null && !(v >= 0))) return setGreska('Dnevni cilj mora biti broj, 0 ili više.')

    setRadi(true); setGreska('')
    try {
      await sacuvajProfil({
        id: profil.id, nadimak: f.nadimak.trim() || null, ime: f.ime.trim() || null, pol: (f.pol || null) as ProfilTip['pol'], datum_rodjenja: f.datum_rodjenja || null,
        visina_cm: broj(f.visina_cm), tezina_kg: broj(f.tezina_kg), treninga_nedeljno: broj(f.treninga_nedeljno),
        koraka_dnevno: broj(f.koraka_dnevno), cilj: (f.cilj || null) as ProfilTip['cilj'], ciljna_tezina_kg: broj(f.ciljna_tezina_kg),
        ...ciljevi,
      })
      await osveziProfil()
      idi('/')
    } catch (e) {
      const zauzet = e instanceof Error && /profil_nadimak_jedinstven/.test(e.message)
      setGreska(zauzet ? 'Nadimak je zauzet. Probaj drugi.' : 'Profil nije sačuvan. Proveri vrednosti i internet.')
      setRadi(false)
    }
  }

  const broj = (k: keyof typeof f, naziv: string, korak = 'decimal') => (
    <label className="polje"><span>{naziv}</span>
      <input className="unos num" inputMode={korak as 'decimal' | 'numeric'} value={f[k]} onChange={set(k)} />
    </label>
  )
  const izbor = (k: 'pol' | 'cilj', opcije: [string, string][]) => (
    <div className="segment">
      {opcije.map(([v, naziv]) => (
        <label key={v}><input type="radio" name={k} value={v} checked={f[k] === v} onChange={set(k)} /><span>{naziv}</span></label>
      ))}
    </div>
  )

  return (
    <>
      <div className="dan-red profil-naslov"><h1>Profil</h1></div>
      <form className="dan profil" onSubmit={sacuvaj}>
        <section className="panel" aria-labelledby="telo-naslov">
          <h2 id="telo-naslov" className="panel-glava"><span className="plocica svetla" aria-hidden><UserRound size={20} strokeWidth={2.5} /></span>Tvoji podaci</h2>
          <div className="panel-telo">
            <label className="polje"><span>Nadimak (po njemu te prijatelji nalaze)</span>
              <input className="unos" value={f.nadimak} onChange={set('nadimak')} autoComplete="nickname" minLength={3} maxLength={20} />
            </label>
            <label className="polje"><span>Ime</span><input className="unos" value={f.ime} onChange={set('ime')} autoComplete="given-name" /></label>
            <fieldset className="polje"><legend className="sr">Pol</legend><span aria-hidden>Pol</span>{izbor('pol', [['m', 'Muški'], ['z', 'Ženski']])}</fieldset>
            <div className="dva">
              <label className="polje"><span>Datum rođenja</span><input className="unos num" type="date" value={f.datum_rodjenja} onChange={set('datum_rodjenja')} /></label>
              {broj('visina_cm', 'Visina (cm)', 'numeric')}
            </div>
            <div className="dva">{broj('tezina_kg', 'Težina (kg)')}{broj('ciljna_tezina_kg', 'Ciljna težina (kg)')}</div>
            <div className="dva">{broj('treninga_nedeljno', 'Treninga nedeljno', 'numeric')}{broj('koraka_dnevno', 'Koraka dnevno', 'numeric')}</div>
            <fieldset className="polje"><legend className="sr">Cilj</legend><span aria-hidden>Cilj</span>{izbor('cilj', [['smrsati', 'Smršati'], ['odrzavati', 'Održavati'], ['bulk', 'Bulk']])}</fieldset>
          </div>
        </section>

        <section className="panel" aria-labelledby="cilj-naslov">
          <h2 id="cilj-naslov" className="panel-glava"><span className="plocica svetla" aria-hidden><Calculator size={20} strokeWidth={2.5} /></span>Dnevni cilj</h2>
          <div className="panel-telo">
            {formula ? (
              <div className="formula">
                <p className="num">Po formuli: <b>{fmt(formula.kcal)} kcal</b> · P {formula.proteini} g · UH {formula.uh} g · M {formula.masti} g</p>
                <button type="button" className="dugme" onClick={uzmiFormulu}>Uzmi izračunato</button>
              </div>
            ) : (
              <p className="tiho-tekst">Popuni pol, datum rođenja, visinu, težinu, treninge, korake i cilj, pa se cilj izračuna sam.</p>
            )}
            <p className="tiho-tekst">Možeš ga i ručno promeniti. Prazno polje uzima vrednost iz formule.</p>
            <div className="dva">{broj('cilj_kcal', 'Kalorije (kcal)', 'numeric')}{broj('cilj_proteini', 'Proteini (g)')}</div>
            <div className="dva">{broj('cilj_uh', 'Ugljeni hidrati (g)')}{broj('cilj_masti', 'Masti (g)')}</div>
            {greska && <p className="greska" role="alert">{greska}</p>}
            <button className="dugme glavno" type="submit" disabled={radi}>
              {radi ? 'Čuvam…' : 'Sačuvaj'}
              <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
            </button>
            <button type="button" className="dugme tiho odjava" onClick={() => supabase.auth.signOut()}>
              <LogOut size={18} aria-hidden /> Odjavi se
            </button>
          </div>
        </section>
      </form>
    </>
  )
}
