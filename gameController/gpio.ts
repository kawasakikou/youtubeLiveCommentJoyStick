import fs from 'fs';


export class GPIO {
  registeredPins: number[];

  constructor() {
    this.registeredPins = [];
  }

  setup = (gpioNumber: number, pinType: PinType, initial: Initial) => {
    fs.writeFileSync('/sys/class/gpio/export', gpioNumber);

    const pinTypeValue: string = pinType == 'IN' ? 'in' : 'out';
    fs.writeFileSync(`/sys/class/gpio/gpio${gpioNumber}/direction`, pinTypeValue);

    const initialValue: number = initial == 'LOW' ? 0 : 1;
    fs.writeFileSync(`/sys/class/gpio/gpio${gpioNumber}/value`, initialValue);
    this.registeredPins.push(gpioNumber)
  };

  cleanUp() {
    for (const pinNumber of this.registeredPins) {
      fs.writeFileSync('/sys/class/gpio/unexport', pinNumber);
    }
  }

  async on(pinNumber: number) {
    fs.writeFileSync(`/sys/class/gpio/gpio${pinNumber}/value`, 0);
    await sleep(250);
    fs.writeFileSync(`/sys/class/gpio/gpio${pinNumber}/value`, 1);
  }

  async keySelect(inputKey: string) {
    if (inputKey == 'a') {
      await this.on(17)
    } else if (inputKey == 'b') {
      await this.on(27)
    } else if (inputKey == 'start') {
      await this.on(23)
    } else if (inputKey == 'game') {
      await this.on(24)
    } else if (inputKey == 'u') {
      await this.on(16)
    } else if (inputKey == 'd') {
      await this.on(20)
    } else if (inputKey == 'r') {
      await this.on(21)
    } else if (inputKey == 'l') {
      await this.on(26)
    } else {
      ;
    }
  }
}

type PinType = 'IN' | 'OUT'
type Initial = 'HIGH' | 'LOW'

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
