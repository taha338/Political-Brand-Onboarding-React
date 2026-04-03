import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES } from '../../data/brandData';
import StageContainer from '../StageContainer';

const BRAND_KEYS = ['commander', 'patriot', 'reformer', 'community', 'executive'];

function CommanderSVG({ active }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <path d="M60 10L95 40V85L60 110L25 85V40L60 10Z" stroke={active ? '#B22234' : '#CBD5E1'} strokeWidth={2} fill={active ? '#1C2E5B' : '#F1F5F9'} />
      <path d="M60 30L75 50V75L60 90L45 75V50L60 30Z" fill={active ? '#B22234' : '#E2E8F0'} />
      <path d="M38 48L60 25L82 48" stroke={active ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43 55L60 35L77 55" stroke={active ? '#FFFFFF' : '#94A3B8'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      <circle cx="60" cy="65" r="8" fill={active ? '#FFFFFF' : '#CBD5E1'} />
      <path d="M56 65L59 68L64 62" stroke={active ? '#1C2E5B' : '#94A3B8'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 90H85" stroke={active ? '#B22234' : '#E2E8F0'} strokeWidth={3} strokeLinecap="round" />
      <path d="M40 96H80" stroke={active ? '#B22234' : '#E2E8F0'} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

function PatriotSVG({ active }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <circle cx="60" cy="60" r="45" stroke={active ? '#8B1A2B' : '#CBD5E1'} strokeWidth={2} fill={active ? '#1A2744' : '#F1F5F9'} />
      <circle cx="60" cy="60" r="35" stroke={active ? '#D4C5A9' : '#E2E8F0'} strokeWidth={1.5} fill="none" />
      <path d="M60 25V38" stroke={active ? '#D4C5A9' : '#CBD5E1'} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M30 55H20" stroke={active ? '#D4C5A9' : '#CBD5E1'} strokeWidth={2} strokeLinecap="round" />
      <path d="M100 55H90" stroke={active ? '#D4C5A9' : '#CBD5E1'} strokeWidth={2} strokeLinecap="round" />
      <rect x="50" y="42" width="20" height="30" rx="2" fill={active ? '#8B1A2B' : '#E2E8F0'} />
      <path d="M55 42V36C55 34 57 33 60 33C63 33 65 34 65 36V42" stroke={active ? '#D4C5A9' : '#CBD5E1'} strokeWidth={1.5} />
      <rect x="53" y="47" width="14" height="2" rx="1" fill={active ? '#D4C5A9' : '#CBD5E1'} />
      <rect x="53" y="52" width="14" height="2" rx="1" fill={active ? '#D4C5A9' : '#CBD5E1'} />
      <rect x="53" y="57" width="14" height="2" rx="1" fill={active ? '#D4C5A9' : '#CBD5E1'} />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const x = 60 + 40 * Math.cos(angle);
        const y = 60 + 40 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r={3} fill={active ? '#D4C5A9' : '#E2E8F0'} />;
      })}
      <path d="M35 85L60 95L85 85" stroke={active ? '#8B1A2B' : '#E2E8F0'} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
}

function ReformerSVG({ active }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <rect x="15" y="15" rx="8" width="90" height="90" fill={active ? '#0D0D0D' : '#F1F5F9'} stroke={active ? '#CC2029' : '#CBD5E1'} strokeWidth={2} />
      <path d="M35 80L55 45L65 60L85 25" stroke={active ? '#CC2029' : '#CBD5E1'} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="85" cy="25" r="5" fill={active ? '#CC2029' : '#E2E8F0'} />
      <path d="M78 25H85V32" stroke={active ? '#FFFFFF' : '#94A3B8'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 90L40 75" stroke={active ? '#CC2029' : '#E2E8F0'} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M40 90L55 75" stroke={active ? '#CC2029' : '#E2E8F0'} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
      <path d="M55 90L70 75" stroke={active ? '#CC2029' : '#E2E8F0'} strokeWidth={2.5} strokeLinecap="round" opacity={0.4} />
      <path d="M50 50L60 35L70 50" stroke={active ? '#FFFFFF' : '#94A3B8'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.5} />
      <circle cx="60" cy="100" r="3" fill={active ? '#CC2029' : '#E2E8F0'} />
    </svg>
  );
}

