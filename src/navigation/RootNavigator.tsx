import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import ResultsScreen from '../screens/ResultsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import VibeSelectScreen from '../screens/VibeSelectScreen';
import VibeCarouselScreen from '../screens/VibeCarouselScreen';
import type { QuestionnaireAnswers } from '../screens/QuestionnaireScreen';
import type { VibeId } from '../services/vibes';

export type RootStackParamList = {
  Home: undefined;
  Questionnaire: undefined;
  Results: { answers: QuestionnaireAnswers };
  Favorites: undefined;

  VibeSelect: undefined;
  VibeCarousel: { vibeId: VibeId };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ParfemAI' }} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} options={{ title: 'Upitnik' }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Preporuke' }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoriti' }} />

      <Stack.Screen name="VibeSelect" component={VibeSelectScreen} options={{ title: 'Vibe' }} />
      <Stack.Screen name="VibeCarousel" component={VibeCarouselScreen} options={{ title: 'Vibe swipe' }} />
    </Stack.Navigator>
  );
}
