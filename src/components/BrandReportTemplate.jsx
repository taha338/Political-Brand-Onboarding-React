/**
 * BrandReportTemplate
 * --------------------
 * A static, animation-free, capture-friendly visual identity report.
 * Used as the source for the PDF export so html2canvas produces a
 * faithful render. Mirrors the visual identity sections shown in
 * Stage 7 (Hero, Typography, Color Palette, Voice & Tone, Campaign
 * Mockups) using only inline styles and hex/rgb colors.
 *
 * No framer-motion, no gradient text, no decorative SVG patterns,
 * no IntersectionObserver-based reveals — by design.
 */

import { useEffect } from 'react';
import { useBrand } from '../context/BrandContext';
import {
  BRAND_CORES,
  POLICY_PRIORITIES,
  PROFESSIONAL_BACKGROUNDS,
  PARTY_PLATFORM_PILLARS,
  PARTY_TARGET_SEGMENTS,
} from '../data/brandData';
import { getResolvedVoiceTone } from '../utils/voiceTone';

/* Load Google Fonts for the heading/body typefaces. */
function useGoogleFonts(families) {
  useEffect(() => {
    const linkIds = [];
    families.filter(Boolean).forEach((family) => {
      const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800;900&display=swap`;
      const id = `pdf-font-${family.replace(/\s+/g, '-')}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.id = id;
        document.head.appendChild(link);
        linkIds.push(id);
      }
    });
    return () => {
      // Don't remove — leave them cached for any subsequent capture.
    };
  }, [families.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
}

/* Section header label (small caps). */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#6B7280',
      margin: '0 0 20px',
    }}>{children}</p>
  );
}

