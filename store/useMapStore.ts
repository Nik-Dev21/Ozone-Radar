import { create } from 'zustand';
import type { PollutionPoint } from '../services/types';

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapState {
  selectedPoint: PollutionPoint | null;
  region: MapRegion;
  setSelectedPoint: (point: PollutionPoint | null) => void;
  setRegion: (region: MapRegion) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPoint: null,

  region: {
    latitude: 43.7,
    longitude: -79.42,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },

  setSelectedPoint: (point) => set({ selectedPoint: point }),

  setRegion: (region) => set({ region }),
}));
