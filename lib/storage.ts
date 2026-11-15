import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WorkoutPlan } from './claude';

const PROFILE_KEY = '@gymtrack:profile';
const PLAN_KEY = '@gymtrack:plan';
const PLAN_DATE_KEY = '@gymtrack:plan_date';

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export async function savePlan(plan: WorkoutPlan): Promise<void> {
  await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  await AsyncStorage.setItem(PLAN_DATE_KEY, new Date().toISOString());
}

export async function loadPlan(): Promise<WorkoutPlan | null> {
  try {
    const raw = await AsyncStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as WorkoutPlan) : null;
  } catch {
    return null;
  }
}

export async function clearAll(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(PROFILE_KEY),
    AsyncStorage.removeItem(PLAN_KEY),
    AsyncStorage.removeItem(PLAN_DATE_KEY),
  ]);
}

export async function hasSetup(): Promise<boolean> {
  const [profile, plan] = await Promise.all([
    AsyncStorage.getItem(PROFILE_KEY),
    AsyncStorage.getItem(PLAN_KEY),
  ]);
  return !!profile && !!plan;
}
