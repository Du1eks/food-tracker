import './cilj-postignut.css'

// Natpis preko ekrana kad se pređe dnevni cilj (zamenljiv crtež; kada ga pokazati i šta posle odlučuje Dan.tsx):
// 3D natpis uleti okrećući se, ljulja se u prostoru, iza njega se vrte zraci i sjaj, iskre lete na sve strane, pa odleti.
// Dubina je pravi 3D: tekst je naslagan u slojeve po Z osi, pa se pri okretanju vidi debljina slova.
// ciljevi: koji su ciljevi upravo pređeni (kcal, proteini, masti). onKraj: natpis je završio.
export const NATPIS_TRAJE = 3000 // ms, isto kao cp-ceo u cilj-postignut.css
const ISKRE = 16
const SLOJEVI = 10
const IME: Record<string, string> = { kcal: 'Kalorije', proteini: 'Proteini', masti: 'Masti' }

export default function CiljPostignut({ ciljevi, onKraj }: { ciljevi: string[]; onKraj: () => void }) {
  const sta = ciljevi.map((k) => IME[k] ?? k).join(' · ')
  return (
    <div className="cilj-postignut" role="status" onAnimationEnd={(e) => e.target === e.currentTarget && onKraj()}>
      <span className="cp-zraci" aria-hidden />
      <span className="cp-sjaj" aria-hidden />
      {Array.from({ length: ISKRE }, (_, i) => (
        <span key={i} className="cp-iskra" style={{ '--u': `${(360 / ISKRE) * i + (i % 2) * 12}deg`, '--d': i % 4 } as React.CSSProperties} aria-hidden />
      ))}
      <div className="cp-scena">
        <div className="cp-telo">
          {Array.from({ length: SLOJEVI }, (_, i) => (
            <p key={i} className="cp-tekst cp-sloj" style={{ '--z': SLOJEVI - i } as React.CSSProperties} aria-hidden>Goal achieved!</p>
          ))}
          <p className="cp-tekst">Goal achieved!</p>
        </div>
        {sta && <p className="cp-sta">{sta}</p>}
      </div>
    </div>
  )
}
