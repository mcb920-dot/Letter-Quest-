import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.audioSystem = this.registry.get("audioSystem");
    this.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, "premiumMenu")
      .setDisplaySize(BASE_WIDTH, BASE_HEIGHT);

    const playZone = this.add.rectangle(BASE_WIDTH / 2, 832, 360, 92, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    playZone.on("pointerover", () => this.tweens.add({ targets: playZone, alpha: 0.08, duration: 100 }));
    playZone.on("pointerout", () => playZone.setAlpha(0.001));
    playZone.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.playEffect("tap");
      this.cameras.main.flash(90, 255, 255, 255, false);
      this.time.delayedCall(75, () => this.scene.start("LearnLettersScene"));
    });

    const soundZone = this.add.circle(BASE_WIDTH / 2, 918, 31, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    this.mutedLabel = this.add.text(BASE_WIDTH / 2, 918, "", {
      fontFamily: "Arial", fontSize: "23px", color: "#ffffff",
    }).setOrigin(0.5);
    this.updateSoundIndicator();
    soundZone.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.toggleMuted();
      this.updateSoundIndicator();
    });
  }

  updateSoundIndicator() {
    this.mutedLabel.setText(this.audioSystem.isMuted() ? "🔇" : "");
  }
}
