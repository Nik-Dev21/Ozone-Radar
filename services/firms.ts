import type { PollutionPoint, Severity } from './types';

const FIRMS_KEY = process.env.EXPO_PUBLIC_NASA_FIRMS_MAP_KEY ?? '';

// ---------------------------------------------------------------------------
// Severity based on Fire Radiative Power (MW)
// ---------------------------------------------------------------------------

function frpToSeverity(frp: number): Severity {
  if (frp > 100) return 'high';
  if (frp > 30) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Parse FIRMS CSV into PollutionPoints
// CSV columns vary but always include: latitude, longitude, frp, acq_date, acq_time
// ---------------------------------------------------------------------------

function parseCSV(csv: string): PollutionPoint[] {
  const lines = csv.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const latIdx = headers.indexOf('latitude');
  const lonIdx = headers.indexOf('longitude');
  const frpIdx = headers.indexOf('frp');
  const dateIdx = headers.indexOf('acq_date');
  const timeIdx = headers.indexOf('acq_time');

  if (latIdx === -1 || lonIdx === -1 || frpIdx === -1) return [];

  const points: PollutionPoint[] = [];

  for (let i = 1; i < lines.length && points.length < 50; i++) {
    const cols = lines[i].split(',');
    if (cols.length <= Math.max(latIdx, lonIdx, frpIdx)) continue;

    const lat = parseFloat(cols[latIdx]);
    const lon = parseFloat(cols[lonIdx]);
    const frp = parseFloat(cols[frpIdx]);

    if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(frp)) continue;

    const date = dateIdx !== -1 ? cols[dateIdx] : new Date().toISOString().slice(0, 10);
    const time = timeIdx !== -1 ? cols[timeIdx]?.padStart(4, '0') : '0000';
    const timestamp = `${date}T${time.slice(0, 2)}:${time.slice(2)}:00Z`;

    points.push({
      id: `wildfire-${lat.toFixed(4)}-${lon.toFixed(4)}-${i}`,
      layerId: 'wildfire',
      lat,
      lon,
      value: frp,
      unit: 'MW',
      timestamp,
      severity: frpToSeverity(frp),
    });
  }

  return points;
}

// ---------------------------------------------------------------------------
// Fetch active wildfire hotspots from NASA FIRMS
// Uses VIIRS_SNPP data source, last 24 hours, within ~5 degree box
// Capped at 50 points for map performance.
// ---------------------------------------------------------------------------

export async function fetchWildfireData(
  lat: number,
  lon: number,
): Promise<PollutionPoint[]> {
  try {
    const west = (lon - 5).toFixed(2);
    const south = (lat - 5).toFixed(2);
    const east = (lon + 5).toFixed(2);
    const north = (lat + 5).toFixed(2);

    const url =
      `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_KEY}/VIIRS_SNPP_NRT/${west},${south},${east},${north}/1`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`FIRMS API error: ${res.status}`);
    }

    const csv = await res.text();
    return parseCSV(csv);
  } catch {
    return [];
  }
}
