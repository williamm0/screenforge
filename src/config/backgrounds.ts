export type BackgroundId = 'light' | 'dark' | 'gradient' | 'warm' | 'cool' | 'transparent';

export type BackgroundConfig = {
  id: BackgroundId;
  label: string;
  swatch: string;
};

export const BACKGROUNDS: BackgroundConfig[] = [
  { id: 'light', label: 'Solid light', swatch: '#f5f5f7' },
  { id: 'dark', label: 'Solid dark', swatch: '#272729' },
  { id: 'gradient', label: 'Soft gradient', swatch: 'linear-gradient(135deg, #ffffff, #dfe7f3)' },
  { id: 'warm', label: 'Warm studio', swatch: '#efe5d8' },
  { id: 'cool', label: 'Cool studio', swatch: '#e7edf4' },
  { id: 'transparent', label: 'Transparent', swatch: 'transparent' },
];
