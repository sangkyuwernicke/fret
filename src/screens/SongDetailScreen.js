import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import ABLoopSlider from '../components/ABLoopSlider';
import SheetModal from '../components/SheetModal';
import { useRecordings } from '../components/RecordingsContext';
import { C, card, fmt } from '../theme';

const SPEEDS = [0.5, 0.75, 0.9, 1.0];

export default function SongDetailScreen({ route, navigation }) {
  const { song } = route.params;
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.9);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState({ a: 0, b: 0 });
  const [loopCount, setLoopCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { recordings } = useRecordings();
  const songRecordings = recordings.filter((r) => r.song === song.name);

  const handleReady = async () => {
    try {
      const d = await playerRef.current?.getDuration();
      if (d > 0) setDuration(d);
    } catch {}
  };

  useEffect(() => {
    if (duration > 0 && loop.a === 0 && loop.b === 0) {
      setLoop({ a: 0, b: Math.min(Math.floor(duration / 4), 90) });
    }
  }, [duration]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(async () => {
      try {
        const cur = await playerRef.current?.getCurrentTime();
        if (cur != null) {
          setCurrentTime(cur);
          if (cur >= loop.b) {
            playerRef.current?.seekTo(loop.a, true);
            setLoopCount((c) => c + 1);
          }
        }
      } catch {}
    }, 400);
    return () => clearInterval(t);
  }, [playing, loop]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* 헤더 */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={C.tintBlue} />
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={s.headerEmoji}>{song.emoji}</Text>
          <View>
            <Text style={s.headerTitle} numberOfLines={1}>{song.name}</Text>
            <Text style={s.headerArtist}>{song.artist}</Text>
          </View>
        </View>
        {song.section && (
          <View style={s.badge}><Text style={s.badgeText}>{song.section}</Text></View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        {/* 진행도 */}
        <View style={[card, s.section]}>
          <View style={s.rowBetween}>
            <Text style={s.cardLabel}>진행도</Text>
            <Text style={s.blueText}>{Math.round(song.progress * 100)}%</Text>
          </View>
          <View style={s.progTrack}>
            <View style={[s.progFill, { width: `${song.progress * 100}%` }]} />
          </View>
          {song.hours != null && (
            <Text style={s.hoursText}>누적 {song.hours}시간 연습</Text>
          )}
        </View>

        {/* 유튜브 */}
        <View style={s.video}>
          <YoutubePlayer
            ref={playerRef}
            height={210}
            play={playing}
            videoId={song.videoId}
            playbackRate={speed}
            onReady={handleReady}
            onChangeState={(st) => {
              if (st === 'playing') setPlaying(true);
              if (st === 'paused' || st === 'ended') setPlaying(false);
            }}
          />
        </View>

        {/* A-B 반복 */}
        <View style={[card, s.section]}>
          <View style={s.rowBetween}>
            <Text style={s.cardLabel}>A–B 구간 반복</Text>
            <Text style={s.mutedText}>반복 <Text style={s.blueText}>{loopCount}</Text>회</Text>
          </View>
          <ABLoopSlider
            duration={duration}
            a={loop.a}
            b={loop.b}
            currentTime={currentTime}
            onChange={setLoop}
            onCommit={({ a }) => playerRef.current?.seekTo(a, true)}
          />
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

        {/* 악보 */}
        <Pressable style={[card, s.sheetBtn]} onPress={() => setSheetOpen(true)}>
          <Text style={s.sheetBtnText}>🎼  악보 보기</Text>
          <Ionicons name="chevron-forward" size={16} color={C.tintBlue} />
        </Pressable>

        {/* 이 곡의 녹음 */}
        <Text style={s.secLabel}>녹음 기록</Text>
        {songRecordings.length === 0 ? (
          <View style={[card, s.emptyCard]}>
            <Text style={s.emptyText}>아직 녹음이 없어요</Text>
            <Text style={s.emptyHint}>연습 탭에서 녹음을 시작해보세요</Text>
          </View>
        ) : (
          songRecordings.map((rec) => (
            <RecordingRow key={rec.id} rec={rec} />
          ))
        )}
      </ScrollView>

      <SheetModal visible={sheetOpen} onClose={() => setSheetOpen(false)} song={song} />
    </SafeAreaView>
  );
}

function RecordingRow({ rec }) {
  return (
    <View style={[card, s.recCard]}>
      <View style={s.waveWrap}>
        {Array.from({ length: 18 }, (_, i) => (
          <View
            key={i}
            style={[s.waveBar, { height: 4 + ((rec.seed * (i + 1) * 7) % 20) }]}
          />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <View style={s.rowBetween}>
          <Text style={s.recSection}>{rec.section}</Text>
          {rec.hot && <View style={s.hotDot} />}
        </View>
        <Text style={s.recMeta}>{fmt(rec.dur)} · {rec.date}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
    backgroundColor: C.bg,
  },
  backBtn: { padding: 2 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerEmoji: { fontSize: 28 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.text },
  headerArtist: { fontSize: 13, color: C.muted, marginTop: 1 },
  badge: {
    backgroundColor: C.tintBlueBg, borderRadius: 7,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: C.tintBlue },

  video: {
    marginHorizontal: 20, marginTop: 4,
    borderRadius: 18, overflow: 'hidden', backgroundColor: '#1d1d21',
  },
  section: { marginHorizontal: 20, marginTop: 12, padding: 16 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardLabel: { fontSize: 13, fontWeight: '700', color: C.text },
  blueText: { fontSize: 14, fontWeight: '700', color: C.tintBlue },
  mutedText: { fontSize: 13, color: C.muted },

  progTrack: { height: 6, backgroundColor: C.fillGray, borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: C.tintBlue, borderRadius: 4 },
  hoursText: { fontSize: 12, color: C.muted, marginTop: 7 },

  segment: {
    flexDirection: 'row', backgroundColor: C.fillGray,
    borderRadius: 10, padding: 2, marginTop: 8,
  },
  segItem: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  segItemOn: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  segText: { fontSize: 13, fontWeight: '600', color: C.text },
  segTextOn: { color: C.text },

  sheetBtn: {
    marginHorizontal: 20, marginTop: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16,
  },
  sheetBtnText: { fontSize: 15, fontWeight: '600', color: C.tintBlue },

  secLabel: {
    fontSize: 12, color: C.muted, fontWeight: '600',
    marginTop: 22, marginHorizontal: 24, letterSpacing: 0.5,
  },
  emptyCard: { marginHorizontal: 20, marginTop: 10, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 15, fontWeight: '600', color: C.text },
  emptyHint: { fontSize: 13, color: C.muted, marginTop: 4 },

  recCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, marginTop: 10, padding: 14,
  },
  waveWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, width: 54, height: 28 },
  waveBar: { width: 2.5, backgroundColor: C.tintBlue, borderRadius: 2, opacity: 0.7 },
  recSection: { fontSize: 14, fontWeight: '600', color: C.text },
  recMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  hotDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.rec },
});
