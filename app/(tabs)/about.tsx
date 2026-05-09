import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

interface SourceCardProps {
  name: string;
  description: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function SourceCard({ name, description, url, icon }: SourceCardProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      style={{
        backgroundColor: THEME.colors.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.06)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={THEME.colors.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: THEME.colors.textPrimary }}>
          {name}
        </Text>
        <Text style={{ fontSize: 13, color: THEME.colors.textMuted, marginTop: 2 }}>
          {description}
        </Text>
      </View>
      <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.3)" />
    </Pressable>
  );
}

const DATA_SOURCES: SourceCardProps[] = [
  {
    name: 'ESA Copernicus Sentinel-5P',
    description: 'Methane (CH4) satellite data via Sentinel Hub Statistical API',
    url: 'https://dataspace.copernicus.eu',
    icon: 'planet-outline',
  },
  {
    name: 'NASA FIRMS',
    description: 'Active wildfire hotspots from VIIRS satellite instruments',
    url: 'https://firms.modaps.eosdis.nasa.gov',
    icon: 'flame-outline',
  },
  {
    name: 'Open-Meteo',
    description: 'PM2.5, NO2, and CO air quality data — no API key required',
    url: 'https://open-meteo.com/en/docs/air-quality-api',
    icon: 'cloud-outline',
  },
  {
    name: 'OpenWeatherMap',
    description: '4-day air quality forecast with AQI trend analysis',
    url: 'https://openweathermap.org/api/air-pollution',
    icon: 'partly-sunny-outline',
  },
  {
    name: 'IBM Cloudant',
    description: 'NoSQL database powering citizen pollution reports',
    url: 'https://www.ibm.com/products/cloudant',
    icon: 'server-outline',
  },
];

export default function AboutScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: THEME.colors.textPrimary }}>
          About OzoneRadar
        </Text>
        <Text style={{ fontSize: 14, color: THEME.colors.textMuted, marginTop: 4, lineHeight: 20 }}>
          Real-time environmental pollution monitoring powered by satellite data and citizen science.
        </Text>
      </View>

      {/* Hackathon badge */}
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          backgroundColor: THEME.colors.surface,
          borderRadius: 14,
          padding: 16,
          borderLeftWidth: 3,
          borderLeftColor: THEME.colors.severity.safe,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '600', color: THEME.colors.severity.safe, marginBottom: 4 }}>
          HACKATHON PROJECT
        </Text>
        <Text style={{ fontSize: 14, lineHeight: 20, color: THEME.colors.textPrimary }}>
          Built for the IBM Z x Sheridan Hackathon
        </Text>
        <Text style={{ fontSize: 13, color: THEME.colors.textMuted, marginTop: 4 }}>
          Track: Sustainability  |  UN SDG 13 (Climate Action) + SDG 11 (Sustainable Cities)
        </Text>
      </View>

      {/* Data sources */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: THEME.colors.textPrimary, marginBottom: 12 }}>
          Data Sources
        </Text>
        {DATA_SOURCES.map((source) => (
          <SourceCard key={source.name} {...source} />
        ))}
      </View>

      {/* AI note */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 10,
          backgroundColor: THEME.colors.surface,
          borderRadius: 14,
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: THEME.colors.textPrimary, marginBottom: 4 }}>
          AI Health Briefings
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 20, color: THEME.colors.textMuted }}>
          Tap any hotspot on the map to receive an AI-generated health briefing that translates raw pollution data into plain-language guidance with recommended actions.
        </Text>
      </View>
    </ScrollView>
  );
}
