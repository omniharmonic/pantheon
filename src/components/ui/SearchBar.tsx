'use client';

import { useStore } from '@/lib/store';

export default function SearchBar() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search traditions, deities, concepts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-72 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all backdrop-blur-sm"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm"
        >
          ×
        </button>
      )}
    </div>
  );
}
