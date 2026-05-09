import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LAYERS } from '../../constants/layers';
import { THEME } from '../../constants/theme';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useSaveReport } from '../../hooks/useReports';
import type { LayerId, Severity } from '../../services/types';

const LAYER_IDS = Object.keys(LAYERS) as LayerId[];
const SEVERITIES: Severity[] = ['low', 'medium', 'high'];

interface ReportFormProps {
  onSuccess?: () => void;
}

export function ReportForm({ onSuccess }: ReportFormProps) {
  const [layerId, setLayerId] = useState<LayerId>('pm25');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const { location } = useUserLocation();
  const { mutate, isPending } = useSaveReport();

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Missing info', 'Please add a description.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    mutate(
      {
        layerId,
        severity,
        description: description.trim(),
        lat: location.latitude,
        lon: location.longitude,
        timestamp: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setDescription('');
          Alert.alert('Submitted', 'Your report has been saved.');
          onSuccess?.();
        },
        onError: () => {
          Alert.alert('Error', 'Could not save your report. Please try again.');
        },
      },
    );
  };

  return (
    <View style={{ padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: THEME.colors.textPrimary }}>
        Submit a Report
      </Text>

      {/* Layer picker */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, color: THEME.colors.textMuted }}>Pollution type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {LAYER_IDS.map((id) => {
            const layer = LAYERS[id];
            const selected = id === layerId;
            return (
              <Pressable
                key={id}
                onPress={() => setLayerId(id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: selected ? layer.color : THEME.colors.border,
                  backgroundColor: selected ? `${layer.color}20` : 'transparent',
                }}
              >
                <Text style={{ fontSize: 13, color: selected ? layer.color : THEME.colors.textMuted }}>
                  {layer.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Severity picker */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, color: THEME.colors.textMuted }}>Severity</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {SEVERITIES.map((s) => {
            const selected = s === severity;
            const color =
              s === 'high'
                ? THEME.colors.severity.avoid
                : s === 'medium'
                  ? THEME.colors.severity.caution
                  : THEME.colors.severity.safe;
            return (
              <Pressable
                key={s}
                onPress={() => setSeverity(s)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: selected ? color : THEME.colors.border,
                  backgroundColor: selected ? `${color}20` : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: selected ? color : THEME.colors.textMuted,
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Description */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, color: THEME.colors.textMuted }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What did you observe?"
          placeholderTextColor="rgba(255,255,255,0.3)"
          multiline
          numberOfLines={3}
          style={{
            backgroundColor: THEME.colors.background,
            borderWidth: 1,
            borderColor: THEME.colors.border,
            borderRadius: 12,
            padding: 12,
            color: THEME.colors.textPrimary,
            fontSize: 14,
            minHeight: 80,
            textAlignVertical: 'top',
          }}
        />
      </View>

      {/* Submit */}
      <Pressable
        onPress={handleSubmit}
        disabled={isPending}
        style={{
          backgroundColor: isPending ? THEME.colors.textMuted : THEME.colors.severity.safe,
          borderRadius: 14,
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
          {isPending ? 'Submitting...' : 'Submit Report'}
        </Text>
      </Pressable>
    </View>
  );
}
