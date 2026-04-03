import { motion } from 'framer-motion';
import { useBrand } from '../context/BrandContext';

export default function StageContainer({ children, title, subtitle, stageNumber }) {
  const { prevStage, nextStage, state } = useBrand();
  const isFirst = state.currentStage === 0;
  const isLast = state.currentStage === 8;

  return (
    <div className="relative">
      {/* Decorative dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" aria-hidden="true" />

      {/* Decorative SVG abstract lines */}
      <svg
        className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="300" cy="100" r="180" stroke="#1C2E5B" strokeWidth="0.5" />
        <circle cx="300" cy="100" r="140" stroke="#1C2E5B" strokeWidth="0.5" />
        <circle cx="300" cy="100" r="100" stroke="#B22234" strokeWidth="0.5" />
        <line x1="0" y1="200" x2="400" y2="150" stroke="#1C2E5B" strokeWidth="0.5" />
        <line x1="0" y1="250" x2="400" y2="200" stroke="#1C2E5B" strokeWidth="0.3" />
      </svg>

      {/* Rounded 40px container */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 relative z-10">
        <div
          className="bg-white/70 backdrop-blur-sm shadow-xl shadow-navy-800/5 px-8 md:px-12 py-10 md:py-14"
          style={{ borderRadius: '40px' }}
        >
          <div className="mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-navy-800 text-white text-sm font-bold">
                {stageNumber}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-navy-200 to-transparent" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient"
              style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-lg max-w-2xl text-gray-900"
                style={{ opacity: 0.6 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>

          {!isLast && (
            <>
              {/* Wave SVG divider */}
              <div className="mt-16 -mx-8 md:-mx-12 overflow-hidden">
                <svg
                  viewBox="0 0 1440 48"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  className="w-full h-10 text-gray-100"
                >
                  <path
                    d="M0 24C240 4 480 44 720 24C960 4 1200 44 1440 24V48H0Z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between pt-6 px-0 no-print">
                {!isFirst ? (
                  <button
                    onClick={prevStage}
                    className="flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-900 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                ) : <div />}
                <button
                  onClick={nextStage}
                  className="flex items-center gap-2 px-8 py-3.5 bg-navy-800 text-white rounded-xl hover:bg-navy-700 transition-all font-semibold glow-navy hover:glow-red hover:-translate-y-0.5"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
