// Rang među prijateljima i poza maskote. Čista logika, bez baze (docs/api.md: rang računa app).
export type Zbir = { id: string; nadimak: string | null; kcal: number; proteini: number; uh: number; masti: number; procenat: number }

export type Poza = 'jede' | 'hoda' | 'slavi' | 'cilj'

export type Rang = { mesto: number; ukupno: number; poza: Poza }

// Ko nije uneo kalorije uvek je poslednji (sa 0%), ma koliko mali bio tuđi procenat
const uneo = (r: Zbir) => r.kcal > 0
const ispred = (a: Zbir, b: Zbir) => (uneo(a) && !uneo(b)) || (uneo(a) === uneo(b) && a.procenat > b.procenat)

// Mesto = 1 + broj onih ispred (izjednačeni dele mesto); bez unosa je poslednje mesto
export const mesto = (redovi: Zbir[], r: Zbir) =>
  uneo(r) ? 1 + redovi.filter((x) => ispred(x, r)).length : redovi.length

// Prvi: srećan (jede, a slavi kad je dostigao cilj); poslednji ili bez unosa: ljut; ostali i samac: hoda.
export function rang(redovi: Zbir[], mojId: string): Rang | null {
  const ja = redovi.find((r) => r.id === mojId)
  if (!ja) return null
  const m = mesto(redovi, ja)
  const nikoIspod = !redovi.some((r) => ispred(ja, r))
  const poza: Poza =
    redovi.length === 1 ? 'hoda'
    : !uneo(ja) ? 'cilj'
    : m === 1 ? (ja.procenat >= 1 ? 'slavi' : 'jede')
    : nikoIspod ? 'cilj'
    : 'hoda'
  return { mesto: m, ukupno: redovi.length, poza }
}

// Engleska oznaka mesta: 1st, 2nd, 3rd, 4th…, ali 11th, 12th, 13th
export function sufiksMesta(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th'
  return ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'
}

// Najbolji prvi, bez unosa na kraju; izjednačeni po nadimku, da redosled ne skače pri osvežavanju
export const poRangu = (redovi: Zbir[]) =>
  [...redovi].sort(
    (a, b) => Number(uneo(b)) - Number(uneo(a)) || b.procenat - a.procenat || (a.nadimak ?? '').localeCompare(b.nadimak ?? ''),
  )
