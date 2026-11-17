-- Kuhinja: korisnik čuva svoja jela (šablone obroka). Ime "obrok" je već zauzeto (doručak/ručak/večera).
-- Stavke su jsonb niz, ne posebna tabela: jelo se uvek čita i snima celo, nikad se ne sabira ni filtrira po stavci,
-- pa je izmena jedan atomski update. Stavka je isti snimak kao red u unos:
-- { ime, proizvod_id, kolicina, jedinica, kcal, proteini, uh, masti } (vrednosti već preračunate za količinu).
create table public.jelo (
  id           uuid primary key default gen_random_uuid(),
  korisnik_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  ime          text not null check (length(trim(ime)) > 0 and length(ime) <= 80),
  -- 20 = MAX_STAVKI u supabase/functions/_shared/obrok.ts; veličina sprečava da neko u bazu gura ogromne nizove
  stavke       jsonb not null check (
    jsonb_typeof(stavke) = 'array' and jsonb_array_length(stavke) between 1 and 20 and pg_column_size(stavke) <= 16384
  ),
  kreirano     timestamptz not null default now(),
  izmenjeno    timestamptz
);

create index jelo_korisnik on public.jelo (korisnik_id);

-- Dozvole (docs/dozvole.md): samo vlasnik, sve operacije. Prijatelji ne vide jela.
alter table public.jelo enable row level security;
revoke all on public.jelo from anon;
grant select, insert, update, delete on public.jelo to authenticated;

create policy "jelo vlasnik" on public.jelo for all to authenticated
  using (korisnik_id = auth.uid())
  with check (korisnik_id = auth.uid());

-- Vreme izmene popunjava baza, ne klijent
create function public.jelo_izmenjeno() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.izmenjeno := now();
  return new;
end $$;

create trigger jelo_izmenjeno before update on public.jelo
  for each row execute function public.jelo_izmenjeno();
