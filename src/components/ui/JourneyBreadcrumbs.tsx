'use client';

import { useStore } from '@/lib/store';
import { getTraditionById, getFigureById } from '@/lib/data';

export default function JourneyBreadcrumbs() {
  const journey = useStore((s) => s.journey);
  const jumpToJourney = useStore((s) => s.jumpToJourney);
  const clearJourney = useStore((s) => s.clearJourney);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);
  const setSelectedFigure = useStore((s) => s.setSelectedFigure);
  const selectedFigure = useStore((s) => s.selectedFigure);
  const selectedTradition = useStore((s) => s.selectedTradition);

  if (journey.length === 0) return null;

  // Current active node (the head)
  const currentName = selectedFigure?.name || selectedTradition?.name || null;

  const handleStepClick = (step: typeof journey[0], index: number) => {
    jumpToJourney(index);
    if (step.type === 'tradition') {
      const t = getTraditionById(step.id);
      if (t) {
        setSelectedFigure(null);
        setSelectedTradition(t);
      }
    } else {
      const f = getFigureById(step.id);
      if (f) {
        setSelectedTradition(null);
        setSelectedFigure(f);
      }
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="flex items-center gap-1 bg-gray-950/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 max-w-[90vw] overflow-x-auto">
        {/* Clear button */}
        <button
          onClick={clearJourney}
          className="text-[10px] text-white/30 hover:text-white/60 px-1.5 py-0.5 rounded transition-colors shrink-0"
          title="Clear journey"
        >
          ✕
        </button>
        <span className="text-white/10 text-[10px]">│</span>

        {/* Journey steps */}
        {journey.map((step, i) => (
          <span key={`${step.id}-${i}`} className="flex items-center shrink-0">
            <button
              onClick={() => handleStepClick(step, i)}
              className="text-[11px] text-white/40 hover:text-white/80 px-1.5 py-0.5 rounded hover:bg-white/5 transition-all whitespace-nowrap"
            >
              {step.name}
            </button>
            <span className="text-white/15 text-[10px] mx-0.5">→</span>
          </span>
        ))}

        {/* Current location */}
        {currentName && (
          <span className="text-[11px] text-amber-300/80 font-medium px-1.5 py-0.5 bg-amber-500/10 rounded-full whitespace-nowrap shrink-0">
            {currentName}
          </span>
        )}
      </div>
    </div>
  );
}
