const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class ProgressionSystem {
  constructor(startIndex = 0) {
    this.index = this.normalize(startIndex);
  }

  normalize(index) {
    return ((Math.floor(Number(index) || 0) % ALPHABET.length) + ALPHABET.length) % ALPHABET.length;
  }

  getCurrentIndex() {
    return this.index;
  }

  getCurrentLetter() {
    return ALPHABET[this.index];
  }

  getNextLetter() {
    return ALPHABET[this.normalize(this.index + 1)];
  }

  advance() {
    this.index = this.normalize(this.index + 1);
    return this.getCurrentLetter();
  }
}
