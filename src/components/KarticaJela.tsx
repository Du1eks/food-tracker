// Posle "Napravi obrok": na sredini ekrana iskoči kartica jela (ime, kcal, P/UH/M, oznake), uz zrake i konfete.
// Zatvara se klikom, Escape-om ili sama posle par sekundi. Pokret je u pages/kuhinja.css; bez pokreta samo se pojavi.
import { useEffect } from 'react'
import { fmt, oznakeJela, type Makrosi } from '../lib/ishrana'

const STOJI = 5500 // ms

async function konfete() {
  const { default: confetti } = await import('canvas-confetti')
  // boje iz CSS tokena (canvas ne čita var(), pa se pročitaju jednom)
  const css = getComputedStyle(document.documentElement)
  const colors = ['--zelena', '--svetlozelena', '--tekst', '--bela', '--varnica'].map((t) => css.getPropertyValue(t).trim()).filter(Boolean)
  const zajedno = { disableForReducedMotion: true, zIndex: 60, ticks: 240, gravity: 0.95, scalar: 1.05, colors }
  void confetti({ ...zajedno, particleCount: 120, spread: 110, startVelocity: 46, origin: { x: 0.5, y: 0.55 } })
  void confetti({ ...zajedno, particleCount: 70, angle: 60, spread: 55, startVelocity: 60, origin: { x: 0, y: 0.85 } })
  void confetti({ ...zajedno, particleCount: 70, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.85 } })
}

export default function KarticaJela({ ime, m, onZatvori }: { ime: string; m: Makrosi; onZatvori: () => void }) {
  useEffect(() => {
    void konfete()
    const t = setTimeout(onZatvori, STOJI)
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onZatvori() }
    addEventListener('keydown', esc)
    return () => { clearTimeout(t); removeEventListener('keydown', esc) }
  }, [onZatvori])

  const oznake = oznakeJela(m)
  return (
    <div className="jelo-pozadina" onClick={onZatvori}>
      <div className="jelo-zraci" aria-hidden />
      <section className="jelo-kartica" role="status" aria-label={`Jelo ${ime} je napravljeno`}>
        <p className="jelo-nadnaslov">Jelo je spremno!</p>
        <h2 className="jelo-ime">{ime}</h2>
        <p className="jelo-kcal num"><b>{fmt(m.kcal)}</b> kcal</p>
        <dl className="jelo-makroi num">
          <div><dt>P</dt><dd>{fmt(m.proteini)} g</dd></div>
          <div><dt>UH</dt><dd>{fmt(m.uh)} g</dd></div>
          <div><dt>M</dt><dd>{fmt(m.masti)} g</dd></div>
        </dl>
        {oznake.length > 0 && (
          <ul className="jelo-oznake">
            {oznake.map((o, i) => <li key={o} style={{ '--i': i } as React.CSSProperties}>{o}</li>)}
          </ul>
        )}
        <p className="jelo-zatvori tiho-tekst">Klikni bilo gde da zatvoriš</p>
      </section>
    </div>
  )
}
