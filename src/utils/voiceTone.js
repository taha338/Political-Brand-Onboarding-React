/**
 * Returns the brand-core voice/tone object adjusted for the current
 * subject (candidate vs party) and substitutes [Name], [Party],
 * [State], [District] placeholders with concrete values from state.
 *
 * For party mode, fields defined under coreData.voiceTone.party
 * override the candidate defaults (headlineStyle, headlineExamples,
 * bodyCopy, ctaLanguage). Vocabulary and `avoid` lists carry over.
 */
export function getResolvedVoiceTone(coreData, state) {
  if (!coreData?.voiceTone) return null;
  const base = coreData.voiceTone;
  const subjectType = state?.subjectType === 'party' ? 'party' : 'candidate';
  const overrides = subjectType === 'party' ? (base.party || {}) : {};

  const merged = {
    headlineStyle:    overrides.headlineStyle    ?? base.headlineStyle,
    headlineExamples: overrides.headlineExamples ?? base.headlineExamples,
    bodyCopy:         overrides.bodyCopy         ?? base.bodyCopy,
    ctaLanguage:      overrides.ctaLanguage      ?? base.ctaLanguage,
    vocabulary:       base.vocabulary,
    avoid:            base.avoid,
  };

  // Build replacement tokens.
  const candidate = state?.candidate || {};
  const party     = state?.party     || {};
  const partyName = party.name || party.acronym || 'the Party';

  const replacements = {
    '[Name]':     subjectType === 'party' ? partyName : (candidate.fullName || 'Candidate'),
    '[NAME]':     subjectType === 'party' ? partyName.toUpperCase() : (candidate.fullName || 'Candidate').toUpperCase(),
    '[Party]':    partyName,
    '[State]':    subjectType === 'party' ? (party.state || 'the State') : (candidate.state || 'the State'),
    '[District]': candidate.district || (subjectType === 'party' ? 'the State' : 'the District'),
    '[First Name]': subjectType === 'party'
      ? (party.acronym || partyName.split(' ')[0])
      : ((candidate.fullName || 'Candidate').split(' ')[0]),
  };

  const sub = (str) => {
    if (typeof str !== 'string') return str;
    let out = str;
    for (const [token, value] of Object.entries(replacements)) {
      out = out.split(token).join(value);
    }
    return out;
  };

  return {
    ...merged,
    headlineExamples: (merged.headlineExamples || []).map(sub),
    ctaLanguage:      (merged.ctaLanguage      || []).map(sub),
    headlineStyle:    sub(merged.headlineStyle),
    bodyCopy:         sub(merged.bodyCopy),
  };
}
