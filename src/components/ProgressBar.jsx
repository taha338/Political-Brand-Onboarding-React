import { STAGES } from '../data/brandData';
import { useBrand } from '../context/BrandContext';

export default function ProgressBar() {
  const { state, goToStage } = useBrand();
  const { currentStage, completedStages } = state;

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 no-print">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Stage {currentStage + 1} of {STAGES.length}
          </span>
          <span className="text-sm font-semibold text-navy-800">
            {STAGES[currentStage]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STAGES.map((stage, i) => {
            const isCompleted = completedStages.includes(i);
            const isCurrent = i === currentStage;
            const isAccessible = isCompleted || i <= Math.max(...completedStages, 0);
            return (
              <button
                key={i}
                onClick={() => isAccessible && goToStage(i)}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  isCurrent
                    ? 'bg-navy-800 scale-y-125'
                    : isCompleted
                    ? 'bg-navy-400 hover:bg-navy-500 cursor-pointer'
                    : 'bg-gray-200'
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
