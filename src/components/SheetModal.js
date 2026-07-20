import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, ScrollView, Switch, Pressable, StyleSheet } from 'react-native';
import { C } from '../theme';
import { TAB_MEASURES } from '../data/mock';

// 악보(Tab) 바텀 시트 — 자동 스크롤 지원
export default function SheetModal({ visible, onClose, song }) {
  const [auto, setAuto] = useState(false);
  const scrollRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    if (!auto || !visible) return;
    const t = setInterval(() => {
      posRef.current += 0.8;
      scrollRef.current?.scrollTo({ y: posRef.current, animated: false });
    }, 30);
    return () => clearInterval(t);
  }, [auto, visible]);

  useEffect(() => { if (!visible) { setAuto(false); posRef.current = 0; } }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.sheet}>
        <Pressable onPress={onClose}><View style={s.grab} /></Pressable>
        <View style={s.head}>
          <View>
            <Text style={s.title}>{song?.name ?? 'Tab'}{song?.section ? ` — ${song.section}` : ''}</Text>
            <Text style={s.sub}>Tab · 마디 17–24 (A–B 구간)</Text>
          </View>
          <View style={s.autoRow}>
            <Text style={s.autoLabel}>자동 스크롤</Text>
            <Switch value={auto} onValueChange={setAuto} trackColor={{ true: C.good }} />
          </View>
        </View>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          onScroll={(e) => (posRef.current = e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={64}
        >
          {TAB_MEASURES.map((m) => (
            <View key={m.no} style={{ marginBottom: 22 }}>
              <Text style={s.barLabel}>
                마디 {m.no}{m.mark ? ` · ${m.mark}` : ''}
              </Text>
              {m.lines.map((line, i) => (
                <Text key={i} style={s.tabLine}>{line}</Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: { height: '88%', backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  grab: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#D8D8DE', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  title: { fontSize: 16, fontWeight: '700', color: C.text },
  sub: { fontSize: 12, color: C.muted, marginTop: 2 },
  autoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  autoLabel: { fontSize: 12, fontWeight: '600', color: C.muted },
  barLabel: { fontSize: 11, fontWeight: '600', color: C.muted, letterSpacing: 0.5, marginBottom: 4 },
  tabLine: { fontFamily: 'Menlo', fontSize: 11.5, color: '#3A3A3E', letterSpacing: 0.5,
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#EFEFF3', paddingVertical: 2 },
});
