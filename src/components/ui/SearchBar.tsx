'use client';

import { useStore } from '@/lib/store';

export default function SearchBar() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search traditions, figures…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-44 sm:w-64 md:w-72 panel-glass-lighter rounded-2xl pl-10 pr-10 py-2.5 text-[13px] text-white/80 placeholder-white/25 focus:outline-none focus:border-white/15 focus:ring-1 focus:ring-white/[0.08] transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl text-white/25 hover:text-white/70 hover:bg-white/[0.06] transition-all text-base"
        >
          ✕
        </button>
      )}
    </div>
  );
}
