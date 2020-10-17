import { URL, URLSearchParams } from 'url';
import { fetchWrap } from "../util";

export const getLiveChatMessagesList = async (key: string, liveChatId: string, pageToken?: string): Promise<LiveChatMessagesList> => {
  const url: URL = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages');
  const part: string = 'id,snippet,authorDetails';

  const params = new URLSearchParams({
    liveChatId: liveChatId,
    part: part,
    key: key,
    pageToken: pageToken || ''
  });
  url.search = params.toString();
  return await fetchWrap<LiveChatMessagesList>(url, { method: 'GET' });
};

export type LiveChatMessagesList = {
  kind: string
  etag: string
  pollingIntervalMillis: number
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  nextPageToken: string
  items?: {
    kind: string
    etag: string
    id: string
    snippet: {
      type: string,
      liveChatId: string
      authorChannelId: string
      publishedAt: string
      hasDisplayContent: boolean
      displayMessage: string // comment
      textMessageDetails: {
        messageText: string // comment
      }
    }
    authorDetails: {
      channelId: string
      channelUrl: string
      displayName: string // name
      profileImageUrl: string
      isVerified: boolean
      isChatOwner: boolean
      isChatSponsor: boolean
      isChatModerator: boolean
    }
  }[]
}
