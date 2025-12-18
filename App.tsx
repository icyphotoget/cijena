import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { seedDbIfEmpty } from './src/services/seed';
import { theme } from './src/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string>('Inicijaliziram bazu…');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await seedDbIfEmpty();
        if (!cancelled) {
          setMsg(res.seeded ? `Seedano: ${res.count} parfema` : `Baza spremna: ${res.count} parfema`);
          setReady(true);
        }
      } catch (e) {
        if (!cancelled) setMsg('Greška kod inicijalizacije baze.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.bg }}>
        <Text style={{ color: theme.colors.muted }}>{msg}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
