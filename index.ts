import { GPIO } from './gameController/gpio';
import fs from 'fs';

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
    setInterval(() => {
      console.log('>');
      const key: string = 'u';
      console.log(key);
      gpio.keySelect(key)
    }, 1500);
  } catch (e) {
    gpio.cleanUp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