export default function BrandReportTemplate() {
  const { state, getActiveColors } = useBrand();
  const coreData = state.brandCore ? BRAND_CORES[state.brandCore] : null;
  const colors = getActiveColors();

  const headingFont = state.customFonts?.heading || coreData?.fonts?.heading || 'Oswald';
  const bodyFont = state.customFonts?.body || coreData?.fonts?.body || 'Source Sans 3';

  useGoogleFonts([headingFont, bodyFont]);

  if (!coreData) return <div style={{ padding: 40 }}>Brand Core not selected.</div>;

  const isParty = state.subjectType === 'party';
  const candidateName = isParty
    ? (state.party?.name || state.party?.acronym || 'Party')
    : (state.candidate?.fullName || 'Candidate');
  const voiceTone = getResolvedVoiceTone(coreData, state) || coreData.voiceTone || {};

  const PAGE_BG = '#FFFFFF';
  const TEXT_DARK = '#1F2937';
  const MUTED = '#6B7280';
  const BORDER = '#E5E7EB';

  const primary = colors.primary || coreData.colors.primary || '#1C2E5B';
  const secondary = colors.secondary || coreData.colors.secondary || '#B22234';
  const accent = colors.accent || coreData.colors.accent || '#F5ECD8';
  const background = colors.background || coreData.colors.background || '#FAF8F5';
  const textColor = colors.text || coreData.colors.text || '#2E2E30';
  const additional = colors.additional || coreData.colors.additional || '#4A607A';
  const onDarkText = colors.textOnDark || '#FFFFFF';

  const swatches = [
    { label: 'Primary', hex: primary },
    { label: 'Secondary', hex: secondary },
    { label: 'Tertiary', hex: accent },
    { label: 'Additional Colour 1', hex: background },
    { label: 'Additional Colour 2', hex: textColor },
    { label: 'Additional Colour 3', hex: additional },
  ];

  const isLight = (hex) => {
    const h = (hex || '#000000').replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 186;
  };

  return (
    <div style={{
      width: 1100,
      background: PAGE_BG,
      fontFamily: bodyFont + ', system-ui, -apple-system, Segoe UI, sans-serif',
      color: TEXT_DARK,
      padding: '60px 60px 80px',
      boxSizing: 'border-box',
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          marginBottom: 14,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '50%',
            background: '#1C2E5B', color: '#FFFFFF', fontSize: 13, fontWeight: 700,
          }}>7</span>
          <div style={{ width: 200, height: 1, background: BORDER }} />
        </div>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: 44, fontWeight: 800, color: '#1C2E5B',
          margin: 0, letterSpacing: '-0.02em',
        }}>Your Visual Identity</h1>
        <p style={{ fontSize: 16, color: MUTED, margin: '10px 0 0' }}>
          Here is your complete brand system — fonts, colors, voice, and mockups.
        </p>
        {candidateName && (
          <p style={{ fontSize: 14, color: TEXT_DARK, margin: '10px 0 0', fontWeight: 600 }}>
            {candidateName}
            {isParty
              ? (() => {
                  const p = state.party || {};
                  const parts = [];
                  if (p.partyType) parts.push(p.partyType.replace(/-/g, ' '));
                  if (p.scope) parts.push(p.scope.replace(/-/g, ' '));
                  if (p.scope === 'multi-state' && Array.isArray(p.states) && p.states.length > 0) {
                    parts.push(p.states.join(', '));
                  } else if (p.scope === 'local') {
                    if (p.cityCounty) parts.push(p.cityCounty);
                    if (p.state) parts.push(p.state);
                  } else if (p.state) {
                    parts.push(p.state);
                  }
                  return parts.length > 0 ? ' · ' + parts.join(' · ') : '';
                })()
              : <>
                  {state.candidate?.office ? ` · ${state.candidate.office}` : ''}
                  {state.candidate?.state ? ` · ${state.candidate.state}` : ''}
                </>
            }
          </p>
        )}
      </div>

      {/* HERO BRAND CARD */}
      <div style={{
        background: primary,
        color: onDarkText,
        borderRadius: 24,
        padding: '60px 56px',
        marginBottom: 56,
        position: 'relative',
        borderTop: `4px solid ${secondary}`,
        borderBottom: `4px solid ${secondary}`,
      }}>
        <p style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: onDarkText, opacity: 0.85,
          margin: '0 0 28px',
        }}>{coreData.descriptor}</p>

        <h2 style={{
          fontFamily: headingFont + ', serif',
          fontSize: 96, fontWeight: 900, lineHeight: 1,
          color: onDarkText, margin: 0, letterSpacing: '-0.01em',
          textTransform: 'uppercase',
        }}>{coreData.name}</h2>

        <div style={{ width: 120, height: 3, background: secondary, margin: '28px 0' }} />

        <p style={{
          fontFamily: headingFont + ', serif',
          fontSize: 28, fontWeight: 500, color: onDarkText,
          margin: '0 0 24px', lineHeight: 1.3,
        }}>{coreData.tagline}</p>

        <p style={{
          fontSize: 15, color: onDarkText, opacity: 0.85,
          margin: 0, lineHeight: 1.7, maxWidth: 720,
        }}>{coreData.positioning}</p>
      </div>

      {/* TYPOGRAPHY */}
      <div style={{ marginBottom: 56 }}>
        <SectionLabel>Typography System</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Heading sample */}
          <div style={{
            background: '#0F172A', borderRadius: 20, padding: 36, color: '#FFFFFF',
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
              margin: '0 0 18px', fontFamily: 'monospace',
            }}>HEADING — {headingFont} / {coreData.fonts?.heading?.toLowerCase().includes('serif') ? 'SERIF' : 'SANS-SERIF'}</p>
            <p style={{
              fontFamily: headingFont + ', serif',
              fontSize: 60, fontWeight: 800, lineHeight: 1, margin: 0,
              textTransform: 'uppercase', letterSpacing: '-0.01em',
            }}>{(candidateName || 'Aa').slice(0, 12)}</p>
            <p style={{
              fontFamily: headingFont + ', serif',
              fontSize: 26, fontWeight: 600, margin: '12px 0 22px', lineHeight: 1.2,
            }}>{voiceTone.headlineExamples?.[0] || 'Defend What Matters.'}</p>
            <p style={{ fontSize: 13, fontFamily: headingFont + ', serif', margin: '0 0 4px', letterSpacing: '0.04em' }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </p>
            <p style={{ fontSize: 12, fontFamily: headingFont + ', serif', margin: '0 0 18px', opacity: 0.8 }}>
              abcdefghijklmnopqrstuvwxyz 0123456789
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[400, 600, 700].map((w) => (
                <span key={w} style={{
                  display: 'inline-block', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 4, fontSize: 11, color: '#FFFFFF', fontFamily: 'monospace',
                }}>{w}</span>
              ))}
            </div>
          </div>

          {/* Body sample */}
          <div style={{
            background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 36,
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: MUTED, margin: '0 0 18px', fontFamily: 'monospace',
            }}>BODY — {bodyFont} / SANS-SERIF</p>
            <p style={{
              fontFamily: bodyFont + ', system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, color: TEXT_DARK, lineHeight: 1.1, margin: '0 0 18px',
            }}>{(candidateName || 'Sample').slice(0, 14)}</p>
            <p style={{
              fontFamily: bodyFont + ', system-ui, sans-serif',
              fontSize: 16, color: TEXT_DARK, margin: '0 0 22px', lineHeight: 1.6,
            }}>{voiceTone.bodyCopy || 'Direct, intentional, on-message body copy that supports the brand voice.'}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[400, 600].map((w) => (
                <span key={w} style={{
                  display: 'inline-block', padding: '4px 10px', border: `1px solid ${BORDER}`,
                  borderRadius: 4, fontSize: 11, color: MUTED, fontFamily: 'monospace',
                }}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLOR PALETTE */}
      <div style={{ marginBottom: 56 }}>
        <SectionLabel>Color Palette</SectionLabel>

        {/* Stripe preview */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 14, marginBottom: 24 }}>
          {swatches.map((s) => (
            <div key={s.label} style={{ flex: 1, background: s.hex }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {swatches.map((s) => {
            const light = isLight(s.hex);
            return (
              <div key={s.label} style={{
                background: s.hex,
                border: light ? `1px solid ${BORDER}` : 'none',
                borderRadius: 12,
                padding: '22px 24px',
                color: light ? TEXT_DARK : '#FFFFFF',
                minHeight: 120,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', margin: 0, opacity: 0.85,
                }}>{s.label}</p>
                <p style={{
                  fontSize: 22, fontWeight: 700, fontFamily: 'monospace',
                  margin: '20px 0 0',
                }}>{s.hex.toUpperCase()}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PLATFORM & AUDIENCE — pulls Stage 2 selections */}
      {(() => {
        const p = state.profile || {};
        const sub = state.subDirection;
        const subIds = Array.isArray(sub) ? sub : (sub ? [sub] : []);
        const subNames = subIds
          .map((id) => coreData.subDirections?.find((s) => s.id === id)?.name)
          .filter(Boolean);

        if (isParty) {
          const pillarLabels = (p.platformPillars || [])
            .map((id) => PARTY_PLATFORM_PILLARS.find((x) => x.id === id)?.label || id);
          const segmentLabels = (p.targetSegments || [])
            .map((id) => PARTY_TARGET_SEGMENTS.find((x) => x.id === id)?.label || id);
          const showSection = pillarLabels.length || segmentLabels.length || p.coalitions || subNames.length;
          if (!showSection) return null;
          return (
            <div style={{ marginBottom: 56 }}>
              <SectionLabel>Platform &amp; Audience</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                {pillarLabels.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Platform Pillars</p>
                    <ol style={{ margin: 0, paddingLeft: 18, color: TEXT_DARK, fontSize: 14, lineHeight: 1.7 }}>
                      {pillarLabels.map((l) => (<li key={l}>{l}</li>))}
                    </ol>
                  </div>
                )}
                {segmentLabels.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Target Segments</p>
                    <ul style={{ margin: 0, paddingLeft: 18, color: TEXT_DARK, fontSize: 14, lineHeight: 1.7 }}>
                      {segmentLabels.map((l) => (<li key={l}>{l}</li>))}
                    </ul>
                  </div>
                )}
                {subNames.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Sub-Directions</p>
                    <ul style={{ margin: 0, paddingLeft: 18, color: TEXT_DARK, fontSize: 14, lineHeight: 1.7 }}>
                      {subNames.map((n) => (<li key={n}>{n}</li>))}
                    </ul>
                  </div>
                )}
                {p.coalitions && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Coalitions &amp; Partners</p>
                    <p style={{ margin: 0, fontSize: 14, color: TEXT_DARK, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{p.coalitions}</p>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Candidate mode
        const bgLabels = (p.backgrounds || [])
          .map((id) => PROFESSIONAL_BACKGROUNDS.find((x) => x.id === id)?.label || id);
        const priorityLabels = (p.policyPriorities || [])
          .map((id) => id === 'other-policy'
            ? (p.policyOther?.trim() || 'Other')
            : (POLICY_PRIORITIES.find((x) => x.id === id)?.label || id));
        const showSection = bgLabels.length || priorityLabels.length || subNames.length;
        if (!showSection) return null;
        return (
          <div style={{ marginBottom: 56 }}>
            <SectionLabel>Platform &amp; Background</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {priorityLabels.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Policy Priorities (Ranked)</p>
                  <ol style={{ margin: 0, paddingLeft: 18, color: TEXT_DARK, fontSize: 14, lineHeight: 1.7 }}>
                    {priorityLabels.map((l, i) => (
                      <li key={l + i} style={i === 0 ? { fontWeight: 700, color: primary } : undefined}>
                        {l}{i === 0 ? ' — Top Priority' : ''}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {bgLabels.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Professional Background</p>
                  <ul style={{ margin: 0, paddingLeft: 18, color: TEXT_DARK, fontSize: 14, lineHeight: 1.7 }}>
                    {bgLabels.map((l) => (<li key={l}>{l}</li>))}
                  </ul>
                </div>
              )}
              {subNames.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 10px' }}>Sub-Direction</p>
                  <p style={{ margin: 0, fontSize: 14, color: TEXT_DARK, lineHeight: 1.6 }}>{subNames.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* VOICE & TONE */}
      <div style={{ marginBottom: 56 }}>
        <SectionLabel>Voice &amp; Tone</SectionLabel>
        {voiceTone.headlineStyle && (
          <div style={{
            borderLeft: `3px solid ${secondary}`, paddingLeft: 16, marginBottom: 28,
          }}>
            <p style={{ fontSize: 14, fontStyle: 'italic', color: TEXT_DARK, margin: 0 }}>
              {voiceTone.headlineStyle}
            </p>
          </div>
        )}

        {/* Headline examples */}
        {voiceTone.headlineExamples?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {voiceTone.headlineExamples.slice(0, 3).map((ex, i) => {
              const bg = [primary, secondary, '#1F2937'][i % 3];
              return (
                <div key={i} style={{
                  background: bg, color: '#FFFFFF', borderRadius: 16,
                  padding: '40px 28px', minHeight: 140,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p style={{
                    fontFamily: headingFont + ', serif',
                    fontSize: 26, fontWeight: 700, lineHeight: 1.15,
                    margin: 0, textAlign: 'center',
                  }}>{ex}</p>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {/* Body copy style */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: MUTED, margin: '0 0 10px',
            }}>Body Copy Style</p>
            <p style={{ fontSize: 14, color: TEXT_DARK, margin: 0, lineHeight: 1.6 }}>
              {voiceTone.bodyCopy}
            </p>
          </div>

          {/* CTA */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: MUTED, margin: '0 0 10px',
            }}>Call-To-Action</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(voiceTone.ctaLanguage || []).slice(0, 4).map((cta, i) => {
                const styles = [
                  { bg: primary, color: '#FFFFFF', border: primary },
                  { bg: secondary, color: '#FFFFFF', border: secondary },
                  { bg: '#FFFFFF', color: primary, border: primary },
                  { bg: 'transparent', color: primary, border: primary },
                ][i];
                return (
                  <span key={cta} style={{
                    display: 'inline-block', padding: '8px 14px',
                    background: styles.bg, color: styles.color,
                    border: `1.5px solid ${styles.border}`,
                    borderRadius: 6, fontSize: 13, fontWeight: 600, textAlign: 'center',
                  }}>{cta}</span>
                );
              })}
            </div>
          </div>

          {/* Vocab */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: MUTED, margin: '0 0 10px',
            }}>Key Vocabulary</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
              {(voiceTone.vocabulary || []).slice(0, 12).map((word, i) => {
                const sizes = [16, 14, 18, 13, 15, 14, 16, 13, 15, 14, 13, 14];
                const weights = [700, 500, 800, 500, 600, 500, 700, 400, 600, 500, 400, 500];
                const cols = [primary, MUTED, secondary, MUTED, primary, MUTED, secondary, MUTED, primary, MUTED, MUTED, MUTED];
                return (
                  <span key={word} style={{
                    fontSize: sizes[i % sizes.length],
                    fontWeight: weights[i % weights.length],
                    color: cols[i % cols.length],
                    fontFamily: bodyFont + ', system-ui, sans-serif',
                  }}>{word}</span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CAMPAIGN MOCKUPS */}
      <div>
        <SectionLabel>Campaign Materials Preview</SectionLabel>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Yard sign */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px' }}>Yard Sign</p>
            <div style={{
              background: primary, color: '#FFFFFF', borderRadius: 12, padding: '40px 24px',
              borderTop: `6px solid ${secondary}`, borderBottom: `6px solid ${secondary}`,
              textAlign: 'center', minHeight: 220,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <p style={{ fontSize: 11, letterSpacing: '0.3em', margin: '0 0 12px', opacity: 0.85 }}>ELECT</p>
              <p style={{
                fontFamily: headingFont + ', serif', fontSize: 44, fontWeight: 900,
                textTransform: 'uppercase', margin: 0, lineHeight: 1,
              }}>{(candidateName || 'Candidate').toUpperCase().slice(0, 14)}</p>
              <div style={{ width: 50, height: 3, background: secondary, margin: '14px auto 0' }} />
            </div>
          </div>

          {/* Bumper sticker + website banner stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px' }}>Bumper Sticker</p>
              <div style={{
                background: '#FFFFFF', border: `2px solid ${secondary}`, borderRadius: 8,
                padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{
                  fontFamily: headingFont + ', serif', fontSize: 24, fontWeight: 900,
                  color: primary, textTransform: 'uppercase', letterSpacing: '-0.01em',
                  background: secondary, color: '#FFFFFF', padding: '4px 10px',
                }}>{(candidateName || 'NAME').toUpperCase().slice(0, 10)}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_DARK, letterSpacing: '0.06em' }}>
                  {(voiceTone.headlineExamples?.[1] || 'No Retreat. No Compromise.').toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px' }}>Website Banner</p>
              <div style={{
                background: primary, borderRadius: 8, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div>
                  <p style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, margin: 0, fontFamily: headingFont + ', serif' }}>
                    {voiceTone.headlineExamples?.[0] || 'Defend What Matters.'}
                  </p>
                  <p style={{ color: '#FFFFFF', fontSize: 11, margin: '4px 0 0', opacity: 0.7 }}>
                    {candidateName} for Office — Paid for by Friends of {candidateName}
                  </p>
                </div>
                <span style={{
                  background: '#FFFFFF', color: primary, padding: '8px 14px',
                  borderRadius: 6, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}>{voiceTone.ctaLanguage?.[0] || 'Stand With Us'}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {/* Social media post */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px' }}>Social Media Post</p>
            <div style={{
              background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: 22, minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, margin: '0 0 12px', textAlign: 'center' }}>
                  {(candidateName || 'Candidate').toUpperCase()} FOR OFFICE
                </p>
                <p style={{
                  fontFamily: headingFont + ', serif',
                  fontSize: 22, fontWeight: 700, color: primary, margin: '0 0 12px',
                  textAlign: 'center', lineHeight: 1.2,
                }}>{voiceTone.headlineExamples?.[0] || 'Defend What Matters.'}</p>
                <p style={{ fontSize: 12, color: MUTED, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                  It is time to bring real leadership back to our community.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: secondary }}>{candidateName}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#FFFFFF',
                  background: secondary, padding: '5px 12px', borderRadius: 12,
                }}>Learn More</span>
              </div>
            </div>
          </div>

          {/* Social story */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px' }}>Social Story</p>
            <div style={{
              background: primary, borderRadius: 12, padding: 22, minHeight: 240,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#FFFFFF',
            }}>
              <p style={{
                fontFamily: headingFont + ', serif',
                fontSize: 28, fontWeight: 800, lineHeight: 1.1, margin: 0, color: '#FFFFFF',
              }}>{voiceTone.headlineExamples?.[1] || 'No Retreat. No Compromise.'}</p>
              <div>
                <div style={{
                  background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 10px',
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', background: secondary, color: '#FFFFFF',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                  }}>{(candidateName || 'C')[0]?.toUpperCase()}</span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, margin: 0 }}>{candidateName}</p>
                    <p style={{ fontSize: 9, opacity: 0.7, margin: 0 }}>Official Campaign</p>
                  </div>
                </div>
                <span style={{
                  display: 'block', textAlign: 'center', background: secondary, color: '#FFFFFF',
                  padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                }}>{voiceTone.ctaLanguage?.[0] || 'Stand With Us'}</span>
              </div>
            </div>
          </div>

          {/* Accent samples */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED, margin: '0 0 8px' }}>Accent Samples</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: secondary, color: '#FFFFFF', padding: 16, borderRadius: 10 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px', opacity: 0.85 }}>Fundraising</p>
                <p style={{ fontFamily: headingFont + ', serif', fontSize: 16, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2 }}>
                  Your $50 puts {candidateName} on 1,000 doors.
                </p>
                <span style={{
                  display: 'inline-block', background: '#FFFFFF', color: secondary,
                  padding: '5px 12px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                }}>Donate Now</span>
              </div>
              <div style={{ background: '#FFFFFF', border: `1px solid ${BORDER}`, padding: 14, borderRadius: 10 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px', color: MUTED }}>Event</p>
                <p style={{ fontFamily: headingFont + ', serif', fontSize: 14, fontWeight: 700, color: primary, margin: '0 0 4px', lineHeight: 1.2 }}>
                  Town Hall with {candidateName}
                </p>
                <p style={{ fontSize: 11, color: MUTED, margin: '0 0 8px' }}>
                  Hear the plan. Ask questions. Get involved.
                </p>
                <span style={{
                  display: 'inline-block', background: primary, color: '#FFFFFF',
                  padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                }}>RSVP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
