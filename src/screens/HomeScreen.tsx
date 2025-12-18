import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { theme } from '../theme';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: theme.spacing.xl, justifyContent: 'center' }}>
      <Text style={{ fontSize: theme.type.h1, fontWeight: '800', color: theme.colors.text }}>
        ParfemAI
      </Text>
      <Text style={{ fontSize: theme.type.body, color: theme.colors.muted, marginTop: 8, marginBottom: 24 }}>
        Preporuke + AI savjet, a imaš i vibe swipe katalog.
      </Text>

      <Button title="Preporuči parfem" onPress={() => navigation.navigate('Questionnaire')} />
      <Button title="Vibe katalog (swipe)" variant="outline" onPress={() => navigation.navigate('VibeSelect')} />
      <Button title="Favoriti" variant="outline" onPress={() => navigation.navigate('Favorites')} />
    </View>
  );
}
