import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import ResultsScreen from '../screens/ResultsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

export type RootStackParamList = {
  Home: undefined;
  Questionnaire: undefined;
  Results: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ParfemAI' }} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} options={{ title: 'Upitnik' }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Preporuke' }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoriti' }} />
    </Stack.Navigator>
  );
}
