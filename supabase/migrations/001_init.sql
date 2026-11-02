-- Leaderboard (global speedrun scores)
create table if not exists leaderboard (
  id            bigserial primary key,
  blueprint_id  text        not null,
  profile_name  text        not null,
  time_ms       integer     not null check (time_ms > 0),
  created_at    timestamptz not null default now()
);
create index if not exists leaderboard_blueprint_time on leaderboard (blueprint_id, time_ms asc);

-- School licence keys (hashed)
create table if not exists license_keys (
  key_hash    text        primary key,
  tier        text        not null default 'school',
  org         text,
  expires_at  timestamptz
);

-- School contact inquiries
create table if not exists school_inquiries (
  id          bigserial primary key,
  first_name  text        not null,
  school      text        not null,
  email       text        not null,
  message     text,
  created_at  timestamptz not null default now()
);

-- Row-level security: anon can insert scores and inquiries, read leaderboard
alter table leaderboard        enable row level security;
alter table license_keys       enable row level security;
alter table school_inquiries   enable row level security;

create policy "anon read leaderboard"
  on leaderboard for select using (true);

create policy "anon insert score"
  on leaderboard for insert with check (true);

create policy "anon read license"
  on license_keys for select using (true);

create policy "anon insert inquiry"
  on school_inquiries for insert with check (true);
