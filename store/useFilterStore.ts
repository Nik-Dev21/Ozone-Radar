import { create } from 'zustand';
import type { LayerId } from '../services/types';

interface FilterState {
  activeLayers: Set<LayerId>;
  toggleLayer: (id: LayerId) => void;
  isActive: (id: LayerId) => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  activeLayers: new Set<LayerId>(['methane', 'wildfire', 'pm25']),

  toggleLayer: (id) =>
    set((state) => {
      const next = new Set(state.activeLayers);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { activeLayers: next };
    }),

  isActive: (id) => get().activeLayers.has(id),
}));
