const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = Array.from({ length: 20 }, (_, index) => String(index + 1));

export class ProgressionSystem {
  constructor(startIndex = 0, activity = "letters") {
    this.items = activity === "numbers" ? NUMBERS : [...ALPHABET];
    this.index = this.normalize(startIndex);
  }

  normalize(index) {
    return ((Math.floor(Number(index) || 0) % this.items.length) + this.items.length) % this.items.length;
  }

  getCurrentIndex() {
    return this.index;
  }

  getCurrentLetter() {
    return this.items[this.index];
  }

  getNextLetter() {
    return this.items[this.normalize(this.index + 1)];
  }

  advance() {
    this.index = this.normalize(this.index + 1);
    return this.getCurrentLetter();
  }
}
