import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES } from '../../data/brandData';
import StageContainer from '../StageContainer';

const COLLATERAL_TYPES = [
  { type: 'Yard Signs', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M9 21V9m6 12V9M4 9h16l-2-4H6L4 9z" /></svg>
  )},
  { type: 'Bumper Stickers', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10M7 11h6m-9 8h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )},
  { type: 'Door Hangers', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
  )},
  { type: 'Business Cards', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
  )},
  { type: 'Event Banners', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" /></svg>
  )},
  { type: 'Direct Mail', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  )},
  { type: 'Social Templates', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
  )},
  { type: 'Rally Signage', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
  )},
  { type: 'Vehicle Wraps', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.368L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" /></svg>
  )},
  { type: 'Merchandise', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
  )},
  { type: 'Letterhead', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  )},
  { type: 'Presentation Deck', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
  )},
  { type: 'Website', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
  )},
];

const PRIORITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const PRIORITY_CONFIG = {
  CRITICAL: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-500 text-white',
    glow: 'shadow-red-200/60 shadow-lg',
    ring: 'ring-2 ring-red-200',
    iconBg: 'bg-red-100 text-red-600',
  },
  HIGH: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-500 text-white',
    glow: 'shadow-orange-200/50 shadow-md',
    ring: 'ring-1 ring-orange-200',
    iconBg: 'bg-orange-100 text-orange-600',
  },
  MEDIUM: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-400 text-amber-900',
    glow: 'shadow-sm',
    ring: 'ring-1 ring-amber-100',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  LOW: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
    badge: 'bg-gray-400 text-white',
    glow: '',
    ring: 'ring-1 ring-gray-100',
    iconBg: 'bg-gray-100 text-gray-400',
  },
};

/* Decorative dot pattern SVG background */
const DotPattern = () => (
  <svg
    style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, opacity: 0.04, pointerEvents: 'none' }}
    viewBox="0 0 200 200"
    fill="none"
  >
    {Array.from({ length: 10 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r={2} fill="#1C2E5B" />
      ))
    )}
  </svg>
);

/* Decorative line pattern SVG background */
const LinePattern = () => (
  <svg
    style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, opacity: 0.03, pointerEvents: 'none' }}
    viewBox="0 0 160 160"
    fill="none"
  >
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={0} y1={i * 20 + 10} x2={160} y2={i * 20 + 10} stroke="#8B1A2B" strokeWidth={1} />
    ))}
  </svg>
);

const gradientHeadingStyle = {
  background: 'linear-gradient(135deg, #1C2E5B, #8B1A2B)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const selectedGlowStyle = {
  boxShadow: '0 0 20px rgba(139,26,43,0.3), 0 0 40px rgba(139,26,43,0.1)',
};

function CollateralCard({ item, priority, onChange, index, brandNote }) {
  const config = PRIORITY_CONFIG[priority || 'LOW'];
  const isHighPriority = priority === 'CRITICAL' || priority === 'HIGH';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 text-center ${config.bg} ${config.border} ${config.glow} ${config.ring}`}
      style={isHighPriority ? selectedGlowStyle : {}}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${config.iconBg}`}>
        {item.icon}
      </div>

      <p className="text-sm font-semibold leading-tight" style={{ color: '#1a1a1a', opacity: 0.85 }}>{item.type}</p>

      <select
        value={priority || 'LOW'}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none appearance-none text-center ${config.badge}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {brandNote && (
        <p className="text-[10px] leading-snug mt-1 line-clamp-2" style={{ color: '#1a1a1a', opacity: 0.6 }}>{brandNote}</p>
      )}
    </motion.div>
  );
}

