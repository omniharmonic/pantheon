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
    <div className="fixed inset-x-0 bottom-0 h-[70vh] sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:h-full sm:w-[440px] sm:max-w-[90vw] panel-glass rounded-t-3xl sm:rounded-none overflow-y-auto z-[100] animate-slide-in">
      {/* Drag handle (mobile) */}
      <div className="sm:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/15" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-[rgba(5,5,16,0.96)] backdrop-blur-xl border-b border-white/[0.06] px-6 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] text-white/40 uppercase tracking-[0.1em]">
                {(t.theologicalType || []).join(' · ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-white/90 leading-tight tracking-wide">{t.name}</h2>
          </div>
          <button
            onClick={() => setSelectedTradition(null)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white/30 hover:text-white/80 hover:bg-white/[0.06] transition-all text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 mt-3 text-sm text-white/40">
          <span>
            {t.originDateLabel || formatDate(t.originDate)}
            {t.endDate ? ` — ${formatDate(t.endDate)}` : ' — present'}
          </span>
        </div>
        <div className="text-sm text-white/30 mt-1">{t.geographicOrigin}</div>
        <div className="mt-3">
          <span
            className={`text-[11px] px-3 py-1.5 rounded-full font-medium tracking-wide ${
              t.status === 'active'
                ? 'bg-green-500/10 text-green-300/80'
                : t.status === 'active_minority'
                ? 'bg-yellow-500/10 text-yellow-300/80'
                : (t.status || '').includes('revived')
                ? 'bg-purple-500/10 text-purple-300/80'
                : 'bg-white/[0.04] text-white/35'
            }`}
          >
            {(t.status || '').replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="px-6 sm:px-7 py-6 space-y-8">
        {/* Key Concepts */}
        <section>
          <h3 className="section-label">Key Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {(t.keyConcepts || []).map((concept, i) => (
              <span
                key={i}
                className="text-[13px] bg-white/[0.04] text-white/55 px-3 py-1.5 rounded-xl border border-white/[0.04]"
              >
                {concept}
              </span>
            ))}
          </div>
        </section>

        {/* Key Figures */}
        {(t.keyFigures || []).length > 0 && (
          <section>
            <h3 className="section-label">Key Figures ({t.keyFigures.length})</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {t.keyFigures.map((figure, i) => (
                <DeityCard key={i} figure={figure} />
              ))}
            </div>
          </section>
        )}

        {/* Branches */}
        {t.majorBranches && t.majorBranches.length > 0 && (
          <section>
            <h3 className="section-label">Major Branches</h3>
            <div className="space-y-2.5">
              {t.majorBranches.map((branch, i) => (
                <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/80">{branch.name}</span>
                    {branch.originDate && (
                      <span className="text-xs text-white/30">{formatDate(branch.originDate)}</span>
                    )}
                  </div>
                  <p className="text-sm text-white/40 mt-1.5 leading-relaxed">{branch.description}</p>
                  {branch.regions && (
                    <p className="text-xs text-white/20 mt-1.5">{branch.regions.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {t.majorSects && t.majorSects.length > 0 && (
          <section>
            <h3 className="section-label">Major Sects</h3>
            <div className="space-y-2.5">
              {t.majorSects.map((sect, i) => (
                <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <span className="text-sm font-medium text-white/80">{sect.name}</span>
                  {(sect.description || sect.focus) && (
                    <p className="text-sm text-white/40 mt-1.5 leading-relaxed">{sect.description || sect.focus}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connections */}
        <section>
          <h3 className="section-label">Connections ({connections.length})</h3>

          {parents.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] text-white/25 mb-2 tracking-wide">Influenced by</p>
              <div className="space-y-1">
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
                      className="flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: CONNECTION_COLORS[c.type] }}
                      />
                      <span className="text-sm text-white/55 group-hover:text-white/80 flex-1 transition-colors">
                        {source?.name || c.from}
                      </span>
                      <span className="text-[11px] text-white/20">
                        {c.type.replace(/_/g, ' ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {children.length > 0 && (
            <div>
              <p className="text-[11px] text-white/25 mb-2 tracking-wide">Influenced</p>
              <div className="space-y-1">
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
                      className="flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: CONNECTION_COLORS[c.type] }}
                      />
                      <span className="text-sm text-white/55 group-hover:text-white/80 flex-1 transition-colors">
                        {target?.name || c.to}
                      </span>
                      <span className="text-[11px] text-white/20">
                        {c.type.replace(/_/g, ' ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Evidence */}
        {t.evidence && (
          <section>
            <h3 className="section-label">Historical Evidence</h3>
            <p className="text-sm text-white/40 leading-relaxed">{t.evidence}</p>
          </section>
        )}

        {/* Bottom spacer */}
        <div className="h-10 sm:h-4" />
      </div>
    </div>
  );
}
