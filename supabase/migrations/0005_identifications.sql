-- Own identification history. Photos stay in Storage; this stores the result.
-- ponytail: cap 20 is applied in the app query, not here.

create table public.identifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  waste_kind public.waste_kind not null,
  confidence real not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, storage_path)
);

create index identifications_user_created_idx
  on public.identifications (user_id, created_at desc);

alter table public.identifications enable row level security;

create policy "citizens read own identifications"
  on public.identifications
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "citizens insert own identifications"
  on public.identifications
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "citizens update own identifications"
  on public.identifications
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update on table public.identifications to authenticated;
