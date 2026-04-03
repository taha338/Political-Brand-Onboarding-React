import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { PROFESSIONAL_BACKGROUNDS, POLICY_PRIORITIES } from '../../data/brandData';
import StageContainer from '../StageContainer';

const PRIMARY = '#8B1A2B';
const NAVY = '#1C2E5B';

const BACKGROUND_EMOJIS = {
  military: '🎖️',
  'law-enforcement': '👮',
  business: '💼',
  attorney: '⚖️',
  medical: '🏥',
  agriculture: '🌾',
  education: '📚',
  faith: '✝️',
  'public-service': '🏛️',
  'blue-collar': '🔧',
  tech: '💻',
};

const POLICY_EMOJIS = {
  border: '🛡️',
  economy: '📈',
  '2a': '🎯',
  'pro-life': '❤️',
  election: '✅',
  education: '📖',
  veterans: '🎖️',
  'law-order': '⚖️',
  energy: '⚡',
  healthcare: '🏥',
  tax: '💰',
  'religious-liberty': '🙏',
  accountability: '👁️',
  infrastructure: '🏗️',
  agriculture: '🌿',
};

const bounceKeyframes = `
@keyframes emojiBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`;

export default function Stage2_CandidateProfile() {
  const { state, dispatch } = useBrand();
  const { profile } = state;
  const [endorsementInput, setEndorsementInput] = useState('');

  const update = (payload) => dispatch({ type: 'UPDATE_PROFILE', payload });

  const toggleBackground = (id) => {
    const current = profile.backgrounds || [];
    if (current.includes(id)) {
      update({ backgrounds: current.filter((b) => b !== id) });
    } else if (current.length < 2) {
      update({ backgrounds: [...current, id] });
    }
  };

  const togglePriority = (id) => {
    const current = profile.policyPriorities || [];
    if (current.includes(id)) {
      update({ policyPriorities: current.filter((p) => p !== id) });
    } else if (current.length < 3) {
      update({ policyPriorities: [...current, id] });
    }
  };

  const addEndorsement = (value) => {
    const trimmed = value.trim();
    if (trimmed && !(profile.endorsements || []).includes(trimmed)) {
      update({ endorsements: [...(profile.endorsements || []), trimmed] });
    }
    setEndorsementInput('');
  };

  const removeEndorsement = (val) => {
    update({ endorsements: (profile.endorsements || []).filter((e) => e !== val) });
  };

  const backgrounds = profile.backgrounds || [];
  const priorities = profile.policyPriorities || [];
  const endorsements = profile.endorsements || [];
  const storyLen = (profile.definingStory || '').length;

  return (
    <StageContainer
      stageNumber={2}
      title={`${state.candidate.fullName || 'Candidate'}'s Profile`}
      subtitle="Your background and priorities shape your brand. Select what defines you."
    >
      <style>{bounceKeyframes}</style>

      {/* ── SECTION 1: Professional Background ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <div className="mb-5">
          <span className="text-sm font-semibold text-gray-700">
            Professional Background{' '}
          </span>
          <span className="text-sm font-semibold" style={{ color: PRIMARY }}>
            (Select up to 2)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROFESSIONAL_BACKGROUNDS.map((bg, i) => {
            const selected = backgrounds.includes(bg.id);
            const atMax = backgrounds.length >= 2;
            const disabled = !selected && atMax;
            const emoji = BACKGROUND_EMOJIS[bg.id] || bg.icon;

            return (
              <motion.button
                key={bg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
                onClick={() => !disabled && toggleBackground(bg.id)}
                whileHover={
                  disabled
                    ? {}
                    : { y: -3, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }
                }
                whileTap={disabled ? {} : { scale: 0.97 }}
                className={`group flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'text-white shadow-lg border-transparent'
                    : disabled
                    ? 'bg-white text-gray-300 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                style={
                  selected
                    ? { backgroundColor: PRIMARY, borderColor: PRIMARY }
                    : {}
                }
              >
                <span
                  className="text-2xl block"
                  style={{
                    animation: undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.animation =
                        'emojiBounce 0.5s ease-in-out';
                    }
                  }}
                  onAnimationEnd={(e) => {
                    e.currentTarget.style.animation = '';
                  }}
                >
                  {emoji}
                </span>
                <span
                  className={`text-xs font-semibold text-center leading-tight ${
                    selected ? 'text-white' : ''
                  }`}
                >
                  {bg.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* ── SECTION 2: Policy Priorities ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="mb-5">
          <span className="text-sm font-semibold text-gray-700">
            Top 3 Policy Priorities{' '}
          </span>
          <span className="text-sm font-semibold" style={{ color: PRIMARY }}>
            (Select exactly 3)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {POLICY_PRIORITIES.map((policy, i) => {
            const selected = priorities.includes(policy.id);
            const atMax = priorities.length >= 3;
            const disabled = !selected && atMax;
            const emoji = POLICY_EMOJIS[policy.id] || policy.icon;

            return (
              <motion.button
                key={policy.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.03 * i }}
                onClick={() => !disabled && togglePriority(policy.id)}
                whileHover={
                  disabled
                    ? {}
                    : { y: -3, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }
                }
                whileTap={disabled ? {} : { scale: 0.97 }}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'text-white shadow-lg border-transparent'
                    : disabled
                    ? 'bg-white text-gray-300 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                style={
                  selected
                    ? { backgroundColor: PRIMARY, borderColor: PRIMARY }
                    : {}
                }
              >
                <span
                  className="text-xl flex-shrink-0"
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.animation =
                        'emojiBounce 0.5s ease-in-out';
                    }
                  }}
                  onAnimationEnd={(e) => {
                    e.currentTarget.style.animation = '';
                  }}
                >
                  {emoji}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    selected ? 'text-white' : ''
                  }`}
                >
                  {policy.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* ── SECTION 3: Your Defining Moment ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-700">
            Your Defining Moment{' '}
          </span>
          <span className="text-sm text-gray-400">(Optional)</span>
        </div>

        <textarea
          value={profile.definingStory || ''}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              update({ definingStory: e.target.value });
            }
          }}
          placeholder="Share the moment, experience, or conviction that led to your candidacy..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 resize-none transition-all duration-200 focus:outline-none"
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${PRIMARY}33`;
            e.currentTarget.style.borderColor = PRIMARY;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
        />
        <div className="flex justify-end mt-1.5">
          <span
            className={`text-xs tabular-nums ${
              storyLen >= 500
                ? 'text-red-500 font-semibold'
                : storyLen >= 450
                ? 'text-amber-500'
                : 'text-gray-400'
            }`}
          >
            {storyLen}/500 characters
          </span>
        </div>
      </motion.section>

      {/* ── SECTION 4: Key Endorsements ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-4"
      >
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-700">
            Key Endorsements{' '}
          </span>
          <span className="text-sm text-gray-400">(Optional)</span>
        </div>

        {/* Endorsement tags */}
        <AnimatePresence>
          {endorsements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {endorsements.map((endorsement) => (
                <motion.span
                  key={endorsement}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  layout
                  className="inline-flex items-center gap-2 pl-4 pr-3 py-2 text-sm font-semibold rounded-full border-2"
                  style={{
                    borderColor: PRIMARY,
                    color: PRIMARY,
                    backgroundColor: 'white',
                  }}
                >
                  {endorsement}
                  <button
                    onClick={() => removeEndorsement(endorsement)}
                    className="ml-0.5 hover:opacity-70 transition-opacity rounded-full flex items-center justify-center"
                    style={{ color: PRIMARY }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <input
            type="text"
            value={endorsementInput}
            onChange={(e) => setEndorsementInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addEndorsement(endorsementInput);
              }
            }}
            placeholder="Type and press Enter"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none"
            style={{ fontSize: '0.95rem' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${PRIMARY}33`;
              e.currentTarget.style.borderColor = PRIMARY;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          />
        </div>
      </motion.section>
    </StageContainer>
  );
}
