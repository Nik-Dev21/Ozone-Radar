import { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LAYERS } from '../../constants/layers';
import { THEME } from '../../constants/theme';
import { useMapStore } from '../../store/useMapStore';
import { useAIExplanation } from '../../hooks/useAIExplanation';
import { SeverityBadge } from './SeverityBadge';
import { LoadingPulse } from './LoadingPulse';

export function DetailSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const selectedPoint = useMapStore((s) => s.selectedPoint);
  const setSelectedPoint = useMapStore((s) => s.setSelectedPoint);
  const { mutate, data: briefing, isPending, reset } = useAIExplanation();

  // Open sheet and trigger AI call when a point is selected
  useEffect(() => {
    if (selectedPoint) {
      sheetRef.current?.expand();
      mutate(selectedPoint);
    } else {
      sheetRef.current?.close();
      reset();
    }
  }, [selectedPoint, mutate, reset]);

  const handleClose = useCallback(() => {
    setSelectedPoint(null);
  }, [setSelectedPoint]);

  if (!selectedPoint) return null;

  const layer = LAYERS[selectedPoint.layerId];

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={[280, 420]}
      enablePanDownToClose
      onClose={handleClose}
      backgroundStyle={{ backgroundColor: THEME.colors.surface }}
      handleIndicatorStyle={{ backgroundColor: THEME.colors.textMuted }}
    >
      <BottomSheetView style={{ padding: 20, gap: 12 }}>
        {/* Layer name */}
        <Text style={{ fontSize: 14, fontWeight: '600', color: layer.color }}>
          {layer.label}
        </Text>

        {/* Value + unit */}
        <Text style={{ fontSize: 32, fontWeight: '700', color: THEME.colors.textPrimary }}>
          {selectedPoint.value}
          <Text style={{ fontSize: 16, fontWeight: '400', color: THEME.colors.textMuted }}>
            {' '}{selectedPoint.unit}
          </Text>
        </Text>

        {/* Severity badge */}
        {briefing ? (
          <SeverityBadge urgency={briefing.urgency} />
        ) : (
          <SeverityBadge
            urgency={
              selectedPoint.severity === 'high'
                ? 'Avoid'
                : selectedPoint.severity === 'medium'
                  ? 'Caution'
                  : 'Safe'
            }
          />
        )}

        {/* AI briefing or loading state */}
        {isPending ? (
          <View style={{ gap: 8, marginTop: 4 }}>
            <LoadingPulse width="100%" height={14} color={`${layer.color}30`} />
            <LoadingPulse width="85%" height={14} color={`${layer.color}30`} />
            <LoadingPulse width="60%" height={14} color={`${layer.color}30`} />
          </View>
        ) : briefing ? (
          <View style={{ gap: 12, marginTop: 4 }}>
            {/* Explanation */}
            <Text style={{ fontSize: 15, lineHeight: 22, color: THEME.colors.textPrimary }}>
              {briefing.explanation}
            </Text>

            {/* Action card */}
            <View
              style={{
                backgroundColor: `${layer.color}15`,
                borderRadius: 12,
                padding: 14,
                borderLeftWidth: 3,
                borderLeftColor: layer.color,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: layer.color, marginBottom: 4 }}>
                RECOMMENDED ACTION
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: THEME.colors.textPrimary }}>
                {briefing.action}
              </Text>
            </View>
          </View>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}
