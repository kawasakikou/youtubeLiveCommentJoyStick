import { GPIO } from './gameController/gpio';
import { getActiveLiveChatId, CommnadAndToken } from "./api/controller/inputKeyQueue";
import { getCommentAndExecKeyInput } from "./api/controller/inputKeyQueue";
import { ApiKeys } from "./api/youtubeLive/keys";


async function main() {
  const gpio = new GPIO();
  gpio.setup(17, 'OUT', 'HIGH');
  gpio.setup(27, 'OUT', 'HIGH');
  gpio.setup(23, 'OUT', 'HIGH');
  gpio.setup(24, 'OUT', 'HIGH');

  gpio.setup(16, 'OUT', 'HIGH');
  gpio.setup(20, 'OUT', 'HIGH');
  gpio.setup(21, 'OUT', 'HIGH');
  gpio.setup(26, 'OUT', 'HIGH');

  process.on('SIGINT', function() {
    gpio.cleanUp();
    process.exit();
  });

  try {
    // @ts-ignore
    const rawKey: string[] = process.env.YOUTUBE_API_KEYS.split(' ') as string[];
    const key = new ApiKeys(rawKey);

    const videoId: string = process.env.VIDEO_ID as string; // FIXME: type guard
    const activeLiveChatId = await getActiveLiveChatId(rawKey[0], videoId);

    let commandAndToken: CommnadAndToken = {inputKeys: [], nextPageToken: ""};
    setInterval(async () => {
      commandAndToken = await getCommentAndExecKeyInput(key.getKey(), activeLiveChatId, commandAndToken.nextPageToken);

      for (const oneUserkeys of commandAndToken.inputKeys) {
        if (oneUserkeys.join('') == 'start') {
          await gpio.keySelect('start');
        } else {
          for (const inputKey of oneUserkeys) {
            await gpio.keySelect(inputKey)
          }
        }
      }
    }, 6000);

  } catch (e) {
    gpio.cleanUp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
