import { URL, URLSearchParams } from 'url';
import { fetchWrap } from "../util";

export const getVideosList = async (key: string, videoId: string): Promise<VideosList> => {
  const url: URL = new URL('https://www.googleapis.com/youtube/v3/videos');
  const part: string = 'liveStreamingDetails';

  const params = new URLSearchParams({
    id: videoId,
    part: part,
    key: key
  });
  url.search = params.toString();
  return await fetchWrap<VideosList>(url, { method: 'GET' });
};

type VideosList = {
  kind: string
  etag: string
  items?: {
    kind: string
    etag: string
    liveStreamingDetails: {
      actualStartTime: string
      scheduledStartTime: string
      concurrentViewers: number
      activeLiveChatId: string
    }
  }[]
}
