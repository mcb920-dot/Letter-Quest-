import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";
import { SaveSystem } from "../systems/SaveSystem.js";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.audioSystem = this.registry.get("audioSystem");
    this.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, "premiumMenu")
      .setDisplaySize(BASE_WIDTH, BASE_HEIGHT);

    this.createThemePicker();

    const playZone = this.add.rectangle(BASE_WIDTH / 2, 832, 360, 92, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    playZone.on("pointerover", () => this.tweens.add({ targets: playZone, alpha: 0.08, duration: 100 }));
    playZone.on("pointerout", () => playZone.setAlpha(0.001));
    playZone.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.startMusic();
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

  createThemePicker() {
    this.add.text(BASE_WIDTH / 2, 718, "CHOOSE YOUR COURT", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "14px", fontStyle: "bold", color: "#d7f8ff",
      letterSpacing: 1,
    }).setOrigin(0.5);

    const choices = [
      { key: "open-court", label: "OPEN COURT", x: 104 },
      { key: "classic-arcade", label: "CLASSIC", x: 270 },
      { key: "pup-arcade", label: "PUP ARCADE", x: 436 },
    ];
    this.themeControls = choices.map(({ key, label, x }) => {
      const background = this.add.rectangle(x, 756, 150, 46, 0x172b59, 0.95)
        .setStrokeStyle(2, 0x75ddf2, 0.6)
        .setInteractive({ useHandCursor: true });
      const text = this.add.text(x, 756, label, {
        fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "12px", fontStyle: "bold", color: "#ffffff",
      }).setOrigin(0.5);
      background.on("pointerdown", () => {
        this.audioSystem.unlock();
        this.audioSystem.playEffect("tap");
        SaveSystem.saveTheme(key);
        this.updateThemePicker();
      });
      return { key, background, text };
    });
    this.updateThemePicker();
  }

  updateThemePicker() {
    const selected = SaveSystem.getTheme();
    for (const control of this.themeControls) {
      const active = control.key === selected;
      control.background.setFillStyle(active ? 0xff596f : 0x172b59, active ? 1 : 0.95);
      control.background.setStrokeStyle(active ? 4 : 2, active ? 0xfff2a6 : 0x75ddf2, active ? 1 : 0.6);
      control.text.setColor(active ? "#ffffff" : "#d7f8ff");
    }
  }

  updateSoundIndicator() {
    this.mutedLabel.setText(this.audioSystem.isMuted() ? "🔇" : "");
  }
}
