/**
 * PacBasicsForm
 * Stage 1 form when subjectType === 'pac'. Captures the essentials
 * needed to brand a PAC / Super PAC / independent-expenditure committee.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import {
  PAC_TYPES, PAC_SCOPES, US_STATES, FOUNDED_YEAR_RANGE,
  ELECTION_YEARS, PAC_CONNECTED_STATUS, FEC_REGISTRATION_STATUS, YES_NO,
} from '../../data/brandData';
import { sanitizeName, sanitizeShortText, sanitizeFreeText } from '../../utils/sanitize';
import { Megaphone, Flag, Globe, MapPin, Users, Coins, X, Landmark, Star } from 'lucide-react';
import USMapSVG from '../USMapSVG';

const accent = '#8B1A2B';
const navy = '#1C2E5B';
const cardBorder = '#E5E7EB';

const PAC_TYPE_ICONS = {
  'federal':    <Flag size={22} />,
  'state':      <Landmark size={22} />,
  'super':      <Megaphone size={22} />,
  'hybrid':     <Star size={22} />,
  'carey':      <Users size={22} />,
  'leadership': <Globe size={22} />,
  'other':      <Coins size={22} />,
};

const SCOPE_ICONS = {
  'federal':     <Globe size={22} />,
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

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '0.85rem 1rem',
        fontSize: '0.95rem',
        fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
        border: `1px solid ${cardBorder}`,
        borderRadius: 12,
        outline: 'none',
        background: '#fff',
        color: navy,
        resize: 'vertical',
        transition: 'all 0.2s ease',
      }}
      onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${accent}30`; }}
      onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
    />
  );
}

function Pill({ options, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: selected ? accent : '#fff',
              border: `1px solid ${selected ? accent : cardBorder}`,
              color: selected ? '#fff' : navy,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              boxShadow: selected ? '0 4px 14px rgba(139,26,43,0.22)' : 'none',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const sectionVariant = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
});

export default function PacBasicsForm() {
  const { state, dispatch } = useBrand();
  const { pac } = state;
  const [stateQuery, setStateQuery] = useState('');
  const [showStates, setShowStates] = useState(false);

  const update = (payload) => dispatch({ type: 'UPDATE_PAC', payload });

  const yearOptions = useMemo(() => {
    const out = [];
    for (let y = FOUNDED_YEAR_RANGE.max; y >= FOUNDED_YEAR_RANGE.min; y -= 1) out.push(y);
    return out;
  }, []);

  const filteredStates = useMemo(() => {
    if (!stateQuery) return US_STATES;
    return US_STATES.filter((s) => s.toLowerCase().startsWith(stateQuery.toLowerCase()));
  }, [stateQuery]);

  const scope = pac.scope;
  const useMap = scope === 'multi-state' || scope === 'state';
  const useTypedState = scope === 'local';
  const isMulti = scope === 'multi-state';

  const handleMapClick = (stateName) => {
    if (isMulti) {
      const current = Array.isArray(pac.states) ? pac.states : [];
      const next = current.includes(stateName)
        ? current.filter((s) => s !== stateName)
        : [...current, stateName];
      update({ states: next });
    } else {
      update({ state: stateName });
    }
  };

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
        }}>Tell us about your PAC.</h2>
        <p style={{
          maxWidth: 540,
          margin: '0.75rem auto 0',
          color: '#6B7280',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}>
          A few essentials about your committee — name, classification, and reach — so we can tailor the brand system to how donors and supporters will encounter you.
        </p>
      </motion.div>

      {/* 1. PAC legal name */}
      <motion.section {...sectionVariant(0.1)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>PAC Legal Name</FieldLabel>
        <TextInput
          value={pac.legalName}
          onChange={(e) => update({ legalName: sanitizeName(e.target.value) })}
          placeholder="e.g. Citizens for American Renewal"
        />
      </motion.section>

      {/* 2. PAC type */}
      <motion.section {...sectionVariant(0.16)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>PAC Classification</FieldLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
        }}>
          {PAC_TYPES.map((pt) => {
            const selected = pac.pacType === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => update({ pacType: pt.id })}
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
                  {PAC_TYPE_ICONS[pt.id]}
                </span>
                {pt.label}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {pac.pacType === 'other' && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <TextInput
                value={pac.pacTypeOther || ''}
                onChange={(e) => update({ pacTypeOther: sanitizeShortText(e.target.value) })}
                placeholder="Describe the PAC type"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 3. Scope */}
      <motion.section {...sectionVariant(0.22)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>Scope / Reach</FieldLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
        }}>
          {PAC_SCOPES.map((sc) => {
            const selected = pac.scope === sc.id;
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

      {/* 4a. Multi-state / Statewide → interactive USA map */}
      <AnimatePresence>
        {useMap && (
          <motion.section
            key="state-map"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2.5rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'visible' }}
          >
            <FieldLabel>
              {isMulti ? 'States Where You Operate' : 'Primary State'}
            </FieldLabel>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: -4, marginBottom: 12 }}>
              {isMulti
                ? 'Click each state your PAC operates in. Click again to deselect.'
                : 'Click your state on the map.'}
            </p>

            <div style={{
              border: `1px solid ${cardBorder}`,
              borderRadius: 16,
              padding: 12,
              background: '#FAFAFA',
            }}>
              {isMulti ? (
                <USMapSVG
                  selectedStates={Array.isArray(pac.states) ? pac.states : []}
                  onSelect={handleMapClick}
                />
              ) : (
                <USMapSVG
                  selectedState={pac.state || ''}
                  onSelect={handleMapClick}
                />
              )}
            </div>

            {isMulti && Array.isArray(pac.states) && pac.states.length > 0 && (
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {pac.states.map((s) => (
                  <span key={s} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 10px',
                    background: '#fff',
                    border: `1px solid ${accent}`,
                    color: accent,
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {s}
                    <button
                      type="button"
                      onClick={() => update({ states: pac.states.filter((x) => x !== s) })}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 16, height: 16, borderRadius: '50%',
                        border: 'none', background: 'transparent', color: accent,
                        cursor: 'pointer', padding: 0,
                      }}
                      aria-label={`Remove ${s}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {!isMulti && pac.state && (
              <p style={{ marginTop: 10, fontSize: 13, color: navy, fontWeight: 600 }}>
                Selected: <span style={{ color: accent }}>{pac.state}</span>
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4b. Local → typed state + city/county */}
      <AnimatePresence>
        {useTypedState && (
          <motion.section
            key="local-state"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2.5rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'visible' }}
          >
            <FieldLabel>Primary State</FieldLabel>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type="text"
                value={pac.state || stateQuery}
                onChange={(e) => {
                  setStateQuery(e.target.value);
                  setShowStates(true);
                  if (pac.state) update({ state: '' });
                }}
                onFocus={() => setShowStates(true)}
                onBlur={() => setTimeout(() => setShowStates(false), 150)}
                placeholder="Start typing a state..."
                style={{
                  width: '100%', padding: '0.85rem 1rem', fontSize: '1rem',
                  fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
                  border: `1px solid ${cardBorder}`, borderRadius: 12, outline: 'none',
                  background: '#fff', color: navy,
                }}
              />
              {showStates && filteredStates.length > 0 && !pac.state && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                  maxHeight: 220, overflowY: 'auto', background: '#fff',
                  border: `1px solid ${cardBorder}`, borderRadius: 12, zIndex: 20,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                }}>
                  {filteredStates.slice(0, 30).map((s) => (
                    <button key={s} type="button" onMouseDown={() => {
                      update({ state: s }); setStateQuery(''); setShowStates(false);
                    }} style={{
                      display: 'block', width: '100%', padding: '10px 14px',
                      background: '#fff', border: 'none', textAlign: 'left',
                      fontSize: '0.95rem', color: navy, cursor: 'pointer',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >{s}</button>
                  ))}
                </div>
              )}
            </div>

            <FieldLabel>City / County</FieldLabel>
            <TextInput
              value={pac.cityCounty || ''}
              onChange={(e) => update({ cityCounty: sanitizeShortText(e.target.value) })}
              placeholder="e.g. Travis County, City of Boise"
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. Year established + Election Year */}
      <motion.section {...sectionVariant(0.28)} style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <FieldLabel optional>Year Established</FieldLabel>
            <select
              value={pac.yearEstablished || ''}
              onChange={(e) => update({ yearEstablished: e.target.value })}
              style={{
                width: '100%', padding: '0.85rem 1rem', fontSize: '1rem',
                fontFamily: "'Plus Jakarta Sans', 'Onest', sans-serif",
                border: `1px solid ${cardBorder}`, borderRadius: 12, outline: 'none',
                background: '#fff', color: navy, appearance: 'none',
              }}
            >
              <option value="">Select year</option>
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Election Year (cycle focus)</FieldLabel>
            <Pill
              options={ELECTION_YEARS.map((y) => ({ id: y, label: y }))}
              value={pac.electionYear}
              onChange={(id) => update({ electionYear: id })}
            />
          </div>
        </div>
      </motion.section>

      {/* 6. Mission / Issue Focus */}
      <motion.section {...sectionVariant(0.32)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel>Mission / Issue Focus</FieldLabel>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: -4, marginBottom: 10 }}>
          One line summarizing what this committee exists to do.
        </p>
        <TextArea
          value={pac.mission || ''}
          onChange={(e) => update({ mission: sanitizeFreeText(e.target.value) })}
          placeholder="e.g. Elect America-First candidates to U.S. House seats in swing districts."
          rows={2}
        />
      </motion.section>

      {/* 7. IE-Only? + Connected */}
      <motion.section {...sectionVariant(0.36)} style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <FieldLabel>Independent-Expenditure-Only? (Super PAC)</FieldLabel>
            <Pill options={YES_NO} value={pac.ieOnly} onChange={(id) => update({ ieOnly: id })} />
          </div>
          <div>
            <FieldLabel optional>Connected vs Non-connected</FieldLabel>
            <Pill
              options={PAC_CONNECTED_STATUS}
              value={pac.connectedStatus}
              onChange={(id) => update({ connectedStatus: id })}
            />
          </div>
        </div>
      </motion.section>

      {/* 8. FEC Registration Status */}
      <motion.section {...sectionVariant(0.40)} style={{ marginBottom: '2.5rem' }}>
        <FieldLabel optional>FEC Registration Status</FieldLabel>
        <Pill
          options={FEC_REGISTRATION_STATUS}
          value={pac.fecRegistrationStatus}
          onChange={(id) => update({ fecRegistrationStatus: id })}
        />
      </motion.section>

      {/* 9. Spokesperson */}
      <motion.section {...sectionVariant(0.44)} style={{ marginBottom: '1rem' }}>
        <FieldLabel optional>Lead Spokesperson / Treasurer / Chair</FieldLabel>
        <TextInput
          value={pac.spokesperson || ''}
          onChange={(e) => update({ spokesperson: sanitizeName(e.target.value) })}
          placeholder="e.g. Jane Doe — Treasurer"
        />
        <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>
          Used to anchor voice & tone. Leave blank if the PAC speaks institutionally.
        </p>
      </motion.section>
    </div>
  );
}
