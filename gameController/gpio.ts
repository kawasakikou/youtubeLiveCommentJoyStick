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

  async input(inputKey: string[]) {
    if (inputKey.join('') == 'start') {
      await this.gpioSelect('start');
    } else {
      for (const k of inputKey) {
        await this.gpioSelect(k);
        if (k === 'a' || k === 'b') await sleep(300);
      }
    }
  }

  async gpioSelect(inputKey: string) {
    if (inputKey == 'a') {
      await this.on(17)
    } else if (inputKey == 'b') {
      await this.on(27)
    } else if (inputKey == 'start') {
      await this.on(23)
    } else if (inputKey == 'game') {
      await this.on(24)
    } else if (inputKey == 'u' || inputKey == '上') {
      await this.on(16)
    } else if (inputKey == 'd' || inputKey == '下') {
      await this.on(20)
    } else if (inputKey == 'r' || inputKey == '右') {
      await this.on(21)
    } else if (inputKey == 'l' || inputKey == '左') {
      await this.on(26)
    } else {
      ;
    }
  }
}

type PinType = 'IN' | 'OUT'
type Initial = 'HIGH' | 'LOW'

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
