/**
 * PartyProfileForm
 * Stage 2 form when subjectType === 'party'. Captures the founding
 * story, platform pillars, target voter segments, and coalition
 * partners that shape the party's brand voice.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import {
  PARTY_FOUNDING_STORIES,
  PARTY_PLATFORM_PILLARS,
  PARTY_TARGET_SEGMENTS,
} from '../../data/brandData';
import { sanitizeFreeText, sanitizeShortText } from '../../utils/sanitize';

const PRIMARY = '#8B1A2B';
const NAVY = '#1C2E5B';
const BORDER = '#E5E7EB';

function SectionHeader({ index, title, subtitle, max }) {
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
      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
        {subtitle}{max ? ` Choose up to ${max}.` : ''}
      </p>
    </div>
  );
}

function ChoiceCard({ option, selected, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, padding: '14px 16px',
        borderRadius: 10,
        background: selected ? PRIMARY : '#fff',
        border: `1px solid ${selected ? PRIMARY : BORDER}`,
        color: selected ? '#fff' : (disabled ? '#9CA3AF' : NAVY),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
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

export default function PartyProfileForm() {
  const { state, dispatch } = useBrand();
  const { profile, party } = state;

  const update = (payload) => dispatch({ type: 'UPDATE_PROFILE', payload });

  const partyName = party?.name || party?.acronym || 'Your Party';

  /* Pillars: multi-select (no cap) */
  const pillars = profile.platformPillars || [];
  const togglePillar = (id) => {
    if (pillars.includes(id)) {
      const next = pillars.filter((p) => p !== id);
      update({ platformPillars: next, ...(id === 'other' ? { platformPillarOther: '' } : {}) });
    } else {
      update({ platformPillars: [...pillars, id] });
    }
  };

  /* Target segments: multi-select (no cap) */
  const segments = profile.targetSegments || [];
  const toggleSegment = (id) => {
    if (segments.includes(id)) {
      const next = segments.filter((s) => s !== id);
      update({ targetSegments: next, ...(id === 'other' ? { targetSegmentOther: '' } : {}) });
    } else {
      update({ targetSegments: [...segments, id] });
    }
  };

  /* Founding story: multi-select */
  const stories = profile.foundingStories || [];
  const toggleStory = (id) => {
    if (stories.includes(id)) {
      const next = stories.filter((s) => s !== id);
      update({ foundingStories: next, ...(id === 'other' ? { foundingStoryOther: '' } : {}) });
    } else {
      update({ foundingStories: [...stories, id] });
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
          {partyName}'s Profile
        </h1>
        <p style={{ marginTop: 8, color: '#6B7280', fontSize: '1rem', maxWidth: 600 }}>
          Where you came from, what you stand for, and who you serve. These shape your brand's voice.
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
          subtitle="What kind of organization is this, at its core?"
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 10,
        }}>
          {PARTY_FOUNDING_STORIES.map((s) => (
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
              <input
                type="text"
                value={profile.foundingStoryOther || ''}
                onChange={(e) => update({ foundingStoryOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe your founding story..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  border: `1px solid ${PRIMARY}`,
                  borderRadius: 12,
                  outline: 'none',
                  color: NAVY,
                  boxShadow: `0 0 0 3px ${PRIMARY}20`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 2: Platform pillars */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="02"
          title="Platform Pillars"
          subtitle="The issues your party is anchored on. These will inform headline copy and CTAs. Select as many as apply."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
        }}>
          {PARTY_PLATFORM_PILLARS.map((p) => {
            const selected = pillars.includes(p.id);
            return (
              <ChoiceCard
                key={p.id}
                option={p}
                selected={selected}
                onClick={() => togglePillar(p.id)}
              />
            );
          })}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {pillars.length} selected
        </p>
        <AnimatePresence>
          {pillars.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <input
                type="text"
                value={profile.platformPillarOther || ''}
                onChange={(e) => update({ platformPillarOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe additional pillars..."
                style={{
                  width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem',
                  border: `1px solid ${PRIMARY}`, borderRadius: 12, outline: 'none',
                  color: NAVY, boxShadow: `0 0 0 3px ${PRIMARY}20`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 3: Target segments */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="03"
          title="Target Voter Segments"
          subtitle="Who you're built to reach. We'll tune mockups and copy to feel native to these groups. Select as many as apply."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
        }}>
          {PARTY_TARGET_SEGMENTS.map((s) => {
            const selected = segments.includes(s.id);
            return (
              <ChoiceCard
                key={s.id}
                option={s}
                selected={selected}
                onClick={() => toggleSegment(s.id)}
              />
            );
          })}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {segments.length} selected
        </p>
        <AnimatePresence>
          {segments.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <input
                type="text"
                value={profile.targetSegmentOther || ''}
                onChange={(e) => update({ targetSegmentOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe the audience..."
                style={{
                  width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem',
                  border: `1px solid ${PRIMARY}`, borderRadius: 12, outline: 'none',
                  color: NAVY, boxShadow: `0 0 0 3px ${PRIMARY}20`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 4: Coalitions */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ marginBottom: 24 }}
      >
        <SectionHeader
          index="04"
          title="Coalitions & Partners"
          subtitle="Endorsing organizations, allied groups, or partner movements (optional, free text)."
        />
        <textarea
          value={profile.coalitions || ''}
          onChange={(e) => update({ coalitions: sanitizeFreeText(e.target.value) })}
          placeholder="e.g. State Realtors Association, Chamber of Commerce, [Local] Faith Coalition..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            fontSize: '0.95rem',
            fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            outline: 'none',
            color: NAVY,
            resize: 'vertical',
            background: '#fff',
          }}
          onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}30`; }}
          onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
        />
      </motion.section>
    </div>
  );
}
