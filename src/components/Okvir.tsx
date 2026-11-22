import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { CalendarDays, FlaskConical, House, UserRound, Users } from 'lucide-react'
import { ucitajProfil, type Profil } from '../lib/podaci'
import type { OkvirKontekst } from './useProfil'
import MisViri from './MisViri'
import Uputstvo from './Uputstvo'
import { lokalnoSkladiste, trebaDaSePrikaze, zapamtiUputstvo } from '../lib/uputstvo'
import './okvir.css'

export default function Okvir() {
  const [profil, setProfil] = useState<Profil | null>(null)
  const [ucitan, setUcitan] = useState(false)

  const osveziProfil = () =>
    ucitajProfil()
      .then(setProfil)
      .catch(() => setProfil(null))
      .finally(() => setUcitan(true))

  useEffect(() => {
    osveziProfil()
  }, [])

  const nepopunjen = ucitan && !profil?.cilj_kcal
  // Uputstvo: samo od sebe pri prvom ulasku (nije viđeno u localStorage-u za ovog korisnika), ili ručno iz Profila
  const [uputstvoRucno, setUputstvoRucno] = useState(false)
  const [uputstvoVideno, setUputstvoVideno] = useState(false) // zatvoreno u ovoj sesiji, i kad upis u storage ne uspe
  const prikaziUputstvo = uputstvoRucno || (ucitan && !!profil && !uputstvoVideno && trebaDaSePrikaze(profil.id, lokalnoSkladiste()))
  const zavrsiUputstvo = () => {
    if (profil) zapamtiUputstvo(profil.id, lokalnoSkladiste())
    setUputstvoRucno(false)
    setUputstvoVideno(true)
  }
  const { pathname } = useLocation()
  const naDanu = pathname === '/' || pathname.startsWith('/dan/') // tamo je živi miš u panelu
  const svojMis = naDanu || pathname === '/kuhinja' // Laboratorija ima svog miša na stranici
  return (
    <>
      <header className="gornja">
        <div className="gornja-levo">
          <NavLink to="/" end className="plocica svetla" aria-label="Početna, današnji dan">
            <House size={22} strokeWidth={2.25} aria-hidden />
          </NavLink>
          {/* Na uskom telefonu nema mesta za ime; ikona kuće vodi na isto mesto */}
          <Link to="/" className="gornja-ime">Mouse's tracker</Link>
        </div>
        <div className="gornja-desno">
          <NavLink to="/kalendar" className="plocica svetla" aria-label="Kalendar">
            <CalendarDays size={22} strokeWidth={2.25} aria-hidden />
          </NavLink>
          <NavLink to="/kuhinja" className="plocica svetla" aria-label="Laboratorija, moja jela">
            <FlaskConical size={22} strokeWidth={2.25} aria-hidden />
          </NavLink>
          <NavLink to="/prijatelji" className="plocica svetla" aria-label="Prijatelji">
            <Users size={22} strokeWidth={2.25} aria-hidden />
          </NavLink>
          <NavLink to="/profil" className="plocica svetla gornja-profil" aria-label={nepopunjen ? 'Profil, nije popunjen' : 'Profil'}>
            <UserRound size={22} strokeWidth={2.25} aria-hidden />
            {nepopunjen && <span className="tacka" aria-hidden />}
          </NavLink>
        </div>
      </header>
      <Outlet context={{ profil, osveziProfil, otvoriUputstvo: () => setUputstvoRucno(true) } satisfies OkvirKontekst} />
      {prikaziUputstvo && <Uputstvo nepopunjen={!profil?.cilj_kcal} onKraj={zavrsiUputstvo} />}
      {/* ključ na stranici: pri svakom prelasku miš ponovo proviri */}
      {!svojMis && ucitan && <MisViri key={pathname} cilj={profil} />}
    </>
  )
}
