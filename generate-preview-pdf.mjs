// Run with: node generate-preview-pdf.mjs
import { jsPDF } from 'jspdf';
import { writeFileSync } from 'fs';

/* ─── Constants ─────────────────────────────────────────────────── */
const W   = 210;
const H   = 297;
const ML  = 18;
const MR  = 18;
const MT  = 18;
const MB  = 14;
const CW  = W - ML - MR;

function rgb(hex) {
  const h = (hex || '#000000').replace('#', '');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}
function isLight(hex) {
  const { r, g, b } = rgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 186;
}
function tc(doc, hex) { const { r, g, b } = rgb(hex); doc.setTextColor(r, g, b); }
function fc(doc, hex) { const { r, g, b } = rgb(hex); doc.setFillColor(r, g, b); }
function dc(doc, hex) { const { r, g, b } = rgb(hex); doc.setDrawColor(r, g, b); }

function drawPageChrome(doc, primary, secondary, textOnDark, accentOnDark, candidateName, pageNum) {
  fc(doc, primary); doc.rect(0, 0, W, 13, 'F');
  fc(doc, secondary); doc.rect(0, 0, W, 2.5, 'F');
  tc(doc, accentOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(6.5);
  doc.text((candidateName||'').toUpperCase(), ML, 9);
  tc(doc, textOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(6.5);
  doc.text('OPERATION 1776', W - MR, 9, { align: 'right' });
  dc(doc, '#D1D5DB'); doc.setLineWidth(0.25); doc.line(ML, H-MB, W-MR, H-MB);
  doc.setTextColor(160,160,160); doc.setFont('helvetica','normal'); doc.setFontSize(6.5);
  doc.text('Operation 1776  ·  Brand Discovery Report  ·  Confidential', ML, H-MB+4.5);
  doc.text(`${pageNum}`, W-MR, H-MB+4.5, { align: 'right' });
}

function sectionLabel(doc, text, x, y, primaryHex) {
  fc(doc, primaryHex); doc.rect(x, y-3, 2.5, 4.5, 'F');
  tc(doc, primaryHex); doc.setFont('helvetica','bold'); doc.setFontSize(7);
  doc.text(text, x+5, y);
}

function drawTag(doc, text, x, y, bgHex, textHex) {
  const textW = doc.getTextWidth(text);
  const boxW = textW + 5;
  fc(doc, bgHex); doc.roundedRect(x, y-4, boxW, 5.5, 1.5, 1.5, 'F');
  tc(doc, textHex); doc.setFont('helvetica','bold'); doc.setFontSize(7);
  doc.text(text, x+2.5, y);
  return boxW + 2.5;
}

function drawTagRow(doc, items, startX, y, bgHex, textHex, maxW) {
  doc.setFontSize(7);
  let x = startX; let curY = y;
  items.forEach(item => {
    const textW = doc.getTextWidth(item);
    const tagW = textW + 8;
    if (x + tagW > startX + maxW) { x = startX; curY += 7; }
    drawTag(doc, item, x, curY, bgHex, textHex);
    x += tagW;
  });
  return curY + 8;
}

/* ─── Sample Data ───────────────────────────────────────────────── */
const colors = {
  primary:     '#1C2E5B',
  secondary:   '#C93545',
  accent:      '#FFFFFF',
  background:  '#F5F5F5',
  text:        '#333333',
  additional:  '#4A5568',
  textOnDark:  '#FFFFFF',
  accentOnDark:'#FFFFFF',
};

const state = {
  candidate: {
    fullName:        'James R. Mitchell',
    office:          'U.S. Senate',
    state:           'Texas',
    district:        '',
    electionYear:    '2026',
    partyAffiliation:'Republican',
    candidateType:   'Challenger',
    raceFocus:       'primary',
  },
  profile: {
    backgrounds:       ['Military Veteran', 'Business Owner', 'Law Enforcement'],
    policyPriorities:  ['Border Security', 'Economy & Jobs', 'Second Amendment', 'Veterans Affairs'],
    familyStatus:      'Married with 3 children',
  },
  brandCore:    'commander',
  subDirection: 'american-defender',
  colorMode:    'theme',
  customFonts:  { heading: 'Oswald', body: 'Source Sans 3' },
  hasExistingLogo: false,
  logoType:     'emblem',
  collateralPriorities: [],
};

const brandCoreData = {
  name:         'COMMANDER',
  descriptor:   'Strength & Authority',
  emotionalFeel:'Powerful, Commanding, Unshakable',
  philosophy:   'The Commander pathway is built for candidates who lead from the front. This is not a brand about charm — it\'s about conviction, decisiveness, and the kind of authority people instinctively trust in uncertain times.',
  subPalettes:  [],
  fonts:        { heading: 'Oswald', body: 'Source Sans 3' },
  subDirections: [
    { id: 'american-defender', name: 'American Defender', desc: 'Patriotic strength. Flag integration with power rather than nostalgia.', visual: 'Oswald + Montserrat, full red-white-blue spectrum, eagle and flag imagery.', bestFor: 'Veterans, patriotic districts, rural strongholds' },
  ],
  voiceTone: {
    headlineStyle: 'Short. Punchy. Declarative. 3-6 words. Commands, not invitations.',
    headlineExamples: ['Defend What Matters.', 'No Retreat. No Compromise.', 'Strength for Texas.'],
    bodyCopy: 'Direct sentences. Active voice only. Short paragraphs.',
    ctaLanguage: ['Stand With Mitchell', 'Join the Fight', 'Enlist Now', 'Defend Texas'],
  },
};

const primary      = colors.primary;
const secondary    = colors.secondary;
const accent       = colors.accent;
const bgColor      = colors.background;
const textColor    = colors.text;
const additional   = colors.additional;
const textOnDark   = colors.textOnDark;
const accentOnDark = colors.accentOnDark;
const candidate    = state.candidate;
const profile      = state.profile;
const headingFont  = 'Oswald';
const bodyFont     = 'Source Sans 3';
const subDir       = brandCoreData.subDirections[0];

const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

/* ═══ COVER ═══════════════════════════════════════════════════════ */
fc(doc, primary); doc.rect(0, 0, W, H, 'F');
fc(doc, secondary); doc.rect(0, 0, W, 4, 'F');

tc(doc, textOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(8);
doc.text('OPERATION 1776', W - MR, MT + 6, { align: 'right' });

const { r: sr, g: sg, b: sb } = rgb(secondary);
doc.setFillColor(sr, sg, sb);
doc.setGState(new doc.GState({ opacity: 0.15 }));
doc.circle(-20, 60, 70, 'F');
doc.setGState(new doc.GState({ opacity: 1 }));
doc.setFillColor(sr, sg, sb);
doc.setGState(new doc.GState({ opacity: 0.1 }));
doc.circle(W + 10, H - 50, 55, 'F');
doc.setGState(new doc.GState({ opacity: 1 }));

tc(doc, accentOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(8);
doc.text('BRAND DISCOVERY REPORT', ML, H * 0.4);
dc(doc, secondary); doc.setLineWidth(1); doc.line(ML, H * 0.4 + 3, ML + 55, H * 0.4 + 3);

const fullName = (candidate.fullName || '').toUpperCase();
tc(doc, textOnDark); doc.setFont('helvetica','bold');
const nameFontSize = fullName.length > 22 ? 28 : fullName.length > 16 ? 34 : 40;
doc.setFontSize(nameFontSize);
const nameLines = doc.splitTextToSize(fullName, CW);
nameLines.forEach((line, i) => doc.text(line, ML, H * 0.4 + 16 + i * (nameFontSize * 0.45)));
const nameBlockEnd = H * 0.4 + 16 + nameLines.length * (nameFontSize * 0.45);

tc(doc, accentOnDark); doc.setFont('helvetica','normal'); doc.setFontSize(13);
const officeStr = [candidate.office, candidate.state, candidate.electionYear].filter(Boolean).join('  ·  ');
doc.text(officeStr, ML, nameBlockEnd + 6);

tc(doc, textOnDark); doc.setFont('helvetica','normal'); doc.setFontSize(9);
doc.setGState(new doc.GState({ opacity: 0.7 }));
doc.text(candidate.partyAffiliation, ML, nameBlockEnd + 14);
doc.setGState(new doc.GState({ opacity: 1 }));

dc(doc, secondary); doc.setLineWidth(0.5); doc.line(ML, nameBlockEnd + 20, W - MR, nameBlockEnd + 20);

tc(doc, accentOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
doc.text('BRAND ARCHETYPE', ML, nameBlockEnd + 29);
tc(doc, textOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(18);
doc.text(brandCoreData.name, ML, nameBlockEnd + 39);
tc(doc, accentOnDark); doc.setFont('helvetica','italic'); doc.setFontSize(10);
doc.text(brandCoreData.descriptor, ML, nameBlockEnd + 47);

const swatchY = H - 36;
const swatchColors = [primary, secondary, accent, bgColor, textColor, additional];
const swatchW = CW / swatchColors.length;
swatchColors.forEach((hex, i) => {
  fc(doc, hex); doc.rect(ML + i * swatchW, swatchY, swatchW - 0.5, 14, 'F');
  if (isLight(hex)) { dc(doc, '#CCCCCC'); doc.setLineWidth(0.2); doc.rect(ML + i * swatchW, swatchY, swatchW - 0.5, 14, 'S'); }
  const labelColor = isLight(hex) ? '#333333' : '#FFFFFF';
  tc(doc, labelColor); doc.setFont('helvetica','bold'); doc.setFontSize(5.5);
  doc.text(hex.toUpperCase(), ML + i * swatchW + (swatchW - 0.5) / 2, swatchY + 9, { align: 'center' });
});

tc(doc, textOnDark); doc.setFont('helvetica','normal'); doc.setFontSize(6.5);
doc.setGState(new doc.GState({ opacity: 0.55 }));
const dateStr = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
doc.text(`Prepared ${dateStr}  ·  Confidential`, ML, H - 8);
doc.setGState(new doc.GState({ opacity: 1 }));

/* ═══ PAGE 2 — CANDIDATE PROFILE ══════════════════════════════════ */
doc.addPage();
drawPageChrome(doc, primary, secondary, textOnDark, accentOnDark, candidate.fullName, 2);
let y = 22;

sectionLabel(doc, 'CANDIDATE DETAILS', ML, y, primary); y += 8;
tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(20);
doc.text(candidate.fullName, ML, y); y += 7;
doc.setTextColor(80,80,80); doc.setFont('helvetica','normal'); doc.setFontSize(10);
doc.text(candidate.office, ML, y); y += 5.5;
doc.text(`${candidate.state}  ·  ${candidate.electionYear}`, ML, y); y += 5.5;
doc.text(`${candidate.partyAffiliation}  ·  ${candidate.candidateType}  ·  Primary Race`, ML, y); y += 10;

dc(doc, '#E5E7EB'); doc.setLineWidth(0.25); doc.line(ML, y, W-MR, y); y += 8;

sectionLabel(doc, 'PROFESSIONAL BACKGROUND', ML, y, primary); y += 7;
const { r: pr, g: pg, b: pb } = rgb(primary);
const lightPrimary = `#${Math.min(255,pr+100).toString(16).padStart(2,'0')}${Math.min(255,pg+120).toString(16).padStart(2,'0')}${Math.min(255,pb+160).toString(16).padStart(2,'0')}`;
y = drawTagRow(doc, profile.backgrounds, ML, y, '#E8ECF5', primary, CW);

sectionLabel(doc, 'POLICY PRIORITIES', ML, y, primary); y += 7;
y = drawTagRow(doc, profile.policyPriorities, ML, y, '#FDEEF0', secondary, CW);

dc(doc, '#E5E7EB'); doc.setLineWidth(0.25); doc.line(ML, y, W-MR, y); y += 8;

sectionLabel(doc, 'FAMILY STATUS', ML, y, primary); y += 7;
doc.setTextColor(60,60,60); doc.setFont('helvetica','normal'); doc.setFontSize(9);
doc.text(profile.familyStatus, ML, y); y += 8;

/* ═══ PAGE 3 — BRAND DIRECTION ════════════════════════════════════ */
doc.addPage();
drawPageChrome(doc, primary, secondary, textOnDark, accentOnDark, candidate.fullName, 3);
y = 22;

fc(doc, primary); doc.rect(ML, y, CW, 38, 'F');
fc(doc, secondary); doc.rect(ML, y, CW, 2.5, 'F');
tc(doc, accentOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(7);
doc.text('BRAND ARCHETYPE', ML+6, y+10);
tc(doc, textOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(22);
doc.text(brandCoreData.name, ML+6, y+22);
tc(doc, accentOnDark); doc.setFont('helvetica','italic'); doc.setFontSize(10);
doc.text(brandCoreData.descriptor, ML+6, y+31);
y += 44;

sectionLabel(doc, 'EMOTIONAL QUALITY', ML, y, primary); y += 7;
tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(11);
doc.text(brandCoreData.emotionalFeel, ML, y); y += 8;

sectionLabel(doc, 'BRAND PHILOSOPHY', ML, y, primary); y += 7;
doc.setTextColor(60,60,60); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
const philLines = doc.splitTextToSize(brandCoreData.philosophy, CW);
doc.text(philLines, ML, y); y += philLines.length * 4.8 + 8;

dc(doc, '#E5E7EB'); doc.setLineWidth(0.25); doc.line(ML, y, W-MR, y); y += 8;

sectionLabel(doc, 'SUB-DIRECTION', ML, y, secondary); y += 8;
tc(doc, secondary); doc.setFont('helvetica','bold'); doc.setFontSize(16);
doc.text(subDir.name, ML, y); y += 7;
doc.setTextColor(60,60,60); doc.setFont('helvetica','italic'); doc.setFontSize(9);
const descLines = doc.splitTextToSize(subDir.desc, CW);
doc.text(descLines, ML, y); y += descLines.length * 4.8 + 4;
doc.setTextColor(100,100,100); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
const visualLines = doc.splitTextToSize(`Visual direction: ${subDir.visual}`, CW);
doc.text(visualLines, ML, y); y += visualLines.length * 4.8 + 4;
doc.text(`Best for: ${subDir.bestFor}`, ML, y); y += 10;

dc(doc, '#E5E7EB'); doc.setLineWidth(0.25); doc.line(ML, y, W-MR, y); y += 8;

sectionLabel(doc, 'VOICE & TONE', ML, y, primary); y += 8;
const vt = brandCoreData.voiceTone;
tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(8);
doc.text('Headline style:', ML, y); y += 5;
doc.setTextColor(60,60,60); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
doc.text(vt.headlineStyle, ML, y); y += 7;

tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(8);
doc.text('Example headlines:', ML, y); y += 5;
vt.headlineExamples.forEach(ex => {
  fc(doc, secondary); doc.circle(ML+1, y-1, 0.8, 'F');
  doc.setTextColor(60,60,60); doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.text(`"${ex}"`, ML+4, y); y += 5.5;
});
y += 2;

tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(8);
doc.text('Call-to-action language:', ML, y); y += 6;
drawTagRow(doc, vt.ctaLanguage, ML, y, secondary, '#FFFFFF', CW);

/* ═══ PAGE 4 — COLOR PALETTE ══════════════════════════════════════ */
doc.addPage();
drawPageChrome(doc, primary, secondary, textOnDark, accentOnDark, candidate.fullName, 4);
y = 22;

sectionLabel(doc, 'BRAND COLOR PALETTE', ML, y, primary); y += 10;

const swatchDefs = [
  { label: 'Primary',             hex: primary,     role: 'Headers, hero backgrounds, key brand elements' },
  { label: 'Secondary',           hex: secondary,   role: 'Buttons, highlights, calls to action' },
  { label: 'Tertiary',            hex: accent,      role: 'Third supporting brand color' },
  { label: 'Additional Colour 1', hex: bgColor,     role: 'Page backgrounds, section fills' },
  { label: 'Additional Colour 2', hex: textColor,   role: 'Body text, headings on light backgrounds' },
  { label: 'Additional Colour 3', hex: additional,  role: 'Extra brand accent or tint' },
];

swatchDefs.forEach(swatch => {
  const { r: cr, g: cg, b: cb } = rgb(swatch.hex);
  const light = isLight(swatch.hex);
  doc.setFillColor(cr, cg, cb); doc.rect(ML, y, CW, 24, 'F');
  if (light) { dc(doc, '#D1D5DB'); doc.setLineWidth(0.25); doc.rect(ML, y, CW, 24, 'S'); }
  tc(doc, light ? '#1F2937' : '#FFFFFF'); doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.text(swatch.label.toUpperCase(), ML+5, y+8);
  doc.setTextColor(...(light ? [107,114,128] : [220,220,220]));
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
  doc.text(swatch.role, ML+5, y+15);
  tc(doc, light ? '#1F2937' : '#FFFFFF'); doc.setFont('helvetica','bold'); doc.setFontSize(10);
  doc.text(swatch.hex.toUpperCase(), W-MR-5, y+9, { align: 'right' });
  doc.setTextColor(...(light ? [107,114,128] : [200,200,200]));
  doc.setFont('helvetica','normal'); doc.setFontSize(7);
  doc.text(`RGB (${cr}, ${cg}, ${cb})`, W-MR-5, y+16, { align: 'right' });
  y += 27;
});

/* ═══ PAGE 5 — TYPOGRAPHY & LOGO ══════════════════════════════════ */
doc.addPage();
drawPageChrome(doc, primary, secondary, textOnDark, accentOnDark, candidate.fullName, 5);
y = 22;

sectionLabel(doc, 'TYPOGRAPHY', ML, y, primary); y += 10;

const cardH = 42; const cardW = (CW - 5) / 2;

fc(doc, primary); doc.rect(ML, y, cardW, cardH, 'F');
fc(doc, secondary); doc.rect(ML, y, cardW, 2.5, 'F');
tc(doc, accentOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(6.5);
doc.text('HEADING FONT', ML+4, y+9);
tc(doc, textOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(16);
doc.text(headingFont, ML+4, y+21);
tc(doc, accentOnDark); doc.setFont('helvetica','normal'); doc.setFontSize(9);
doc.text('Aa  Bb  Cc  123', ML+4, y+31);
doc.setFont('helvetica','italic'); doc.setFontSize(7.5);
doc.setGState(new doc.GState({ opacity: 0.6 }));
doc.text('Display & Headlines', ML+4, y+39);
doc.setGState(new doc.GState({ opacity: 1 }));

const bx = ML + cardW + 5;
doc.setFillColor(245,245,248); doc.rect(bx, y, cardW, cardH, 'F');
dc(doc, '#E5E7EB'); doc.setLineWidth(0.25); doc.rect(bx, y, cardW, cardH, 'S');
doc.setTextColor(120,120,120); doc.setFont('helvetica','bold'); doc.setFontSize(6.5);
doc.text('BODY FONT', bx+4, y+9);
doc.setTextColor(40,40,40); doc.setFont('helvetica','bold'); doc.setFontSize(16);
doc.text(bodyFont, bx+4, y+21);
doc.setTextColor(100,100,100); doc.setFont('helvetica','normal'); doc.setFontSize(9);
doc.text('Aa  Bb  Cc  123', bx+4, y+31);
doc.setFont('helvetica','italic'); doc.setFontSize(7.5);
doc.setGState(new doc.GState({ opacity: 0.6 }));
doc.text('Paragraphs & UI text', bx+4, y+39);
doc.setGState(new doc.GState({ opacity: 1 }));
y += cardH + 10;

sectionLabel(doc, 'TYPE HIERARCHY SAMPLE', ML, y, primary); y += 9;
tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(22);
doc.text(candidate.fullName, ML, y); y += 8;
doc.setTextColor(80,80,80); doc.setFont('helvetica','normal'); doc.setFontSize(13);
doc.text(`For ${candidate.office}`, ML, y); y += 7;
doc.setTextColor(130,130,130); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
const sampleLines = doc.splitTextToSize(`Experienced leadership. Proven results. Ready to serve the people of ${candidate.state} with integrity, purpose, and unwavering commitment.`, CW);
doc.text(sampleLines, ML, y); y += sampleLines.length * 4.8 + 10;

dc(doc, '#E5E7EB'); doc.setLineWidth(0.25); doc.line(ML, y, W-MR, y); y += 10;

sectionLabel(doc, 'LOGO DIRECTION', ML, y, primary); y += 8;
doc.setTextColor(80,80,80); doc.setFont('helvetica','normal'); doc.setFontSize(9);
doc.text('New logo to be designed by Operation 1776', ML, y); y += 7;
tc(doc, primary); doc.setFont('helvetica','bold'); doc.setFontSize(14);
doc.text('Emblem', ML, y); y += 6;
doc.setTextColor(100,100,100); doc.setFont('helvetica','italic'); doc.setFontSize(8.5);
const logoDescLines = doc.splitTextToSize('Classic seal or badge design — circular, authoritative, and timeless. Ideal for official-feeling campaigns.', CW);
doc.text(logoDescLines, ML, y); y += logoDescLines.length * 4.8 + 10;

y = Math.max(y, H - 80);
fc(doc, primary); doc.rect(ML, y, CW, 40, 'F');
fc(doc, secondary); doc.rect(ML, y, 3, 40, 'F');
tc(doc, accentOnDark); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
doc.text('NEXT STEPS', ML+7, y+8);
tc(doc, textOnDark); doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
['01  Logo delivery — 2 working days', '02  Brand kit & guidelines — 3 working days', '03  Website content drafting — In progress'].forEach((step, i) => {
  doc.text(step, ML+7, y+17+i*7);
});

/* ─── Save ──────────────────────────────────────────────────────── */
const output = doc.output('arraybuffer');
writeFileSync('/Users/huzaifahusmani/Downloads/operation1776-brand-preview.pdf', Buffer.from(output));
console.log('✅  PDF saved to ~/Downloads/operation1776-brand-preview.pdf');
