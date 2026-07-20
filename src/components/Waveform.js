import React, { useMemo } from 'react';
import { View } from 'react-native';
import { C } from '../theme';

export default function Waveform({ seed = 1, hot = false, bars = 30, height = 30 }) {
  const heights = useMemo(() => {
    let s = seed;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: bars }, () => 6 + rnd() * (height - 8));
  }, [seed, bars, height]);
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height, overflow: 'hidden' }}>
      {heights.map((h, i) => (
        <View key={i} style={{ width: 3, marginRight: 2, borderRadius: 2, height: h,
          backgroundColor: hot ? C.tintBlue : '#D8D8DE' }} />
      ))}
    </View>
  );
}
