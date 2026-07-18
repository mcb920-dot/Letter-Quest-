import Phaser from "phaser";
import { createSoftGlowTexture } from "../game/createBasketballTexture.js";
import { AudioSystem } from "../systems/AudioSystem.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("premiumMenu", "/assets/ui/premium-menu.png");
    this.load.image("basketballLearningLogo", "/assets/ui/basketball-learning-logo.png");
    for (const theme of ["open-court", "classic-arcade", "pup-arcade"]) {
      this.load.image(`${theme}-background`, `/assets/${theme}/background.png`);
      this.load.image(`${theme}-backboard`, `/assets/${theme}/backboard.png`);
      this.load.image(`${theme}-rim-back`, `/assets/${theme}/rim-back.png`);
      this.load.image(`${theme}-rim-front`, `/assets/${theme}/rim-front.png`);
      for (const state of ["rest", "open", "stretch", "snap"]) {
        this.load.image(`${theme}-net-${state}`, `/assets/${theme}/net-${state}.png`);
      }
    }
    this.load.image("premiumBasketball", "/assets/basketball/premium-basketball.png");
  }

  create() {
    createSoftGlowTexture(this);
    this.registry.set("audioSystem", new AudioSystem());
    document.getElementById("loading")?.remove();
    this.scene.start("MenuScene");
  }
}
