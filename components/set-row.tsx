import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '@/theme';

interface SetRowProps {
  setNumber: number;
  reps: string;
  completed: boolean;
  onToggle: () => void;
}

export function SetRow({ setNumber, reps, completed, onToggle }: SetRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, completed && styles.rowCompleted, pressed && styles.pressed]}
      onPress={onToggle}
    >
      <View style={[styles.check, completed && styles.checkDone]}>
        {completed && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={[styles.setLabel, completed && styles.textDone]}>Set {setNumber}</Text>

      <View style={styles.spacer} />

      <Text style={[styles.reps, completed && styles.textDone]}>{reps} reps</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.sm,
  },
  rowCompleted: {
    backgroundColor: colors.accentDim,
    borderColor: 'rgba(200,240,49,0.25)',
  },
  pressed: {
    opacity: 0.75,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: colors.onAccent,
    fontSize: 14,
    fontWeight: '800',
  },
  setLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  reps: {
    ...typography.headingSmall,
    color: colors.textPrimary,
  },
  textDone: {
    color: colors.accent,
  },
});
