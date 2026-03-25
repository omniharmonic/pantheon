'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import InfoPanel from '@/components/ui/InfoPanel';
import SearchBar from '@/components/ui/SearchBar';
import FilterControls from '@/components/ui/FilterControls';
import TimeSlider from '@/components/ui/TimeSlider';
import Legend from '@/components/ui/Legend';
import CameraPresets from '@/components/ui/CameraPresets';
import FigureDetail from '@/components/ui/FigureDetail';
import { useStore } from '@/lib/store';

// Dynamic import for Three.js scene (no SSR)
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#050510] flex items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white/90 tracking-tight mb-2">
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

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 pointer-events-auto">
            <div>
              <h1 className="text-lg font-bold text-white/90 tracking-tight">
                PANTHEON
              </h1>
              <p className="text-[10px] text-white/30 -mt-0.5">
                3D Religious History Explorer
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                showFilters
                  ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
              }`}
            >
              Filters
            </button>
            <button
              onClick={() => setShowFigureLayer(!showFigureLayer)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                showFigureLayer
                  ? 'bg-amber-500/20 border-amber-400/30 text-amber-300'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
              }`}
            >
              {showFigureLayer ? '✦ Figures On' : '✧ Figures'}
            </button>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <CameraPresets />
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <FilterControls />

      {/* Info panel (right side) */}
      <InfoPanel />

      {/* Figure detail panel (overlays info panel when a figure is selected) */}
      <FigureDetail />

      {/* Timeline slider (bottom center) */}
      <TimeSlider />

      {/* Legend (bottom right) */}
      <Legend />
    </main>
  );
}
