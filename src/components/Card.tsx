import { View, ViewProps } from 'react-native';
import { theme } from '../theme';

export default function Card({ style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.card,
          padding: theme.spacing.l,
          marginBottom: theme.spacing.m,
        },
        style,
      ]}
    />
  );
}
