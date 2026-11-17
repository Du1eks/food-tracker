// Kuhinja, posle "Napravi obrok": namirnice iz pregleda polete u luku do miša kuvara i uskoče mu u kapu (varnice, miš poskoči).
// Sopstvena varijanta po uzoru na letMakrosa (čist DOM, Web Animations API); stil je u pages/kuhinja.css.
const LET = 620, RAZMAK = 110 // ms
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
const pusti = (e: HTMLElement, kadrovi: Keyframe[], opcije: KeyframeAnimationOptions) =>
  e.animate(kadrovi, { fill: 'both', ...opcije }).finished.finally(() => e.remove())

// Luk preko kvadratne krive: namirnica prvo odskoči nagore, pa padne u kapu; usput se vrti i smanjuje
function luk(dx: number, dy: number, ustranu: number): Keyframe[] {
  const c = { x: dx * 0.5 + ustranu, y: Math.min(dy, 0) - 120 }
  return Array.from({ length: 13 }, (_, k) => {
    const t = k / 12
    const x = 2 * (1 - t) * t * c.x + t * t * dx, y = 2 * (1 - t) * t * c.y + t * t * dy
    return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${t * (ustranu > 0 ? 200 : -200)}deg) scale(${1 - 0.7 * t})` }
  })
}

function varnice(x: number, y: number) {
  for (let n = 9; n > 0; n--) {
    const ugao = -Math.PI * Math.random(), d = 24 + Math.random() * 40 // samo nagore, iz kape
    void pusti(komad('kuvaj-varnica', x, y), [
      { transform: `${tu} scale(1)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(ugao) * d}px), calc(-50% + ${Math.sin(ugao) * d}px)) scale(0.2)`, opacity: 0 },
    ], { duration: 380 + Math.random() * 260, easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)' })
  }
}

// Ispuni se kad poslednja namirnica uskoči u kapu. Bez pokreta (prefers-reduced-motion) ili bez miša odmah.
export function letNamirnica(namirnice: { ime: string; el: Element }[], mis: Element | null): Promise<void> {
  if (!mis || matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve()
  mis.scrollIntoView({ block: 'nearest' }) // miš mora da se vidi; red ispod ekrana kreće sa ivice ekrana
  const r = mis.getBoundingClientRect()
  const kapa = { x: r.left + r.width * 0.6, y: r.top + r.height * 0.12 }
  const sletanja = namirnice.map(({ ime, el }, i) => {
    const o = el.getBoundingClientRect()
    const start = { x: o.left + Math.min(o.width / 3, 120), y: Math.min(Math.max(o.top + o.height / 2, 40), innerHeight - 40) }
    const n = komad('kuvaj-namirnica', start.x, start.y, ime)
    const odlazak = i * RAZMAK
    n.animate([{ transform: `${tu} scale(0.5)`, opacity: 0 }, { transform: `${tu} scale(1.15)`, opacity: 1 }],
      { duration: 180, delay: odlazak, fill: 'backwards' })
    return pusti(n, luk(kapa.x - start.x, kapa.y - start.y, i % 2 ? 60 : -60), {
      duration: LET, delay: odlazak + 180, easing: 'cubic-bezier(0.45, 0, 0.8, 0.6)', fill: 'forwards',
    }).then(() => {
      varnice(kapa.x, kapa.y)
      mis.animate([{ transform: 'none' }, { transform: 'translateY(-10px) scale(1.06, 0.94)' }, { transform: 'none' }], { duration: 280, easing: 'ease-out' })
    })
  })
  return Promise.allSettled(sletanja).then(() => {})
}
