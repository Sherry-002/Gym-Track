import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getExercise } from '@/lib/exercises';
import { AnimatedExercise } from '@/components/animated-exercise';
import { colors, spacing, radius, typography } from '@/theme';

const { width } = Dimensions.get('window');

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = getExercise(id ?? '');

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>Exercise not found.</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.accent }}>← Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const categoryColors: Record<string, string> = {
    Push: '#FF9F43',
    Pull: '#54A0FF',
    Legs: '#5F27CD',
    Cardio: '#00D2D3',
  };
  const catColor = categoryColors[exercise.category] ?? colors.accent;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>

        {/* Hero — animation */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['rgba(200,240,49,0.06)', 'transparent']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <AnimatedExercise exerciseId={exercise.id} size={width * 0.55} />
          <View style={[styles.catBadge, { backgroundColor: `${catColor}20` }]}>
            <Text style={[styles.catBadgeText, { color: catColor }]}>{exercise.category}</Text>
          </View>
        </View>

        {/* Name + equipment */}
        <Text style={styles.exName}>{exercise.name}</Text>
        <View style={styles.equipRow}>
          <Ionicons name="fitness-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.equipText}>{exercise.equipment}</Text>
        </View>

        {/* Muscle chips */}
        <View style={styles.muscleSection}>
          <Text style={styles.sectionLabel}>Primary Muscles</Text>
          <View style={styles.chipRow}>
            {exercise.primaryMuscles.map((m) => (
              <View key={m} style={styles.muscleChip}>
                <Text style={styles.muscleChipText}>{m}</Text>
              </View>
            ))}
          </View>

          {exercise.secondaryMuscles.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>Secondary</Text>
              <View style={styles.chipRow}>
                {exercise.secondaryMuscles.map((m) => (
                  <View key={m} style={[styles.muscleChip, styles.muscleChipSec]}>
                    <Text style={[styles.muscleChipText, { color: colors.textSecondary }]}>{m}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Default volume */}
        <View style={styles.volumeRow}>
          <View style={styles.volumePill}>
            <Text style={styles.volumeNum}>{exercise.defaultSets}</Text>
            <Text style={styles.volumeLabel}>sets</Text>
          </View>
          <View style={styles.volumeDivider} />
          <View style={styles.volumePill}>
            <Text style={styles.volumeNum}>{exercise.defaultReps}</Text>
            <Text style={styles.volumeLabel}>reps</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionLabel}>How to Do It</Text>
          <Text style={styles.bodyText}>{exercise.description}</Text>
        </View>

        {/* Tips */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Tips</Text>
          {exercise.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.bodyText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  catBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  catBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  exName: { ...typography.headingLarge, marginBottom: spacing.xs },
  equipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  equipText: { ...typography.bodyMedium },
  muscleSection: { marginBottom: spacing.xl },
  sectionLabel: { ...typography.label, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  muscleChip: {
    backgroundColor: colors.accentDim,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(200,240,49,0.25)',
  },
  muscleChipSec: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.surfaceBorder,
  },
  muscleChipText: { ...typography.bodySmall, color: colors.accent, fontWeight: '600' },
  volumeRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumePill: { flex: 1, alignItems: 'center' },
  volumeNum: { ...typography.displayMedium, color: colors.accent, fontSize: 36 },
  volumeLabel: { ...typography.label },
  volumeDivider: { width: 1, height: 48, backgroundColor: colors.surfaceBorder },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  bodyText: { ...typography.bodyMedium, lineHeight: 22, color: colors.textSecondary },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 7,
    flexShrink: 0,
  },
});
