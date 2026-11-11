-- Dnevni brojač AI poziva po korisniku: čuva besplatan AI limit i sprečava zloupotrebu funkcije razumi-obrok.
-- Klijent tabelu ne vidi (RLS bez pravila, bez GRANT-a); menja je samo funkcija ispod.
create table public.ai_potrosnja (
  korisnik_id uuid not null references auth.users (id) on delete cascade,
  dan         date not null default current_date,
  broj        int  not null default 0,
  primary key (korisnik_id, dan)
);

alter table public.ai_potrosnja enable row level security;
revoke all on public.ai_potrosnja from anon, authenticated;

-- Upiše jedan poziv za ulogovanog korisnika i vrati da li je još u dnevnom limitu.
-- Granica je ovde, u bazi, da klijent ne može da je promeni.
create function public.potrosi_ai_poziv()
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  if auth.uid() is null then
    return false;
  end if;
  insert into ai_potrosnja (korisnik_id, dan, broj)
  values (auth.uid(), current_date, 1)
  on conflict (korisnik_id, dan) do update set broj = ai_potrosnja.broj + 1
  returning broj into n;
  return n <= 40;
end $$;

revoke execute on function public.potrosi_ai_poziv() from public, anon;
grant execute on function public.potrosi_ai_poziv() to authenticated;
