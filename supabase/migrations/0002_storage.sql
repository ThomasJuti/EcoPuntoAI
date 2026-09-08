insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'device-photos',
  'device-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

create policy "authenticated insert own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'device-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "authenticated select own folder"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'device-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );
