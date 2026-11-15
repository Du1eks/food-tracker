// Pokretanje: node src/lib/plamen.test.ts
import assert from 'node:assert/strict'
import { opisPlamena, plamen } from './plamen.ts'

const red = (procenat: number, ima_cilj = true, pogodio_proteine?: boolean) => ({ procenat, ima_cilj, pogodio_proteine })

// kalorije: tek na 100% (baza seče na 1), i samo uz dnevni cilj
assert.deepEqual(plamen(red(0.99)), { kalorije: false, proteini: false })
assert.deepEqual(plamen(red(1)), { kalorije: true, proteini: false })
assert.deepEqual(plamen(red(1, false)), { kalorije: false, proteini: false }) // bez cilja procenat ne znači ništa

// proteini: odlučuje baza; stara verzija funkcije ne šalje polje
assert.deepEqual(plamen(red(0.4, true, true)), { kalorije: false, proteini: true })
assert.deepEqual(plamen(red(0.4, true, false)), { kalorije: false, proteini: false })
assert.deepEqual(plamen(red(0.4, true, undefined)), { kalorije: false, proteini: false })
assert.deepEqual(plamen(red(0, false, true)), { kalorije: false, proteini: true }) // cilj proteina ne zavisi od cilja kalorija

// oba
assert.deepEqual(plamen(red(1, true, true)), { kalorije: true, proteini: true })

// tekst za čitač ekrana
assert.equal(opisPlamena({ kalorije: true, proteini: true }), 'pogođen cilj kalorija i proteina')
assert.equal(opisPlamena({ kalorije: true, proteini: false }), 'pogođen cilj kalorija')
assert.equal(opisPlamena({ kalorije: false, proteini: true }), 'pogođen cilj proteina')
assert.equal(opisPlamena({ kalorije: false, proteini: false }), '')

console.log('plamen: ok')
