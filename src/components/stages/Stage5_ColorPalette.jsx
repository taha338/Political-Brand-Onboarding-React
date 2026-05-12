import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES } from '../../data/brandData';
import StageContainer from '../StageContainer';

const COLOR_ROLES = [
  { key: 'primary',    label: 'Primary',             desc: 'Main brand color for headers and key elements' },
  { key: 'secondary',  label: 'Secondary',           desc: 'Supporting color for buttons and accents' },
  { key: 'accent',     label: 'Tertiary',            desc: 'Third supporting brand color' },
  { key: 'background', label: 'Additional Colour 1', desc: 'Page and section backgrounds' },
  { key: 'text',       label: 'Additional Colour 2', desc: 'Body text and headings' },
  { key: 'additional', label: 'Additional Colour 3', desc: 'Extra brand accent or tint' },
];

/* ── WCAG 2.1 AA Contrast Helpers ── */

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string' || hex.length < 7) return { r: 128, g: 128, b: 128 };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function srgbToLinear(value) {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

/* ── Palette Card Component ── */
function PaletteCard({ name, colors, isActive, onClick, badge, description, index, fullWidth }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      whileHover={!isActive ? { y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.10)' } : {}}
      style={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        background: isActive ? '#FDF2F2' : '#FFFFFF',
        border: isActive ? '2px solid #8B1A2B' : '0.5px solid #64748B',
        borderRadius: fullWidth ? 12 : 10,
        boxShadow: isActive
          ? '0 0 0 3px rgba(139,26,43,0.12)'
          : fullWidth ? '0 2px 8px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
      }}
    >
      {/* Card body */}
      <div style={{
        padding: fullWidth ? '14px 20px' : '12px 14px',
        display: fullWidth ? 'flex' : 'block',
        alignItems: fullWidth ? 'center' : undefined,
        gap: fullWidth ? 24 : undefined,
      }}>
        {/* Name + badge + description */}
        <div style={{ flex: fullWidth ? '0 0 auto' : undefined, minWidth: fullWidth ? 200 : undefined, marginBottom: fullWidth ? 0 : 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: description ? 4 : 0 }}>
            {isActive && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16, borderRadius: '50%', backgroundColor: '#8B1A2B',
                fontSize: 10, color: '#FFFFFF', fontWeight: 700, flexShrink: 0, lineHeight: 1,
              }}>{'\u2713'}</span>
            )}
            {badge && (
              <span style={{
                fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '2px 7px', borderRadius: 4,
                backgroundColor: colors.primary,
                color: isLightColor(colors.primary) ? colors.text : '#FFFFFF',
              }}>
                {badge}
              </span>
            )}
            <h3 style={{ fontSize: fullWidth ? 17 : 13, fontWeight: 700, color: '#1C2E5B', margin: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </h3>
          </div>
          {description && (
            <p style={{ fontSize: 10, color: '#6B7280', margin: 0, lineHeight: 1.4, maxWidth: fullWidth ? 260 : undefined }}>{description}</p>
          )}
        </div>

        {/* Color swatches */}
        <div style={{
          flex: fullWidth ? 1 : undefined,
          display: 'flex',
          gap: 6,
        }}>
          {COLOR_ROLES.map(({ key, label }) => {
            const color = colors[key] || colors.secondary;
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, flex: 1 }}>
                <div style={{
                  width: '100%',
                  height: fullWidth ? 38 : 28,
                  borderRadius: 5,
                  backgroundColor: color,
                }} />
                <span style={{ fontSize: 7.5, fontWeight: 600, marginTop: 4, color: '#6B7280', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}


export default function Stage5_ColorPalette() {
  const { state, dispatch, getActiveColors } = useBrand();
  const [activeTab, setActiveTab] = useState(state.colorMode || 'theme');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const bannerRef = useRef(null);
  const coreData = state.brandCore ? BRAND_CORES[state.brandCore] : null;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Restore preset selection from state
  const subPalettes = BRAND_CORES[state.brandCore]?.subPalettes || [];

  useState(() => {
    if (state.colorMode === 'custom' && state.customColors.primary) {
      const match = subPalettes.find(p => p.colors.primary === state.customColors.primary && p.colors.secondary === state.customColors.secondary);
      if (match) setSelectedPreset(match.id);
    }
  });

  const activeColors = getActiveColors();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    dispatch({ type: 'SET_COLOR_MODE', payload: tab });
  };

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    handleTabSwitch('custom');
    const allPresets = BRAND_CORES[state.brandCore]?.subPalettes || [];
    const preset = allPresets.find(p => p.id === presetId);
    if (preset) {
      dispatch({ type: 'SET_CUSTOM_COLORS', payload: preset.colors });
    }
    setTimeout(() => bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  };

  const handleRecommendedSelect = () => {
    handleTabSwitch('theme');
    setSelectedPreset(null);
    setTimeout(() => bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  };

  const themeColors = coreData
    ? { ...coreData.colors, additional: coreData.colors.additional || coreData.colors.accent }
    : null;

  const showPreview = activeTab === 'theme' || (activeTab === 'custom' && selectedPreset);

  return (
    <>
      <StageContainer
        title="Color Palette"
        subtitle="Choose the colors that will define your campaign's visual identity."
        stageNumber={5}
      >
        {/* Live palette strip across the top */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            height: 12, borderRadius: 999, overflow: 'hidden', display: 'flex',
            marginBottom: 24, transformOrigin: 'left',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          }}
        >
          {COLOR_ROLES.map(({ key }) => (
            <div
              key={key}
              style={{ flex: 1, backgroundColor: showPreview ? activeColors[key] : (key === 'primary' ? '#1C2E5B' : key === 'secondary' ? '#C93545' : '#E5E7EB'), transition: 'background-color 0.4s ease' }}
            />
          ))}
        </motion.div>

        {/* 1. Recommended palette — full width banner */}
        {themeColors && (
          <div style={{ marginBottom: 16 }}>
            <PaletteCard
              name={`${coreData?.name} Palette`}
              colors={themeColors}
              isActive={activeTab === 'theme'}
              onClick={handleRecommendedSelect}
              badge="Recommended"
              description={`Curated for the ${coreData?.emotionalFeel?.toLowerCase()} quality of your ${coreData?.name} brand core.`}
              index={0}
              fullWidth
            />
          </div>
        )}

        {/* 2. Other palettes — 2-col grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 10,
          marginBottom: 28,
        }}>
          {(BRAND_CORES[state.brandCore]?.subPalettes || []).map((preset, index) => {
            const isActive = activeTab === 'custom' && selectedPreset === preset.id;
            return (
              <PaletteCard
                key={preset.id}
                name={preset.name}
                colors={preset.colors}
                isActive={isActive}
                onClick={() => handlePresetSelect(preset.id)}
                index={index + 1}
              />
            );
          })}
        </div>

      </StageContainer>
    </>
  );
}
