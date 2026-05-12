/**
 * NonprofitProfileForm
 * Stage 2 form when subjectType === 'nonprofit'. Captures the founding
 * story, cause areas, target audiences, tone anchor, and coalition
 * partners that shape the nonprofit's brand voice.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import {
  NONPROFIT_FOUNDING_STORIES,
  NONPROFIT_CAUSE_AREAS,
  NONPROFIT_AUDIENCES,
  NONPROFIT_TONE_ANCHORS,
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

function ToneCard({ option, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: 6, padding: '16px 18px',
        borderRadius: 12,
        background: selected ? PRIMARY : '#fff',
        border: `1px solid ${selected ? PRIMARY : BORDER}`,
        color: selected ? '#fff' : NAVY,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 4px 18px rgba(139,26,43,0.22)' : 'none',
      }}
    >
      <span style={{ fontSize: '1rem', fontWeight: 700 }}>{option.label}</span>
      <span style={{
        fontSize: '0.8rem',
        color: selected ? 'rgba(255,255,255,0.85)' : '#6B7280',
        lineHeight: 1.4,
      }}>{option.desc}</span>
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

export default function NonprofitProfileForm() {
  const { state, dispatch } = useBrand();
  const { profile, nonprofit } = state;

  const update = (payload) => dispatch({ type: 'UPDATE_PROFILE', payload });

  const orgName = nonprofit?.legalName || 'Your Organization';

  const stories = profile.nonprofitFoundingStories || [];
  const toggleStory = (id) => {
    if (stories.includes(id)) {
      update({ nonprofitFoundingStories: stories.filter((s) => s !== id), ...(id === 'other' ? { nonprofitFoundingStoryOther: '' } : {}) });
    } else {
      update({ nonprofitFoundingStories: [...stories, id] });
    }
  };

  const causes = profile.nonprofitCauseAreas || [];
  const toggleCause = (id) => {
    if (causes.includes(id)) {
      update({ nonprofitCauseAreas: causes.filter((s) => s !== id), ...(id === 'other' ? { nonprofitCauseAreaOther: '' } : {}) });
    } else {
      update({ nonprofitCauseAreas: [...causes, id] });
    }
  };

  const audiences = profile.nonprofitAudiences || [];
  const toggleAudience = (id) => {
    if (audiences.includes(id)) {
      update({ nonprofitAudiences: audiences.filter((s) => s !== id), ...(id === 'other' ? { nonprofitAudienceOther: '' } : {}) });
    } else {
      update({ nonprofitAudiences: [...audiences, id] });
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
          {orgName}'s Profile
        </h1>
        <p style={{ marginTop: 8, color: '#6B7280', fontSize: '1rem', maxWidth: 600 }}>
          Where you came from, what you serve, and who you speak to. These shape your brand voice.
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
          subtitle="How this organization came to exist. Select all that apply."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 10,
        }}>
          {NONPROFIT_FOUNDING_STORIES.map((s) => (
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
                value={profile.nonprofitFoundingStoryOther}
                onChange={(e) => update({ nonprofitFoundingStoryOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe your founding story..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 2: Cause areas */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="02"
          title="Cause Areas"
          subtitle="The issues or communities this organization serves. Select all that apply."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
        }}>
          {NONPROFIT_CAUSE_AREAS.map((c) => (
            <ChoiceCard
              key={c.id}
              option={c}
              selected={causes.includes(c.id)}
              onClick={() => toggleCause(c.id)}
            />
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {causes.length} selected
        </p>
        <AnimatePresence>
          {causes.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <OtherInput
                value={profile.nonprofitCauseAreaOther}
                onChange={(e) => update({ nonprofitCauseAreaOther: sanitizeShortText(e.target.value) })}
                placeholder="Other cause area..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 3: Target audiences */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="03"
          title="Target Audiences"
          subtitle="Who you primarily speak to. Mockups and copy will be tuned to feel native to these groups."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
        }}>
          {NONPROFIT_AUDIENCES.map((a) => (
            <ChoiceCard
              key={a.id}
              option={a}
              selected={audiences.includes(a.id)}
              onClick={() => toggleAudience(a.id)}
            />
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280' }}>
          {audiences.length} selected
        </p>
        <AnimatePresence>
          {audiences.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <OtherInput
                value={profile.nonprofitAudienceOther}
                onChange={(e) => update({ nonprofitAudienceOther: sanitizeShortText(e.target.value) })}
                placeholder="Other audience..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* SECTION 4: Tone anchor */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ marginBottom: 48 }}
      >
        <SectionHeader
          index="04"
          title="Tone Anchor"
          subtitle="Pick the one posture that best fits how this organization should sound. Drives the Brand Core fit on the next stage."
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {NONPROFIT_TONE_ANCHORS.map((t) => (
            <ToneCard
              key={t.id}
              option={t}
              selected={profile.nonprofitToneAnchor === t.id}
              onClick={() => update({ nonprofitToneAnchor: t.id })}
            />
          ))}
        </div>
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
          title="Coalitions & Partners"
          subtitle="Sister orgs, allied movements, fiscal sponsor, or major partners (optional, free text)."
        />
        <textarea
          value={profile.nonprofitCoalitions || ''}
          onChange={(e) => update({ nonprofitCoalitions: sanitizeFreeText(e.target.value) })}
          placeholder="e.g. Alliance Defending Freedom, [Local] Faith Coalition, sister c4 American Liberty Action..."
          rows={4}
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
