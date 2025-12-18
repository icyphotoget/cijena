import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { recommendPerfumes } from '../services/recommendation';
import { isFavorite, toggleFavorite } from '../services/favorites';
import { getAiAdvice, type AiResponse } from '../services/ai';
import { theme } from '../theme';
import Card from '../components/Card';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { answers } = route.params;

  const recommendations = useMemo(() => recommendPerfumes(answers), [answers]);

  const [favMap, setFavMap] = useState<Record<string, boolean>>({});

  const [ai, setAi] = useState<AiResponse | null>(null);
  const [aiErr, setAiErr] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // favorites for visible recs
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        recommendations.map(async (r) => {
          const fav = await isFavorite(r.perfume.id);
          return [r.perfume.id, fav] as const;
        })
      );

      if (cancelled) return;

      const next: Record<string, boolean> = {};
      for (const [id, v] of entries) next[id] = v;
      setFavMap(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [recommendations]);

  const runAi = async () => {
    if (recommendations.length === 0) return;

    setAi(null);
    setAiErr(null);
    setAiLoading(true);

    try {
      const out = await getAiAdvice(answers, recommendations);
      setAi(out);
    } catch {
      setAiErr('AI nije dostupan (provjeri Ollama URL / mrežu).');
    } finally {
      setAiLoading(false);
    }
  };

  // auto-run AI on entry
  useEffect(() => {
    runAi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, recommendations]);

  const onShare = async () => {
    const top = recommendations[0]?.perfume;
    if (!top) {
      Alert.alert('Nema preporuka', 'Nema što podijeliti za ove kriterije.');
      return;
    }

    const aiLine = ai?.summary ? `\nAI: ${ai.summary}` : '';
    const msg =
      `ParfemAI preporuka:\n` +
      `${top.brand} – ${top.name}\n` +
      `Prilika: ${answers.occasion}, sezona: ${answers.season}, doba dana: ${answers.timeOfDay}\n` +
      aiLine;

    try {
      await Share.share({ message: msg });
    } catch {
      Alert.alert('Share', 'Nije uspjelo dijeljenje.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: theme.spacing.l,
        paddingBottom: theme.spacing.xl,
        backgroundColor: theme.colors.bg,
      }}
    >
      <Text style={{ fontSize: theme.type.h2, fontWeight: '800', color: theme.colors.text }}>
        Preporuke
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6, marginBottom: theme.spacing.l }}>
        Naš algoritam daje “score”, a AI dodaje savjet i objašnjenje.
      </Text>

      {/* ACTIONS */}
      <View style={{ marginBottom: theme.spacing.m }}>
        <Button title="Ponovi AI" variant="outline" onPress={runAi} />
        <Button title="Podijeli top preporuku" variant="outline" onPress={onShare} />
      </View>

      {/* AI CARD */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          AI savjet
        </Text>

        {aiLoading && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <ActivityIndicator />
            <Text style={{ color: theme.colors.muted }}>Razmišljam…</Text>
          </View>
        )}

        {!aiLoading && aiErr && (
          <Text style={{ color: theme.colors.muted }}>{aiErr}</Text>
        )}

        {!aiLoading && !aiErr && !ai && (
          <Text style={{ color: theme.colors.muted }}>(AI još nije dao odgovor.)</Text>
        )}

        {ai && (
          <View>
            <Text style={{ color: theme.colors.text, marginBottom: 10 }}>{ai.summary}</Text>

            {!!ai.tips?.length && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: '800', color: theme.colors.text, marginBottom: 6 }}>
                  Tipovi
                </Text>
                {ai.tips.slice(0, 6).map((t, i) => (
                  <Text key={i} style={{ color: theme.colors.muted, marginBottom: 4 }}>
                    • {t}
                  </Text>
                ))}
              </View>
            )}

            {!!ai.alternatives?.length && (
              <View>
                <Text style={{ fontWeight: '800', color: theme.colors.text, marginBottom: 6 }}>
                  Alternative
                </Text>
                <Text style={{ color: theme.colors.muted }}>
                  {ai.alternatives.join(' · ')}
                </Text>
              </View>
            )}
          </View>
        )}
      </Card>

      {/* RESULTS */}
      {recommendations.length === 0 ? (
        <Card>
          <Text style={{ color: theme.colors.muted }}>
            Nažalost, nema dobre preporuke za ove kriterije.
          </Text>
        </Card>
      ) : (
        recommendations.map(({ perfume, score, reasons }) => {
          const isFav = !!favMap[perfume.id];
          const aiWhy = ai?.ranked?.find((x) => x.id === perfume.id)?.why;

          return (
            <Card key={perfume.id}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: theme.colors.text }}>
                {perfume.brand} – {perfume.name}
              </Text>

              <Text style={{ marginTop: 6, color: theme.colors.muted }}>
                Jačina: {perfume.intensity} · Trajnost: {perfume.longevity}/10
              </Text>

              <Text style={{ marginTop: 10, color: theme.colors.muted }}>
                <Text style={{ fontWeight: '800', color: theme.colors.text }}>
                  Zašto (algoritam):
                </Text>{' '}
                {reasons.join(', ')}
              </Text>

              {aiWhy ? (
                <Text style={{ marginTop: 10, color: theme.colors.muted }}>
                  <Text style={{ fontWeight: '800', color: theme.colors.text }}>
                    AI:
                  </Text>{' '}
                  {aiWhy}
                </Text>
              ) : null}

              <View style={{ marginTop: theme.spacing.m }}>
                <Text style={{ fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
                  Score: {score}
                </Text>

                <Button
                  title={isFav ? '★ Spremljeno' : '☆ Spremi'}
                  variant={isFav ? 'primary' : 'outline'}
                  onPress={async () => {
                    const nowFav = await toggleFavorite({
                      id: perfume.id,
                      brand: perfume.brand,
                      name: perfume.name,
                    });
                    setFavMap((prev) => ({ ...prev, [perfume.id]: nowFav }));
                    Alert.alert(
                      nowFav ? 'Spremljeno' : 'Uklonjeno',
                      `${perfume.brand} – ${perfume.name}`
                    );
                  }}
                />
              </View>
            </Card>
          );
        })
      )}

      <Button
        title="Otvori favorite"
        variant="outline"
        onPress={() => navigation.navigate('Favorites')}
      />
    </ScrollView>
  );
}
