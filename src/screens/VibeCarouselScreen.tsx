import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { theme } from '../theme';
import Button from '../components/Button';
import { VIBES, getPerfumesForVibe, type VibeId } from '../services/vibes';
import type { Perfume } from '../services/perfumesRepo';

type Props = NativeStackScreenProps<RootStackParamList, 'VibeCarousel'>;

const { width: W, height: H } = Dimensions.get('window');

function VibePerfumePage({ perfume, index, total }: { perfume: Perfume; index: number; total: number }) {
  return (
    <View style={{ width: W, height: H, padding: theme.spacing.xl, backgroundColor: theme.colors.bg }}>
      <StatusBar barStyle="dark-content" />

      <Text style={{ color: theme.colors.muted, marginBottom: 10 }}>
        {index + 1} / {total}
      </Text>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: theme.colors.text }}>
          {perfume.brand}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text, marginTop: 6 }}>
          {perfume.name}
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 14, fontSize: 16 }}>
          Jačina: {perfume.intensity ?? '—'} · Trajnost: {(perfume.longevity ?? '—')}/10
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 10, fontSize: 16 }}>
          Note: {perfume.notes?.length ? perfume.notes.join(', ') : '—'}
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 10, fontSize: 16 }}>
          Prilike: {perfume.occasion?.length ? perfume.occasion.join(', ') : '—'}
        </Text>

        <Text style={{ color: theme.colors.muted, marginTop: 10, fontSize: 16 }}>
          Sezone: {perfume.season?.length ? perfume.season.join(', ') : '—'}
        </Text>
      </View>

      <Text style={{ color: theme.colors.muted, textAlign: 'center', marginBottom: 10 }}>
        Swipeaj lijevo/desno
      </Text>
    </View>
  );
}

export default function VibeCarouselScreen({ route, navigation }: Props) {
  const { vibeId } = route.params;

  const vibe = useMemo(() => VIBES.find((v) => v.id === vibeId), [vibeId]);

  const [items, setItems] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  const listRef = useRef<FlatList<Perfume>>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const out = await getPerfumesForVibe(vibeId as VibeId);
      if (!cancelled) {
        setItems(out);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [vibeId]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ padding: theme.spacing.l, paddingBottom: 0 }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: theme.colors.text }}>
          {vibe?.title ?? 'Vibe'}
        </Text>
        <Text style={{ color: theme.colors.muted, marginTop: 4 }}>
          {vibe?.subtitle ?? ''}
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, padding: theme.spacing.l, justifyContent: 'center' }}>
          <Text style={{ color: theme.colors.muted }}>Učitavam…</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={{ flex: 1, padding: theme.spacing.l, justifyContent: 'center' }}>
          <Text style={{ color: theme.colors.muted, marginBottom: theme.spacing.m }}>
            Nema parfema u ovom vibeu (trenutno).
          </Text>
          <Button title="Nazad" variant="outline" onPress={() => navigation.goBack()} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(p) => p.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <VibePerfumePage perfume={item} index={index} total={items.length} />
          )}
          getItemLayout={(_, index) => ({ length: W, offset: W * index, index })}
        />
      )}
    </View>
  );
}
