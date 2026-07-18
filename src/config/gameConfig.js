import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene.js";
import { MenuScene } from "../scenes/MenuScene.js";
import { LearnLettersScene } from "../scenes/LearnLettersScene.js";

export const BASE_WIDTH = 540;
export const BASE_HEIGHT = 960;

export const gameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
  // FIT can enlarge the portrait canvas on desktop displays even when DPR is 1.
  // Keep at least a 2x backing buffer so artwork and text remain crisp there.
  resolution: 3,
  backgroundColor: "#0d1230",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
  },
  render: {
    antialias: true,
    antialiasGL: true,
    pixelArt: false,
    roundPixels: false,
    powerPreference: "high-performance",
  },
  scene: [BootScene, MenuScene, LearnLettersScene],
};
