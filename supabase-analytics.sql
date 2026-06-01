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
  -- Replace YOUR_EMAIL_HERE with the same email you set in VITE_ANALYTICS_OWNER_EMAIL.
  lower(auth.jwt() ->> 'email') = lower('amarshoud2@gmail.com')
);
