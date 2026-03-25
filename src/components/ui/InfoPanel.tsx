'use client';

import { useStore } from '@/lib/store';
import { getConnectionsForTradition, getTraditionById } from '@/lib/data';
import { getTheologyColor, CONNECTION_COLORS } from '@/lib/colors';
import DeityCard from './DeityCard';

export default function InfoPanel() {
  const selectedTradition = useStore((s) => s.selectedTradition);
  const showInfoPanel = useStore((s) => s.showInfoPanel);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);

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
    <div className="fixed right-0 top-0 h-full w-[420px] max-w-[90vw] bg-gray-950/90 backdrop-blur-xl border-l border-white/10 overflow-y-auto z-[100]">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm border-b border-white/10 p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-white/50 uppercase tracking-wider">
                {t.theologicalType.join(' · ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{t.name}</h2>
          </div>
          <button
            onClick={() => setSelectedTradition(null)}
            className="text-white/40 hover:text-white text-xl p-1"
          >
            ×
          </button>
        </div>

        <div className="flex gap-4 mt-3 text-xs text-white/50">
          <span>
            {t.originDateLabel || formatDate(t.originDate)}
            {t.endDate ? ` — ${formatDate(t.endDate)}` : ' — present'}
          </span>
        </div>
        <div className="text-xs text-white/40 mt-1">{t.geographicOrigin}</div>
        <div className="mt-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              t.status === 'active'
                ? 'bg-green-500/20 text-green-300'
                : t.status === 'active_minority'
                ? 'bg-yellow-500/20 text-yellow-300'
                : t.status.includes('revived')
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/10 text-white/40'
            }`}
          >
            {t.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Key Concepts */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            Key Concepts
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {t.keyConcepts.map((concept, i) => (
              <span
                key={i}
                className="text-xs bg-white/5 text-white/70 px-2 py-1 rounded"
              >
                {concept}
              </span>
            ))}
          </div>
        </section>

        {/* Key Figures */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            Key Figures ({t.keyFigures.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {t.keyFigures.map((figure, i) => (
              <DeityCard key={i} figure={figure} />
            ))}
          </div>
        </section>

        {/* Major Branches/Sects */}
        {t.majorBranches && t.majorBranches.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Major Branches
            </h3>
            {t.majorBranches.map((branch, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{branch.name}</span>
                  {branch.originDate && (
                    <span className="text-xs text-white/40">
                      {formatDate(branch.originDate)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">{branch.description}</p>
                {branch.regions && (
                  <p className="text-xs text-white/30 mt-1">
                    {branch.regions.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {t.majorSects && t.majorSects.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Major Sects
            </h3>
            {t.majorSects.map((sect, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-3 mb-2">
                <span className="text-sm font-medium text-white">{sect.name}</span>
                {(sect.description || sect.focus) && (
                  <p className="text-xs text-white/50 mt-1">
                    {sect.description || sect.focus}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Connections */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            Connections ({connections.length})
          </h3>

          {parents.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-white/30 mb-1">Influenced by / Descended from:</p>
              {parents.map((c) => {
                const source = getTraditionById(c.from);
                return (
                  <button
                    key={c.id}
                    onClick={() => source && setSelectedTradition(source)}
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: CONNECTION_COLORS[c.type] }}
                    />
                    <span className="text-sm text-white/70">
                      {source?.name || c.from}
                    </span>
                    <span className="text-xs text-white/30 ml-auto">
                      {c.type.replace(/_/g, ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {children.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-1">Influenced / Gave rise to:</p>
              {children.map((c) => {
                const target = getTraditionById(c.to);
                return (
                  <button
                    key={c.id}
                    onClick={() => target && setSelectedTradition(target)}
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: CONNECTION_COLORS[c.type] }}
                    />
                    <span className="text-sm text-white/70">
                      {target?.name || c.to}
                    </span>
                    <span className="text-xs text-white/30 ml-auto">
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
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Historical Evidence
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">{t.evidence}</p>
          </section>
        )}
      </div>
    </div>
  );
}
