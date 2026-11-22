// Pokretanje: node src/lib/uputstvo.test.ts
import assert from 'node:assert/strict'
import { kljucUputstva, trebaDaSePrikaze, zapamtiUputstvo, type Skladiste } from './uputstvo.ts'

const lazno = (): Skladiste & { podaci: Map<string, string> } => {
  const podaci = new Map<string, string>()
  return { podaci, getItem: (k) => podaci.get(k) ?? null, setItem: (k, v) => void podaci.set(k, v) }
}

// prvi ulazak: ključa nema, prikaži; posle upisa ne prikazuj
const s = lazno()
assert.equal(trebaDaSePrikaze('a', s), true)
zapamtiUputstvo('a', s)
assert.equal(s.podaci.get(kljucUputstva('a')), '1')
assert.equal(trebaDaSePrikaze('a', s), false)

// drugi nalog u istom browseru vidi svoje uputstvo
assert.equal(trebaDaSePrikaze('b', s), true)

// blokiran ili pokvaren storage: nikad ne prikazuj samo od sebe, i ne ruši app
assert.equal(trebaDaSePrikaze('a', null), false)
const pokvaren: Skladiste = { getItem: () => { throw new Error('blokiran') }, setItem: () => { throw new Error('blokiran') } }
assert.equal(trebaDaSePrikaze('a', pokvaren), false)
assert.doesNotThrow(() => zapamtiUputstvo('a', pokvaren))
assert.doesNotThrow(() => zapamtiUputstvo('a', null))

console.log('uputstvo: ok')
