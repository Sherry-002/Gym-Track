import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { hasSetup } from '@/lib/storage';
import { colors } from '@/theme';

export default function Root() {
  useEffect(() => {
    hasSetup().then((ready) => {
      if (ready) {
        router.replace('/(tabs)/today');
      } else {
        router.replace('/onboarding');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}
