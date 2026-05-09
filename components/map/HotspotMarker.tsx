import { memo } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { LAYERS } from '../../constants/layers';
import type { PollutionPoint } from '../../services/types';

interface HotspotMarkerProps {
  point: PollutionPoint;
  onPress: (point: PollutionPoint) => void;
}

const SIZE_MAP = {
  high: { outer: 36, inner: 18 },
  medium: { outer: 28, inner: 14 },
  low: { outer: 20, inner: 10 },
} as const;

function HotspotMarkerInner({ point, onPress }: HotspotMarkerProps) {
  const color = LAYERS[point.layerId].color;
  const sizes = SIZE_MAP[point.severity];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(point);
  };

  return (
    <Marker
      coordinate={{ latitude: point.lat, longitude: point.lon }}
      onPress={handlePress}
      tracksViewChanges={false}
    >
      <View
        style={{
          width: sizes.outer,
          height: sizes.outer,
          borderRadius: sizes.outer / 2,
          backgroundColor: `${color}30`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: sizes.inner,
            height: sizes.inner,
            borderRadius: sizes.inner / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </Marker>
  );
}

export const HotspotMarker = memo(HotspotMarkerInner);
