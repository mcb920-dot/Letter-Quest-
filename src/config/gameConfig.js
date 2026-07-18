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
  resolution: Math.min(window.devicePixelRatio || 1, 3),
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
