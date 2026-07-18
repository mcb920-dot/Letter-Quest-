import Phaser from "phaser";
import { createSoftGlowTexture } from "../game/createBasketballTexture.js";
import { AudioSystem } from "../systems/AudioSystem.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("premiumMenu", "/assets/ui/premium-menu.png");
    this.load.image("rescueClubhouseCourt", "/assets/court/rescue-clubhouse-court.png");
    this.load.image("sunnyGymCourt", "/assets/court/sunny-gym-court.png");
    this.load.image("premiumBasketball", "/assets/basketball/premium-basketball.png");
    this.load.image("premiumHoop", "/assets/hoop/premium-hoop.png");
  }

  create() {
    createSoftGlowTexture(this);
    this.registry.set("audioSystem", new AudioSystem());
    document.getElementById("loading")?.remove();
    this.scene.start("MenuScene");
  }
}
