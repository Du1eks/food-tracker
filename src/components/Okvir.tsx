import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router'
import { CalendarDays, UserRound } from 'lucide-react'
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
        <Link to="/" className="gornja-ime">Mouse's tracker</Link>
        <Link to="/kalendar" className="plocica svetla" aria-label="Kalendar">
          <CalendarDays size={22} strokeWidth={2.25} aria-hidden />
        </Link>
        <Link to="/profil" className="plocica svetla gornja-profil" aria-label={nepopunjen ? 'Profil, nije popunjen' : 'Profil'}>
          <UserRound size={22} strokeWidth={2.25} aria-hidden />
          {nepopunjen && <span className="tacka" aria-hidden />}
        </Link>
      </header>
      <Outlet context={{ profil, osveziProfil } satisfies OkvirKontekst} />
    </>
  )
}
