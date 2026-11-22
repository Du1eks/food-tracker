import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { MaketaEpruveta, MaketaKalendar, MaketaLab, MaketaProfil, MaketaRang, MaketaUnos } from './UputstvoMakete'
import './uputstvo.css'

// Redosled je važan: bez cilja ništa ne radi (epruveta, ciljevi, rang).
const KORACI = [
  { naslov: 'Profil i dnevni cilj', tekst: 'Upiši podatke i dnevni cilj (kalorije i proteini). Bez cilja nema epruvete ni ranga.', Maketa: MaketaProfil },
  { naslov: 'Dodaj hranu', tekst: 'Napiši mišu šta si jeo, on pročita i predloži pregled. Možeš i ručno preko „+“ ili uzeti svoje jelo iz Laboratorije. Ispravke su u tabeli dana.', Maketa: MaketaUnos },
  { naslov: 'Epruveta i ciljevi', tekst: 'Tečnost raste do isprekidane crte cilja. Kad ga pogodiš, epruveta postane zlatna, a kartice proteina i masti puknu kad dostigneš njihove ciljeve.', Maketa: MaketaEpruveta },
  { naslov: 'Laboratorija', tekst: 'Napiši mišu šta ide u jelo i sačuvaj ga. Posle ga dodaješ na početnoj jednim klikom.', Maketa: MaketaLab },
  { naslov: 'Kalendar i grafik', tekst: 'Kalendar pokazuje svaki dan sa trakom do cilja, a ispod je grafik makroa po danima u nedelji.', Maketa: MaketaKalendar },
  { naslov: 'Prijatelji i rang', tekst: 'Dodaj drugare po nadimku i takmičite se ko je danas bliže cilju. Strelica na desnoj ivici početne pokazuje tvoje mesto.', Maketa: MaketaRang },
]

const fokusabilni = (koren: HTMLElement) =>
  [...koren.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]

// Uputstvo "Kako radi aplikacija": dijalog preko celog ekrana sa 6 koraka i živim maketama (UputstvoMakete).
// Strelice levo/desno menjaju korak, Escape preskače, Tab ostaje unutar dijaloga, a fokus se vraća na ono što ga je otvorilo.
// onKraj: "Preskoči", Escape i "Počni" (Okvir tada pamti da je viđeno). nepopunjen: nema dnevnog cilja, pa je "Popuni profil" glavno.
export default function Uputstvo({ nepopunjen, onKraj }: { nepopunjen: boolean; onKraj: () => void }) {
  const [korak, setKorak] = useState(0)
  const [opener] = useState(() => document.activeElement as HTMLElement | null)
  const dijalog = useRef<HTMLDivElement>(null)
  const glavno = useRef<HTMLButtonElement>(null)
  const naslovId = useId()
  const navigate = useNavigate()
  const poslednji = korak === KORACI.length - 1
  const { naslov, tekst, Maketa } = KORACI[korak]

  // fokus u dijalog, pozadina se ne skroluje, a pri zatvaranju fokus nazad na onoga ko ga je otvorio
  useEffect(() => {
    glavno.current?.focus()
    const prethodno = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prethodno; opener?.focus?.() }
  }, [opener])
  // dugme koje je imalo fokus može nestati pri promeni koraka (poslednji korak ima druga dugmad): fokus ostaje u dijalogu
  useEffect(() => {
    if (!dijalog.current?.contains(document.activeElement)) glavno.current?.focus()
  }, [korak])

  const dalje = () => setKorak((i) => Math.min(i + 1, KORACI.length - 1))
  const nazad = () => setKorak((i) => Math.max(i - 1, 0))
  const popuni = () => { onKraj(); navigate('/profil') }

  return (
    <div className="uputstvo-zastor"
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.preventDefault(); onKraj() }
        else if (e.key === 'ArrowRight') dalje()
        else if (e.key === 'ArrowLeft') nazad()
        else if (e.key === 'Tab' && dijalog.current) {
          const f = fokusabilni(dijalog.current)
          const prvi = f[0], zadnji = f[f.length - 1]
          if (e.shiftKey && document.activeElement === prvi) { e.preventDefault(); zadnji.focus() }
          else if (!e.shiftKey && document.activeElement === zadnji) { e.preventDefault(); prvi.focus() }
        }
      }}>
      <div ref={dijalog} className="uputstvo" role="dialog" aria-modal="true" aria-labelledby={naslovId}>
        <div className="uputstvo-glava">
          <p className="uputstvo-brojac num" aria-live="polite">Korak {korak + 1} od {KORACI.length}</p>
          <button type="button" className="uputstvo-preskoci" onClick={onKraj}>Preskoči</button>
        </div>
        {/* key: pri svakoj promeni koraka makete se igraju iznova */}
        <div className="uputstvo-telo" key={korak}>
          <div className="uputstvo-maketa" aria-hidden><Maketa /></div>
          <h2 id={naslovId}>{naslov}</h2>
          <p>{tekst}</p>
        </div>
        <div className="uputstvo-tackice" aria-hidden>
          {KORACI.map((_, i) => <i key={i} className={i === korak ? 'tekuci' : i < korak ? 'prosao' : undefined} />)}
        </div>
        <div className="uputstvo-dugmad">
          <button type="button" className="dugme tiho" onClick={nazad} disabled={korak === 0}>
            <ChevronLeft size={20} aria-hidden /> Nazad
          </button>
          {poslednji ? (
            nepopunjen ? (
              <>
                <button type="button" className="dugme tiho" onClick={onKraj}>Počni</button>
                <button ref={glavno} type="button" className="dugme glavno" onClick={popuni}>
                  Popuni profil <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
                </button>
              </>
            ) : (
              <button ref={glavno} type="button" className="dugme glavno" onClick={onKraj}>
                Počni <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
              </button>
            )
          ) : (
            <button ref={glavno} type="button" className="dugme glavno" onClick={dalje}>
              Dalje <span className="plocica" aria-hidden><ArrowRight size={22} strokeWidth={2.5} /></span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
