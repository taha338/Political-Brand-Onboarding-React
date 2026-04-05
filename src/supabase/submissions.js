import { getSupabaseClient } from './client';

/**
 * Save a completed brand discovery submission to Supabase.
 * @param {Object} state - The full BrandContext state at time of submission
 * @returns {{ data, error }}
 */
export async function saveSubmission(state) {
  const candidate = state.candidate || {};
  const profile = state.profile || {};
  const customColors = state.customColors || {};
  const customFonts = state.customFonts || {};
  const collateral = Array.isArray(state.collateralPriorities) ? state.collateralPriorities : [];

  const payload = {
    // Candidate basics
    candidate_name:         candidate.fullName || null,
    candidate_office:       candidate.office || null,
    candidate_office_custom: candidate.officeCustom || null,
    candidate_state:        candidate.state || null,
    candidate_district:     candidate.district || null,
    election_year:          candidate.electionYear || null,
    party_affiliation:      candidate.partyAffiliation || null,
    race_focus:             candidate.raceFocus || null,
    candidate_type:         candidate.candidateType || null,

    // Profile — flattened to readable text
    backgrounds:       toCSV(profile.backgrounds),
    policy_priorities: toCSV(profile.policyPriorities),
    defining_story:    profile.definingStory || null,
    family_status:     profile.familyStatus || null,
    endorsements:      toCSV(profile.endorsements),

    // Brand selections
    brand_core:    state.brandCore || null,
    sub_direction: state.subDirection || null,
    color_mode:    state.colorMode || null,
    logo_type:     state.logoType || null,

    // Colors
    color_primary:    customColors.primary || null,
    color_secondary:  customColors.secondary || null,
    color_accent:     customColors.accent || null,
    color_background: customColors.background || null,
    color_text:       customColors.text || null,
    color_highlight:  customColors.additional || null,

    // Fonts
    font_heading: customFonts.heading || null,
    font_body:    customFonts.body || null,

    // Collateral
    collateral_items: collateral.length > 0
      ? collateral.map((id) => id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(', ')
      : null,
    collateral_total: collateral.length > 0 ? collateral.length * 350 : null,

    // Full snapshot for archival
    full_data: state,
  };

  const { data, error } = await getSupabaseClient()
    .from('brand_submissions')
    .insert([payload])
    .select()
    .single();

  return { data, error };
}

/** Convert an array of strings or objects (with .label) to a comma-separated string */
function toCSV(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr
    .map((item) => (typeof item === 'string' ? item : item?.label || item?.id || ''))
    .filter(Boolean)
    .join(', ');
}
