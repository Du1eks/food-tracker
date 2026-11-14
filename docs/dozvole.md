# Dozvole (Korak 5)

Autentifikacija (ko si) = Supabase Auth, JWT token. Autorizacija (šta smeš) = RLS pravila u bazi.
"Svi" uvek znači **ulogovani korisnici**; anonimni ne vide ništa.

## Pravila
| Tabela | Read | Insert | Update | Delete |
|---|---|---|---|---|
| `profil` | vlasnik | trigger pri registraciji | vlasnik (i kolona `deli_unose`) | — (briše se sa nalogom, cascade) |
| `proizvod` | svi | svi | svi | samo `ko_je_uneo` |
| `unos` | vlasnik | vlasnik | vlasnik | vlasnik |
| `prijateljstvo` | oba (`ko_salje` i `ko_prima`) | samo `ko_salje`, status mora biti `na_cekanju` | samo `ko_prima`, samo kolona `status`, samo `na_cekanju` → `prihvaceno` | oba |

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

## Prijatelji (skica)
Zamke:
- **Insert kao prihvaćeno**: bez `with check (status = 'na_cekanju')` možeš sam sebi "prihvatiti" prijateljstvo.
- **Menjanje para**: RLS ne vidi kolone, pa to rešava `GRANT UPDATE (status)` (nivo kolone): `ko_salje`, `ko_prima` i `kreirano` se ne mogu menjati. `WITH CHECK` dozvoljava samo prelaz `na_cekanju` → `prihvaceno`, i samo primaocu. Trigger nije potreban.
- **Pozivanje funkcija bez naloga**: Supabase daje `execute` i `anon`-u po defaultu, pa se skida eksplicitno (`revoke ... from public, anon`).
- **Nadimak pri registraciji**: `nadimak_slobodan()` sme i `anon`, jer korisnik još nije ulogovan; otkriva samo da li je nadimak zauzet.
- **Prijatelj vidi zbir**: `unos` ostaje samo vlasniku; prijatelj dobija zbir kroz funkciju (`security definer`, izvršava se sa pravima vlasnika baze), koja sama proverava prijateljstvo.
- **Prijatelj vidi unose, samo na zahtev vlasnika**: kolona `profil.deli_unose` (podrazumevano `false`, uključuje se u Profilu). Funkcija `unosi_prijatelja(prijatelj, d)` vraća redove tek kad je prijateljstvo `prihvaceno` **i** `deli_unose = true`, a inače nijedan red. Tabela `unos` se ne otvara: nema nove RLS politike, jer bi RLS otvorio sve kolone i sve dane. Funkcija vraća samo ime, obrok, količinu, jedinicu i makroe, bez id-a i `proizvod_id`. `prijatelj_deli_unose(prijatelj)` daje isti odgovor (`false`) za tuđina i za prijatelja koji ne deli, pa ne otkriva ništa. Podrazumevano isključeno jer su se korisnici registrovali uz obećanje "samo ja vidim svoje unose".
- **Nabrajanje korisnika**: pretraga vraća samo tačno poklapanje nadimka (bez `like`/početka reči), pa niko ne može da izlista sve naloge.
- **Zbir "danas"**: datum šalje app. Prijatelj u drugoj vremenskoj zoni može imati drugačiji "danas"; za ~50 korisnika prihvatljivo.

