import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { CalendarDays, FlaskConical, House, UserRound, Users } from 'lucide-react'
import { danas } from '../lib/datum'
import { ucitajProfil, zbirZaDan, type Profil } from '../lib/podaci'
import type { Zbir } from '../lib/rang'
import type { OkvirKontekst } from './useProfil'
import MisViri from './MisViri'
import RangZnacka from './RangZnacka'
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

  const { pathname } = useLocation()
  // Rang za značku u traci: učitava se pri svakom prelasku na drugu stranu (npr. posle prihvaćenog drugara), a početna ga
  // osvežava posle unosa. Brojač: stariji odgovor koji stigne posle novijeg se odbacuje.
  const [rang, setRang] = useState<Zbir[] | 'greska' | null>(null)
  const poslednjiZahtev = useRef(0)
  const osveziRang = useCallback(() => {
    const n = ++poslednjiZahtev.current
    zbirZaDan(danas()).then(
      (r) => { if (n === poslednjiZahtev.current) setRang(r) },
      () => { if (n === poslednjiZahtev.current) setRang('greska') },
    )
  }, [])
  useEffect(() => {
    osveziRang()
  }, [pathname, osveziRang])

  const nepopunjen = ucitan && !profil?.cilj_kcal
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
          <RangZnacka redovi={rang} profilId={profil?.id} />
          <NavLink to="/prijatelji" className="plocica svetla" aria-label="Prijatelji">
            <Users size={22} strokeWidth={2.25} aria-hidden />
          </NavLink>
          <NavLink to="/profil" className="plocica svetla gornja-profil" aria-label={nepopunjen ? 'Profil, nije popunjen' : 'Profil'}>
            <UserRound size={22} strokeWidth={2.25} aria-hidden />
            {nepopunjen && <span className="tacka" aria-hidden />}
          </NavLink>
        </div>
      </header>
      <Outlet context={{ profil, osveziProfil, rang, osveziRang } satisfies OkvirKontekst} />
      {/* ključ na stranici: pri svakom prelasku miš ponovo proviri */}
      {!svojMis && ucitan && <MisViri key={pathname} cilj={profil} />}
    </>
  )
}
