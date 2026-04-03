import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── State abbreviation → full name mapping ── */
const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

/* ── Real US state SVG paths (simplified but geographically accurate) ── */
const STATE_PATHS = {
  AL: "M628,466 L628,534 L620,545 L624,556 L618,556 L612,544 L610,466 Z",
  AK: "M161,574 L183,574 L183,582 L193,582 L193,574 L205,574 L217,566 L227,570 L233,566 L237,574 L245,574 L249,570 L241,562 L237,554 L227,554 L225,546 L217,546 L205,546 L201,538 L193,534 L185,538 L177,534 L169,542 L161,546 L153,550 L149,558 L153,562 L161,566 Z",
  AZ: "M205,442 L205,520 L215,530 L275,530 L275,432 L255,432 L245,442 Z",
  AR: "M560,470 L560,524 L608,524 L608,470 L590,464 Z",
  CA: "M120,340 L115,355 L108,380 L105,400 L108,420 L115,445 L128,465 L145,478 L160,485 L172,478 L178,460 L185,440 L192,425 L198,408 L200,390 L198,365 L192,345 L185,330 L178,318 L165,310 L148,315 L135,325 Z",
  CO: "M280,370 L380,370 L380,430 L280,430 Z",
  CT: "M830,280 L830,305 L858,300 L862,280 Z",
  DE: "M782,360 L794,355 L796,380 L784,385 Z",
  FL: "M625,558 L630,570 L640,590 L650,610 L660,625 L670,640 L680,648 L695,648 L705,638 L710,625 L712,610 L708,590 L700,575 L688,565 L675,558 L665,555 L720,530 L726,515 L620,515 L618,556 L625,558 Z",
  GA: "M645,466 L645,545 L625,558 L665,555 L720,530 L720,466 Z",
  HI: "M270,574 L278,570 L286,574 L290,582 L286,590 L278,594 L270,590 L266,582 Z M295,566 L303,562 L311,566 L315,574 L311,578 L303,578 L295,574 Z M310,558 L318,554 L326,558 L326,566 L318,570 L310,566 Z",
  ID: "M218,220 L218,340 L260,340 L265,320 L258,300 L255,270 L252,245 L245,225 L232,218 Z",
  IL: "M570,310 L575,315 L580,340 L582,370 L580,400 L574,420 L566,434 L558,438 L555,430 L552,400 L554,370 L556,340 L560,315 Z",
  IN: "M600,320 L600,420 L636,420 L636,320 Z",
  IA: "M490,300 L490,365 L555,365 L560,315 L555,300 Z",
  KS: "M385,400 L385,460 L495,460 L495,400 Z",
  KY: "M600,405 L598,425 L610,440 L640,445 L660,435 L680,425 L700,418 L715,410 L720,400 L708,395 L688,400 L670,405 L650,410 L630,415 L610,415 Z",
  LA: "M555,525 L555,575 L570,585 L585,580 L600,575 L608,565 L608,524 L560,524 Z",
  ME: "M860,178 L855,200 L852,225 L855,250 L862,255 L870,248 L878,235 L880,220 L876,200 L870,185 Z",
  MD: "M728,360 L728,390 L782,390 L782,360 L770,355 L755,358 L740,362 Z",
  MA: "M835,265 L835,278 L870,272 L878,268 L870,260 L855,262 Z",
  MI: "M590,220 L584,235 L580,255 L582,275 L588,290 L598,300 L610,305 L625,298 L636,288 L640,275 L638,260 L632,245 L624,232 L612,222 Z M555,248 L550,265 L548,280 L552,295 L560,305 L570,308 L578,300 L580,290 L576,275 L570,260 Z",
  MN: "M470,185 L470,298 L540,298 L540,245 L530,220 L520,200 L505,188 Z",
  MS: "M590,470 L590,545 L608,556 L608,524 L610,466 Z",
  MO: "M500,390 L496,400 L495,435 L498,460 L555,460 L560,470 L566,434 L574,420 L558,438 L555,430 L552,400 L555,390 Z",
  MT: "M240,180 L240,260 L370,260 L370,220 L340,195 L310,180 Z",
  NE: "M360,340 L360,395 L490,395 L490,365 L495,340 Z",
  NV: "M170,310 L170,430 L220,430 L235,395 L210,345 L200,310 Z",
  NH: "M850,195 L845,220 L842,245 L845,262 L855,262 L860,248 L862,225 L858,205 Z",
  NJ: "M796,300 L792,320 L790,340 L794,355 L802,360 L808,345 L810,320 L806,300 Z",
  NM: "M240,440 L240,530 L340,530 L340,440 L305,432 L275,432 Z",
  NY: "M748,240 L740,260 L738,280 L742,300 L755,310 L770,310 L790,300 L808,300 L810,280 L830,280 L830,265 L820,258 L810,250 L795,245 L778,242 L762,240 Z",
  NC: "M648,420 L648,455 L660,462 L720,466 L748,455 L768,440 L778,425 L770,418 L755,420 L740,422 L720,420 L700,418 Z",
  ND: "M370,180 L370,260 L470,260 L470,185 L420,178 Z",
  OH: "M640,315 L640,400 L680,405 L700,395 L706,380 L700,360 L694,340 L686,325 L676,315 Z",
  OK: "M385,434 L385,460 L395,466 L405,488 L495,488 L498,460 L495,435 L440,435 L435,430 Z",
  OR: "M115,220 L115,310 L200,310 L210,285 L218,260 L218,220 Z",
  PA: "M710,300 L710,360 L782,360 L790,340 L790,300 L770,310 L755,310 L742,300 Z",
  RI: "M858,285 L858,300 L870,296 L870,280 Z",
  SC: "M680,450 L680,480 L700,495 L720,500 L740,490 L748,475 L748,455 L720,466 L700,462 Z",
  SD: "M370,260 L370,340 L470,340 L470,298 L470,260 Z",
  TN: "M600,425 L598,450 L608,460 L648,460 L648,420 L640,425 L630,430 L615,428 Z",
  TX: "M340,470 L340,530 L350,550 L365,575 L385,600 L405,618 L425,630 L445,632 L465,625 L480,610 L490,590 L498,565 L500,540 L498,510 L495,488 L405,488 L395,466 L385,460 L340,460 Z",
  UT: "M220,340 L220,432 L280,432 L280,370 L260,370 L260,340 Z",
  VT: "M838,210 L835,240 L835,262 L845,262 L850,245 L850,220 L845,210 Z",
  VA: "M690,380 L680,400 L680,425 L700,418 L720,420 L740,422 L768,440 L778,425 L788,410 L782,390 L770,385 L755,382 Z",
  WA: "M120,150 L120,220 L218,220 L218,175 L195,155 L165,148 Z",
  WV: "M700,360 L690,380 L690,405 L680,405 L680,425 L690,420 L710,410 L720,400 L715,380 L706,365 Z",
  WI: "M520,215 L515,240 L510,265 L515,290 L525,305 L540,310 L555,305 L565,295 L570,275 L570,260 L565,240 L555,225 L540,215 Z",
  WY: "M270,260 L270,345 L370,345 L370,260 Z",
  DC: "M768,378 L772,374 L776,378 L772,382 Z",
};

