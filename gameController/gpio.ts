import { init } from 'raspi';
import { DigitalInput, DigitalOutput } from 'raspi-gpio';

init(() => {
  const input = new DigitalInput('P1-3');
  const output = new DigitalOutput('P1-5');
  output.write(input.read());
});
