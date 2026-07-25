import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, ScrollView, Pressable, TextInput,
  Image, ActivityIndicator, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { searchGuitarCovers } from '../api/youtube';

// 곡 제목으로 유튜브 기타 커버 영상을 검색하는 바텀 시트
export default function CoverSearchModal({ visible, initialQuery, onClose, onSelect }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const runSearch = async (term) => {
    const q = (term ?? query).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      setResults(await searchGuitarCovers(q));
    } catch (e) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    setQuery(initialQuery || '');
    setResults([]);
    setError(null);
    setSearched(false);
    if (initialQuery) runSearch(initialQuery);
  }, [visible, initialQuery]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={s.sheet}>
        <Pressable onPress={onClose}><View style={s.grab} /></Pressable>
        <View style={s.head}>
          <Text style={s.title}>커버 영상 검색</Text>
        </View>

        <View style={s.searchRow}>
          <TextInput
            style={s.input}
            value={query}
            onChangeText={setQuery}
            placeholder="곡 제목으로 검색"
            placeholderTextColor={C.faint}
            returnKeyType="search"
            onSubmitEditing={() => runSearch()}
          />
          <Pressable style={s.searchBtn} onPress={() => runSearch()}>
            <Ionicons name="search" size={18} color="#fff" />
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
          {loading && <ActivityIndicator style={{ marginTop: 24 }} color={C.tintBlue} />}

          {!loading && error && (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>{error}</Text>
            </View>
          )}

          {!loading && !error && searched && results.length === 0 && (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>검색 결과가 없어요</Text>
            </View>
          )}

          {!loading && !error && results.map((item) => (
            <Pressable
              key={item.videoId}
              style={s.row}
              onPress={() => onSelect(item)}
            >
              <Image source={{ uri: item.thumbnail }} style={s.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={s.rowChannel} numberOfLines={1}>{item.channel}</Text>
              </View>
            </Pressable>
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
  head: {
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  title: { fontSize: 16, fontWeight: '700', color: C.text },
  searchRow: {
    flexDirection: 'row', gap: 8, alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12,
  },
  input: {
    flex: 1, backgroundColor: C.fillGray, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: C.text,
  },
  searchBtn: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: C.tintBlue,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyBox: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 13, color: C.muted, textAlign: 'center', paddingHorizontal: 20 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  thumb: { width: 80, height: 45, borderRadius: 8, backgroundColor: C.fillGray },
  rowTitle: { fontSize: 13, fontWeight: '600', color: C.text },
  rowChannel: { fontSize: 12, color: C.muted, marginTop: 2 },
});
