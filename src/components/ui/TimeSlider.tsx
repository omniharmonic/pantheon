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
    <div className="fixed bottom-0 left-0 right-0 sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:w-[520px] sm:max-w-[85vw] panel-glass sm:rounded-2xl px-5 sm:px-6 pt-4 pb-5 sm:pb-4 z-40 safe-bottom">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium text-white/40 tabular-nums tracking-wide">
          {formatYear(timeRange[0])}
        </span>
        <span className="text-[10px] text-white/15 uppercase tracking-[0.15em] hidden sm:block">
          Timeline
        </span>
        <span className="text-[13px] font-medium text-white/40 tabular-nums tracking-wide">
          {formatYear(timeRange[1])}
        </span>
      </div>

      {/* Dual range slider */}
      <div className="relative h-8">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-[3px] bg-white/[0.06] rounded-full" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[3px] bg-blue-400/30 rounded-full"
          style={{
            left: `${toPercent(timeRange[0])}%`,
            width: `${toPercent(timeRange[1]) - toPercent(timeRange[0])}%`,
          }}
        />

        {/* Axial Age marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-amber-400/15 rounded"
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
          className="absolute w-full h-8 appearance-none bg-transparent cursor-pointer z-10"
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
          className="absolute w-full h-8 appearance-none bg-transparent cursor-pointer z-10"
        />
      </div>

      {/* Era markers */}
      <div className="hidden sm:flex justify-between mt-1 px-1">
        {[
          { label: 'Bronze Age', year: -3500 },
          { label: 'Axial Age', year: -600 },
          { label: '0', year: 0 },
          { label: 'Medieval', year: 1000 },
          { label: 'Modern', year: 1800 },
        ].map((era) => (
          <span
            key={era.label}
            className="text-[10px] text-white/10 tracking-wide"
          >
            {era.label}
          </span>
        ))}
      </div>
    </div>
  );
}
