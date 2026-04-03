import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '../../context/BrandContext';
import { BRAND_CORES } from '../../data/brandData';
import StageContainer from '../StageContainer';

const SECTIONS = [
  { key: 'hero', label: 'Hero Section', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
  ), maxChars: 300 },
  { key: 'about', label: 'About / Bio', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ), maxChars: 600 },
  { key: 'issues', label: 'Issues (3 Priorities)', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  ), maxChars: 200, isArray: true, count: 3 },
  { key: 'endorsements', label: 'Endorsements', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ), maxChars: 400 },
  { key: 'volunteer', label: 'Volunteer CTA', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ), maxChars: 300 },
  { key: 'donate', label: 'Donate CTA', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ), maxChars: 300 },
  { key: 'events', label: 'Events', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ), maxChars: 300 },
  { key: 'contact', label: 'Contact / Footer', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ), maxChars: 300 },
];

function InspirationChip({ text, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(text)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
    >
      <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      {text}
    </motion.button>
  );
}

function SectionCard({ section, value, brandCopy, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const { key, label, icon, maxChars, isArray, count } = section;

  const direction = brandCopy?.[key]?.direction || '';
  const headline = brandCopy?.[key]?.headline || '';
  const cta = brandCopy?.[key]?.cta || '';
  const examples = brandCopy?.[key]?.examples || [];

  const inspirationChips = [
    headline,
    cta,
    ...examples,
  ].filter(Boolean);

  const handleInsert = (text, index) => {
    if (isArray && index !== undefined) {
      const newArr = [...(value || ['', '', ''])];
      newArr[index] = text;
      onUpdate({ [key]: newArr });
    } else {
      onUpdate({ [key]: text });
    }
  };

  const charCount = isArray
    ? (value || []).reduce((sum, v) => sum + (v?.length || 0), 0)
    : (value?.length || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        expanded
          ? 'border-indigo-200 bg-white shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-100'
          : 'border-gray-100 bg-white/80 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
          expanded ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-400'
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          {!expanded && value && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {isArray ? (value || []).filter(Boolean).join(' / ') : value}
            </p>
          )}
        </div>
        {charCount > 0 && (
          <span className="text-[10px] font-mono text-gray-300 mr-2">{charCount} chars</span>
        )}
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-300 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {direction && (
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-1.5">AI Direction</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{direction}</p>
                </div>
              )}

              {inspirationChips.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Click to insert</p>
                  <div className="flex flex-wrap gap-2">
                    {inspirationChips.map((chip, i) => (
                      <InspirationChip
                        key={i}
                        text={chip}
                        onClick={(text) => handleInsert(text, isArray ? 0 : undefined)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {isArray ? (
                <div className="space-y-3">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Priority #{i + 1}
                        {examples[i] && (
                          <span className="text-gray-300 ml-2 font-normal">e.g. "{examples[i]}"</span>
                        )}
                      </label>
                      <div className="relative">
                        <textarea
                          value={(value || ['', '', ''])[i] || ''}
                          onChange={(e) => {
                            const newArr = [...(value || ['', '', ''])];
                            newArr[i] = e.target.value;
                            onUpdate({ [key]: newArr });
                          }}
                          placeholder={examples[i] || `Issue #${i + 1} description...`}
                          rows={2}
                          maxLength={maxChars}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all"
                        />
                        <span className="absolute bottom-2 right-3 text-[10px] font-mono text-gray-300">
                          {((value || ['', '', ''])[i] || '').length}/{maxChars}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    value={value || ''}
                    onChange={(e) => onUpdate({ [key]: e.target.value })}
                    placeholder={`Write your ${label.toLowerCase()} copy...`}
                    rows={4}
                    maxLength={maxChars}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all"
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] font-mono text-gray-300">
                    {(value || '').length}/{maxChars}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Stage7_WebsiteCopy() {
  const { state, dispatch } = useBrand();
  const brandCore = BRAND_CORES[state.brandCore];
  const brandCopy = brandCore?.websiteCopy || {};

  const handleUpdate = (payload) => {
    dispatch({ type: 'UPDATE_WEBSITE_COPY', payload });
  };

  const filledCount = useMemo(() => {
    const wc = state.websiteCopy;
    let count = 0;
    if (wc.hero) count++;
    if (wc.about) count++;
    if (wc.issues?.some(Boolean)) count++;
    if (wc.endorsements) count++;
    if (wc.volunteer) count++;
    if (wc.donate) count++;
    if (wc.events) count++;
    if (wc.contact) count++;
    return count;
  }, [state.websiteCopy]);

  return (
    <StageContainer
      title="Website Copy Framework"
      subtitle="Build the messaging foundation for your campaign website. Each section includes AI-guided direction based on your brand core."
      stageNumber={7}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Brand Voice: <span className="text-indigo-600">{brandCore?.name || 'Not set'}</span>
              </p>
              <p className="text-xs text-gray-400">{brandCore?.voiceTone?.headlineStyle || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(filledCount / 8) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-mono text-gray-400">{filledCount}/8</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 via-gray-100 to-transparent pointer-events-none" />

        <div className="space-y-3">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <SectionCard
                section={section}
                value={state.websiteCopy[section.key]}
                brandCopy={brandCopy}
                onUpdate={handleUpdate}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {brandCore?.voiceTone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-3">Voice & Tone Guide</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-white/60 mb-1">Headline Style</p>
              <p className="text-sm text-white/90 leading-relaxed">{brandCore.voiceTone.headlineStyle}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 mb-1">Use These Words</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {brandCore.voiceTone.vocabulary?.slice(0, 6).map((w) => (
                  <span key={w} className="px-2 py-0.5 text-[10px] font-medium bg-white/10 rounded-full text-emerald-300">{w}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 mb-1">Avoid</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {brandCore.voiceTone.avoid?.slice(0, 6).map((w) => (
                  <span key={w} className="px-2 py-0.5 text-[10px] font-medium bg-white/10 rounded-full text-red-300 line-through">{w}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </StageContainer>
  );
}
