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
  const profile      = state.profile      || {};
  const customColors = state.customColors || {};
  const customFonts  = state.customFonts  || {};
  const collateral   = Array.isArray(state.collateralPriorities)
    ? state.collateralPriorities
    : [];

  // ── Allowed value sets (whitelist) ───────────────────────────
  const VALID_BRAND_CORES  = ['commander','patriot','reformer','community','executive'];
  const VALID_COLOR_MODES  = ['theme','custom'];
  const VALID_LOGO_TYPES   = ['emblem','symbol-text','monogram','wordmark'];
  const VALID_RACE_FOCUS   = ['primary','general','runoff'];
  const HEX_PATTERN        = /^#[0-9A-Fa-f]{6}$/;
  const YEAR_PATTERN        = /^[0-9]{4}$/;

  function safeHex(val)  { return HEX_PATTERN.test(val)  ? val  : null; }
  function safeYear(val) { return YEAR_PATTERN.test(val) ? val  : null; }
  function safeEnum(val, allowed) { return allowed.includes(val) ? val : null; }

  // ── Safe font name (letters, spaces, digits, hyphens only) ──
  function safeFont(val) {
    if (!val || typeof val !== 'string') return null;
    return val.replace(/[^a-zA-Z0-9\s\-]/g, '').slice(0, 80) || null;
  }

  // ── Build sanitized payload ──────────────────────────────────
  const payload = {
    // Candidate basics — sanitized
    candidate_name:          sanitizeName(candidate.fullName),
    candidate_office:        sanitizeShortText(candidate.office),
    candidate_office_custom: sanitizeShortText(candidate.officeCustom),
    candidate_state:         sanitizeShortText(candidate.state),
    candidate_district:      sanitizeDistrict(candidate.district),
    election_year:           safeYear(candidate.electionYear),
    party_affiliation:       sanitizeShortText(candidate.partyAffiliation),
    race_focus:              safeEnum(candidate.raceFocus, VALID_RACE_FOCUS),
    candidate_type:          sanitizeShortText(candidate.candidateType),

    // Candidate profile — sanitized
    backgrounds:      toCSV(profile.backgrounds),
    background_other: sanitizeFreeText(profile.backgroundOther),
    policy_priorities:toCSV(profile.policyPriorities),
    policy_other:     sanitizeFreeText(profile.policyOther),
    defining_story:   sanitizeFreeText(profile.definingStory),
    family_status:    sanitizeShortText(profile.familyStatus),
    endorsements:     toCSV(profile.endorsements),

    // Brand selections — whitelisted enums
    brand_core:    safeEnum(state.brandCore,   VALID_BRAND_CORES),
    sub_direction: sanitizeShortText(state.subDirection),
    color_mode:    safeEnum(state.colorMode,   VALID_COLOR_MODES),
    logo_type:     safeEnum(state.logoType,    VALID_LOGO_TYPES),

    // Colors — must be valid hex or null
    color_primary:    safeHex(customColors.primary),
    color_secondary:  safeHex(customColors.secondary),
    color_accent:     safeHex(customColors.accent),
    color_background: safeHex(customColors.background),
    color_text:       safeHex(customColors.text),
    color_highlight:  safeHex(customColors.additional),

    // Fonts — safe font names only
    font_heading: safeFont(customFonts.heading),
    font_body:    safeFont(customFonts.body),

    // Collateral
    collateral_items: collateral.length > 0
      ? collateral
          .map(id => sanitizeShortText(id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())))
          .join(', ')
          .slice(0, 500)
      : null,
    collateral_total: collateral.length > 0
      ? Math.min(collateral.length * 350, 100000)
      : null,

    // Full snapshot — strip any fields that shouldn't be stored
    full_data: buildSafeSnapshot(state),
  };

  // ── Guard: require minimum valid data ────────────────────────
  if (!payload.candidate_name || payload.candidate_name.trim().length < 2) {
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

/**
 * Build a clean, size-safe JSON snapshot of state for archival.
 * Strips internal React/UI state that doesn't need to be stored.
 */
function buildSafeSnapshot(state) {
  return {
    candidate:            state.candidate    || {},
    profile:              state.profile      || {},
    brandCore:            state.brandCore    || null,
    subDirection:         state.subDirection || null,
    colorMode:            state.colorMode    || null,
    customColors:         state.customColors || {},
    customFonts:          state.customFonts  || {},
    hasExistingLogo:      state.hasExistingLogo ?? null,
    logoType:             state.logoType     || null,
    collateralPriorities: Array.isArray(state.collateralPriorities)
      ? state.collateralPriorities
      : [],
    // Deliberately excluded: currentStage, completedStages, websiteCopy
    // (internal UI state, not needed for archival)
  };
}

/** Convert an array of strings or objects to a comma-separated string */
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
