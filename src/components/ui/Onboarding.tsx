'use client';

import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded bg-white/10 border border-white/20 text-[11px] font-mono text-white/70 shadow-[0_1px_0_rgba(255,255,255,0.1)]">
      {children}
    </kbd>
  );
}

export default function Onboarding() {
  const showOnboarding = useStore((s) => s.showOnboarding);
  const setShowOnboarding = useStore((s) => s.setShowOnboarding);
  const [dismissed, setDismissed] = useState(false);

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    if (!showOnboarding) return;
    const timer = setTimeout(() => {
      setDismissed(true);
      setTimeout(() => setShowOnboarding(false), 500);
    }, 12000);
    return () => clearTimeout(timer);
  }, [showOnboarding, setShowOnboarding]);

  // Listen for ? key to toggle hints
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' || e.key === '/') {
        if (e.target instanceof HTMLInputElement) return;
        setShowOnboarding(!showOnboarding);
        setDismissed(false);
      }
      // Escape to dismiss
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
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500 ${
        dismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative bg-gray-950/90 border border-white/10 rounded-2xl p-8 max-w-lg mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
          PANTHEON
        </h2>
        <p className="text-sm text-white/40 mb-6">
          Navigate the cultural evolution of world religion
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
              Navigate
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <div className="flex gap-0.5">
                  <Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key>
                </div>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="flex gap-0.5">
                  <Key>Q</Key><Key>E</Key>
                </div>
                <span>Up / Down</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Key>Shift</Key>
                <span>Sprint</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Key>Scroll</Key>
                <span>Zoom</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-[11px] text-white/30">Drag</span>
                <span>Orbit</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
              Explore
            </h3>
            <div className="space-y-2 text-sm text-white/60">
              <p>Click a <span className="text-amber-300/70">tradition</span> to inspect</p>
              <p>Toggle <span className="text-amber-300/70">✧ Figures</span> to see shared figures</p>
              <p>Click a figure to trace connections across religions</p>
              <p>Follow <span className="text-blue-300/70">fly to →</span> links to walk the graph</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/20">
            Press <Key>?</Key> to toggle hints
          </p>
          <button
            onClick={dismiss}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm text-white/70 hover:text-white transition-all"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
