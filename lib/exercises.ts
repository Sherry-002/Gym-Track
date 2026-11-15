export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Cardio';
  description: string;
  tips: string[];
  defaultSets: number;
  defaultReps: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    primaryMuscles: ['Lats', 'Upper Back'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Cable Machine',
    category: 'Pull',
    description:
      'Sit with thighs under the pad. Grip the bar wider than shoulder-width. Pull the bar down to your upper chest, squeezing your lats at the bottom. Control the weight back up.',
    tips: ['Lean back slightly, chest up', 'Drive your elbows down and back', 'Full stretch at the top'],
    defaultSets: 3,
    defaultReps: '10-12',
  },
  {
    id: 'chest-press',
    name: 'Chest Press',
    primaryMuscles: ['Chest', 'Front Delts'],
    secondaryMuscles: ['Triceps'],
    equipment: 'Chest Press Machine',
    category: 'Push',
    description:
      'Adjust the seat so handles are at chest height. Push the handles forward until arms are nearly straight. Slowly return to the start position.',
    tips: ['Keep your back flat on the pad', 'Breathe out as you push', 'Do not lock your elbows out'],
    defaultSets: 3,
    defaultReps: '10-12',
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves'],
    equipment: 'Leg Press Machine',
    category: 'Legs',
    description:
      'Place feet shoulder-width apart on the platform. Release the safety handles and lower the platform until knees reach 90°. Push through your heels to extend.',
    tips: ['Never lock your knees at the top', 'Keep your lower back flat', 'Feet flat on the platform'],
    defaultSets: 3,
    defaultReps: '12-15',
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    primaryMuscles: ['Mid Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Cable Machine',
    category: 'Pull',
    description:
      'Sit tall on the bench, feet on the platform. Grab the handle with arms extended. Pull the handle to your lower abdomen, squeezing your shoulder blades together.',
    tips: ['Sit tall throughout', 'Pull elbows back, not up', 'Squeeze shoulder blades at the end'],
    defaultSets: 3,
    defaultReps: '10-12',
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    primaryMuscles: ['Front Delts', 'Side Delts'],
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    equipment: 'Shoulder Press Machine',
    category: 'Push',
    description:
      'Adjust the seat so handles are at shoulder height. Push the handles straight up until arms are almost fully extended. Lower slowly back to the start.',
    tips: ['Avoid shrugging your traps', 'Keep your core braced', 'Control the weight on the way down'],
    defaultSets: 3,
    defaultReps: '10-12',
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    equipment: 'Leg Curl Machine',
    category: 'Legs',
    description:
      'Lie face-down on the machine with the pad just above your heels. Curl your legs up toward your glutes as far as possible. Slowly lower back down.',
    tips: ['Squeeze the hamstrings at the top', 'Do not arch your lower back', 'Full range of motion'],
    defaultSets: 3,
    defaultReps: '12-15',
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    primaryMuscles: ['Quads'],
    secondaryMuscles: [],
    equipment: 'Leg Extension Machine',
    category: 'Legs',
    description:
      'Sit with the pad across the front of your lower legs. Straighten your legs fully, squeezing your quads at the top. Lower slowly back to the start.',
    tips: ['Point toes slightly up', 'Pause and squeeze at the top', 'Control the descent'],
    defaultSets: 3,
    defaultReps: '12-15',
  },
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Delts'],
    equipment: 'Cable Machine',
    category: 'Push',
    description:
      'Set the cables at shoulder height. Stand in the middle with one foot forward. With a slight bend in the elbows, bring both handles together in front of your chest.',
    tips: ['Keep the slight elbow bend throughout', 'Focus on squeezing your chest', 'Controlled arc motion'],
    defaultSets: 3,
    defaultReps: '12-15',
  },
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'None',
    category: 'Legs',
    description:
      'Stand with feet shoulder-width apart. Keep your chest up and squat down until your thighs are parallel to the floor. Drive through your heels to stand back up.',
    tips: ['Knees track over toes', 'Keep your chest up and back straight', 'Full depth — thighs parallel'],
    defaultSets: 3,
    defaultReps: '15-20',
  },
  {
    id: 'treadmill',
    name: 'Treadmill Walk',
    primaryMuscles: ['Full Body', 'Cardiovascular'],
    secondaryMuscles: ['Calves', 'Quads'],
    equipment: 'Treadmill',
    category: 'Cardio',
    description:
      'Start at a comfortable walking pace (3–4 mph). Keep a tall posture with arms swinging naturally. Increase incline slightly to burn more calories without impact.',
    tips: ['Do not hold the handrails', 'Swing your arms naturally', '10–15 min is a solid warmup'],
    defaultSets: 1,
    defaultReps: '10 min',
  },
];

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
