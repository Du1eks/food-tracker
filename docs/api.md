# API (Korak 4)

Supabase automatski pravi REST API iz tabela; app ga zove preko `supabase-js`.
Nigde ne šaljemo `korisnik_id = ja` za čitanje: RLS u bazi sam filtrira redove.

## Nalog (Supabase Auth)
| Akcija | supabase-js |
|---|---|
| Registracija (sa nadimkom) | `auth.signUp({ email, password, options: { data: { nadimak } } })` |
| Login | `auth.signInWithPassword({ email, password })` |
| Odjava | `auth.signOut()` |
| Reset lozinke (email link) | `auth.resetPasswordForEmail(email)` |

## Profil
| Akcija | CRUD | HTTP | supabase-js |
|---|---|---|---|
| Učitaj profil | Read | GET | `from('profil').select().single()` |
| Sačuvaj profil i cilj | Update | PATCH | `from('profil').update({...}).eq('id', userId)` |

## Proizvod (zajednički)
| Akcija | CRUD | HTTP | supabase-js |
|---|---|---|---|
| Pretraga po imenu | Read | GET | `from('proizvod').select().ilike('ime', '%pile%')` |
| Dodaj proizvod | Create | POST | `from('proizvod').insert({...})` |
| Izmeni proizvod | Update | PATCH | `from('proizvod').update({...}).eq('id', id)` |
| Obriši proizvod (samo vlasnik) | Delete | DELETE | `from('proizvod').delete().eq('id', id)` |
| Spisak za stranu Namirnice (prvih N, sa brojem) | Read | GET | `from('proizvod').select('...', { count: 'exact' }).order('ime').range(0, N - 1)` |

Ako proizvoda nema u našoj bazi: pretraga na Open Food Facts (direktan `fetch`, bez ključa), korisnik potvrdi vrednosti, pa `insert` u `proizvod`.

## Unos (privatan)
| Akcija | CRUD | HTTP | supabase-js |
|---|---|---|---|
| Unosi za dan | Read | GET | `from('unos').select().eq('datum', datum)` |
| Dani sa unosima u mesecu (kalendar) | Read | GET | `from('unos').select('datum').gte('datum', od).lte('datum', do)` |
| Dodaj unos (sa snapshot vrednostima) | Create | POST | `from('unos').insert({...})` |
| Izmeni unos | Update | PATCH | `from('unos').update({...}).eq('id', id)` |
| Obriši unos | Delete | DELETE | `from('unos').delete().eq('id', id)` |

## Prijatelji
Tabele idu kroz `from(...)`, a funkcije koje izdaju samo deo podataka kroz **RPC**: `supabase.rpc('ime', { argument })` (HTTP POST na funkciju u bazi). Funkcije su `security definer`, pa mogu da čitaju ono što RLS korisniku zabranjuje, ali vraćaju samo dozvoljene kolone.

| Akcija | CRUD / RPC | supabase-js |
|---|---|---|
| Nadimak slobodan? (pre registracije, bez logina) | RPC | `rpc('nadimak_slobodan', { trazeni })` → `true/false` |
| Nađi korisnika po nadimku | RPC | `rpc('nadji_po_nadimku', { trazeni })` → niz od 0 ili 1 reda `{ id, nadimak }` |
| Pošalji zahtev | Create | `from('prijateljstvo').insert({ ko_prima: id })` (`ko_salje` i `status` popunjava baza) |
| Zahtevi i prijatelji (sa nadimcima) | RPC | `rpc('moji_zahtevi')` → `{ drugi_id, drugi_nadimak, status, poslao_sam, kreirano }`; dolazni zahtevi su `status = 'na_cekanju' && !poslao_sam` |
| Prihvati zahtev | Update | `from('prijateljstvo').update({ status: 'prihvaceno' }).eq('ko_salje', drugiId)` (RLS: sme samo primalac) |
| Odbij zahtev / povuci zahtev / ukloni prijatelja | Delete | `from('prijateljstvo').delete().or('ko_salje.eq.B,ko_prima.eq.B')` (B = drugi; RLS ostavlja samo redove u kojima sam i ja) |
| Rang lista i brojke za danas | RPC | `rpc('dnevni_zbir_prijatelja', { d: danas() })` |
| Deli li prijatelj unose? | RPC | `rpc('prijatelj_deli_unose', { prijatelj })` → `true/false` (isto `false` za tuđina) |
| Unosi prijatelja za dan | RPC | `rpc('unosi_prijatelja', { prijatelj, d })` → niz `{ ime, obrok, kolicina, jedinica, kcal, proteini, uh, masti }`; prazan ako nije prijatelj ili ne deli |
| Uključi/isključi deljenje svojih unosa | Update | `from('profil').update({ deli_unose }).eq('id', userId)` |
| Stari nalog postavlja nadimak | Update | `from('profil').update({ nadimak }).eq('id', userId)` |