export default function Stage8_CollateralPriority() {
  const { state, dispatch } = useBrand();
  const brandCore = BRAND_CORES[state.brandCore];
  const brandCollateral = brandCore?.collateral || [];

  // Build lookup of brand-recommended notes
  const brandNotes = useMemo(() => {
    const map = {};
    brandCollateral.forEach((c) => {
      map[c.type] = c.notes;
    });
    return map;
  }, [brandCollateral]);

  // Initialize priorities from brand core data on mount
  useEffect(() => {
    if (Object.keys(state.collateralPriorities).length === 0 && brandCollateral.length > 0) {
      const defaults = {};
      brandCollateral.forEach((c) => {
        defaults[c.type] = c.priority;
      });
      // Set remaining to LOW
      COLLATERAL_TYPES.forEach((ct) => {
        if (!defaults[ct.type]) defaults[ct.type] = 'LOW';
      });
      dispatch({ type: 'SET_COLLATERAL_PRIORITIES', payload: defaults });
    }
  }, [brandCollateral, state.collateralPriorities, dispatch]);

  const handleChange = (type, value) => {
    dispatch({ type: 'SET_COLLATERAL_PRIORITIES', payload: { [type]: value } });
  };

  const stats = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    COLLATERAL_TYPES.forEach((ct) => {
      const p = state.collateralPriorities[ct.type] || 'LOW';
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [state.collateralPriorities]);

  // Match brand collateral type names to our types (handle "Social Media Templates" vs "Social Templates")
  const getPriority = (type) => {
    if (state.collateralPriorities[type]) return state.collateralPriorities[type];
    // Try partial match
    const match = Object.keys(state.collateralPriorities).find(
      (k) => k.toLowerCase().includes(type.toLowerCase().split(' ')[0])
    );
    return match ? state.collateralPriorities[match] : 'LOW';
  };

  const getNote = (type) => {
    if (brandNotes[type]) return brandNotes[type];
    const match = Object.keys(brandNotes).find(
      (k) => k.toLowerCase().includes(type.toLowerCase().split(' ')[0])
    );
    return match ? brandNotes[match] : null;
  };

  return (
    <StageContainer
      title="Collateral Priority Matrix"
      subtitle="Set production priorities for your campaign materials. Use the dropdown on each card to select the priority level."
      stageNumber={7}
    >
      {/* Priority legend - rounded 40px container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ borderRadius: 40, background: 'white', padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}
      >
        <DotPattern />

        <h3 style={{ ...gradientHeadingStyle, fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, display: 'inline-block' }}>
          Priority Levels
        </h3>

        <div className="flex flex-wrap items-center gap-4 mb-2">
          {PRIORITIES.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${PRIORITY_CONFIG[p].badge}`}>
                {p}
              </span>
              <span className="text-xs font-mono" style={{ color: '#1a1a1a', opacity: 0.6 }}>{stats[p] || 0}</span>
            </div>
          ))}
          <span className="text-[10px] ml-auto hidden sm:block" style={{ color: '#1a1a1a', opacity: 0.6 }}>Use dropdowns to set priority</span>
        </div>
      </motion.div>

      {/* Brand recommendation banner - rounded 40px container */}
      {brandCore && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ borderRadius: 40, background: 'white', padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}
        >
          <LinePattern />
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-900">
                {brandCore.name} Brand Recommendations Applied
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#4338ca', opacity: 0.6 }}>
                Priorities have been pre-populated based on your brand core. Adjust as needed for your specific campaign.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Card grid - rounded 40px container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.5 }}
        style={{ borderRadius: 40, background: 'white', padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}
      >
        <DotPattern />
        <LinePattern />

        <h3 style={{ ...gradientHeadingStyle, fontSize: '1.25rem', fontWeight: 700, marginBottom: 24, display: 'inline-block' }}>
          Campaign Materials
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {COLLATERAL_TYPES.map((item, i) => (
            <CollateralCard
              key={item.type}
              item={item}
              priority={getPriority(item.type)}
              onChange={(value) => handleChange(item.type, value)}
              index={i}
              brandNote={getNote(item.type)}
            />
          ))}
        </div>
      </motion.div>

      {/* Summary bar - rounded 40px container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800"
        style={{ borderRadius: 40, padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}
      >
        {/* Decorative dot pattern for dark section */}
        <svg
          style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, opacity: 0.05, pointerEvents: 'none' }}
          viewBox="0 0 200 200"
          fill="none"
        >
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r={2} fill="#ffffff" />
            ))
          )}
        </svg>

        <h3
          style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#818cf8', marginBottom: 16 }}
        >
          Priority Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRIORITIES.map((p) => {
            const items = COLLATERAL_TYPES.filter((ct) => getPriority(ct.type) === p);
            return (
              <div key={p} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${PRIORITY_CONFIG[p].badge}`}>
                    {p}
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#ffffff', opacity: 0.4 }}>{items.length}</span>
                </div>
                <div className="space-y-1">
                  {items.map((ct) => (
                    <p key={ct.type} className="text-xs truncate" style={{ color: '#ffffff', opacity: 0.6 }}>{ct.type}</p>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs italic" style={{ color: '#ffffff', opacity: 0.2 }}>None</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </StageContainer>
  );
}
