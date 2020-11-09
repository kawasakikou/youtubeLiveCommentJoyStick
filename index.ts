import { CommnadAndToken, InputCommandQueue } from "./api/controller/inputCommandQueue";
import { ApiKeys } from "./api/youtubeLive/keys";
import { GBA } from "./gameController/gba";


async function main() {
  const gameConsole = new GBA;

  try {
    // @ts-ignore
    const rawKey: string[] = process.env.YOUTUBE_API_KEYS.split(' ') as string[];
    const key = new ApiKeys(rawKey);

    const videoId: string = process.env.VIDEO_ID as string; // FIXME: type guard
    const queue = new InputCommandQueue(key);
    const activeLiveChatId = await queue.fetchActiveLiveChatId(videoId);

    let commandAndToken: CommnadAndToken = {inputCommands: [], nextPageToken: ""};
    setInterval(async () => {
      commandAndToken = await queue.fetchCommentAndExecKeyInput(activeLiveChatId, commandAndToken.nextPageToken);
      if (queue.hasExistsCommentWithinFiveMinutes()) {
        for (const oneUserkeys of commandAndToken.inputCommands) {
          await gameConsole.input(oneUserkeys);
        }
      } else {
        await gameConsole.randomInput();
      }
    }, 6000);

  } catch (e) {
    gameConsole.cleanUp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
