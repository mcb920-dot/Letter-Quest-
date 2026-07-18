import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

const textStyle = {
  fontFamily: "Arial Rounded MT Bold, Arial",
  fontSize: "250px",
  fontStyle: "bold",
  stroke: "#ffffff",
  strokeThickness: 20,
};

export function createLetterEffects(scene) {
  const overlay = scene.add.rectangle(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 0x071022, 0)
    .setDepth(70).setVisible(false);
  const glow = scene.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, "softGlow")
    .setDisplaySize(440, 440).setDepth(79).setAlpha(0);

  const letterContainer = scene.add.container(BASE_WIDTH / 2, 340).setDepth(82).setAlpha(0);
  const letterShadow = scene.add.text(13, 20, "A", {
    ...textStyle, color: "#35102b", stroke: "#35102b", strokeThickness: 22,
  }).setOrigin(0.5).setAlpha(0.42);
  const letterDepth = scene.add.text(8, 11, "A", {
    ...textStyle, color: "#a83050", stroke: "#ffffff",
  }).setOrigin(0.5);
  const letter = scene.add.text(0, 0, "A", {
    ...textStyle, color: "#ff6b7a",
  }).setOrigin(0.5);
  const letterHighlight = scene.add.text(-6, -9, "A", {
    ...textStyle, color: "#ffffff", stroke: "#ffffff",
  }).setOrigin(0.5).setAlpha(0.18).setScale(0.965);
  letterContainer.add([letterShadow, letterDepth, letter, letterHighlight]);

  return { overlay, glow, letterContainer, letterShadow, letterDepth, letter, letterHighlight };
}

export function setBubbleLetter(effects, letter, color) {
  const depthColor = shadeColor(color, -34);
  effects.letterShadow.setText(letter);
  effects.letterDepth.setText(letter).setColor(depthColor);
  effects.letter.setText(letter).setColor(color);
  effects.letterHighlight.setText(letter);
}

function shadeColor(hex, amount) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  const red = Math.max(0, Math.min(255, (value >> 16) + amount));
  const green = Math.max(0, Math.min(255, ((value >> 8) & 0xff) + amount));
  const blue = Math.max(0, Math.min(255, (value & 0xff) + amount));
  return `#${((red << 16) | (green << 8) | blue).toString(16).padStart(6, "0")}`;
}