```sql
alter table prijateljstvo enable row level security;

create policy "prijateljstvo citanje" on prijateljstvo for select
  using (auth.uid() in (ko_salje, ko_prima));
create policy "prijateljstvo zahtev" on prijateljstvo for insert
  with check (ko_salje = auth.uid() and status = 'na_cekanju');
create policy "prijateljstvo prihvatanje" on prijateljstvo for update
  using (ko_prima = auth.uid() and status = 'na_cekanju')
  with check (ko_prima = auth.uid() and status = 'prihvaceno');
create policy "prijateljstvo brisanje" on prijateljstvo for delete
  using (auth.uid() in (ko_salje, ko_prima));

-- samo status se sme menjati (nivo kolone, ne reda)
grant update (status) on prijateljstvo to authenticated;

-- pretraga: tačno poklapanje nadimka, samo id i nadimak
create function nadji_po_nadimku(trazeni text)
returns table (id uuid, nadimak text)
language sql stable security definer set search_path = public as $$
  select id, nadimak from profil
  where lower(nadimak) = lower(trazeni) and id <> auth.uid();
$$;

-- zbir za dan: ja + prihvaćeni prijatelji; rang računa app iz procenta
create function dnevni_zbir_prijatelja(d date)
returns table (id uuid, nadimak text, kcal numeric, proteini numeric, uh numeric, masti numeric, procenat numeric, ima_cilj boolean)
language sql stable security definer set search_path = public as $$
  select p.id, p.nadimak,
         coalesce(sum(u.kcal), 0), coalesce(sum(u.proteini), 0),
         coalesce(sum(u.uh), 0), coalesce(sum(u.masti), 0),
         case when p.cilj_kcal > 0 then least(coalesce(sum(u.kcal), 0) / p.cilj_kcal, 1) else 0 end,
         coalesce(p.cilj_kcal, 0) > 0
  from profil p
  left join unos u on u.korisnik_id = p.id and u.datum = d
  where p.id = auth.uid()
     or exists (select 1 from prijateljstvo f
                where f.status = 'prihvaceno'
                  and ((f.ko_salje = auth.uid() and f.ko_prima = p.id)
                    or (f.ko_prima = auth.uid() and f.ko_salje = p.id)))
  group by p.id;
$$;

revoke execute on function nadji_po_nadimku, dnevni_zbir_prijatelja from public;
grant  execute on function nadji_po_nadimku, dnevni_zbir_prijatelja to authenticated;
```

### Unosi prijatelja (opt-in, `20261114100000_unosi_prijatelja.sql`)
```sql
alter table profil add column deli_unose boolean not null default false;

create function prijatelj_deli_unose(prijatelj uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profil p
    join public.prijateljstvo f on f.status = 'prihvaceno'
      and ((f.ko_salje = auth.uid() and f.ko_prima = p.id) or (f.ko_prima = auth.uid() and f.ko_salje = p.id))
    where p.id = prijatelj and p.deli_unose);
$$;

create function unosi_prijatelja(prijatelj uuid, d date)
returns table (ime text, obrok text, kolicina numeric, jedinica text, kcal numeric, proteini numeric, uh numeric, masti numeric)
language sql stable security definer set search_path = '' as $$
  select u.ime, u.obrok, u.kolicina, u.jedinica, u.kcal, u.proteini, u.uh, u.masti
  from public.unos u
  where u.korisnik_id = prijatelj and u.datum = d and public.prijatelj_deli_unose(prijatelj)
  order by u.kreirano;
$$;

revoke execute on function prijatelj_deli_unose, unosi_prijatelja from public, anon;
grant  execute on function prijatelj_deli_unose, unosi_prijatelja to authenticated;
```
Ko šta dobija: **vlasnik** svoje unose kroz RLS (kao ranije); **prihvaćeni prijatelj** unose tek kad vlasnik uključi deljenje; **tuđin i `anon`** ništa (tuđin dobija prazan niz, `anon` grešku jer nema `execute`). Ukidanje prijateljstva ili isključivanje prekidača deluje odmah, bez keša.

## Unos tekstom (Edge Function `razumi-obrok`)
- **Ko sme:** samo ulogovan korisnik (funkcija proverava token; sa samim javnim ključem vraća 401).
- **Ključ za AI:** Supabase secret `GEMINI_API_KEY`, čita ga samo funkcija. U app-u i na GitHub-u ga nema.
- **Limit:** tabela `ai_potrosnja` (korisnik, dan, broj). Klijent je ne vidi (RLS bez pravila, bez GRANT-a); menja je samo `potrosi_ai_poziv()` (`security definer`), a granica od 40 poziva dnevno je u bazi.
- **Nepouzdan ulaz:** tekst korisnika (dužina, kontrolni znakovi), imena proizvoda iz zajedničke baze (jedan red, da ne mogu da dodaju "pravilo" u uputstvo) i odgovor AI-ja (granice za količinu i vrednosti, najviše 20 stavki, proizvod samo iz spiska).
- **Šta AI ne može:** da upiše u bazu. Upis radi app sa tokenom korisnika, pa i dalje važe RLS i CHECK pravila tabele `unos`.
- **Privatnost:** AI servisu ide samo tekst obroka i spisak proizvoda, bez email-a i id-a korisnika; `store: false` (Google ne čuva poruku za kasnije čitanje). Na besplatnom nivou Google može da koristi tekst za poboljšanje modela.
