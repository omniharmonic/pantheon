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
        className={`pill-btn ${open ? 'active' : ''}`}
      >
        <span className="hidden sm:inline">Camera</span>
        <span className="sm:hidden">📷</span>
        <span className="text-white/20 ml-0.5">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 panel-glass rounded-2xl py-2 z-50 shadow-2xl animate-slide-up">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset.id)}
                className="w-full text-left px-5 py-3 text-[13px] text-white/50 hover:text-white/85 hover:bg-white/[0.05] transition-colors tracking-wide"
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
