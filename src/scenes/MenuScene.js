import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.audioSystem = this.registry.get("audioSystem");
    this.add.rectangle(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 0x0a1027, 1);
    const card = this.add.graphics();
    card.fillStyle(0xffffff, 1);
    card.fillRoundedRect(54, 145, BASE_WIDTH - 108, 650, 36);
    this.add.image(BASE_WIDTH / 2, 270, "basketballHD").setDisplaySize(190, 190);
    this.add.text(BASE_WIDTH / 2, 405, "Basketball Letters", {
      fontFamily: "Arial", fontSize: "38px", fontStyle: "bold", color: "#111735",
    }).setOrigin(0.5);
    this.add.text(BASE_WIDTH / 2, 500, "Tap the letter ball.\nWatch it go through the net.\nLearn A through Z in order.", {
      fontFamily: "Arial", fontSize: "23px", fontStyle: "bold", align: "center",
      color: "#505b7d", lineSpacing: 12,
    }).setOrigin(0.5);
    const buttonShadow = this.add.graphics();
    buttonShadow.fillStyle(0xa52f4c, 0.28);
    buttonShadow.fillRoundedRect(92, 665, 356, 78, 24);
    const button = this.add.graphics();
    button.fillGradientStyle(0xff817c, 0xff817c, 0xec4f6c, 0xec4f6c, 1);
    button.fillRoundedRect(92, 655, 356, 78, 24);
    button.setInteractive(new Phaser.Geom.Rectangle(92, 655, 356, 78), Phaser.Geom.Rectangle.Contains);
    this.add.text(BASE_WIDTH / 2, 694, "START PLAYING", {
      fontFamily: "Arial", fontSize: "26px", fontStyle: "bold", color: "#ffffff", align: "center",
    }).setOrigin(0.5);
    button.on("pointerdown", () => {
      this.audioSystem.speak("Let's play!");
      this.scene.start("LearnLettersScene");
    });
  }
}
