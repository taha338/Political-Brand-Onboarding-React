import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES } from '../../data/brandData';
import StageContainer from '../StageContainer';
import TiltCard from '../TiltCard';
import AnimatedCheckmark from '../AnimatedCheckmark';

const PRESET_PALETTES = [
  {
    id: 'classic-patriot',
    name: 'Classic Patriot',
    colors: { primary: '#002868', secondary: '#BF0A30', accent: '#FFFFFF', background: '#F5F5F5', text: '#1A1A2E', highlight: '#FFD700' },
  },
  {
    id: 'modern-navy',
    name: 'Modern Navy',
    colors: { primary: '#1B2A4A', secondary: '#C8102E', accent: '#E8E8E8', background: '#FAFAFA', text: '#2D2D2D', highlight: '#4A90D9' },
  },
  {
    id: 'bold-crimson',
    name: 'Bold Crimson',
    colors: { primary: '#8B0000', secondary: '#1C1C1C', accent: '#D4AF37', background: '#FFF8F0', text: '#2C2C2C', highlight: '#C41E3A' },
  },
  {
    id: 'liberty-blue',
    name: 'Liberty Blue',
    colors: { primary: '#003366', secondary: '#CC0000', accent: '#F0F0F0', background: '#F7F9FC', text: '#333333', highlight: '#0066CC' },
  },
  {
    id: 'heritage-gold',
    name: 'Heritage Gold',
    colors: { primary: '#1A2744', secondary: '#8B1A2B', accent: '#D4C5A9', background: '#FAF8F5', text: '#4A3728', highlight: '#B8860B' },
  },
  {
    id: 'grassroots-green',
    name: 'Grassroots Green',
    colors: { primary: '#1B4332', secondary: '#2D6A4F', accent: '#D8F3DC', background: '#F0FFF4', text: '#1B1B1B', highlight: '#40916C' },
  },
  {
    id: 'executive-slate',
    name: 'Executive Slate',
    colors: { primary: '#2F3E46', secondary: '#354F52', accent: '#CAD2C5', background: '#F8F9FA', text: '#212529', highlight: '#52796F' },
  },
  {
    id: 'sunrise-energy',
    name: 'Sunrise Energy',
    colors: { primary: '#1C2E5B', secondary: '#E63946', accent: '#F1FAEE', background: '#FFFFFF', text: '#2B2D42', highlight: '#FF6B35' },
  },
];

const COLOR_ROLES = [
  { key: 'primary', label: 'Primary', desc: 'Main brand color for headers and key elements' },
  { key: 'secondary', label: 'Secondary', desc: 'Supporting color for buttons and accents' },
  { key: 'accent', label: 'Accent', desc: 'Contrast color for highlights and details' },
  { key: 'background', label: 'Background', desc: 'Page and section backgrounds' },
  { key: 'text', label: 'Text', desc: 'Body text and headings' },
  { key: 'highlight', label: 'Highlight', desc: 'Call-to-action and emphasis elements' },
];

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

/* ── Decorative SVG dot pattern ── */
function DecorativeDots({ style }) {
  return (
    <svg
      width="200" height="200"
      style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.04, ...style }}
    >
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r={2} fill="#1C2E5B" />
        ))
      )}
    </svg>
  );
}

/* ── Decorative SVG line pattern ── */
function DecorativeLines({ style }) {
  return (
    <svg
      width="300" height="300"
      style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.03, ...style }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={i} x1={0} y1={i * 20} x2={300} y2={i * 20} stroke="#8B1A2B" strokeWidth={1} />
      ))}
    </svg>
  );
}

