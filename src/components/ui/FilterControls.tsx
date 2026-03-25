'use client';

import { useStore } from '@/lib/store';
import { getRegions, getTheologyTypes } from '@/lib/data';
import { THEOLOGY_COLORS } from '@/lib/colors';

export default function FilterControls() {
  const showFilters = useStore((s) => s.showFilters);
  const setShowFilters = useStore((s) => s.setShowFilters);
  const activeRegions = useStore((s) => s.activeRegions);
  const activeTheologyTypes = useStore((s) => s.activeTheologyTypes);
  const toggleRegion = useStore((s) => s.toggleRegion);
  const toggleTheologyType = useStore((s) => s.toggleTheologyType);
  const setActiveRegions = useStore((s) => s.setActiveRegions);
  const setActiveTheologyTypes = useStore((s) => s.setActiveTheologyTypes);

  if (!showFilters) return null;

  const regions = getRegions();
  const theologyTypes = getTheologyTypes();

  const majorTypes = [
    'polytheism', 'monotheism', 'henotheism', 'nontheism',
    'dualism', 'animism', 'monism', 'pantheism', 'shamanism',
  ];
  const filteredTypes = theologyTypes.filter((t) => majorTypes.includes(t));

  return (
    <div className="fixed inset-x-3 top-[88px] sm:inset-x-auto sm:left-4 sm:top-20 sm:w-72 panel-glass rounded-xl p-4 sm:p-5 z-40 max-h-[60vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {(activeRegions.size > 0 || activeTheologyTypes.size > 0) && (
            <button
              onClick={() => {
                setActiveRegions(new Set());
                setActiveTheologyTypes(new Set());
              }}
              className="text-sm text-blue-400 hover:text-blue-300 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all text-lg sm:hidden"
          >
            ×
          </button>
        </div>
      </div>

      {/* Regions */}
      <div className="mb-5">
        <h4 className="text-xs text-white/30 uppercase tracking-wider mb-2.5">Region</h4>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeRegions.has(region)
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-400/20'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/80 border border-transparent'
              }`}
            >
              <div
                className={`w-3 h-3 rounded shrink-0 border transition-colors ${
                  activeRegions.has(region)
                    ? 'bg-blue-400 border-blue-400'
                    : 'border-white/25'
                }`}
              />
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Theology Types */}
      <div>
        <h4 className="text-xs text-white/30 uppercase tracking-wider mb-2.5">Theology Type</h4>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
          {filteredTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleTheologyType(type)}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTheologyTypes.has(type)
                  ? 'bg-white/8 text-white border border-white/15'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/80 border border-transparent'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: activeTheologyTypes.has(type)
                    ? THEOLOGY_COLORS[type]
                    : THEOLOGY_COLORS[type] + '55',
                }}
              />
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
