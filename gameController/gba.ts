import { GPIO } from './gpio';


export class GBA {
  gpio: GPIO;
  buttons: string[];
  constructor() {
    this.gpio = new GPIO();
    this.gpio.setup(17, 'OUT', 'HIGH');
    this.gpio.setup(27, 'OUT', 'HIGH');
    this.gpio.setup(23, 'OUT', 'HIGH');
    this.gpio.setup(24, 'OUT', 'HIGH');

    this.gpio.setup(16, 'OUT', 'HIGH');
    this.gpio.setup(20, 'OUT', 'HIGH');
    this.gpio.setup(21, 'OUT', 'HIGH');
    this.gpio.setup(26, 'OUT', 'HIGH');
    this.buttons = ['a', 'b', 'u', 'd', 'r', 'l', 'start'];

    process.on('SIGINT', () => {
      this.gpio.cleanUp();
      process.exit();
    });
  }

  async input(inputKey: string[]) {
    await this.gpio.input(inputKey)
  }

  async randomInput() {
    const randomIntZeroToSix = Math.floor(Math.random() * 6); // 0~5
    console.log('random input!!!!!');
    console.log(this.buttons[randomIntZeroToSix]);
    await this.gpio.input([this.buttons[randomIntZeroToSix]])
  }

  cleanUp() {
    this.gpio.cleanUp()
  }
}
