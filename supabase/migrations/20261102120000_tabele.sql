-- Tabele iz docs/model.md

create table public.profil (
  id                uuid primary key references auth.users (id) on delete cascade,
  ime               text,
  pol               text check (pol in ('m', 'z')),
  datum_rodjenja    date,
  visina_cm         numeric check (visina_cm between 100 and 250),
  tezina_kg         numeric check (tezina_kg between 30 and 300),
  treninga_nedeljno int check (treninga_nedeljno between 0 and 14),
  koraka_dnevno     int check (koraka_dnevno >= 0),
  cilj              text check (cilj in ('smrsati', 'odrzavati', 'bulk')),
  ciljna_tezina_kg  numeric check (ciljna_tezina_kg between 30 and 300),
  cilj_kcal         numeric check (cilj_kcal >= 0),
  cilj_proteini     numeric check (cilj_proteini >= 0),
  cilj_uh           numeric check (cilj_uh >= 0),
  cilj_masti        numeric check (cilj_masti >= 0),
  azurirano         timestamptz not null default now()
);

create table public.proizvod (
  id          uuid primary key default gen_random_uuid(),
  ime         text not null check (length(trim(ime)) > 0),
  brend       text,
  jedinica    text not null check (jedinica in ('100g', 'komad')),
  kcal        numeric not null check (kcal >= 0),
  proteini    numeric not null default 0 check (proteini >= 0),
  uh          numeric not null default 0 check (uh >= 0),
  masti       numeric not null default 0 check (masti >= 0),
  -- proizvod je zajednički, pa ostaje i kad se autor obriše
  ko_je_uneo  uuid references auth.users (id) on delete set null,
  kreirano    timestamptz not null default now(),
  izmenio     uuid references auth.users (id) on delete set null,
  izmenjeno   timestamptz
);

create table public.unos (
  id           uuid primary key default gen_random_uuid(),
  korisnik_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- snapshot ispod čuva istoriju i kad se proizvod obriše
  proizvod_id  uuid references public.proizvod (id) on delete set null,
  datum        date not null,
  obrok        text not null check (obrok in ('dorucak', 'rucak', 'vecera', 'uzina')),
  kolicina     numeric not null check (kolicina > 0),
  ime          text not null,
  kcal         numeric not null check (kcal >= 0),
  proteini     numeric not null default 0 check (proteini >= 0),
  uh           numeric not null default 0 check (uh >= 0),
  masti        numeric not null default 0 check (masti >= 0),
  kreirano     timestamptz not null default now()
);

-- "unosi za dan" ostaje brz i na milionima redova (docs/skaliranje.md)
create index unos_korisnik_datum on public.unos (korisnik_id, datum);
