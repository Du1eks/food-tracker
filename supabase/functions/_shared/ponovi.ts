// Poziv AI-ja sa rezervnim modelima, ponavljanjem sa pauzom i vremenskim budžetom (čista logika, bez Deno-a i prave mreže):
//   node supabase/functions/_shared/ponovi.test.ts
// Besplatni modeli često vrate 503 (preopterećenje) ili 429 (limit). Zato se svi modeli redom probaju više krugova, sa pauzom
// između krugova, ali ukupno najviše BUDZET_MS. Poziv je siguran za ponavljanje: samo čita tekst i ne menja ništa.

export const BUDZET_MS = 10_000
// pauze posle 1. i 2. kruga (3 kruga ukupno), plus nasumičnih do JITTER_MS da se zahtevi ne poklope
export const PAUZE_MS = [1000, 2000]
export const JITTER_MS = 300
// manje od ovoga ostalo do roka nema smisla započinjati poziv
const MIN_POZIV_MS = 1000

// Besplatni modeli sa Interactions endpoint-a i JSON šemom (docs: aistudio.google.com/docs/models, interactions-overview).
// Treći je iz Flash porodice (ne Flash-Lite); da li deli kapacitet sa prva dva nije potvrđeno.
export const MODELI_PODRAZUMEVANO = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.8-flash']

// GEMINI_MODELI="a,b,c" menja ceo spisak; stari GEMINI_MODEL (jedan model) ide na prvo mesto ispred podrazumevanih
export function izborModela(lista?: string, jedan?: string): string[] {
  const iz = (lista ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (iz.length) return iz
  return [...new Set([jedan?.trim() || MODELI_PODRAZUMEVANO[0], ...MODELI_PODRAZUMEVANO])]
}

export type Zavisnosti = {
  // jedan pokušaj za jedan model; signal prekida poziv kad istekne ostatak budžeta
  pozovi: (model: string, signal: AbortSignal) => Promise<Response>
  sada: () => number // ms
  spavaj: (ms: number) => Promise<void>
  nasumicno: () => number // [0, 1)
  log: (...args: unknown[]) => void
}

// ok: uspešan odgovor; ai_limit: svi zauzeti (503/429/istek) do isteka budžeta; ai: greška koja se ne popravlja ponavljanjem
export type Ishod = { ok: true; odgovor: Response; model: string } | { ok: false; kod: 'ai_limit' | 'ai' }

export async function pozoviSaPonavljanjem(modeli: string[], z: Zavisnosti, budzetMs = BUDZET_MS): Promise<Ishod> {
  const rok = z.sada() + budzetMs
  const nepostoji = new Set<string>() // 404: naziv modela ne postoji, preskače se do kraja zahteva
  let zauzet = false

  for (let krug = 0; krug <= PAUZE_MS.length; krug++) {
    for (const model of modeli) {
      if (nepostoji.has(model)) continue
      const preostalo = rok - z.sada()
      if (preostalo < MIN_POZIV_MS) return { ok: false, kod: zauzet ? 'ai_limit' : 'ai' }
      let r: Response
      try {
        r = await z.pozovi(model, AbortSignal.timeout(preostalo))
      } catch (e) { // istek roka ili prekid mreže: kao zauzet model
        zauzet = true
        z.log('AI greška', model, e instanceof Error ? e.message : e)
        continue
      }
      if (r.ok) return { ok: true, odgovor: r, model }
      const telo = await r.text().then((t) => t.slice(0, 500), () => '')
      z.log('AI status', model, r.status, telo)
      if (r.status === 503 || r.status === 429) { zauzet = true; continue }
      if (r.status === 404) { nepostoji.add(model); continue }
      return { ok: false, kod: 'ai' } // 400/401/403 i ostalo: ključ ili zahtev, ponavljanje ne pomaže
    }
    if (modeli.every((m) => nepostoji.has(m))) return { ok: false, kod: 'ai' } // svi modeli su 404: nema šta da se ponavlja
    if (krug === PAUZE_MS.length) break
    const pauza = PAUZE_MS[krug] + Math.floor(z.nasumicno() * JITTER_MS)
    if (z.sada() + pauza + MIN_POZIV_MS > rok) break // pauza i još jedan poziv ne staju u rok
    await z.spavaj(pauza)
  }
  return { ok: false, kod: zauzet ? 'ai_limit' : 'ai' }
}
