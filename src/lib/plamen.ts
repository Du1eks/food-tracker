// Ko na rang listi "gori": pogođen cilj kalorija = veći narandžasti plamen, pogođen cilj proteina = manji plavi.
// Čista logika, bez baze; podatke daje dnevni_zbir_prijatelja (docs/api.md).
import type { Zbir } from './rang'

export type Plamen = { kalorije: boolean; proteini: boolean }

// Kalorije: isto pravilo kao poza "slavi" u rang.ts (procenat je udeo do 1, baza ga seče na 100%), i samo uz dnevni cilj.
// Proteine računa baza, jer app ne zna tuđi cilj proteina.
export const plamen = (r: Pick<Zbir, 'ima_cilj' | 'procenat' | 'pogodio_proteine'>): Plamen => ({
  kalorije: r.ima_cilj && r.procenat >= 1,
  proteini: r.pogodio_proteine === true,
})

// Plamen je ukras; čitač ekrana dobija ovaj tekst. Prazno kad niko ne gori.
export function opisPlamena(p: Plamen): string {
  if (p.kalorije && p.proteini) return 'pogođen cilj kalorija i proteina'
  if (p.kalorije) return 'pogođen cilj kalorija'
  if (p.proteini) return 'pogođen cilj proteina'
  return ''
}
