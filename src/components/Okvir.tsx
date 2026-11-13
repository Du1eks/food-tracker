import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router'
import { Apple, CalendarDays, House, UserRound, Users } from 'lucide-react'
import { ucitajProfil, type Profil } from '../lib/podaci'
import type { OkvirKontekst } from './useProfil'
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
  return (
    <>
      <header className="gornja">
        <div className="gornja-levo">
          <Link to="/" className="plocica svetla" aria-label="Početna, današnji dan">
            <House size={22} strokeWidth={2.25} aria-hidden />
          </Link>
          {/* Na uskom telefonu nema mesta za ime; ikona kuće vodi na isto mesto */}
          <Link to="/" className="gornja-ime">Mouse's tracker</Link>
        </div>
        <div className="gornja-desno">
          <Link to="/kalendar" className="plocica svetla" aria-label="Kalendar">
            <CalendarDays size={22} strokeWidth={2.25} aria-hidden />
          </Link>
          <Link to="/namirnice" className="plocica svetla" aria-label="Namirnice">
            <Apple size={22} strokeWidth={2.25} aria-hidden />
          </Link>
          <Link to="/prijatelji" className="plocica svetla" aria-label="Prijatelji">
            <Users size={22} strokeWidth={2.25} aria-hidden />
          </Link>
          <Link to="/profil" className="plocica svetla gornja-profil" aria-label={nepopunjen ? 'Profil, nije popunjen' : 'Profil'}>
            <UserRound size={22} strokeWidth={2.25} aria-hidden />
            {nepopunjen && <span className="tacka" aria-hidden />}
          </Link>
        </div>
      </header>
      <Outlet context={{ profil, osveziProfil } satisfies OkvirKontekst} />
    </>
  )
}
