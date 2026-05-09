import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

interface FilterChipProps {
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}

export function FilterChip({ label, color, active, onToggle }: FilterChipProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: active ? color : 'rgba(255,255,255,0.15)',
        backgroundColor: active ? `${color}20` : 'rgba(255,255,255,0.05)',
        opacity: active ? 1 : 0.4,
        marginRight: 8,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: active ? color : 'rgba(255,255,255,0.6)',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
