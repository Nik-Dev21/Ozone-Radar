import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '../store/useFilterStore';
import { fetchMethaneData } from '../services/copernicus';
import { fetchWildfireData } from '../services/firms';
import { fetchOpenMeteoData } from '../services/openMeteo';
import type { LayerId, PollutionPoint } from '../services/types';

type LayerFetcher = (lat: number, lon: number) => Promise<PollutionPoint[]>;

const FETCHERS: Partial<Record<LayerId, LayerFetcher>> = {
  methane: fetchMethaneData,
  wildfire: fetchWildfireData,
  // pm25, no2, co are all served by Open-Meteo in a single call
};

/**
 * Fetches pollution data for all active layers in parallel.
 * Uses Promise.allSettled so one failing source never blocks the others.
 * Refetches every 5 minutes. Only enabled when lat/lon are non-zero.
 */
export function useMapData(lat: number, lon: number) {
  const activeLayers = useFilterStore((s) => s.activeLayers);

  // Stable query key: rounded coords + sorted layer list
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLon = Math.round(lon * 100) / 100;
  const layerKey = [...activeLayers].sort().join(',');

  return useQuery<PollutionPoint[]>({
    queryKey: ['mapData', roundedLat, roundedLon, layerKey],
    queryFn: async () => {
      const tasks: Promise<PollutionPoint[]>[] = [];

      // Open-Meteo covers pm25, no2, and co in one call
      const needsOpenMeteo =
        activeLayers.has('pm25') ||
        activeLayers.has('no2') ||
        activeLayers.has('co');

      if (needsOpenMeteo) {
        tasks.push(fetchOpenMeteoData(lat, lon));
      }

      // Individual fetchers for methane and wildfire
      for (const [layerId, fetcher] of Object.entries(FETCHERS)) {
        if (activeLayers.has(layerId as LayerId)) {
          tasks.push(fetcher(lat, lon));
        }
      }

      const results = await Promise.allSettled(tasks);

      const points: PollutionPoint[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          points.push(...result.value);
        }
      }

      // Filter to only active layers (Open-Meteo returns all 3 pollutants)
      return points.filter((p) => activeLayers.has(p.layerId));
    },
    enabled: lat !== 0 && lon !== 0,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 4 * 60 * 1000,
  });
}