/* ── Gradient heading style helper ── */
const gradientHeadingStyle = {
  background: 'linear-gradient(135deg, #1C2E5B, #8B1A2B)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default function Stage5_ColorPalette() {
  const { state, dispatch } = useBrand();
  const [activeTab, setActiveTab] = useState(state.colorMode || 'theme');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const coreData = state.brandCore ? BRAND_CORES[state.brandCore] : null;

  // Restore preset selection from state
  useState(() => {
    if (state.colorMode === 'custom' && state.customColors.primary) {
      const match = PRESET_PALETTES.find(p => p.colors.primary === state.customColors.primary && p.colors.secondary === state.customColors.secondary);
      if (match) setSelectedPreset(match.id);
    }
  });

  const activeColors = useMemo(() => {
    if (activeTab === 'custom' && selectedPreset) {
      const preset = PRESET_PALETTES.find(p => p.id === selectedPreset);
      return preset?.colors || { primary: '#1C2E5B', secondary: '#B22234', accent: '#FFFFFF', background: '#F5F5F5', text: '#333333', highlight: '#4A90D9' };
    }
    if (coreData) {
      return { ...coreData.colors, highlight: coreData.colors.secondary };
    }
    return { primary: '#1C2E5B', secondary: '#B22234', accent: '#FFFFFF', background: '#F5F5F5', text: '#333333', highlight: '#4A90D9' };
  }, [activeTab, selectedPreset, coreData]);

  const activePaletteName = useMemo(() => {
    if (activeTab === 'theme') return `${coreData?.name || 'Theme'} Palette`;
    const preset = PRESET_PALETTES.find(p => p.id === selectedPreset);
    return preset?.name || 'Custom Palette';
  }, [activeTab, selectedPreset, coreData]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    dispatch({ type: 'SET_COLOR_MODE', payload: tab });
  };

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    handleTabSwitch('custom');
    const preset = PRESET_PALETTES.find(p => p.id === presetId);
    if (preset) {
      dispatch({ type: 'SET_CUSTOM_COLORS', payload: preset.colors });
    }
  };

  const handleRecommendedSelect = () => {
    handleTabSwitch('theme');
    setSelectedPreset(null);
  };

  const themeColors = coreData
    ? { ...coreData.colors, highlight: coreData.colors.secondary }
    : null;

  const showRightPanel = activeTab === 'theme' || (activeTab === 'custom' && selectedPreset);

  return (
    <StageContainer
      title="Color Palette"
      subtitle="Choose the colors that will define your campaign's visual identity."
      stageNumber={5}
    >
      <div className="flex gap-8 items-start">
        {/* LEFT PANEL — selection options */}
        <div className={`transition-all duration-500 ${showRightPanel ? 'w-3/5' : 'w-full'}`}>

          {/* RECOMMENDED PALETTE — hero section in rounded 40px container */}
          {themeColors && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ borderRadius: 40, background: 'white', padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}
            >
              {/* Decorative SVG backgrounds */}
              <DecorativeDots style={{ top: -20, right: -20 }} />
              <DecorativeLines style={{ bottom: -60, left: -60 }} />

              <button
                onClick={handleRecommendedSelect}
                className="w-full text-left group cursor-pointer"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: themeColors.primary,
                      color: isLightColor(themeColors.primary) ? themeColors.text : '#fff',
                    }}
                  >
                    Recommended
                  </span>
                  {activeTab === 'theme' && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] font-medium text-emerald-600 tracking-wide"
                    >
                      Active
                    </motion.span>
                  )}
                </div>

                {/* Gradient heading */}
                <h3 style={{ ...gradientHeadingStyle, fontSize: '1.5rem', fontWeight: 900, marginTop: 12, marginBottom: 4, display: 'inline-block', letterSpacing: '-0.02em' }}>
                  {coreData?.name} Palette
                </h3>
                <p className="text-sm mb-5 max-w-md leading-relaxed" style={{ opacity: 0.6 }}>
                  Curated for the <em>{coreData?.emotionalFeel?.toLowerCase()}</em> quality of
                  your {coreData?.name} brand core.
                </p>

                {/* Big swatches row */}
                <div className="flex gap-3">
                  {COLOR_ROLES.map(({ key, label }, i) => {
                    const color = themeColors[key] || themeColors.secondary;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="flex-1"
                      >
                        <div
                          className="aspect-[4/3] rounded-lg group-hover:scale-[1.02] transition-transform duration-200"
                          style={{
                            backgroundColor: color,
                            boxShadow: isLightColor(color)
                              ? 'inset 0 0 0 1px rgba(0,0,0,0.08)'
                              : 'none',
                          }}
                        />
                        <p className="text-[11px] font-semibold mt-2" style={{ opacity: 0.7 }}>{label}</p>
                        <p className="text-[10px] font-mono" style={{ opacity: 0.4 }}>{color}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Thin accent bar using the palette */}
                <div className="mt-4 h-1.5 rounded-full overflow-hidden flex">
                  {COLOR_ROLES.map(({ key }) => (
                    <div
                      key={key}
                      className="flex-1"
                      style={{ backgroundColor: themeColors[key] || themeColors.secondary }}
                    />
                  ))}
                </div>
              </button>
            </motion.div>
          )}

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-7">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ opacity: 0.4 }}>
              or pick a preset
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* PRESET PALETTE GRID — rounded 40px container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ borderRadius: 40, background: 'white', padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden' }}
          >
            <DecorativeDots style={{ bottom: -20, left: -20 }} />

            {/* Section heading with gradient */}
            <h2 style={{ ...gradientHeadingStyle, fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, display: 'inline-block' }}>
              Preset Palettes
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ position: 'relative', zIndex: 1 }}>
              {PRESET_PALETTES.map((preset) => {
                const isActive = activeTab === 'custom' && selectedPreset === preset.id;
                return (
                  <TiltCard
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`
                      text-left p-3 rounded-xl transition-all duration-200 cursor-pointer
                      ${isActive
                        ? 'bg-gray-900 shadow-lg'
                        : 'bg-white hover:bg-gray-50'
                      }
                    `}
                    style={
                      isActive
                        ? { boxShadow: '0 0 20px rgba(139,26,43,0.3), 0 0 40px rgba(139,26,43,0.1)' }
                        : { boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }
                    }
                  >
                    {/* Color strip */}
                    <div className="flex h-8 rounded-md overflow-hidden mb-2.5">
                      {COLOR_ROLES.map(({ key }) => (
                        <div
                          key={key}
                          className="flex-1"
                          style={{ backgroundColor: preset.colors[key] }}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : ''}`} style={!isActive ? { opacity: 0.7 } : undefined}>
                      {preset.name}
                    </p>
                    {isActive && (
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
                        <AnimatedCheckmark size={20} color="#FFFFFF" />
                      </div>
                    )}
                  </TiltCard>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL — spec sheet */}
        <AnimatePresence mode="wait">
          {showRightPanel && (
            <motion.div
              key={activeTab + selectedPreset}
              initial={{ opacity: 0, x: 40, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '40%' }}
              exit={{ opacity: 0, x: 40, width: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="sticky top-8 min-w-0 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ borderRadius: 40, background: 'white', padding: 40, position: 'relative', overflow: 'hidden' }}
              >
                {/* Decorative background */}
                <DecorativeLines style={{ top: -40, right: -40 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Palette name, typographic */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ opacity: 0.4 }}>
                    Selected Palette
                  </p>
                  <h2 style={{ ...gradientHeadingStyle, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 32, display: 'inline-block' }}>
                    {activePaletteName}
                  </h2>

                  {/* Vertical color spec list */}
                  <div className="space-y-5">
                    {COLOR_ROLES.map(({ key, label, desc }, i) => {
                      const color = activeColors[key];
                      const light = isLightColor(color);
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.35 }}
                          className="flex gap-4 items-start"
                        >
                          {/* Large swatch */}
                          <div
                            className="w-16 h-16 rounded-lg flex-shrink-0"
                            style={{
                              backgroundColor: color,
                              boxShadow: light
                                ? 'inset 0 0 0 1px rgba(0,0,0,0.08)'
                                : '0 2px 8px rgba(0,0,0,0.12)',
                            }}
                          />
                          {/* Details */}
                          <div className="pt-0.5 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-bold" style={{ opacity: 0.9 }}>{label}</span>
                              <span className="text-[11px] font-mono" style={{ opacity: 0.4 }}>{color}</span>
                            </div>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ opacity: 0.6 }}>{desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Full palette bar at bottom */}
                  <div className="mt-10">
                    <div className="h-3 rounded-full overflow-hidden flex">
                      {COLOR_ROLES.map(({ key }) => (
                        <div
                          key={key}
                          className="flex-1 transition-colors duration-300"
                          style={{ backgroundColor: activeColors[key] }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] mt-2 text-right font-mono" style={{ opacity: 0.4 }}>
                      {COLOR_ROLES.map(({ key }) => activeColors[key]).join(' / ')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StageContainer>
  );
}
