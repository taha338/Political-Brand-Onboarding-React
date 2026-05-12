import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { GripVertical, X } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { sanitizeFreeText } from '../../utils/sanitize';
import { PROFESSIONAL_BACKGROUNDS, POLICY_PRIORITIES } from '../../data/brandData';
import StageContainer from '../StageContainer';
import TiltCard from '../TiltCard';
import AnimatedCheckmark from '../AnimatedCheckmark';
import PartyProfileForm from './PartyProfileForm';
import PacProfileForm from './PacProfileForm';
import NonprofitProfileForm from './NonprofitProfileForm';
import {
  Shield, Briefcase, Scale, HeartPulse, Wheat, BookOpen,
  Church, Landmark, Wrench, Monitor, Medal,
  TrendingUp, Target, Heart, CheckSquare, GraduationCap,
  Zap, DollarSign, Eye, Building2, Leaf, ShieldCheck, PlusCircle,
} from 'lucide-react';

const PRIMARY = '#8B1A2B';
const NAVY = '#1C2E5B';

const ICON_SIZE = 22;

const BACKGROUND_ICONS = {
  military: <Medal size={ICON_SIZE} />,
  'law-enforcement': <ShieldCheck size={ICON_SIZE} />,
  business: <Briefcase size={ICON_SIZE} />,
  attorney: <Scale size={ICON_SIZE} />,
  medical: <HeartPulse size={ICON_SIZE} />,
  agriculture: <Wheat size={ICON_SIZE} />,
  education: <BookOpen size={ICON_SIZE} />,
  faith: <Church size={ICON_SIZE} />,
  'public-service': <Landmark size={ICON_SIZE} />,
  'blue-collar': <Wrench size={ICON_SIZE} />,
  tech: <Monitor size={ICON_SIZE} />,
};

const POLICY_ICONS = {
  border: <Shield size={ICON_SIZE} />,
  economy: <TrendingUp size={ICON_SIZE} />,
  '2a': <Target size={ICON_SIZE} />,
  'pro-life': <Heart size={ICON_SIZE} />,
  election: <CheckSquare size={ICON_SIZE} />,
  education: <GraduationCap size={ICON_SIZE} />,
  veterans: <Medal size={ICON_SIZE} />,
  'law-order': <Scale size={ICON_SIZE} />,
  energy: <Zap size={ICON_SIZE} />,
  healthcare: <HeartPulse size={ICON_SIZE} />,
  tax: <DollarSign size={ICON_SIZE} />,
  'religious-liberty': <Church size={ICON_SIZE} />,
  accountability: <Eye size={ICON_SIZE} />,
  infrastructure: <Building2 size={ICON_SIZE} />,
  agriculture: <Leaf size={ICON_SIZE} />,
};

const bounceKeyframes = `
@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`;

