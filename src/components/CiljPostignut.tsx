import './cilj-postignut.css'

// Natpis preko ekrana kad se pređe dnevni cilj kalorija (zamenljiv crtež; kada ga pokazati odlučuje Dan.tsx):
// tekst iskoči, iza njega se okreću zraci i sjaj, iskre lete na sve strane, pa sve izbledi. onKraj: natpis je završio.
const ISKRE = 12

export default function CiljPostignut({ onKraj }: { onKraj: () => void }) {
  return (
    <div className="cilj-postignut" role="status" onAnimationEnd={(e) => e.target === e.currentTarget && onKraj()}>
      <span className="cp-zraci" aria-hidden />
      <span className="cp-sjaj" aria-hidden />
      {Array.from({ length: ISKRE }, (_, i) => (
        <span key={i} className="cp-iskra" style={{ '--u': `${(360 / ISKRE) * i + (i % 2) * 12}deg`, '--d': i % 3 } as React.CSSProperties} aria-hidden />
      ))}
      <p className="cp-tekst">Goal achieved!</p>
    </div>
  )
}
