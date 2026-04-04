import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES, FONT_LIBRARY } from '../../data/brandData';
import StageContainer from '../StageContainer';

/* ── Expanded Font Options ── */
const HEADING_FONT_OPTIONS = [
  { name: 'Playfair Display', category: 'Serif Display' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Libre Baskerville', category: 'Serif' },
  { name: 'EB Garamond', category: 'Serif' },
  { name: 'Cormorant Garamond', category: 'Serif' },
  { name: 'Crimson Text', category: 'Serif' },
  { name: 'Bitter', category: 'Serif' },
  { name: 'Vollkorn', category: 'Serif' },
  { name: 'Spectral', category: 'Serif' },
  { name: 'DM Serif Display', category: 'Serif Display' },
  { name: 'Bodoni Moda', category: 'Serif Display' },
  { name: 'Noto Serif', category: 'Serif' },
  { name: 'PT Serif', category: 'Serif' },
  { name: 'Josefin Slab', category: 'Slab Serif' },
  { name: 'Cinzel', category: 'Serif Display' },
  { name: 'Abril Fatface', category: 'Display' },
  { name: 'Old Standard TT', category: 'Serif' },
  { name: 'Cardo', category: 'Serif' },
  { name: 'Alegreya', category: 'Serif' },
  { name: 'Frank Ruhl Libre', category: 'Serif' },
  { name: 'Oswald', category: 'Sans-Serif Condensed' },
  { name: 'Montserrat', category: 'Sans-Serif' },
  { name: 'Poppins', category: 'Sans-Serif' },
  { name: 'Raleway', category: 'Sans-Serif' },
  { name: 'Bebas Neue', category: 'Display' },
  { name: 'Anton', category: 'Display' },
  { name: 'Barlow Condensed', category: 'Sans-Serif Condensed' },
  { name: 'Archivo Black', category: 'Display' },
];

const BODY_FONT_OPTIONS = [
  { name: 'Open Sans', category: 'Sans-Serif' },
  { name: 'Lato', category: 'Sans-Serif' },
  { name: 'Roboto', category: 'Sans-Serif' },
  { name: 'Source Sans Pro', category: 'Sans-Serif' },
  { name: 'Nunito', category: 'Sans-Serif' },
  { name: 'Inter', category: 'Sans-Serif' },
  { name: 'Work Sans', category: 'Sans-Serif' },
  { name: 'PT Sans', category: 'Sans-Serif' },
  { name: 'Raleway', category: 'Sans-Serif' },
  { name: 'Mukta', category: 'Sans-Serif' },
  { name: 'Rubik', category: 'Sans-Serif' },
  { name: 'Karla', category: 'Sans-Serif' },
  { name: 'Cabin', category: 'Sans-Serif' },
  { name: 'Nunito Sans', category: 'Sans-Serif' },
  { name: 'Fira Sans', category: 'Sans-Serif' },
  { name: 'DM Sans', category: 'Sans-Serif' },
  { name: 'Manrope', category: 'Sans-Serif' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif' },
  { name: 'Outfit', category: 'Sans-Serif' },
  { name: 'Red Hat Display', category: 'Sans-Serif' },
  { name: 'IBM Plex Sans', category: 'Sans-Serif' },
  { name: 'Libre Franklin', category: 'Sans-Serif' },
  { name: 'Barlow', category: 'Sans-Serif' },
  { name: 'Noto Sans', category: 'Sans-Serif' },
  { name: 'Ubuntu', category: 'Sans-Serif' },
  { name: 'Quicksand', category: 'Sans-Serif' },
  { name: 'Mulish', category: 'Sans-Serif' },
  { name: 'Assistant', category: 'Sans-Serif' },
  { name: 'Lexend', category: 'Sans-Serif' },
  { name: 'Urbanist', category: 'Sans-Serif' },
];

/* ── Dynamic Google Font Loader ── */
const loadedFonts = new Set();

function loadGoogleFont(fontName) {
  if (!fontName || loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);

  const meta = FONT_LIBRARY[fontName];
  const weights = meta?.weights?.join(';') || '400;700';
  const family = `${fontName.replace(/\s/g, '+')}:wght@${weights}`;
  const href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.dynamicFont = fontName;
  document.head.appendChild(link);
}

function loadMultipleFonts(fontNames) {
  fontNames.filter(Boolean).forEach(loadGoogleFont);
}

/* ── Helpers ── */
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function textOnColor(bgHex) {
  return luminance(bgHex) > 0.55 ? '#1a1a1a' : '#ffffff';
}

/* ── Custom Font Dropdown ── */
function FontDropdown({ options, value, onChange, placeholder, fallbackStack }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Load fonts for visible options when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Load all option fonts when dropdown opens (they're small individual requests)
      const fontsToLoad = options.map(f => f.name);
      loadMultipleFonts(fontsToLoad);
    }
  }, [isOpen, options]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }, [search, options]);

  const handleSelect = (fontName) => {
    loadGoogleFont(fontName);
    onChange(fontName);
    setIsOpen(false);
    setSearch('');
  };

  const selectedFont = options.find(f => f.name === value);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{
          fontFamily: value ? `'${value}', ${fallbackStack}` : 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: value ? '#1C2E5B' : '#9CA3AF' }}>
          {value || placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M4 6L8 10L12 6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            marginTop: 4,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            maxHeight: 320,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search input */}
          <div style={{ padding: '8px 8px 4px' }}>
            <input
              type="text"
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          {/* Options list */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 4px 8px' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '12px 8px', fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
                No fonts found
              </div>
            )}
            {filtered.map((font) => {
              const isSelected = font.name === value;
              return (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => handleSelect(font.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: `'${font.name}', ${fallbackStack}`,
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#1C2E5B',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {font.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                      {font.category}
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: 14, color: '#2563EB', flexShrink: 0, marginLeft: 8 }}>
                      {'\u2713'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function Stage6_FontSelection() {
  const { state, dispatch } = useBrand();
  const coreData = state.brandCore ? BRAND_CORES[state.brandCore] : null;

  const selectedHeading = state.customFonts?.heading || '';
  const selectedBody = state.customFonts?.body || '';

  const recommendedHeading = coreData?.fonts?.heading || '';
  const recommendedBody = coreData?.fonts?.body || '';

  const activeColors = useMemo(() => {
    if (state.colorMode === 'custom' && state.customColors.primary) {
      return {
        primary: state.customColors.primary,
        secondary: state.customColors.secondary || '#B22234',
        accent: state.customColors.accent || '#FFFFFF',
        background: state.customColors.background || '#F5F5F5',
        text: state.customColors.text || '#333333',
      };
    }
    return coreData?.colors || { primary: '#1C2E5B', secondary: '#B22234', accent: '#FFFFFF', background: '#F5F5F5', text: '#333333' };
  }, [state.colorMode, state.customColors, coreData]);

  const candidateName = state.candidate?.fullName || 'John Smith';
  const candidateNameUpper = candidateName.toUpperCase();
  const office = state.candidate?.office || 'Senate';
  const officeLabel = office.charAt(0).toUpperCase() + office.slice(1).replace(/-/g, ' ');

  /* Load recommended fonts and any already-selected fonts on mount */
  useEffect(() => {
    loadMultipleFonts([recommendedHeading, recommendedBody, selectedHeading, selectedBody]);
  }, [recommendedHeading, recommendedBody, selectedHeading, selectedBody]);

  const handleSelectHeading = useCallback((fontName) => {
    loadGoogleFont(fontName);
    dispatch({ type: 'SET_CUSTOM_FONTS', payload: { heading: fontName } });
  }, [dispatch]);

  const handleSelectBody = useCallback((fontName) => {
    loadGoogleFont(fontName);
    dispatch({ type: 'SET_CUSTOM_FONTS', payload: { body: fontName } });
  }, [dispatch]);

  const handleUseRecommended = useCallback(() => {
    loadMultipleFonts([recommendedHeading, recommendedBody]);
    dispatch({ type: 'SET_CUSTOM_FONTS', payload: { heading: recommendedHeading, body: recommendedBody } });
  }, [dispatch, recommendedHeading, recommendedBody]);

  const isRecommendedActive = selectedHeading === recommendedHeading && selectedBody === recommendedBody;

  // For preview, use selected or fall back to recommended
  const previewHeading = selectedHeading || recommendedHeading;
  const previewBody = selectedBody || recommendedBody;

  if (!coreData) {
    return (
      <StageContainer title="Choose Your Fonts" subtitle="Select a heading font and a body font for your campaign brand." stageNumber={6}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg" style={{ color: '#1C2E5B', opacity: 0.6 }}>Please complete the previous stages first.</p>
        </div>
      </StageContainer>
    );
  }

  return (
    <StageContainer
      title="Choose Your Fonts"
      subtitle="Select a heading font and a body font for your campaign brand."
      stageNumber={6}
    >
      <div className="space-y-8">

        {/* ── Recommended Font Pair - Clickable Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
            Recommended for {coreData.name}
          </p>
          <motion.div
            onClick={handleUseRecommended}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.995 }}
            style={{
              cursor: 'pointer',
              borderRadius: 12,
              border: isRecommendedActive
                ? `2px solid ${activeColors.primary}`
                : '2px solid #E5E7EB',
              backgroundColor: isRecommendedActive ? `${activeColors.primary}0A` : '#FFFFFF',
              boxShadow: isRecommendedActive
                ? `0 0 0 3px ${activeColors.primary}18, 0 4px 12px rgba(0,0,0,0.06)`
                : '0 1px 4px rgba(0,0,0,0.04)',
              padding: '20px 24px',
              transition: 'border-color 0.25s, background-color 0.25s, box-shadow 0.25s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Quick pick badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: activeColors.primary,
                  color: textOnColor(activeColors.primary),
                }}>
                  Quick Pick
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Curated font pair
                </span>
              </div>
              {/* Checkmark or "Click to select" */}
              {isRecommendedActive ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: activeColors.primary,
                  color: textOnColor(activeColors.primary),
                  fontSize: 16,
                  fontWeight: 700,
                }}>
                  {'\u2713'}
                </span>
              ) : (
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#9CA3AF',
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                }}>
                  Click to select
                </span>
              )}
            </div>

            {/* Font samples */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {/* Heading font sample */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                  Heading
                </span>
                <div
                  style={{
                    fontFamily: `'${recommendedHeading}', serif`,
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#1C2E5B',
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {recommendedHeading}
                </div>
                <div
                  style={{
                    fontFamily: `'${recommendedHeading}', serif`,
                    fontSize: 18,
                    fontWeight: 700,
                    color: activeColors.primary,
                    lineHeight: 1.3,
                  }}
                >
                  Bold Leadership Starts Here
                </div>
              </div>

              {/* Body font sample */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                  Body
                </span>
                <div
                  style={{
                    fontFamily: `'${recommendedBody}', sans-serif`,
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#1C2E5B',
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {recommendedBody}
                </div>
                <div
                  style={{
                    fontFamily: `'${recommendedBody}', sans-serif`,
                    fontSize: 14,
                    color: '#6B7280',
                    lineHeight: 1.5,
                  }}
                >
                  This pairing was chosen to match the tone and personality of your brand direction. Clean, readable, and campaign-ready.
                </div>
              </div>
            </div>

            {/* Selected state highlight bar */}
            {isRecommendedActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                backgroundColor: activeColors.primary,
              }} />
            )}
          </motion.div>
        </motion.div>

        {/* ── Or Choose Your Own ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
            Or choose your own
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heading Font Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                Heading Font
              </label>
              <FontDropdown
                options={HEADING_FONT_OPTIONS}
                value={selectedHeading}
                onChange={handleSelectHeading}
                placeholder="Select a heading font..."
                fallbackStack="serif"
              />
            </div>

            {/* Body Font Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                Body Font
              </label>
              <FontDropdown
                options={BODY_FONT_OPTIONS}
                value={selectedBody}
                onChange={handleSelectBody}
                placeholder="Select a body font..."
                fallbackStack="sans-serif"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Live Preview ── */}
        {previewHeading && previewBody && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
              Live Preview
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {/* Preview header */}
              <div className="px-6 py-5" style={{ backgroundColor: activeColors.primary }}>
                <h2
                  className="text-2xl md:text-3xl leading-tight"
                  style={{
                    fontFamily: `'${previewHeading}', serif`,
                    fontWeight: 700,
                    color: activeColors.accent || '#FFFFFF',
                  }}
                >
                  {candidateNameUpper} FOR {officeLabel.toUpperCase()}
                </h2>
              </div>
              {/* Preview body */}
              <div className="px-6 py-5" style={{ backgroundColor: activeColors.background || '#F5F5F5' }}>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{
                    fontFamily: `'${previewBody}', sans-serif`,
                    color: activeColors.text || '#333333',
                  }}
                >
                  Fighting for our community's future. Join us in building a stronger tomorrow for every family in our state.
                </p>
                <span
                  className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold"
                  style={{
                    fontFamily: `'${previewHeading}', serif`,
                    backgroundColor: activeColors.secondary,
                    color: textOnColor(activeColors.secondary),
                  }}
                >
                  Get Involved
                </span>
              </div>
              {/* Font labels */}
              <div className="px-6 py-3 bg-white border-t border-gray-200 flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColors.secondary }} />
                  <span className="text-xs text-gray-500">
                    Heading: <strong style={{ fontFamily: `'${previewHeading}', serif` }}>{previewHeading}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColors.primary }} />
                  <span className="text-xs text-gray-500">
                    Body: <strong style={{ fontFamily: `'${previewBody}', sans-serif` }}>{previewBody}</strong>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </StageContainer>
  );
}
