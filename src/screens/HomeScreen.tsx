import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Preporuka parfema
      </Text>

      <Button
        title="Preporuči parfem"
        onPress={() => navigation.navigate('Questionnaire')}
      />

      <Button
        title="Favoriti"
        onPress={() => navigation.navigate('Favorites')}
      />
    </View>
  );
}
