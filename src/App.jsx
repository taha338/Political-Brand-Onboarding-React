import { BrandProvider, useBrand } from './context/BrandContext';
import ProgressBar from './components/ProgressBar';
import Stage1 from './components/stages/Stage1_CandidateBasics';
import Stage2 from './components/stages/Stage2_CandidateProfile';
import Stage3 from './components/stages/Stage3_BrandCore';
import Stage4 from './components/stages/Stage4_SubDirection';
import Stage5 from './components/stages/Stage5_ColorPalette';
import Stage6 from './components/stages/Stage6_VisualIdentity';
import Stage7 from './components/stages/Stage7_LogoType';
import Stage8 from './components/stages/Stage8_CollateralPriority';
import Stage9 from './components/stages/Stage9_FinalReview';

const stages = [Stage1, Stage2, Stage3, Stage4, Stage5, Stage6, Stage7, Stage8, Stage9];

function AppContent() {
  const { state } = useBrand();
  const StageComponent = stages[state.currentStage];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar />
      <StageComponent key={state.currentStage} />
    </div>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <AppContent />
    </BrandProvider>
  );
}
