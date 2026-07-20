import React, { useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import Waveform from '../components/Waveform';
import { useRecordings } from '../components/RecordingsContext';
import { C, card, fmt } from '../theme';

function PlayBtn({ item }) {
  const soundRef = useRef(null);
  const play = async () => {
    if (!item.uri) { Alert.alert('데모 녹음', '실제 녹음 파일이 있는 항목만 재생됩니다'); return; }
    try {
      if (soundRef.current) { await soundRef.current.unloadAsync(); soundRef.current = null; }
      const { sound } = await Audio.Sound.createAsync({ uri: item.uri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) { Alert.alert('재생 오류', String(e)); }
  };
  return (
    <Pressable style={s.pp} onPress={play}>
      <Text style={{ color: C.tintBlue, fontSize: 13, marginLeft: 2 }}>▶</Text>
    </Pressable>
  );
}

export default function RecordingsScreen() {
  const { recordings } = useRecordings();
  const groups = recordings.reduce((acc, r) => {
    (acc[r.date] = acc[r.date] || []).push(r);
    return acc;
  }, {});

  const hc = recordings.filter((r) => r.song === 'Hotel California');
  const latest = hc[0], oldest = hc[hc.length - 1];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.pagehead}>
        <Text style={s.eyebrow}>ARCHIVE</Text>
        <Text style={s.h1}>녹음 기록</Text>
        <Text style={s.sub}>총 {recordings.length + 43}개 · 이번 달 {recordings.length + 5}개</Text>
      </View>

      {/* 성장 비교 카드 */}
      {latest && oldest && latest !== oldest && (
        <View style={[card, s.section]}>
          <Text style={s.cmpTitle}>📈 성장 비교 — Hotel California 솔로</Text>
          {[{ label: '이전', item: oldest }, { label: '오늘', item: latest, hot: true }].map(({ label, item, hot }) => (
            <View key={label} style={s.cmpRow}>
              <Text style={[s.cmpLabel, hot && { color: C.tintBlue, fontWeight: '700' }]}>{label}</Text>
              <PlayBtn item={item} />
              <Waveform seed={item.seed} hot={hot} />
              <Text style={s.cmpDur}>{fmt(item.dur)}</Text>
            </View>
          ))}
          <Text style={s.cmpNote}>같은 구간을 시간차로 비교 청취해 보세요</Text>
        </View>
      )}

      {Object.entries(groups).map(([date, items]) => (
        <View key={date} style={{ marginHorizontal: 20, marginTop: 16 }}>
          <Text style={s.dateLabel}>{date}</Text>
          {items.map((item) => (
            <View key={item.id} style={[card, s.recCard]}>
              <PlayBtn item={item} />
              <Waveform seed={item.seed} hot={item.hot} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.recName}>{item.song}</Text>
                <Text style={s.recMeta}>{item.section} · {fmt(item.dur)}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pagehead: { paddingHorizontal: 20, paddingTop: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 0.8, color: C.muted, fontWeight: '600' },
  h1: { fontSize: 30, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 2 },
  sub: { fontSize: 14, color: C.muted, marginTop: 3 },
  section: { marginHorizontal: 20, marginTop: 12, padding: 16 },
  cmpTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 8 },
  cmpRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  cmpLabel: { fontSize: 12, color: C.muted, width: 36 },
  cmpDur: { fontSize: 12, color: C.muted, fontVariant: ['tabular-nums'] },
  cmpNote: { fontSize: 11, color: C.muted, marginTop: 8 },
  dateLabel: { fontSize: 13, fontWeight: '600', color: C.muted },
  recCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, padding: 13, borderRadius: 16 },
  pp: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.tintBlueBg, alignItems: 'center', justifyContent: 'center' },
  recName: { fontSize: 13, fontWeight: '600', color: C.text },
  recMeta: { fontSize: 11, color: C.muted, marginTop: 1 },
});
