import React, { createContext, useContext, useState } from 'react';
import { SEED_RECORDINGS } from '../data/mock';

const Ctx = createContext(null);

export function RecordingsProvider({ children }) {
  const [recordings, setRecordings] = useState(SEED_RECORDINGS);
  const addRecording = (rec) =>
    setRecordings((prev) => [{ id: 'r' + Date.now(), date: '오늘 · 7월 6일', seed: Date.now() % 9 + 1, hot: true, ...rec }, ...prev]);
  return <Ctx.Provider value={{ recordings, addRecording }}>{children}</Ctx.Provider>;
}

export const useRecordings = () => useContext(Ctx);
