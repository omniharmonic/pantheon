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
    <div className="fixed bottom-[76px] sm:bottom-[6rem] left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-50 pointer-events-auto">
      <div className="flex items-center gap-1.5 panel-glass-lighter rounded-2xl px-3 py-2 overflow-x-auto no-scrollbar">
        {/* Clear */}
        <button
          onClick={clearJourney}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all shrink-0 text-xs"
          title="Clear journey"
        >
          ✕
        </button>
        <span className="text-white/[0.08] shrink-0">│</span>

        {/* Steps */}
        {journey.map((step, i) => (
          <span key={`${step.id}-${i}`} className="flex items-center shrink-0">
            <button
              onClick={() => handleStepClick(step, i)}
              className="text-[13px] text-white/35 hover:text-white/70 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all whitespace-nowrap"
            >
              {step.name}
            </button>
            <span className="text-white/10 text-[11px] mx-1">→</span>
          </span>
        ))}

        {/* Current */}
        {currentName && (
          <span className="text-[13px] text-amber-300/60 font-medium px-3 py-1.5 bg-amber-500/[0.07] rounded-xl whitespace-nowrap shrink-0 border border-amber-400/10">
            {currentName}
          </span>
        )}
      </div>
    </div>
  );
}
