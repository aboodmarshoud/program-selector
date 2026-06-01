create table if not exists public.quiz_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  session_id text not null,
  event text not null check (event in ('visit', 'quiz_started', 'quiz_completed')),
  path text,
  country text,
  gender text,
  age text,
  result_program_id text,
  step_count integer,
  raw_answers jsonb,
  readable_answers jsonb,
  recommendations jsonb,
  profile jsonb,
  context jsonb
);

create index if not exists quiz_events_event_idx on public.quiz_events (event);
create index if not exists quiz_events_occurred_at_idx on public.quiz_events (occurred_at desc);
create index if not exists quiz_events_country_idx on public.quiz_events (country);
create index if not exists quiz_events_result_program_idx on public.quiz_events (result_program_id);

alter table public.quiz_events enable row level security;

create table if not exists public.app_config (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

revoke all on table public.app_config from anon;
revoke all on table public.app_config from authenticated;
grant select, insert, update, delete on table public.app_config to service_role;

create or replace function public.get_admin_email()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select lower(value)
  from public.app_config
  where key = 'admin_email'
  limit 1
$$;

revoke all on function public.get_admin_email() from public;
grant execute on function public.get_admin_email() to authenticated;

grant insert on public.quiz_events to anon, authenticated;
grant select on public.quiz_events to authenticated;

drop policy if exists "Anyone can add analytics events" on public.quiz_events;
create policy "Anyone can add analytics events"
on public.quiz_events
for insert
to public
with check (true);

drop policy if exists "Only owner can read analytics events" on public.quiz_events;
create policy "Only owner can read analytics events"
on public.quiz_events
for select
to authenticated
using (
  lower(auth.jwt() ->> 'email') = public.get_admin_email()
);
