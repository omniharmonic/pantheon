'use client';

import { useStore } from '@/lib/store';
import { getConnectionsForTradition, getTraditionById } from '@/lib/data';
import { getTheologyColor, CONNECTION_COLORS } from '@/lib/colors';
import DeityCard from './DeityCard';

export default function InfoPanel() {
  const selectedTradition = useStore((s) => s.selectedTradition);
  const showInfoPanel = useStore((s) => s.showInfoPanel);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);
  const pushJourney = useStore((s) => s.pushJourney);

  if (!showInfoPanel || !selectedTradition) return null;

  const t = selectedTradition;
  const connections = getConnectionsForTradition(t.id);
  const color = getTheologyColor(t.theologicalType);

  const formatDate = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year} CE`;
  };

  const parents = connections.filter((c) => c.to === t.id);
  const children = connections.filter((c) => c.from === t.id);

  return (
    <div className="fixed inset-x-0 bottom-0 h-[70vh] sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-full sm:w-[420px] sm:max-w-[90vw] panel-glass rounded-t-2xl sm:rounded-none overflow-y-auto z-[100]">
      {/* Drag handle (mobile) */}
      <div className="sm:hidden flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-[rgba(5,5,16,0.95)] backdrop-blur-md border-b border-white/8 px-5 py-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-white/50 uppercase tracking-wider">
                {t.theologicalType.join(' · ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{t.name}</h2>
          </div>
          <button
            onClick={() => setSelectedTradition(null)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex gap-4 mt-3 text-sm text-white/50">
          <span>
            {t.originDateLabel || formatDate(t.originDate)}
            {t.endDate ? ` — ${formatDate(t.endDate)}` : ' — present'}
          </span>
        </div>
        <div className="text-sm text-white/40 mt-1">{t.geographicOrigin}</div>
        <div className="mt-2.5">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              t.status === 'active'
                ? 'bg-green-500/15 text-green-300'
                : t.status === 'active_minority'
                ? 'bg-yellow-500/15 text-yellow-300'
                : t.status.includes('revived')
                ? 'bg-purple-500/15 text-purple-300'
                : 'bg-white/8 text-white/40'
            }`}
          >
            {t.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Key Concepts */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
            Key Concepts
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {t.keyConcepts.map((concept, i) => (
              <span
                key={i}
                className="text-xs sm:text-sm bg-white/5 text-white/70 px-2.5 py-1 rounded-lg"
              >
                {concept}
              </span>
            ))}
          </div>
        </section>

        {/* Key Figures */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
            Key Figures ({t.keyFigures.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {t.keyFigures.map((figure, i) => (
              <DeityCard key={i} figure={figure} />
            ))}
          </div>
        </section>

        {/* Branches */}
        {t.majorBranches && t.majorBranches.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
              Major Branches
            </h3>
            {t.majorBranches.map((branch, i) => (
              <div key={i} className="bg-white/[0.04] rounded-xl p-3.5 mb-2 border border-white/[0.06]">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{branch.name}</span>
                  {branch.originDate && (
                    <span className="text-xs text-white/40">{formatDate(branch.originDate)}</span>
                  )}
                </div>
                <p className="text-sm text-white/50 mt-1">{branch.description}</p>
                {branch.regions && (
                  <p className="text-xs text-white/30 mt-1">{branch.regions.join(', ')}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {t.majorSects && t.majorSects.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
              Major Sects
            </h3>
            {t.majorSects.map((sect, i) => (
              <div key={i} className="bg-white/[0.04] rounded-xl p-3.5 mb-2 border border-white/[0.06]">
                <span className="text-sm font-medium text-white">{sect.name}</span>
                {(sect.description || sect.focus) && (
                  <p className="text-sm text-white/50 mt-1">{sect.description || sect.focus}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Connections */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
            Connections ({connections.length})
          </h3>

          {parents.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-white/30 mb-1.5">Influenced by:</p>
              {parents.map((c) => {
                const source = getTraditionById(c.from);
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (source) {
                        pushJourney({ type: 'tradition', id: t.id, name: t.name });
                        setSelectedTradition(source);
                      }
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CONNECTION_COLORS[c.type] }}
                    />
                    <span className="text-sm text-white/70 flex-1">
                      {source?.name || c.from}
                    </span>
                    <span className="text-xs text-white/25">
                      {c.type.replace(/_/g, ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {children.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-1.5">Influenced:</p>
              {children.map((c) => {
                const target = getTraditionById(c.to);
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (target) {
                        pushJourney({ type: 'tradition', id: t.id, name: t.name });
                        setSelectedTradition(target);
                      }
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CONNECTION_COLORS[c.type] }}
                    />
                    <span className="text-sm text-white/70 flex-1">
                      {target?.name || c.to}
                    </span>
                    <span className="text-xs text-white/25">
                      {c.type.replace(/_/g, ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Evidence */}
        {t.evidence && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
              Historical Evidence
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">{t.evidence}</p>
          </section>
        )}

        {/* Bottom spacer for mobile safe area */}
        <div className="h-8 sm:h-0" />
      </div>
    </div>
  );
}
