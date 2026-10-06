const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

export async function searchGuitarCovers(query) {
  if (!API_KEY) {
    throw new Error('YouTube API 키가 설정되지 않았어요. .env의 EXPO_PUBLIC_YOUTUBE_API_KEY를 확인해주세요.');
  }
  const q = encodeURIComponent(`${query} 기타 커버`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15&q=${q}&key=${API_KEY}`;

  let res, json;
  try {
    res = await fetch(url);
    json = await res.json();
  } catch {
    throw new Error('네트워크 오류로 검색에 실패했어요.');
  }
  if (!res.ok) {
    throw new Error(json?.error?.message || '검색 중 오류가 발생했어요.');
  }

  return (json.items || [])
    .filter((item) => item.id?.videoId)
    .map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
    }));
}
