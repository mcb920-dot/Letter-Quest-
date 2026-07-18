import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";
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
    this.createNeonLighting();
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
    this.theme = SaveSystem.getTheme();
    this.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, `${this.theme}-background`)
      .setDisplaySize(BASE_WIDTH, BASE_HEIGHT);
    const polish = this.add.graphics();
    polish.fillGradientStyle(0xffffff, 0xffffff, 0x174b6f, 0x174b6f, 0.035);
    polish.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  }

  createNeonLighting() {
    const glow = this.add.graphics().setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
    glow.lineStyle(8, 0x35ddff, 0.3);
    glow.lineBetween(35, 300, 35, 850);
    glow.lineBetween(BASE_WIDTH - 35, 300, BASE_WIDTH - 35, 850);
    glow.lineStyle(3, 0xff4f9a, 0.48);
    glow.lineBetween(48, 320, 48, 780);
    glow.lineBetween(BASE_WIDTH - 48, 320, BASE_WIDTH - 48, 780);
    glow.lineStyle(5, 0xffd84f, 0.3);
    glow.strokeRoundedRect(127, 205, 286, 82, 14);
    glow.fillStyle(0x35ddff, 0.08);
    glow.fillEllipse(BASE_WIDTH / 2, 690, 410, 270);
    this.tweens.add({ targets: glow, alpha: 0.58, duration: 1250, yoyo: true, repeat: -1, ease: "Sine.InOut" });

    for (let index = 0; index < 8; index += 1) {
      const color = index % 2 === 0 ? 0x35ddff : 0xff5ca8;
      const light = this.add.circle(index % 2 === 0 ? 44 : BASE_WIDTH - 44, 330 + index * 65, 3, color, 0.8)
        .setDepth(5).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: light, alpha: 0.22, scale: 1.8, duration: 650 + index * 75,
        yoyo: true, repeat: -1, ease: "Sine.InOut",
      });
    }
  }

  createAtmosphere() {
    for (let index = 0; index < 18; index += 1) {
      const particle = this.add.circle(
        Phaser.Math.Between(45, BASE_WIDTH - 45),
        Phaser.Math.Between(115, 620),
        Phaser.Math.FloatBetween(1.2, 3.2),
        index % 3 === 0 ? 0xffd95a : 0xffffff,
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
    vignette.fillStyle(0x173b67, 0.07);
    vignette.fillRect(0, 0, 20, BASE_HEIGHT);
    vignette.fillRect(BASE_WIDTH - 20, 0, 20, BASE_HEIGHT);
    vignette.fillRect(0, 0, BASE_WIDTH, 12);
  }

  createHUD() {
    this.add.image(BASE_WIDTH / 2, 120, "basketballLettersLogo").setDisplaySize(390, 195).setDepth(3);
    ["LETTER", "LEARN", "STARS"].forEach((label, index) => {
      this.add.text(140 + index * 130, 218, label, {
        fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "12px", fontStyle: "bold", color: "#eef7ff",
      }).setOrigin(0.5);
    });
    this.letterHud = this.add.text(140, 259, "A", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "28px", fontStyle: "bold", color: "#ff5148",
    }).setOrigin(0.5);
    this.add.text(270, 259, "ABC", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "22px", fontStyle: "bold", color: "#ffd43b",
    }).setOrigin(0.5);
    this.coinText = this.add.text(400, 259, `⭐ ${this.coins}`, {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "21px", fontStyle: "bold", color: "#ffffff",
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
      this.audioSystem.stopMusic();
      SaveSystem.resetGameProgress();
      this.coins = 0;
      this.scene.start("MenuScene");
    });
  }

  createHoop() {
    const centerX = BASE_WIDTH / 2;
    this.add.image(centerX, 430, "softGlow").setDisplaySize(360, 300).setTint(0x5fcfff).setAlpha(0.14).setDepth(2);
    this.backboard = this.add.image(centerX, 385, `${this.theme}-backboard`).setDisplaySize(300, 300).setDepth(10);
    this.rearRim = this.add.image(centerX, 475, `${this.theme}-rim-back`).setDisplaySize(180, 180).setDepth(16);
    this.net = this.add.image(centerX, 520, `${this.theme}-net-rest`).setDisplaySize(180, 180).setDepth(22);
    this.frontRim = this.add.image(centerX, 475, `${this.theme}-rim-front`).setDisplaySize(180, 180).setDepth(26);
  }

  setNetState(state = "rest") {
    this.net.setTexture(`${this.theme}-net-${state}`);
  }

  getNetShape(state = "rest") {
    const states = {
      rest: { topWidth: 50, upperWidth: 38, waistWidth: 27, bottomWidth: 23, bottom: 558 },
      open: { topWidth: 53, upperWidth: 43, waistWidth: 31, bottomWidth: 23, bottom: 563 },
      expanded: { topWidth: 54, upperWidth: 47, waistWidth: 36, bottomWidth: 24, bottom: 570 },
      stretch: { topWidth: 53, upperWidth: 45, waistWidth: 33, bottomWidth: 19, bottom: 582 },
      narrow: { topWidth: 51, upperWidth: 39, waistWidth: 25, bottomWidth: 16, bottom: 571 },
      snap: { topWidth: 50, upperWidth: 35, waistWidth: 22, bottomWidth: 25, bottom: 549 },
    };
    return { ...(states[state] || states.rest) };
  }

  drawNetState(state = "rest") {
    this.netShape = this.getNetShape(state);
    this.drawNetShape(this.netShape);
  }

  drawNetShape(shape) {
    this.net.clear();
    const top = 479;
    const widthAt = (t) => {
      let width;
      if (t < 0.3) width = Phaser.Math.Linear(shape.topWidth, shape.upperWidth, t / 0.3);
      else if (t < 0.67) width = Phaser.Math.Linear(shape.upperWidth, shape.waistWidth, (t - 0.3) / 0.37);
      else width = Phaser.Math.Linear(shape.waistWidth, shape.bottomWidth, (t - 0.67) / 0.33);
      return width;
    };
    this.net.lineStyle(3.2, 0x8b8f96, 0.45);
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
        const leftX = Phaser.Math.Linear(BASE_WIDTH / 2 - width2, BASE_WIDTH / 2 + width2, leftRatio);
        const rightX = Phaser.Math.Linear(BASE_WIDTH / 2 - width2, BASE_WIDTH / 2 + width2, rightRatio);
        this.net.lineBetween(x1 + 1.2, y1 + 1.2, leftX + 1.2, y2 + 1.2);
        this.net.lineBetween(x1 + 1.2, y1 + 1.2, rightX + 1.2, y2 + 1.2);
      }
    }
    this.net.lineStyle(2.2, 0xf7f1e8, 0.98);
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
    this.net.lineStyle(2, 0xe9edf1, 0.88);
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
    this.ballShadow = this.add.ellipse(BASE_WIDTH / 2, 844, 142, 34, 0x000000, 0.3).setDepth(15);
    this.ball = this.add.container(BASE_WIDTH / 2, 770).setDepth(24);
    this.ballSphere = this.add.image(0, 0, "premiumBasketball").setDisplaySize(138, 138);
    this.ballLetter = this.add.text(0, 2, "A", {
      fontFamily: "Arial Rounded MT Bold, Arial", fontSize: "46px", fontStyle: "bold",
      color: "#ffffff", stroke: "#7a2b17", strokeThickness: 6,
    }).setOrigin(0.5);
    this.ball.add([this.ballSphere, this.ballLetter]);
    this.spinFrame = 0;
    this.spinElapsed = 0;
    this.ball.setSize(138, 138).setInteractive({ useHandCursor: true });
    this.ball.on("pointerdown", () => this.shoot());
  }

  advanceBallSpin(speed = 1) {
    this.spinElapsed += this.game.loop.delta * speed;
    if (this.spinElapsed < 96) return;
    const steps = Math.max(1, Math.floor(this.spinElapsed / 96));
    this.spinElapsed %= 96;
    this.spinFrame -= steps;
    this.ballSphere.setAngle(this.spinFrame * 7);
  }

  prepareRound() {
    this.locked = false;
    const letter = this.progression.getCurrentLetter();
    const index = this.progression.getCurrentIndex();
    const colors = ["#ff6b7a", "#4dabf7", "#ffd43b", "#69db7c", "#b197fc", "#ff922b", "#38d9a9", "#f06595"];
    this.ballLetter.setText(letter);
    this.letterHud.setText(letter);
    setBubbleLetter(this, letter, colors[index % colors.length]);
    this.letterContainer.setAlpha(0).setScale(0.08).setAngle(0);
    this.ball.setPosition(BASE_WIDTH / 2, 770).setScale(1).setAlpha(1).setDepth(24);
    this.spinFrame = 0;
    this.spinElapsed = 0;
    this.ballSphere.setAngle(0);
    this.ballLetter.setAngle(0);
    this.ballShadow.setPosition(BASE_WIDTH / 2, 844).setScale(1).setAlpha(0.3);
    this.setNetState("rest");
    this.audioSystem.preloadLetters(letter, this.progression.getNextLetter());
    this.message.setText(`Tap the ${letter} ball!`);
  }

  shoot() {
    if (this.locked) return;
    this.locked = true;
    const letter = this.progression.getCurrentLetter();
    this.audioSystem.playEffect("tap");
    this.message.setText("Here it goes!");
    this.ball.setDepth(30);
    this.tweens.add({ targets: this.ballShadow, scaleX: 0.28, scaleY: 0.28, alpha: 0.035, duration: 750, ease: "Sine.Out" });
    this.animateShotArc(letter);
  }

  animateShotArc(letter) {
    const start = { x: this.ball.x, y: this.ball.y, scale: this.ball.scaleX };
    const control = { x: BASE_WIDTH / 2 + 82, y: 90 };
    const rim = { x: BASE_WIDTH / 2, y: 471, scale: 0.7 };
    const driver = { progress: 0 };

    this.tweens.add({
      targets: driver,
      progress: 1,
      duration: 710,
      ease: "Linear",
      onUpdate: () => {
        const t = driver.progress;
        const inverse = 1 - t;
        this.ball.setPosition(
          inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * rim.x,
          inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * rim.y,
        );
        this.ball.setScale(Phaser.Math.Linear(start.scale, rim.scale, t));
        this.advanceBallSpin(0.82);
      },
      onComplete: () => {
        // The ball has approached in front of the board and rim. It now crosses
        // downward through the rim, behind its front lip and the reacting net.
        this.ball.setPosition(rim.x, rim.y).setScale(rim.scale).setDepth(20);
        this.setNetState("open");
        this.swish(letter);
      },
    });
  }

  swish(letter) {
    this.setNetState("stretch");
    // This is the exact downward rim crossing.
    this.message.setText("SWISH!");
    this.audioSystem.playEffect("swish");
    this.cameras.main.shake(65, 0.0014);
    this.tweens.add({
      targets: this.ball, y: 570, scale: 0.48, duration: 185, ease: "Quad.In",
      onUpdate: () => {
        this.ball.x = BASE_WIDTH / 2;
        this.advanceBallSpin(0.72);
      },
      onComplete: () => {
        // Bring it in front of the net again once it has cleared the net opening,
        // keeping the ball visible briefly beneath the basket.
        this.ball.setDepth(24);
        this.tweens.add({
          targets: this.ball, y: 625, scale: 0.5, duration: 190, ease: "Quad.In",
          onUpdate: () => {
            this.ball.x = BASE_WIDTH / 2;
            this.advanceBallSpin(0.55);
          },
          onComplete: () => {
            this.tweens.add({
              targets: this.ball, y: 682, scale: 0.52, duration: 225, ease: "Quad.In",
              onUpdate: () => this.advanceBallSpin(0.3),
              onComplete: () => {
                this.setNetState("snap");
                this.time.delayedCall(150, () => this.setNetState("rest"));
                this.tweens.add({
                  targets: this.ball, y: 720, alpha: 0, duration: 150, ease: "Quad.In",
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
