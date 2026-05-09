const OWM_KEY = process.env.EXPO_PUBLIC_OWM_API_KEY ?? '';

// ---------------------------------------------------------------------------
// OpenWeatherMap Air Quality Forecast
// Returns a summary of the forecast trend (improving, stable, or worsening)
// and the AQI values for the next few days.
// ---------------------------------------------------------------------------

export interface AQForecastEntry {
  dt: number;
  aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
}

export interface AQForecast {
  current: number;
  trend: 'improving' | 'stable' | 'worsening';
  entries: AQForecastEntry[];
  message: string;
}

const AQI_LABELS: Record<number, string> = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very Poor',
};

export async function fetchAQForecast(
  lat: number,
  lon: number,
): Promise<AQForecast | null> {
  try {
    const url =
      `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OpenWeatherMap AQ forecast error: ${res.status}`);
    }

    const data = (await res.json()) as {
      list: Array<{
        dt: number;
        main: { aqi: number };
      }>;
    };

    if (!data.list?.length) return null;

    // Sample one entry per ~24 h to get daily snapshots (entries are hourly)
    const dailyEntries: AQForecastEntry[] = [];
    const startDt = data.list[0].dt;

    for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
      const targetDt = startDt + dayOffset * 86400;
      // Find closest entry to target
      const closest = data.list.reduce((best, entry) =>
        Math.abs(entry.dt - targetDt) < Math.abs(best.dt - targetDt) ? entry : best,
      );
      dailyEntries.push({ dt: closest.dt, aqi: closest.main.aqi });
    }

    const current = dailyEntries[0].aqi;
    const future = dailyEntries[dailyEntries.length - 1].aqi;

    let trend: AQForecast['trend'];
    if (future > current) {
      trend = 'worsening';
    } else if (future < current) {
      trend = 'improving';
    } else {
      trend = 'stable';
    }

    const currentLabel = AQI_LABELS[current] ?? 'Unknown';
    const futureLabel = AQI_LABELS[future] ?? 'Unknown';

    let message: string;
    if (trend === 'worsening') {
      message = `Air quality expected to worsen from ${currentLabel} to ${futureLabel} over the next few days.`;
    } else if (trend === 'improving') {
      message = `Air quality expected to improve from ${currentLabel} to ${futureLabel} over the next few days.`;
    } else {
      message = `Air quality expected to remain ${currentLabel} over the next few days.`;
    }

    return { current, trend, entries: dailyEntries, message };
  } catch {
    return null;
  }
}
