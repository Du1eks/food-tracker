-- Unos pamti jedinicu količine (g ili komad), da tabela zna da li piše "150 g" ili "1 kom".
-- Default pokriva postojeće redove, pa stare verzije app-a ne pucaju.
alter table public.unos
  add column jedinica text not null default '100g' check (jedinica in ('100g', 'komad'));
