'use client';

import { useStore } from '@/lib/store';
import { getFigureConnections, getTraditionById } from '@/lib/data';
import type { SharedFigure } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  deity: 'bg-amber-500/12 text-amber-300/80',
  prophet: 'bg-blue-500/12 text-blue-300/80',
  patriarch: 'bg-emerald-500/12 text-emerald-300/80',
  sage: 'bg-teal-500/12 text-teal-300/80',
  hero: 'bg-red-500/12 text-red-300/80',
  angel: 'bg-sky-500/12 text-sky-300/80',
  demon: 'bg-purple-500/12 text-purple-300/80',
  saint: 'bg-yellow-500/12 text-yellow-300/80',
};

const CONNECTION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  cognate: { label: 'Cognate', color: 'text-amber-300/70' },
  same_figure: { label: 'Same figure', color: 'text-green-300/70' },
  equivalent: { label: 'Equivalent', color: 'text-blue-300/70' },
  evolved_from: { label: 'Evolved from', color: 'text-cyan-300/70' },
  syncretized_with: { label: 'Syncretized', color: 'text-orange-300/70' },
  influenced: { label: 'Influenced', color: 'text-violet-300/70' },
  absorbed_into: { label: 'Absorbed into', color: 'text-pink-300/70' },
  demonized_as: { label: 'Demonized as', color: 'text-red-400/70' },
  prefiguration: { label: 'Prefigures', color: 'text-sky-300/70' },
  spiritual_lineage: { label: 'Lineage', color: 'text-emerald-300/70' },
  prophetic_parallel: { label: 'Parallel', color: 'text-indigo-300/70' },
  parent: { label: 'Parent', color: 'text-green-300/70' },
  child: { label: 'Child', color: 'text-green-300/70' },
  consort: { label: 'Consort', color: 'text-pink-300/70' },
  sibling: { label: 'Sibling', color: 'text-yellow-300/70' },
  adversary: { label: 'Adversary', color: 'text-red-300/70' },
  mythological_parallel: { label: 'Myth parallel', color: 'text-purple-300/70' },
  artistic_identification: { label: 'Art ID', color: 'text-amber-300/70' },
  cultural_adaptation: { label: 'Adapted as', color: 'text-teal-300/70' },
};

export default function FigureDetail() {
  const selectedFigure = useStore((s) => s.selectedFigure);
  const setSelectedFigure = useStore((s) => s.setSelectedFigure);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);
  const pushJourney = useStore((s) => s.pushJourney);
  const showFigureLayer = useStore((s) => s.showFigureLayer);
  const setShowFigureLayer = useStore((s) => s.setShowFigureLayer);

  if (!selectedFigure) return null;

  const f = selectedFigure;
  if (!f.id || !f.name || !Array.isArray(f.traditions) || !Array.isArray(f.aliases)) return null;

  const figureConnections = getFigureConnections(f.id);
  const typeStyle = TYPE_COLORS[f.type] || 'bg-white/[0.06] text-white/40';

  const navigateToFigure = (target: SharedFigure) => {
    pushJourney({ type: 'figure', id: f.id, name: f.name });
    if (!showFigureLayer) setShowFigureLayer(true);
    setSelectedFigure(target);
  };

  const navigateToTradition = (tid: string) => {
    const tradition = getTraditionById(tid);
    if (tradition) {
      pushJourney({ type: 'figure', id: f.id, name: f.name });
      setSelectedFigure(null);
      setSelectedTradition(tradition);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 h-[75vh] sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-full sm:w-[440px] sm:max-w-[90vw] panel-glass rounded-t-3xl sm:rounded-none overflow-y-auto z-[110] animate-slide-in">
      {/* Drag handle (mobile) */}
      <div className="sm:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/15" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-[rgba(5,5,16,0.96)] backdrop-blur-xl border-b border-white/[0.06] px-6 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-[11px] px-3 py-1.5 rounded-full uppercase tracking-[0.08em] font-medium ${typeStyle}`}>
                {f.type}
              </span>
              {f.dateLabel && (
                <span className="text-[11px] text-white/25">{f.dateLabel}</span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-white/90 leading-tight tracking-wide">{f.name}</h2>
          </div>
          <button
            onClick={() => setSelectedFigure(null)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white/30 hover:text-white/80 hover:bg-white/[0.06] transition-all text-lg"
          >
            ✕
          </button>
        </div>

        {/* Aliases */}
        {f.aliases && f.aliases.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {f.aliases.map((alias, i) => (
              <span key={i} className="text-[12px] bg-white/[0.04] text-white/40 px-3 py-1.5 rounded-xl border border-white/[0.04]">
                {alias}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 sm:px-7 py-6 space-y-8">
        {/* Traditions & Roles */}
        <section>
          <h3 className="section-label">
            Appears in {(f.traditions || []).length} Traditions
          </h3>
          <div className="space-y-2.5">
            {(f.traditions || []).map((tid) => {
              const tradition = getTraditionById(tid);
              const role = f.roles[tid];
              return (
                <button
                  key={tid}
                  onClick={() => navigateToTradition(tid)}
                  className="w-full text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70 group-hover:text-blue-300/80 transition-colors">
                      {tradition?.name || tid}
                    </span>
                    <span className="text-[11px] text-white/15 group-hover:text-white/40 transition-colors tracking-wide">
                      view →
                    </span>
                  </div>
                  {role && (
                    <p className="text-sm text-white/35 mt-1.5 leading-relaxed">{role}</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Connected Figures */}
        {figureConnections.length > 0 && (
          <section>
            <h3 className="section-label">
              Connected Figures ({figureConnections.length})
            </h3>
            <p className="text-[11px] text-white/15 mb-4 tracking-wide">
              Click to fly the camera to that figure
            </p>
            <div className="space-y-2.5">
              {figureConnections.map(({ figure: target, connection: conn }) => {
                const connInfo = CONNECTION_TYPE_LABELS[conn.type] || {
                  label: conn.type.replace(/_/g, ' '),
                  color: 'text-white/40',
                };
                return (
                  <button
                    key={`${target.id}-${conn.type}`}
                    onClick={() => navigateToFigure(target)}
                    className="w-full text-left px-4 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.1] transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-[11px] font-medium uppercase tracking-[0.08em] ${connInfo.color}`}>
                        {connInfo.label}
                      </span>
                      <span className="text-white/[0.08]">·</span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-lg ${TYPE_COLORS[target.type] || 'bg-white/[0.04] text-white/35'}`}>
                        {target.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70 group-hover:text-blue-300/80 transition-colors font-medium">
                        {target.name}
                      </span>
                      <span className="text-[11px] text-white/10 group-hover:text-amber-300/50 transition-colors tracking-wide">
                        fly to →
                      </span>
                    </div>
                    <p className="text-[12px] text-white/25 mt-1.5 leading-relaxed">
                      {conn.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom spacer */}
        <div className="h-10 sm:h-4" />
      </div>
    </div>
  );
}
