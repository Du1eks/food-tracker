import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { NADIMAK_PORUKA, nadimakIspravan, nadimakSlobodan } from '../lib/podaci'
import './nalog.css'

function Okvir({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="nalog">
      <div className="nalog-gornja"><img src="/maskota/logo-zeleno.png" alt="Mouse's tracker" /></div>
      <header className="nalog-traka">
        <h1>{naslov}</h1>
        <p className="nalog-opis">Kalorije i makrosi za ekipu iz teretane.</p>
      </header>
      <main className="nalog-panel">
        {/* Uži ekran: miš leži na formi i pokazuje nadole; širi: stoji desno i pokazuje ulevo (isti prelom kao u nalog.css) */}
        <picture>
          <source media="(max-width: 999px)" srcSet="/maskota/pokazuje_dole.png" />
          <img className="nalog-mis" src="/maskota/pokazuje.png" alt="Miš pokazuje na formu: nemoj da si miš" />
        </picture>
        {children}
      </main>
    </div>
  )
}

function Posalji({ tekst, radi }: { tekst: string; radi: boolean }) {
  return (
    <button className="dugme glavno" type="submit" disabled={radi}>
      {radi ? 'Sačekaj…' : tekst}
      <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
    </button>
  )
}

// Supabase vraća poruke na engleskom; najčešće prevodimo, ostale prikazujemo kako jesu.
function prevedi(poruka: string): string {
  if (/invalid login credentials/i.test(poruka)) return 'Pogrešan email ili lozinka.'
  if (/email not confirmed/i.test(poruka)) return 'Email još nije potvrđen. Klikni link koji smo ti poslali.'
  if (/already registered/i.test(poruka)) return 'Nalog sa ovim emailom već postoji. Prijavi se.'
  if (/password should be at least/i.test(poruka)) return 'Lozinka mora imati bar 6 znakova.'
  // trigger za profil puca na unique indeksu kad neko drugi u međuvremenu uzme nadimak
  if (/database error saving new user/i.test(poruka)) return 'Nalog nije napravljen. Nadimak je verovatno upravo zauzet, probaj drugi.'
  if (/rate limit/i.test(poruka)) return 'Previše pokušaja. Sačekaj par minuta pa probaj ponovo.'
  return poruka
}