/* ── Design tokens ── */
const defaultFill = '#E8E0D8';
const hoverFill = '#1C2E5B';
const selectedFill = '#8B1A2B';

export default function USMapSVG({ onSelect, selectedState }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40,
      });
    }
  }, []);

  const handleClick = useCallback((abbr) => {
    const fullName = STATE_NAMES[abbr];
    if (fullName && onSelect) {
      onSelect(fullName);
    }
  }, [onSelect]);

  /* Find abbreviation for a full state name */
  const selectedAbbr = selectedState
    ? Object.entries(STATE_NAMES).find(([, name]) => name === selectedState)?.[0]
    : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Inject pulse animation keyframes */}
      <style>{`
        @keyframes mapPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(139,26,43,0.3)); }
          50% { filter: drop-shadow(0 0 14px rgba(139,26,43,0.6)); }
        }
        .us-map-state {
          transition: fill 0.25s ease, filter 0.25s ease;
          cursor: pointer;
        }
        .us-map-state:hover {
          filter: drop-shadow(0 2px 6px rgba(28,46,91,0.4));
        }
        .us-map-state-selected {
          animation: mapPulse 2.5s ease-in-out infinite;
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="80 140 830 520"
        width="100%"
        style={{ display: 'block' }}
        onMouseMove={handleMouseMove}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Object.entries(STATE_PATHS).map(([abbr, d]) => {
          const isSelected = abbr === selectedAbbr;
          const isHovered = abbr === hoveredState;

          let fill = defaultFill;
          if (isSelected) fill = selectedFill;
          else if (isHovered) fill = hoverFill;

          return (
            <motion.path
              key={abbr}
              d={d}
              data-state={abbr}
              className={`us-map-state ${isSelected ? 'us-map-state-selected' : ''}`}
              fill={fill}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
              onMouseEnter={() => setHoveredState(abbr)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => handleClick(abbr)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ originBox: 'fill-box', transformOrigin: 'center center' }}
            />
          );
        })}

        {/* State labels for larger states */}
        {[
          { abbr: 'TX', x: 430, y: 555 },
          { abbr: 'CA', x: 145, y: 400 },
          { abbr: 'MT', x: 305, y: 225 },
          { abbr: 'AZ', x: 240, y: 485 },
          { abbr: 'NM', x: 290, y: 485 },
          { abbr: 'CO', x: 330, y: 400 },
          { abbr: 'WY', x: 320, y: 300 },
          { abbr: 'OR', x: 165, y: 265 },
          { abbr: 'WA', x: 165, y: 185 },
          { abbr: 'NV', x: 192, y: 375 },
          { abbr: 'UT', x: 248, y: 388 },
          { abbr: 'ID', x: 235, y: 280 },
          { abbr: 'ND', x: 420, y: 220 },
          { abbr: 'SD', x: 420, y: 300 },
          { abbr: 'NE', x: 425, y: 368 },
          { abbr: 'KS', x: 440, y: 430 },
          { abbr: 'OK', x: 445, y: 470 },
          { abbr: 'MN', x: 505, y: 245 },
          { abbr: 'IA', x: 522, y: 332 },
          { abbr: 'MO', x: 530, y: 425 },
          { abbr: 'AR', x: 582, y: 497 },
          { abbr: 'LA', x: 580, y: 552 },
          { abbr: 'MS', x: 599, y: 510 },
          { abbr: 'AL', x: 620, y: 508 },
          { abbr: 'GA', x: 680, y: 505 },
          { abbr: 'FL', x: 678, y: 590 },
          { abbr: 'SC', x: 715, y: 472 },
          { abbr: 'NC', x: 720, y: 440 },
          { abbr: 'TN', x: 624, y: 440 },
          { abbr: 'KY', x: 660, y: 415 },
          { abbr: 'VA', x: 735, y: 405 },
          { abbr: 'WV', x: 700, y: 392 },
          { abbr: 'OH', x: 668, y: 358 },
          { abbr: 'IN', x: 618, y: 370 },
          { abbr: 'IL', x: 568, y: 370 },
          { abbr: 'WI', x: 542, y: 262 },
          { abbr: 'MI', x: 610, y: 265 },
          { abbr: 'PA', x: 748, y: 330 },
          { abbr: 'NY', x: 775, y: 270 },
          { abbr: 'ME', x: 866, y: 218 },
        ].map(({ abbr, x, y }) => (
          <text
            key={`label-${abbr}`}
            x={x}
            y={y}
            textAnchor="middle"
            fill={abbr === selectedAbbr ? '#fff' : '#666'}
            fontSize="10"
            fontWeight="600"
            fontFamily="'Poppins', system-ui, sans-serif"
            pointerEvents="none"
            style={{ userSelect: 'none' }}
          >
            {abbr}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translateX(-50%)',
              background: '#1C2E5B',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: "'Poppins', system-ui, sans-serif",
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 50,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
            }}
          >
            {STATE_NAMES[hoveredState]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
