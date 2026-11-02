-- Prijatelji i rang lista (docs/model.md, docs/dozvole.md)

-- Nadimak: bira se pri registraciji; stari nalozi ga nemaju dok ga ne unesu u profilu
alter table public.profil
  add column nadimak text check (nadimak = trim(nadimak) and length(nadimak) between 3 and 20);

-- "Miki" i "miki" nisu dva nadimka; null-ovi se ne sudaraju
create unique index profil_nadimak_jedinstven on public.profil (lower(nadimak));

-- Registracija uzima nadimak iz signUp options.data.nadimak
create or replace function public.novi_profil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profil (id, nadimak)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'nadimak'), ''));
  return new;
end $$;

create table public.prijateljstvo (
  ko_salje  uuid not null default auth.uid() references public.profil (id) on delete cascade,
  ko_prima  uuid not null references public.profil (id) on delete cascade,
  status    text not null default 'na_cekanju' check (status in ('na_cekanju', 'prihvaceno')),
  kreirano  timestamptz not null default now(),
  primary key (ko_salje, ko_prima),
  check (ko_salje <> ko_prima)
);

-- par A-B postoji samo jednom, bez obzira ko je prvi poslao
create unique index prijateljstvo_par on public.prijateljstvo
  (least(ko_salje, ko_prima), greatest(ko_salje, ko_prima));
-- dolazni zahtevi
create index prijateljstvo_ko_prima on public.prijateljstvo (ko_prima);

alter table public.prijateljstvo enable row level security;

revoke all on public.prijateljstvo from anon;
grant select, insert, delete on public.prijateljstvo to authenticated;
-- menja se samo status; ko_salje, ko_prima i kreirano se ne mogu prepisati
grant update (status) on public.prijateljstvo to authenticated;

create policy "prijateljstvo citanje" on public.prijateljstvo for select to authenticated
  using (auth.uid() in (ko_salje, ko_prima));
create policy "prijateljstvo zahtev" on public.prijateljstvo for insert to authenticated
  with check (ko_salje = auth.uid() and status = 'na_cekanju');
create policy "prijateljstvo prihvatanje" on public.prijateljstvo for update to authenticated
  using (ko_prima = auth.uid() and status = 'na_cekanju')
  with check (ko_prima = auth.uid() and status = 'prihvaceno');
create policy "prijateljstvo brisanje" on public.prijateljstvo for delete to authenticated
  using (auth.uid() in (ko_salje, ko_prima));

-- Pretraga: samo tačno poklapanje nadimka (niko ne može da izlista sve naloge)
create function public.nadji_po_nadimku(trazeni text)
returns table (id uuid, nadimak text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nadimak from public.profil p
  where lower(p.nadimak) = lower(trim(trazeni)) and p.id <> auth.uid();
$$;

-- Registracija nije ulogovana, pa ovo sme i anon (otkriva samo da li je nadimak zauzet)
create function public.nadimak_slobodan(trazeni text)
returns boolean
language sql stable security definer set search_path = '' as $$
  select not exists (
    select 1 from public.profil p where lower(p.nadimak) = lower(trim(trazeni))
  );
$$;

-- Zbir za dan: ja + prihvaćeni prijatelji. Prijatelj dobija samo zbir, nikad redove iz unos.
-- Rang računa app iz procenta (do 100%, bez cilja = 0).
create function public.dnevni_zbir_prijatelja(d date)
returns table (id uuid, nadimak text, kcal numeric, proteini numeric, uh numeric, masti numeric, procenat numeric)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nadimak,
         coalesce(sum(u.kcal), 0), coalesce(sum(u.proteini), 0),
         coalesce(sum(u.uh), 0), coalesce(sum(u.masti), 0),
         coalesce(least(sum(u.kcal) / nullif(p.cilj_kcal, 0), 1), 0)
  from public.profil p
  left join public.unos u on u.korisnik_id = p.id and u.datum = d
  where p.id = auth.uid()
     or exists (select 1 from public.prijateljstvo f
                where f.status = 'prihvaceno'
                  and ((f.ko_salje = auth.uid() and f.ko_prima = p.id)
                    or (f.ko_prima = auth.uid() and f.ko_salje = p.id)))
  group by p.id;
$$;

-- Supabase po defaultu daje execute i anon-u, pa se skida eksplicitno
revoke execute on function public.nadji_po_nadimku(text), public.nadimak_slobodan(text),
  public.dnevni_zbir_prijatelja(date) from public, anon;
grant execute on function public.nadji_po_nadimku(text), public.dnevni_zbir_prijatelja(date)
  to authenticated;
grant execute on function public.nadimak_slobodan(text) to anon, authenticated;
