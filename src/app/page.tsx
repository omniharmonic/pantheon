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
        <h1 className="text-3xl sm:text-5xl font-extralight text-white/80 tracking-[0.25em] uppercase mb-3">
          Pantheon
        </h1>
        <p className="text-sm sm:text-base text-white/25 font-light tracking-wide">
          Mapping the cultural evolution of religion
        </p>
        <div className="w-32 h-px bg-white/10 rounded-full overflow-hidden mx-auto mt-8">
          <div className="h-full bg-white/30 rounded-full animate-pulse w-1/3" />
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
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-start justify-between p-5 sm:p-6 gap-4">

          {/* Left: Wordmark + nav pills */}
          <div className="flex flex-col gap-3 sm:gap-4 pointer-events-auto">
            {/* Wordmark */}
            <div>
              <h1 className="text-lg sm:text-xl font-extralight text-white/70 tracking-[0.2em] uppercase leading-none">
                Pantheon
              </h1>
              <p className="text-[10px] sm:text-[11px] text-white/40 tracking-[0.08em] mt-1 font-light">
                Religious History Explorer
              </p>
            </div>

            {/* Nav pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`pill-btn ${showFilters ? 'active !border-blue-400/25 !text-blue-300' : ''}`}
              >
                Filters
              </button>
              <button
                onClick={() => setShowFigureLayer(!showFigureLayer)}
                className={`pill-btn ${showFigureLayer ? 'active !border-amber-400/25 !text-amber-300' : ''}`}
              >
                {showFigureLayer ? '✦' : '✧'} Figures
              </button>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className={`pill-btn ${showLegend ? 'active' : ''}`}
              >
                Legend
              </button>
              <button
                onClick={() => setShowOnboarding(true)}
                className="pill-btn !px-3 text-white/25"
                title="Keyboard shortcuts (press ?)"
              >
                ?
              </button>
            </div>
          </div>

          {/* Right: Search + Camera */}
          <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center gap-3 pointer-events-auto">
            <CameraPresets />
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <FilterControls />

      {/* Legend */}
      {showLegend && <Legend onClose={() => setShowLegend(false)} />}

      {/* Info panel */}
      <InfoPanel />

      {/* Figure detail */}
      <FigureDetail />

      {/* Journey breadcrumbs */}
      <JourneyBreadcrumbs />

      {/* Timeline */}
      <TimeSlider />

      {/* Onboarding */}
      <Onboarding />

      {/* WASD hint — desktop only */}
      <div className="hidden sm:block fixed bottom-4 left-5 z-30 pointer-events-none">
        <p className="text-[11px] text-white/10 tracking-wider font-light">
          WASD move · QE up/down · ? help
        </p>
      </div>
    </main>
  );
}
