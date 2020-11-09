import { getVideosList } from "../youtubeLive/getVideosList";
import { getLiveChatMessagesList } from "../youtubeLive/getLiveChatMessagesList";
import { ApiKeys } from "../youtubeLive/keys";

export class InputCommandQueue{
  apiKeys: ApiKeys;
  nextPageToken: string;
  lastCommentTime: Date;

  constructor(apiKeys: ApiKeys) {
    this.apiKeys = apiKeys;
    this.lastCommentTime = new Date;
    this.nextPageToken = ''
  }

  fetchActiveLiveChatId = async (videoId: string): Promise<string> => {
    let activeLiveChatId: string | undefined = '';
    do {
      console.log('wait active live chat');
      const videosList = await getVideosList(this.apiKeys.getKey(), videoId);
      activeLiveChatId = videosList.items?.[0].liveStreamingDetails.activeLiveChatId;
    } while (activeLiveChatId == undefined);
    return activeLiveChatId;
  };

  fetchCommentAndExecKeyInput = async (activeLiveChatId: string, pageToken?: string): Promise<CommnadAndToken> => {
    const res = await getLiveChatMessagesList(this.apiKeys.getKey(), activeLiveChatId, pageToken);
    if (res.items) {
      // each user comment e.g. [['a', 'a'], ['b', 'b']]
      const inputCommands = res.items.map(item => {
        const userMessage: string = item.snippet.textMessageDetails.messageText;
        return userMessage.split('').slice(0, 5);
      });

      if (inputCommands.length) this.updateLastCommentTime(inputCommands);
      this.nextPageToken = res.nextPageToken;

      return {inputCommands: inputCommands, nextPageToken: this.nextPageToken};
    } else {
      return {inputCommands: [], nextPageToken: this.nextPageToken}
    }
  };

  hasExistsCommentWithinFiveMinutes() {
    const now = new Date();
    const lastCommentTimeAfterFiveMinutes = new Date();
    lastCommentTimeAfterFiveMinutes.setMinutes(this.lastCommentTime.getMinutes() + 5);
    return this.lastCommentTime.getTime() <= now.getTime() && now.getTime() <= lastCommentTimeAfterFiveMinutes.getTime()
  }

  private updateLastCommentTime(inputCommands: string[][]) {
    const firstComment = inputCommands[0];
    if (firstComment.length) this.lastCommentTime = new Date();
  }

}

export type CommnadAndToken = {
  inputCommands: string[][]
  nextPageToken: string
}
