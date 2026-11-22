// Uputstvo pri prvom ulasku: čista logika "treba li ga prikazati" i pamćenje u localStorage (ne u bazi, bez migracije).
// Skladište se prosleđuje (u app-u localStorage, u testu lažno), a sve greške skladišta (privatni režim, blokiran
// localStorage, Tauri webview) se gutaju: bez pouzdanog čitanja uputstvo se NE prikazuje samo od sebe, da ne nervira pri svakom
// ulasku; dugme u Profilu ga i dalje otvara.
export type Skladiste = Pick<Storage, 'getItem' | 'setItem'>

// Ključ je vezan za korisnika, da dva naloga u istom browseru svaki vidi svoje
export const kljucUputstva = (idKorisnika: string) => `uputstvo-videno:${idKorisnika}`

export function lokalnoSkladiste(): Skladiste | null {
  try {
    return window.localStorage // i sam pristup baca grešku kad je storage blokiran
  } catch {
    return null
  }
}

export function trebaDaSePrikaze(idKorisnika: string, skladiste: Skladiste | null): boolean {
  if (!skladiste) return false
  try {
    return skladiste.getItem(kljucUputstva(idKorisnika)) === null
  } catch {
    return false
  }
}

export function zapamtiUputstvo(idKorisnika: string, skladiste: Skladiste | null) {
  try {
    skladiste?.setItem(kljucUputstva(idKorisnika), '1')
  } catch {
    // shortcut: bez upisa se ne pamti ništa; Okvir u istoj sesiji ne prikazuje ponovo, a pri sledećem učitavanju čitanje odlučuje
  }
}
