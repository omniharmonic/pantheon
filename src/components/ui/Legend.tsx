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
  { key: 'parent_reaction', label: 'Reaction/reform' },
];

export default function Legend() {
  return (
    <div className="fixed bottom-6 right-4 bg-gray-950/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 z-40 text-xs">
      <h4 className="text-white/30 uppercase tracking-wider text-[10px] mb-2">
        Node Color
      </h4>
      <div className="space-y-1 mb-3">
        {MAJOR_TYPES.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: THEOLOGY_COLORS[key] }}
            />
            <span className="text-white/50">{label}</span>
          </div>
        ))}
      </div>

      <h4 className="text-white/30 uppercase tracking-wider text-[10px] mb-2">
        Connection Type
      </h4>
      <div className="space-y-1">
        {CONNECTION_TYPES.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-5 flex items-center">
              <div
                className={`h-[2px] w-full ${
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
            <span className="text-white/50">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rotate-45 bg-amber-400/70" />
        <span className="text-white/50">Syncretic fusion point</span>
      </div>
    </div>
  );
}
