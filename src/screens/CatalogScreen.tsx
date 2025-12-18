import { useMemo } from 'react';
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import perfumes from '../data/perfumes.json';
import { theme } from '../theme';
import Card from '../components/Card';

type Perfume = (typeof perfumes)[number];

const { width: SCREEN_W } = Dimensions.get('window');
const H_PADDING = theme.spacing.l;
const CARD_W = SCREEN_W - H_PADDING * 2;

type VibeSection = {
  title: string;
  subtitle?: string;
  items: Perfume[];
};

function uniqById(items: Perfume[]) {
  const seen = new Set<string>();
  return items.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

function hasAny(arr: any, wanted: string[]) {
  if (!Array.isArray(arr)) return false;
  return wanted.some((w) => arr.includes(w));
}

function buildVibes(all: Perfume[]): VibeSection[] {
  const fresh = all.filter(
    (p) =>
      hasAny(p.notes, ['citrus', 'morsko']) ||
      hasAny(p.occasion, ['casual']) ||
      hasAny(p.season, ['ljeto'])
  );

  const office = all.filter(
    (p) =>
      hasAny(p.occasion, ['posao']) ||
      p.intensity === 'svježe' ||
      p.intensity === 'srednje'
  );

  const dateNight = all.filter(
    (p) =>
      hasAny(p.occasion, ['dejt']) ||
      hasAny(p.notes, ['vanilija', 'ambra', 'mošus', 'koža'])
  );

  const nightOut = all.filter(
    (p) => hasAny(p.occasion, ['izlazak']) || p.intensity === 'jako'
  );

  const winterWarm = all.filter(
    (p) =>
      hasAny(p.season, ['zima', 'jesen']) ||
      hasAny(p.notes, ['vanilija', 'ambra', 'oud', 'koža', 'začinsko'])
  );

  const cleanMinimal = all.filter(
    (p) => p.intensity === 'svježe' || hasAny(p.notes, ['iris', 'cvjetno', 'drvo'])
  );

  const sections: VibeSection[] = [
    { title: 'Fresh & Clean', subtitle: 'svježe, lagano, daily', items: uniqById(fresh) },
    { title: 'Office-safe', subtitle: 'sigurno za posao i ured', items: uniqById(office) },
    { title: 'Date night', subtitle: 'privlačno, cozy, “close range”', items: uniqById(dateNight) },
    { title: 'Night out', subtitle: 'glasnije, projekcija, party', items: uniqById(nightOut) },
    { title: 'Winter warm', subtitle: 'slatko/ambar/začini za hladnije dane', items: uniqById(winterWarm) },
    { title: 'Minimal & Elegant', subtitle: 'čisto, elegantno, bez previše buke', items: uniqById(cleanMinimal) },
  ];

  return sections.filter((s) => s.items.length > 0);
}

function PerfumeSwipeCard({ perfume }: { perfume: Perfume }) {
  return (
    <Card style={{ width: CARD_W, marginBottom: 0 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', color: theme.colors.text }}>
        {perfume.brand} – {perfume.name}
      </Text>

      <Text style={{ marginTop: 8, color: theme.colors.muted }}>
        Jačina: {perfume.intensity} · Trajnost: {perfume.longevity}/10
      </Text>

      <Text style={{ marginTop: 10, color: theme.colors.muted }}>
        Note: {Array.isArray(perfume.notes) && perfume.notes.length ? perfume.notes.join(', ') : '—'}
      </Text>

      <Text style={{ marginTop: 10, color: theme.colors.muted }}>
        Prilike:{' '}
        {Array.isArray(perfume.occasion) && perfume.occasion.length ? perfume.occasion.join(', ') : '—'}
      </Text>

      <Text style={{ marginTop: 6, color: theme.colors.muted }}>
        Sezone:{' '}
        {Array.isArray(perfume.season) && perfume.season.length ? perfume.season.join(', ') : '—'}
      </Text>
    </Card>
  );
}

export default function CatalogScreen() {
  const sections = useMemo(() => buildVibes(perfumes as Perfume[]), []);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: theme.spacing.l,
        paddingBottom: theme.spacing.xl,
        backgroundColor: theme.colors.bg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: theme.type.h2, fontWeight: '900', color: theme.colors.text }}>
        Katalog po vibeovima
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6, marginBottom: theme.spacing.l }}>
        Swipeaj lijevo/desno — svaka kartica je jedan parfem.
      </Text>

      {sections.map((section) => (
        <View key={section.title} style={{ marginBottom: theme.spacing.xl }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: theme.colors.text }}>
            {section.title}
          </Text>
          {section.subtitle ? (
            <Text style={{ color: theme.colors.muted, marginTop: 4, marginBottom: 10 }}>
              {section.subtitle}
            </Text>
          ) : (
            <View style={{ height: 10 }} />
          )}

          <FlatList
            data={section.items}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={CARD_W + theme.spacing.m}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: theme.spacing.l }}
            ItemSeparatorComponent={() => <View style={{ width: theme.spacing.m }} />}
            renderItem={({ item }) => <PerfumeSwipeCard perfume={item} />}
          />
        </View>
      ))}
    </ScrollView>
  );
}
