import { motion } from 'framer-motion';
import { useBrand } from '../context/BrandContext';

export default function StageContainer({ children, title, subtitle, stageNumber }) {
  const { prevStage, nextStage, state } = useBrand();
  const isFirst = state.currentStage === 0;
  const isLast = state.currentStage === 8;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-lg text-gray-500 max-w-2xl"
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
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-100 no-print">
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
              className="flex items-center gap-2 px-8 py-3.5 bg-navy-800 text-white rounded-xl hover:bg-navy-700 transition-all font-semibold shadow-lg shadow-navy-800/20 hover:shadow-xl hover:shadow-navy-800/30 hover:-translate-y-0.5"
            >
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
