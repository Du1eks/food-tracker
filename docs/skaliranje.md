# Skaliranje i održavanje (Korak 6)

## Rast podataka
| | 50 korisnika | 50 000 korisnika |
|---|---|---|
| unosa dnevno (×10) | 500 | 500 000 |
| unosa godišnje | ~180 000 | ~180 miliona |
| veličina (~200 B/red) | ~36 MB | ~36 GB |

Odlazak u bazu nije problem; problem je koliko redova baza mora da pregleda.

## Skaliranje
- **Indeksi**: `create index on unos (korisnik_id, datum);` — "unosi za dan" ostaje < 1 s i na milionima redova. Pretraga po delu imena (`ilike '%pile%'`) traži `pg_trgm` indeks.
- **Keš na frontendu**: učitani podaci ostaju u memoriji (npr. TanStack Query); ponovo se čitaju tek posle izmene.
- **Teški zbirovi u bazi**: nedeljni/mesečni proseci se računaju u bazi, ne povlačenjem svih redova.
- **Limiti besplatnog plana**: Supabase free ~500 MB; za 50 korisnika godinama dovoljno, za 50 000 dani. Na tom nivou skaliranje je i odluka o novcu.
- **Open Food Facts iz browsera**: svaki korisnik troši svoj limit, ne zajednički.

## Održavanje: migracije
- Svaka promena baze je SQL fajl u `supabase/migrations/`, u git-u, nikad klik u dashboard-u.
- Fajlovi se izvršavaju po redu, svaki jednom; baza u posebnoj tabeli pamti koji su pokrenuti.
- Ista istorija za lokalnu, test i pravu bazu.
- **Proširi pa skupi** (expand/contract): dodaj novo → prepiši podatke → nova verzija app-a → tek onda obriši staro. Nikad preimenovanje/brisanje u jednom koraku (stare desktop verzije).
- Nova kolona je `null` ili ima default.
- Pre puštanja: proba na lokalnoj/test bazi, backup, plan za vraćanje.
