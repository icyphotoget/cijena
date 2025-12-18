import { Pressable, Text, PressableProps } from 'react-native';
import { theme } from '../theme';

type Props = PressableProps & {
  title: string;
  variant?: 'primary' | 'outline';
};

export default function Button({ title, variant = 'primary', style, ...props }: Props) {
  const primary = variant === 'primary';

  return (
    <Pressable
      {...props}
      style={[
        {
          backgroundColor: primary ? theme.colors.text : 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.text,
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderRadius: theme.radius.btn,
          marginBottom: theme.spacing.m,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: primary ? 'white' : theme.colors.text,
          fontWeight: '700',
          textAlign: 'center',
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
