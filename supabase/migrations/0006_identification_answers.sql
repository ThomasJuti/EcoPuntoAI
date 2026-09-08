-- Answers from the identify guidance wizard (¿Enciende?, ¿Está roto?, …).
alter table public.identifications
  add column if not exists answers jsonb not null default '{}'::jsonb;
