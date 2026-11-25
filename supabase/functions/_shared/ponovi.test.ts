// Pokretanje: node supabase/functions/_shared/ponovi.test.ts
import assert from 'node:assert/strict'
import { BUDZET_MS, MODELI_PODRAZUMEVANO, izborModela, pozoviSaPonavljanjem, type Zavisnosti } from './ponovi.ts'

// Lažan časovnik: spavaj pomera sat, pa test ne čeka stvarno. kasnjenje = koliko traje jedan poziv.
function lazno(odgovori: (model: string, poziv: number) => number | 'greska', kasnjenje = 300) {
  let vreme = 0
  const pozivi: { model: string; vreme: number }[] = []
  const spavanja: number[] = []
  const z: Zavisnosti = {
    pozovi: async (model) => {
      pozivi.push({ model, vreme })
      vreme += kasnjenje
      const s = odgovori(model, pozivi.length)
      if (s === 'greska') throw new Error('mreža')
      return new Response(s === 200 ? '{}' : 'greska', { status: s })
    },
    sada: () => vreme,
    spavaj: async (ms) => { spavanja.push(ms); vreme += ms },
    nasumicno: () => 0,
    log: () => {},
  }
  return { z, pozivi, spavanja, vreme: () => vreme }
}
const M = ['a', 'b', 'c']

// (a) uspeh na prvom pokušaju
{
  const t = lazno(() => 200)
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.ok(i.ok && i.model === 'a')
  assert.equal(t.pozivi.length, 1)
  assert.equal(t.spavanja.length, 0)
}

// (b) svi modeli 503 u prvom krugu, pa uspeh u drugom: jedna pauza od 1 s
{
  const t = lazno((_, n) => (n <= 3 ? 503 : 200))
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.ok(i.ok && i.model === 'a')
  assert.equal(t.pozivi.length, 4)
  assert.deepEqual(t.spavanja, [1000])
}

// rezervni model u istom krugu: prvi 503, drugi radi, bez pauze
{
  const t = lazno((m) => (m === 'a' ? 503 : 200))
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.ok(i.ok && i.model === 'b')
  assert.equal(t.spavanja.length, 0)
}

// (c) uvek 503: ai_limit, 3 kruga sa pauzama 1 s i 2 s, i ne prelazi rok
{
  const t = lazno(() => 503, 100)
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.deepEqual(i, { ok: false, kod: 'ai_limit' })
  assert.deepEqual(t.spavanja, [1000, 2000])
  assert.equal(t.pozivi.length, 9)
  assert.ok(t.vreme() <= BUDZET_MS, `potrošeno ${t.vreme()} ms`)
}
// spori pozivi (3 s po pozivu): budžet se prekida pre svih krugova i nijedan poziv ne počinje posle roka
{
  const t = lazno(() => 503, 3000)
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.deepEqual(i, { ok: false, kod: 'ai_limit' })
  assert.ok(t.pozivi.every((p) => p.vreme < BUDZET_MS), 'nijedan poziv ne počinje posle roka')
  assert.ok(t.pozivi.length < 9)
}
// pauza koja ne staje u rok se ne čeka
{
  const t = lazno(() => 503, 4500)
  await pozoviSaPonavljanjem(['a', 'b'], t.z)
  assert.deepEqual(t.spavanja, [], 'posle dva spora poziva nema vremena ni za pauzu')
}

// (d) 400/401/403 prekidaju odmah, bez ponavljanja i bez drugog modela
for (const status of [400, 401, 403]) {
  const t = lazno(() => status)
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.deepEqual(i, { ok: false, kod: 'ai' })
  assert.equal(t.pozivi.length, 1)
  assert.equal(t.spavanja.length, 0)
}

// (e) 404: model se preskače bez pauze i ne zove se ponovo; ostali rade
{
  const t = lazno((m) => (m === 'a' ? 404 : 503), 100)
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.deepEqual(i, { ok: false, kod: 'ai_limit' })
  assert.ok(t.pozivi.filter((p) => p.model === 'a').length === 1, '404 model se zove samo jednom')
  const t2 = lazno((m) => (m === 'a' ? 404 : 200))
  const i2 = await pozoviSaPonavljanjem(M, t2.z)
  assert.ok(i2.ok && i2.model === 'b')
  assert.equal(t2.spavanja.length, 0)
}
// svi modeli 404: ai (ne ai_limit), bez pauze
{
  const t = lazno(() => 404)
  assert.deepEqual(await pozoviSaPonavljanjem(M, t.z), { ok: false, kod: 'ai' })
  assert.equal(t.spavanja.length, 0)
}

// (f) 429 se ponavlja kao 503
{
  const t = lazno((_, n) => (n <= 3 ? 429 : 200))
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.ok(i.ok)
  assert.deepEqual(t.spavanja, [1000])
}

// mrežna greška ili istek poziva se ponavlja; samo greške bez ijednog 503 na kraju ipak znače "zauzet"
{
  const t = lazno((_, n) => (n === 1 ? 'greska' : 200))
  const i = await pozoviSaPonavljanjem(M, t.z)
  assert.ok(i.ok && i.model === 'b')
  const t2 = lazno(() => 'greska', 100)
  assert.deepEqual(await pozoviSaPonavljanjem(M, t2.z), { ok: false, kod: 'ai_limit' })
}

// jitter produžava pauzu, najviše do 300 ms
{
  const t = lazno(() => 503, 100)
  t.z.nasumicno = () => 0.99
  await pozoviSaPonavljanjem(M, t.z)
  assert.deepEqual(t.spavanja, [1000 + 297, 2000 + 297])
}

// spisak modela: podrazumevani, GEMINI_MODELI, stari GEMINI_MODEL na prvom mestu bez duplikata
assert.deepEqual(izborModela(undefined, undefined), MODELI_PODRAZUMEVANO)
assert.deepEqual(izborModela(' x , y ,,z ', 'ignorisan'), ['x', 'y', 'z'])
assert.deepEqual(izborModela('', 'moj-model'), ['moj-model', ...MODELI_PODRAZUMEVANO])
assert.deepEqual(izborModela(undefined, MODELI_PODRAZUMEVANO[1]), [MODELI_PODRAZUMEVANO[1], MODELI_PODRAZUMEVANO[0], MODELI_PODRAZUMEVANO[2]])

console.log('ponovi: ok')
