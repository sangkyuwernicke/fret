import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { C, card } from '../theme';
import { SONGS, DONE_SONGS } from '../data/mock';

function SongCard({ song, done, onPress }) {
  return (
    <Pressable
      style={[card, s.card, done && { opacity: 0.6 }]}
      onPress={onPress}
    >
      <View style={s.thumb}><Text style={{ fontSize: 22 }}>{song.emoji}</Text></View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={s.name}>{song.name}</Text>
          {song.section && (
            <View style={s.badge}><Text style={s.badgeText}>{song.section}</Text></View>
          )}
        </View>
        <Text style={s.artist}>{song.artist}</Text>
        <View style={s.progTrack}>
          <View style={[s.progFill, { width: `${song.progress * 100}%` }]} />
        </View>
      </View>
      <Text style={s.pct}>{Math.round(song.progress * 100)}%</Text>
    </Pressable>
  );
}

export default function SongsScreen({ navigation }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.pagehead}>
        <Text style={s.eyebrow}>MY SETLIST</Text>
        <Text style={s.h1}>곡 라이브러리</Text>
        <Text style={s.sub}>연습 중인 곡 {SONGS.length} · 완주 {DONE_SONGS.length}</Text>
      </View>
      <Text style={s.secLabel}>연습 중</Text>
      {SONGS.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          onPress={() => navigation.navigate('SongDetail', { song })}
        />
      ))}
      <Text style={s.secLabel}>완주한 곡</Text>
      {DONE_SONGS.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          done
          onPress={() => navigation.navigate('SongDetail', { song })}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pagehead: { paddingHorizontal: 20, paddingTop: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 0.8, color: C.muted, fontWeight: '600' },
  h1: { fontSize: 30, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 2 },
  sub: { fontSize: 14, color: C.muted, marginTop: 3 },
  secLabel: { fontSize: 12, color: C.muted, fontWeight: '600', marginTop: 22, marginHorizontal: 24, letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 12, padding: 16 },
  thumb: { width: 52, height: 52, borderRadius: 12, backgroundColor: C.fillGray, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600', color: C.text },
  badge: { backgroundColor: C.tintBlueBg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 6 },
  badgeText: { fontSize: 10, fontWeight: '600', color: C.tintBlue },
  artist: { fontSize: 13, color: C.muted, marginTop: 1 },
  progTrack: { height: 5, backgroundColor: C.fillGray, borderRadius: 3, marginTop: 7, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: C.tintBlue, borderRadius: 3 },
  pct: { fontSize: 15, fontWeight: '700', color: C.tintBlue },
});
