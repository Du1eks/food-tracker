// Konfete preko cele aplikacije kad se pređe cilj (pali ih početna, Dan.tsx). Tri talasa: prasak iz sredine i dva topa
// sa strana, pa još jednom topovi, pa kiša odozgo. Bez pokreta (prefers-reduced-motion) ništa.
export const KONFETE_TRAJU = 4200 // ms dok većina komada ne padne (ticks 320 pri 60 fps, poslednji talas kreće posle 1,6 s)

export async function konfete() {
  const { default: confetti } = await import('canvas-confetti')
  const zajedno = { disableForReducedMotion: true, zIndex: 40, ticks: 320, gravity: 0.85, scalar: 1.1 }
  const topovi = (broj: number) => {
    void confetti({ ...zajedno, particleCount: broj, angle: 60, spread: 60, startVelocity: 64, origin: { x: 0, y: 0.8 } })
    void confetti({ ...zajedno, particleCount: broj, angle: 120, spread: 60, startVelocity: 64, origin: { x: 1, y: 0.8 } })
  }
  void confetti({ ...zajedno, particleCount: 160, spread: 110, startVelocity: 50, origin: { x: 0.5, y: 0.6 } })
  topovi(100)
  setTimeout(() => topovi(80), 800)
  setTimeout(() => void confetti({ ...zajedno, particleCount: 140, spread: 160, startVelocity: 30, origin: { x: 0.5, y: 0.15 } }), 1600)
}
