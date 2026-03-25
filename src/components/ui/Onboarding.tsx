'use client';

import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[30px] min-h-[30px] h-[30px] px-2.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-xs font-mono text-white/50">
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
      setTimeout(() => setShowOnboarding(false), 600);
    }, 18000);
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
        setTimeout(() => setShowOnboarding(false), 600);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showOnboarding, setShowOnboarding]);

  if (!showOnboarding) return null;

  const dismiss = () => {
    setDismissed(true);
    setTimeout(() => setShowOnboarding(false), 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end sm:items-center justify-center transition-opacity duration-600 ${
        dismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Card */}
      <div
        className="relative panel-glass rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl sm:mx-6 shadow-2xl safe-bottom animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <div className="px-7 pt-6 sm:pt-8 pb-7 sm:pb-8">
          {/* Header */}
          <h2 className="text-2xl sm:text-4xl font-extralight text-white/85 tracking-[0.18em] uppercase mb-2">
            Pantheon
          </h2>
          <p className="text-sm sm:text-base text-white/30 font-light leading-relaxed max-w-md">
            An interactive map of the cultural evolution of world religion
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-white/10 my-6 sm:my-8" />

          {/* Two-column content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Navigate — desktop only */}
            <div className="hidden sm:block space-y-4">
              <h3 className="section-label">Navigate</h3>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <div className="flex gap-1">
                    <Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key>
                  </div>
                  <span>Move</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <div className="flex gap-1">
                    <Key>Q</Key><Key>E</Key>
                  </div>
                  <span>Up / Down</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <Key>⇧</Key>
                  <span>Sprint</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/45">
                  <span className="text-[11px] text-white/20 min-w-[30px] text-center">⊙</span>
                  <span>Scroll to zoom · Drag to orbit</span>
                </div>
              </div>
            </div>

            {/* Explore */}
            <div className="space-y-4">
              <h3 className="section-label">Explore</h3>
              <div className="space-y-3.5 text-sm text-white/45 leading-relaxed">
                <p>Tap a <span className="text-amber-300/60">glowing node</span> to see its tradition</p>
                <p>Toggle <span className="text-amber-300/60">✧ Figures</span> to reveal shared figures across religions</p>
                <p>Click a figure, then <span className="text-blue-300/60">fly to →</span> to walk the graph</p>
                <p>Your path is tracked as <span className="text-white/50">breadcrumbs</span> — click any to go back</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 sm:mt-10">
            <p className="text-[11px] text-white/15 hidden sm:block tracking-wide">
              Press <Key>?</Key> anytime
            </p>
            <button
              onClick={dismiss}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.15] text-sm font-medium text-white/60 hover:text-white/90 transition-all tracking-wide"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
