-- Zahtevi i prijatelji sa nadimkom druge strane.
-- profil je privatan, pa app ne može da spoji prijateljstvo sa nadimkom; funkcija izdaje samo id i nadimak.

create function public.moji_zahtevi()
returns table (drugi_id uuid, drugi_nadimak text, status text, poslao_sam boolean, kreirano timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nadimak, f.status, f.ko_salje = auth.uid(), f.kreirano
  from public.prijateljstvo f
  join public.profil p on p.id = case when f.ko_salje = auth.uid() then f.ko_prima else f.ko_salje end
  where auth.uid() in (f.ko_salje, f.ko_prima)
  order by f.kreirano desc;
$$;

revoke execute on function public.moji_zahtevi() from public, anon;
grant execute on function public.moji_zahtevi() to authenticated;
