import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { theme } from '../theme';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

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

function toggle(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
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

    navigation.navigate('Results', { answers });
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
        Upitnik
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 6, marginBottom: theme.spacing.l }}>
        Odaberi par stvari i dobit ćeš preporuke.
      </Text>

      {/* Occasion */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Prilika
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['posao', 'dejt', 'izlazak', 'casual', 'svadba', 'teretana'] as Occasion[]).map((v) => (
            <Chip key={v} label={v} active={occasion === v} onPress={() => setOccasion(v)} />
          ))}
        </View>
      </Card>

      {/* Season */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Sezona
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['proljeće', 'ljeto', 'jesen', 'zima'] as Season[]).map((v) => (
            <Chip key={v} label={v} active={season === v} onPress={() => setSeason(v)} />
          ))}
        </View>
      </Card>

      {/* Time */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Doba dana
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['dan', 'večer'] as TimeOfDay[]).map((v) => (
            <Chip key={v} label={v} active={timeOfDay === v} onPress={() => setTimeOfDay(v)} />
          ))}
        </View>
      </Card>

      {/* Intensity */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Jačina
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['svježe', 'srednje', 'jako'] as Intensity[]).map((v) => (
            <Chip key={v} label={v} active={intensity === v} onPress={() => setIntensity(v)} />
          ))}
        </View>
      </Card>

      {/* Budget */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Budžet (EUR, opcionalno)
        </Text>

        <TextInput
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          placeholder="npr. 50"
          placeholderTextColor="rgba(17,17,17,0.35)"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.btn,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontSize: 16,
            color: theme.colors.text,
          }}
        />

        <Text style={{ marginTop: 8, color: theme.colors.muted, fontSize: theme.type.small }}>
          Ako ništa ne upišeš, budžet se ignorira.
        </Text>
      </Card>

      {/* Preferred notes */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Note koje voliš
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {noteOptions.map((v) => (
            <Chip
              key={v}
              label={v}
              active={preferredNotes.includes(v)}
              onPress={() => setPreferredNotes((prev) => toggle(prev, v))}
            />
          ))}
        </View>
      </Card>

      {/* Avoid notes */}
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 10 }}>
          Note koje izbjegavaš
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {noteOptions.map((v) => (
            <Chip
              key={v}
              label={v}
              active={avoidNotes.includes(v)}
              onPress={() => setAvoidNotes((prev) => toggle(prev, v))}
            />
          ))}
        </View>

        <Text style={{ marginTop: 8, color: theme.colors.muted, fontSize: theme.type.small }}>
          Ako odabereš note koje parfem sadrži, njegov score će pasti.
        </Text>
      </Card>

      {/* Continue */}
      <View style={{ marginTop: 4 }}>
        <Button
          title="Prikaži preporuke"
          onPress={onContinue}
          style={{
            opacity: canContinue ? 1 : 0.55,
          }}
        />
        <Text style={{ color: theme.colors.muted, fontSize: theme.type.small, textAlign: 'center' }}>
          Obavezno: prilika, sezona, doba dana i jačina.
        </Text>
      </View>
    </ScrollView>
  );
}
