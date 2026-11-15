import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadProfile, savePlan } from '@/lib/storage';
import { generateWorkoutPlan } from '@/lib/claude';
import { AnimatedExercise } from '@/components/animated-exercise';
import { colors, spacing, typography } from '@/theme';

const STEPS = [
  'Reading your profile…',
  'Choosing the right split…',
  'Selecting exercises…',
  'Building your schedule…',
  'Finalising your plan…',
];

const EXERCISE_IDS = ['lat-pulldown', 'shoulder-press', 'leg-press', 'squat', 'treadmill'];

export default function Generating() {
  const [stepIndex, setStepIndex] = useState(0);
  const [exIndex, setExIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Cycle step text every 1.5s
    const stepTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 1500);

    // Cycle exercise animation every 2s
    const exTimer = setInterval(() => {
      setExIndex((i) => (i + 1) % EXERCISE_IDS.length);
    }, 2000);

    // Fire the actual API call
    (async () => {
      try {
        const profile = await loadProfile();
        if (!profile) throw new Error('No profile found');
        const plan = await generateWorkoutPlan(profile);
        await savePlan(plan);
        clearInterval(stepTimer);
        clearInterval(exTimer);
        router.replace('/(tabs)/today');
      } catch (err) {
        clearInterval(stepTimer);
        clearInterval(exTimer);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    })();

    return () => {
      clearInterval(stepTimer);
      clearInterval(exTimer);
    };
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Couldn't generate plan</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <Text style={[styles.errorMsg, { marginTop: spacing.lg }]} onPress={() => router.back()}>
            ← Go back and try again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.figureWrap}>
          <AnimatedExercise exerciseId={EXERCISE_IDS[exIndex]} size={180} />
        </View>

        <Animated.View style={{ opacity }}>
          <Text style={styles.step}>{STEPS[stepIndex]}</Text>
        </Animated.View>

        <Text style={styles.sub}>Building your personalised beginner program</Text>

        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <PulseDot key={i} delay={i * 180} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function PulseDot({ delay }: { delay: number }) {
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.6, duration: 400, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent,
        margin: 4,
        transform: [{ scale }],
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  figureWrap: {
    marginBottom: spacing.xxl,
  },
  step: {
    ...typography.headingMedium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sub: {
    ...typography.bodyMedium,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorTitle: {
    ...typography.headingLarge,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorMsg: {
    ...typography.bodyMedium,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
