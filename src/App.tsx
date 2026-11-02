import { Navigate, Route, Routes } from 'react-router'
import { useSesija } from './lib/sesija'
import { Prijava, Registracija, NovaLozinka } from './pages/Nalog'
import Okvir from './components/Okvir'
import Dan from './pages/Dan'
import Profil from './pages/Profil'
import Kalendar from './pages/Kalendar'

export default function App() {
  const sesija = useSesija()
  if (sesija === undefined) return <p className="sr" role="status">Učitavanje…</p>

  const gost = (el: React.ReactNode) => (sesija ? <Navigate to="/" replace /> : el)
  return (
    <Routes>
      <Route path="/login" element={gost(<Prijava />)} />
      <Route path="/registracija" element={gost(<Registracija />)} />
      <Route path="/nova-lozinka" element={<NovaLozinka />} />
      <Route element={sesija ? <Okvir /> : <Navigate to="/login" replace />}>
        <Route index element={<Dan />} />
        <Route path="dan/:datum" element={<Dan />} />
        <Route path="profil" element={<Profil />} />
        <Route path="kalendar" element={<Kalendar />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
