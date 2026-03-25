import { create } from 'zustand';
import type { Tradition, Connection, GraphNode, SharedFigure } from './types';

interface AppState {
  // Selection
  selectedTradition: Tradition | null;
  hoveredTradition: string | null;
  setSelectedTradition: (t: Tradition | null) => void;
  setHoveredTradition: (id: string | null) => void;

  // Filters
  activeRegions: Set<string>;
  activeTheologyTypes: Set<string>;
  timeRange: [number, number];
  searchQuery: string;
  setActiveRegions: (regions: Set<string>) => void;
  setActiveTheologyTypes: (types: Set<string>) => void;
  setTimeRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  toggleRegion: (region: string) => void;
  toggleTheologyType: (type: string) => void;

  // Graph
  graphNodes: GraphNode[];
  setGraphNodes: (nodes: GraphNode[]) => void;

  // UI state
  showInfoPanel: boolean;
  showFilters: boolean;
  setShowInfoPanel: (show: boolean) => void;
  setShowFilters: (show: boolean) => void;

  // Figure detail
  selectedFigure: SharedFigure | null;
  setSelectedFigure: (f: SharedFigure | null) => void;

  // Figure layer
  showFigureLayer: boolean;
  setShowFigureLayer: (show: boolean) => void;
  hoveredFigure: string | null;
  setHoveredFigure: (id: string | null) => void;

  // Camera presets
  cameraPreset: string | null;
  setCameraPreset: (preset: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedTradition: null,
  hoveredTradition: null,
  setSelectedTradition: (t) => set({ selectedTradition: t, showInfoPanel: t !== null }),
  setHoveredTradition: (id) => set({ hoveredTradition: id }),

  activeRegions: new Set<string>(),
  activeTheologyTypes: new Set<string>(),
  timeRange: [-5000, 2025],
  searchQuery: '',
  setActiveRegions: (regions) => set({ activeRegions: regions }),
  setActiveTheologyTypes: (types) => set({ activeTheologyTypes: types }),
  setTimeRange: (range) => set({ timeRange: range }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleRegion: (region) =>
    set((state) => {
      const next = new Set(state.activeRegions);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return { activeRegions: next };
    }),
  toggleTheologyType: (type) =>
    set((state) => {
      const next = new Set(state.activeTheologyTypes);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return { activeTheologyTypes: next };
    }),

  graphNodes: [],
  setGraphNodes: (nodes) => set({ graphNodes: nodes }),

  showInfoPanel: false,
  showFilters: false,
  setShowInfoPanel: (show) => set({ showInfoPanel: show }),
  setShowFilters: (show) => set({ showFilters: show }),

  selectedFigure: null,
  setSelectedFigure: (f) => set({ selectedFigure: f }),

  showFigureLayer: false,
  setShowFigureLayer: (show) => set({ showFigureLayer: show }),
  hoveredFigure: null,
  setHoveredFigure: (id) => set({ hoveredFigure: id }),

  cameraPreset: null,
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
}));
