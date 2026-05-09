import { useCallback } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { THEME } from '../../constants/theme';
import { useMapStore } from '../../store/useMapStore';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useMapData } from '../../hooks/useMapData';
import type { PollutionPoint } from '../../services/types';
import { HotspotMarker } from './HotspotMarker';

export function PollutionMap() {
  const { location, loading: locationLoading } = useUserLocation();
  const region = useMapStore((s) => s.region);
  const setRegion = useMapStore((s) => s.setRegion);
  const setSelectedPoint = useMapStore((s) => s.setSelectedPoint);

  const { data: points, isLoading, isError } = useMapData(
    location.latitude,
    location.longitude,
  );

  const handleMarkerPress = useCallback(
    (point: PollutionPoint) => {
      setSelectedPoint(point);
    },
    [setSelectedPoint],
  );

  if (locationLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: THEME.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={THEME.colors.severity.safe} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        mapType={Platform.OS === 'ios' ? 'hybridFlyover' : 'hybrid'}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        }}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsCompass={false}
      >
        {points?.map((point) => (
          <HotspotMarker
            key={point.id}
            point={point}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* Loading overlay */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            alignSelf: 'center',
            backgroundColor: THEME.colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ActivityIndicator size="small" color={THEME.colors.severity.safe} />
          <Text style={{ fontSize: 13, color: THEME.colors.textMuted }}>Loading data...</Text>
        </View>
      )}

      {/* Error overlay */}
      {isError && !isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            alignSelf: 'center',
            backgroundColor: THEME.colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 13, color: THEME.colors.severity.avoid }}>
            Failed to load some data sources
          </Text>
        </View>
      )}
    </View>
  );
}
