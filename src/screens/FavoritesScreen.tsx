import { useCallback, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../theme';
import {
  listFavorites,
  removeFavorite,
  type FavoriteItem,
  clearFavorites,
} from '../services/favorites';

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
      <View
        style={{
          flex: 1,
          padding: theme.spacing.l,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.bg,
        }}
      >
        <Text style={{ color: theme.colors.muted }}>Učitavam…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: theme.spacing.l, backgroundColor: theme.colors.bg }}>
      <View style={{ marginBottom: theme.spacing.m }}>
        <Text style={{ fontSize: theme.type.h2, fontWeight: '800', color: theme.colors.text }}>
          Favoriti
        </Text>
        <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
          Spremljeni parfemi su lokalno na uređaju.
        </Text>
      </View>

      {items.length > 0 && (
        <View style={{ marginBottom: theme.spacing.m }}>
          <Button
            title="Obriši sve"
            variant="outline"
            onPress={() => {
              Alert.alert(
                'Obrisati sve favorite?',
                'Ova radnja se ne može vratiti.',
                [
                  { text: 'Odustani', style: 'cancel' },
                  {
                    text: 'Obriši',
                    style: 'destructive',
                    onPress: async () => {
                      await clearFavorites();
                      setItems([]);
                    },
                  },
                ]
              );
            }}
          />
        </View>
      )}

      {items.length === 0 ? (
        <Card>
          <Text style={{ color: theme.colors.muted }}>
            Nema favorita još. Spremi nešto iz rezultata.
          </Text>
        </Card>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x.id}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.m }} />}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 0 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text }}>
                {item.brand} – {item.name}
              </Text>

              <View style={{ marginTop: theme.spacing.m }}>
                <Button
                  title="Ukloni"
                  variant="outline"
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
                            setItems((prev) => prev.filter((x) => x.id !== item.id));
                          },
                        },
                      ]
                    );
                  }}
                />
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}
