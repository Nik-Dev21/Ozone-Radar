import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { LAYERS } from '../../constants/layers';
import { useReports } from '../../hooks/useReports';
import { ReportForm } from '../../components/ui/ReportForm';
import { LoadingPulse } from '../../components/ui/LoadingPulse';
import type { CitizenReport } from '../../services/types';

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ReportRow({ item }: { item: CitizenReport }) {
  const layer = LAYERS[item.layerId];
  const severityColor =
    item.severity === 'high'
      ? THEME.colors.severity.avoid
      : item.severity === 'medium'
        ? THEME.colors.severity.caution
        : THEME.colors.severity.safe;

  return (
    <View
      style={{
        backgroundColor: THEME.colors.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Layer badge */}
        <View
          style={{
            backgroundColor: `${layer.color}20`,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: layer.color }}>
            {layer.label}
          </Text>
        </View>

        {/* Severity + time */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: severityColor,
            }}
          />
          <Text style={{ fontSize: 12, color: THEME.colors.textMuted }}>
            {relativeTime(item.timestamp)}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, lineHeight: 20, color: THEME.colors.textPrimary }}>
        {item.description}
      </Text>
    </View>
  );
}

export default function ReportsScreen() {
  const { data: reports, isLoading } = useReports();
  const [formVisible, setFormVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: THEME.colors.textPrimary }}>
          Community Reports
        </Text>
        <Text style={{ fontSize: 14, color: THEME.colors.textMuted, marginTop: 4 }}>
          Citizen-submitted pollution observations
        </Text>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={{ padding: 20, gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingPulse key={i} height={80} />
          ))}
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id ?? item.timestamp}
          renderItem={({ item }) => <ReportRow item={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="document-text-outline" size={48} color="rgba(255,255,255,0.2)" />
              <Text style={{ color: THEME.colors.textMuted, marginTop: 12, fontSize: 15 }}>
                No reports yet. Be the first!
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => setFormVisible(true)}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: THEME.colors.severity.safe,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {/* Report form modal */}
      <Modal visible={formVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: THEME.colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 40,
            }}
          >
            {/* Close button */}
            <Pressable
              onPress={() => setFormVisible(false)}
              style={{ alignSelf: 'flex-end', padding: 16 }}
            >
              <Ionicons name="close" size={24} color={THEME.colors.textMuted} />
            </Pressable>

            <ReportForm onSuccess={() => setFormVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