export function Prijava() {
  const [email, setEmail] = useState('')
  const [lozinka, setLozinka] = useState('')
  const [greska, setGreska] = useState('')
  const [poruka, setPoruka] = useState('')
  const [radi, setRadi] = useState(false)

  async function prijavi(e: React.FormEvent) {
    e.preventDefault()
    setRadi(true); setGreska(''); setPoruka('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: lozinka })
    setRadi(false)
    if (error) setGreska(prevedi(error.message))
  }

  async function zaboravio() {
    if (!email) return setGreska('Upiši email, pa klikni "Zaboravio si lozinku?".')
    setGreska('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/nova-lozinka` })
    if (error) setGreska(prevedi(error.message))
    else setPoruka(`Poslali smo link za novu lozinku na ${email}.`)
  }

  return (
    <Okvir naslov="Prijava">
      <form className="nalog-forma" onSubmit={prijavi}>
        <label className="polje"><span>Email</span>
          <input className="unos" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="polje"><span>Lozinka</span>
          <input className="unos" type="password" autoComplete="current-password" required value={lozinka} onChange={(e) => setLozinka(e.target.value)} />
        </label>
        {greska && <p className="greska" role="alert">{greska}</p>}
        {poruka && <p className="poruka" role="status">{poruka}</p>}
        <Posalji tekst="Prijavi se" radi={radi} />
        <div className="nalog-linkovi">
          <button type="button" className="dugme tiho" onClick={zaboravio}>Zaboravio si lozinku?</button>
          <Link className="dugme" to="/registracija">Registruj se</Link>
        </div>
      </form>
    </Okvir>
  )
}

export function Registracija() {
  const [nadimak, setNadimak] = useState('')
  const [email, setEmail] = useState('')
  const [lozinka, setLozinka] = useState('')
  const [ponovo, setPonovo] = useState('')
  const [greska, setGreska] = useState('')
  const [poslato, setPoslato] = useState(false)
  const [radi, setRadi] = useState(false)

  async function registruj(e: React.FormEvent) {
    e.preventDefault()
    if (!nadimakIspravan(nadimak)) return setGreska(NADIMAK_PORUKA)
    if (lozinka !== ponovo) return setGreska('Lozinke se ne poklapaju.')
    setRadi(true); setGreska('')
    try {
      if (!(await nadimakSlobodan(nadimak))) {
        setRadi(false)
        return setGreska('Nadimak je zauzet. Probaj drugi.')
      }
    } catch {
      setRadi(false)
      return setGreska('Ne mogu da proverim nadimak. Proveri internet pa probaj ponovo.')
    }
    const { error } = await supabase.auth.signUp({
      email, password: lozinka, options: { emailRedirectTo: location.origin, data: { nadimak: nadimak.trim() } },
    })
    setRadi(false)
    if (error) setGreska(prevedi(error.message))
    else setPoslato(true)
  }

  if (poslato)
    return (
      <Okvir naslov="Proveri email">
        <div className="nalog-forma">
          <p className="poruka" role="status">Poslali smo link na <b>{email}</b>. Klikni ga da potvrdiš nalog, pa se prijavi.</p>
          <Link className="dugme" to="/login">Nazad na prijavu</Link>
        </div>
      </Okvir>
    )

  return (
    <Okvir naslov="Registracija">
      <form className="nalog-forma" onSubmit={registruj}>
        <label className="polje"><span>Nadimak (3–20 znakova, po njemu te prijatelji nalaze)</span>
          <input className="unos" autoComplete="nickname" required minLength={3} maxLength={20} value={nadimak} onChange={(e) => setNadimak(e.target.value)} />
        </label>
        <label className="polje"><span>Email</span>
          <input className="unos" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="polje"><span>Lozinka (bar 6 znakova)</span>
          <input className="unos" type="password" autoComplete="new-password" minLength={6} required value={lozinka} onChange={(e) => setLozinka(e.target.value)} />
        </label>
        <label className="polje"><span>Ponovi lozinku</span>
          <input className="unos" type="password" autoComplete="new-password" minLength={6} required value={ponovo} onChange={(e) => setPonovo(e.target.value)} />
        </label>
        {greska && <p className="greska" role="alert">{greska}</p>}
        <Posalji tekst="Napravi nalog" radi={radi} />
        <div className="nalog-linkovi">
          <span>Već imaš nalog?</span>
          <Link className="dugme" to="/login">Prijavi se</Link>
        </div>
      </form>
    </Okvir>
  )
}

// Link iz emaila za reset lozinke otvara ovu stranu sa privremenom sesijom.
export function NovaLozinka() {
  const [lozinka, setLozinka] = useState('')
  const [greska, setGreska] = useState('')
  const [radi, setRadi] = useState(false)
  const idi = useNavigate()

  async function sacuvaj(e: React.FormEvent) {
    e.preventDefault()
    setRadi(true); setGreska('')
    const { error } = await supabase.auth.updateUser({ password: lozinka })
    setRadi(false)
    if (error) setGreska(prevedi(error.message))
    else idi('/', { replace: true })
  }

  return (
    <Okvir naslov="Nova lozinka">
      <form className="nalog-forma" onSubmit={sacuvaj}>
        <label className="polje"><span>Nova lozinka (bar 6 znakova)</span>
          <input className="unos" type="password" autoComplete="new-password" minLength={6} required value={lozinka} onChange={(e) => setLozinka(e.target.value)} />
        </label>
        {greska && <p className="greska" role="alert">{greska}</p>}
        <Posalji tekst="Sačuvaj lozinku" radi={radi} />
      </form>
    </Okvir>
  )
}
