import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  displayLarge: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.textPrimary,
    lineHeight: 48,
  },
  displayMedium: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  headingLarge: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  headingSmall: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  accent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.2,
  },
};
