import { GPIO } from './gameController/gpio';
import { getActiveLiveChatId, InputKeysAndNextPageToken } from "./api/controller/inputKeyQueue";
import { getCommentAndExecKeyInput } from "./api/controller/inputKeyQueue";


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
    const key: string = process.env.YOUTUBE_API_KEY as string;
    const videoId: string = process.env.VIDEO_ID as string; // FIXME: type guard

    const activeLiveChatId = await getActiveLiveChatId(key, videoId);

    let keyAndToken: InputKeysAndNextPageToken = {inputKeys: [], nextPageToken: ""};
    setInterval(async () => {
      keyAndToken = await getCommentAndExecKeyInput(key, activeLiveChatId, keyAndToken.nextPageToken);

      for (const oneUserkeys of keyAndToken.inputKeys) {
        console.log(oneUserkeys)
        console.log(oneUserkeys.join(''))
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
