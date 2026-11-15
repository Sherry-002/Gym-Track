export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  daysPerWeek: number;
}

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
}

export interface WorkoutDay {
  dayName: string;
  workoutType: string;
  exercises: PlannedExercise[];
}

export interface WorkoutPlan {
  summary: string;
  split: string;
  daysPerWeek: number;
  schedule: WorkoutDay[];
  notes: string;
}

const SYSTEM_PROMPT = `You are an expert personal trainer specializing in beginner fitness programs.
Create personalized workout plans that are safe, effective, and achievable for people new to the gym.
Always respond with valid JSON only — no markdown, no code blocks, no explanation outside the JSON.`;

export async function generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;
  if (!apiKey) throw new Error('API key not configured');

  const weightDisplay = `${profile.weight} ${profile.weightUnit}`;
  const userPrompt = `Create a beginner workout plan for:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Weight: ${weightDisplay}
- Available days per week: ${profile.daysPerWeek}

Only use exercises from this list (use exact exerciseId values):
lat-pulldown, chest-press, leg-press, seated-cable-row, shoulder-press, leg-curl, leg-extension, cable-fly, squat, treadmill

Respond with this exact JSON structure — no extra text:
{
  "summary": "2-3 sentence personalized overview",
  "split": "Full Body / Upper-Lower / Push-Pull-Legs",
  "daysPerWeek": ${profile.daysPerWeek},
  "schedule": [
    {
      "dayName": "Day A",
      "workoutType": "Full Body",
      "exercises": [
        {
          "exerciseId": "lat-pulldown",
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 90,
          "notes": "one short tip for the beginner"
        }
      ]
    }
  ],
  "notes": "One paragraph of beginner-friendly advice"
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-5-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text: string = data.content[0].text;

  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned) as WorkoutPlan;
}
