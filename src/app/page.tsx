'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import InfoPanel from '@/components/ui/InfoPanel';
import SearchBar from '@/components/ui/SearchBar';
import FilterControls from '@/components/ui/FilterControls';
import TimeSlider from '@/components/ui/TimeSlider';
import Legend from '@/components/ui/Legend';
import CameraPresets from '@/components/ui/CameraPresets';
import FigureDetail from '@/components/ui/FigureDetail';
import JourneyBreadcrumbs from '@/components/ui/JourneyBreadcrumbs';
import Onboarding from '@/components/ui/Onboarding';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useStore } from '@/lib/store';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#050510] flex items-center justify-center z-50">
      <div className="text-center px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight mb-2">
          PANTHEON
        </h1>
        <p className="text-sm text-white/30 mb-6">
          Mapping the cultural evolution of religion
        </p>
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-blue-400/50 rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const showFilters = useStore((s) => s.showFilters);
  const setShowFilters = useStore((s) => s.setShowFilters);
  const showFigureLayer = useStore((s) => s.showFigureLayer);
  const setShowFigureLayer = useStore((s) => s.setShowFigureLayer);
  const setShowOnboarding = useStore((s) => s.setShowOnboarding);
  const [showLegend, setShowLegend] = useState(false);

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* 3D Canvas */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
        </Suspense>
      </ErrorBoundary>

      {/* ─── TOP BAR ─── */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none safe-bottom">
        <div className="flex items-start justify-between p-3 sm:p-4 gap-2">
          {/* Left: Logo + toggles */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 pointer-events-auto">
            <h1 className="text-base sm:text-lg font-bold text-white/90 tracking-tight leading-none">
              PANTHEON
            </h1>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                  showFilters
                    ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                    : 'panel-glass-lighter text-white/60 hover:text-white/90'
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setShowFigureLayer(!showFigureLayer)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                  showFigureLayer
                    ? 'bg-amber-500/20 border-amber-400/30 text-amber-300'
                    : 'panel-glass-lighter text-white/60 hover:text-white/90'
                }`}
              >
                {showFigureLayer ? '✦ Figures' : '✧ Figures'}
              </button>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                  showLegend
                    ? 'bg-white/10 border-white/20 text-white/80'
                    : 'panel-glass-lighter text-white/60 hover:text-white/90'
                }`}
              >
                Legend
              </button>
              <button
                onClick={() => setShowOnboarding(true)}
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium panel-glass-lighter text-white/40 hover:text-white/70 transition-all"
                title="Keyboard shortcuts (press ?)"
              >
                ?
              </button>
            </div>
          </div>

          {/* Right: Search + Camera presets */}
          <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center gap-2 sm:gap-3 pointer-events-auto">
            <CameraPresets />
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <FilterControls />

      {/* Legend (toggled, appears below top bar) */}
      {showLegend && <Legend onClose={() => setShowLegend(false)} />}

      {/* Info panel (right side / bottom sheet mobile) */}
      <InfoPanel />

      {/* Figure detail panel */}
      <FigureDetail />

      {/* Journey breadcrumbs */}
      <JourneyBreadcrumbs />

      {/* Timeline slider */}
      <TimeSlider />

      {/* Onboarding overlay */}
      <Onboarding />

      {/* WASD hint — desktop only */}
      <div className="hidden sm:block fixed bottom-3 left-3 z-30 pointer-events-none">
        <p className="text-[11px] text-white/15 font-mono">
          WASD move · QE up/down · ? help
        </p>
      </div>
    </main>
  );
}
