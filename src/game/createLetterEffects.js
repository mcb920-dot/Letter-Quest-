import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

export function createLetterEffects(scene) {
  const overlay = scene.add.rectangle(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 0x071022, 0)
    .setDepth(70).setVisible(false);
  const glow = scene.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, "softGlow")
    .setDisplaySize(440, 440).setDepth(79).setAlpha(0);
  const letterShadow = scene.add.text(BASE_WIDTH / 2 + 12, BASE_HEIGHT / 2 + 18, "A", {
    fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "250px", fontStyle: "bold",
    color: "#5d1834", stroke: "#ffffff", strokeThickness: 20,
  }).setOrigin(0.5).setDepth(81).setAlpha(0);
  const letter = scene.add.text(BASE_WIDTH / 2, BASE_HEIGHT / 2, "A", {
    fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "250px", fontStyle: "bold",
    color: "#ff6b6b", stroke: "#ffffff", strokeThickness: 20,
  }).setOrigin(0.5).setDepth(82).setAlpha(0);
  return { overlay, glow, letterShadow, letter };
}
