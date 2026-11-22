import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ChevronRight, X } from 'lucide-react'
import Pehar from './Pehar'
import type { PorukaRanga } from './useRang'
import './rang-poruka.css'

const TRAJE = 5000 // ms dok kartica sama ne nestane; staje dok je miš ili fokus na njoj
const vrsta = (mesto: number) => ['zlato', 'srebro', 'bronza'][mesto - 1] ?? 'drvo'

// Prolazna kartica "3. mesto među prijateljima": pojavi se kad se mesto promeni posle unosa (useRang), vodi na rang listu.
// Omot sa role="status" stoji uvek, da čitač ekrana pročita karticu kad se pojavi.
export default function RangPoruka({ poruka, onKraj }: { poruka: PorukaRanga | null; onKraj: () => void }) {
  const tajmer = useRef(0)
  const pokreni = useCallback(() => {
    clearTimeout(tajmer.current)
    tajmer.current = window.setTimeout(onKraj, TRAJE)
  }, [onKraj])
  const stani = () => clearTimeout(tajmer.current)

  useEffect(() => {
    if (!poruka) return
    pokreni()
    return () => clearTimeout(tajmer.current)
  }, [poruka, pokreni])

  return (
    <div className="rang-poruka-omot" role="status">
      {poruka && (
        // klasa pehar-<vrsta> daje --varnica, pa su pehar, sjaj i broj mesta iste boje
        <div className={`rang-poruka pehar-${vrsta(poruka.mesto)}`} onMouseEnter={stani} onMouseLeave={pokreni} onFocus={stani} onBlur={pokreni}>
          <Link to="/prijatelji" className="rang-poruka-link">
            <Pehar vrsta={vrsta(poruka.mesto)} />
            <span><b className="rang-poruka-mesto num">{poruka.mesto}.</b> mesto među prijateljima</span>
            <ChevronRight size={20} strokeWidth={2.5} aria-hidden />
          </Link>
          <button type="button" className="rang-poruka-zatvori" aria-label="Zatvori" onClick={onKraj}><X size={18} strokeWidth={2.5} aria-hidden /></button>
        </div>
      )}
    </div>
  )
}
