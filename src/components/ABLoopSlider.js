import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import { C, fmt } from '../theme';

const PAD = 13; // half handle width

/**
 * A–B 구간 반복 슬라이더 (듀얼 핸들)
 * props: duration(sec), a(sec), b(sec), onChange({a,b}), onCommit({a,b})
 */
export default function ABLoopSlider({ duration, a, b, currentTime, onChange, onCommit }) {
  const [width, setWidth] = useState(0);
  const state = useRef({ a, b, width: 0 });
  state.current.a = a; state.current.b = b; state.current.width = width;

  const ready = duration > 0 && width > 0;
  const toX = (sec) => PAD + (sec / duration) * (width - PAD * 2);
  const toSec = (x) => {
    const w = state.current.width;
    const p = Math.max(0, Math.min(1, (x - PAD) / (w - PAD * 2)));
    return p * duration;
  };

  const makeResponder = (isA) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const sec = toSec(g.moveX - state.current.offsetX);
        const min = duration * 0.03;
        if (isA) onChange({ a: Math.min(sec, state.current.b - min), b: state.current.b });
        else onChange({ a: state.current.a, b: Math.max(sec, state.current.a + min) });
      },
      onPanResponderRelease: () => onCommit && onCommit({ a: state.current.a, b: state.current.b }),
    });

  const panA = useRef(makeResponder(true)).current;
  const panB = useRef(makeResponder(false)).current;

  return (
    <View
      style={s.wrap}
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
        e.target.measure?.((x, y, w, h, pageX) => (state.current.offsetX = pageX || 0));
      }}
    >
      {/* string track */}
      <View style={s.track} />
      {ready && (
        <>
          <View style={[s.seg, { left: toX(a), width: toX(b) - toX(a) }]} />
          {currentTime > 0 && (
            <View style={[s.cursor, { left: toX(Math.min(currentTime, duration)) }]} />
          )}
          <View style={[s.handle, { left: toX(a) - PAD }]} {...panA.panHandlers}>
            <Text style={s.tag}>A</Text>
            <View style={s.knob} />
            <Text style={s.time}>{fmt(a)}</Text>
          </View>
          <View style={[s.handle, { left: toX(b) - PAD }]} {...panB.panHandlers}>
            <Text style={s.tag}>B</Text>
            <View style={s.knob} />
            <Text style={s.time}>{fmt(b)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { height: 76, justifyContent: 'center' },
  track: { position: 'absolute', left: PAD, right: PAD, height: 4, borderRadius: 3, backgroundColor: C.trackGray },
  seg: { position: 'absolute', height: 6, borderRadius: 4, backgroundColor: C.tintBlue, top: '50%', marginTop: -3 },
  handle: { position: 'absolute', width: 26, alignItems: 'center', top: '50%', marginTop: -13 - 20, paddingTop: 20 },
  knob: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  tag: { position: 'absolute', top: 0, fontSize: 11, fontWeight: '800', color: C.tintBlue },
  time: { marginTop: 4, fontSize: 10, color: C.muted, fontVariant: ['tabular-nums'] },
  cursor: {
    position: 'absolute', width: 2, height: 28, borderRadius: 1,
    backgroundColor: C.rec, top: '50%', marginTop: -14,
  },
});
