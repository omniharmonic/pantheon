'use client';

import { useStore } from '@/lib/store';
import { getFigureById, getFigureConnections, getTraditionById } from '@/lib/data';
import type { SharedFigure } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  deity: 'bg-amber-500/20 text-amber-300',
  prophet: 'bg-blue-500/20 text-blue-300',
  patriarch: 'bg-emerald-500/20 text-emerald-300',
  sage: 'bg-teal-500/20 text-teal-300',
  hero: 'bg-red-500/20 text-red-300',
  angel: 'bg-sky-500/20 text-sky-300',
  demon: 'bg-purple-500/20 text-purple-300',
  saint: 'bg-yellow-500/20 text-yellow-300',
};

const CONNECTION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  cognate: { label: 'Cognate', color: 'text-amber-300' },
  same_figure: { label: 'Same figure', color: 'text-green-300' },
  equivalent: { label: 'Equivalent', color: 'text-blue-300' },
  evolved_from: { label: 'Evolved from', color: 'text-cyan-300' },
  syncretized_with: { label: 'Syncretized', color: 'text-orange-300' },
  influenced: { label: 'Influenced', color: 'text-violet-300' },
  absorbed_into: { label: 'Absorbed into', color: 'text-pink-300' },
  demonized_as: { label: 'Demonized as', color: 'text-red-400' },
  prefiguration: { label: 'Prefigures', color: 'text-sky-300' },
  spiritual_lineage: { label: 'Lineage', color: 'text-emerald-300' },
  prophetic_parallel: { label: 'Parallel', color: 'text-indigo-300' },
  parent: { label: 'Parent', color: 'text-green-300' },
  child: { label: 'Child', color: 'text-green-300' },
  consort: { label: 'Consort', color: 'text-pink-300' },
  sibling: { label: 'Sibling', color: 'text-yellow-300' },
  adversary: { label: 'Adversary', color: 'text-red-300' },
  mythological_parallel: { label: 'Myth parallel', color: 'text-purple-300' },
  artistic_identification: { label: 'Art identification', color: 'text-amber-300' },
  cultural_adaptation: { label: 'Adapted as', color: 'text-teal-300' },
};

export default function FigureDetail() {
  const selectedFigure = useStore((s) => s.selectedFigure);
  const setSelectedFigure = useStore((s) => s.setSelectedFigure);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);

  if (!selectedFigure) return null;

  const f = selectedFigure;
  const figureConnections = getFigureConnections(f.id);
  const typeStyle = TYPE_COLORS[f.type] || 'bg-white/10 text-white/50';

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] max-w-[90vw] bg-gray-950/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto z-[110]">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm border-b border-white/10 p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${typeStyle}`}>
                {f.type}
              </span>
              {f.dateLabel && (
                <span className="text-[10px] text-white/30">{f.dateLabel}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{f.name}</h2>
          </div>
          <button
            onClick={() => setSelectedFigure(null)}
            className="text-white/40 hover:text-white text-xl p-1"
          >
            ×
          </button>
        </div>

        {/* Aliases */}
        {f.aliases.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {f.aliases.map((alias, i) => (
              <span key={i} className="text-[11px] bg-white/5 text-white/50 px-2 py-0.5 rounded">
                {alias}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Traditions & Roles */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            Appears in {f.traditions.length} Traditions
          </h3>
          <div className="space-y-2">
            {f.traditions.map((tid) => {
              const tradition = getTraditionById(tid);
              const role = f.roles[tid];
              return (
                <button
                  key={tid}
                  onClick={() => {
                    if (tradition) {
                      setSelectedFigure(null);
                      setSelectedTradition(tradition);
                    }
                  }}
                  className="w-full text-left bg-white/5 hover:bg-white/8 border border-white/10 rounded-lg p-3 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      {tradition?.name || tid}
                    </span>
                    <span className="text-[10px] text-white/20 group-hover:text-white/40">
                      view →
                    </span>
                  </div>
                  {role && (
                    <p className="text-xs text-white/50 mt-1">{role}</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Connections to other figures */}
        {figureConnections.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Connected Figures ({figureConnections.length})
            </h3>
            <div className="space-y-1.5">
              {figureConnections.map(({ figure: target, connection: conn }) => {
                const connInfo = CONNECTION_TYPE_LABELS[conn.type] || {
                  label: conn.type.replace(/_/g, ' '),
                  color: 'text-white/50',
                };
                return (
                  <button
                    key={`${target.id}-${conn.type}`}
                    onClick={() => setSelectedFigure(target)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${connInfo.color}`}>
                        {connInfo.label}
                      </span>
                      <span className="text-white/15">·</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${TYPE_COLORS[target.type] || 'bg-white/5 text-white/40'}`}>
                        {target.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-white group-hover:text-blue-300 transition-colors font-medium">
                        {target.name}
                      </span>
                      <span className="text-[10px] text-white/20 group-hover:text-white/40">→</span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                      {conn.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
