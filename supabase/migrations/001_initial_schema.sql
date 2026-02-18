-- Wedding Calendar 2026 — Initial Schema

-- couples: the couple unit
create table couples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- couple_users: which auth users belong to which couple
create table couple_users (
  couple_id uuid references couples(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  display_name text not null,
  primary key (couple_id, user_id)
);

-- events: calendar events scoped to a couple
create table events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  date date not null,
  title text not null,
  description text,
  time_start time,
  time_end time,
  category text not null default 'personal',
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- photos: uploaded images attached to dates
create table photos (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  date date not null,
  storage_path text not null,
  caption text,
  uploaded_by uuid references auth.users(id) not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_events_couple_date on events(couple_id, date);
create index idx_photos_couple_date on photos(couple_id, date);

-- Helper function to get current user's couple_id
create or replace function get_my_couple_id()
returns uuid
language sql
security definer
stable
as $$
  select couple_id from couple_users where user_id = auth.uid() limit 1;
$$;

-- Enable RLS on all tables
alter table couples enable row level security;
alter table couple_users enable row level security;
alter table events enable row level security;
alter table photos enable row level security;

-- RLS Policies: couples (read-only for members)
create policy "Couples are viewable by members"
  on couples for select
  using (id = get_my_couple_id());

-- RLS Policies: couple_users (read-only for members)
create policy "Couple users are viewable by couple members"
  on couple_users for select
  using (couple_id = get_my_couple_id());

-- RLS Policies: events (full CRUD for couple members)
create policy "Events are viewable by couple members"
  on events for select
  using (couple_id = get_my_couple_id());

create policy "Events are insertable by couple members"
  on events for insert
  with check (couple_id = get_my_couple_id());

create policy "Events are updatable by couple members"
  on events for update
  using (couple_id = get_my_couple_id());

create policy "Events are deletable by couple members"
  on events for delete
  using (couple_id = get_my_couple_id());

-- RLS Policies: photos (full CRUD for couple members)
create policy "Photos are viewable by couple members"
  on photos for select
  using (couple_id = get_my_couple_id());

create policy "Photos are insertable by couple members"
  on photos for insert
  with check (couple_id = get_my_couple_id());

create policy "Photos are updatable by couple members"
  on photos for update
  using (couple_id = get_my_couple_id());

create policy "Photos are deletable by couple members"
  on photos for delete
  using (couple_id = get_my_couple_id());

-- Enable real-time for events and photos
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table photos;

-- Storage bucket for photos (run via Supabase Dashboard or API)
-- insert into storage.buckets (id, name, public)
-- values ('photos', 'photos', false);
