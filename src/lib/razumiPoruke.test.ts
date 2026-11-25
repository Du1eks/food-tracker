// Pokretanje: node src/lib/razumiPoruke.test.ts
import assert from 'node:assert/strict'
import { porukaZaGresku } from './razumiPoruke.ts'

// poznati kodovi iz funkcije razumi-obrok
assert.equal(porukaZaGresku('limit', true), 'Za danas sam pročitao dovoljno poruka. Unesi ručno ili izaberi svoje jelo.')
assert.equal(porukaZaGresku('ai_limit', true), 'AI je trenutno zauzet. Probaj za minut. Ili izaberi svoje jelo ili unesi ručno.')
assert.equal(porukaZaGresku('ai', true), 'AI trenutno ne radi kako treba. Izaberi svoje jelo ili unesi ručno.')
assert.equal(porukaZaGresku('server', true), 'Greška na našoj strani. Probaj ponovo. Ili unesi ručno.')
assert.equal(porukaZaGresku('prijava', true), 'Prijava je istekla. Prijavi se ponovo.')
assert.equal(porukaZaGresku('tekst', true), 'Napiši šta si jeo, najviše 500 znakova.')

// "Proveri internet" samo kad funkcija uopšte nije odgovorila
assert.match(porukaZaGresku(null, false), /Proveri internet/)
assert.doesNotMatch(porukaZaGresku('server', true), /internet/)
// odgovor sa nepoznatim ili praznim kodom (npr. prolaz sa greškom, telo nije JSON) je greška na našoj strani, ne mreža
assert.equal(porukaZaGresku('nepoznato', true), porukaZaGresku('server', true))
assert.equal(porukaZaGresku('', true), porukaZaGresku('server', true))
assert.equal(porukaZaGresku(null, true), porukaZaGresku('server', true))

// u Laboratoriji (bez ručnog unosa) ostaje samo osnova, bez saveta o ručnom unosu i jelima
for (const kod of ['limit', 'ai_limit', 'ai', 'server']) assert.doesNotMatch(porukaZaGresku(kod, true, false), /ručno|jelo/)
assert.equal(porukaZaGresku('ai_limit', true, false), 'AI je trenutno zauzet. Probaj za minut.')

// nigde nema starog "preko +"
for (const kod of ['limit', 'ai_limit', 'ai', 'server', 'prijava', 'tekst']) assert.doesNotMatch(porukaZaGresku(kod, true), /\+/)

console.log('razumiPoruke: ok')
