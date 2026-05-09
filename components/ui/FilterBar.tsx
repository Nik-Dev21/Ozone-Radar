import { ScrollView } from 'react-native';
import { LAYERS } from '../../constants/layers';
import { useFilterStore } from '../../store/useFilterStore';
import type { LayerId } from '../../services/types';
import { FilterChip } from './FilterChip';

const LAYER_IDS = Object.keys(LAYERS) as LayerId[];

export function FilterBar() {
  const { activeLayers, toggleLayer } = useFilterStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
      style={{
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
      }}
    >
      {LAYER_IDS.map((id) => {
        const layer = LAYERS[id];
        return (
          <FilterChip
            key={id}
            label={layer.label}
            color={layer.color}
            active={activeLayers.has(id)}
            onToggle={() => toggleLayer(id)}
          />
        );
      })}
    </ScrollView>
  );
}
