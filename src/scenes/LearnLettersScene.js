import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";
import { BASKETBALL_SPIN_FRAMES } from "../game/createBasketballTexture.js";
import { createConfetti, createSparkles } from "../game/createConfetti.js";
import { createLetterEffects, setBubbleLetter } from "../game/createLetterEffects.js";
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
    this.createAtmosphere();
    this.createHUD();
    this.createHoop();
    this.createBall();
    Object.assign(this, createLetterEffects(this));
    this.createHomeControl();
    this.createSoundControl();
    this.prepareRound();
  }

  drawArcade() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x050a1d, 0x050a1d, 0x101c42, 0x101c42, 1);
    graphics.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    graphics.fillStyle(0x0a1230, 0.98);
    graphics.fillRoundedRect(30, 92, BASE_WIDTH - 60, 790, 42);
    graphics.lineStyle(8, 0x39d8f2, 0.8);
    graphics.strokeRoundedRect(30, 92, BASE_WIDTH - 60, 790, 42);
    graphics.lineStyle(4, 0xff5d73, 0.78);
    graphics.lineBetween(0, 245, 54, 290);
    graphics.lineBetween(54, 290, 54, 785);
    graphics.lineBetween(BASE_WIDTH, 245, BASE_WIDTH - 54, 290);
    graphics.lineBetween(BASE_WIDTH - 54, 290, BASE_WIDTH - 54, 785);
    graphics.fillGradientStyle(0x5a3527, 0x40283b, 0x180f18, 0x120d19, 0.98);
    graphics.fillTriangle(42, 900, BASE_WIDTH - 42, 900, BASE_WIDTH / 2, 350);
    graphics.fillStyle(0xe4a25e, 0.055);
    graphics.fillTriangle(88, 900, BASE_WIDTH / 2, 350, BASE_WIDTH / 2, 900);
    graphics.lineStyle(2, 0xf1b56e, 0.16);
    for (let y = 505; y <= 900; y += 58) {
      const halfWidth = Phaser.Math.Linear(54, 230, (y - 350) / 550);
      graphics.lineBetween(BASE_WIDTH / 2 - halfWidth, y, BASE_WIDTH / 2 + halfWidth, y);
    }
    graphics.lineStyle(2, 0xf7c587, 0.12);
    for (let x = 92; x <= BASE_WIDTH - 92; x += 58) graphics.lineBetween(BASE_WIDTH / 2, 350, x, 900);
    graphics.lineStyle(4, 0xffd39b, 0.28);
    graphics.lineBetween(BASE_WIDTH / 2, 430, 160, 900);
    graphics.lineBetween(BASE_WIDTH / 2, 430, BASE_WIDTH - 160, 900);
    for (let i = 0; i < 42; i += 1) {
      graphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.08, 0.42));
      graphics.fillCircle(Phaser.Math.Between(20, BASE_WIDTH - 20), Phaser.Math.Between(95, 470), Phaser.Math.Between(1, 4));
    }
  }

  createAtmosphere() {
    for (let index = 0; index < 18; index += 1) {
      const particle = this.add.circle(
        Phaser.Math.Between(45, BASE_WIDTH - 45),
        Phaser.Math.Between(115, 620),
        Phaser.Math.FloatBetween(1.2, 3.2),
        index % 3 === 0 ? 0xff8a72 : 0xaeefff,
        Phaser.Math.FloatBetween(0.08, 0.24),
      ).setDepth(5);
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(12, 30),
        alpha: Phaser.Math.FloatBetween(0.03, 0.18),
        duration: Phaser.Math.Between(1700, 3300),
        yoyo: true,
        repeat: -1,
        ease: "Sine.InOut",
      });
    }
    const vignette = this.add.graphics().setDepth(55);
    vignette.fillStyle(0x000000, 0.13);
    vignette.fillRect(0, 0, 20, BASE_HEIGHT);
    vignette.fillRect(BASE_WIDTH - 20, 0, 20, BASE_HEIGHT);
    vignette.fillRect(0, 0, BASE_WIDTH, 12);
  }

  createHUD() {
    this.add.text(BASE_WIDTH / 2, 34, "BASKETBALL LETTERS", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "25px", fontStyle: "bold", color: "#fff6e9",
      stroke: "#08102d", strokeThickness: 7, letterSpacing: 1,
      shadow: { offsetX: 0, offsetY: 4, color: "#000000", blur: 7, fill: true },
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
    this.messageButton = this.add.graphics().setDepth(60);
    this.messageButton.fillStyle(0x6c1832, 0.38);
    this.messageButton.fillRoundedRect(100, BASE_HEIGHT - 79, 340, 58, 25);
    this.messageButton.fillGradientStyle(0xff8b65, 0xff8b65, 0xef3f63, 0xef3f63, 1);
    this.messageButton.fillRoundedRect(100, BASE_HEIGHT - 85, 340, 58, 25);
    this.messageButton.lineStyle(3, 0xffffff, 0.28);
    this.messageButton.strokeRoundedRect(100, BASE_HEIGHT - 85, 340, 58, 25);
    this.messageButton.setInteractive(new Phaser.Geom.Rectangle(100, BASE_HEIGHT - 85, 340, 58), Phaser.Geom.Rectangle.Contains);
    this.messageButton.on("pointerdown", () => {
      this.tweens.add({ targets: [this.messageButton, this.message], scale: 0.97, duration: 70, yoyo: true });
      this.shoot();
    });
    this.message = this.add.text(BASE_WIDTH / 2, BASE_HEIGHT - 56, "Tap the basketball!", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "21px", fontStyle: "bold", color: "#ffffff",
      stroke: "#8f2943", strokeThickness: 3,
    }).setOrigin(0.5).setDepth(61);
  }

  createSoundControl() {
    const background = this.add.circle(96, 44, 23, 0xffffff, 0.94).setDepth(64);
    this.soundLabel = this.add.text(96, 44, "", { fontFamily: "Arial", fontSize: "18px", color: "#111735" })
      .setOrigin(0.5).setDepth(65);
    background.setInteractive({ useHandCursor: true });
    const update = () => this.soundLabel.setText(this.audioSystem.isMuted() ? "🔇" : "🔊");
    update();
    background.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.toggleMuted();
      update();
    });
  }

  createHomeControl() {
    const background = this.add.circle(40, 44, 23, 0xffffff, 0.94).setDepth(64);
    this.add.text(40, 42, "⌂", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "26px", fontStyle: "bold", color: "#111735",
    }).setOrigin(0.5).setDepth(65);
    background.setInteractive({ useHandCursor: true });
    background.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.playEffect("tap");
      this.scene.start("MenuScene");
    });
  }

  createHoop() {
    // Backboard and support are the rear-most hoop elements.
    this.add.image(BASE_WIDTH / 2, 285, "softGlow").setDisplaySize(360, 360).setTint(0x69dcff).setAlpha(0.16).setDepth(2);
    this.add.rectangle(BASE_WIDTH / 2 + 11, 241, 238, 154, 0x020617, 0.6).setDepth(7);
    this.add.rectangle(BASE_WIDTH / 2, 228, 238, 154, 0x7089a8, 0.32).setStrokeStyle(10, 0xf3fbff, 0.98).setDepth(8);
    this.add.rectangle(BASE_WIDTH / 2, 228, 213, 129, 0x9ec6d9, 0.1).setStrokeStyle(2, 0xc9f4ff, 0.38).setDepth(8);
    const reflection = this.add.graphics().setDepth(8);
    reflection.fillStyle(0xffffff, 0.13);
    reflection.fillTriangle(BASE_WIDTH / 2 - 104, 168, BASE_WIDTH / 2 - 36, 168, BASE_WIDTH / 2 - 94, 285);
    reflection.fillStyle(0xffffff, 0.06);
    reflection.fillTriangle(BASE_WIDTH / 2 + 34, 168, BASE_WIDTH / 2 + 102, 168, BASE_WIDTH / 2 + 72, 286);
    this.add.rectangle(BASE_WIDTH / 2, 252, 72, 48, 0xffffff, 0).setStrokeStyle(6, 0xff6b64).setDepth(9);
    this.add.rectangle(BASE_WIDTH / 2 + 101, 466, 17, 414, 0x172238).setDepth(3);
    this.add.rectangle(BASE_WIDTH / 2 + 101, 678, 162, 20, 0x172238).setDepth(3);
    this.add.ellipse(BASE_WIDTH / 2, 313, 121, 31, 0x2a0b06, 0.42).setDepth(11);
    this.rearRim = this.add.graphics().setDepth(12);
    this.rearRim.lineStyle(12, 0xd7431b, 1);
    this.rearRim.strokeEllipse(BASE_WIDTH / 2, 307, 116, 27);

    // The ball drops behind these net strands and the front half of the rim.
    this.net = this.add.graphics().setDepth(20);
    this.drawNetState("rest");
    this.frontRim = this.add.graphics().setDepth(26);
    this.frontRim.lineStyle(12, 0xff7130, 1);
    this.frontRim.beginPath();
    this.frontRim.moveTo(BASE_WIDTH / 2 - 58, 307);
    for (let step = 1; step <= 20; step += 1) {
      const angle = Math.PI - (Math.PI * step) / 20;
      this.frontRim.lineTo(
        BASE_WIDTH / 2 + Math.cos(angle) * 58,
        307 + Math.sin(angle) * 13.5,
      );
    }
    this.frontRim.strokePath();
  }

  getNetShape(state = "rest") {
    const states = {
      rest: { topWidth: 48, upperWidth: 35, waistWidth: 25, bottomWidth: 22, bottom: 405 },
      open: { topWidth: 51, upperWidth: 40, waistWidth: 29, bottomWidth: 22, bottom: 410 },
      expanded: { topWidth: 52, upperWidth: 44, waistWidth: 34, bottomWidth: 23, bottom: 417 },
      stretch: { topWidth: 51, upperWidth: 42, waistWidth: 31, bottomWidth: 18, bottom: 432 },
      narrow: { topWidth: 49, upperWidth: 36, waistWidth: 23, bottomWidth: 15, bottom: 421 },
      snap: { topWidth: 48, upperWidth: 32, waistWidth: 20, bottomWidth: 24, bottom: 397 },
    };
    return { ...(states[state] || states.rest) };
  }

  drawNetState(state = "rest") {
    this.netShape = this.getNetShape(state);
    this.drawNetShape(this.netShape);
  }

  drawNetShape(shape) {
    this.net.clear();
    const top = 315;
    const widthAt = (t) => {
      let width;
      if (t < 0.3) width = Phaser.Math.Linear(shape.topWidth, shape.upperWidth, t / 0.3);
      else if (t < 0.67) width = Phaser.Math.Linear(shape.upperWidth, shape.waistWidth, (t - 0.3) / 0.37);
      else width = Phaser.Math.Linear(shape.waistWidth, shape.bottomWidth, (t - 0.67) / 0.33);
      return width;
    };
    this.net.lineStyle(2.3, 0xf7fbff, 0.96);
    const rows = 7;
    const columns = 8;
    for (let row = 0; row < rows; row += 1) {
      const t1 = row / rows;
      const t2 = (row + 1) / rows;
      const y1 = Phaser.Math.Linear(top, shape.bottom, t1);
      const y2 = Phaser.Math.Linear(top, shape.bottom, t2);
      const width1 = widthAt(t1);
      const width2 = widthAt(t2);
      for (let column = 0; column <= columns; column += 1) {
        const ratio = column / columns;
        const x1 = Phaser.Math.Linear(BASE_WIDTH / 2 - width1, BASE_WIDTH / 2 + width1, ratio);
        const leftRatio = Math.max(0, ratio - 0.5 / columns);
        const rightRatio = Math.min(1, ratio + 0.5 / columns);
        this.net.lineBetween(x1, y1, Phaser.Math.Linear(BASE_WIDTH / 2 - width2, BASE_WIDTH / 2 + width2, leftRatio), y2);
        this.net.lineBetween(x1, y1, Phaser.Math.Linear(BASE_WIDTH / 2 - width2, BASE_WIDTH / 2 + width2, rightRatio), y2);
      }
    }
    this.net.fillStyle(0xffffff, 0.9);
    for (let row = 1; row < rows; row += 1) {
      const t = row / rows;
      const y = Phaser.Math.Linear(top, shape.bottom, t);
      const width = widthAt(t);
      for (let column = 0; column <= columns; column += 1) {
        const x = Phaser.Math.Linear(BASE_WIDTH / 2 - width, BASE_WIDTH / 2 + width, column / columns);
        this.net.fillCircle(x, y, 1.35);
      }
    }
    this.net.lineStyle(3, 0xffffff, 0.9);
    this.net.lineBetween(BASE_WIDTH / 2 - shape.bottomWidth, shape.bottom, BASE_WIDTH / 2 + shape.bottomWidth, shape.bottom);
  }

  animateNetState(state, duration, onComplete) {
    const from = { ...(this.netShape || this.getNetShape("rest")) };
    const to = this.getNetShape(state);
    const driver = { progress: 0 };
    this.tweens.add({
      targets: driver, progress: 1, duration, ease: "Sine.InOut",
      onUpdate: () => {
        const shape = {};
        for (const key of Object.keys(from)) shape[key] = Phaser.Math.Linear(from[key], to[key], driver.progress);
        this.netShape = shape;
        this.drawNetShape(shape);
      },
      onComplete: () => {
        this.netShape = to;
        this.drawNetShape(to);
        onComplete?.();
      },
    });
  }

  createBall() {
    this.ballShadow = this.add.ellipse(BASE_WIDTH / 2, 838, 188, 44, 0x000000, 0.34).setDepth(15);
    this.ball = this.add.container(BASE_WIDTH / 2, 748).setDepth(24);
    this.ballSphere = this.add.image(0, 0, "basketballSphere").setDisplaySize(176, 176);
    this.ballSeams = this.add.image(0, 0, "basketballSeams0").setDisplaySize(176, 176);
    this.ballLetter = this.add.text(0, 2, "A", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "68px", fontStyle: "bold",
      color: "#ffffff", stroke: "#7a2b17", strokeThickness: 9,
    }).setOrigin(0.5);
    this.ball.add([this.ballSphere, this.ballSeams, this.ballLetter]);
    this.spinFrame = 0;
    this.spinElapsed = 0;
    this.ball.setSize(180, 180).setInteractive({ useHandCursor: true });
    this.ball.on("pointerdown", () => this.shoot());
  }

  advanceBallSpin(speed = 1) {
    this.spinElapsed += this.game.loop.delta * speed;
    if (this.spinElapsed < 42) return;
    const steps = Math.max(1, Math.floor(this.spinElapsed / 42));
    this.spinElapsed %= 42;
    this.spinFrame = (this.spinFrame - steps + BASKETBALL_SPIN_FRAMES * 2) % BASKETBALL_SPIN_FRAMES;
    this.ballSeams.setTexture(`basketballSeams${this.spinFrame}`);
  }

  prepareRound() {
    this.locked = false;
    const letter = this.progression.getCurrentLetter();
    const index = this.progression.getCurrentIndex();
    const colors = ["#ff6b7a", "#4dabf7", "#ffd43b", "#69db7c", "#b197fc", "#ff922b", "#38d9a9", "#f06595"];
    this.ballLetter.setText(letter);
    setBubbleLetter(this, letter, colors[index % colors.length]);
    this.letterContainer.setAlpha(0).setScale(0.08).setAngle(0);
    this.ball.setPosition(BASE_WIDTH / 2, 748).setScale(1).setAlpha(1).setDepth(24);
    this.spinFrame = 0;
    this.spinElapsed = 0;
    this.ballSeams.setTexture("basketballSeams0");
    this.ballLetter.setAngle(0);
    this.ballShadow.setPosition(BASE_WIDTH / 2, 838).setScale(1).setAlpha(0.34);
    this.drawNetState("rest");
    this.audioSystem.preloadLetters(letter, this.progression.getNextLetter());
    this.message.setText(`Tap the ${letter} ball!`);
  }

  shoot() {
    if (this.locked) return;
    this.locked = true;
    const letter = this.progression.getCurrentLetter();
    this.audioSystem.playEffect("tap");
    this.message.setText("Here it goes!");
    this.ball.setX(BASE_WIDTH / 2);
    this.tweens.add({ targets: this.ballShadow, scaleX: 0.28, scaleY: 0.28, alpha: 0.035, duration: 790, ease: "Sine.Out" });
    this.tweens.add({
      targets: this.ball, y: 132, scale: 0.51, duration: 790, ease: "Cubic.Out",
      onUpdate: () => {
        this.ball.x = BASE_WIDTH / 2;
        this.advanceBallSpin(0.82);
      },
      onComplete: () => {
        this.time.delayedCall(70, () => {
          this.ball.setDepth(18);
          this.time.delayedCall(300, () => this.animateNetState("open", 190));
          this.tweens.add({
            targets: this.ball, y: 307, scale: 0.5, duration: 575, ease: "Cubic.In",
            onUpdate: () => {
              this.ball.x = BASE_WIDTH / 2;
              this.advanceBallSpin(0.95);
            },
            onComplete: () => this.swish(letter),
          });
        });
      },
    });
  }

  swish(letter) {
    this.animateNetState("expanded", 105, () => this.animateNetState("stretch", 230));
    this.time.delayedCall(145, () => {
      this.message.setText("SWISH!");
      this.audioSystem.playEffect("swish");
      this.cameras.main.shake(65, 0.0014);
    });
    this.tweens.add({
      targets: this.ball, y: 410, scale: 0.48, duration: 185, ease: "Quad.In",
      onUpdate: () => {
        this.ball.x = BASE_WIDTH / 2;
        this.advanceBallSpin(1.08);
      },
      onComplete: () => {
        this.tweens.add({
          targets: this.ball, y: 478, scale: 0.46, duration: 190, ease: "Quad.In",
          onUpdate: () => {
            this.ball.x = BASE_WIDTH / 2;
            this.advanceBallSpin(1.15);
          },
          onComplete: () => {
            this.ball.setDepth(22);
            this.animateNetState("narrow", 145);
            this.tweens.add({
              targets: this.ball, y: 565, scale: 0.49, duration: 225, ease: "Quad.In",
              onUpdate: () => this.advanceBallSpin(1.22),
              onComplete: () => {
                this.animateNetState("snap", 140, () => this.animateNetState("rest", 230));
                this.tweens.add({
                  targets: this.ball, y: 615, alpha: 0, duration: 150, ease: "Quad.In",
                  onUpdate: () => this.advanceBallSpin(1.22),
                  onComplete: () => {
                    this.time.delayedCall(65, () => this.celebrate(letter));
                  },
                });
              },
            });
          },
        });
      },
    });
  }

  celebrate(letter) {
    this.coins += 1;
    this.coinText.setText(`⭐ ${this.coins}`);
    SaveSystem.saveCoins(this.coins);
    this.audioSystem.playEffect("celebration");
    this.overlay.setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.overlay, alpha: 0.66, duration: 190 });
    this.glow.setAlpha(0).setScale(0.3);
    this.tweens.add({ targets: this.glow, alpha: 0.9, scale: 1.15, duration: 500, ease: "Quad.Out" });
    this.letterContainer.setPosition(BASE_WIDTH / 2, 332).setScale(0.08).setAlpha(1).setAngle(0);
    const swirl = { t: 0 };
    this.tweens.add({
      targets: swirl, t: 1, duration: 920, ease: "Cubic.Out",
      onUpdate: () => {
        const angle = swirl.t * Math.PI * 2;
        const radius = (1 - swirl.t) * 46;
        const x = BASE_WIDTH / 2 + Math.cos(angle) * radius;
        const y = 332 + (BASE_HEIGHT / 2 - 332) * swirl.t + Math.sin(angle) * radius * 0.28;
        const scale = 0.08 + swirl.t * 1.04;
        this.letterContainer.setPosition(x, y).setScale(scale).setAngle(0);
      },
      onComplete: () => this.tweens.add({ targets: this.letterContainer, scale: 1.11, duration: 135, yoyo: true, ease: "Back.Out" }),
    });
    createConfetti(this);
    createSparkles(this);
    this.time.delayedCall(120, () => this.audioSystem.playLetter(letter));
    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: [this.letterContainer, this.glow], alpha: 0, scale: 1.25, y: BASE_HEIGHT / 2 - 40, duration: 360,
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
