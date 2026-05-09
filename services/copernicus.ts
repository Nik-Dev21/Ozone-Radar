import type { PollutionPoint, Severity } from './types';

const TOKEN_URL = process.env.EXPO_PUBLIC_COPERNICUS_TOKEN_URL ?? '';
const CLIENT_ID = process.env.EXPO_PUBLIC_COPERNICUS_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_COPERNICUS_CLIENT_SECRET ?? '';
const BASE_URL = process.env.EXPO_PUBLIC_COPERNICUS_BASE_URL ?? '';

// ---------------------------------------------------------------------------
// In-memory OAuth token cache
// The Copernicus access token expires every ~600 seconds (10 min).
// We cache it and refresh when within 60 s of expiry.
// ---------------------------------------------------------------------------

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Copernicus token request failed: ${res.status}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = json.access_token;
  tokenExpiresAt = now + json.expires_in * 1000;

  return cachedToken;
}

// ---------------------------------------------------------------------------
// Severity thresholds for methane (ppb)
// ---------------------------------------------------------------------------

function methaneToSeverity(value: number): Severity {
  if (value > 1900) return 'high';
  if (value > 1850) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Fetch methane data via Sentinel Hub Statistical API
// Returns a single representative PollutionPoint for the bounding box around
// the given lat/lon.
// ---------------------------------------------------------------------------

export async function fetchMethaneData(
  lat: number,
  lon: number,
): Promise<PollutionPoint[]> {
  try {
    const token = await getAccessToken();

    // Build a ~0.5 degree bounding box around the user's location
    const delta = 0.25;
    const bbox = [lon - delta, lat - delta, lon + delta, lat + delta];

    const now = new Date();
    const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const toDate = now;

    const payload = {
      input: {
        bounds: {
          bbox,
          properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' },
        },
        data: [
          {
            dataFilter: {
              timeRange: {
                from: from.toISOString(),
                to: toDate.toISOString(),
              },
            },
            type: 'S5PL2',
          },
        ],
      },
      aggregation: {
        timeRange: {
          from: from.toISOString(),
          to: toDate.toISOString(),
        },
        aggregationInterval: { of: 'P7D' },
        evalscript: `
//VERSION=3
function setup() {
  return {
    input: [{ bands: ["CH4"], units: "DN" }],
    output: [{ id: "default", bands: 1, sampleType: "FLOAT32" }],
  };
}
function evaluatePixel(samples) {
  return [samples.CH4];
}
        `.trim(),
        resx: 0.1,
        resy: 0.1,
      },
    };

    const res = await fetch(`${BASE_URL}/api/v1/statistics`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Copernicus statistics API error: ${res.status}`);
    }

    const data = (await res.json()) as {
      data: Array<{
        outputs: {
          default: {
            bands: {
              B0: { stats: { mean: number; median: number } };
            };
          };
        };
      }>;
    };

    if (!data.data?.length) return [];

    const stats = data.data[0]?.outputs?.default?.bands?.B0?.stats;
    if (!stats) return [];

    const value = Math.round(stats.median);
    if (value <= 0) return [];

    const point: PollutionPoint = {
      id: `methane-${lat.toFixed(2)}-${lon.toFixed(2)}`,
      layerId: 'methane',
      lat,
      lon,
      value,
      unit: 'ppb',
      timestamp: now.toISOString(),
      severity: methaneToSeverity(value),
    };

    return [point];
  } catch {
    // One failing service should never crash the map
    return [];
  }
}
