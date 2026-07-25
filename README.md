# Fret — 기타 연습 앱 (Expo / React Native)

iOS 스타일 미니멀 디자인의 기타 연습 앱 프로토타입.

## 실행 방법

```bash
# 1. 새 Expo 프로젝트 위치에서 (또는 이 폴더 그대로)
npm install

# 2. 네이티브 의존성은 expo install로 버전 맞추는 걸 권장
npx expo install expo-av react-native-webview react-native-screens react-native-safe-area-context

# 3. 실행 → Expo Go 앱으로 QR 스캔
npx expo start
```

## 커버 영상 검색 설정 (YouTube Data API v3)

곡 상세 화면의 "다른 커버 영상 검색"은 YouTube Data API v3의 `search.list`를 사용합니다. 키 발급 방법:

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. API 및 서비스 → 라이브러리 → **YouTube Data API v3** 사용 설정
3. 사용자 인증 정보 → API 키 생성 (필요 시 HTTP 리퍼러/앱 제한 설정)
4. 프로젝트 루트에 `.env` 파일 생성 (`.env.example` 참고) 후 발급받은 키 입력:
   ```
   EXPO_PUBLIC_YOUTUBE_API_KEY=발급받은키
   ```
5. `npx expo start` 재시작 (환경 변수는 번들 시점에 주입되므로 재시작 필요)

키가 없으면 검색 시 안내 메시지가 표시됩니다. 무료 할당량(일일 10,000 유닛, `search.list` 1회당 100유닛)이 있으니 참고하세요.

## 실제로 동작하는 것

| 기능 | 구현 |
|---|---|
| 유튜브 A–B 구간 반복 | `react-native-youtube-iframe`의 `getCurrentTime()` 폴링 + `seekTo()` — **실제 영상에서 동작** |
| 재생 속도 0.5x–1.0x | `playbackRate` prop |
| A/B 핸들 드래그 | `PanResponder` 기반 커스텀 듀얼 슬라이더 (`ABLoopSlider.js`) |
| 녹음 | `expo-av` 실제 마이크 녹음 → 녹음 탭에 추가, 탭하면 재생 |
| 악보 바텀시트 | Modal + 자동 스크롤 (Switch 토글) |
| 통계 | 주간 바 차트 / 8주 스트릭 그리드 / 곡별 누적 (순수 View, 라이브러리 無) |

## 구조

```
App.js                        # 탭 네비게이션 (연습/곡/녹음/통계)
src/theme.js                  # iOS 디자인 토큰
src/data/mock.js              # 곡·녹음·통계 목데이터 + Tab 악보
src/components/
  ABLoopSlider.js             # A-B 듀얼 핸들 슬라이더
  Waveform.js                 # 시드 기반 웨이브폼
  SheetModal.js               # 악보 시트 (자동 스크롤)
  RecordingsContext.js        # 녹음 전역 상태
src/screens/                  # 4개 화면
```

## 다음 단계 아이디어

- 곡 상세 화면: 영상·악보·녹음을 곡 단위로 묶기 (SongsScreen의 Alert 자리)
- 영상 duration을 `player.getDuration()`으로 동적 반영
- 녹음/연습 데이터 영속화: `expo-sqlite` 또는 AsyncStorage
- 실제 웨이브폼: 녹음 파일에서 추출 (예: `react-native-audio-recorder-player`)
- 참고: 최신 Expo SDK에서는 `expo-av` 대신 `expo-audio`로의 전환 권장 — API가 안정화되면 마이그레이션
