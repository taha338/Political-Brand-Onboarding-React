import { useEffect, useState } from 'react';
import { useBrand } from '../context/BrandContext';

const isDevMode = () => {
  const params = new URLSearchParams(window.location.search);
  return ['1', 'true', 'on', 'yes'].includes((params.get('dev') || '').toLowerCase());
};

function fillAll(dispatch, subjectType) {
  // 1. Subject type
  dispatch({ type: 'SET_SUBJECT_TYPE', payload: subjectType });

  // 2. Candidate or party basics
  if (subjectType === 'candidate') {
    dispatch({
      type: 'UPDATE_CANDIDATE',
      payload: {
        fullName: 'Jane Quincy Test',
        office: 'state-senate',
        officeCustom: '',
        state: 'IL',
        district: '12',
        electionYear: '2026',
        raceFocus: 'general',
        candidateType: 'challenger',
        partyAffiliation: 'Republican',
      },
    });
  } else {
    dispatch({
      type: 'UPDATE_PARTY',
      payload: {
        name: 'Test Liberty Party',
        acronym: 'TLP',
        partyType: 'third-party',
        partyTypeOther: '',
        scope: 'state',
        state: 'IL',
        states: [],
        cityCounty: '',
        foundedYear: '2020',
        spokesperson: 'Pat Spokesperson',
      },
    });
  }

  // 3. Profile (subject-conditional)
  if (subjectType === 'candidate') {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        backgrounds: ['business', 'community-leader'],
        backgroundOther: '',
        policyPriorities: ['economy', 'public-safety', 'education'],
        policyOther: '',
      },
    });
  } else {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        foundingStory: 'grassroots',
        foundingStoryOther: '',
        platformPillars: ['liberty', 'fiscal-responsibility', 'localism'],
        platformPillarOther: '',
        targetSegments: ['independent-voters', 'small-business'],
        targetSegmentOther: '',
        coalitions: 'Test Coalition for Local Liberty; Sample Civic League',
      },
    });
  }

  // 4. Brand core + sub direction
  dispatch({ type: 'SET_BRAND_CORE', payload: 'commander' });
  dispatch({ type: 'SET_SUB_DIRECTION', payload: 'iron-commander' });

  // 5. Color mode (use the brand-core preset)
  dispatch({ type: 'SET_COLOR_MODE', payload: 'preset' });

  // 6. Custom fonts (optional override; harmless to leave at preset, but
  // setting null-or-defaults so Stage 6 has something to render)
  dispatch({ type: 'SET_CUSTOM_FONTS', payload: { heading: null, body: null } });

  // 7. Logo status — pretend they have an existing logo for richer testing
  dispatch({
    type: 'SET_LOGO_STATUS',
    payload: {
      hasExistingLogo: true,
      existingLogoUrl: 'https://example.com/test-logo.png',
      logoNotes: 'Existing logo — open to a refresh if it improves consistency.',
    },
  });

  // 8. Logo type
  dispatch({ type: 'SET_LOGO_TYPE', payload: 'wordmark' });

  // 9. Collateral priorities — pick a sensible default set
  dispatch({
    type: 'SET_COLLATERAL_PRIORITIES',
    payload: ['yard-signs', 'social-media-templates', 'direct-mail'],
  });
}

export default function AutofillButton() {
  const { state, dispatch } = useBrand();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => { setEnabled(isDevMode()); }, []);

  if (!enabled) return null;

  const fill = (subjectType) => {
    fillAll(dispatch, subjectType);
    setToast(`✓ Autofilled (${subjectType})`);
    setTimeout(() => setToast(''), 2000);
  };

  const handleClick = () => {
    const params = new URLSearchParams(window.location.search);
    const urlSubject = (params.get('subject') || '').toLowerCase();
    if (urlSubject === 'candidate' || urlSubject === 'party') {
      fill(urlSubject);
      return;
    }
    if (state.subjectType === 'candidate' || state.subjectType === 'party') {
      fill(state.subjectType);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Fill all form fields with test data (dev mode only)"
        style={{
          position: 'fixed', top: 12, right: 12, zIndex: 9999,
          background: '#7c3aed', color: '#fff', border: 'none',
          padding: '8px 14px', borderRadius: 8, fontSize: 12,
          fontWeight: 700, letterSpacing: '0.05em',
          textTransform: 'uppercase', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        🧪 Autofill (Test)
      </button>

      {toast && (
        <div style={{
          position: 'fixed', top: 56, right: 12, zIndex: 9999,
          background: '#10b981', color: '#fff',
          padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>{toast}</div>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 12, padding: 24, minWidth: 320,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#111' }}>
              Autofill: subject type?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={() => { setOpen(false); fill('candidate'); }}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #1C2E5B', background: '#1C2E5B', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >Candidate</button>
              <button
                type="button"
                onClick={() => { setOpen(false); fill('party'); }}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #B22234', background: '#B22234', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >Party</button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ marginTop: 12, padding: '8px', width: '100%', background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 13 }}
            >Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
