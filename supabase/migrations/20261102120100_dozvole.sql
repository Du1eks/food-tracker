-- Dozvole iz docs/dozvole.md: GRANT (nivo tabele) + RLS (nivo reda)

alter table public.profil   enable row level security;
alter table public.proizvod enable row level security;
alter table public.unos     enable row level security;

-- Neulogovani ne vide ništa
revoke all on public.profil, public.proizvod, public.unos from anon;

grant select, update                 on public.profil   to authenticated;
grant select, insert, update, delete on public.proizvod to authenticated;
grant select, insert, update, delete on public.unos     to authenticated;

-- profil: samo vlasnik (red pravi trigger pri registraciji)
create policy "profil citanje" on public.profil for select to authenticated
  using (id = auth.uid());
create policy "profil izmena" on public.profil for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- proizvod: svi ulogovani čitaju/dodaju/menjaju, briše samo autor
create policy "proizvod citanje" on public.proizvod for select to authenticated
  using (true);
create policy "proizvod dodaj" on public.proizvod for insert to authenticated
  with check (true);
create policy "proizvod izmena" on public.proizvod for update to authenticated
  using (true) with check (true);
create policy "proizvod brisanje" on public.proizvod for delete to authenticated
  using (ko_je_uneo = auth.uid());

-- unos: samo vlasnik, sve operacije
create policy "unos vlasnik" on public.unos for all to authenticated
  using (korisnik_id = auth.uid())
  with check (korisnik_id = auth.uid());

-- Registracija pravi prazan profil
create function public.novi_profil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profil (id) values (new.id);
  return new;
end $$;

create trigger novi_profil after insert on auth.users
  for each row execute function public.novi_profil();

-- Kolone za dozvole i reviziju popunjava baza, ne klijent
create function public.proizvod_revizija() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.ko_je_uneo := auth.uid();
  else
    new.ko_je_uneo := old.ko_je_uneo;
  end if;
  new.izmenio := auth.uid();
  new.izmenjeno := now();
  return new;
end $$;

create trigger proizvod_revizija before insert or update on public.proizvod
  for each row execute function public.proizvod_revizija();

create function public.profil_azurirano() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.azurirano := now();
  return new;
end $$;

create trigger profil_azurirano before update on public.profil
  for each row execute function public.profil_azurirano();
