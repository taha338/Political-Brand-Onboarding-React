/**
 * PacProfileForm
 * Stage 2 form when subjectType === 'pac'. Captures the founding
 * story, issue focus, target donor segments, and allied committees
 * that shape the PAC's brand voice.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import {
  PAC_FOUNDING_STORIES,
  PAC_ISSUE_FOCUS,
  PAC_TARGET_DONORS,
} from '../../data/brandData';
import { sanitizeFreeText, sanitizeShortText } from '../../utils/sanitize';

const PRIMARY = '#8B1A2B';
const NAVY = '#1C2E5B';
const BORDER = '#E5E7EB';

function SectionHeader({ index, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: PRIMARY, margin: 0,
      }}>Section {index}</p>
      <h3 style={{
        fontSize: '1.35rem', fontWeight: 700, color: NAVY,
        margin: '6px 0 4px', lineHeight: 1.2,
      }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function ChoiceCard({ option, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, padding: '14px 16px',
        borderRadius: 10,
        background: selected ? PRIMARY : '#fff',
        border: `1px solid ${selected ? PRIMARY : BORDER}`,
        color: selected ? '#fff' : NAVY,
        cursor: 'pointer',
        textAlign: 'left',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 4px 14px rgba(139,26,43,0.22)' : 'none',
      }}
    >
      <span>{option.label}</span>
      {selected && (
        <span style={{
          width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800,
        }}>✓</span>
      )}
    </button>
  );
}

function OtherInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem',
        border: `1px solid ${PRIMARY}`, borderRadius: 12, outline: 'none',
        color: NAVY, boxShadow: `0 0 0 3px ${PRIMARY}20`,
      }}
    />
  );
}

export default function PacProfileForm() {
  const { state, dispatch } = useBrand();
  const { profile, pac } = state;

  const update = (payload) => dispatch({ type: 'UPDATE_PROFILE', payload });

  const pacName = pac?.legalName || 'Your PAC';

  const stories = profile.pacFoundingStories || [];
  const toggleStory = (id) => {
    if (stories.includes(id)) {
      update({ pacFoundingStories: stories.filter((s) => s !== id), ...(id === 'other' ? { pacFoundingStoryOther: '' } : {}) });
    } else {
      update({ pacFoundingStories: [...stories, id] });
    }
  };

  const issues = profile.pacIssueFocus || [];
  const toggleIssue = (id) => {
    if (issues.includes(id)) {
      update({ pacIssueFocus: issues.filter((s) => s !== id), ...(id === 'other' ? { pacIssueFocusOther: '' } : {}) });
    } else {
      update({ pacIssueFocus: [...issues, id] });
    }
  };

  const donors = profile.pacTargetDonors || [];
  const toggleDonor = (id) => {
    if (donors.includes(id)) {
      update({ pacTargetDonors: donors.filter((s) => s !== id), ...(id === 'other' ? { pacTargetDonorOther: '' } : {}) });
    } else {
      update({ pacTargetDonors: [...donors, id] });
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 36 }}
      >
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.15,
        }}>
          {pacName}'s Profile
        </h1>
        <p style={{ marginTop: 8, color: '#6B7280', fontSize: '1rem', maxWidth: 600 }}>
          Where you came from, what you fight for, and who funds the fight. These shape your brand voice.
        </p>
      </motion.div>

      {/* SECTION 1: Founding story */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="01"
          title="Founding Story"
          subtitle="How did this committee come together? Select all that apply."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 10,
        }}>
          {PAC_FOUNDING_STORIES.map((s) => (
            <ChoiceCard
              key={s.id}
              option={s}
              selected={stories.includes(s.id)}
              onClick={() => toggleStory(s.id)}
            />
          ))}
        </div>
        <AnimatePresence>
          {stories.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <OtherInput
                value={profile.pacFoundingStoryOther}
                onChange={(e) => update({ pacFoundingStoryOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe your founding story..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 2: Issue focus */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="02"
          title="Issue Focus"
          subtitle="The issues this PAC fights for. Drives headline tone, color cues, and copy."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
        }}>
          {PAC_ISSUE_FOCUS.map((p) => (
            <ChoiceCard
              key={p.id}
              option={p}
              selected={issues.includes(p.id)}
              onClick={() => toggleIssue(p.id)}
            />
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {issues.length} selected
        </p>
        <AnimatePresence>
          {issues.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <OtherInput
                value={profile.pacIssueFocusOther}
                onChange={(e) => update({ pacIssueFocusOther: sanitizeShortText(e.target.value) })}
                placeholder="Other issues..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 3: Target donors */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="03"
          title="Target Donor Segments"
          subtitle="Who you raise from. Drives whether the look reads grassroots-rally or institutional-boardroom."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
        }}>
          {PAC_TARGET_DONORS.map((s) => (
            <ChoiceCard
              key={s.id}
              option={s}
              selected={donors.includes(s.id)}
              onClick={() => toggleDonor(s.id)}
            />
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {donors.length} selected
        </p>
        <AnimatePresence>
          {donors.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <OtherInput
                value={profile.pacTargetDonorOther}
                onChange={(e) => update({ pacTargetDonorOther: sanitizeShortText(e.target.value) })}
                placeholder="Other donor segment..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 4: Affiliated candidates */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ marginBottom: 36 }}
      >
        <SectionHeader
          index="04"
          title="Candidates / Causes You Back"
          subtitle="Free text — name names. Helps us know whose orbit the brand should fit into."
        />
        <textarea
          value={profile.pacAffiliatedCandidates || ''}
          onChange={(e) => update({ pacAffiliatedCandidates: sanitizeFreeText(e.target.value) })}
          placeholder="e.g. Sen. Jane Doe (US Senate FL), 2026 freshman House class, [Local] Sheriffs Coalition..."
          rows={3}
          style={{
            width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem',
            fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
            border: `1px solid ${BORDER}`, borderRadius: 12, outline: 'none',
            color: NAVY, resize: 'vertical', background: '#fff',
          }}
          onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}30`; }}
          onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
        />
      </motion.section>

      {/* SECTION 5: Coalitions */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginBottom: 24 }}
      >
        <SectionHeader
          index="05"
          title="Allied Committees & Partners"
          subtitle="Other PACs, 501(c)(4)s, trade associations, or movement orgs you coordinate with (optional)."
        />
        <textarea
          value={profile.pacCoalitions || ''}
          onChange={(e) => update({ pacCoalitions: sanitizeFreeText(e.target.value) })}
          placeholder="e.g. America First Inc., Heritage Action, [State] Realtors PAC..."
          rows={3}
          style={{
            width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem',
            fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
            border: `1px solid ${BORDER}`, borderRadius: 12, outline: 'none',
            color: NAVY, resize: 'vertical', background: '#fff',
          }}
          onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}30`; }}
          onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
        />
      </motion.section>
    </div>
  );
}
