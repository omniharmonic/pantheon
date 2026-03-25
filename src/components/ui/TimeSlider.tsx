'use client';

import { useStore } from '@/lib/store';

const MIN_YEAR = -5000;
const MAX_YEAR = 2025;

export default function TimeSlider() {
  const timeRange = useStore((s) => s.timeRange);
  const setTimeRange = useStore((s) => s.setTimeRange);

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year} CE`;
  };

  const toPercent = (year: number) =>
    ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[560px] sm:max-w-[85vw] panel-glass sm:rounded-xl px-4 sm:px-5 pt-3 pb-4 sm:pb-3 z-40 safe-bottom">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs sm:text-sm font-medium text-white/50 tabular-nums">
          {formatYear(timeRange[0])}
        </span>
        <span className="text-[11px] text-white/25 uppercase tracking-wider hidden sm:block">
          Timeline
        </span>
        <span className="text-xs sm:text-sm font-medium text-white/50 tabular-nums">
          {formatYear(timeRange[1])}
        </span>
      </div>

      {/* Dual range slider */}
      <div className="relative h-8 sm:h-7">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 sm:h-1 bg-white/8 rounded-full" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 sm:h-1 bg-blue-500/40 rounded-full"
          style={{
            left: `${toPercent(timeRange[0])}%`,
            width: `${toPercent(timeRange[1]) - toPercent(timeRange[0])}%`,
          }}
        />

        {/* Axial Age marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2.5 sm:h-2 bg-amber-400/20 rounded"
          style={{
            left: `${toPercent(-800)}%`,
            width: `${toPercent(-200) - toPercent(-800)}%`,
          }}
          title="Axial Age (800–200 BCE)"
        />

        {/* Min handle */}
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={50}
          value={timeRange[0]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val < timeRange[1]) setTimeRange([val, timeRange[1]]);
          }}
          className="absolute w-full h-8 sm:h-7 appearance-none bg-transparent cursor-pointer z-10"
        />

        {/* Max handle */}
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={50}
          value={timeRange[1]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val > timeRange[0]) setTimeRange([timeRange[0], val]);
          }}
          className="absolute w-full h-8 sm:h-7 appearance-none bg-transparent cursor-pointer z-10"
        />
      </div>

      {/* Era markers — hidden on very small screens */}
      <div className="hidden sm:flex justify-between mt-0.5 px-1">
        {[
          { label: 'Bronze Age', year: -3500 },
          { label: 'Axial Age', year: -600 },
          { label: '0', year: 0 },
          { label: 'Medieval', year: 1000 },
          { label: 'Modern', year: 1800 },
        ].map((era) => (
          <span
            key={era.label}
            className="text-[10px] text-white/15"
          >
            {era.label}
          </span>
        ))}
      </div>
    </div>
  );
}
