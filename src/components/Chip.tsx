import { Pressable, Text } from 'react-native';
import { theme } from '../theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export default function Chip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: active ? theme.colors.text : theme.colors.border,
        backgroundColor: active ? theme.colors.text : 'transparent',
        marginRight: theme.spacing.s,
        marginBottom: theme.spacing.s,
      }}
    >
      <Text style={{ color: active ? 'white' : theme.colors.text, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}
