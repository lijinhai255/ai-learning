export const colors = {
  ink: '#18212f',
  muted: '#64748b',
  primary: '#4454d9',
  surface: '#ffffff',
  canvas: '#f6f7fb',
  border: '#e5e7eb',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export type DesignColors = typeof colors;
export type DesignSpacing = typeof spacing;
