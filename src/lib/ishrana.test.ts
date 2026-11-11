// Pokretanje: node src/lib/ishrana.test.ts
import assert from 'node:assert/strict'
import { zaKolicinu, poJedinici, skaliraj, zbir, obrokPoSatu, dnevniCilj, godineOd } from './ishrana.ts'

const sir = { kcal: 79, proteini: 13.3, uh: 4, masti: 1, jedinica: '100g' as const }
assert.deepEqual(zaKolicinu(sir, 150), { kcal: 119, proteini: 20, uh: 6, masti: 1.5 })

const tortilja = { kcal: 180, proteini: 5, uh: 30, masti: 4, jedinica: 'komad' as const }
assert.deepEqual(zaKolicinu(tortilja, 2), { kcal: 360, proteini: 10, uh: 60, masti: 8 })

assert.deepEqual(skaliraj({ kcal: 119, proteini: 20, uh: 6, masti: 1.5, kolicina: 150 }, 300), { kcal: 238, proteini: 40, uh: 12, masti: 3 })

// poJedinici vraća vrednosti proizvoda iz snapshot-a unosa (za "Sačuvaj u bazu")
assert.deepEqual(poJedinici({ kcal: 330, proteini: 21, uh: 3, masti: 24, kolicina: 3, jedinica: 'komad' }), { kcal: 110, proteini: 7, uh: 1, masti: 8 })
assert.deepEqual(poJedinici({ kcal: 119, proteini: 20, uh: 6, masti: 1.5, kolicina: 150, jedinica: '100g' }), { kcal: 79.3, proteini: 13.3, uh: 4, masti: 1 })

assert.deepEqual(zbir([]), { kcal: 0, proteini: 0, uh: 0, masti: 0 })
assert.deepEqual(zbir([{ kcal: 119, proteini: 20, uh: 6, masti: 1.5 }, { kcal: 180, proteini: 5, uh: 30, masti: 4 }]), { kcal: 299, proteini: 25, uh: 36, masti: 5.5 })

assert.equal(obrokPoSatu(8), 'dorucak')
assert.equal(obrokPoSatu(13), 'rucak')
assert.equal(obrokPoSatu(22), 'uzina')

// Primer profila iz PRODUCT.md: 177 cm, 73 kg, blagi bulk, 4–5 treninga, ~10 000 koraka → ~3200 kcal, P 130–160, M 70–90
const dule = dnevniCilj({ pol: 'm', godine: 26, visina_cm: 177, tezina_kg: 73, treninga_nedeljno: 4, koraka_dnevno: 10000, cilj: 'bulk' })
assert.ok(dule.kcal >= 3100 && dule.kcal <= 3300, `kcal ${dule.kcal}`)
assert.ok(dule.proteini >= 130 && dule.proteini <= 160)
assert.ok(dule.masti >= 70 && dule.masti <= 90)
assert.equal(dule.kcal % 50, 0)
assert.ok(dnevniCilj({ pol: 'z', godine: 30, visina_cm: 165, tezina_kg: 60, treninga_nedeljno: 0, koraka_dnevno: 3000, cilj: 'smrsati' }).kcal < 1600)

assert.equal(godineOd('2000-11-02', new Date(2026, 10, 2)), 26)
assert.equal(godineOd('2000-11-03', new Date(2026, 10, 2)), 25)

console.log('ishrana: svi testovi prošli')
