import { getSupabaseClient } from './client';
import {
  sanitizeName,
  sanitizeShortText,
  sanitizeDistrict,
  sanitizeFreeText,
} from '../utils/sanitize';

/**
 * Save a completed brand discovery submission to Supabase.
 * All user-supplied text is sanitized before insert.
 * @param {Object} state - The full BrandContext state at time of submission
 * @returns {{ data, error }}
 */
export async function saveSubmission(state) {
  const candidate    = state.candidate    || {};
  const party        = state.party        || {};
  const profile      = state.profile      || {};
  const customColors = state.customColors || {};
  const customFonts  = state.customFonts  || {};
  const subjectType  = state.subjectType === 'party' ? 'party' : 'candidate';

  // ── Allowed value sets (whitelist) ───────────────────────────
  const VALID_SUBJECT_TYPES = ['candidate','party'];
  const VALID_PARTY_TYPES   = ['republican','america-first','non-partisan','independent','third-party','coalition','other'];
  const VALID_PARTY_SCOPES  = ['national','multi-state','state','local'];
  const VALID_BRAND_CORES = ['commander','patriot','reformer','community','executive','nonpartisan'];
  const VALID_LOGO_TYPES  = ['emblem','symbol-text','monogram','wordmark'];
  const VALID_RACE_FOCUS  = ['primary','general','runoff'];
  const HEX_PATTERN       = /^#[0-9A-Fa-f]{6}$/;
  const YEAR_PATTERN      = /^[0-9]{4}$/;

  function safeHex(val)  { return HEX_PATTERN.test(val)  ? val : null; }
  function safeYear(val) { return YEAR_PATTERN.test(val) ? val : null; }
  function safeEnum(val, allowed) { return allowed.includes(val) ? val : null; }

  function safeFont(val) {
    if (!val || typeof val !== 'string') return null;
    return val.replace(/[^a-zA-Z0-9\s\-]/g, '').slice(0, 80) || null;
  }

  // ── Build sanitized payload ──────────────────────────────────
  const payload = {
    // Subject type discriminator — distinguishes candidate vs party submissions.
    subject_type:            safeEnum(subjectType, VALID_SUBJECT_TYPES),

    // Candidate basics (populated only when subjectType === 'candidate')
    candidate_name:          sanitizeName(candidate.fullName),
    candidate_office:        sanitizeShortText(candidate.office),
    candidate_office_custom: sanitizeShortText(candidate.officeCustom),
    candidate_state:         sanitizeShortText(candidate.state),
    candidate_district:      sanitizeDistrict(candidate.district),
    election_year:           safeYear(candidate.electionYear),
    party_affiliation:       sanitizeShortText(candidate.partyAffiliation),
    race_focus:              safeEnum(candidate.raceFocus, VALID_RACE_FOCUS),
    candidate_type:          sanitizeShortText(candidate.candidateType),

    // Party basics (populated only when subjectType === 'party')
    party_name:              sanitizeName(party.name),
    party_acronym:           sanitizeShortText(party.acronym),
    party_type:              safeEnum(party.partyType, VALID_PARTY_TYPES),
    party_type_other:        sanitizeShortText(party.partyTypeOther),
    party_scope:             safeEnum(party.scope, VALID_PARTY_SCOPES),
    party_state:             sanitizeShortText(party.state),
    party_states:            toCSV(party.states),
    party_city_county:       sanitizeShortText(party.cityCounty),
    party_founded_year:      safeYear(party.foundedYear),
    party_spokesperson:      sanitizeName(party.spokesperson),

    // Candidate profile
    backgrounds:       toCSV(profile.backgrounds),
    background_other:  sanitizeFreeText(profile.backgroundOther),
    policy_priorities: toCSV(profile.policyPriorities),
    policy_other:      sanitizeFreeText(profile.policyOther),

    // Party profile
    party_founding_story:        sanitizeShortText(profile.foundingStory),
    party_founding_story_other:  sanitizeFreeText(profile.foundingStoryOther),
    party_platform_pillars:      toCSV(profile.platformPillars),
    party_platform_pillar_other: sanitizeFreeText(profile.platformPillarOther),
    party_target_segments:       toCSV(profile.targetSegments),
    party_target_segment_other:  sanitizeFreeText(profile.targetSegmentOther),
    party_coalitions:            sanitizeFreeText(profile.coalitions),

    // Brand selections
    brand_core:         safeEnum(state.brandCore, VALID_BRAND_CORES),
    sub_direction:      Array.isArray(state.subDirection)
                          ? toCSV(state.subDirection)
                          : sanitizeShortText(state.subDirection),
    logo_type:          state.hasExistingLogo ? null : safeEnum(state.logoType, VALID_LOGO_TYPES),
    has_existing_logo:  state.hasExistingLogo ?? null,
    existing_logo_url:  state.existingLogoUrl || null,
    logo_notes:         sanitizeFreeText(state.logoNotes || '')?.slice(0, 100) || null,

    // Colors — column names must match the schema exactly
    color_mode:       state.colorMode || null,
    color_primary:    safeHex(customColors.primary),
    color_secondary:  safeHex(customColors.secondary),
    color_accent:     safeHex(customColors.accent),
    color_background: safeHex(customColors.background),
    color_text:       safeHex(customColors.text),
    color_highlight:  safeHex(customColors.additional),

    // Fonts
    font_heading: safeFont(customFonts.heading),
    font_body:    safeFont(customFonts.body),

    // Full snapshot
    full_data: buildSafeSnapshot(state),
  };

  // ── Guard: require minimum valid data ────────────────────────
  if (subjectType === 'party') {
    if (!payload.party_name || payload.party_name.trim().length < 2) {
      return { data: null, error: { message: 'Party / organization name is required.' } };
    }
  } else if (!payload.candidate_name || payload.candidate_name.trim().length < 2) {
    return { data: null, error: { message: 'Candidate name is required.' } };
  }
  if (!payload.brand_core) {
    return { data: null, error: { message: 'Brand core selection is required.' } };
  }

  const { data, error } = await getSupabaseClient()
    .from('brand_submissions')
    .insert([payload])
    .select()
    .single();

  return { data, error };
}

function buildSafeSnapshot(state) {
  return {
    subjectType:          state.subjectType  || 'candidate',
    candidate:            state.candidate    || {},
    party:                state.party        || {},
    profile:              state.profile      || {},
    brandCore:            state.brandCore    || null,
    subDirection:         state.subDirection || null,
    customColors:         state.customColors || {},
    customFonts:          state.customFonts  || {},
    hasExistingLogo:      state.hasExistingLogo ?? null,
    existingLogoUrl:      state.existingLogoUrl  || null,
    logoType:             state.logoType     || null,
    logoNotes:            sanitizeFreeText(state.logoNotes || '')?.slice(0, 100) || null,
    collateralPriorities: Array.isArray(state.collateralPriorities)
      ? state.collateralPriorities
      : [],
  };
}

function toCSV(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr
    .map(item => {
      const val = typeof item === 'string' ? item : item?.label || item?.id || '';
      return sanitizeShortText(val);
    })
    .filter(Boolean)
    .join(', ')
    .slice(0, 500) || null;
}
