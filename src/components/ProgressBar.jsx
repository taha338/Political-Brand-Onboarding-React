import { STAGES } from '../data/brandData';
import { useBrand } from '../context/BrandContext';

export default function ProgressBar() {
  const { state, goToStage } = useBrand();
  const { currentStage, completedStages } = state;
  const progress = ((currentStage + 1) / STAGES.length) * 100;

  return (
    <div className="sticky top-0 z-50 no-print">
      {/* NProgress-style thin bar at the very top */}
      <div className="relative h-1 bg-gray-200/60">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-r-full animate-pulse-glow"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8B1A2B, #B22234)',
          }}
        >
          {/* Glowing tip */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: '#B22234',
              boxShadow: '0 0 12px 4px rgba(178, 34, 52, 0.6), 0 0 24px 8px rgba(178, 34, 52, 0.3)',
            }}
          />
        </div>
      </div>

      {/* Subtle stage indicator */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-soft text-gray-500 tracking-wide uppercase">
            Step {currentStage + 1} / {STAGES.length}
          </span>
          <span className="text-xs font-semibold text-navy-800 text-soft">
            {STAGES[currentStage]}
          </span>
        </div>

        {/* Segment indicators */}
        <div className="max-w-6xl mx-auto px-4 pb-2 flex gap-1">
          {STAGES.map((stage, i) => {
            const isCompleted = completedStages.includes(i);
            const isCurrent = i === currentStage;
            const isAccessible = isCompleted || i <= Math.max(...completedStages, 0);
            return (
              <button
                key={i}
                onClick={() => isAccessible && goToStage(i)}
                className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                  isCurrent
                    ? 'bg-[#8B1A2B] animate-pulse-glow'
                    : isCompleted
                    ? 'bg-navy-400/60 hover:bg-navy-500 cursor-pointer'
                    : 'bg-gray-200/50'
                } ${isAccessible ? 'cursor-pointer' : 'cursor-default'}`}
                title={stage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
