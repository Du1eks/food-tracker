// Svi pozivi baze na jednom mestu (docs/api.md). RLS u bazi sam filtrira na ulogovanog korisnika.
import { supabase } from './supabase'
import type { Makrosi, Proizvod, Unos } from './ishrana'
import type { Zbir } from './rang'

export type Profil = {
  id: string
  nadimak: string | null
  ime: string | null
  pol: 'm' | 'z' | null
  datum_rodjenja: string | null
  visina_cm: number | null
  tezina_kg: number | null
  treninga_nedeljno: number | null
  koraka_dnevno: number | null
  cilj: 'smrsati' | 'odrzavati' | 'bulk' | null
  ciljna_tezina_kg: number | null
  cilj_kcal: number | null
  cilj_proteini: number | null
  cilj_uh: number | null
  cilj_masti: number | null
}

// Bez greške Supabase uvek vraća podatke (osim maybeSingle, gde null znači "nema reda").
function proveri<T>(r: { data: T | null; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message)
  return r.data as T
}

export async function unosiZaDan(datum: string): Promise<Unos[]> {
  return proveri(await supabase.from('unos').select('*').eq('datum', datum).order('kreirano'))
}

export async function dodajUnos(u: Omit<Unos, 'id'>) {
  proveri(await supabase.from('unos').insert(u))
}

export async function izmeniUnos(id: string, izmena: Makrosi & { kolicina: number }) {
  proveri(await supabase.from('unos').update(izmena).eq('id', id))
}

export async function obrisiUnos(id: string) {
  proveri(await supabase.from('unos').delete().eq('id', id))
}

// % i _ su džokeri u ilike; korisnikov tekst ih ne sme menjati
const sadrzi = (upit: string) => `%${upit.replace(/[%_\\]/g, (z) => `\\${z}`)}%`

export async function pretraziProizvode(upit: string): Promise<Proizvod[]> {
  return proveri(
    await supabase.from('proizvod').select('id,ime,brend,jedinica,kcal,proteini,uh,masti').ilike('ime', sadrzi(upit)).order('ime').limit(10),
  )
}

// Strana Namirnice: spisak zajedničke baze, prvih `koliko` redova (prazan upit = sve)
export type ProizvodRed = Proizvod & { id: string; ko_je_uneo: string | null }

export async function spisakProizvoda(upit: string, koliko: number): Promise<{ redovi: ProizvodRed[]; ukupno: number }> {
  let q = supabase.from('proizvod').select('id,ime,brend,jedinica,kcal,proteini,uh,masti,ko_je_uneo', { count: 'exact' })
  if (upit.trim()) q = q.ilike('ime', sadrzi(upit.trim()))
  const r = await q.order('ime').range(0, koliko - 1)
  return { redovi: proveri<ProizvodRed[]>(r), ukupno: r.count ?? 0 }
}

// Svi ulogovani smeju da menjaju proizvod (RLS), baza pamti ko je poslednji; jedinica se ne menja
export async function izmeniProizvod(id: string, izmena: Makrosi & { ime: string }) {
  proveri(await supabase.from('proizvod').update(izmena).eq('id', id))
}

// Briše samo autor (RLS); stari unosi ostaju jer čuvaju kopiju vrednosti
export async function obrisiProizvod(id: string) {
  proveri(await supabase.from('proizvod').delete().eq('id', id))
}

export async function dodajProizvod(p: Proizvod): Promise<Proizvod> {
  const { ime, brend, jedinica, kcal, proteini, uh, masti } = p
  return proveri(await supabase.from('proizvod').insert({ ime, brend, jedinica, kcal, proteini, uh, masti }).select().single())
}

export async function ucitajProfil(): Promise<Profil | null> {
  return proveri<Profil | null>(await supabase.from('profil').select('*').maybeSingle())
}

export async function sacuvajProfil(p: Profil) {
  const { id, ...izmena } = p
  proveri(await supabase.from('profil').update(izmena).eq('id', id))
}

// Prijatelji (docs/api.md). profil je privatan, pa nadimke i tuđe zbirove izdaju funkcije u bazi.
export type Zahtev = {
  drugi_id: string
  drugi_nadimak: string | null
  status: 'na_cekanju' | 'prihvaceno'
  poslao_sam: boolean
  kreirano: string
}

// Isto ograničenje kao CHECK na profil.nadimak
export const NADIMAK_PORUKA = 'Nadimak mora imati od 3 do 20 znakova.'
export const nadimakIspravan = (s: string) => s.trim().length >= 3 && s.trim().length <= 20

export async function nadimakSlobodan(trazeni: string): Promise<boolean> {
  return proveri(await supabase.rpc('nadimak_slobodan', { trazeni }))
}

export async function nadjiPoNadimku(trazeni: string): Promise<{ id: string; nadimak: string } | null> {
  const redovi = proveri<{ id: string; nadimak: string }[]>(await supabase.rpc('nadji_po_nadimku', { trazeni }))
  return redovi[0] ?? null
}

export async function mojiZahtevi(): Promise<Zahtev[]> {
  return proveri(await supabase.rpc('moji_zahtevi'))
}

export async function posaljiZahtev(kome: string) {
  proveri(await supabase.from('prijateljstvo').insert({ ko_prima: kome }))
}

// RLS dozvoljava prihvatanje samo primaocu i brisanje samo redova u kojima sam i ja,
// pa je filter po drugoj strani dovoljan.
export async function prihvatiZahtev(odKoga: string) {
  proveri(await supabase.from('prijateljstvo').update({ status: 'prihvaceno' }).eq('ko_salje', odKoga))
}

// Odbij / povuci zahtev / ukloni prijatelja
export async function ukloniPrijateljstvo(drugi: string) {
  proveri(await supabase.from('prijateljstvo').delete().or(`ko_salje.eq.${drugi},ko_prima.eq.${drugi}`))
}

// Ja + prihvaćeni prijatelji, zbir za dan (nikad sirovi unosi)
export async function zbirZaDan(datum: string): Promise<Zbir[]> {
  const redovi = proveri<Zbir[]>(await supabase.rpc('dnevni_zbir_prijatelja', { d: datum }))
  return redovi.map((r) => ({
    ...r, kcal: Number(r.kcal), proteini: Number(r.proteini), uh: Number(r.uh), masti: Number(r.masti), procenat: Number(r.procenat),
    // stara verzija funkcije (pre migracije ima_cilj) ne šalje polje; tad nikoga ne precrtavamo
    ima_cilj: r.ima_cilj ?? true,
  }))
}

// Kalendar: zbir kcal po danu za opseg datuma
export async function kcalPoDanima(od: string, doDatuma: string): Promise<Map<string, number>> {
  const redovi = proveri<{ datum: string; kcal: number }[]>(
    await supabase.from('unos').select('datum,kcal').gte('datum', od).lte('datum', doDatuma),
  )
  const m = new Map<string, number>()
  for (const r of redovi) m.set(r.datum, (m.get(r.datum) ?? 0) + Number(r.kcal))
  return m
}
