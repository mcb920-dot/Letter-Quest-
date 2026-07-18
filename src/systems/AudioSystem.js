import { SaveSystem } from "./SaveSystem.js";

const missingFiles = new Set();

export class AudioSystem {
  constructor() {
    this.synthesis = "speechSynthesis" in window ? window.speechSynthesis : null;
    this.muted = SaveSystem.getMuted();
    this.cache = new Map();
    this.handleVoicesChanged = () => this.pickVoice();
    this.synthesis?.addEventListener("voiceschanged", this.handleVoicesChanged);
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    SaveSystem.saveMuted(this.muted);
    if (this.muted) {
      this.synthesis?.cancel();
      for (const audio of this.cache.values()) audio.pause();
    }
    return this.muted;
  }

  toggleMuted() {
    return this.setMuted(!this.muted);
  }

  unlock() {
    if (this.muted) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.context ??= new AudioContextClass();
      if (this.context.state === "suspended") this.context.resume().catch(() => {});
    }
    // iOS allows future media playback after audio is touched in this direct gesture.
    const audio = new Audio();
    audio.muted = true;
    audio.play().catch(() => {});
    if (this.synthesis && "SpeechSynthesisUtterance" in window) {
      this.synthesis.cancel();
      const primer = new SpeechSynthesisUtterance(" ");
      primer.volume = 0;
      this.synthesis.speak(primer);
    }
  }

  getAudio(path) {
    if (!this.cache.has(path)) {
      const audio = new Audio(path);
      audio.preload = "auto";
      this.cache.set(path, audio);
    }
    return this.cache.get(path);
  }

  reportMissing(path) {
    if (missingFiles.has(path)) return;
    missingFiles.add(path);
    console.warn(`[Letter Quest audio] Missing audio file: ${path}. Using a safe fallback.`);
  }

  preloadLetter(letter) {
    const path = `/audio/letters/${letter.toUpperCase()}.wav`;
    const audio = this.getAudio(path);
    audio.addEventListener("error", () => this.reportMissing(path), { once: true });
    audio.load();
  }

  preloadLetters(currentLetter, nextLetter) {
    this.preloadLetter(currentLetter);
    this.preloadLetter(nextLetter);
  }

  async playFile(path) {
    if (this.muted) return false;
    const audio = this.getAudio(path);
    audio.currentTime = 0;
    try {
      await audio.play();
      return true;
    } catch {
      this.reportMissing(path);
      return false;
    }
  }

  playEffect(name) {
    return this.playFile(`/audio/effects/${name}.mp3`);
  }

  async playLetter(letter) {
    const path = `/audio/letters/${letter.toUpperCase()}.wav`;
    if (missingFiles.has(path)) {
      this.speak(`${letter.toLowerCase()}!`);
      return;
    }
    if (await this.playFile(path)) return;
    this.speak(`${letter.toLowerCase()}!`);
  }

  pickVoice() {
    if (!this.synthesis) return null;
    const voices = this.synthesis.getVoices();
    const preferred = ["Samantha", "Ava", "Allison", "Joelle", "Tessa", "Karen", "Moira", "Susan"];
    for (const name of preferred) {
      const voice = voices.find((item) => item.name.includes(name) && item.lang.startsWith("en"));
      if (voice) return voice;
    }
    return voices.find((voice) => voice.lang === "en-US")
      || voices.find((voice) => voice.lang.startsWith("en"))
      || voices[0]
      || null;
  }

  speak(text) {
    if (this.muted || !this.synthesis || !("SpeechSynthesisUtterance" in window)) return;
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.04;
    utterance.pitch = 1.3;
    utterance.volume = 1;
    const voice = this.pickVoice();
    if (voice) utterance.voice = voice;
    this.synthesis.speak(utterance);
  }

  destroy() {
    this.synthesis?.cancel();
    this.synthesis?.removeEventListener("voiceschanged", this.handleVoicesChanged);
    this.context?.close().catch(() => {});
  }
}
