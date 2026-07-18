import { SaveSystem } from "./SaveSystem.js";

const missingFiles = new Set();

export class AudioSystem {
  constructor() {
    this.synthesis = "speechSynthesis" in window ? window.speechSynthesis : null;
    this.muted = SaveSystem.getMuted();
    this.cache = new Map();
    this.musicRequested = false;
    this.musicTimer = null;
    this.musicStep = 0;
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
      this.pauseMusic();
    } else if (this.musicRequested) {
      this.startMusic();
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

  startMusic() {
    this.musicRequested = true;
    if (this.muted || this.musicTimer || !this.context) return;
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    const playNext = () => {
      if (this.muted || !this.context || this.context.state !== "running") return;
      const frequency = notes[this.musicStep % notes.length];
      this.musicStep += 1;
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = this.musicStep % 2 === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.028, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.44);
    };
    playNext();
    this.musicTimer = window.setInterval(playNext, 520);
  }

  pauseMusic() {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  stopMusic() {
    this.musicRequested = false;
    this.pauseMusic();
  }

  playLetterLift() {
    if (this.muted || !this.context || this.context.state !== "running") return;
    const now = this.context.currentTime;
    [659.25, 783.99].forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.018 + index * 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18 + index * 0.04);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start(now + index * 0.045);
      oscillator.stop(now + 0.24 + index * 0.045);
    });
  }

  async playLetter(letter) {
    const path = `/audio/letters/${letter.toUpperCase()}.wav`;
    if (missingFiles.has(path)) {
      this.speak(`${letter.toLowerCase()}!`);
      return;
    }
    this.playLetterLift();
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
    this.stopMusic();
    this.synthesis?.cancel();
    this.synthesis?.removeEventListener("voiceschanged", this.handleVoicesChanged);
    this.context?.close().catch(() => {});
  }
}
