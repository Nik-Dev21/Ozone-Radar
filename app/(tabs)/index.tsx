import { View } from 'react-native';
import { PollutionMap } from '../../components/map/PollutionMap';
import { FilterBar } from '../../components/ui/FilterBar';
import { DetailSheet } from '../../components/ui/DetailSheet';

export default function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <PollutionMap />
      <FilterBar />
      <DetailSheet />
    </View>
  );
}
