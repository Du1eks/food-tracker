import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { CalendarDays, ChefHat, House, UserRound, Users } from 'lucide-react'
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
  const svojMis = naDanu || pathname === '/kuhinja' // Kuhinja ima miša kuvara na stranici
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
          <Link to="/kuhinja" className="plocica svetla" aria-label="Kuhinja, moja jela">
            <ChefHat size={22} strokeWidth={2.25} aria-hidden />
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
      {/* ključ na stranici: pri svakom prelasku miš ponovo proviri */}
      {!svojMis && ucitan && <MisViri key={pathname} cilj={profil} />}
    </>
  )
}
