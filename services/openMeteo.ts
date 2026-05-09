import type { LayerId, PollutionPoint, Severity } from './types';

// ---------------------------------------------------------------------------
// Severity thresholds per pollutant
// ---------------------------------------------------------------------------

function pm25Severity(value: number): Severity {
  if (value > 35) return 'high';
  if (value > 12) return 'medium';
  return 'low';
}

function no2Severity(value: number): Severity {
  if (value > 200) return 'high';
  if (value > 40) return 'medium';
  return 'low';
}

function coSeverity(value: number): Severity {
  if (value > 9) return 'high';
  if (value > 4) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Map Open-Meteo field names to our layer config
// ---------------------------------------------------------------------------

interface PollutantMapping {
  field: string;
  layerId: LayerId;
  unit: string;
  severity: (v: number) => Severity;
}

const POLLUTANTS: PollutantMapping[] = [
  { field: 'pm2_5', layerId: 'pm25', unit: '\u00b5g/m\u00b3', severity: pm25Severity },
  { field: 'nitrogen_dioxide', layerId: 'no2', unit: '\u00b5g/m\u00b3', severity: no2Severity },
  { field: 'carbon_monoxide', layerId: 'co', unit: 'ppm', severity: coSeverity },
];

// ---------------------------------------------------------------------------
// Fetch current-hour air quality from Open-Meteo
// No API key required. Returns one PollutionPoint per pollutant.
// Skips any pollutant where the value is zero or null.
// ---------------------------------------------------------------------------

export async function fetchOpenMeteoData(
  lat: number,
  lon: number,
): Promise<PollutionPoint[]> {
  try {
    const fields = POLLUTANTS.map((p) => p.field).join(',');
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=${fields}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo API error: ${res.status}`);
    }

    const data = (await res.json()) as {
      hourly: {
        time: string[];
        [key: string]: (number | null)[] | string[];
      };
    };

    const times = data.hourly.time as string[];
    if (!times.length) return [];

    // Find the index for the current hour
    const nowHour = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
    let hourIndex = times.findIndex((t) => t.startsWith(nowHour));
    if (hourIndex === -1) {
      // Fallback: use the most recent past hour
      const now = Date.now();
      hourIndex = times.reduce((best, t, i) => {
        const diff = now - new Date(t).getTime();
        if (diff < 0) return best;
        const bestDiff = best === -1 ? Infinity : now - new Date(times[best]).getTime();
        return diff < bestDiff ? i : best;
      }, -1);
    }
    if (hourIndex === -1) hourIndex = 0;

    const timestamp = new Date().toISOString();
    const points: PollutionPoint[] = [];

    for (const mapping of POLLUTANTS) {
      const values = data.hourly[mapping.field] as (number | null)[];
      const value = values?.[hourIndex];

      if (value == null || value === 0) continue;

      points.push({
        id: `${mapping.layerId}-${lat.toFixed(2)}-${lon.toFixed(2)}`,
        layerId: mapping.layerId,
        lat,
        lon,
        value: Math.round(value * 100) / 100,
        unit: mapping.unit,
        timestamp,
        severity: mapping.severity(value),
      });
    }

    return points;
  } catch {
    return [];
  }
}
