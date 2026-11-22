import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Rang } from '../lib/rang'
import Pehar from './Pehar'
import './rang-strelica.css'

const vrsta = (mesto: number) => ['zlato', 'srebro', 'bronza'][mesto - 1] ?? 'drvo'

// Rang na početnoj: mala strelica na desnoj ivici. Mišem: na hover se izvuče i pokaže kartu sa mojim mestom; dodirom i
// tastaturom: klik/tap/Enter/Space otvara i drži kartu (Escape, klik van nje ili ponovni klik na strelicu zatvaraju). Kad se mesto promeni,
// strelica svetli (i tačka) i zatrepće dok je ne otvoriš ili preletiš.
// Nema je dok se rang učitava, pri grešci i kad nema prijatelja (rang null ili samac).
export default function RangStrelica({ rang, novo, onVidjeno }: { rang: Rang | null; novo: boolean; onVidjeno: () => void }) {
  const [otvoreno, setOtvoreno] = useState(false) // držim kartu otvorenu (klik, tap, tastatura)
  const [nad, setNad] = useState(false) // miš je iznad (samo pokazivač miša; dodir nema hover)
  const dugme = useRef<HTMLButtonElement>(null)
  const omot = useRef<HTMLDivElement>(null)
  const kartaId = useId()

  // Držana karta se zatvara i dodirom/klikom van nje (na dodiru nema drugog prirodnog načina bez dugmeta Zatvori)
  useEffect(() => {
    if (!otvoreno) return
    const van = (e: PointerEvent) => { if (!omot.current?.contains(e.target as Node)) setOtvoreno(false) }
    document.addEventListener('pointerdown', van)
    return () => document.removeEventListener('pointerdown', van)
  }, [otvoreno])

  if (!rang || rang.ukupno === 1) return null

  const prikazano = otvoreno || nad
  // i skrivanje potvrđuje: promena koja je stigla dok je karta bila otvorena je viđena, strelica ne treba opet da trepće
  const zatvori = () => { setOtvoreno(false); setNad(false); onVidjeno() }
  const prebaci = () => {
    if (otvoreno) return zatvori()
    setOtvoreno(true)
    onVidjeno()
  }
  const vrati = () => { zatvori(); dugme.current?.focus() }

  return (
    <div ref={omot} className={`rang-strelica pehar-${vrsta(rang.mesto)}${prikazano ? ' otvoreno' : ''}${novo && !prikazano ? ' novo' : ''}`}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') { setNad(true); onVidjeno() } }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setNad(false) }}
      onKeyDown={(e) => { if (e.key === 'Escape' && prikazano) vrati() }}>
      {/* dugme je prvo u redosledu (Tab ide iz njega na kartu), a vizuelno je desno od karte (row-reverse) */}
      <button ref={dugme} type="button" className="rang-strelica-dugme" aria-label="Tvoje mesto na rang listi" aria-expanded={prikazano} aria-controls={kartaId}
        onClick={prebaci}>
        {prikazano ? <ChevronRight size={22} strokeWidth={2.75} aria-hidden /> : <ChevronLeft size={22} strokeWidth={2.75} aria-hidden />}
      </button>
      <div id={kartaId} className="rang-strelica-karta" hidden={!prikazano}>
        <Link to="/prijatelji" className="rang-strelica-link">
          <Pehar vrsta={vrsta(rang.mesto)} />
          <span><b className="rang-strelica-mesto num">{rang.mesto}.</b> mesto među prijateljima</span>
          <ChevronRight size={20} strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
      {/* signal za čitač ekrana (svetlo i treptanje strelice samo vide) */}
      <span className="sr" role="status">{novo && !prikazano ? `Promena na rang listi: ${rang.mesto}. mesto među prijateljima` : ''}</span>
    </div>
  )
}
