// Pokretanje: node src/lib/rang.test.ts
import assert from 'node:assert/strict'
import { rang, poRangu, sufiksMesta, type Zbir } from './rang.ts'

import { mesto } from './rang.ts'

// procenat 0 znači da nije uneo ništa (kcal 0); inače je kcal srazmeran cilju od 3200
const z = (id: string, procenat: number): Zbir => ({ id, nadimak: id, kcal: procenat * 3200, proteini: 0, uh: 0, masti: 0, procenat, ima_cilj: true })
// profil nije popunjen: nema dnevni cilj, pa je procenat 0 bez obzira na unos
const bez = (id: string, kcal = 0): Zbir => ({ ...z(id, 0), kcal, ima_cilj: false })

// samac: nema sa kim da se poredi
assert.deepEqual(rang([z('a', 0.5)], 'a'), { mesto: 1, ukupno: 1, poza: 'hoda' })
assert.deepEqual(rang([z('a', 0)], 'a'), { mesto: 1, ukupno: 1, poza: 'hoda' })

const ekipa = [z('a', 0.9), z('b', 0.6), z('c', 0.2)]
assert.deepEqual(rang(ekipa, 'a'), { mesto: 1, ukupno: 3, poza: 'jede' })
assert.deepEqual(rang(ekipa, 'b'), { mesto: 2, ukupno: 3, poza: 'hoda' })
assert.deepEqual(rang(ekipa, 'c'), { mesto: 3, ukupno: 3, poza: 'cilj' })

// prvi sa dostignutim ciljem slavi
assert.equal(rang([z('a', 1), z('b', 0.4)], 'a')?.poza, 'slavi')

// izjednačeni koji su uneli dele mesto
assert.equal(rang([z('a', 0.8), z('b', 0.8), z('c', 0.1)], 'b')?.mesto, 1)
assert.equal(rang([z('a', 0.8), z('b', 0.3), z('c', 0.3)], 'c')?.poza, 'cilj')

// bez unosa si uvek poslednji i ljut, sa 0%, čak i kad su ostali tek počeli
const jutro = [z('a', 0.02), z('b', 0), z('c', 0.01)]
assert.deepEqual(rang(jutro, 'b'), { mesto: 3, ukupno: 3, poza: 'cilj' })
assert.deepEqual(rang(jutro, 'a'), { mesto: 1, ukupno: 3, poza: 'jede' })
// najmanji procenat sa unosom nije poslednji dok neko nije uneo ništa
assert.deepEqual(rang(jutro, 'c'), { mesto: 2, ukupno: 3, poza: 'hoda' })

// svi bez unosa (jutro): svi su poslednji
const svi0 = [z('a', 0), z('b', 0), z('c', 0)]
assert.deepEqual(rang(svi0, 'b'), { mesto: 3, ukupno: 3, poza: 'cilj' })
assert.equal(mesto(svi0, svi0[0]), 3)

// više njih bez unosa dele poslednje mesto
assert.deepEqual(rang([z('a', 0.5), z('b', 0), z('c', 0)], 'c'), { mesto: 3, ukupno: 3, poza: 'cilj' })

// bez podataka u profilu: poslednji i ljut, čak i kad je nešto uneo
const nepopunjen = [z('a', 0.02), bez('b', 900), z('c', 0)]
assert.deepEqual(rang(nepopunjen, 'b'), { mesto: 3, ukupno: 3, poza: 'cilj' })
assert.deepEqual(rang(nepopunjen, 'a'), { mesto: 1, ukupno: 3, poza: 'jede' })
// ko ima cilj ali nije uneo ništa i dalje je ispred onoga bez podataka u tabeli
assert.deepEqual(poRangu(nepopunjen).map((r) => r.id), ['a', 'c', 'b'])
// samac bez podataka
assert.deepEqual(rang([bez('a')], 'a'), { mesto: 1, ukupno: 1, poza: 'hoda' })

// nema me na listi
assert.equal(rang(ekipa, 'x'), null)

// redosled: bez unosa na kraju, ostali po procentu, izjednačeni po nadimku
assert.deepEqual(poRangu([z('c', 0.2), z('d', 0), z('a', 0.9), z('b', 0.9)]).map((r) => r.id), ['a', 'b', 'c', 'd'])
assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111, 112].map((n) => n + sufiksMesta(n)),
  ['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '101st', '111th', '112th'])
console.log('rang: ok')
