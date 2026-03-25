'use client';

import { THEOLOGY_COLORS, CONNECTION_COLORS } from '@/lib/colors';

const MAJOR_TYPES = [
  { key: 'polytheism', label: 'Polytheism' },
  { key: 'monotheism', label: 'Monotheism' },
  { key: 'nontheism', label: 'Nontheism' },
  { key: 'dualism', label: 'Dualism' },
  { key: 'animism', label: 'Animism' },
  { key: 'monism', label: 'Monism' },
];

const CONNECTION_TYPES = [
  { key: 'parent_child', label: 'Direct descent' },
  { key: 'influence', label: 'Influence' },
  { key: 'syncretism', label: 'Syncretism' },
  { key: 'parent_reaction', label: 'Reaction / reform' },
];

export default function Legend({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed left-3 sm:left-auto sm:right-3 top-24 sm:top-20 panel-glass rounded-xl p-4 sm:p-5 z-40 w-[calc(100%-1.5rem)] sm:w-64 max-h-[60vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Legend
        </h4>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all text-lg"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0.5 mb-4">
        {MAJOR_TYPES.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2.5 py-1">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: THEOLOGY_COLORS[key] }}
            />
            <span className="text-sm text-white/60">{label}</span>
          </div>
        ))}
      </div>

      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
        Connections
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-0.5">
        {CONNECTION_TYPES.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2.5 py-1">
            <div className="w-5 flex items-center shrink-0">
              <div
                className={`h-[2px] w-full rounded-full ${
                  key === 'influence' || key === 'parent_reaction'
                    ? 'border-t border-dashed'
                    : ''
                }`}
                style={{
                  backgroundColor:
                    key !== 'influence' && key !== 'parent_reaction'
                      ? CONNECTION_COLORS[key]
                      : 'transparent',
                  borderColor: CONNECTION_COLORS[key],
                }}
              />
            </div>
            <span className="text-sm text-white/60">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2.5 py-1">
        <div className="w-3 h-3 rotate-45 bg-amber-400/70 shrink-0" />
        <span className="text-sm text-white/60">Syncretic fusion</span>
      </div>
    </div>
  );
}
