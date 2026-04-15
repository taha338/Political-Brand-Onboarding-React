-- ============================================================
--  Operation 1776 — Brand Submissions Schema
--  Run this in Supabase → SQL Editor
--  Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS)
-- ============================================================


-- ── 1. TABLE ─────────────────────────────────────────────────
create table if not exists brand_submissions (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),

  -- Candidate basics
  candidate_name          text check (char_length(candidate_name) <= 120),
  candidate_office        text check (char_length(candidate_office) <= 120),
  candidate_office_custom text check (char_length(candidate_office_custom) <= 120),
  candidate_state         text check (char_length(candidate_state) <= 60),
  candidate_district      text check (char_length(candidate_district) <= 30),
  election_year           text check (election_year ~ '^[0-9]{4}$'),
  party_affiliation       text check (char_length(party_affiliation) <= 60),
  race_focus              text check (race_focus in ('primary', 'general', 'runoff')),
  candidate_type          text check (char_length(candidate_type) <= 60),

  -- Candidate profile
  backgrounds             text check (char_length(backgrounds) <= 500),
  background_other        text check (char_length(background_other) <= 200),
  policy_priorities       text check (char_length(policy_priorities) <= 500),
  policy_other            text check (char_length(policy_other) <= 200),
  defining_story          text check (char_length(defining_story) <= 2000),
  family_status           text check (char_length(family_status) <= 120),
  endorsements            text check (char_length(endorsements) <= 500),

  -- Brand selections
  brand_core              text check (brand_core in ('commander','patriot','reformer','community','executive','nonpartisan')),
  sub_direction           text check (char_length(sub_direction) <= 60),
  color_mode              text check (color_mode in ('theme','custom')),
  logo_type               text check (logo_type in ('emblem','symbol-text','monogram','wordmark')),

  -- Colors (hex values)
  color_primary           text check (color_primary ~ '^#[0-9A-Fa-f]{6}$'),
  color_secondary         text check (color_secondary ~ '^#[0-9A-Fa-f]{6}$'),
  color_accent            text check (color_accent ~ '^#[0-9A-Fa-f]{6}$'),
  color_background        text check (color_background ~ '^#[0-9A-Fa-f]{6}$'),
  color_text              text check (color_text ~ '^#[0-9A-Fa-f]{6}$'),
  color_highlight         text check (color_highlight ~ '^#[0-9A-Fa-f]{6}$'),

  -- Fonts
  font_heading            text check (char_length(font_heading) <= 80),
  font_body               text check (char_length(font_body) <= 80),

  -- Collateral (hidden for now — columns kept for future use)
  collateral_items        text check (char_length(collateral_items) <= 500),
  collateral_total        integer check (collateral_total >= 0 and collateral_total <= 100000),

  -- Full state snapshot (capped at ~50 KB to prevent abuse)
  full_data               jsonb not null,

  -- Guard against duplicate submissions (same name + office within 5 minutes)
  constraint no_rapid_duplicates unique (candidate_name, candidate_office, election_year)
);


-- ── 2. MIGRATION (run if table already exists) ───────────────
--  Adds any missing columns without breaking existing data.
alter table brand_submissions
  add column if not exists background_other  text check (char_length(background_other) <= 200),
  add column if not exists policy_other      text check (char_length(policy_other) <= 200);

--  Expand brand_core check constraint to include 'nonpartisan'
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_name = 'brand_submissions'
      and constraint_name = 'brand_submissions_brand_core_check'
  ) then
    alter table brand_submissions drop constraint brand_submissions_brand_core_check;
  end if;
  alter table brand_submissions
    add constraint brand_submissions_brand_core_check
    check (brand_core in ('commander','patriot','reformer','community','executive','nonpartisan'));
end $$;


-- ── 3. INDEXES ───────────────────────────────────────────────
-- Speeds up ordering by date (used in Google Sheets pull)
create index if not exists idx_brand_submissions_created_at
  on brand_submissions (created_at desc);

-- Speeds up filtering by brand core or state
create index if not exists idx_brand_submissions_brand_core
  on brand_submissions (brand_core);

create index if not exists idx_brand_submissions_state
  on brand_submissions (candidate_state);


-- ── 4. ROW LEVEL SECURITY ────────────────────────────────────
alter table brand_submissions enable row level security;


-- ── 5. POLICIES ──────────────────────────────────────────────

-- Drop old policies cleanly before recreating
drop policy if exists "Allow public inserts"      on brand_submissions;
drop policy if exists "Allow authenticated reads" on brand_submissions;
drop policy if exists "Allow service role reads"  on brand_submissions;
drop policy if exists "Allow service role all"    on brand_submissions;

-- ANON: INSERT only — with field validation
--   Requires at minimum a candidate name and brand core to be present.
--   Prevents empty/spam submissions.
create policy "anon_insert"
  on brand_submissions
  for insert
  to anon
  with check (
    candidate_name is not null
    and char_length(trim(candidate_name)) >= 2
    and brand_core is not null
    and full_data is not null
  );

-- ANON: NO SELECT, NO UPDATE, NO DELETE
--   (implicit — no policy = denied)

-- AUTHENTICATED: full read access (future admin dashboard)
create policy "authenticated_select"
  on brand_submissions
  for select
  to authenticated
  using (true);

-- SERVICE ROLE: full access — used by Google Sheets script and server tools
--   The service role key bypasses RLS by default in Supabase,
--   but this policy makes intent explicit if bypass is ever disabled.
create policy "service_role_all"
  on brand_submissions
  for all
  to service_role
  using (true)
  with check (true);


-- ── 6. GRANTS ────────────────────────────────────────────────
-- Anon can only insert
grant insert on brand_submissions to anon;

-- Authenticated can read
grant select on brand_submissions to authenticated;

-- Revoke anything else from anon explicitly
revoke select, update, delete on brand_submissions from anon;
