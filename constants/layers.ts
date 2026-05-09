import { LayerId } from '../services/types';

export interface LayerConfig {
  id: LayerId;
  label: string;
  unit: string;
  color: string;
  source: string;
}

export const LAYERS: Record<LayerId, LayerConfig> = {
  methane: {
    id: 'methane',
    label: 'Methane',
    unit: 'ppb',
    color: '#EF9F27',
    source: 'ESA Copernicus Sentinel-5P',
  },
  no2: {
    id: 'no2',
    label: 'Nitrogen Dioxide',
    unit: 'µg/m³',
    color: '#7F77DD',
    source: 'Open-Meteo',
  },
  pm25: {
    id: 'pm25',
    label: 'PM2.5',
    unit: 'µg/m³',
    color: '#1D9E75',
    source: 'Open-Meteo',
  },
  co: {
    id: 'co',
    label: 'Carbon Monoxide',
    unit: 'ppm',
    color: '#D85A30',
    source: 'Open-Meteo',
  },
  wildfire: {
    id: 'wildfire',
    label: 'Wildfire',
    unit: 'MW',
    color: '#E24B4A',
    source: 'NASA FIRMS',
  },
};
