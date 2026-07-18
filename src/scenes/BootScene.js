import Phaser from "phaser";
import { createBasketballTexture, createSoftGlowTexture } from "../game/createBasketballTexture.js";
import { AudioSystem } from "../systems/AudioSystem.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    createBasketballTexture(this);
    createSoftGlowTexture(this);
    this.registry.set("audioSystem", new AudioSystem());
    document.getElementById("loading")?.remove();
    this.scene.start("MenuScene");
  }
}