- **Zašto `moji_zahtevi`:** `profil` je privatan, pa app ne može da spoji `prijateljstvo` sa nadimkom; bez funkcije bi video samo uuid.
- **Unosi prijatelja:** Tabela `unos` ostaje zatvorena; red po red ih izdaje funkcija, i to samo uz prihvaćeno prijateljstvo i `deli_unose = true` (opt-in, podrazumevano isključeno). Zašto dve funkcije: `unosi_prijatelja` vraća prazan niz i kad prijatelj ne deli i kad danas nije jeo ništa, pa app pita `prijatelj_deli_unose` da napiše tačnu poruku.
- **Rang:** računa app. Sortira niz iz `dnevni_zbir_prijatelja` po `procenat` opadajuće; moje mesto je `1 + broj onih sa većim procentom` (izjednačeni dele mesto).
- **Datum:** šalje app (lokalni datum korisnika, kao i za unose), ne server.
- **Greške:** zauzet nadimak je Postgres kod `23505`, nadimak van 3–20 znakova je `23514`; duplikat para u prijateljstvu je takođe `23505`.

## Unos tekstom (AI)
Jedina akcija koja ne ide pravo u bazu, nego kroz **Edge Function** (mali program na Supabase serveru): `supabase.functions.invoke('razumi-obrok', { body: { tekst } })`. Razlog: AI ključ ne sme da bude u app-u.

| Korak | Gde | Šta |
|---|---|---|
| 1 | app | šalje `{ tekst }` (do 500 znakova) i token korisnika |
| 2 | funkcija | proverava token, tekst i dnevni limit (`rpc('potrosi_ai_poziv')`, 40 poziva po korisniku) |
| 3 | funkcija | čita zajedničke proizvode, zove Gemini (ključ je Supabase secret `GEMINI_API_KEY`) |
| 4 | funkcija | proverava odgovor AI-ja i vraća `{ stavke: [{ ime, kolicina, jedinica, obrok, izvor, proizvod_id, kcal, proteini, uh, masti }] }` |
| 5 | app | pregled, pa `from('unos').insert([...])` (svi redovi u jednom zahtevu) |

- **`izvor`:** `baza` = vrednosti našeg proizvoda, `procena` = procena AI-ja. Korisnik u pregledu može da ispravi vrednosti procene. Procena se upisuje samo u dnevnik (`proizvod_id` = null); u tabeli dana može da joj ispravi vrednosti (na 100 g / po komadu) i dugmetom "U bazu" je pošalje u zajedničku bazu (`from('proizvod').insert`, pa `from('unos').update({ proizvod_id })`), pa je sledeći put "iz baze".
- **`obrok`:** `null` kad ga korisnik nije naveo; app tada pita pre upisa.
- **Greške:** `{ greska }` sa kodom: `prijava` (401), `tekst` (400), `limit` (429), `ai_limit` (503), `ai` (502/503), `server` (500).
- Logika provere je u `supabase/functions/_shared/obrok.ts` (testovi: `npm test`).

## Odluke
- **Dnevni zbir** računa frontend iz liste unosa za dan (lista je ionako potrebna za tabelu; baza je jedini izvor istine).
- **Nedeljni/mesečni prosek** (kasnije) računa baza (`sum`/`avg` ili view), da se ne vuku stotine redova.
