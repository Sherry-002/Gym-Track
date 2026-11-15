import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, G, Ellipse } from 'react-native-svg';
import { colors } from '@/theme';

interface Pose {
  leftHand: [number, number];
  rightHand: [number, number];
  leftFoot: [number, number];
  rightFoot: [number, number];
}

interface AnimationDef {
  restPose: Pose;
  peakPose: Pose;
  durationMs: number;
}

// ViewBox 160x200. Fixed anatomy points:
// Head center: (80,25) r=18
// Left shoulder: (52,58)  Right shoulder: (108,58)
// Left hip: (66,118)      Right hip: (94,118)
// Torso: (80,58) → (80,118)

const ANIMATIONS: Record<string, AnimationDef> = {
  'lat-pulldown': {
    restPose:  { leftHand: [22, 20],   rightHand: [138, 20],  leftFoot: [56, 185], rightFoot: [104, 185] },
    peakPose:  { leftHand: [52, 65],   rightHand: [108, 65],  leftFoot: [56, 185], rightFoot: [104, 185] },
    durationMs: 1200,
  },
  'chest-press': {
    restPose:  { leftHand: [25, 60],   rightHand: [135, 60],  leftFoot: [56, 185], rightFoot: [104, 185] },
    peakPose:  { leftHand: [52, 70],   rightHand: [108, 70],  leftFoot: [56, 185], rightFoot: [104, 185] },
    durationMs: 1000,
  },
  'leg-press': {
    restPose:  { leftHand: [45, 90],   rightHand: [115, 90],  leftFoot: [52, 150], rightFoot: [108, 150] },
    peakPose:  { leftHand: [45, 90],   rightHand: [115, 90],  leftFoot: [38, 190], rightFoot: [122, 190] },
    durationMs: 1200,
  },
  'seated-cable-row': {
    restPose:  { leftHand: [22, 80],   rightHand: [138, 80],  leftFoot: [56, 185], rightFoot: [104, 185] },
    peakPose:  { leftHand: [45, 95],   rightHand: [115, 95],  leftFoot: [56, 185], rightFoot: [104, 185] },
    durationMs: 1200,
  },
  'shoulder-press': {
    restPose:  { leftHand: [42, 72],   rightHand: [118, 72],  leftFoot: [56, 185], rightFoot: [104, 185] },
    peakPose:  { leftHand: [50, 10],   rightHand: [110, 10],  leftFoot: [56, 185], rightFoot: [104, 185] },
    durationMs: 1300,
  },
  'leg-curl': {
    restPose:  { leftHand: [42, 95],   rightHand: [118, 95],  leftFoot: [56, 185], rightFoot: [104, 185] },
    peakPose:  { leftHand: [42, 95],   rightHand: [118, 95],  leftFoot: [56, 185], rightFoot: [94, 140] },
    durationMs: 1000,
  },
  'leg-extension': {
    restPose:  { leftHand: [42, 95],   rightHand: [118, 95],  leftFoot: [56, 185], rightFoot: [94, 165] },
    peakPose:  { leftHand: [42, 95],   rightHand: [118, 95],  leftFoot: [56, 185], rightFoot: [130, 148] },
    durationMs: 1000,
  },
  'cable-fly': {
    restPose:  { leftHand: [15, 55],   rightHand: [145, 55],  leftFoot: [50, 185], rightFoot: [110, 185] },
    peakPose:  { leftHand: [60, 88],   rightHand: [100, 88],  leftFoot: [50, 185], rightFoot: [110, 185] },
    durationMs: 1300,
  },
  squat: {
    restPose:  { leftHand: [42, 95],   rightHand: [118, 95],  leftFoot: [44, 185], rightFoot: [116, 185] },
    peakPose:  { leftHand: [32, 115],  rightHand: [128, 115], leftFoot: [44, 165], rightFoot: [116, 165] },
    durationMs: 1400,
  },
  treadmill: {
    restPose:  { leftHand: [32, 80],   rightHand: [120, 100], leftFoot: [48, 175], rightFoot: [100, 190] },
    peakPose:  { leftHand: [60, 100],  rightHand: [92, 80],   leftFoot: [60, 190], rightFoot: [112, 175] },
    durationMs: 600,
  },
};

