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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] bg-gray-950/80 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-3 z-40">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/40">
          {formatYear(timeRange[0])}
        </span>
        <span className="text-xs text-white/30">Timeline Filter</span>
        <span className="text-xs text-white/40">
          {formatYear(timeRange[1])}
        </span>
      </div>

      {/* Dual range slider */}
      <div className="relative h-6">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-blue-500/50 rounded-full"
          style={{
            left: `${toPercent(timeRange[0])}%`,
            width: `${toPercent(timeRange[1]) - toPercent(timeRange[0])}%`,
          }}
        />

        {/* Axial Age marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-amber-400/30 rounded"
          style={{
            left: `${toPercent(-800)}%`,
            width: `${toPercent(-200) - toPercent(-800)}%`,
          }}
          title="Axial Age (800-200 BCE)"
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
          className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
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
          className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
        />
      </div>

      {/* Era markers */}
      <div className="flex justify-between mt-1">
        {[
          { label: 'Bronze Age', year: -3500 },
          { label: 'Axial Age', year: -600 },
          { label: '0', year: 0 },
          { label: 'Medieval', year: 1000 },
          { label: 'Modern', year: 1800 },
        ].map((era) => (
          <span
            key={era.label}
            className="text-[9px] text-white/20"
            style={{ position: 'relative', left: `${toPercent(era.year) - 50}%` }}
          >
            {era.label}
          </span>
        ))}
      </div>
    </div>
  );
}
