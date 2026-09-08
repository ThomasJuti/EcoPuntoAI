-- Citizen reports of stale point data + admin writes on collection_points.
-- Reports never hide a point; ranking still uses is_active.

create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated;

create type public.report_reason as enum (
  'closed',
  'wrong_address',
  'wrong_hours',
  'wrong_accepted'
);

create type public.report_status as enum (
  'open',
  'resolved',
  'dismissed'
);

create table public.point_reports (
  id uuid primary key default gen_random_uuid(),
  point_id text not null,
  point_name text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  reason public.report_reason not null,
  comment text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index point_reports_open_idx
  on public.point_reports (status, created_at desc);

alter table public.point_reports enable row level security;

create policy "citizens insert own reports"
  on public.point_reports
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "admins read reports"
  on public.point_reports
  for select
  to authenticated
  using (public.is_admin());

create policy "admins update reports"
  on public.point_reports
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update on table public.point_reports to authenticated;

create policy "admins insert points"
  on public.collection_points
  for insert
  to authenticated
  with check (public.is_admin());

create policy "admins update points"
  on public.collection_points
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins delete points"
  on public.collection_points
  for delete
  to authenticated
  using (public.is_admin());

grant insert, update, delete on table public.collection_points to authenticated;
