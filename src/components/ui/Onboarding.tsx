'use client';

import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] min-h-[28px] h-7 px-2 rounded-lg bg-white/8 border border-white/15 text-xs font-mono text-white/60 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      {children}
    </kbd>
  );
}

export default function Onboarding() {
  const showOnboarding = useStore((s) => s.showOnboarding);
  const setShowOnboarding = useStore((s) => s.setShowOnboarding);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!showOnboarding) return;
    const timer = setTimeout(() => {
      setDismissed(true);
      setTimeout(() => setShowOnboarding(false), 500);
    }, 15000);
    return () => clearTimeout(timer);
  }, [showOnboarding, setShowOnboarding]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' || e.key === '/') {
        if (e.target instanceof HTMLInputElement) return;
        setShowOnboarding(!showOnboarding);
        setDismissed(false);
      }
      if (e.key === 'Escape' && showOnboarding) {
        setDismissed(true);
        setTimeout(() => setShowOnboarding(false), 500);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showOnboarding, setShowOnboarding]);

  if (!showOnboarding) return null;

  const dismiss = () => {
    setDismissed(true);
    setTimeout(() => setShowOnboarding(false), 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end sm:items-center justify-center transition-opacity duration-500 ${
        dismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={dismiss}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative panel-glass rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 w-full sm:max-w-lg sm:mx-4 shadow-2xl safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
          PANTHEON
        </h2>
        <p className="text-sm sm:text-base text-white/40 mb-6">
          Navigate the cultural evolution of world religion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Navigation — desktop only */}
          <div className="hidden sm:block space-y-3">
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-wider">
              Navigate
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <div className="flex gap-1">
                  <Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key>
                </div>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <div className="flex gap-1">
                  <Key>Q</Key><Key>E</Key>
                </div>
                <span>Up / Down</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <Key>⇧</Key>
                <span>Sprint</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <span className="text-xs text-white/25 min-w-[28px] text-center">⊙</span>
                <span>Scroll to zoom · Drag to orbit</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-wider">
              Explore
            </h3>
            <div className="space-y-2.5 text-sm text-white/55">
              <p>Tap a <span className="text-amber-300/70 font-medium">glowing node</span> to see its tradition</p>
              <p>Toggle <span className="text-amber-300/70 font-medium">✧ Figures</span> to reveal shared figures across religions</p>
              <p>Click a figure to see its connections, then <span className="text-blue-300/70 font-medium">fly to →</span> to walk the graph</p>
              <p>Your path is tracked as <span className="text-amber-300/70 font-medium">breadcrumbs</span> — click any to go back</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-white/20 hidden sm:block">
            Press <Key>?</Key> anytime
          </p>
          <button
            onClick={dismiss}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium text-white/80 hover:text-white transition-all"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
