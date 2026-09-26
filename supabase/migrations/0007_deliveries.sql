-- Citizen hand-ins at a collection point. No proximity check yet (GPS/QR later).
-- One hand-in per identification: the partial unique index blocks double counting.

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  point_id text not null,
  point_name text not null,
  waste_kind public.waste_kind not null,
  storage_path text,
  distance_km real,
  created_at timestamptz not null default now()
);

create unique index deliveries_user_path_idx
  on public.deliveries (user_id, storage_path)
  where storage_path is not null;

create index deliveries_created_idx
  on public.deliveries (created_at desc);

alter table public.deliveries enable row level security;

create policy "citizens insert own deliveries"
  on public.deliveries
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "citizens read own deliveries"
  on public.deliveries
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "admins read deliveries"
  on public.deliveries
  for select
  to authenticated
  using (public.is_admin());

grant select, insert on table public.deliveries to authenticated;
