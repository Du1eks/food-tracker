import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, X } from 'lucide-react'
import type { Rang } from '../lib/rang'
import Pehar from './Pehar'
import './rang-usi.css'

const POMAK_ZA_KLIK = 6 // px: manji pomak je klik, veći je prevlačenje (isto kao u MisViri)
const POMAK_ZA_ZATVARANJE = 48 // px udesno, da se miš vrati i ostanu samo uši
const vrsta = (mesto: number) => ['zlato', 'srebro', 'bronza'][mesto - 1] ?? 'drvo'

// Rang na početnoj: uši miša vire sa desne ivice. Klik/Enter/Space otvara kartu sa mojim mestom (miš izađe iz ivice),
// prevlačenje udesno, dugme Zatvori ili Escape vraćaju miša. Kad se mesto promeni, uši zatrepere i svetle dok ih ne otvoriš.
// Nema ih dok se rang učitava, pri grešci i kad nema prijatelja (rang null ili samac).
export default function RangUsi({ rang, novo, onVidjeno }: { rang: Rang | null; novo: boolean; onVidjeno: () => void }) {
  const [otvoreno, setOtvoreno] = useState(false)
  const [pomak, setPomak] = useState(0) // px: koliko je miš povučen udesno dok se vuče
  const vuce = useRef<{ x: number; pomeren: boolean } | null>(null)
  const povuceno = useRef(false) // posle prevlačenja sledeći click se preskače
  const dugme = useRef<HTMLButtonElement>(null)
  const kartaId = useId()
  if (!rang || rang.ukupno === 1) return null

  const zatvori = () => { setOtvoreno(false); setPomak(0) }
  const prebaci = () => {
    if (otvoreno) return zatvori()
    setOtvoreno(true)
    onVidjeno()
  }
  const vrati = () => { zatvori(); dugme.current?.focus() }

  return (
    <div className={`rang-usi pehar-${vrsta(rang.mesto)}${otvoreno ? ' otvoreno' : ''}${novo && !otvoreno ? ' novo' : ''}`}
      style={pomak ? { transform: `translateX(${pomak}px)`, transition: 'none' } : undefined}
      onKeyDown={(e) => { if (e.key === 'Escape' && otvoreno) vrati() }}>
      {/* dugme je prvo u redosledu (Tab ide iz njega na kartu), a vizuelno je desno od karte (row-reverse) */}
      <button ref={dugme} type="button" className="rang-usi-dugme" aria-label="Tvoje mesto na rang listi" aria-expanded={otvoreno} aria-controls={kartaId}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          vuce.current = { x: e.clientX, pomeren: false }
          povuceno.current = false
        }}
        onPointerMove={(e) => {
          const v = vuce.current
          if (!v) return
          const dx = e.clientX - v.x
          if (Math.abs(dx) > POMAK_ZA_KLIK) v.pomeren = true
          if (v.pomeren && otvoreno) setPomak(Math.max(0, dx))
        }}
        onPointerUp={() => {
          const v = vuce.current
          vuce.current = null
          if (!v?.pomeren) return
          povuceno.current = true
          if (otvoreno && pomak > POMAK_ZA_ZATVARANJE) zatvori()
          else setPomak(0)
        }}
        onPointerCancel={() => { vuce.current = null; setPomak(0) }}
        onClick={() => { if (povuceno.current) povuceno.current = false; else prebaci() }}>
        {otvoreno
          ? <img src="/maskota/viri.webp" alt="" width={411} height={420} />
          : <img src="/maskota/viri-usi.webp" alt="" width={155} height={245} />}
      </button>
      <div id={kartaId} className="rang-usi-karta" hidden={!otvoreno}>
        <Link to="/prijatelji" className="rang-usi-link">
          <Pehar vrsta={vrsta(rang.mesto)} />
          <span><b className="rang-usi-mesto num">{rang.mesto}.</b> mesto među prijateljima</span>
          <ChevronRight size={20} strokeWidth={2.5} aria-hidden />
        </Link>
        <button type="button" className="rang-usi-zatvori" aria-label="Zatvori" onClick={vrati}><X size={18} strokeWidth={2.5} aria-hidden /></button>
      </div>
      {/* signal za čitač ekrana (treptanje uši samo vide) */}
      <span className="sr" role="status">{novo && !otvoreno ? `Promena na rang listi: ${rang.mesto}. mesto među prijateljima` : ''}</span>
    </div>
  )
}
