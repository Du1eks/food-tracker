-- Rang: ko nema dnevni cilj kcal nema ni procenat, pa app mora da razlikuje "nisu uneti podaci" od 0%.
-- Povratni tip se ne može menjati sa create or replace, pa se funkcija pravi iznova.

drop function public.dnevni_zbir_prijatelja(date);

create function public.dnevni_zbir_prijatelja(d date)
returns table (id uuid, nadimak text, kcal numeric, proteini numeric, uh numeric, masti numeric, procenat numeric, ima_cilj boolean)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nadimak,
         coalesce(sum(u.kcal), 0), coalesce(sum(u.proteini), 0),
         coalesce(sum(u.uh), 0), coalesce(sum(u.masti), 0),
         coalesce(least(sum(u.kcal) / nullif(p.cilj_kcal, 0), 1), 0),
         coalesce(p.cilj_kcal, 0) > 0
  from public.profil p
  left join public.unos u on u.korisnik_id = p.id and u.datum = d
  where p.id = auth.uid()
     or exists (select 1 from public.prijateljstvo f
                where f.status = 'prihvaceno'
                  and ((f.ko_salje = auth.uid() and f.ko_prima = p.id)
                    or (f.ko_prima = auth.uid() and f.ko_salje = p.id)))
  group by p.id;
$$;

revoke execute on function public.dnevni_zbir_prijatelja(date) from public, anon;
grant execute on function public.dnevni_zbir_prijatelja(date) to authenticated;
