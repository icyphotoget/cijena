import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listFavorites, removeFavorite, FavoriteItem } from '../services/favorites';

export default function FavoritesScreen() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const favs = await listFavorites();
      if (!cancelled) {
        setItems(favs);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(load);

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Učitavam…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {items.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>Nema favorita još. Spremi nešto iz rezultata.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 14,
                padding: 14,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {item.brand} – {item.name}
              </Text>

              <Pressable
                onPress={() => {
                  Alert.alert(
                    'Ukloni iz favorita?',
                    `${item.brand} – ${item.name}`,
                    [
                      { text: 'Odustani', style: 'cancel' },
                      {
                        text: 'Ukloni',
                        style: 'destructive',
                        onPress: async () => {
                          await removeFavorite(item.id);
                          setItems(prev => prev.filter(x => x.id !== item.id));
                        },
                      },
                    ]
                  );
                }}
                style={{
                  marginTop: 10,
                  alignSelf: 'flex-start',
                  borderWidth: 1,
                  borderColor: '#111',
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontWeight: '600' }}>Ukloni</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}
