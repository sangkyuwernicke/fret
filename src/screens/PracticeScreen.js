import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Audio } from 'expo-av';
import ABLoopSlider from '../components/ABLoopSlider';
import SheetModal from '../components/SheetModal';
import { useRecordings } from '../components/RecordingsContext';
import { C, card, fmt } from '../theme';

const DURATION = 272; // 데모용 (실서비스에선 player.getDuration()으로 대체)
const SPEEDS = [0.5, 0.75, 0.9, 1.0];

export default function PracticeScreen() {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.9);
  const [loop, setLoop] = useState({ a: 72, b: 108 });
  const [loopCount, setLoopCount] = useState(12);
  const [sheetOpen, setSheetOpen] = useState(false);

  // ---- A–B 반복: 재생 위치 감시 → B 도달 시 A로 시킹 ----
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(async () => {
      try {
        const cur = await playerRef.current?.getCurrentTime();
        if (cur != null && cur >= loop.b) {
          playerRef.current?.seekTo(loop.a, true);
          setLoopCount((c) => c + 1);
        }
      } catch {}
    }, 400);
    return () => clearInterval(t);
  }, [playing, loop]);

  // ---- 녹음 (expo-av) ----
  const { addRecording } = useRecordings();
  const [recording, setRecording] = useState(null);
  const [recSec, setRecSec] = useState(0);
  const recTimer = useRef(null);

  const startRec = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) { Alert.alert('마이크 권한이 필요해요'); return; }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
      setRecSec(0);
      recTimer.current = setInterval(() => setRecSec((s) => s + 1), 1000);
    } catch (e) {
      Alert.alert('녹음을 시작할 수 없어요', String(e));
    }
  };

  const stopRec = async () => {
    clearInterval(recTimer.current);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      addRecording({ song: 'Hotel California', section: '솔로', dur: recSec, uri });
      Alert.alert('녹음 저장됨', `${fmt(recSec)} · 녹음 탭에서 확인하세요`);
    } catch {}
    setRecording(null);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.pagehead}>
        <Text style={s.eyebrow}>TODAY'S SESSION</Text>
        <Text style={s.h1}>연습</Text>
      </View>

      {/* YouTube — 실제 영상 위에서 A-B 루프가 동작 */}
      <View style={s.video}>
        <YoutubePlayer
          ref={playerRef}
          height={200}
          play={playing}
          videoId="2GsVBQ6dPUw"
          playbackRate={speed}
          onChangeState={(st) => {
            if (st === 'playing') setPlaying(true);
            if (st === 'paused' || st === 'ended') setPlaying(false);
          }}
        />
      </View>

      {/* A–B 구간 반복 */}
      <View style={[card, s.section]}>
        <View style={s.rowBetween}>
          <Text style={s.cardTitle}>A–B 구간 반복</Text>
          <Text style={s.muted}>반복 <Text style={s.blueBold}>{loopCount}</Text>회</Text>
        </View>
        <ABLoopSlider
          duration={DURATION}
          a={loop.a}
          b={loop.b}
          onChange={setLoop}
          onCommit={({ a }) => playerRef.current?.seekTo(a, true)}
        />
        {/* 속도 — iOS 세그먼트 컨트롤 */}
        <View style={s.segment}>
          {SPEEDS.map((sp) => (
            <Pressable
              key={sp}
              onPress={() => setSpeed(sp)}
              style={[s.segItem, speed === sp && s.segItemOn]}
            >
              <Text style={[s.segText, speed === sp && s.segTextOn]}>{sp}x</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 녹음 / 악보 */}
      <View style={s.rowBtns}>
        <Pressable
          style={[s.bigBtn, recording ? s.recOn : s.recOff]}
          onPress={recording ? stopRec : startRec}
        >
          <View style={[s.recDot, recording && s.recDotOn]} />
          <Text style={[s.bigBtnText, { color: recording ? '#fff' : C.rec }]}>
            {recording ? `녹음 중 ${fmt(recSec)}` : '녹음 시작'}
          </Text>
        </Pressable>
        <Pressable style={s.bigBtn} onPress={() => setSheetOpen(true)}>
          <Text style={[s.bigBtnText, { color: C.tintBlue }]}>🎼 악보 보기</Text>
        </Pressable>
      </View>

      {/* 오늘 요약 */}
      <View style={[card, s.section, s.todayBar]}>
        {[['42분', '오늘 연습'], [String(loopCount), '구간 반복'], ['2', '녹음']].map(([v, k], i) => (
          <View key={k} style={[s.todayCell, i > 0 && s.todayDivider]}>
            <Text style={s.todayV}>{v}</Text>
            <Text style={s.todayK}>{k}</Text>
          </View>
        ))}
      </View>

      <SheetModal visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pagehead: { paddingHorizontal: 20, paddingTop: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 0.8, color: C.muted, fontWeight: '600' },
  h1: { fontSize: 30, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 2 },
  video: { marginHorizontal: 20, marginTop: 14, borderRadius: 18, overflow: 'hidden', backgroundColor: '#1d1d21' },
  section: { marginHorizontal: 20, marginTop: 12, padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: C.text },
  muted: { fontSize: 13, color: C.muted },
  blueBold: { color: C.tintBlue, fontWeight: '700' },
  segment: { flexDirection: 'row', backgroundColor: C.fillGray, borderRadius: 10, padding: 2, marginTop: 8 },
  segItem: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  segItemOn: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  segText: { fontSize: 13, fontWeight: '600', color: C.text },
  segTextOn: { color: C.text },
  rowBtns: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginTop: 14 },
  bigBtn: { flex: 1, paddingVertical: 15, borderRadius: 16, backgroundColor: C.card,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...card },
  bigBtnText: { fontSize: 15, fontWeight: '600' },
  recOff: { backgroundColor: C.recBg },
  recOn: { backgroundColor: C.rec },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.rec },
  recDotOn: { backgroundColor: '#fff', borderRadius: 2 },
  todayBar: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 0 },
  todayCell: { flex: 1, alignItems: 'center' },
  todayDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  todayV: { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  todayK: { fontSize: 11, color: C.muted, marginTop: 2 },
});
