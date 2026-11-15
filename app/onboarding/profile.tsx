import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { saveProfile } from '@/lib/storage';
import { UserProfile } from '@/lib/claude';
import { colors, spacing, radius, typography } from '@/theme';

type Gender = UserProfile['gender'];
type WeightUnit = UserProfile['weightUnit'];

const DAYS = [1, 2, 3, 4, 5, 6, 7];

export default function Profile() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [daysPerWeek, setDaysPerWeek] = useState(3);

  const canContinue = age.trim() !== '' && weight.trim() !== '' && Number(age) > 0 && Number(weight) > 0;

  async function handleNext() {
    if (!canContinue) return;
    const profile: UserProfile = {
      age: Number(age),
      gender,
      weight: Number(weight),
      weightUnit,
      daysPerWeek,
    };
    await saveProfile(profile);
    router.push('/onboarding/generating');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepLabel}>About You</Text>
            <Text style={styles.title}>Tell us a bit{'\n'}about yourself.</Text>
          </View>

          {/* Age */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 24"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
              maxLength={3}
            />
          </View>

          {/* Gender */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.chipRow}>
              {(['male', 'female', 'other'] as Gender[]).map((g) => (
                <Pressable
                  key={g}
                  style={[styles.chip, gender === g && styles.chipActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Weight */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Weight</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="e.g. 75"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                maxLength={6}
              />
              <View style={styles.unitToggle}>
                {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
                  <Pressable
                    key={u}
                    style={[styles.unitBtn, weightUnit === u && styles.unitBtnActive]}
                    onPress={() => setWeightUnit(u)}
                  >
                    <Text style={[styles.unitText, weightUnit === u && styles.unitTextActive]}>{u}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Days per week */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Days per week</Text>
            <View style={styles.daysRow}>
              {DAYS.map((d) => (
                <Pressable
                  key={d}
                  style={[styles.dayBtn, daysPerWeek === d && styles.dayBtnActive]}
                  onPress={() => setDaysPerWeek(d)}
                >
                  <Text style={[styles.dayText, daysPerWeek === d && styles.dayTextActive]}>{d}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Generate My Plan" onPress={handleNext} disabled={!canContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  stepLabel: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.displayMedium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  chipActive: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.accent,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  unitBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minWidth: 52,
    alignItems: 'center',
  },
  unitBtnActive: {
    backgroundColor: colors.accent,
  },
  unitText: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  unitTextActive: {
    color: colors.onAccent,
  },
  daysRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayBtn: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  dayBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayText: {
    ...typography.headingSmall,
    color: colors.textSecondary,
  },
  dayTextActive: {
    color: colors.onAccent,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
});
