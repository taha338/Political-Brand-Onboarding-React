-- 2026-05-12: Extend brand_submissions for PAC + Nonprofit subjects.
-- Optional — until this runs, PAC/Nonprofit data is stored inside the
-- full_data JSONB column under `pac_sanitized` / `nonprofit_sanitized`.
-- This migration promotes the most-queried fields to top-level columns
-- for SQL reporting + indexable filters.

alter table brand_submissions
  -- Subject type now accepts 4 values; drop any old check first.
  drop constraint if exists brand_submissions_subject_type_check,
  add constraint brand_submissions_subject_type_check
    check (subject_type is null or subject_type in ('candidate','party','pac','nonprofit'));

-- PAC columns
alter table brand_submissions
  add column if not exists pac_legal_name            text check (char_length(pac_legal_name) <= 120),
  add column if not exists pac_type                  text check (pac_type is null or pac_type in ('federal','state','super','hybrid','carey','leadership','other')),
  add column if not exists pac_type_other            text check (char_length(pac_type_other) <= 120),
  add column if not exists pac_scope                 text check (pac_scope is null or pac_scope in ('federal','multi-state','state','local')),
  add column if not exists pac_state                 text check (char_length(pac_state) <= 60),
  add column if not exists pac_states                text check (char_length(pac_states) <= 500),
  add column if not exists pac_city_county           text check (char_length(pac_city_county) <= 120),
  add column if not exists pac_year_established      text check (pac_year_established ~ '^[0-9]{4}$'),
  add column if not exists pac_mission               text check (char_length(pac_mission) <= 500),
  add column if not exists pac_ie_only               text check (pac_ie_only is null or pac_ie_only in ('yes','no')),
  add column if not exists pac_connected_status      text check (pac_connected_status is null or pac_connected_status in ('connected','non-connected','na')),
  add column if not exists pac_fec_registration_status text check (pac_fec_registration_status is null or pac_fec_registration_status in ('registered','in-progress','not-yet','na-state-only')),
  add column if not exists pac_spokesperson          text check (char_length(pac_spokesperson) <= 120),
  add column if not exists pac_founding_stories      text check (char_length(pac_founding_stories) <= 500),
  add column if not exists pac_founding_story_other  text check (char_length(pac_founding_story_other) <= 200),
  add column if not exists pac_issue_focus           text check (char_length(pac_issue_focus) <= 500),
  add column if not exists pac_issue_focus_other     text check (char_length(pac_issue_focus_other) <= 200),
  add column if not exists pac_target_donors         text check (char_length(pac_target_donors) <= 500),
  add column if not exists pac_target_donor_other    text check (char_length(pac_target_donor_other) <= 200),
  add column if not exists pac_affiliated_candidates text check (char_length(pac_affiliated_candidates) <= 500),
  add column if not exists pac_coalitions            text check (char_length(pac_coalitions) <= 500);

-- Nonprofit columns
alter table brand_submissions
  add column if not exists nonprofit_legal_name              text check (char_length(nonprofit_legal_name) <= 120),
  add column if not exists nonprofit_type                    text check (nonprofit_type is null or nonprofit_type in ('c3','c4','c6','527','other')),
  add column if not exists nonprofit_type_other              text check (char_length(nonprofit_type_other) <= 120),
  add column if not exists nonprofit_scope                   text check (nonprofit_scope is null or nonprofit_scope in ('national','multi-state','state','local')),
  add column if not exists nonprofit_state                   text check (char_length(nonprofit_state) <= 60),
  add column if not exists nonprofit_states                  text check (char_length(nonprofit_states) <= 500),
  add column if not exists nonprofit_city_county             text check (char_length(nonprofit_city_county) <= 120),
  add column if not exists nonprofit_founded_year            text check (nonprofit_founded_year ~ '^[0-9]{4}$'),
  add column if not exists nonprofit_mission                 text check (char_length(nonprofit_mission) <= 500),
  add column if not exists nonprofit_membership_based        text check (nonprofit_membership_based is null or nonprofit_membership_based in ('yes','no')),
  add column if not exists nonprofit_lobbying_activity       text check (nonprofit_lobbying_activity is null or nonprofit_lobbying_activity in ('none','insubstantial','501h-elected','primary-purpose-c4','na')),
  add column if not exists nonprofit_irs_determination_status text check (nonprofit_irs_determination_status is null or nonprofit_irs_determination_status in ('approved','pending','revoked','fiscally-sponsored','na')),
  add column if not exists nonprofit_spokesperson            text check (char_length(nonprofit_spokesperson) <= 120),
  add column if not exists nonprofit_founding_stories        text check (char_length(nonprofit_founding_stories) <= 500),
  add column if not exists nonprofit_founding_story_other    text check (char_length(nonprofit_founding_story_other) <= 200),
  add column if not exists nonprofit_cause_areas             text check (char_length(nonprofit_cause_areas) <= 500),
  add column if not exists nonprofit_cause_area_other        text check (char_length(nonprofit_cause_area_other) <= 200),
  add column if not exists nonprofit_audiences               text check (char_length(nonprofit_audiences) <= 500),
  add column if not exists nonprofit_audience_other          text check (char_length(nonprofit_audience_other) <= 200),
  add column if not exists nonprofit_tone_anchor             text check (nonprofit_tone_anchor is null or nonprofit_tone_anchor in ('advocacy','service','research','member','donor')),
  add column if not exists nonprofit_coalitions              text check (char_length(nonprofit_coalitions) <= 500);
