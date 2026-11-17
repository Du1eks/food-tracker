import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'

// Opasna radnja (brisanje, uklanjanje) u dva koraka, unutar aplikacije: prvi klik na dugme pita, "Da" izvršava.
// Ne koristimo prozor confirm(): u ugrađenim pregledačima i u desktop app-u (Tauri) on tiho vrati "ne", pa brisanje ne radi.
export default function Potvrdi({ pitanje, da, onDa, children, ...dugme }:
  { pitanje: string; da: string; onDa: () => void; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [pita, setPita] = useState(false)
  if (!pita) return <button type="button" {...dugme} onClick={() => setPita(true)}>{children}</button>
  return (
    <span className="potvrdi" role="group" aria-label={pitanje} onKeyDown={(e) => { if (e.key === 'Escape') setPita(false) }}>
      <span className="potvrdi-pitanje">{pitanje}</span>
      <button type="button" className="dugme opasno" autoFocus onClick={() => { setPita(false); onDa() }}>{da}</button>
      <button type="button" className="dugme tiho" onClick={() => setPita(false)}>Ne</button>
    </span>
  )
}