const DEFAULT_ANIM: AnimationDef = {
  restPose:  { leftHand: [42, 95], rightHand: [118, 95], leftFoot: [56, 185], rightFoot: [104, 185] },
  peakPose:  { leftHand: [42, 95], rightHand: [118, 95], leftFoot: [56, 185], rightFoot: [104, 185] },
  durationMs: 1000,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPose(rest: Pose, peak: Pose, t: number): Pose {
  return {
    leftHand:  [lerp(rest.leftHand[0],  peak.leftHand[0],  t), lerp(rest.leftHand[1],  peak.leftHand[1],  t)],
    rightHand: [lerp(rest.rightHand[0], peak.rightHand[0], t), lerp(rest.rightHand[1], peak.rightHand[1], t)],
    leftFoot:  [lerp(rest.leftFoot[0],  peak.leftFoot[0],  t), lerp(rest.leftFoot[1],  peak.leftFoot[1],  t)],
    rightFoot: [lerp(rest.rightFoot[0], peak.rightFoot[0], t), lerp(rest.rightFoot[1], peak.rightFoot[1], t)],
  };
}

// Smooth ease-in-out
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface Props {
  exerciseId: string;
  size?: number;
}

export function AnimatedExercise({ exerciseId, size = 160 }: Props) {
  const anim = ANIMATIONS[exerciseId] ?? DEFAULT_ANIM;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    setProgress(0);
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const cycle = (elapsed % (anim.durationMs * 2)) / anim.durationMs;
      const raw = cycle < 1 ? cycle : 2 - cycle;
      setProgress(easeInOut(raw));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [exerciseId, anim.durationMs]);

  const pose = lerpPose(anim.restPose, anim.peakPose, progress);
  const viewBoxH = 200;
  const scale = size / 160;
  const svgH = viewBoxH * scale;

  const lc = colors.accent;
  const bc = colors.textSecondary;

  return (
    <View style={{ width: size, height: svgH }}>
      <Svg width={size} height={svgH} viewBox={`0 0 160 ${viewBoxH}`}>
        {/* figure shadow / glow */}
        <Ellipse cx="80" cy="195" rx="32" ry="6" fill="rgba(200,240,49,0.07)" />

        {/* legs */}
        <Line x1="66" y1="118" x2={pose.leftFoot[0]}  y2={pose.leftFoot[1]}  stroke={bc} strokeWidth="4" strokeLinecap="round" />
        <Line x1="94" y1="118" x2={pose.rightFoot[0]} y2={pose.rightFoot[1]} stroke={bc} strokeWidth="4" strokeLinecap="round" />

        {/* torso */}
        <Line x1="80" y1="58" x2="80" y2="118" stroke={lc} strokeWidth="4" strokeLinecap="round" />

        {/* hip connector */}
        <Line x1="66" y1="118" x2="94" y2="118" stroke={lc} strokeWidth="3" strokeLinecap="round" />

        {/* arms */}
        <Line x1="52" y1="58" x2={pose.leftHand[0]}  y2={pose.leftHand[1]}  stroke={lc} strokeWidth="4" strokeLinecap="round" />
        <Line x1="108" y1="58" x2={pose.rightHand[0]} y2={pose.rightHand[1]} stroke={lc} strokeWidth="4" strokeLinecap="round" />

        {/* shoulder connector */}
        <Line x1="52" y1="58" x2="108" y2="58" stroke={lc} strokeWidth="3" strokeLinecap="round" />

        {/* neck */}
        <Line x1="80" y1="43" x2="80" y2="58" stroke={lc} strokeWidth="3.5" strokeLinecap="round" />

        {/* head */}
        <Circle cx="80" cy="25" r="18" fill={colors.surfaceElevated} stroke={lc} strokeWidth="3.5" />

        {/* hand dots */}
        <Circle cx={pose.leftHand[0]}  cy={pose.leftHand[1]}  r="5" fill={colors.accent} />
        <Circle cx={pose.rightHand[0]} cy={pose.rightHand[1]} r="5" fill={colors.accent} />

        {/* foot dots */}
        <Circle cx={pose.leftFoot[0]}  cy={pose.leftFoot[1]}  r="4" fill={bc} />
        <Circle cx={pose.rightFoot[0]} cy={pose.rightFoot[1]} r="4" fill={bc} />
      </Svg>
    </View>
  );
}
