import { Text, View } from 'react-native';
import '../app/global.css';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0d1117', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#e6edf3', fontSize: 24, fontWeight: 'bold' }}>OzoneRadar</Text>
      <Text style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: 8 }}>Scaffolding Complete.</Text>
    </View>
  );
}
