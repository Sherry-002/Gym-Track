import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadPlan, loadProfile, clearAll } from '@/lib/storage';
import { WorkoutPlan, WorkoutDay, PlannedExercise, UserProfile } from '@/lib/claude';
import { getExercise } from '@/lib/exercises';
import { SetRow } from '@/components/set-row';
import { colors, spacing, radius, typography } from '@/theme';

function getDayIndex(daysPerWeek: number): number {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon, ...
  // Simple rotation: pick a workout day based on day of week
  const workoutDays = getWorkoutDays(daysPerWeek);
  const idx = workoutDays.indexOf(dayOfWeek);
  return idx >= 0 ? idx % daysPerWeek : 0;
}

function getWorkoutDays(n: number): number[] {
  const options: Record<number, number[]> = {
    1: [1],
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  return options[n] ?? [1, 3, 5];
}

function isRestDay(daysPerWeek: number): boolean {
  const dayOfWeek = new Date().getDay();
  return !getWorkoutDays(daysPerWeek).includes(dayOfWeek);
}

type SetState = Record<string, boolean[]>;

export default function Today() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [sets, setSets] = useState<SetState>({});
  const [restDay, setRestDay] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [p, prof] = await Promise.all([loadPlan(), loadProfile()]);
        setPlan(p);
        setProfile(prof);
        if (p && prof) {
          const isRest = isRestDay(prof.daysPerWeek);
          setRestDay(isRest);
          if (!isRest) {
            const idx = getDayIndex(prof.daysPerWeek);
            const w = p.schedule[idx % p.schedule.length];
            setWorkout(w);
            // init set state
            const init: SetState = {};
            w.exercises.forEach((ex) => {
              init[ex.exerciseId] = Array(ex.sets).fill(false);
            });
            setSets(init);
          }
        }
      })();
    }, []),
  );

  function toggleSet(exerciseId: string, setIdx: number) {
    setSets((prev) => {
      const updated = [...(prev[exerciseId] ?? [])];
      updated[setIdx] = !updated[setIdx];
      return { ...prev, [exerciseId]: updated };
    });
  }

  function handleReset() {
    Alert.alert('Reset App', 'This will delete your profile and plan. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          router.replace('/onboarding');
        },
      },
    ]);
  }

  const totalSets = workout?.exercises.reduce((s, ex) => s + ex.sets, 0) ?? 0;
  const doneSets = Object.values(sets)
    .flat()
    .filter(Boolean).length;
  const pct = totalSets > 0 ? doneSets / totalSets : 0;

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.empty}>No plan found.</Text>
          <Text style={[styles.empty, { color: colors.accent, marginTop: 8 }]} onPress={() => router.replace('/onboarding')}>
            Start onboarding
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (restDay) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.dateLabel}>{formatDate()}</Text>
          <Pressable onPress={handleReset}>
            <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Text style={{ fontSize: 56 }}>🛌</Text>
          <Text style={[styles.title, { marginTop: spacing.lg, textAlign: 'center' }]}>Rest Day</Text>
          <Text style={[styles.sub, { textAlign: 'center', marginTop: spacing.sm }]}>
            Recovery is where the gains happen.{'\n'}See you tomorrow.
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
          <View>
            <Text style={styles.dateLabel}>{formatDate()}</Text>
            <Text style={styles.title}>{workout?.workoutType ?? 'Workout'}</Text>
          </View>
          <Pressable onPress={handleReset}>
            <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {doneSets}/{totalSets} sets
          </Text>
        </View>

        {/* Exercises */}
        {workout?.exercises.map((ex) => (
          <ExerciseCard
            key={ex.exerciseId}
            ex={ex}
            completedSets={sets[ex.exerciseId] ?? []}
            onToggle={(i) => toggleSet(ex.exerciseId, i)}
          />
        ))}

        {/* Done banner */}
        {totalSets > 0 && doneSets === totalSets && (
          <View style={styles.doneBanner}>
            <Text style={styles.doneText}>Workout complete 🎉</Text>
          </View>
        )}

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ExerciseCard({
  ex,
  completedSets,
  onToggle,
}: {
  ex: PlannedExercise;
  completedSets: boolean[];
  onToggle: (i: number) => void;
}) {
  const info = getExercise(ex.exerciseId);
  const allDone = completedSets.length > 0 && completedSets.every(Boolean);

  return (
    <Pressable
      style={[styles.card, allDone && styles.cardDone]}
      onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: ex.exerciseId } })}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exName}>{info?.name ?? ex.exerciseId}</Text>
          <Text style={styles.exMuscles}>{info?.primaryMuscles.join(', ')}</Text>
        </View>
        <View style={styles.setsChip}>
          <Text style={styles.setsChipText}>
            {ex.sets} × {ex.reps}
          </Text>
        </View>
      </View>

      {ex.notes ? <Text style={styles.exNotes}>{ex.notes}</Text> : null}

      <View style={styles.setsList}>
        {Array.from({ length: ex.sets }).map((_, i) => (
          <SetRow
            key={i}
            setNumber={i + 1}
            reps={ex.reps}
            completed={completedSets[i] ?? false}
            onToggle={() => onToggle(i)}
          />
        ))}
      </View>

      <Text style={styles.tapHint}>
        Tap card to see exercise animation →
      </Text>
    </Pressable>
  );
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  dateLabel: { ...typography.label, color: colors.accent, marginBottom: 4 },
  title: { ...typography.headingLarge },
  sub: { ...typography.bodyMedium },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  empty: { ...typography.bodyLarge, color: colors.textSecondary },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressLabel: { ...typography.bodySmall, color: colors.textSecondary, minWidth: 56, textAlign: 'right' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardDone: {
    borderColor: 'rgba(200,240,49,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  exName: { ...typography.headingSmall },
  exMuscles: { ...typography.bodySmall, marginTop: 2 },
  exNotes: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  setsChip: {
    backgroundColor: colors.accentDim,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  setsChipText: { ...typography.accent, fontSize: 13 },
  setsList: { marginTop: spacing.xs },
  tapHint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  doneBanner: {
    backgroundColor: colors.accentDim,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200,240,49,0.3)',
    marginTop: spacing.md,
  },
  doneText: { ...typography.headingMedium, color: colors.accent },
});
