import React from 'react';
import { Pressable, PressableProps, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius, typography } from '@/theme';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.onAccent : colors.textPrimary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' && styles.labelPrimary,
            variant === 'secondary' && styles.labelSecondary,
            variant === 'ghost' && styles.labelGhost,
            size === 'sm' && styles.labelSm,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  md: {
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  sm: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  labelPrimary: {
    color: colors.onAccent,
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
  labelGhost: {
    color: colors.textSecondary,
  },
  labelSm: {
    fontSize: 13,
  },
});
