import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { CalendarDays, FlaskConical, House, UserRound, Users } from 'lucide-react'
import { ucitajProfil, type Profil } from '../lib/podaci'
import type { OkvirKontekst } from './useProfil'
import MisViri from './MisViri'
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
      <Outlet context={{ profil, osveziProfil } satisfies OkvirKontekst} />
      {/* ključ na stranici: pri svakom prelasku miš ponovo proviri */}
      {!svojMis && ucitan && <MisViri key={pathname} cilj={profil} />}
    </>
  )
}
