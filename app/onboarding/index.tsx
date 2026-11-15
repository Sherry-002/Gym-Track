import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { AnimatedExercise } from '@/components/animated-exercise';
import { colors, spacing, typography, radius } from '@/theme';

const { width } = Dimensions.get('window');

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(200,240,49,0.07)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />

      <View style={styles.hero}>
        <View style={styles.figureWrap}>
          <AnimatedExercise exerciseId="lat-pulldown" size={width * 0.5} />
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>AI-Powered</Text>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.headline}>Your first gym{'\n'}plan starts here.</Text>
        <Text style={styles.sub}>
          Answer 4 quick questions. We generate a personalized beginner program made exactly for you.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Get Started" onPress={() => router.push('/onboarding/profile')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  figureWrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  badge: {
    position: 'absolute',
    top: spacing.lg,
    right: -spacing.sm,
    backgroundColor: colors.accentDim,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(200,240,49,0.3)',
  },
  badgeText: {
    ...typography.label,
    color: colors.accent,
  },
  copy: {
    paddingBottom: spacing.xxl,
  },
  headline: {
    ...typography.displayMedium,
    marginBottom: spacing.md,
  },
  sub: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  actions: {
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
});
