create type public.waste_kind as enum (
  'phones',
  'computers',
  'laptops',
  'tablets',
  'chargers',
  'batteries',
  'cells',
  'headphones',
  'tvs',
  'printers',
  'cables',
  'peripherals',
  'small_appliances',
  'unknown'
);

create table public.collection_points (
  id text primary key,
  name text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  locality text not null,
  hours text not null,
  contact text,
  accepted public.waste_kind[] not null,
  is_active boolean not null default true,
  last_verified_at date not null default current_date,
  source text
);

alter table public.collection_points enable row level security;

create policy "anyone can read active points"
  on public.collection_points
  for select
  to anon, authenticated
  using (true);

grant select on table public.collection_points to anon, authenticated;

-- Seed lives in data/seed/collection-points.csv.
-- The app loads that CSV until this table has rows (admin / later seed).

