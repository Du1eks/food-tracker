// "Danas" je lokalni datum korisnika (ne UTC i ne server), kao string YYYY-MM-DD.
export function uIso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dan = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dan}`
}

export const danas = () => uIso(new Date())

export function izIso(iso: string): Date {
  const [g, m, d] = iso.split('-').map(Number)
  return new Date(g, m - 1, d)
}

export function pomeri(iso: string, dana: number): string {
  const d = izIso(iso)
  d.setDate(d.getDate() + dana)
  return uIso(d)
}

export const ispravan = (iso: string) => /^\d{4}-\d{2}-\d{2}$/.test(iso) && uIso(izIso(iso)) === iso

const naslov = new Intl.DateTimeFormat('sr-Latn', { weekday: 'long', day: 'numeric', month: 'long' })
export function lepDatum(iso: string): string {
  const s = naslov.format(izIso(iso))
  return s.charAt(0).toUpperCase() + s.slice(1)
}
