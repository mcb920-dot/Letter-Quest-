import Phaser from "phaser";
import { createSoftGlowTexture } from "../game/createBasketballTexture.js";
import { AudioSystem } from "../systems/AudioSystem.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("premiumMenu", "/assets/ui/premium-menu.png");
    this.load.image("basketballLettersLogo", "/assets/ui/basketball-letters-logo.png");
    this.load.image("rescueArcadeCourt", "/assets/court/rescue-arcade-cabinet.png");
    this.load.image("hoopArcadeCourt", "/assets/court/hoop-arcade-cabinet.png");
    this.load.image("premiumBasketball", "/assets/basketball/premium-basketball.png");
  }

  create() {
    createSoftGlowTexture(this);
    this.registry.set("audioSystem", new AudioSystem());
    document.getElementById("loading")?.remove();
    this.scene.start("MenuScene");
  }
}
