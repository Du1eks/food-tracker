// Čista logika ishrane, bez UI-a i bez Supabase-a, da se kasnije prenese u gym app.

export type Jedinica = '100g' | 'komad'
export type Obrok = 'dorucak' | 'rucak' | 'vecera' | 'uzina'

export type Makrosi = { kcal: number; proteini: number; uh: number; masti: number }

export type Proizvod = Makrosi & {
  id?: string
  ime: string
  brend?: string | null
  jedinica: Jedinica
}

export type Unos = Makrosi & {
  id: string
  datum: string
  obrok: Obrok
  kolicina: number
  jedinica: Jedinica
  ime: string
  proizvod_id: string | null
}

export const OBROCI: { id: Obrok; naziv: string }[] = [
  { id: 'dorucak', naziv: 'Doručak' },
  { id: 'rucak', naziv: 'Ručak' },
  { id: 'vecera', naziv: 'Večera' },
  { id: 'uzina', naziv: 'Užina' },
]

const zaokruzi = (n: number) => Math.round(n * 10) / 10

// Vrednosti proizvoda su na 100 g ili po komadu; snapshot unosa čuva već preračunate brojke.
export function zaKolicinu(p: Makrosi & { jedinica: Jedinica }, kolicina: number): Makrosi {
  const f = p.jedinica === '100g' ? kolicina / 100 : kolicina
  return {
    kcal: Math.round(p.kcal * f),
    proteini: zaokruzi(p.proteini * f),
    uh: zaokruzi(p.uh * f),
    masti: zaokruzi(p.masti * f),
  }
}

// Izmena količine postojećeg unosa: snapshot se skalira, proizvod možda više ne postoji.
export function skaliraj(u: Makrosi & { kolicina: number }, novaKolicina: number): Makrosi {
  return zaKolicinu({ ...u, jedinica: 'komad' }, novaKolicina / u.kolicina)
}

export function zbir(unosi: Makrosi[]): Makrosi {
  const z = unosi.reduce(
    (a, u) => ({ kcal: a.kcal + u.kcal, proteini: a.proteini + u.proteini, uh: a.uh + u.uh, masti: a.masti + u.masti }),
    { kcal: 0, proteini: 0, uh: 0, masti: 0 },
  )
  return { kcal: Math.round(z.kcal), proteini: zaokruzi(z.proteini), uh: zaokruzi(z.uh), masti: zaokruzi(z.masti) }
}

export function obrokPoSatu(sat: number): Obrok {
  if (sat < 11) return 'dorucak'
  if (sat < 16) return 'rucak'
  if (sat < 21) return 'vecera'
  return 'uzina'
}

export type Telo = {
  pol: 'm' | 'z'
  godine: number
  visina_cm: number
  tezina_kg: number
  treninga_nedeljno: number
  koraka_dnevno: number
  cilj: 'smrsati' | 'odrzavati' | 'bulk'
}

// Mifflin-St Jeor (BMR) × aktivnost, pa korekcija za cilj.
// shortcut: faktor aktivnosti je gruba procena iz koraka i treninga; ako cilj ne pogađa, korisnik ga ručno menja u profilu.
export function dnevniCilj(t: Telo): Makrosi {
  const bmr = 10 * t.tezina_kg + 6.25 * t.visina_cm - 5 * t.godine + (t.pol === 'm' ? 5 : -161)
  const koraci = t.koraka_dnevno < 5000 ? 1.2 : t.koraka_dnevno < 7500 ? 1.3 : t.koraka_dnevno < 10000 ? 1.4 : 1.5
  const faktor = koraci + 0.05 * Math.min(t.treninga_nedeljno, 7)
  const korekcija = { smrsati: -500, odrzavati: 0, bulk: 300 }[t.cilj]
  const kcal = Math.round((bmr * faktor + korekcija) / 50) * 50
  const proteini = Math.round(2 * t.tezina_kg)
  const masti = Math.round(1.1 * t.tezina_kg)
  const uh = Math.max(0, Math.round((kcal - proteini * 4 - masti * 9) / 4))
  return { kcal, proteini, uh, masti }
}

export function godineOd(datumRodjenja: string, danas = new Date()): number {
  const [g, m, d] = datumRodjenja.split('-').map(Number)
  const imaRodjendan = danas.getMonth() + 1 > m || (danas.getMonth() + 1 === m && danas.getDate() >= d)
  return danas.getFullYear() - g - (imaRodjendan ? 0 : 1)
}

const broj = new Intl.NumberFormat('sr-Latn', { maximumFractionDigits: 1 })
export const fmt = (n: number) => broj.format(n)
