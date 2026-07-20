import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { C, card } from '../theme';
import { WEEK, SONGS } from '../data/mock';

const LV = [C.fillGray, '#C7DEFF', '#8FBEFF', '#4795FF', C.tintBlue];

export default function StatsScreen() {
  const streak = useMemo(() => {
    let s = 13;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: 56 }, (_, i) => {
      const r = rnd();
      return i >= 44 ? (r < 0.2 ? 2 : r < 0.6 ? 3 : 4)
                     : (r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4);
    });
  }, []);

  const maxH = Math.max(...SONGS.map((x) => x.hours));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.pagehead}>
        <Text style={s.eyebrow}>PROGRESS</Text>
        <Text style={s.h1}>통계</Text>
      </View>

      {/* 주간 연습 시간 */}
      <View style={[card, s.section]}>
        <View style={s.rowBetween}>
          <Text style={s.big}>4시간 12분 <Text style={s.bigSub}>이번 주</Text></Text>
          <Text style={s.delta}>▲ 18%</Text>
        </View>
        <View style={s.chart}>
          {WEEK.map((w) => (
            <View key={w.d} style={s.col}>
              <View style={[s.bar, { height: `${w.v * 100}%`, backgroundColor: w.today ? C.tintBlue : C.trackGray }]} />
              <Text style={[s.dl, w.today && { color: C.tintBlue, fontWeight: '700' }]}>{w.d}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 스트릭 */}
      <View style={[card, s.section]}>
        <View style={s.rowBetween}>
          <Text style={s.cardTitle}>연습 스트릭 <Text style={{ color: C.tintBlue }}>🔥 12일</Text></Text>
          <Text style={s.mutedSm}>최근 8주</Text>
        </View>
        <View style={s.grid}>
          {streak.map((lv, i) => (
            <View key={i} style={[s.cell, { backgroundColor: LV[lv] }]} />
          ))}
        </View>
      </View>

      {/* 곡별 누적 */}
      <View style={[card, s.section]}>
        <Text style={s.cardTitle}>곡별 누적 연습</Text>
        {SONGS.map((song, i) => (
          <View key={song.id} style={[s.songRow, i > 0 && s.songDivider]}>
            <Text style={s.songName} numberOfLines={1}>{song.name}</Text>
            <View style={s.songTrack}>
              <View style={[s.songFill, { width: `${(song.hours / maxH) * 100}%` }]} />
            </View>
            <Text style={s.songH}>{song.hours}h</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pagehead: { paddingHorizontal: 20, paddingTop: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 0.8, color: C.muted, fontWeight: '600' },
  h1: { fontSize: 30, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 2 },
  section: { marginHorizontal: 20, marginTop: 12, padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  big: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.4 },
  bigSub: { fontSize: 13, color: C.muted, fontWeight: '500' },
  delta: { fontSize: 13, color: C.good, fontWeight: '700' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8, marginTop: 14 },
  col: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: 6 },
  bar: { width: '100%', borderRadius: 6, minHeight: 4 },
  dl: { fontSize: 11, color: C.muted },
  cardTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  mutedSm: { fontSize: 11, color: C.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 12 },
  cell: { width: `${100 / 14 - 1.1}%`, aspectRatio: 1, borderRadius: 3 },
  songRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  songDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  songName: { fontSize: 13, fontWeight: '600', color: C.text, width: 110 },
  songTrack: { flex: 1, height: 8, backgroundColor: C.fillGray, borderRadius: 4, overflow: 'hidden' },
  songFill: { height: '100%', backgroundColor: C.tintBlue },
  songH: { fontSize: 12, color: C.muted, width: 44, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
