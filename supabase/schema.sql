-- Run this once in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).

-- 1. PROFILES ---------------------------------------------------------------
-- One row per user, extends the built-in auth.users table.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  tags text[] not null default '{}',              -- e.g. {"art","outdoors"}
  cadence text not null default 'daily'            -- 'daily' | '3x_week' | 'weekly'
    check (cadence in ('daily', '3x_week', 'weekly')),
  childhood_memory text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row the moment someone signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. PROMPTS -----------------------------------------------------------------
-- The curated prompt library. Tags match the tags a user picks at onboarding.
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.prompts enable row level security;

create policy "Any authenticated user can read prompts"
  on public.prompts for select
  using (auth.role() = 'authenticated');


-- 3. SESSIONS ------------------------------------------------------------------
-- One row per completed prompt (the "I did it" capture).
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt_id uuid references public.prompts (id),
  photo_url text,
  note text,
  completed_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);


-- 4. STREAKS ---------------------------------------------------------------
create table if not exists public.streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak int not null default 0,
  grace_skips_remaining int not null default 1,
  last_session_at timestamptz
);

alter table public.streaks enable row level security;

create policy "Users can view their own streak"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users can update their own streak"
  on public.streaks for update
  using (auth.uid() = user_id);

create policy "Users can insert their own streak"
  on public.streaks for insert
  with check (auth.uid() = user_id);


-- 5. STORAGE -----------------------------------------------------------------
-- Bucket for the "I did it" photos. Run this after creating a bucket named
-- "session-photos" in Dashboard -> Storage (mark it public for simplicity).
-- Then these policies let each user manage only their own folder (named
-- after their user id) inside the bucket.
insert into storage.buckets (id, name, public)
values ('session-photos', 'session-photos', true)
on conflict (id) do nothing;

create policy "Users can upload their own session photos"
  on storage.objects for insert
  with check (
    bucket_id = 'session-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can view session photos"
  on storage.objects for select
  using (bucket_id = 'session-photos');
