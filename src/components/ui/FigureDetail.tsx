'use client';

import { useStore } from '@/lib/store';
import { getFigureConnections, getTraditionById } from '@/lib/data';
import type { SharedFigure } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  deity: 'bg-amber-500/15 text-amber-300',
  prophet: 'bg-blue-500/15 text-blue-300',
  patriarch: 'bg-emerald-500/15 text-emerald-300',
  sage: 'bg-teal-500/15 text-teal-300',
  hero: 'bg-red-500/15 text-red-300',
  angel: 'bg-sky-500/15 text-sky-300',
  demon: 'bg-purple-500/15 text-purple-300',
  saint: 'bg-yellow-500/15 text-yellow-300',
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
  artistic_identification: { label: 'Art ID', color: 'text-amber-300' },
  cultural_adaptation: { label: 'Adapted as', color: 'text-teal-300' },
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

  // Defensive: bail if the figure object is malformed (race condition from rapid clicking)
  if (!f.id || !f.name || !Array.isArray(f.traditions) || !Array.isArray(f.aliases)) return null;

  const figureConnections = getFigureConnections(f.id);
  const typeStyle = TYPE_COLORS[f.type] || 'bg-white/10 text-white/50';

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
    <div className="fixed inset-x-0 bottom-0 h-[75vh] sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-full sm:w-[420px] sm:max-w-[90vw] panel-glass rounded-t-2xl sm:rounded-none overflow-y-auto z-[110]">
      {/* Drag handle (mobile) */}
      <div className="sm:hidden flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-[rgba(5,5,16,0.95)] backdrop-blur-md border-b border-white/8 px-5 py-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-medium ${typeStyle}`}>
                {f.type}
              </span>
              {f.dateLabel && (
                <span className="text-xs text-white/30">{f.dateLabel}</span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{f.name}</h2>
          </div>
          <button
            onClick={() => setSelectedFigure(null)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all text-xl"
          >
            ×
          </button>
        </div>

        {/* Aliases */}
        {f.aliases && f.aliases.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {f.aliases.map((alias, i) => (
              <span key={i} className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-lg">
                {alias}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Traditions & Roles */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
            Appears in {(f.traditions || []).length} Traditions
          </h3>
          <div className="space-y-2">
            {(f.traditions || []).map((tid) => {
              const tradition = getTraditionById(tid);
              const role = f.roles[tid];
              return (
                <button
                  key={tid}
                  onClick={() => navigateToTradition(tid)}
                  className="w-full text-left bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-3.5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      {tradition?.name || tid}
                    </span>
                    <span className="text-xs text-white/20 group-hover:text-white/50 transition-colors">
                      view →
                    </span>
                  </div>
                  {role && (
                    <p className="text-sm text-white/45 mt-1 leading-relaxed">{role}</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Connected Figures */}
        {figureConnections.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Connected Figures ({figureConnections.length})
            </h3>
            <p className="text-xs text-white/20 mb-3">
              Click to fly the camera to that figure
            </p>
            <div className="space-y-2">
              {figureConnections.map(({ figure: target, connection: conn }) => {
                const connInfo = CONNECTION_TYPE_LABELS[conn.type] || {
                  label: conn.type.replace(/_/g, ' '),
                  color: 'text-white/50',
                };
                return (
                  <button
                    key={`${target.id}-${conn.type}`}
                    onClick={() => navigateToFigure(target)}
                    className="w-full text-left px-3.5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-medium uppercase tracking-wider ${connInfo.color}`}>
                        {connInfo.label}
                      </span>
                      <span className="text-white/10">·</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-lg ${TYPE_COLORS[target.type] || 'bg-white/5 text-white/40'}`}>
                        {target.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white group-hover:text-blue-300 transition-colors font-medium">
                        {target.name}
                      </span>
                      <span className="text-xs text-white/15 group-hover:text-amber-300/60 transition-colors">
                        fly to →
                      </span>
                    </div>
                    <p className="text-xs text-white/35 mt-1 leading-relaxed">
                      {conn.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom spacer for mobile safe area */}
        <div className="h-8 sm:h-0" />
      </div>
    </div>
  );
}
