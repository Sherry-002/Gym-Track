export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#252525',
  surfaceBorder: 'rgba(255,255,255,0.08)',
  accent: '#C8F031',
  accentDim: 'rgba(200,240,49,0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8C8C8C',
  textTertiary: '#4A4A4A',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  onAccent: '#000000',
} as const;

export type Color = (typeof colors)[keyof typeof colors];
