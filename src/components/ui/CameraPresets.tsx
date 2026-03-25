'use client';

import { useStore } from '@/lib/store';
import { useState } from 'react';

const PRESETS = [
  { id: 'overview', label: 'Overview' },
  { id: 'abrahamic', label: 'Abrahamic' },
  { id: 'indoEuropean', label: 'Indo-European' },
  { id: 'eastAsian', label: 'East Asian' },
  { id: 'axialAge', label: 'Axial Age' },
];

export default function CameraPresets() {
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedTradition(null);
    setCameraPreset(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
          open
            ? 'bg-white/10 border border-white/20 text-white/90'
            : 'panel-glass-lighter text-white/60 hover:text-white/90'
        }`}
      >
        <span className="hidden sm:inline">Camera</span>
        <span className="sm:hidden">📷</span>
        <span className="ml-1 text-white/30">▾</span>
      </button>

      {open && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 panel-glass rounded-xl py-1.5 z-50 shadow-2xl">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset.id)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
