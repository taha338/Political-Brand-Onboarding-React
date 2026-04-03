import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES } from '../../data/brandData';
import StageContainer from '../StageContainer';

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

          {/* RECOMMENDED PALETTE — hero section */}
          {themeColors && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <button
                onClick={handleRecommendedSelect}
                className="w-full text-left group cursor-pointer"
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

                <h3 className="text-2xl font-black text-gray-900 mt-3 mb-1 tracking-tight">
                  {coreData?.name} Palette
                </h3>
                <p className="text-sm text-gray-400 mb-5 max-w-md leading-relaxed">
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
                        <p className="text-[11px] font-semibold text-gray-700 mt-2">{label}</p>
                        <p className="text-[10px] font-mono text-gray-300">{color}</p>
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
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-300">
              or pick a preset
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* PRESET PALETTE GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRESET_PALETTES.map((preset) => {
              const isActive = activeTab === 'custom' && selectedPreset === preset.id;
              return (
                <motion.button
                  key={preset.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`
                    text-left p-3 rounded-xl transition-all duration-200 cursor-pointer relative
                    ${isActive
                      ? 'bg-gray-900 shadow-lg'
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                  style={!isActive ? {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  } : undefined}
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
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                    {preset.name}
                  </p>
                  {isActive && (
                    <motion.div
                      layoutId="preset-check"
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
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
              <div className="pl-8 border-l border-gray-100">
                {/* Palette name, typographic */}
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-1">
                  Selected Palette
                </p>
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8">
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
                            <span className="text-sm font-bold text-gray-900">{label}</span>
                            <span className="text-[11px] font-mono text-gray-300">{color}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
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
                  <p className="text-[10px] text-gray-300 mt-2 text-right font-mono">
                    {COLOR_ROLES.map(({ key }) => activeColors[key]).join(' / ')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StageContainer>
  );
}
