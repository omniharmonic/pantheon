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
    <div className="fixed bottom-[72px] sm:bottom-[5.5rem] left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-50 pointer-events-auto">
      <div className="flex items-center gap-1 panel-glass-lighter rounded-xl px-2 py-1.5 overflow-x-auto no-scrollbar">
        {/* Clear */}
        <button
          onClick={clearJourney}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-all shrink-0"
          title="Clear journey"
        >
          ✕
        </button>
        <span className="text-white/10 shrink-0">│</span>

        {/* Steps */}
        {journey.map((step, i) => (
          <span key={`${step.id}-${i}`} className="flex items-center shrink-0">
            <button
              onClick={() => handleStepClick(step, i)}
              className="text-sm text-white/40 hover:text-white/80 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all whitespace-nowrap"
            >
              {step.name}
            </button>
            <span className="text-white/15 text-xs mx-0.5">→</span>
          </span>
        ))}

        {/* Current */}
        {currentName && (
          <span className="text-sm text-amber-300/80 font-medium px-2.5 py-1 bg-amber-500/10 rounded-lg whitespace-nowrap shrink-0">
            {currentName}
          </span>
        )}
      </div>
    </div>
  );
}
