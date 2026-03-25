'use client';

import { useStore } from '@/lib/store';

const PRESETS = [
  { id: 'overview', label: 'Overview', icon: '🌐' },
  { id: 'abrahamic', label: 'Abrahamic', icon: '☪' },
  { id: 'indoEuropean', label: 'Indo-European', icon: '⚡' },
  { id: 'eastAsian', label: 'East Asian', icon: '☯' },
  { id: 'axialAge', label: 'Axial Age', icon: '🔮' },
];

export default function CameraPresets() {
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);

  return (
    <div className="flex gap-1.5">
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => {
            setSelectedTradition(null);
            setCameraPreset(preset.id);
          }}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white transition-all"
          title={preset.label}
        >
          <span className="mr-1">{preset.icon}</span>
          {preset.label}
        </button>
      ))}
    </div>
  );
}
