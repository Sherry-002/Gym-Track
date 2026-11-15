import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EXERCISES, Exercise } from '@/lib/exercises';
import { AnimatedExercise } from '@/components/animated-exercise';
import { colors, spacing, radius, typography } from '@/theme';

const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Cardio'] as const;
type Category = (typeof CATEGORIES)[number];

export default function Exercises() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<Category>('All');

  const filtered = EXERCISES.filter((ex) => {
    const matchesCat = cat === 'All' || ex.category === cat;
    const matchesSearch =
      search.length === 0 ||
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Exercises</Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textTertiary} style={{ marginRight: spacing.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises or muscles…"
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.catChip, cat === c && styles.catChipActive]}
              onPress={() => setCat(c)}
            >
              <Text style={[styles.catText, cat === c && styles.catTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Grid */}
        <View style={styles.grid}>
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const categoryColors: Record<string, string> = {
    Push: '#FF9F43',
    Pull: '#54A0FF',
    Legs: '#5F27CD',
    Cardio: '#00D2D3',
  };
  const catColor = categoryColors[exercise.category] ?? colors.accent;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
      onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: exercise.id } })}
    >
      <View style={styles.cardFigure}>
        <AnimatedExercise exerciseId={exercise.id} size={100} />
      </View>

      <View style={styles.cardBody}>
        <View style={[styles.catBadge, { backgroundColor: `${catColor}20` }]}>
          <Text style={[styles.catBadgeText, { color: catColor }]}>{exercise.category}</Text>
        </View>
        <Text style={styles.exName}>{exercise.name}</Text>
        <Text style={styles.exMuscles}>{exercise.primaryMuscles.join(' · ')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...typography.headingLarge, marginBottom: spacing.lg },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  catRow: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  catChipActive: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accent,
  },
  catText: { ...typography.bodySmall, fontWeight: '600', color: colors.textSecondary },
  catTextActive: { color: colors.accent },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardFigure: {
    alignItems: 'center',
    paddingTop: spacing.md,
    backgroundColor: colors.surfaceElevated,
  },
  cardBody: {
    padding: spacing.md,
  },
  catBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
  catBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  exName: { ...typography.headingSmall, fontSize: 14, marginBottom: 2 },
  exMuscles: { ...typography.bodySmall, fontSize: 11 },
});
