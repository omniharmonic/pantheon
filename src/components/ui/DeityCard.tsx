'use client';

import type { KeyFigure, SharedFigure } from '@/lib/types';
import { useStore } from '@/lib/store';
import { getSharedFigures } from '@/lib/data';
import { useMemo } from 'react';

function findSharedFigure(name: string): SharedFigure | undefined {
  const figures = getSharedFigures();
  const lower = name.toLowerCase().replace(/[/*]/g, '');

  // Direct name match
  let match = figures.find((f) => f.name.toLowerCase() === lower);
  if (match) return match;

  // Check aliases
  match = figures.find((f) =>
    f.aliases.some((a) => a.toLowerCase().includes(lower))
  );
  if (match) return match;

  // Partial match on figure name within keyFigure name (e.g. "Siddhartha Gautama" contains "buddha")
  match = figures.find((f) =>
    lower.includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(lower)
  );
  if (match) return match;

  // Check without parenthetical info: "Ashvins" from "Divine Twins"
  // and strip diacritics for fuzzy match
  const stripped = lower.replace(/[^a-z]/g, '');
  match = figures.find((f) => {
    const fStripped = f.name.toLowerCase().replace(/[^a-z]/g, '');
    return fStripped === stripped;
  });

  return match;
}

const TYPE_BADGES: Record<string, string> = {
  deity: 'bg-amber-500/15 text-amber-400',
  prophet: 'bg-blue-500/15 text-blue-400',
  patriarch: 'bg-emerald-500/15 text-emerald-400',
  sage: 'bg-teal-500/15 text-teal-400',
  hero: 'bg-red-500/15 text-red-400',
  angel: 'bg-sky-500/15 text-sky-400',
  demon: 'bg-purple-500/15 text-purple-400',
  saint: 'bg-yellow-500/15 text-yellow-400',
};

export default function DeityCard({ figure }: { figure: KeyFigure }) {
  const setSelectedFigure = useStore((s) => s.setSelectedFigure);

  const sharedFigure = useMemo(() => findSharedFigure(figure.name), [figure.name]);

  const hasConnections = sharedFigure && sharedFigure.connections.length > 0;
  const crossTradition = sharedFigure && sharedFigure.traditions.length > 1;

  const handleClick = () => {
    if (sharedFigure) {
      setSelectedFigure(sharedFigure);
    }
  };

  const Wrapper = sharedFigure ? 'button' : 'div';

  return (
    <Wrapper
      onClick={sharedFigure ? handleClick : undefined}
      className={`w-full text-left bg-white/5 border border-white/10 rounded-lg p-3 transition-all ${
        sharedFigure
          ? 'hover:bg-white/10 hover:border-white/20 cursor-pointer group'
          : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
          {figure.name}
        </h4>
        <div className="flex items-center gap-1.5">
          {sharedFigure && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${TYPE_BADGES[sharedFigure.type] || 'bg-white/10 text-white/40'}`}>
              {sharedFigure.type}
            </span>
          )}
          {crossTradition && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-medium">
              {sharedFigure!.traditions.length} traditions
            </span>
          )}
          {hasConnections && (
            <span className="text-[10px] text-white/20 group-hover:text-white/50 transition-colors">
              →
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-white/60 mt-1">{figure.role}</p>
      {figure.cognates && (
        <p className="text-xs text-blue-300/50 mt-1">
          <span className="text-white/30">Cognates:</span> {figure.cognates}
        </p>
      )}
      {figure.akkadianEquiv && (
        <p className="text-xs text-amber-300/50 mt-1">
          <span className="text-white/30">Akkadian:</span> {figure.akkadianEquiv}
        </p>
      )}
    </Wrapper>
  );
}
