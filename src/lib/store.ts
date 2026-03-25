import { create } from 'zustand';
import type { Tradition, Connection, GraphNode, SharedFigure } from './types';

interface JourneyStep {
  type: 'tradition' | 'figure';
  id: string;
  name: string;
}

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
  showOnboarding: boolean;
  setShowInfoPanel: (show: boolean) => void;
  setShowFilters: (show: boolean) => void;
  setShowOnboarding: (show: boolean) => void;

  // Figure detail
  selectedFigure: SharedFigure | null;
  setSelectedFigure: (f: SharedFigure | null) => void;

  // Figure layer
  showFigureLayer: boolean;
  setShowFigureLayer: (show: boolean) => void;
  hoveredFigure: string | null;
  setHoveredFigure: (id: string | null) => void;

  // Graph walker
  walkerMode: boolean;
  setWalkerMode: (on: boolean) => void;
  walkerTarget: string | null;
  setWalkerTarget: (id: string | null) => void;

  // Journey history (breadcrumb trail)
  journey: JourneyStep[];
  pushJourney: (step: JourneyStep) => void;
  popJourney: () => void;
  clearJourney: () => void;
  jumpToJourney: (index: number) => void;

  // Camera presets
  cameraPreset: string | null;
  setCameraPreset: (preset: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedTradition: null,
  hoveredTradition: null,
  setSelectedTradition: (t) =>
    set((state) => ({
      selectedTradition: t,
      showInfoPanel: t !== null,
      selectedFigure: t ? null : state.selectedFigure,
    })),
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
  showOnboarding: true,
  setShowInfoPanel: (show) => set({ showInfoPanel: show }),
  setShowFilters: (show) => set({ showFilters: show }),
  setShowOnboarding: (show) => set({ showOnboarding: show }),

  selectedFigure: null,
  setSelectedFigure: (f) => {
    // Validate figure object to prevent crashes from stale closures
    if (f && (!f.id || !f.name || !Array.isArray(f.traditions))) {
      console.warn('setSelectedFigure: invalid figure object, ignoring', f);
      return;
    }
    set({
      selectedFigure: f,
      selectedTradition: null,
      showInfoPanel: false,
    });
  },

  showFigureLayer: false,
  setShowFigureLayer: (show) => set({ showFigureLayer: show }),
  hoveredFigure: null,
  setHoveredFigure: (id) => set({ hoveredFigure: id }),

  walkerMode: false,
  setWalkerMode: (on) => set({ walkerMode: on }),
  walkerTarget: null,
  setWalkerTarget: (id) => set({ walkerTarget: id }),

  journey: [],
  pushJourney: (step) =>
    set((state) => {
      // Don't push duplicates
      if (state.journey.length > 0 && state.journey[state.journey.length - 1].id === step.id) {
        return {};
      }
      return { journey: [...state.journey, step].slice(-20) }; // Keep last 20
    }),
  popJourney: () =>
    set((state) => ({
      journey: state.journey.slice(0, -1),
    })),
  clearJourney: () => set({ journey: [] }),
  jumpToJourney: (index) =>
    set((state) => ({
      journey: state.journey.slice(0, index + 1),
    })),

  cameraPreset: null,
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
}));
