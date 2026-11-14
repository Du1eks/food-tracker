// Posle upisa: makrosi unosa se zapale kao pločice, u luku polete u zelenu traku (za njima žar) i udare u svoj broj (iskre).
// Jak unos dobija i natpis preko ekrana (pohvale u lib/rang.ts).
// Čist DOM (Web Animations API): traka i unos su odvojene komponente, a spaja ih atribut data-makro na brojevima trake.
import { fmt, type Makrosi } from '../lib/ishrana'
import { PROTEINI_JAKO, pohvale } from '../lib/rang'

const NATPIS: [keyof Makrosi, (v: number) => string][] = [
  ['kcal', (v) => `${fmt(v)} kcal`],
  ['proteini', (v) => `P ${fmt(v)} g`],
  ['uh', (v) => `UH ${fmt(v)} g`],
  ['masti', (v) => `M ${fmt(v)} g`],
]
const POJAVA = 300, STOJI = 380, LET = 520, RAZMAK = 80 // ms
const sredina = (e: Element) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }
const tu = 'translate(-50%, -50%)'

function komad(klasa: string, x: number, y: number, tekst = '') {
  const e = document.createElement('span')
  e.className = klasa
  e.textContent = tekst
  e.style.left = `${x}px`
  e.style.top = `${y}px`
  e.setAttribute('aria-hidden', 'true')
  document.body.append(e)
  return e
}
// animira i ukloni element kad završi
const pusti = (e: HTMLElement, kadrovi: Keyframe[], opcije: KeyframeAnimationOptions) =>
  e.animate(kadrovi, { fill: 'both', ...opcije }).finished.finally(() => e.remove())

// Let u luku: tačke kvadratne krive (prvo malo zamahne u stranu i nadole, pa poleti), od pune veličine do `kraj`
function luk(dx: number, dy: number, ustranu: number, kraj: number): Keyframe[] {
  const c = { x: dx * 0.15 + ustranu, y: dy * 0.1 + 36 }
  return Array.from({ length: 11 }, (_, k) => {
    const t = k / 10
    const x = 2 * (1 - t) * t * c.x + t * t * dx, y = 2 * (1 - t) * t * c.y + t * t * dy
    return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${1 - (1 - kraj) * t})` }
  })
}

function udar(meta: Element, x: number, y: number, jako: boolean) {
  void pusti(komad('let-blesak', x, y), [{ transform: `${tu} scale(0.3)`, opacity: 0.95 }, { transform: `${tu} scale(${jako ? 3 : 1.8})`, opacity: 0 }], { duration: 380, easing: 'ease-out' })
  for (let n = jako ? 26 : 11; n > 0; n--) {
    const ugao = Math.random() * Math.PI * 2, d = (jako ? 50 : 26) + Math.random() * (jako ? 90 : 48)
    void pusti(
      komad('let-iskra', x, y),
      [
        { transform: `${tu} scale(1)`, opacity: 1 },
        // iskra odleti i pada (zato +24 nadole)
        { transform: `translate(calc(-50% + ${Math.cos(ugao) * d}px), calc(-50% + ${Math.sin(ugao) * d + 24}px)) scale(0.2)`, opacity: 0 },
      ],
      { duration: 420 + Math.random() * 320, easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)' },
    )
  }
  // broj se trgne i na tren zasija
  meta.animate(
    [
      { transform: 'none' },
      { transform: `scale(${jako ? 1.35 : 1.22}) translateY(2px)`, color: '#c42a00', textShadow: '0 0 16px #ffb300' },
      { transform: 'scale(0.97) translateY(-1px)' },
      { transform: 'none' },
    ],
    { duration: jako ? 600 : 450, easing: 'ease-out' },
  )
}

function natpis(redovi: string[]) {
  if (!redovi.length) return
  const e = document.createElement('p')
  e.className = 'let-pohvala'
  e.setAttribute('role', 'status')
  for (const r of redovi) e.append(Object.assign(document.createElement('span'), { textContent: r }))
  document.body.append(e)
  e.addEventListener('animationend', () => e.remove()) // pokret (ili samo pretapanje bez pokreta) je u dan.css
}

// Obećanje se ispuni kad prva pločica udari u traku: tad se brojevi preračunaju.
// Bez pokreta (prefers-reduced-motion) ili bez trake ispuni se odmah; natpis se i tada pokaže.
export function letMakrosa(m: Makrosi, odakle: Element | null, ime?: string | null): Promise<void> {
  const reci = pohvale(m, ime)
  if (!odakle || matchMedia('(prefers-reduced-motion: reduce)').matches) { natpis(reci); return Promise.resolve() }
  // početak: sredina vidljivog dela panela (panel je često viši od ekrana), tako da sve četiri pločice stanu na ekran
  const r = odakle.getBoundingClientRect()
  const vidljivo = (Math.max(r.top, 0) + Math.min(r.bottom, innerHeight)) / 2
  const start = { x: r.left + r.width / 2, y: Math.min(Math.max(vidljivo, 120), innerHeight - 120) }
  const udari = NATPIS.flatMap(([k, tekst], i) => {
    const meta = document.querySelector(`[data-makro="${k}"]`)
    if (!meta) return []
    const cilj = sredina(meta.firstElementChild ?? meta)
    const jako = k === 'proteini' && m.proteini >= PROTEINI_JAKO
    // pločice stoje jedna ispod druge na sredini panela za unos
    const y = start.y + (i - 1.5) * 54
    const p = komad(`let-makro num${jako ? ' jako' : ''}`, start.x, y, tekst(m[k]))
    p.style.zIndex = String(24 - i) // gornja pločica je iznad plamena donje, da joj se natpis čita
    const polazak = i * RAZMAK + POJAVA + STOJI
    const putanja = (kraj: number) => luk(cilj.x - start.x, cilj.y - y, i % 2 ? 70 : -70, kraj)
    p.animate(
      [{ transform: `${tu} scale(0.4)`, opacity: 0 }, { transform: `${tu} scale(1.2)`, opacity: 1, offset: 0.6 }, { transform: `${tu} scale(1)`, opacity: 1 }],
      { duration: POJAVA, delay: i * RAZMAK, fill: 'backwards' },
    )
    // žar leti za pločicom istom putanjom, sve sitniji i bleđi
    for (let j = 1; j <= 7; j++)
      void pusti(komad('let-zar', start.x, y), putanja(0.3).map((kadar, n) => ({ ...kadar, opacity: n === 0 ? 0 : 0.9 - j * 0.1 })), {
        duration: LET, delay: polazak + j * 42, easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)',
      })
    return [pusti(p, putanja(jako ? 0.7 : 0.45), { duration: LET, delay: polazak, easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)', fill: 'forwards' })
      .then(() => udar(meta, cilj.x, cilj.y, jako))]
  })
  // ako animacija pukne ili nema trake, brojevi se ipak preračunaju i natpis se pokaže
  return (udari.length ? Promise.race(udari).catch(() => {}) : Promise.resolve()).then(() => natpis(reci))
}
