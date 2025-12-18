import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>ParfemAI</Text>
      <Text style={{ fontSize: 16, opacity: 0.7, marginBottom: 24 }}>
        Reci priliku i preference — dobit ćeš preporuke parfema.
      </Text>

      <Pressable
        onPress={() => navigation.navigate('Questionnaire')}
        style={{ backgroundColor: '#111', padding: 14, borderRadius: 12, marginBottom: 12 }}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Preporuči parfem</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Favorites')}
        style={{ borderColor: '#111', borderWidth: 1, padding: 14, borderRadius: 12 }}
      >
        <Text style={{ color: '#111', fontSize: 16, textAlign: 'center' }}>Favoriti</Text>
      </Pressable>
    </View>
  );
}
