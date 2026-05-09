import { Text, View } from 'react-native';
import { THEME } from '../../constants/theme';
import type { Urgency } from '../../services/types';

const URGENCY_COLORS: Record<Urgency, string> = {
  Safe: THEME.colors.severity.safe,
  Caution: THEME.colors.severity.caution,
  Avoid: THEME.colors.severity.avoid,
};

interface SeverityBadgeProps {
  urgency: Urgency;
}

export function SeverityBadge({ urgency }: SeverityBadgeProps) {
  const color = URGENCY_COLORS[urgency];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: `${color}20`,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color }}>
        {urgency}
      </Text>
    </View>
  );
}
