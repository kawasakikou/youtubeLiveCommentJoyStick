export class ApiKeys {
  keys: string[];
  nowIndex: number;
  // apiInvokeCounts:  number[];

  constructor(keys: string[]) {
    this.keys = keys;
    this.nowIndex = 0;
  }

  getKey() {
    const data = this.keys[this.nowIndex];
    this.nowIndex = (this.nowIndex + 1 > this.keys.length) ? 0 : this.nowIndex + 1;
    return data
  }
}
