import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.audioSystem = this.registry.get("audioSystem");
    this.drawArcadeBackground();
    this.createAmbientLights();

    this.add.text(BASE_WIDTH / 2, 168, "Basketball\nLetters", {
      fontFamily: "Arial Rounded MT Bold, Arial",
      fontSize: "58px",
      fontStyle: "bold",
      align: "center",
      lineSpacing: -6,
      color: "#ffffff",
      stroke: "#09102d",
      strokeThickness: 12,
      shadow: { offsetX: 0, offsetY: 8, color: "#07102a", blur: 12, fill: true },
    }).setOrigin(0.5);

    this.add.text(BASE_WIDTH / 2, 288, "Shoot. Swish. Learn.", {
      fontFamily: "Arial", fontSize: "23px", fontStyle: "bold", color: "#bff8ff",
    }).setOrigin(0.5);

    const ballGlow = this.add.image(BASE_WIDTH / 2, 486, "softGlow")
      .setDisplaySize(350, 350).setTint(0x58dff4).setAlpha(0.42);
    this.tweens.add({ targets: ballGlow, alpha: 0.62, scale: 1.08, duration: 1500, yoyo: true, repeat: -1, ease: "Sine.InOut" });

    const ballShadow = this.add.ellipse(BASE_WIDTH / 2, 600, 210, 42, 0x020513, 0.42);
    const ball = this.add.image(BASE_WIDTH / 2, 474, "basketballHD").setDisplaySize(245, 245);
    this.tweens.add({
      targets: ball, y: 464, angle: -3, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.InOut",
      onUpdate: () => ballShadow.setScale(1 + (ball.y - 474) * 0.006, 1).setAlpha(0.42 + (ball.y - 474) * 0.006),
    });

    const buttonShadow = this.add.graphics();
    buttonShadow.fillStyle(0x020718, 0.38);
    buttonShadow.fillRoundedRect(86, 700, 368, 92, 30);
    const button = this.add.graphics();
    button.fillGradientStyle(0xff8a72, 0xff8a72, 0xf04468, 0xf04468, 1);
    button.fillRoundedRect(86, 690, 368, 92, 30);
    button.lineStyle(4, 0xffffff, 0.32);
    button.strokeRoundedRect(86, 690, 368, 92, 30);
    button.setInteractive(new Phaser.Geom.Rectangle(86, 690, 368, 92), Phaser.Geom.Rectangle.Contains);

    const playLabel = this.add.text(BASE_WIDTH / 2, 735, "PLAY", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "32px", fontStyle: "bold", color: "#ffffff",
      stroke: "#a52d4c", strokeThickness: 4,
    }).setOrigin(0.5);

    this.soundButton = this.add.container(BASE_WIDTH / 2, 842);
    const soundHit = this.add.circle(0, 0, 31, 0xffffff, 0.1).setStrokeStyle(2, 0xffffff, 0.2);
    this.soundLabel = this.add.text(0, 0, "", { fontFamily: "Arial", fontSize: "23px", color: "#ffffff" }).setOrigin(0.5);
    this.soundButton.add([soundHit, this.soundLabel]);
    this.soundButton.setSize(68, 68).setInteractive({ useHandCursor: true });
    this.updateSoundIndicator();
    this.soundButton.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.toggleMuted();
      this.updateSoundIndicator();
    });

    button.on("pointerover", () => { button.setAlpha(0.94); playLabel.setScale(1.03); });
    button.on("pointerout", () => { button.setAlpha(1); playLabel.setScale(1); });
    button.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.playEffect("tap");
      this.cameras.main.flash(120, 255, 255, 255, false);
      this.time.delayedCall(90, () => this.scene.start("LearnLettersScene"));
    });
  }

  updateSoundIndicator() {
    this.soundLabel.setText(this.audioSystem.isMuted() ? "🔇" : "🔊");
    this.soundButton.setAlpha(this.audioSystem.isMuted() ? 0.62 : 1);
  }

  drawArcadeBackground() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x090e29, 0x090e29, 0x1c2d69, 0x1c2d69, 1);
    graphics.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    graphics.fillStyle(0x121b45, 0.96);
    graphics.fillRoundedRect(34, 70, BASE_WIDTH - 68, 820, 44);
    graphics.lineStyle(8, 0x3edff4, 0.68);
    graphics.strokeRoundedRect(34, 70, BASE_WIDTH - 68, 820, 44);
    graphics.lineStyle(4, 0xff5d94, 0.72);
    graphics.lineBetween(0, 225, 62, 278);
    graphics.lineBetween(62, 278, 62, 760);
    graphics.lineBetween(BASE_WIDTH, 225, BASE_WIDTH - 62, 278);
    graphics.lineBetween(BASE_WIDTH - 62, 278, BASE_WIDTH - 62, 760);
    graphics.fillGradientStyle(0x258fc8, 0xd75f92, 0x133d78, 0x772b65, 0.58);
    graphics.fillTriangle(72, 900, BASE_WIDTH - 72, 900, BASE_WIDTH / 2, 430);
  }

  createAmbientLights() {
    const colors = [0x49e4f6, 0xff6f9f, 0xffffff];
    for (let i = 0; i < 34; i += 1) {
      const dot = this.add.circle(
        Phaser.Math.Between(32, BASE_WIDTH - 32), Phaser.Math.Between(90, 870),
        Phaser.Math.Between(1, 4), Phaser.Utils.Array.GetRandom(colors), Phaser.Math.FloatBetween(0.12, 0.5),
      );
      this.tweens.add({
        targets: dot, alpha: Phaser.Math.FloatBetween(0.05, 0.75), scale: Phaser.Math.FloatBetween(0.65, 1.5),
        duration: Phaser.Math.Between(900, 2400), delay: Phaser.Math.Between(0, 1200), yoyo: true, repeat: -1,
      });
    }
  }
}
