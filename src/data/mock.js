export const SONGS = [
  { id: 's1', emoji: '🦅', name: 'Hotel California', artist: 'Eagles', section: '솔로', progress: 0.7, hours: 14.2, videoId: '2GsVBQ6dPUw' },
  { id: 's2', emoji: '🌧️', name: 'November Rain', artist: "Guns N' Roses", section: '인트로', progress: 0.35, hours: 5.5, videoId: '8SbUC-UaAxE' },
  { id: 's3', emoji: '🌊', name: 'Wonderful Tonight', artist: 'Eric Clapton', section: '전곡', progress: 0.55, hours: 8.8, videoId: 'vUSzL2leaFM' },
  { id: 's4', emoji: '🔥', name: '벚꽃 엔딩', artist: '버스커 버스커', section: '코드', progress: 0.15, hours: 1.9, videoId: 'tXV7dfvSefo' },
];

export const DONE_SONGS = [
  { id: 'd1', emoji: '✅', name: 'Wish You Were Here', artist: 'Pink Floyd · 4월 완주', progress: 1 },
];

export const SEED_RECORDINGS = [
  { id: 'r1', song: 'Hotel California', section: '솔로', dur: 49, date: '오늘 · 7월 6일', seed: 7, hot: true },
  { id: 'r2', song: 'November Rain', section: '인트로', dur: 72, date: '오늘 · 7월 6일', seed: 4 },
  { id: 'r3', song: 'Wonderful Tonight', section: '전곡', dur: 220, date: '7월 4일', seed: 5 },
  { id: 'r4', song: 'Hotel California', section: '솔로', dur: 55, date: '7월 1일', seed: 2 },
];

export const WEEK = [
  { d: '월', v: 0.4 }, { d: '화', v: 0.65 }, { d: '수', v: 0.2 },
  { d: '목', v: 0.8 }, { d: '금', v: 0.5 }, { d: '토', v: 0.08 },
  { d: '일', v: 0.58, today: true },
];

const M = [
  ['e|--------12b14--12----------------|','B|--15b17------------15-12---------|','G|-------------------------14-12---|','D|---------------------------------|','A|---------------------------------|','E|---------------------------------|'],
  ['e|--12------------------------------|','B|-----15-12-----12-----------------|','G|-----------14b16---14-12----------|','D|--------------------------14------|','A|----------------------------------|','E|----------------------------------|'],
  ['e|----------------7-8---------------|','B|--8-10-8----8/10-----10b12--------|','G|---------9------------------------|','D|----------------------------------|','A|----------------------------------|','E|----------------------------------|'],
  ['e|---------------------------------|','B|--12b14--12--10--12b14~~---------|','G|---------------------------------|','D|---------------------------------|','A|---------------------------------|','E|---------------------------------|'],
];
export const TAB_MEASURES = Array.from({ length: 8 }, (_, i) => ({
  no: 17 + i,
  mark: i === 0 ? 'A' : i === 7 ? 'B' : null,
  lines: M[i % 4],
}));
