import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";
import { createConfetti, createSparkles } from "../game/createConfetti.js";
import { createLetterEffects } from "../game/createLetterEffects.js";
import { ProgressionSystem } from "../systems/ProgressionSystem.js";
import { SaveSystem } from "../systems/SaveSystem.js";

export class LearnLettersScene extends Phaser.Scene {
  constructor() {
    super("LearnLettersScene");
  }

  create() {
    this.locked = false;
    this.coins = SaveSystem.getCoins();
    this.progression = new ProgressionSystem(SaveSystem.getLetterIndex());
    this.audioSystem = this.registry.get("audioSystem");
    this.drawArcade();
    this.createHUD();
    this.createHoop();
    this.createBall();
    Object.assign(this, createLetterEffects(this));
    this.prepareRound();
  }

  drawArcade() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x0c1130, 0x0c1130, 0x1d2b66, 0x1d2b66, 1);
    graphics.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    graphics.fillStyle(0x11183e, 1);
    graphics.fillRoundedRect(58, 102, BASE_WIDTH - 116, 610, 40);
    graphics.lineStyle(10, 0x3edff4, 0.95);
    graphics.strokeRoundedRect(58, 102, BASE_WIDTH - 116, 610, 40);
    graphics.lineStyle(6, 0xff6f9f, 0.8);
    graphics.lineBetween(18, 205, 84, 250);
    graphics.lineBetween(84, 250, 84, 728);
    graphics.lineBetween(BASE_WIDTH - 18, 205, BASE_WIDTH - 84, 250);
    graphics.lineBetween(BASE_WIDTH - 84, 250, BASE_WIDTH - 84, 728);
    graphics.fillGradientStyle(0x3ca8df, 0xea86a5, 0x225f9f, 0xa83d76, 1);
    graphics.fillTriangle(92, 760, BASE_WIDTH - 92, 760, BASE_WIDTH / 2, 300);
    graphics.fillStyle(0xffffff, 0.09);
    graphics.fillTriangle(92, 760, BASE_WIDTH / 2, 760, BASE_WIDTH / 2, 300);
    graphics.fillStyle(0x0d1230, 1);
    graphics.fillRoundedRect(34, 700, 112, 165, 24);
    graphics.fillRoundedRect(BASE_WIDTH - 146, 700, 112, 165, 24);
    graphics.fillStyle(0xff607e, 0.9);
    graphics.fillRoundedRect(48, 720, 9, 112, 5);
    graphics.fillRoundedRect(BASE_WIDTH - 57, 720, 9, 112, 5);
    for (let i = 0; i < 42; i += 1) {
      graphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.08, 0.42));
      graphics.fillCircle(Phaser.Math.Between(20, BASE_WIDTH - 20), Phaser.Math.Between(95, 470), Phaser.Math.Between(1, 4));
    }
  }

  createHUD() {
    this.add.text(BASE_WIDTH / 2, 34, "BASKETBALL LETTERS", {
      fontFamily: "Arial", fontSize: "30px", fontStyle: "bold", color: "#ffffff", stroke: "#090e25", strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(BASE_WIDTH / 2, 75, "Tap the ball • Watch it swish", {
      fontFamily: "Arial", fontSize: "18px", fontStyle: "bold", color: "#c7f7ff",
    }).setOrigin(0.5);
    const coin = this.add.graphics();
    coin.fillStyle(0xffffff, 0.98);
    coin.fillRoundedRect(BASE_WIDTH - 126, 20, 104, 52, 26);
    this.coinText = this.add.text(BASE_WIDTH - 74, 46, `⭐ ${this.coins}`, {
      fontFamily: "Arial", fontSize: "21px", fontStyle: "bold", color: "#111735",
    }).setOrigin(0.5);
    const message = this.add.graphics().setDepth(60);
    message.fillStyle(0xffffff, 0.98);
    message.fillRoundedRect(105, BASE_HEIGHT - 84, 330, 56, 28);
    this.message = this.add.text(BASE_WIDTH / 2, BASE_HEIGHT - 56, "Tap the basketball!", {
      fontFamily: "Arial", fontSize: "22px", fontStyle: "bold", color: "#111735",
    }).setOrigin(0.5).setDepth(61);
  }

  createHoop() {
    this.add.rectangle(BASE_WIDTH / 2, 228, 188, 116, 0xeaf7ff, 0.98).setStrokeStyle(10, 0xffffff).setDepth(8);
    this.add.rectangle(BASE_WIDTH / 2, 250, 68, 45, 0xffffff, 0).setStrokeStyle(6, 0xff5f73).setDepth(9);
    this.add.rectangle(BASE_WIDTH / 2 + 80, 430, 16, 360, 0x6c789b).setDepth(3);
    this.add.rectangle(BASE_WIDTH / 2 + 80, 616, 154, 22, 0x4b5675).setDepth(3);
    this.add.ellipse(BASE_WIDTH / 2, 304, 110, 25, 0xdd4a21).setStrokeStyle(9, 0xdd4a21).setDepth(12);
    this.net = this.add.graphics().setDepth(11);
    this.drawNet(1, 0);
    this.frontRim = this.add.graphics().setDepth(26);
    this.frontRim.lineStyle(9, 0xff6d31, 1);
    this.frontRim.beginPath();
    this.frontRim.arc(BASE_WIDTH / 2, 307, 55, 0, Math.PI, false);
    this.frontRim.strokePath();
  }

  drawNet(stretch = 1, sway = 0) {
    this.net.clear();
    const top = 315;
    const bottom = 403 + (stretch - 1) * 42;
    this.net.lineStyle(4, 0xffffff, 0.98);
    this.net.lineBetween(BASE_WIDTH / 2 - 40, top, BASE_WIDTH / 2 - 24 + sway, bottom);
    this.net.lineBetween(BASE_WIDTH / 2 + 40, top, BASE_WIDTH / 2 + 24 + sway, bottom);
    this.net.lineBetween(BASE_WIDTH / 2 - 24 + sway, bottom, BASE_WIDTH / 2 + 24 + sway, bottom);
    for (let i = -32; i <= 32; i += 16) this.net.lineBetween(BASE_WIDTH / 2 + i, top + 4, BASE_WIDTH / 2 + i * 0.55 + sway, bottom);
    for (let y = 335; y < bottom; y += 17) {
      const progress = (y - top) / (bottom - top);
      const width = 38 - 14 * progress;
      this.net.lineBetween(BASE_WIDTH / 2 - width + sway * progress, y, BASE_WIDTH / 2 + width + sway * progress, y);
    }
  }

  createBall() {
    this.ballShadow = this.add.ellipse(BASE_WIDTH / 2, 790, 180, 42, 0x000000, 0.28).setDepth(15);
    this.ball = this.add.container(BASE_WIDTH / 2, 690).setDepth(24);
    this.ballImage = this.add.image(0, 0, "basketballHD").setDisplaySize(170, 170);
    this.ballLetter = this.add.text(0, 2, "A", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "68px", fontStyle: "bold",
      color: "#ffffff", stroke: "#7a2b17", strokeThickness: 9,
    }).setOrigin(0.5);
    this.ball.add([this.ballImage, this.ballLetter]);
    this.ball.setSize(180, 180).setInteractive({ useHandCursor: true });
    this.ball.on("pointerdown", () => this.shoot());
  }

  prepareRound() {
    this.locked = false;
    const letter = this.progression.getCurrentLetter();
    const index = this.progression.getCurrentIndex();
    const colors = [0xff6b6b, 0x4dabf7, 0xffd43b, 0x69db7c, 0xb197fc, 0xff922b, 0x38d9a9, 0xf06595];
    this.ballLetter.setText(letter);
    this.letter.setText(letter).setColor(`#${colors[index % colors.length].toString(16).padStart(6, "0")}`);
    this.letterShadow.setText(letter);
    this.ball.setPosition(BASE_WIDTH / 2, 690).setScale(1).setAlpha(1).setDepth(24);
    this.ballImage.setAngle(0);
    this.ballLetter.setAngle(0);
    this.ballShadow.setPosition(BASE_WIDTH / 2, 790).setScale(1).setAlpha(0.28);
    this.message.setText(`Tap the ${letter} ball!`);
  }

  shoot() {
    if (this.locked) return;
    this.locked = true;
    const letter = this.progression.getCurrentLetter();
    this.message.setText("Here it goes!");
    this.tweens.add({ targets: this.ballShadow, scaleX: 0.38, scaleY: 0.38, alpha: 0.07, duration: 1050, ease: "Sine.Out" });
    const path = new Phaser.Curves.CubicBezier(
      new Phaser.Math.Vector2(BASE_WIDTH / 2, 690), new Phaser.Math.Vector2(100, 340),
      new Phaser.Math.Vector2(430, 165), new Phaser.Math.Vector2(BASE_WIDTH / 2, 300),
    );
    const follow = { t: 0 };
    this.tweens.add({
      targets: follow, t: 1, duration: 1180, ease: "Sine.InOut",
      onUpdate: () => {
        const point = path.getPoint(follow.t);
        this.ball.setPosition(point.x, point.y);
        this.ballImage.angle -= 11;
        this.ball.setScale(1 - follow.t * 0.48);
      },
      onComplete: () => this.swish(letter),
    });
  }

  swish(letter) {
    this.ball.setDepth(10);
    this.message.setText("SWISH!");
    this.tweens.addCounter({
      from: 1, to: 1.58, duration: 250, yoyo: true,
      onUpdate: (tween) => this.drawNet(tween.getValue(), Math.sin(tween.progress * Math.PI) * 9),
    });
    this.tweens.add({
      targets: this.ball, y: 410, scale: 0.43, alpha: 0.95, duration: 380, ease: "Quad.In",
      onUpdate: () => { this.ballImage.angle -= 14; },
      onComplete: () => {
        this.ball.setAlpha(0);
        this.cameras.main.shake(90, 0.002);
        this.time.delayedCall(120, () => this.celebrate(letter));
      },
    });
  }

  celebrate(letter) {
    this.coins += 1;
    this.coinText.setText(`⭐ ${this.coins}`);
    SaveSystem.saveCoins(this.coins);
    this.overlay.setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.overlay, alpha: 0.72, duration: 180 });
    this.glow.setAlpha(0).setScale(0.3);
    this.tweens.add({ targets: this.glow, alpha: 0.9, scale: 1.15, duration: 500, ease: "Quad.Out" });
    this.letter.setPosition(BASE_WIDTH / 2, 340).setScale(0.08).setAlpha(1).setAngle(-28);
    this.letterShadow.setPosition(BASE_WIDTH / 2 + 12, 355).setScale(0.08).setAlpha(0.34).setAngle(-28);
    const swirl = { t: 0 };
    this.tweens.add({
      targets: swirl, t: 1, duration: 850, ease: "Back.Out",
      onUpdate: () => {
        const angle = swirl.t * Math.PI * 2.4;
        const radius = (1 - swirl.t) * 72;
        const x = BASE_WIDTH / 2 + Math.cos(angle) * radius;
        const y = 340 + (BASE_HEIGHT / 2 - 340) * swirl.t + Math.sin(angle) * radius * 0.35;
        const scale = 0.08 + swirl.t * 1.04;
        const rotation = -28 + 28 * swirl.t + Math.sin(angle) * 6;
        this.letter.setPosition(x, y).setScale(scale).setAngle(rotation);
        this.letterShadow.setPosition(x + 12, y + 18).setScale(scale).setAngle(rotation);
      },
      onComplete: () => this.tweens.add({ targets: [this.letter, this.letterShadow], scale: 1.16, duration: 145, yoyo: true, ease: "Sine.Out" }),
    });
    createConfetti(this);
    createSparkles(this);
    this.time.delayedCall(260, () => this.audioSystem.speak(`This is the letter ${letter}!`));
    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: [this.letter, this.letterShadow, this.glow], alpha: 0, scale: 1.25, y: BASE_HEIGHT / 2 - 40, duration: 360,
        onComplete: () => {
          this.overlay.setVisible(false);
          this.progression.advance();
          SaveSystem.saveLetterIndex(this.progression.getCurrentIndex());
          this.prepareRound();
        },
      });
    });
  }
}
