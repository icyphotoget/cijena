import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Questionnaire'>;

type Occasion = 'posao' | 'dejt' | 'izlazak' | 'casual' | 'svadba' | 'teretana';
type Season = 'proljeće' | 'ljeto' | 'jesen' | 'zima';
type TimeOfDay = 'dan' | 'večer';
type Intensity = 'svježe' | 'srednje' | 'jako';

export type QuestionnaireAnswers = {
  occasion: Occasion;
  season: Season;
  timeOfDay: TimeOfDay;
  intensity: Intensity;
  preferredNotes: string[];
  avoidNotes: string[];
  budgetEur?: number;
};

const chipStyle = (active: boolean) => ({
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: active ? '#111' : '#ccc',
  backgroundColor: active ? '#111' : 'transparent',
  marginRight: 8,
  marginBottom: 8,
} as const);

const chipTextStyle = (active: boolean) => ({
  color: active ? 'white' : '#111',
  fontSize: 14,
} as const);

function toggle(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
}

export default function QuestionnaireScreen({ navigation }: Props) {
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [intensity, setIntensity] = useState<Intensity | null>(null);

  const [preferredNotes, setPreferredNotes] = useState<string[]>([]);
  const [avoidNotes, setAvoidNotes] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>(''); // text input

  const noteOptions = useMemo(
    () => [
      'citrus',
      'vanilija',
      'ambra',
      'mošus',
      'drvo',
      'cvjetno',
      'začinsko',
      'koža',
      'morsko',
      'iris',
      'oud',
      'kava',
    ],
    []
  );

  const canContinue = !!occasion && !!season && !!timeOfDay && !!intensity;

  const onContinue = () => {
    if (!canContinue) {
      Alert.alert('Još malo', 'Odaberi priliku, sezonu, doba dana i jačinu.');
      return;
    }

    const budgetTrim = budget.trim();
    const budgetEur =
      budgetTrim.length > 0 ? Number(budgetTrim.replace(',', '.')) : undefined;

    if (budgetTrim.length > 0 && (Number.isNaN(budgetEur) || budgetEur! <= 0)) {
      Alert.alert('Budžet', 'Unesi valjani broj (npr. 50).');
      return;
    }

    const answers: QuestionnaireAnswers = {
      occasion,
      season,
      timeOfDay,
      intensity,
      preferredNotes,
      avoidNotes,
      budgetEur,
    };

    navigation.navigate('Results', { answers } as any);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 6 }}>Upitnik</Text>
      <Text style={{ opacity: 0.7, marginBottom: 16 }}>
        Odaberi par stvari i dobit ćeš preporuke.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Prilika</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 }}>
        {(['posao', 'dejt', 'izlazak', 'casual', 'svadba', 'teretana'] as Occasion[]).map(v => (
          <Pressable key={v} onPress={() => setOccasion(v)} style={chipStyle(occasion === v)}>
            <Text style={chipTextStyle(occasion === v)}>{v}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Sezona</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 }}>
        {(['proljeće', 'ljeto', 'jesen', 'zima'] as Season[]).map(v => (
          <Pressable key={v} onPress={() => setSeason(v)} style={chipStyle(season === v)}>
            <Text style={chipTextStyle(season === v)}>{v}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Doba dana</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 }}>
        {(['dan', 'večer'] as TimeOfDay[]).map(v => (
          <Pressable key={v} onPress={() => setTimeOfDay(v)} style={chipStyle(timeOfDay === v)}>
            <Text style={chipTextStyle(timeOfDay === v)}>{v}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Jačina</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 }}>
        {(['svježe', 'srednje', 'jako'] as Intensity[]).map(v => (
          <Pressable key={v} onPress={() => setIntensity(v)} style={chipStyle(intensity === v)}>
            <Text style={chipTextStyle(intensity === v)}>{v}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Budžet (EUR, opcionalno)</Text>
      <TextInput
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        placeholder="npr. 50"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 16,
        }}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Note koje voliš</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 }}>
        {noteOptions.map(v => {
          const active = preferredNotes.includes(v);
          return (
            <Pressable
              key={v}
              onPress={() => setPreferredNotes(prev => toggle(prev, v))}
              style={chipStyle(active)}
            >
              <Text style={chipTextStyle(active)}>{v}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Note koje izbjegavaš</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 }}>
        {noteOptions.map(v => {
          const active = avoidNotes.includes(v);
          return (
            <Pressable
              key={v}
              onPress={() => setAvoidNotes(prev => toggle(prev, v))}
              style={chipStyle(active)}
            >
              <Text style={chipTextStyle(active)}>{v}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onContinue}
        style={{
          backgroundColor: canContinue ? '#111' : '#999',
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontWeight: '600' }}>
          Prikaži preporuke
        </Text>
      </Pressable>
    </ScrollView>
  );
}
