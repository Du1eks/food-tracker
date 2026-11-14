-- Prijatelj vidi šta si jeo, ali samo ako to sam uključiš (docs/dozvole.md).
-- Podrazumevano isključeno: ljudi su se registrovali uz obećanje "samo ja vidim svoje unose".
-- Tabela unos ostaje zatvorena (RLS samo vlasnik); prijatelj dobija redove kroz funkciju koja sama proverava uslove.

alter table public.profil add column deli_unose boolean not null default false;

-- Da li prihvaćeni prijatelj deli unose. Za tuđina i za prijatelja koji ne deli odgovor je isti (false),
-- pa ništa ne otkriva. Zaseban odgovor treba app-u da razlikuje "ne deli" od "danas nije jeo ništa".
create function public.prijatelj_deli_unose(prijatelj uuid)
returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.profil p
    join public.prijateljstvo f on f.status = 'prihvaceno'
      and ((f.ko_salje = auth.uid() and f.ko_prima = p.id)
        or (f.ko_prima = auth.uid() and f.ko_salje = p.id))
    where p.id = prijatelj and p.deli_unose
  );
$$;

-- Unosi prijatelja za dan: samo kolone koje app prikazuje (bez id-a, proizvod_id i korisnik_id)
create function public.unosi_prijatelja(prijatelj uuid, d date)
returns table (ime text, obrok text, kolicina numeric, jedinica text, kcal numeric, proteini numeric, uh numeric, masti numeric)
language sql stable security definer set search_path = '' as $$
  select u.ime, u.obrok, u.kolicina, u.jedinica, u.kcal, u.proteini, u.uh, u.masti
  from public.unos u
  where u.korisnik_id = prijatelj
    and u.datum = d
    and public.prijatelj_deli_unose(prijatelj)
  order by u.kreirano;
$$;

-- Supabase po defaultu daje execute i anon-u, pa se skida eksplicitno
revoke execute on function public.prijatelj_deli_unose(uuid), public.unosi_prijatelja(uuid, date) from public, anon;
grant execute on function public.prijatelj_deli_unose(uuid), public.unosi_prijatelja(uuid, date) to authenticated;
