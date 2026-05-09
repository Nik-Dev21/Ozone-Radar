import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { THEME } from '../../constants/theme';

interface LoadingPulseProps {
  width?: number | string;
  height?: number;
  color?: string;
}

export function LoadingPulse({
  width = '100%',
  height = 14,
  color = THEME.colors.surface,
}: LoadingPulseProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite
      true, // reverse
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={{ marginVertical: 4 }}>
      <Animated.View
        style={[
          {
            width: width as number,
            height,
            borderRadius: 6,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
