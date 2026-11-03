// Rang među prijateljima i poza maskote. Čista logika, bez baze (docs/api.md: rang računa app).
export type Zbir = { id: string; nadimak: string | null; kcal: number; proteini: number; uh: number; masti: number; procenat: number }

export type Poza = 'jede' | 'hoda' | 'slavi' | 'cilj'

export type Rang = { mesto: number; ukupno: number; poza: Poza }

// Mesto = 1 + broj onih sa većim procentom (izjednačeni dele mesto)
export const mesto = (redovi: Zbir[], r: Zbir) => 1 + redovi.filter((x) => x.procenat > r.procenat).length

// Prvi: srećan (jede, a slavi kad je dostigao cilj); poslednji: ljut; ostali i samac: hoda.
export function rang(redovi: Zbir[], mojId: string): Rang | null {
  const ja = redovi.find((r) => r.id === mojId)
  if (!ja) return null
  const m = mesto(redovi, ja)
  const nize = redovi.filter((r) => r.procenat < ja.procenat).length
  const poza: Poza =
    redovi.length === 1 ? 'hoda' : m === 1 ? (ja.procenat >= 1 ? 'slavi' : 'jede') : nize === 0 ? 'cilj' : 'hoda'
  return { mesto: m, ukupno: redovi.length, poza }
}

// Najbolji prvi; izjednačeni po nadimku, da redosled ne skače pri osvežavanju
export const poRangu = (redovi: Zbir[]) =>
  [...redovi].sort((a, b) => b.procenat - a.procenat || (a.nadimak ?? '').localeCompare(b.nadimak ?? ''))
