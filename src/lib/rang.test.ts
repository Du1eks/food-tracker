// Pokretanje: node src/lib/rang.test.ts
import assert from 'node:assert/strict'
import { rang, poRangu, type Zbir } from './rang.ts'

const z = (id: string, procenat: number): Zbir => ({ id, nadimak: id, kcal: 0, proteini: 0, uh: 0, masti: 0, procenat })

// samac: nema sa kim da se poredi
assert.deepEqual(rang([z('a', 0.5)], 'a'), { mesto: 1, ukupno: 1, poza: 'hoda' })

const ekipa = [z('a', 0.9), z('b', 0.6), z('c', 0.2)]
assert.deepEqual(rang(ekipa, 'a'), { mesto: 1, ukupno: 3, poza: 'jede' })
assert.deepEqual(rang(ekipa, 'b'), { mesto: 2, ukupno: 3, poza: 'hoda' })
assert.deepEqual(rang(ekipa, 'c'), { mesto: 3, ukupno: 3, poza: 'cilj' })

// prvi sa dostignutim ciljem slavi
assert.equal(rang([z('a', 1), z('b', 0.4)], 'a')?.poza, 'slavi')

// izjednačeni dele mesto; svi izjednačeni su svi prvi (jutro, svi na 0)
assert.deepEqual(rang([z('a', 0), z('b', 0), z('c', 0)], 'b'), { mesto: 1, ukupno: 3, poza: 'jede' })
assert.equal(rang([z('a', 0.8), z('b', 0.8), z('c', 0.1)], 'b')?.mesto, 1)
assert.equal(rang([z('a', 0.8), z('b', 0.3), z('c', 0.3)], 'c')?.poza, 'cilj')

// nema me na listi
assert.equal(rang(ekipa, 'x'), null)

assert.deepEqual(poRangu([z('c', 0.2), z('a', 0.9), z('b', 0.9)]).map((r) => r.id), ['a', 'b', 'c'])
console.log('rang: ok')
