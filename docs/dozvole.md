# Dozvole (Korak 5)

Autentifikacija (ko si) = Supabase Auth, JWT token. Autorizacija (šta smeš) = RLS pravila u bazi.
"Svi" uvek znači **ulogovani korisnici**; anonimni ne vide ništa.

## Pravila
| Tabela | Read | Insert | Update | Delete |
|---|---|---|---|---|
| `profil` | vlasnik | trigger pri registraciji | vlasnik | — (briše se sa nalogom, cascade) |
| `proizvod` | svi | svi | svi | samo `ko_je_uneo` |
| `unos` | vlasnik | vlasnik | vlasnik | vlasnik |

## Zamke i kako su zatvorene
- **Tuđi `korisnik_id` u unosu**: `with check (korisnik_id = auth.uid())` proverava red posle insert/update.
- **Prepisivanje `ko_je_uneo` na proizvodu**: RLS radi po redovima, ne kolonama, pa to rešava **trigger**:
  pri insertu upiše `ko_je_uneo = auth.uid()`, pri update-u zabrani promenu `ko_je_uneo` i upiše `izmenio = auth.uid()`, `izmenjeno = now()`.
- Pravilo: **kolone za dozvole i reviziju popunjava baza, ne klijent.**

## SQL (skica, piše se pri pravljenju Supabase projekta)
```sql
alter table profil   enable row level security;
alter table proizvod enable row level security;
alter table unos     enable row level security;

-- profil: samo vlasnik (insert radi trigger na auth.users)
create policy "profil citanje" on profil for select using (id = auth.uid());
create policy "profil izmena"  on profil for update using (id = auth.uid()) with check (id = auth.uid());

-- proizvod: svi ulogovani čitaju/dodaju/menjaju, briše vlasnik
create policy "proizvod citanje" on proizvod for select using (auth.uid() is not null);
create policy "proizvod dodaj"   on proizvod for insert with check (auth.uid() is not null);
create policy "proizvod izmena"  on proizvod for update using (auth.uid() is not null);
create policy "proizvod brisanje" on proizvod for delete using (ko_je_uneo = auth.uid());

-- unos: samo vlasnik, sve operacije
create policy "unos vlasnik" on unos for all
  using (korisnik_id = auth.uid())
  with check (korisnik_id = auth.uid());

-- proizvod: baza sama popunjava vlasnika i reviziju
create function proizvod_revizija() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    new.ko_je_uneo := auth.uid();
  else
    new.ko_je_uneo := old.ko_je_uneo;  -- ne može se prepisati
  end if;
  new.izmenio := auth.uid();
  new.izmenjeno := now();
  return new;
end $$;

create trigger proizvod_revizija before insert or update on proizvod
  for each row execute function proizvod_revizija();
```