function CommunitySVG({ active }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <circle cx="60" cy="60" r="48" fill={active ? '#FFF9F0' : '#F1F5F9'} stroke={active ? '#2C4A7C' : '#CBD5E1'} strokeWidth={1.5} />
      <circle cx="42" cy="42" r="10" fill={active ? '#2C4A7C' : '#E2E8F0'} />
      <circle cx="42" cy="35" r="6" fill={active ? '#E8DCC8' : '#CBD5E1'} />
      <circle cx="78" cy="42" r="10" fill={active ? '#2C4A7C' : '#E2E8F0'} />
      <circle cx="78" cy="35" r="6" fill={active ? '#E8DCC8' : '#CBD5E1'} />
      <circle cx="60" cy="55" r="12" fill={active ? '#C74B50' : '#E2E8F0'} />
      <circle cx="60" cy="47" r="7" fill={active ? '#E8DCC8' : '#CBD5E1'} />
      <path d="M38 58C44 54 50 52 60 52C70 52 76 54 82 58" stroke={active ? '#2C4A7C' : '#CBD5E1'} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <path d="M52 78C52 74 55 71 60 71C65 71 68 74 68 78" stroke={active ? '#C74B50' : '#E2E8F0'} strokeWidth={2} strokeLinecap="round" fill="none" />
      <path d="M60 82L54 76C52 74 52 71 54 69C56 67 59 67 60 69V69C61 67 64 67 66 69C68 71 68 74 66 76L60 82Z" fill={active ? '#C74B50' : '#E2E8F0'} />
      <path d="M30 75C35 72 42 70 60 70C78 70 85 72 90 75" stroke={active ? '#2C4A7C' : '#E2E8F0'} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = 60 + 42 * Math.cos(angle);
        const y = 60 + 42 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r={2} fill={active ? '#C74B50' : '#E2E8F0'} opacity={0.6} />;
      })}
    </svg>
  );
}

function ExecutiveSVG({ active }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <rect x="15" y="20" rx="6" width="90" height="80" fill={active ? '#F7F7F7' : '#F1F5F9'} stroke={active ? '#1C2E5B' : '#CBD5E1'} strokeWidth={2} />
      <rect x="25" y="28" width="8" height="50" rx="2" fill={active ? '#1C2E5B' : '#E2E8F0'} opacity={0.3} />
      <rect x="25" y="48" width="8" height="30" rx="2" fill={active ? '#1C2E5B' : '#CBD5E1'} />
      <rect x="39" y="28" width="8" height="50" rx="2" fill={active ? '#1C2E5B' : '#E2E8F0'} opacity={0.3} />
      <rect x="39" y="38" width="8" height="40" rx="2" fill={active ? '#9B1B30' : '#CBD5E1'} />
      <rect x="53" y="28" width="8" height="50" rx="2" fill={active ? '#1C2E5B' : '#E2E8F0'} opacity={0.3} />
      <rect x="53" y="33" width="8" height="45" rx="2" fill={active ? '#1C2E5B' : '#CBD5E1'} />
      <rect x="67" y="28" width="8" height="50" rx="2" fill={active ? '#1C2E5B' : '#E2E8F0'} opacity={0.3} />
      <rect x="67" y="43" width="8" height="35" rx="2" fill={active ? '#9B1B30' : '#CBD5E1'} />
      <rect x="81" y="28" width="8" height="50" rx="2" fill={active ? '#1C2E5B' : '#E2E8F0'} opacity={0.3} />
      <rect x="81" y="30" width="8" height="48" rx="2" fill={active ? '#1C2E5B' : '#CBD5E1'} />
      <line x1="22" y1="78" x2="98" y2="78" stroke={active ? '#1C2E5B' : '#CBD5E1'} strokeWidth={1.5} />
      <path d="M25 25L50 18L75 22L98 15" stroke={active ? '#B8860B' : '#E2E8F0'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="98" cy="15" r="3" fill={active ? '#B8860B' : '#E2E8F0'} />
      <rect x="30" y="85" width="60" height="10" rx="3" fill={active ? '#1C2E5B' : '#E2E8F0'} />
      <rect x="42" y="88" width="36" height="4" rx="2" fill={active ? '#B8860B' : '#CBD5E1'} />
    </svg>
  );
}

const BRAND_SVGS = {
  commander: CommanderSVG,
  patriot: PatriotSVG,
  reformer: ReformerSVG,
  community: CommunitySVG,
  executive: ExecutiveSVG,
};

