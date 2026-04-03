import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES, FONT_LIBRARY } from '../../data/brandData';

function ConfettiPiece({ index }) {
  const colors = ['#B22234', '#1C2E5B', '#FFD700', '#CC2029', '#2C4A7C', '#8B1A2B', '#B8860B', '#4CAF50', '#E91E63', '#9C27B0'];
  const style = useMemo(() => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2.5 + Math.random() * 2}s`,
    backgroundColor: colors[index % colors.length],
    width: `${6 + Math.random() * 8}px`,
    height: `${6 + Math.random() * 8}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    transform: `rotate(${Math.random() * 360}deg)`,
  }), [index]);

  return <div className="confetti-piece" style={style} />;
}

function generatePDF(state, brandCore, colors) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  const addPageIfNeeded = (needed = 30) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 25;
    }
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // ---- COVER PAGE ----
  const primaryRgb = hexToRgb(colors.primary || '#1C2E5B');
  doc.setFillColor(...primaryRgb);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('BRAND DISCOVERY GUIDE', pageW / 2, 80, { align: 'center' });

  doc.setFontSize(32);
  doc.text(state.candidate.fullName || 'Campaign Brand Guide', pageW / 2, 110, { align: 'center' });

  doc.setFontSize(14);
  const subtitle = [state.candidate.office, state.candidate.state, state.candidate.district].filter(Boolean).join(' | ');
  doc.text(subtitle || 'Political Brand Foundation', pageW / 2, 125, { align: 'center' });

  if (brandCore) {
    doc.setFontSize(10);
    doc.text(`Brand Core: ${brandCore.name}`, pageW / 2, 145, { align: 'center' });
  }

  const secondaryRgb = hexToRgb(colors.secondary || '#B22234');
  doc.setFillColor(...secondaryRgb);
  doc.rect(margin, 160, contentW, 1, 'F');

  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, pageW / 2, 175, { align: 'center' });

  // ---- CANDIDATE BASICS ----
  doc.addPage();
  y = 25;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(18);
  doc.text('Candidate Information', margin, y);
  y += 12;

  doc.setFontSize(10);
  const candidateRows = [
    ['Full Name', state.candidate.fullName],
    ['Office', state.candidate.office],
    ['State', state.candidate.state],
    ['District', state.candidate.district],
    ['Election Year', state.candidate.electionYear],
    ['Race Focus', state.candidate.raceFocus],
    ['Candidate Type', state.candidate.candidateType],
    ['Party', state.candidate.partyAffiliation],
  ];

  candidateRows.forEach(([label, val]) => {
    if (!val) return;
    doc.setTextColor(120, 120, 120);
    doc.text(label, margin, y);
    doc.setTextColor(30, 30, 30);
    doc.text(String(val), margin + 50, y);
    y += 7;
  });

  // ---- PROFILE ----
  y += 8;
  addPageIfNeeded(40);
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Candidate Profile', margin, y);
  y += 12;

  doc.setFontSize(10);
  if (state.profile.backgrounds?.length) {
    doc.setTextColor(120, 120, 120);
    doc.text('Backgrounds:', margin, y);
    doc.setTextColor(30, 30, 30);
    doc.text(state.profile.backgrounds.join(', '), margin + 50, y);
    y += 7;
  }
  if (state.profile.policyPriorities?.length) {
    doc.setTextColor(120, 120, 120);
    doc.text('Policy Priorities:', margin, y);
    y += 6;
    doc.setTextColor(30, 30, 30);
    state.profile.policyPriorities.forEach((p) => {
      doc.text(`- ${p}`, margin + 5, y);
      y += 5;
    });
    y += 2;
  }
  if (state.profile.definingStory) {
    addPageIfNeeded(20);
    doc.setTextColor(120, 120, 120);
    doc.text('Defining Story:', margin, y);
    y += 6;
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(state.profile.definingStory, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  // ---- BRAND CORE ----
  doc.addPage();
  y = 25;
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Brand Core', margin, y);
  y += 12;

  if (brandCore) {
    doc.setFontSize(14);
    doc.text(brandCore.name, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(brandCore.descriptor, margin, y);
    y += 6;
    doc.text(`"${brandCore.tagline}"`, margin, y);
    y += 10;

    const posLines = doc.splitTextToSize(brandCore.positioning, contentW);
    doc.text(posLines, margin, y);
    y += posLines.length * 5 + 6;

    // Sub-direction
    if (state.subDirection) {
      const subDir = brandCore.subDirections?.find((s) => s.id === state.subDirection);
      if (subDir) {
        addPageIfNeeded(30);
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(12);
        doc.text(`Sub-Direction: ${subDir.name}`, margin, y);
        y += 7;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const descLines = doc.splitTextToSize(subDir.desc, contentW);
        doc.text(descLines, margin, y);
        y += descLines.length * 5 + 4;
      }
    }
  }

  // ---- COLOR PALETTE ----
  y += 8;
  addPageIfNeeded(50);
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('Color Palette', margin, y);
  y += 10;

  const swatches = [
    { label: 'Primary', hex: colors.primary },
    { label: 'Secondary', hex: colors.secondary },
    { label: 'Accent', hex: colors.accent },
    { label: 'Background', hex: colors.background || '#F5F5F5' },
    { label: 'Text', hex: colors.text || '#333333' },
    { label: 'Highlight', hex: colors.highlight || colors.secondary },
  ];

  swatches.forEach((swatch) => {
    if (!swatch.hex) return;
    const rgb = hexToRgb(swatch.hex);
    doc.setFillColor(...rgb);
    doc.rect(margin, y - 4, 15, 10, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 4, 15, 10, 'S');

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.text(`${swatch.label}: ${swatch.hex}`, margin + 20, y + 2);
    y += 14;
  });

  // ---- FONTS ----
  if (brandCore?.fonts) {
    y += 4;
    addPageIfNeeded(30);
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('Typography', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Heading Font: ${brandCore.fonts.heading}`, margin, y);
    y += 6;
    const headingMeta = FONT_LIBRARY[brandCore.fonts.heading];
    if (headingMeta) {
      doc.setTextColor(120, 120, 120);
      doc.text(`${headingMeta.category} | ${headingMeta.personality}`, margin + 5, y);
      y += 8;
    }

    doc.setTextColor(30, 30, 30);
    doc.text(`Body Font: ${brandCore.fonts.body}`, margin, y);
    y += 6;
    const bodyMeta = FONT_LIBRARY[brandCore.fonts.body];
    if (bodyMeta) {
      doc.setTextColor(120, 120, 120);
      doc.text(`${bodyMeta.category} | ${bodyMeta.personality}`, margin + 5, y);
      y += 8;
    }
  }

  // ---- COLLATERAL ----
  addPageIfNeeded(50);
  if (y > 30) {
    doc.addPage();
    y = 25;
  }
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Collateral Priority Matrix', margin, y);
  y += 12;

  const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const prioColors = { CRITICAL: [178, 34, 52], HIGH: [234, 120, 0], MEDIUM: [200, 170, 0], LOW: [150, 150, 150] };

  priorities.forEach((prio) => {
    const items = Object.entries(state.collateralPriorities).filter(([, v]) => v === prio);
    if (items.length === 0) return;
    addPageIfNeeded(20);

    doc.setFontSize(11);
    doc.setFillColor(...prioColors[prio]);
    doc.rect(margin, y - 3, 3, 6, 'F');
    doc.setTextColor(30, 30, 30);
    doc.text(prio, margin + 6, y + 1);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    items.forEach(([type]) => {
      doc.text(`- ${type}`, margin + 8, y);
      y += 5;
    });
    y += 4;
  });

  // Save
  const fileName = `${(state.candidate.fullName || 'Campaign').replace(/\s+/g, '_')}_Brand_Guide.pdf`;
  doc.save(fileName);
}

function hexLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function textOnColor(hex) {
  return hexLuminance(hex || '#1C2E5B') > 0.4 ? '#1a1a1a' : '#ffffff';
}

export default function Stage9_FinalReview() {
  const { state, dispatch, prevStage, goToStage, getActiveColors } = useBrand();
  const brandCore = BRAND_CORES[state.brandCore];
  const colors = getActiveColors();
  const [showConfetti, setShowConfetti] = useState(true);

  const subDir = useMemo(() => {
    if (!brandCore || !state.subDirection) return null;
    return brandCore.subDirections?.find((s) => s.id === state.subDirection);
  }, [brandCore, state.subDirection]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadJSON = useCallback(() => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(state.candidate.fullName || 'brand').replace(/\s+/g, '_')}_discovery.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const handleReset = useCallback(() => {
    if (window.confirm('Start a completely new brand discovery? All current data will be lost.')) {
      dispatch({ type: 'RESET' });
      goToStage(0);
    }
  }, [dispatch, goToStage]);

  const collateralByPriority = useMemo(() => {
    const grouped = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
    Object.entries(state.collateralPriorities).forEach(([type, prio]) => {
      if (grouped[prio]) grouped[prio].push(type);
    });
    return grouped;
  }, [state.collateralPriorities]);

  const primaryHex = colors.primary || '#1C2E5B';
  const secondaryHex = colors.secondary || '#B22234';
  const accentHex = colors.accent || '#FFFFFF';
  const bgHex = colors.background || '#F5F5F5';
  const textHex = colors.text || '#333333';
  const highlightHex = colors.highlight || colors.secondary || '#B22234';

  const headingFont = brandCore?.fonts?.heading || 'Georgia';
  const bodyFont = brandCore?.fonts?.body || 'system-ui';
  const headingMeta = FONT_LIBRARY[brandCore?.fonts?.heading];
  const bodyMeta = FONT_LIBRARY[brandCore?.fonts?.body];

  const prioConfig = {
    CRITICAL: { color: '#b22234', bg: '#fef2f2', border: '#fecaca', label: 'Must have on day one' },
    HIGH: { color: '#ea7800', bg: '#fff7ed', border: '#fed7aa', label: 'Need before launch ramp-up' },
    MEDIUM: { color: '#a16207', bg: '#fefce8', border: '#fde68a', label: 'Build as capacity allows' },
    LOW: { color: '#737373', bg: '#f5f5f5', border: '#e5e5e5', label: 'Nice to have down the road' },
  };

  const candidateFields = [
    { label: 'Office', value: state.candidate.office },
    { label: 'State', value: state.candidate.state },
    { label: 'District', value: state.candidate.district },
    { label: 'Year', value: state.candidate.electionYear },
    { label: 'Type', value: state.candidate.candidateType },
    { label: 'Party', value: state.candidate.partyAffiliation },
  ].filter((f) => f.value);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative overflow-hidden"
      style={{ fontFamily: bodyFont }}
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <style>{`
        .confetti-piece {
          position: absolute;
          top: -10px;
          opacity: 0;
          animation: confettiFall linear forwards;
        }
        @keyframes confettiFall {
          0% { opacity: 1; top: -10px; transform: rotate(0deg) translateX(0px); }
          25% { opacity: 1; transform: rotate(180deg) translateX(30px); }
          50% { opacity: 0.9; transform: rotate(360deg) translateX(-20px); }
          75% { opacity: 0.6; transform: rotate(540deg) translateX(15px); }
          100% { opacity: 0; top: 100vh; transform: rotate(720deg) translateX(-10px); }
        }
      `}</style>

      {/* ================================================================ */}
      {/* HERO - Full-width brand-colored banner                           */}
      {/* ================================================================ */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryHex} 0%, ${primaryHex}ee 60%, ${secondaryHex} 100%)` }}
      >
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-24 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={prevStage}
            className="no-print flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium mb-10 transition-colors"
            style={{ color: `${textOnColor(primaryHex)}99`, background: `${textOnColor(primaryHex)}0d` }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${textOnColor(primaryHex)}1a`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${textOnColor(primaryHex)}0d`; }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: `${textOnColor(primaryHex)}80` }}
          >
            Brand Discovery Complete
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
            style={{ color: textOnColor(primaryHex), fontFamily: headingFont }}
          >
            {state.candidate.fullName || 'Your Campaign'}
          </motion.h1>

          {candidateFields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5"
              style={{ color: `${textOnColor(primaryHex)}99` }}
            >
              {candidateFields.map((f, i) => (
                <span key={f.label} className="text-sm">
                  {i > 0 && <span className="mr-4" style={{ opacity: 0.3 }}>/</span>}
                  <span style={{ opacity: 0.5 }}>{f.label}</span>{' '}
                  <span className="font-medium" style={{ opacity: 0.85 }}>{f.value}</span>
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Decorative accent bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: secondaryHex }} />
      </div>

      {/* ================================================================ */}
      {/* BRAND CORE - Prominent full-width section                        */}
      {/* ================================================================ */}
      {brandCore && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
          style={{ backgroundColor: bgHex }}
        >
          <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
            <div className="max-w-3xl">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: secondaryHex }}
              >
                Brand Core
              </p>

              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
                style={{ color: textHex, fontFamily: headingFont }}
              >
                {brandCore.name}
              </h2>

              <p className="text-base mb-6" style={{ color: `${textHex}99` }}>
                {brandCore.descriptor}
              </p>

              <blockquote
                className="text-xl md:text-2xl font-medium italic mb-8 pl-5"
                style={{
                  color: primaryHex,
                  borderLeft: `3px solid ${secondaryHex}`,
                  fontFamily: headingFont,
                }}
              >
                &ldquo;{brandCore.tagline}&rdquo;
              </blockquote>

              <p className="text-base leading-relaxed" style={{ color: `${textHex}cc` }}>
                {brandCore.positioning}
              </p>

              {subDir && (
                <div
                  className="mt-10 rounded-xl p-6"
                  style={{
                    backgroundColor: `${primaryHex}0a`,
                    border: `1px solid ${primaryHex}18`,
                  }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: `${textHex}80` }}>
                    Sub-Direction
                  </p>
                  <p className="text-lg font-semibold mb-1" style={{ color: textHex, fontFamily: headingFont }}>
                    {subDir.name}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: `${textHex}99` }}>
                    {subDir.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ================================================================ */}
      {/* COLOR PALETTE - Full-width strip with large swatches             */}
      {/* ================================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white"
      >
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            Color Palette
          </p>

          {/* Large swatch strip */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-4">
            {[
              { label: 'Primary', hex: primaryHex },
              { label: 'Secondary', hex: secondaryHex },
              { label: 'Accent', hex: accentHex },
              { label: 'Background', hex: bgHex },
              { label: 'Text', hex: textHex },
              { label: 'Highlight', hex: highlightHex },
            ].map((swatch) => (
              <div key={swatch.label}>
                <div
                  className="aspect-[4/3] rounded-xl shadow-sm border border-black/5"
                  style={{ backgroundColor: swatch.hex }}
                />
                <p className="mt-2.5 text-sm font-semibold text-gray-800">{swatch.label}</p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">{swatch.hex}</p>
              </div>
            ))}
          </div>

          {/* Continuous palette bar */}
          <div className="h-3 rounded-full overflow-hidden flex mt-8 shadow-inner">
            <div className="flex-[3]" style={{ backgroundColor: primaryHex }} />
            <div className="flex-[2]" style={{ backgroundColor: secondaryHex }} />
            <div className="flex-[1]" style={{ backgroundColor: accentHex }} />
            <div className="flex-[1]" style={{ backgroundColor: highlightHex }} />
          </div>
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/* TYPOGRAPHY - Font specimens                                      */}
      {/* ================================================================ */}
      {brandCore?.fonts && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ backgroundColor: `${bgHex}` }}
        >
          <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">
              Typography
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Heading font */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-3">Heading / Display</p>
                <p
                  className="text-4xl md:text-5xl font-bold leading-tight mb-3"
                  style={{ fontFamily: headingFont, color: primaryHex }}
                >
                  Aa Bb Cc
                </p>
                <p
                  className="text-lg font-semibold mb-1"
                  style={{ fontFamily: headingFont, color: textHex }}
                >
                  {brandCore.fonts.heading}
                </p>
                {headingMeta && (
                  <p className="text-sm text-gray-400">
                    {headingMeta.category} &middot; {headingMeta.personality}
                  </p>
                )}
                <p
                  className="mt-4 text-2xl leading-snug"
                  style={{ fontFamily: headingFont, color: `${textHex}bb` }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>

              {/* Body font */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-3">Body / Running Text</p>
                <p
                  className="text-4xl md:text-5xl font-normal leading-tight mb-3"
                  style={{ fontFamily: bodyFont, color: primaryHex }}
                >
                  Aa Bb Cc
                </p>
                <p
                  className="text-lg font-semibold mb-1"
                  style={{ fontFamily: bodyFont, color: textHex }}
                >
                  {brandCore.fonts.body}
                </p>
                {bodyMeta && (
                  <p className="text-sm text-gray-400">
                    {bodyMeta.category} &middot; {bodyMeta.personality}
                  </p>
                )}
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ fontFamily: bodyFont, color: `${textHex}bb` }}
                >
                  A strong campaign brand speaks with clarity and conviction. Every typeface, color,
                  and word should reinforce the candidate&apos;s core promise to voters.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ================================================================ */}
      {/* PROFILE - Compact metadata                                       */}
      {/* ================================================================ */}
      {(state.profile.backgrounds?.length > 0 || state.profile.policyPriorities?.length > 0 || state.profile.definingStory) && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white"
        >
          <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
              Candidate Profile
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {state.profile.backgrounds?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Background</p>
                  <div className="flex flex-wrap gap-2">
                    {state.profile.backgrounds.map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1.5 text-xs font-medium rounded-full"
                        style={{ backgroundColor: `${primaryHex}0f`, color: primaryHex }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {state.profile.policyPriorities?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Policy Priorities</p>
                  <ul className="space-y-1.5">
                    {state.profile.policyPriorities.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: secondaryHex }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {state.profile.definingStory && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Defining Story</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{state.profile.definingStory}</p>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ================================================================ */}
      {/* COLLATERAL MATRIX - Priority sheet                               */}
      {/* ================================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        style={{ backgroundColor: bgHex }}
      >
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">
            Collateral Priority Matrix
          </p>

          {Object.keys(state.collateralPriorities).length === 0 ? (
            <p className="text-sm text-gray-400 italic">No priorities set</p>
          ) : (
            <div className="space-y-6">
              {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((prio) => {
                const items = collateralByPriority[prio] || [];
                if (items.length === 0) return null;
                const cfg = prioConfig[prio];
                return (
                  <div key={prio} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${cfg.border}` }}>
                    <div
                      className="flex items-center justify-between px-5 py-3"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <span className="text-sm font-bold" style={{ color: cfg.color }}>
                          {prio}
                        </span>
                        <span className="text-xs text-gray-400 hidden sm:inline">{cfg.label}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-400">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="bg-white px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        {items.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-100"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/* EXPORT - Premium CTA                                             */}
      {/* ================================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="no-print"
        style={{
          background: `linear-gradient(160deg, ${primaryHex} 0%, ${primaryHex}dd 50%, ${secondaryHex}cc 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: textOnColor(primaryHex), fontFamily: headingFont }}
            >
              Take your brand with you
            </h2>
            <p
              className="text-sm mb-10 leading-relaxed"
              style={{ color: `${textOnColor(primaryHex)}80` }}
            >
              Download a ready-to-share brand guide, or export the raw data for your design team.
            </p>

            {/* Primary CTA */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => generatePDF(state, brandCore, colors)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold shadow-xl transition-shadow hover:shadow-2xl mb-8"
              style={{
                backgroundColor: '#ffffff',
                color: primaryHex,
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download Brand Guide (PDF)
            </motion.button>

            {/* Secondary actions */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <button
                onClick={() => window.print()}
                className="text-sm font-medium underline underline-offset-2 decoration-1 transition-opacity hover:opacity-100"
                style={{ color: `${textOnColor(primaryHex)}80`, textDecorationColor: `${textOnColor(primaryHex)}40` }}
              >
                Print this page
              </button>

              <span style={{ color: `${textOnColor(primaryHex)}30` }}>&middot;</span>

              <button
                onClick={handleDownloadJSON}
                className="text-sm font-medium underline underline-offset-2 decoration-1 transition-opacity hover:opacity-100"
                style={{ color: `${textOnColor(primaryHex)}80`, textDecorationColor: `${textOnColor(primaryHex)}40` }}
              >
                Export as JSON
              </button>

              <span style={{ color: `${textOnColor(primaryHex)}30` }}>&middot;</span>

              <button
                onClick={handleReset}
                className="text-sm font-medium underline underline-offset-2 decoration-1 transition-opacity hover:opacity-100"
                style={{ color: `${textOnColor(primaryHex)}60`, textDecorationColor: `${textOnColor(primaryHex)}30` }}
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
