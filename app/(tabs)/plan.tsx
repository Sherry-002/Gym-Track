import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadPlan, loadProfile, clearAll } from '@/lib/storage';
import { WorkoutPlan, WorkoutDay, UserProfile } from '@/lib/claude';
import { getExercise } from '@/lib/exercises';
import { colors, spacing, radius, typography } from '@/theme';

export default function Plan() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      Promise.all([loadPlan(), loadProfile()]).then(([p, prof]) => {
        setPlan(p);
        setProfile(prof);
      });
    }, []),
  );

  function handleRegen() {
    Alert.alert('Regenerate Plan', 'This will generate a new workout plan. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Regenerate',
        onPress: async () => {
          await clearAll();
          router.replace('/onboarding');
        },
      },
    ]);
  }

  if (!plan || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.empty}>No plan yet.</Text>
          <Text
            style={[styles.empty, { color: colors.accent, marginTop: 8 }]}
            onPress={() => router.replace('/onboarding')}
          >
            Create one →
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Plan</Text>
          <Pressable style={styles.regenBtn} onPress={handleRegen}>
            <Ionicons name="refresh-outline" size={16} color={colors.accent} />
            <Text style={styles.regenText}>Regenerate</Text>
          </Pressable>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <StatPill label="Split" value={plan.split} />
            <StatPill label="Days/week" value={String(plan.daysPerWeek)} />
            <StatPill
              label="Weight"
              value={`${profile.weight}${profile.weightUnit}`}
            />
          </View>
          <Text style={styles.summaryText}>{plan.summary}</Text>
        </View>

        {/* Schedule */}
        <Text style={styles.sectionLabel}>Weekly Schedule</Text>
        {plan.schedule.map((day, i) => (
          <DayCard key={i} day={day} index={i} />
        ))}

        {/* Notes */}
        {plan.notes ? (
          <>
            <Text style={styles.sectionLabel}>Coach Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{plan.notes}</Text>
            </View>
          </>
        ) : null}

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

function DayCard({ day, index }: { day: WorkoutDay; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <View style={styles.dayCard}>
      <Pressable style={styles.dayHeader} onPress={() => setExpanded((v) => !v)}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>{day.dayName}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.dayType}>{day.workoutType}</Text>
          <Text style={styles.dayMeta}>{day.exercises.length} exercises</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textTertiary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.dayBody}>
          {day.exercises.map((ex, j) => {
            const info = getExercise(ex.exerciseId);
            return (
              <Pressable
                key={j}
                style={styles.exRow}
                onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: ex.exerciseId } })}
              >
                <View style={styles.exNum}>
                  <Text style={styles.exNumText}>{j + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exName}>{info?.name ?? ex.exerciseId}</Text>
                  <Text style={styles.exDetail}>{info?.primaryMuscles.join(', ')}</Text>
                </View>
                <Text style={styles.exSets}>
                  {ex.sets} × {ex.reps}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  empty: { ...typography.bodyLarge, color: colors.textSecondary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.headingLarge },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accentDim,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(200,240,49,0.25)',
  },
  regenText: { ...typography.accent, fontSize: 13 },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  pillValue: { ...typography.headingSmall, color: colors.accent },
  pillLabel: { ...typography.bodySmall, marginTop: 2 },
  summaryText: { ...typography.bodyMedium, lineHeight: 22 },
  sectionLabel: { ...typography.label, marginBottom: spacing.md, marginTop: spacing.sm },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  dayBadge: {
    width: 48,
    height: 48,
    backgroundColor: colors.accentDim,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200,240,49,0.3)',
  },
  dayBadgeText: { ...typography.bodySmall, color: colors.accent, fontWeight: '800' },
  dayType: { ...typography.headingSmall },
  dayMeta: { ...typography.bodySmall, marginTop: 2 },
  dayBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  exNum: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exNumText: { ...typography.bodySmall, fontWeight: '700', color: colors.textSecondary },
  exName: { ...typography.bodyLarge, fontSize: 14, fontWeight: '600' },
  exDetail: { ...typography.bodySmall, marginTop: 1 },
  exSets: { ...typography.accent, fontSize: 13 },
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.xl,
  },
  notesText: { ...typography.bodyMedium, lineHeight: 22 },
});
