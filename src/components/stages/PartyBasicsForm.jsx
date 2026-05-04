/**
 * PartyBasicsForm
 * Stage 1 form when subjectType === 'party'. Captures the essentials
 * needed to brand a party / movement / political organization.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { PARTY_TYPES, PARTY_SCOPES, US_STATES, FOUNDED_YEAR_RANGE } from '../../data/brandData';
import { sanitizeName, sanitizeShortText } from '../../utils/sanitize';
import { Flag, Users, Globe, MapPin, Megaphone, Coins, Star, Compass } from 'lucide-react';

const accent = '#8B1A2B';
const navy = '#1C2E5B';
const cardBorder = '#E5E7EB';

const PARTY_TYPE_ICONS = {
  'republican':    <Star size={22} />,
  'america-first': <Flag size={22} />,
  'non-partisan':  <Compass size={22} />,
  'independent':   <Users size={22} />,
  'third-party':   <Megaphone size={22} />,
  'coalition':     <Globe size={22} />,
  'other':         <Coins size={22} />,
};

const SCOPE_ICONS = {
  'national':    <Globe size={22} />,
  'multi-state': <MapPin size={22} />,
  'state':       <MapPin size={22} />,
  'local':       <Users size={22} />,
};

function FieldLabel({ children, optional }) {
  return (
    <label style={{
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.5rem',
    }}>
      {children}
      {optional && (
        <span style={{ fontWeight: 500, color: '#9CA3AF', marginLeft: 6 }}>(optional)</span>
      )}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      spellCheck={false}
      style={{
        width: '100%',
        padding: '0.85rem 1rem',
        fontSize: '1rem',
        fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
        border: `1px solid ${cardBorder}`,
        borderRadius: 12,
        outline: 'none',
        background: '#fff',
        color: navy,
        transition: 'all 0.2s ease',
      }}
      onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${accent}30`; }}
      onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
    />
  );
}

const sectionVariant = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
});

export default function PartyBasicsForm() {
  const { state, dispatch } = useBrand();
  const { party } = state;
  const [stateQuery, setStateQuery] = useState('');
  const [showStates, setShowStates] = useState(false);

  const update = (payload) => dispatch({ type: 'UPDATE_PARTY', payload });

  const yearOptions = useMemo(() => {
    const out = [];
    for (let y = FOUNDED_YEAR_RANGE.max; y >= FOUNDED_YEAR_RANGE.min; y -= 1) out.push(y);
    return out;
  }, []);

  const filteredStates = useMemo(() => {
    if (!stateQuery) return US_STATES;
    return US_STATES.filter((s) => s.toLowerCase().startsWith(stateQuery.toLowerCase()));
  }, [stateQuery]);

  const showStatePicker = party.scope && party.scope !== 'national';

  return (
    <div>
      {/* Hero copy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <h2 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          color: navy,
          margin: 0,
          lineHeight: 1.15,
        }}>Tell us about your party.</h2>
        <p style={{
          maxWidth: 540,
          margin: '0.75rem auto 0',
          color: '#6B7280',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}>
          A few essentials about your organization — name, type, and reach — so we can tailor the brand system to how voters and members will encounter you.
        </p>
      </motion.div>

      {/* 1. Party name + acronym */}
      <motion.section {...sectionVariant(0.1)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>Party / Organization Name</FieldLabel>
        <TextInput
          value={party.name}
          onChange={(e) => update({ name: sanitizeName(e.target.value) })}
          placeholder="e.g. American Solidarity Party"
        />

        <div style={{ marginTop: '1rem' }}>
          <FieldLabel optional>Acronym / Short Name</FieldLabel>
          <TextInput
            value={party.acronym}
            onChange={(e) => update({ acronym: sanitizeShortText(e.target.value).toUpperCase().slice(0, 8) })}
            placeholder="e.g. ASP, GOP, AFP"
          />
        </div>
      </motion.section>

      {/* 2. Party type */}
      <motion.section {...sectionVariant(0.18)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>Party Type</FieldLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 10,
        }}>
          {PARTY_TYPES.map((pt) => {
            const selected = party.partyType === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => update({ partyType: pt.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: selected ? accent : '#fff',
                  border: `1px solid ${selected ? accent : cardBorder}`,
                  color: selected ? '#fff' : navy,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: selected ? '0 4px 14px rgba(139,26,43,0.22)' : 'none',
                }}
              >
                <span style={{ color: selected ? '#fff' : accent, flexShrink: 0 }}>
                  {PARTY_TYPE_ICONS[pt.id]}
                </span>
                {pt.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {party.partyType === 'other' && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <TextInput
                value={party.partyTypeOther || ''}
                onChange={(e) => update({ partyTypeOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe the party type"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 3. Scope */}
      <motion.section {...sectionVariant(0.26)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>Scope / Reach</FieldLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
        }}>
          {PARTY_SCOPES.map((sc) => {
            const selected = party.scope === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => update({ scope: sc.id })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 12px',
                  borderRadius: 10,
                  background: selected ? accent : '#fff',
                  border: `1px solid ${selected ? accent : cardBorder}`,
                  color: selected ? '#fff' : navy,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ color: selected ? '#fff' : accent }}>{SCOPE_ICONS[sc.id]}</span>
                {sc.label}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* 4. State (if scope !== national) */}
      <AnimatePresence>
        {showStatePicker && (
          <motion.section
            key="state-picker"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2.5rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'visible' }}
          >
            <FieldLabel>Primary State</FieldLabel>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={party.state || stateQuery}
                onChange={(e) => {
                  setStateQuery(e.target.value);
                  setShowStates(true);
                  if (party.state) update({ state: '' });
                }}
                onFocus={() => setShowStates(true)}
                onBlur={() => setTimeout(() => setShowStates(false), 150)}
                placeholder="Start typing a state..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 12,
                  outline: 'none',
                  background: '#fff',
                  color: navy,
                }}
              />
              {showStates && filteredStates.length > 0 && !party.state && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  maxHeight: 220,
                  overflowY: 'auto',
                  background: '#fff',
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 12,
                  zIndex: 20,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                }}>
                  {filteredStates.slice(0, 30).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => {
                        update({ state: s });
                        setStateQuery('');
                        setShowStates(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 14px',
                        background: '#fff',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.95rem',
                        color: navy,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. Founded year */}
      <motion.section {...sectionVariant(0.34)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel optional>Founded Year</FieldLabel>
        <select
          value={party.foundedYear || ''}
          onChange={(e) => update({ foundedYear: e.target.value })}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            fontSize: '1rem',
            fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
            border: `1px solid ${cardBorder}`,
            borderRadius: 12,
            outline: 'none',
            background: '#fff',
            color: navy,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%236B7280' d='M6 8L0 0h12z'/></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
          }}
        >
          <option value="">Select year (or leave blank if new)</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </motion.section>

      {/* 6. Spokesperson */}
      <motion.section {...sectionVariant(0.42)} style={{ marginBottom: '1rem' }}>
        <FieldLabel optional>Lead Spokesperson / Chair</FieldLabel>
        <TextInput
          value={party.spokesperson || ''}
          onChange={(e) => update({ spokesperson: sanitizeName(e.target.value) })}
          placeholder="e.g. Jane Doe — Party Chair"
        />
        <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>
          Used to anchor voice & tone. Leave blank if the party speaks institutionally rather than through one person.
        </p>
      </motion.section>
    </div>
  );
}
