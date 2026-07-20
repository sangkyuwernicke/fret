// iOS-style light minimal design tokens
export const C = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  line: 'rgba(60,60,67,0.1)',
  text: '#1C1C1E',
  muted: '#8E8E93',
  faint: '#AEAEB2',
  tintBlue: '#007AFF',
  tintBlueBg: 'rgba(0,122,255,0.1)',
  rec: '#FF3B30',
  recBg: 'rgba(255,59,48,0.1)',
  good: '#34C759',
  trackGray: '#E3E3E8',
  fillGray: '#EFEFF3',
};

export const card = {
  backgroundColor: C.card,
  borderRadius: 18,
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
};

export const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
