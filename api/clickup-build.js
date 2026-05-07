/**
 * Build ClickUp custom_fields[] for the Political Brand Onboarding Form
 * list from sanitized form `payload` + raw `state` (needed for nested objects
 * like customColors, customFonts, profile arrays). Mirrors campaign-intake
 * pattern. Drop-downs are sent as orderindex INTEGERS.
 */

import { FIELD_IDS, FIELD_TYPES, PRIMARY_LIST_ID } from './clickup-field-map.js';

const empty = (v) =>
  v === undefined || v === null ||
  (typeof v === 'string' && v.trim() === '') ||
  (Array.isArray(v) && v.length === 0);

export async function getDropdownOptionsMap() {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) throw new Error('CLICKUP_API_TOKEN missing');
  const r = await fetch(
    `https://api.clickup.com/api/v2/list/${PRIMARY_LIST_ID}/field`,
    { headers: { Authorization: token } },
  );
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`ClickUp list fields ${r.status}: ${data?.err || ''}`);
  const map = {};
  for (const f of data.fields || []) {
    if (f.type === 'drop_down' || f.type === 'labels') {
      map[f.id] = f.type_config?.options || [];
    }
  }
  return map;
}

function resolveOption(raw, options) {
  if (!options || !options.length) return null;
  const norm = (s) => String(s ?? '').trim().toLowerCase();
  const target = norm(raw);
  if (!target) return null;
  const byId = options.find((o) => o.id === raw);
  if (byId) return byId.orderindex;
  const byName = options.find((o) => norm(o.name) === target);
  if (byName) return byName.orderindex;
  if (/^\d+$/.test(target)) {
    const byIdx = options.find((o) => Number(o.orderindex) === Number(target));
    if (byIdx) return byIdx.orderindex;
  }
  return null;
}

function resolveLabels(raw, options) {
  if (!options || !options.length) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  const norm = (s) => String(s ?? '').trim().toLowerCase();
  const ids = [];
  for (const v of arr) {
    if (empty(v)) continue;
    const opt = options.find((o) =>
      o.id === v ||
      norm(o.name) === norm(v) ||
      norm(o.label) === norm(v),
    );
    if (opt) ids.push(opt.id);
  }
  return ids;
}

/**
 * Translate form state → flat {fieldName: value} map. Handles the nested
 * shape (candidate.*, party.*, profile.*, customColors.*, customFonts.*).
 */
function flattenState(state, payload) {
  const candidate    = state.candidate    || {};
  const party        = state.party        || {};
  const profile      = state.profile      || {};
  const customColors = state.customColors || {};
  const customFonts  = state.customFonts  || {};
  const subjectType  = payload.subject_type;

  const out = {
    // Candidate
    'Race Focus':              subjectType === 'candidate' ? candidate.raceFocus : null,
    'Candidate Type':          subjectType === 'candidate' ? candidate.candidateType : null,
    'Party Affiliation (brand)': subjectType === 'candidate' ? candidate.partyAffiliation : null,
    // Party
    'Party Acronym (brand)':   subjectType === 'party' ? party.acronym : null,
    // Profile (candidate-mode + party-mode)
    'Professional Backgrounds': profile.backgrounds,
    'Background Other':         profile.backgroundOther,
    'Policy Priorities (ranked)': Array.isArray(profile.policyPriorities)
      ? profile.policyPriorities.join(', ') : profile.policyPriorities,
    'Policy Other':             profile.policyOther,
    'Founding Story':           subjectType === 'party' ? profile.foundingStory : null,
    'Founding Story Other':     profile.foundingStoryOther,
    'Platform Pillars':         profile.platformPillars,
    'Platform Pillar Other':    profile.platformPillarOther,
    'Target Voter Segments':    profile.targetSegments,
    'Target Segment Other':     profile.targetSegmentOther,
    'Coalitions / Partners':    profile.coalitions,
    // Brand
    'Brand Core':               state.brandCore,
    'Sub-Direction(s)':         Array.isArray(state.subDirection)
      ? state.subDirection.join(', ') : state.subDirection,
    // Logo
    'Has Existing Logo?':       state.hasExistingLogo === true ? 'Yes'
                                : state.hasExistingLogo === false ? 'No' : null,
    'Logo Type Preference':     state.hasExistingLogo ? null : state.logoType,
    'Logo Notes':               state.logoNotes,
    // Colors
    'Color Mode':               state.colorMode,
    'Color Primary':            customColors.primary,
    'Color Secondary':          customColors.secondary,
    'Color Accent':             customColors.accent,
    'Color Background':         customColors.background,
    'Color Text':               customColors.text,
    'Color Highlight':          customColors.additional,
    // Fonts
    'Heading Font':             customFonts.heading,
    'Body Font':                customFonts.body,
  };
  return out;
}

export function buildCustomFields(state, payload, optionsMap = {}) {
  const flat = flattenState(state, payload);
  const out = [];
  const unresolved = [];

  for (const [name, raw] of Object.entries(flat)) {
    if (empty(raw)) continue;
    const fid = FIELD_IDS[name];
    if (!fid) continue;
    const type = FIELD_TYPES[name];
    if (type === 'attachment') continue;

    let value = raw;
    if (type === 'date') {
      const d = new Date(`${String(raw).slice(0, 10)}T12:00:00Z`);
      if (isNaN(d.getTime())) continue;
      value = d.getTime();
    } else if (type === 'drop_down') {
      const idx = resolveOption(raw, optionsMap[fid]);
      if (idx === null || idx === undefined) {
        unresolved.push({ fieldName: name, fieldId: fid, value: String(raw) });
        continue;
      }
      value = idx;
    } else if (type === 'labels') {
      const ids = resolveLabels(raw, optionsMap[fid]);
      if (!ids.length) continue;
      value = ids;
    } else if (type === 'number' || type === 'currency') {
      const n = Number(raw);
      if (!Number.isFinite(n)) continue;
      value = n;
    } else {
      // short_text / text / url / email / phone
      if (Array.isArray(raw)) {
        value = raw.filter((x) => !empty(x)).join(', ');
        if (!value) continue;
      } else if (typeof raw === 'object') {
        value = JSON.stringify(raw);
      } else {
        value = String(raw).trim();
      }
      if (!value) continue;
    }
    out.push({ id: fid, value });
  }
  return { fields: out, unresolved };
}
