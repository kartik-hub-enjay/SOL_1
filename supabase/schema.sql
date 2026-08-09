-- Spark Database Schema (Supabase Postgres)

-- 1. Universities
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null
);

-- 2. Users (profiles linked to Supabase auth or demo users)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  university_id uuid references public.universities(id) on delete set null,
  created_at timestamp with time zone default now(),
  onboarding_complete boolean default false
);

-- 3. Fingerprint Answers
create table if not exists public.fingerprint_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  question_id text not null,
  answer_text text not null,
  created_at timestamp with time zone default now()
);

-- 4. Fingerprint Profile
create table if not exists public.fingerprint_profile (
  user_id uuid primary key references public.users(id) on delete cascade,
  primary_interest text not null,
  secondary_interests text[] default '{}',
  skill_level text,
  axis_scores jsonb default '{}'::jsonb,
  constellation_seed jsonb default '{}'::jsonb
);

-- 5. Communities
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tag text not null,
  description text not null,
  cover_accent text not null default '#FF7A45'
);

-- 6. Community Memberships
create table if not exists public.community_memberships (
  user_id uuid references public.users(id) on delete cascade,
  community_id uuid references public.communities(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key (user_id, community_id)
);

-- 7. Circles
create table if not exists public.circles (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete cascade,
  tier text not null default 'starter_pod',
  created_at timestamp with time zone default now()
);

-- 8. Circle Memberships
create table if not exists public.circle_memberships (
  user_id uuid references public.users(id) on delete cascade,
  circle_id uuid references public.circles(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key (user_id, circle_id)
);

-- 9. Circle Messages
create table if not exists public.circle_messages (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid references public.circles(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- 10. Engagement Scores
create table if not exists public.engagement_scores (
  user_id uuid references public.users(id) on delete cascade,
  circle_id uuid references public.circles(id) on delete cascade,
  week_start date not null,
  score numeric not null default 0,
  primary key (user_id, circle_id, week_start)
);

-- 11. Opportunities
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  org_name text not null,
  tag text not null,
  type text not null,
  url text not null,
  event_date date not null,
  is_expired boolean default false
);

-- Enable RLS and disable row restrictions for public demo access
alter table public.universities enable row level security;
alter table public.users enable row level security;
alter table public.fingerprint_answers enable row level security;
alter table public.fingerprint_profile enable row level security;
alter table public.communities enable row level security;
alter table public.community_memberships enable row level security;
alter table public.circles enable row level security;
alter table public.circle_memberships enable row level security;
alter table public.circle_messages enable row level security;
alter table public.engagement_scores enable row level security;
alter table public.opportunities enable row level security;

-- Permissive policies for demo app operations
drop policy if exists "Public access for universities" on public.universities;
create policy "Public access for universities" on public.universities for all using (true) with check (true);

drop policy if exists "Public access for users" on public.users;
create policy "Public access for users" on public.users for all using (true) with check (true);

drop policy if exists "Public access for fingerprint_answers" on public.fingerprint_answers;
create policy "Public access for fingerprint_answers" on public.fingerprint_answers for all using (true) with check (true);

drop policy if exists "Public access for fingerprint_profile" on public.fingerprint_profile;
create policy "Public access for fingerprint_profile" on public.fingerprint_profile for all using (true) with check (true);

drop policy if exists "Public access for communities" on public.communities;
create policy "Public access for communities" on public.communities for all using (true) with check (true);

drop policy if exists "Public access for community_memberships" on public.community_memberships;
create policy "Public access for community_memberships" on public.community_memberships for all using (true) with check (true);

drop policy if exists "Public access for circles" on public.circles;
create policy "Public access for circles" on public.circles for all using (true) with check (true);

drop policy if exists "Public access for circle_memberships" on public.circle_memberships;
create policy "Public access for circle_memberships" on public.circle_memberships for all using (true) with check (true);

drop policy if exists "Public access for circle_messages" on public.circle_messages;
create policy "Public access for circle_messages" on public.circle_messages for all using (true) with check (true);

drop policy if exists "Public access for engagement_scores" on public.engagement_scores;
create policy "Public access for engagement_scores" on public.engagement_scores for all using (true) with check (true);

drop policy if exists "Public access for opportunities" on public.opportunities;
create policy "Public access for opportunities" on public.opportunities for all using (true) with check (true);

-- Realtime replication settings
alter publication supabase_realtime add table circle_messages;
