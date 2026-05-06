import { useEffect } from 'react';
import { BrandProvider, useBrand } from './context/BrandContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence, motion } from 'framer-motion';
import ProgressBar from './components/ProgressBar';
import LiveColorStrip from './components/LiveColorStrip';
import Stage1 from './components/stages/Stage1_CandidateBasics';
import Stage2 from './components/stages/Stage2_CandidateProfile';
import Stage3 from './components/stages/Stage3_BrandCore';
import Stage4 from './components/stages/Stage4_SubDirection';
import Stage5 from './components/stages/Stage5_ColorPalette';
import Stage6 from './components/stages/Stage6_FontSelection';
import Stage7 from './components/stages/Stage6_VisualIdentity';
import Stage8 from './components/stages/Stage7_LogoType';
// import Stage9 from './components/stages/Stage8_CollateralPriority'; // hidden for now — re-enable when ready
import Stage10 from './components/stages/Stage9_FinalReview';

const stages = [Stage1, Stage2, Stage3, Stage4, Stage5, Stage6, Stage7, Stage8, /*Stage9,*/ Stage10];

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const desktopVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};
const desktopTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

/**
 * On boot, if the URL has ?client_id=, fetch /api/clickup-prefill and
 * dispatch initial values into the form. User can edit any of them.
 */
function PrefillBoot() {
  const { dispatch } = useBrand();
  useEffect(() => {
    const cid = new URLSearchParams(window.location.search).get('client_id')
              || new URLSearchParams(window.location.search).get('clientId');
    if (!cid) return;
    fetch(`/api/clickup-prefill?clientId=${encodeURIComponent(cid)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.found) return;
        // Subject type drives the rest of the UI — set first.
        if (data.subjectType === 'candidate' || data.subjectType === 'party') {
          dispatch({ type: 'SET_SUBJECT_TYPE', payload: data.subjectType });
        }
        // Display name → maps to candidate.fullName OR party.name
        const dn = data.tradeName;
        if (dn) {
          if (data.subjectType === 'party') {
            dispatch({ type: 'UPDATE_PARTY', payload: { name: dn } });
          } else {
            dispatch({ type: 'UPDATE_CANDIDATE', payload: { fullName: dn } });
          }
        }
        // Primary contact name → if party, use as spokesperson default
        if (data.subjectType === 'party' && data.contact?.name) {
          dispatch({ type: 'UPDATE_PARTY', payload: { spokesperson: data.contact.name } });
        }
      })
      .catch(() => { /* silent — form remains fillable */ });
  }, [dispatch]);
  return null;
}

function AppContent() {
  const { state } = useBrand();
  const StageComponent = stages[state.currentStage];

  if (isMobile) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB', paddingBottom: 8 }}>
        <ProgressBar />
        <StageComponent key={state.currentStage} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#F9FAFB',
      }}
    >
      <ProgressBar />
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStage}
          variants={desktopVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={desktopTransition}
          style={{ willChange: 'opacity, transform' }}
        >
          <StageComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrandProvider>
        <PrefillBoot />
        <AppContent />
        <LiveColorStrip />
      </BrandProvider>
    </ErrorBoundary>
  );
}
