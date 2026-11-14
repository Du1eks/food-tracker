// Rang među prijateljima i poza maskote. Čista logika, bez baze (docs/api.md: rang računa app).
export type Zbir = {
  id: string; nadimak: string | null; kcal: number; proteini: number; uh: number; masti: number; procenat: number
  // false = nema dnevni cilj kcal (profil nije popunjen), pa procenat ne znači ništa
  ima_cilj: boolean
}

export type Poza = 'jede' | 'hoda' | 'slavi' | 'cilj'

export type Rang = { mesto: number; ukupno: number; poza: Poza }

// U rangu se računa samo ko ima dnevni cilj i uneo je kalorije. Ostali su uvek poslednji,
// ma koliko mali bio tuđi procenat: bez unosa (0%) ili bez podataka u profilu ("nisu uneti podaci").
const uneo = (r: Zbir) => r.ima_cilj && r.kcal > 0
const ispred = (a: Zbir, b: Zbir) => (uneo(a) && !uneo(b)) || (uneo(a) === uneo(b) && a.procenat > b.procenat)

// Mesto = 1 + broj onih ispred (izjednačeni dele mesto); ko se ne računa ima poslednje mesto
export const mesto = (redovi: Zbir[], r: Zbir) =>
  uneo(r) ? 1 + redovi.filter((x) => ispred(x, r)).length : redovi.length

// Prvi: srećan (jede, a slavi kad je dostigao cilj); poslednji ili van ranga: ljut; ostali i samac: hoda.
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

// Šta miš kod leaderboarda nasumično kaže: par rečenica iz mog mesta i procenta, plus opšte.
export function staKaze(r: Rang, ja: Zbir): string[] {
  const opste = [
    'Nemoj da si miš!', 'Protein je moj omiljeni broj.', 'Voda se ne računa, ali pij je.', 'Ja bih nešto prigrizao…',
    'Sir je takođe protein. Samo kažem.', 'Ja ne brojim kalorije, ja ih mirišem.', 'Jedan keks nikad nije samo jedan keks.',
    'Mišić se ne gradi na praznom stomaku.', 'Danas je dobar dan za proteine.', 'Teg nije težak. Težak je neunet obrok.',
  ]
  if (r.ukupno === 1) return [...opste, 'Dodaj drugare, da imamo s kim da se takmičimo.', 'Sam si na vrhu. I na dnu. Dodaj drugare!']
  if (!ja.ima_cilj) return [...opste, 'Popuni profil, pa da vidimo gde si.', 'Bez cilja nema ni ranga. Popuni profil!']
  if (!uneo(ja)) return [...opste, 'Prazan stomak, poslednje mesto. Napiši šta si jeo!', 'You are mouse… i to gladan. Napiši obrok!']
  const p = Math.round(ja.procenat * 100)
  const mesto = r.mesto === 1
    ? (ja.procenat >= 1
      ? ['Cilj pogođen. Mljac!', 'Prvi i sit. Tako se radi.', 'Mišić ti klima glavom.']
      : ['Vodiš! Ne opuštaj se.', `Prvi si sa ${p}%. Drži tempo.`, 'Ne gledaj iza sebe. Gledaj u tanjir.'])
    : [`${r.mesto}. mesto. Hajde, prestigni ih!`, `Imaš ${p}% cilja. Još malo pa gore.`, 'Prijatelji jedu. Ti si na potezu.']
  // poslednji (poza cilj): slika sa natpisom je izbačena, pa to kaže oblačić
  const poslednji = r.poza === 'cilj' ? ['You are mouse!', 'Ti si miš. Ti, ne ja.', 'Poslednje mesto traži užinu.'] : []
  return [...opste, ...mesto, ...poslednji]
}

// Engleska oznaka mesta: 1st, 2nd, 3rd, 4th…, ali 11th, 12th, 13th
export function sufiksMesta(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th'
  return ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'
}

// Najbolji prvi, na kraju bez unosa, pa bez podataka; izjednačeni po nadimku, da redosled ne skače pri osvežavanju
export const poRangu = (redovi: Zbir[]) =>
  [...redovi].sort(
    (a, b) =>
      Number(uneo(b)) - Number(uneo(a)) ||
      Number(b.ima_cilj) - Number(a.ima_cilj) ||
      b.procenat - a.procenat ||
      (a.nadimak ?? '').localeCompare(b.nadimak ?? ''),
  )

// Natpis preko ekrana posle jakog unosa: 50 g proteina ili više, i obrok veći od 800 kcal. Bez imena se obraća sa "you".
export function pohvale(m: { kcal: number; proteini: number }, ime: string | null | undefined): string[] {
  const ko = ime?.trim()
  return [
    ...(m.proteini >= 50 ? [ko ? `Getting strong, ${ko}!` : 'Getting strong!'] : []),
    ...(m.kcal > 800 ? [ko ? `${ko} is not mouse!` : 'You are not mouse!'] : []),
  ]
}
