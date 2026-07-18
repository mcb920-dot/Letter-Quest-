export class AudioSystem {
  constructor() {
    this.synthesis = "speechSynthesis" in window ? window.speechSynthesis : null;
    this.handleVoicesChanged = () => this.pickVoice();
    this.synthesis?.addEventListener("voiceschanged", this.handleVoicesChanged);
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
    if (!this.synthesis || !("SpeechSynthesisUtterance" in window)) return;
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.24;
    utterance.volume = 1;
    const voice = this.pickVoice();
    if (voice) utterance.voice = voice;
    this.synthesis.speak(utterance);
  }

  destroy() {
    this.synthesis?.cancel();
    this.synthesis?.removeEventListener("voiceschanged", this.handleVoicesChanged);
  }
}
