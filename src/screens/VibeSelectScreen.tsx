import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { theme } from '../theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { VIBES } from '../services/vibes';

type Props = NativeStackScreenProps<RootStackParamList, 'VibeSelect'>;

export default function VibeSelectScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: theme.spacing.l, backgroundColor: theme.colors.bg }}>
      <Text style={{ fontSize: theme.type.h2, fontWeight: '900', color: theme.colors.text }}>
        Odaberi vibe
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6, marginBottom: theme.spacing.l }}>
        Nakon odabira swipeaš full-screen kartice parfema.
      </Text>

      {VIBES.map((v) => (
        <Card key={v.id}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: theme.colors.text }}>
            {v.title}
          </Text>
          <Text style={{ color: theme.colors.muted, marginTop: 6, marginBottom: theme.spacing.m }}>
            {v.subtitle}
          </Text>

          <Button
            title="Otvori"
            onPress={() => navigation.navigate('VibeCarousel', { vibeId: v.id })}
          />
        </Card>
      ))}
    </View>
  );
}
