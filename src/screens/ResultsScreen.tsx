import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { recommendPerfumes } from '../services/recommendation';
import { isFavorite, toggleFavorite } from '../services/favorites';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { answers } = route.params;
  const recommendations = recommendPerfumes(answers);

  const [favMap, setFavMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        recommendations.map(async r => [r.perfume.id, await isFavorite(r.perfume.id)] as const)
      );
      if (!cancelled) {
        const next: Record<string, boolean> = {};
        for (const [id, v] of entries) next[id] = v;
        setFavMap(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recommendations]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>
        Preporučeni parfemi
      </Text>

      {recommendations.length === 0 && (
        <Text>Nažalost, nema dobre preporuke za ove kriterije.</Text>
      )}

      {recommendations.map(({ perfume, score, reasons }) => {
        const isFav = !!favMap[perfume.id];

        return (
          <View
            key={perfume.id}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {perfume.brand} – {perfume.name}
            </Text>

            <Text style={{ marginTop: 4, marginBottom: 6 }}>
              Jačina: {perfume.intensity} · Trajnost: {perfume.longevity}/10
            </Text>

            <Text style={{ opacity: 0.8, marginBottom: 10 }}>
              Zašto: {reasons.join(', ')}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '600' }}>Score: {score}</Text>

              <Pressable
                onPress={async () => {
                  const nowFav = await toggleFavorite({
                    id: perfume.id,
                    brand: perfume.brand,
                    name: perfume.name,
                  });
                  setFavMap(prev => ({ ...prev, [perfume.id]: nowFav }));
                  Alert.alert(nowFav ? 'Spremljeno' : 'Uklonjeno', `${perfume.brand} – ${perfume.name}`);
                }}
                style={{
                  backgroundColor: isFav ? '#111' : 'transparent',
                  borderWidth: 1,
                  borderColor: '#111',
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: isFav ? 'white' : '#111', fontWeight: '600' }}>
                  {isFav ? '★ Spremljeno' : '☆ Spremi'}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      <Pressable
        onPress={() => navigation.navigate('Favorites')}
        style={{
          marginTop: 8,
          padding: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#111',
        }}
      >
        <Text style={{ textAlign: 'center', fontWeight: '600' }}>Otvori favorite</Text>
      </Pressable>
    </ScrollView>
  );
}
