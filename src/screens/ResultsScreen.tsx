import { View, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { recommendPerfumes } from '../services/recommendation';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route }: Props) {
  const { answers } = route.params;
  const recommendations = recommendPerfumes(answers);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>
        Preporučeni parfemi
      </Text>

      {recommendations.length === 0 && (
        <Text>Nažalost, nema dobre preporuke za ove kriterije.</Text>
      )}

      {recommendations.map(({ perfume, score, reasons }) => (
        <View
          key={perfume.id}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 14,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            {perfume.brand} – {perfume.name}
          </Text>

          <Text style={{ marginTop: 4, marginBottom: 6 }}>
            Jačina: {perfume.intensity} · Trajnost: {perfume.longevity}/10
          </Text>

          <Text style={{ opacity: 0.8, marginBottom: 6 }}>
            Zašto: {reasons.join(', ')}
          </Text>

          <Text style={{ fontWeight: '600' }}>Score: {score}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