export default function Stage3_BrandCore() {
  const { state, dispatch } = useBrand();
  const [hoveredId, setHoveredId] = useState(null);
  const selectedId = state.brandCore;

  const selectBrand = (id) => {
    dispatch({ type: 'SET_BRAND_CORE', payload: id === selectedId ? null : id });
  };

  return (
    <StageContainer
      stageNumber={3}
      title="Choose Your Brand Core"
      subtitle="This is the defining moment. Select the brand archetype that best represents the candidate's identity and campaign."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRAND_KEYS.map((key, index) => {
          const brand = BRAND_CORES[key];
          const SvgComponent = BRAND_SVGS[key];
          const isSelected = selectedId === key;
          const isHovered = hoveredId === key;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredId(key)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => selectBrand(key)}
              className="relative cursor-pointer group"
            >
              <motion.div
                animate={{
                  scale: isSelected ? 1.02 : 1,
                  borderColor: isSelected ? brand.colors.secondary : isHovered ? brand.colors.primary : '#e5e7eb',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm hover:shadow-xl transition-shadow"
                style={
                  isSelected
                    ? {
                        boxShadow: `0 20px 40px -12px ${brand.colors.primary}30, 0 0 0 2px ${brand.colors.secondary}`,
                      }
                    : {}
                }
              >
                {/* Colored top bar */}
                <motion.div
                  animate={{
                    height: isSelected ? 6 : 3,
                    backgroundColor: isSelected ? brand.colors.secondary : isHovered ? brand.colors.primary : '#e5e7eb',
                  }}
                  className="w-full"
                />

                {/* SVG Illustration */}
                <div className="px-8 pt-6 pb-2 flex justify-center">
                  <div className="w-28 h-28">
                    <SvgComponent active={isSelected || isHovered} />
                  </div>
                </div>

                {/* Brand Name & Descriptor */}
                <div className="px-8 pb-4 text-center">
                  <motion.h3
                    animate={{
                      color: isSelected ? brand.colors.primary : '#1f2937',
                    }}
                    className="text-xl font-bold tracking-wide mb-1"
                  >
                    {brand.name}
                  </motion.h3>
                  <p className="text-sm font-medium text-gray-500">{brand.descriptor}</p>
                </div>

                {/* Tagline always visible */}
                <div className="px-8 pb-4 text-center">
                  <p
                    className="text-sm italic"
                    style={{ color: isSelected ? brand.colors.secondary : '#9ca3af' }}
                  >
                    "{brand.tagline}"
                  </p>
                </div>

                {/* Expanded details on hover */}
                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 space-y-3 border-t border-gray-100 pt-4 mx-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                            Positioning
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">{brand.positioning}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                            Emotional Feel
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {brand.emotionalFeel.split(', ').map((feel) => (
                              <span
                                key={feel}
                                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: `${brand.colors.primary}15`,
                                  color: brand.colors.primary,
                                }}
                              >
                                {feel}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                            Sample Tagline
                          </p>
                          <p
                            className="text-sm font-bold italic"
                            style={{ color: brand.colors.secondary }}
                          >
                            "{brand.voiceTone.headlineExamples[0]}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: brand.colors.secondary }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Color bar at bottom when selected */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      className="h-1.5 w-full origin-left"
                      style={{
                        background: `linear-gradient(to right, ${brand.colors.primary}, ${brand.colors.secondary}, ${brand.colors.accent === '#FFFFFF' ? brand.colors.primary : brand.colors.accent})`,
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected brand summary */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 p-8 rounded-2xl border-2"
            style={{
              borderColor: BRAND_CORES[selectedId].colors.primary,
              backgroundColor: `${BRAND_CORES[selectedId].colors.primary}08`,
            }}
          >
            <div className="flex items-start gap-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: BRAND_CORES[selectedId].colors.primary }}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {BRAND_CORES[selectedId].name} Selected
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {BRAND_CORES[selectedId].philosophy}
                </p>
                <div className="flex gap-2 mt-4">
                  {Object.entries(BRAND_CORES[selectedId].colors)
                    .filter(([k]) => ['primary', 'secondary', 'accent'].includes(k))
                    .map(([key, hex]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-xs text-gray-500 capitalize">{key}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StageContainer>
  );
}
