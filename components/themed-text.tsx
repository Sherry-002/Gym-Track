import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography } from '@/theme';

type Variant = keyof typeof typography;

interface ThemedTextProps extends TextProps {
  variant?: Variant;
}

export function ThemedText({ variant = 'bodyLarge', style, ...props }: ThemedTextProps) {
  return <Text style={[typography[variant], style]} {...props} />;
}
