import { getVideosList } from "../youtubeLive/getVideosList";
import { getLiveChatMessagesList, LiveChatMessagesList } from "../youtubeLive/getLiveChatMessagesList";

export const getActiveLiveChatId = async (key: string, videoId: string): Promise<string> => {
  let activeLiveChatId: string | undefined = '';

  do {
    console.log('wait active live chat')
    const videosList = await getVideosList(key, videoId);
    activeLiveChatId = videosList.items?.[0].liveStreamingDetails.activeLiveChatId;
  } while (activeLiveChatId == undefined);

  return activeLiveChatId;
};

export const getCommentAndExecKeyInput = async (key: string, activeLiveChatId: string, pageToken?: string): Promise<CommnadAndToken> => {
  const res = await getLiveChatMessagesList(key, activeLiveChatId, pageToken);
  if (res.items) {
    const inputKeys = res.items.map(item => {
      const userMessage: string = item.snippet.textMessageDetails.messageText;
      return userMessage.split('').slice(0, 5);
    });
    const nextPageToken = res.nextPageToken;
    return {inputKeys, nextPageToken};
  } else {
    return {inputKeys: [], nextPageToken: ""}
  }
};

export type CommnadAndToken = {
  inputKeys: string[][]
  nextPageToken: string
}