export default function Stage2_CandidateProfile() {
  const { state, dispatch } = useBrand();
  const { profile } = state;

  const update = (payload) => dispatch({ type: 'UPDATE_PROFILE', payload });

  const toggleBackground = (id) => {
    const current = profile.backgrounds || [];
    if (current.includes(id)) {
      const updated = current.filter((b) => b !== id);
      update({ backgrounds: updated, ...(id === 'other' ? { backgroundOther: '' } : {}) });
    } else {
      update({ backgrounds: [...current, id] });
    }
  };

  const togglePriority = (id) => {
    const current = profile.policyPriorities || [];
    if (current.includes(id)) {
      const updated = current.filter((p) => p !== id);
      update({ policyPriorities: updated, ...(id === 'other-policy' ? { policyOther: '' } : {}) });
    } else {
      update({ policyPriorities: [...current, id] });
    }
  };

  const reorderPriorities = (newOrder) => {
    update({ policyPriorities: newOrder });
  };

  const backgrounds = profile.backgrounds || [];
  const priorities = profile.policyPriorities || [];
  const backgroundOtherSelected = backgrounds.includes('other');
  const policyOtherSelected = priorities.includes('other-policy');

  const isParty = state.subjectType === 'party';
  const isPac = state.subjectType === 'pac';
  const isNonprofit = state.subjectType === 'nonprofit';

  if (isParty) {
    return (
      <StageContainer
        stageNumber={2}
        title="Party Profile"
        subtitle="Your origin, your platform, and the people you're built to reach."
      >
        <PartyProfileForm />
      </StageContainer>
    );
  }

  if (isPac) {
    return (
      <StageContainer
        stageNumber={2}
        title="PAC Profile"
        subtitle="Your origin, your issue focus, and the donors who fuel the fight."
      >
        <PacProfileForm />
      </StageContainer>
    );
  }

  if (isNonprofit) {
    return (
      <StageContainer
        stageNumber={2}
        title="Nonprofit Profile"
        subtitle="Your origin, your cause areas, and the people you speak to."
      >
        <NonprofitProfileForm />
      </StageContainer>
    );
  }

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
            (Select all that apply)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROFESSIONAL_BACKGROUNDS.map((bg) => {
            const selected = backgrounds.includes(bg.id);
            const disabled = false;
            const icon = BACKGROUND_ICONS[bg.id];

            return (
              <TiltCard
                key={bg.id}
                onClick={() => !disabled && toggleBackground(bg.id)}
                className={`group flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'text-white shadow-lg border-transparent'
                    : disabled
                    ? 'bg-white text-gray-300 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                style={selected ? { backgroundColor: PRIMARY, borderColor: PRIMARY } : {}}
              >
                {selected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
                    <AnimatedCheckmark size={20} color="#FFFFFF" />
                  </div>
                )}
                <span
                  className="block"
                  style={{ color: selected ? '#fff' : PRIMARY, transition: 'transform 0.2s ease' }}
                  onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.animation = 'iconBounce 0.45s ease-in-out'; }}
                  onAnimationEnd={(e) => { e.currentTarget.style.animation = ''; }}
                >
                  {icon}
                </span>
                <span className={`text-xs font-semibold text-center leading-tight ${selected ? 'text-white' : ''}`}>
                  {bg.label}
                </span>
              </TiltCard>
            );
          })}

          {/* Other — background */}
          {(() => {
            const selected = backgroundOtherSelected;
            const disabled = false;
            return (
              <TiltCard
                onClick={() => !disabled && toggleBackground('other')}
                className={`group flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'text-white shadow-lg border-transparent'
                    : disabled
                    ? 'bg-white text-gray-300 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                style={selected ? { backgroundColor: PRIMARY, borderColor: PRIMARY } : {}}
              >
                {selected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
                    <AnimatedCheckmark size={20} color="#FFFFFF" />
                  </div>
                )}
                <span
                  className="block"
                  style={{ color: selected ? '#fff' : PRIMARY }}
                  onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.animation = 'iconBounce 0.45s ease-in-out'; }}
                  onAnimationEnd={(e) => { e.currentTarget.style.animation = ''; }}
                >
                  <PlusCircle size={ICON_SIZE} />
                </span>
                <span className={`text-xs font-semibold text-center leading-tight ${selected ? 'text-white' : ''}`}>
                  Other
                </span>
              </TiltCard>
            );
          })()}
        </div>

        {/* Other background — text input */}
        <AnimatePresence>
          {backgroundOtherSelected && (
            <motion.div
              key="bg-other-input"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <input
                type="text"
                value={profile.backgroundOther || ''}
                onChange={(e) => update({ backgroundOther: sanitizeFreeText(e.target.value) })}
                placeholder="e.g. Veterinarian, nonprofit director, small-business owner"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none"
                style={{ fontSize: '0.95rem' }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${PRIMARY}33`; e.currentTarget.style.borderColor = PRIMARY; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
            Policy Priorities{' '}
          </span>
          <span className="text-sm font-semibold" style={{ color: PRIMARY }}>
            (Select all that apply — you'll rank them next)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {POLICY_PRIORITIES.map((policy) => {
            const selected = priorities.includes(policy.id);
            const disabled = false;
            const icon = POLICY_ICONS[policy.id];

            return (
              <TiltCard
                key={policy.id}
                onClick={() => !disabled && togglePriority(policy.id)}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'text-white shadow-lg border-transparent'
                    : disabled
                    ? 'bg-white text-gray-300 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                style={selected ? { backgroundColor: PRIMARY, borderColor: PRIMARY } : {}}
              >
                {selected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
                    <AnimatedCheckmark size={20} color="#FFFFFF" />
                  </div>
                )}
                <span
                  className="flex-shrink-0"
                  style={{ color: selected ? '#fff' : PRIMARY, transition: 'transform 0.2s ease' }}
                  onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.animation = 'iconBounce 0.45s ease-in-out'; }}
                  onAnimationEnd={(e) => { e.currentTarget.style.animation = ''; }}
                >
                  {icon}
                </span>
                <span className={`text-sm font-semibold ${selected ? 'text-white' : ''}`}>
                  {policy.label}
                </span>
              </TiltCard>
            );
          })}

          {/* Other — policy */}
          {(() => {
            const selected = policyOtherSelected;
            const disabled = false;
            return (
              <TiltCard
                onClick={() => !disabled && togglePriority('other-policy')}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  selected
                    ? 'text-white shadow-lg border-transparent'
                    : disabled
                    ? 'bg-white text-gray-300 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
                style={selected ? { backgroundColor: PRIMARY, borderColor: PRIMARY } : {}}
              >
                {selected && (
                  <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
                    <AnimatedCheckmark size={20} color="#FFFFFF" />
                  </div>
                )}
                <span
                  className="flex-shrink-0"
                  style={{ color: selected ? '#fff' : PRIMARY }}
                  onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.animation = 'iconBounce 0.45s ease-in-out'; }}
                  onAnimationEnd={(e) => { e.currentTarget.style.animation = ''; }}
                >
                  <PlusCircle size={ICON_SIZE} />
                </span>
                <span className={`text-sm font-semibold ${selected ? 'text-white' : ''}`}>
                  Other
                </span>
              </TiltCard>
            );
          })()}
        </div>

        {/* Other policy — text input */}
        <AnimatePresence>
          {policyOtherSelected && (
            <motion.div
              key="policy-other-input"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <input
                type="text"
                value={profile.policyOther || ''}
                onChange={(e) => update({ policyOther: sanitizeFreeText(e.target.value) })}
                placeholder="e.g. Mental health reform, housing affordability, water rights"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none"
                style={{ fontSize: '0.95rem' }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${PRIMARY}33`; e.currentTarget.style.borderColor = PRIMARY; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ── SECTION 3: Rank Priorities ── */}
      <AnimatePresence>
        {priorities.length > 0 && (
          <motion.section
            key="rank-priorities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Rank Your Priorities
              </span>{' '}
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>
                (Drag to reorder)
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              The top item is the priority your brand will lead with. Drag any row up or down to change the order.
            </p>

            <Reorder.Group
              axis="y"
              values={priorities}
              onReorder={reorderPriorities}
              className="flex flex-col gap-2"
            >
              {priorities.map((id, index) => {
                const policy = POLICY_PRIORITIES.find((p) => p.id === id);
                const label = id === 'other-policy'
                  ? (profile.policyOther?.trim() || 'Other')
                  : (policy?.label || id);
                const icon = POLICY_ICONS[id] || <Target size={ICON_SIZE} />;
                return (
                  <Reorder.Item
                    key={id}
                    value={id}
                    whileDrag={{ scale: 1.02, boxShadow: '0 12px 28px rgba(0,0,0,0.18)' }}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 cursor-grab active:cursor-grabbing select-none"
                    style={{ touchAction: 'none' }}
                  >
                    {/* Rank number */}
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ background: PRIMARY, color: '#fff' }}
                    >
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 text-gray-500">
                      {icon}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {label}
                      </p>
                      {index === 0 && (
                        <p className="text-[11px] uppercase tracking-wider font-semibold mt-0.5"
                          style={{ color: PRIMARY }}>
                          Top Priority
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePriority(id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label={`Remove ${label}`}
                    >
                      <X size={16} />
                    </button>

                    {/* Drag handle */}
                    <div className="flex-shrink-0 text-gray-300">
                      <GripVertical size={18} />
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </motion.section>
        )}
      </AnimatePresence>

    </StageContainer>
  );
}
