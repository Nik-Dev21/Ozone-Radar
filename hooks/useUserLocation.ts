import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface UserLocation {
  latitude: number;
  longitude: number;
}

const TORONTO: UserLocation = { latitude: 43.7, longitude: -79.42 };

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>(TORONTO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!cancelled) {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      } catch {
        // Silently fall back to Toronto
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  return { location, loading };
}
