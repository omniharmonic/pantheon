'use client';

import { useStore } from '@/lib/store';
import { getRegions, getTheologyTypes } from '@/lib/data';
import { THEOLOGY_COLORS } from '@/lib/colors';

export default function FilterControls() {
  const showFilters = useStore((s) => s.showFilters);
  const activeRegions = useStore((s) => s.activeRegions);
  const activeTheologyTypes = useStore((s) => s.activeTheologyTypes);
  const toggleRegion = useStore((s) => s.toggleRegion);
  const toggleTheologyType = useStore((s) => s.toggleTheologyType);
  const setActiveRegions = useStore((s) => s.setActiveRegions);
  const setActiveTheologyTypes = useStore((s) => s.setActiveTheologyTypes);

  if (!showFilters) return null;

  const regions = getRegions();
  const theologyTypes = getTheologyTypes();

  // Show only major theology types for cleaner UI
  const majorTypes = [
    'polytheism',
    'monotheism',
    'henotheism',
    'nontheism',
    'dualism',
    'animism',
    'monism',
    'pantheism',
    'shamanism',
  ];
  const filteredTypes = theologyTypes.filter((t) => majorTypes.includes(t));

  return (
    <div className="fixed left-4 top-20 w-64 bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 z-40 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Filters
        </h3>
        {(activeRegions.size > 0 || activeTheologyTypes.size > 0) && (
          <button
            onClick={() => {
              setActiveRegions(new Set());
              setActiveTheologyTypes(new Set());
            }}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Regions */}
      <div className="mb-4">
        <h4 className="text-xs text-white/30 mb-2">Region</h4>
        <div className="space-y-1">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                activeRegions.has(region)
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-sm border ${
                  activeRegions.has(region)
                    ? 'bg-blue-400 border-blue-400'
                    : 'border-white/30'
                }`}
              />
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Theology Types */}
      <div>
        <h4 className="text-xs text-white/30 mb-2">Theology Type</h4>
        <div className="space-y-1">
          {filteredTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleTheologyType(type)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                activeTheologyTypes.has(type)
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: activeTheologyTypes.has(type)
                    ? THEOLOGY_COLORS[type]
                    : THEOLOGY_COLORS[type] + '60',
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
