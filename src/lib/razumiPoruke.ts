// Poruke za korisnika kad "Reci mišu šta si jeo" ne uspe (čista logika, bez mreže, ima test).
// Kod greške šalje funkcija razumi-obrok u telu odgovora (docs/api.md); `mreza` = funkcija uopšte nije odgovorila.
// Svaka poruka ima osnovu i savet o ručnom unosu; u Laboratoriji nema ručnog unosa ni sačuvanih jela, pa tamo ide samo osnova.
const PORUKE: Record<string, [osnova: string, savet: string]> = {
  prijava: ['Prijava je istekla. Prijavi se ponovo.', ''],
  tekst: ['Napiši šta si jeo, najviše 500 znakova.', ''],
  limit: ['Za danas sam pročitao dovoljno poruka.', 'Unesi ručno ili izaberi svoje jelo.'],
  ai_limit: ['AI je trenutno zauzet. Probaj za minut.', 'Ili izaberi svoje jelo ili unesi ručno.'],
  ai: ['AI trenutno ne radi kako treba.', 'Izaberi svoje jelo ili unesi ručno.'],
  server: ['Greška na našoj strani. Probaj ponovo.', 'Ili unesi ručno.'],
  mreza: ['Ne mogu sad da pročitam. Proveri internet.', 'Ili unesi ručno.'],
}

// kod: `greska` iz odgovora funkcije; '' = nema odgovora (mreža). Odgovor sa nepoznatim kodom je greška na našoj strani.
export function porukaZaGresku(kod: string | null, imaOdgovor: boolean, rucno = true): string {
  // hasOwn, ne `in`: kod dolazi iz tela odgovora, a `in` propušta i nasleđene ključeve ('constructor', '__proto__')
  const k = !imaOdgovor ? 'mreza' : kod && Object.hasOwn(PORUKE, kod) ? kod : 'server'
  const [osnova, savet] = PORUKE[k]
  return rucno && savet ? `${osnova} ${savet}` : osnova
}
